package com.smartcrop.service;

import com.smartcrop.config.AppProperties;
import com.smartcrop.exception.AppException;
import com.smartcrop.model.SoilProfile;
import com.smartcrop.repository.SoilProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AdvisoryService {

    private final SoilProfileRepository soilProfileRepository;
    private final AppProperties appProperties;
    private final RestTemplate restTemplate;

    @SuppressWarnings("unchecked")
    public Object getCropRecommendations(UUID farmerId, UUID plotId) {
        SoilProfile profile = soilProfileRepository.findByIdAndFarmerId(plotId, farmerId)
            .orElseThrow(() -> AppException.notFound("Soil profile not found"));

        if (profile.getPh() == null || profile.getNitrogen() == null
                || profile.getPhosphorus() == null || profile.getPotassium() == null
                || profile.getSoilType() == null) {
            throw new AppException("INCOMPLETE_SOIL_PROFILE",
                "Soil profile is missing required fields. Please complete ph, nitrogen, phosphorus, potassium, and soil type.",
                HttpStatus.BAD_REQUEST);
        }

        // Try external advisory engine first
        try {
            Map<String, Object> body = new HashMap<>();
            Map<String, Object> soilMap = new HashMap<>();
            soilMap.put("type", profile.getSoilType());
            soilMap.put("ph", profile.getPh());
            soilMap.put("n", profile.getNitrogen());
            soilMap.put("p", profile.getPhosphorus());
            soilMap.put("k", profile.getPotassium());
            body.put("soil_profile", soilMap);
            body.put("location", Map.of(
                "lat", profile.getLatitude() != null ? profile.getLatitude() : 0,
                "lon", profile.getLongitude() != null ? profile.getLongitude() : 0
            ));
            body.put("season", "kharif");
            body.put("crop_history", List.of());

            Object result = restTemplate.postForObject(
                appProperties.getAdvisoryEngineUrl() + "/internal/advisory/crops",
                body, Map.class);
            if (result != null) return result;
        } catch (Exception ignored) {
            // Fall through to built-in engine
        }

        // Built-in rule-based crop recommendation
        return builtInCropRecommendations(profile);
    }

    @SuppressWarnings("unchecked")
    public Object getFertilizerGuidance(UUID farmerId, UUID plotId, String cropId) {
        SoilProfile profile = soilProfileRepository.findByIdAndFarmerId(plotId, farmerId)
            .orElseThrow(() -> new AppException("NO_SOIL_PROFILE",
                "No soil profile found. Please create a soil profile first.",
                HttpStatus.BAD_REQUEST));

        try {
            Map<String, Object> body = new HashMap<>();
            Map<String, Object> soilMap = new HashMap<>();
            soilMap.put("type", profile.getSoilType() != null ? profile.getSoilType() : "loamy");
            soilMap.put("ph", profile.getPh() != null ? profile.getPh() : 6.5);
            soilMap.put("n", profile.getNitrogen() != null ? profile.getNitrogen() : 0);
            soilMap.put("p", profile.getPhosphorus() != null ? profile.getPhosphorus() : 0);
            soilMap.put("k", profile.getPotassium() != null ? profile.getPotassium() : 0);
            body.put("soil_profile", soilMap);
            body.put("crop", cropId);

            Object result = restTemplate.postForObject(
                appProperties.getAdvisoryEngineUrl() + "/internal/advisory/fertilizer",
                body, Map.class);
            if (result != null) return result;
        } catch (Exception ignored) {
            // Fall through to built-in engine
        }

        return builtInFertilizerGuidance(profile, cropId);
    }

    // ── Built-in rule-based engine ────────────────────────────────────────────

    private List<Map<String, Object>> builtInCropRecommendations(SoilProfile p) {
        double ph = p.getPh() != null ? p.getPh().doubleValue() : 6.5;
        double n  = p.getNitrogen() != null ? p.getNitrogen().doubleValue() : 0;
        double pp = p.getPhosphorus() != null ? p.getPhosphorus().doubleValue() : 0;
        double k  = p.getPotassium() != null ? p.getPotassium().doubleValue() : 0;
        String soil = p.getSoilType() != null ? p.getSoilType().toLowerCase() : "loamy";

        // Score each crop based on soil parameters
        List<CropScore> scores = new ArrayList<>();

        // Wheat: pH 6-7.5, moderate N, loamy/clay
        scores.add(new CropScore("Wheat",
            score(ph, 6.0, 7.5) + score(n, 40, 120) + soilMatch(soil, "loamy", "clay", "alluvial"),
            "15-25 quintals/acre", "Medium (450-600mm)", "₹8,000-12,000/acre"));

        // Rice: pH 5.5-7, high N, clay/loamy
        scores.add(new CropScore("Rice",
            score(ph, 5.5, 7.0) + score(n, 60, 150) + soilMatch(soil, "clay", "loamy", "alluvial"),
            "18-28 quintals/acre", "High (1200-1800mm)", "₹10,000-15,000/acre"));

        // Maize: pH 5.8-7.5, high N+P, loamy/sandy loam
        scores.add(new CropScore("Maize",
            score(ph, 5.8, 7.5) + score(n, 50, 130) + score(pp, 20, 60) + soilMatch(soil, "loamy", "sandy", "alluvial"),
            "20-30 quintals/acre", "Medium (500-700mm)", "₹7,000-11,000/acre"));

        // Soybean: pH 6-7, moderate N+P+K, loamy
        scores.add(new CropScore("Soybean",
            score(ph, 6.0, 7.0) + score(n, 30, 80) + score(pp, 15, 50) + soilMatch(soil, "loamy", "clay"),
            "8-14 quintals/acre", "Medium (450-700mm)", "₹6,000-9,000/acre"));

        // Cotton: pH 6-8, high K, black/clay
        scores.add(new CropScore("Cotton",
            score(ph, 6.0, 8.0) + score(k, 40, 120) + soilMatch(soil, "black", "clay", "loamy"),
            "6-12 quintals/acre", "Medium (500-800mm)", "₹12,000-18,000/acre"));

        // Sugarcane: pH 6-7.5, high N+K, loamy/alluvial
        scores.add(new CropScore("Sugarcane",
            score(ph, 6.0, 7.5) + score(n, 80, 200) + score(k, 50, 150) + soilMatch(soil, "loamy", "alluvial", "clay"),
            "250-400 quintals/acre", "High (1500-2500mm)", "₹20,000-30,000/acre"));

        // Groundnut: pH 6-7, moderate P+K, sandy loam
        scores.add(new CropScore("Groundnut",
            score(ph, 6.0, 7.0) + score(pp, 20, 60) + score(k, 30, 80) + soilMatch(soil, "sandy", "loamy"),
            "6-10 quintals/acre", "Low-Medium (400-600mm)", "₹8,000-12,000/acre"));

        // Tomato: pH 6-7, high N+P, loamy
        scores.add(new CropScore("Tomato",
            score(ph, 6.0, 7.0) + score(n, 60, 120) + score(pp, 30, 80) + soilMatch(soil, "loamy", "sandy"),
            "80-150 quintals/acre", "Medium (600-1200mm)", "₹15,000-25,000/acre"));

        // Onion: pH 6-7.5, moderate N+K, loamy
        scores.add(new CropScore("Onion",
            score(ph, 6.0, 7.5) + score(n, 40, 100) + score(k, 40, 100) + soilMatch(soil, "loamy", "sandy"),
            "80-120 quintals/acre", "Medium (350-550mm)", "₹12,000-18,000/acre"));

        // Mustard: pH 6-7.5, moderate N, loamy/sandy
        scores.add(new CropScore("Mustard",
            score(ph, 6.0, 7.5) + score(n, 30, 80) + soilMatch(soil, "loamy", "sandy", "alluvial"),
            "6-10 quintals/acre", "Low (250-400mm)", "₹5,000-8,000/acre"));

        scores.sort((a, b) -> Double.compare(b.score, a.score));

        List<Map<String, Object>> result = new ArrayList<>();
        for (int i = 0; i < Math.min(5, scores.size()); i++) {
            CropScore cs = scores.get(i);
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("rank", i + 1);
            m.put("cropName", cs.name);
            m.put("expectedYieldRange", cs.yield);
            m.put("waterRequirement", cs.water);
            m.put("estimatedInputCost", cs.cost);
            m.put("suitabilityScore", Math.round(cs.score * 10.0) / 10.0);
            result.add(m);
        }
        return result;
    }

    private Map<String, Object> builtInFertilizerGuidance(SoilProfile p, String cropId) {
        double n = p.getNitrogen() != null ? p.getNitrogen().doubleValue() : 0;
        double pp = p.getPhosphorus() != null ? p.getPhosphorus().doubleValue() : 0;
        double k = p.getPotassium() != null ? p.getPotassium().doubleValue() : 0;

        // Recommended levels for most crops
        double recN = 80, recP = 40, recK = 40;

        double urea = Math.max(0, (recN - n) * 2.17);   // 1kg N = 2.17kg Urea
        double dap  = Math.max(0, (recP - pp) * 5.43);  // 1kg P = 5.43kg DAP
        double mop  = Math.max(0, (recK - k) * 1.67);   // 1kg K = 1.67kg MOP

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("crop", cropId);
        result.put("recommendations", List.of(
            Map.of("fertilizer", "Urea (46% N)", "quantity", String.format("%.1f kg/acre", urea),
                   "timing", "Split: 50% at sowing, 25% at 30 days, 25% at 60 days"),
            Map.of("fertilizer", "DAP (18-46-0)", "quantity", String.format("%.1f kg/acre", dap),
                   "timing", "Full dose at sowing as basal"),
            Map.of("fertilizer", "MOP (0-0-60)", "quantity", String.format("%.1f kg/acre", mop),
                   "timing", "Full dose at sowing as basal")
        ));
        result.put("soilHealth", Map.of(
            "nitrogenStatus", n < 40 ? "Low — needs supplementation" : n < 80 ? "Medium" : "Adequate",
            "phosphorusStatus", pp < 20 ? "Low — needs supplementation" : pp < 40 ? "Medium" : "Adequate",
            "potassiumStatus", k < 20 ? "Low — needs supplementation" : k < 40 ? "Medium" : "Adequate"
        ));
        return result;
    }

    private double score(double val, double min, double max) {
        if (val >= min && val <= max) return 3.0;
        double dist = val < min ? min - val : val - max;
        return Math.max(0, 3.0 - dist / 20.0);
    }

    private double soilMatch(String soil, String... types) {
        for (String t : types) {
            if (soil.contains(t)) return 2.0;
        }
        return 0.5;
    }

    private static class CropScore {
        String name, yield, water, cost;
        double score;
        CropScore(String name, double score, String yield, String water, String cost) {
            this.name = name; this.score = score;
            this.yield = yield; this.water = water; this.cost = cost;
        }
    }
}
