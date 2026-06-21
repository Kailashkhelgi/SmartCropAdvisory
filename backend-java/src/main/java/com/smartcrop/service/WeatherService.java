package com.smartcrop.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartcrop.config.AppProperties;
import com.smartcrop.exception.AppException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class WeatherService {

    private final StringRedisTemplate redis;
    private final AppProperties appProperties;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    // In-memory fallback cache when Redis is unavailable
    private static final Map<String, String> LOCAL_CACHE = new ConcurrentHashMap<>();

    @SuppressWarnings("unchecked")
    public Map<String, Object> getWeather(double lat, double lon) {
        String cacheKey = "weather:" + lat + ":" + lon;

        // Try Redis cache first
        try {
            String cached = redis.opsForValue().get(cacheKey);
            if (cached != null) {
                return objectMapper.readValue(cached, Map.class);
            }
        } catch (Exception e) {
            log.warn("Redis unavailable, using in-memory cache");
            // Try in-memory cache
            String localCached = LOCAL_CACHE.get(cacheKey);
            if (localCached != null) {
                try { return objectMapper.readValue(localCached, Map.class); }
                catch (Exception ignored) {}
            }
        }

        // Fetch from OpenWeatherMap
        String apiKey = appProperties.getWeather().getApiKey();
        if (apiKey == null || apiKey.equals("dev_key")) {
            throw new AppException("WEATHER_API_KEY_MISSING",
                "OpenWeatherMap API key is not configured. Please add OPENWEATHERMAP_API_KEY.",
                org.springframework.http.HttpStatus.SERVICE_UNAVAILABLE);
        }

        try {
            String url = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat
                + "&lon=" + lon + "&appid=" + apiKey + "&units=metric&cnt=40";
            Map<String, Object> data = restTemplate.getForObject(url, Map.class);
            String json = objectMapper.writeValueAsString(data);

            // Cache in Redis if available, else in-memory
            try {
                redis.opsForValue().set(cacheKey, json, Duration.ofHours(3));
            } catch (Exception e) {
                LOCAL_CACHE.put(cacheKey, json);
            }
            return data;
        } catch (AppException ae) {
            throw ae;
        } catch (Exception e) {
            log.error("Weather API error: {}", e.getMessage());
            throw AppException.serviceUnavailable("WEATHER_UNAVAILABLE",
                "Weather service is currently unavailable: " + e.getMessage());
        }
    }
}
