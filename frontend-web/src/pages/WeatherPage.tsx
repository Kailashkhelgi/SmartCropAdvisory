import React, { useState, useEffect } from 'react';
import { weatherApi, soilApi } from '../api/client';

interface WeatherPageProps {
  lat?: number;
  lon?: number;
}

interface ForecastItem {
  dt: number;
  main: { temp: number; feels_like: number; humidity: number; pressure: number };
  weather: { description: string; icon: string; main: string }[];
  wind: { speed: number };
  dt_txt: string;
  pop?: number;
}

const weatherIcon = (main: string) => {
  const m = main?.toLowerCase();
  if (m?.includes('rain')) return '🌧️';
  if (m?.includes('drizzle')) return '🌦️';
  if (m?.includes('thunder')) return '⛈️';
  if (m?.includes('snow')) return '❄️';
  if (m?.includes('cloud')) return '☁️';
  if (m?.includes('mist') || m?.includes('fog')) return '🌫️';
  return '☀️';
};

const WeatherPage: React.FC<WeatherPageProps> = () => {
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);
  const [locationName, setLocationName] = useState('');
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState('');
  const [manualMode, setManualMode] = useState(false);
  const [manualLat, setManualLat] = useState('');
  const [manualLon, setManualLon] = useState('');
  const [soilProfiles, setSoilProfiles] = useState<any[]>([]);
  const [selectedPlotId, setSelectedPlotId] = useState('');
  const [loadingProfiles, setLoadingProfiles] = useState(true);

  const detectAndFetch = () => {
    if (!navigator.geolocation) { 
      setError('Geolocation not supported by your browser. Please use manual entry below.');
      setManualMode(true);
      return;
    }
    setLocating(true);
    setError('');
    
    // Show user-friendly message about permission
    console.log('🎯 Requesting location access...');
    
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const la = pos.coords.latitude;
        const lo = pos.coords.longitude;
        setLat(la); setLon(lo);
        setLocating(false);
        // Reverse geocode
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${la}&lon=${lo}&format=json`);
          const d = await res.json();
          const a = d.address;
          setLocationName([a.village || a.town || a.city, a.state].filter(Boolean).join(', '));
        } catch { setLocationName(`${la.toFixed(4)}, ${lo.toFixed(4)}`); }
        fetchWeather(la, lo);
      },
      (err) => { 
        setLocating(false); 
        if (err.code === 1) {
          setError('❌ Location access was blocked. To use auto-detect:\n1. Click the 🔒 lock icon in your browser address bar\n2. Set "Location" to "Allow"\n3. Click "Auto Detect" again\n\nOr use Manual Entry below.');
        } else if (err.code === 2) {
          setError('📡 Location unavailable. Your device may not have GPS. Please use Manual Entry below.');
        } else {
          setError('⏱️ Location timeout. Please check your internet connection or use Manual Entry below.');
        }
        setManualMode(true);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  // Load soil profiles in background and try browser Geolocation (live location) first on mount
  useEffect(() => {
    // 1. Load soil profiles in background
    setLoadingProfiles(true);
    soilApi.list?.()
      .then((res: any) => {
        const d = res.data?.data ?? res.data?.profiles ?? res.data;
        const profiles = Array.isArray(d) ? d : [];
        setSoilProfiles(profiles);
      })
      .catch(() => {
        setSoilProfiles([]);
      })
      .finally(() => setLoadingProfiles(false));

    // 2. Try browser geolocation first for live location
    if (navigator.geolocation) {
      setLocating(true);
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const la = pos.coords.latitude;
          const lo = pos.coords.longitude;
          setLat(la); setLon(lo);
          setLocating(false);
          setSelectedPlotId('custom');
          // Reverse geocode
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${la}&lon=${lo}&format=json`);
            const d = await res.json();
            const a = d.address;
            setLocationName([a.village || a.town || a.city, a.state].filter(Boolean).join(', '));
          } catch { setLocationName(`${la.toFixed(4)}, ${lo.toFixed(4)}`); }
          fetchWeather(la, lo);
        },
        (err) => {
          // Geolocation failed/blocked - fall back to registered soil profile if available
          setLocating(false);
          soilApi.list?.()
            .then((res: any) => {
              const d = res.data?.data ?? res.data?.profiles ?? res.data;
              const profiles = Array.isArray(d) ? d : [];
              if (profiles.length > 0) {
                const first = profiles[0];
                setSelectedPlotId(first.id);
                setLat(first.latitude);
                setLon(first.longitude);
                setLocationName(first.plotName || 'Your Field');
                fetchWeather(first.latitude, first.longitude);
              } else {
                setManualMode(true);
                if (err.code === 1) {
                  setError('❌ Location access was blocked. To use auto-detect:\n1. Click the 🔒 lock icon in your browser address bar\n2. Set "Location" to "Allow"\n3. Click "Auto Detect" again\n\nOr use Manual Entry below.');
                } else if (err.code === 2) {
                  setError('📡 Location unavailable. Your device may not have GPS. Please use Manual Entry below.');
                } else {
                  setError('⏱️ Location timeout. Please check your internet connection or use Manual Entry below.');
                }
              }
            })
            .catch(() => {
              setManualMode(true);
              setError('Unable to detect location. Please enter coordinates manually.');
            });
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 } // Fail fast in 5 seconds to load fallback
      );
    } else {
      // Geolocation not supported - load fallback directly
      soilApi.list?.()
        .then((res: any) => {
          const d = res.data?.data ?? res.data?.profiles ?? res.data;
          const profiles = Array.isArray(d) ? d : [];
          if (profiles.length > 0) {
            const first = profiles[0];
            setSelectedPlotId(first.id);
            setLat(first.latitude);
            setLon(first.longitude);
            setLocationName(first.plotName || 'Your Field');
            fetchWeather(first.latitude, first.longitude);
          } else {
            setManualMode(true);
            setError('Geolocation not supported by browser. Enter coordinates manually.');
          }
        })
        .catch(() => {
          setManualMode(true);
        });
    }
  }, []);

  const handleManualSubmit = () => {
    const la = parseFloat(manualLat);
    const lo = parseFloat(manualLon);
    if (isNaN(la) || isNaN(lo) || la < -90 || la > 90 || lo < -180 || lo > 180) {
      setError('Please enter valid coordinates (Lat: -90 to 90, Lon: -180 to 180)');
      return;
    }
    setLat(la);
    setLon(lo);
    setLocationName(`${la.toFixed(4)}, ${lo.toFixed(4)}`);
    setManualMode(false);
    fetchWeather(la, lo);
  };

  const fetchWeather = (la: number, lo: number) => {
    setLoading(true);
    setError('');
    weatherApi.get(la, lo)
      .then(res => {
        const data = res.data?.data ?? res.data;
        const list: ForecastItem[] = data?.list ?? [];
        setForecast(list);
      })
      .catch(err => {
        const msg = err?.response?.data?.error?.message
          ?? err?.response?.data?.message
          ?? 'Failed to load weather data.';
        setError(msg);
      })
      .finally(() => setLoading(false));
  };

  // Group forecast by day
  const byDay: Record<string, ForecastItem[]> = {};
  forecast.forEach(item => {
    const day = item.dt_txt.split(' ')[0];
    if (!byDay[day]) byDay[day] = [];
    byDay[day].push(item);
  });

  const days = Object.entries(byDay).slice(0, 5);
  const current = forecast[0];

  // Farming alerts with severity and timing
  const alerts: { icon: string; msg: string; color: string; severity: string; timing: string }[] = [];
  
  // Check next 48 hours (16 intervals of 3 hours each) for better predictions
  forecast.slice(0, 16).forEach((item, index) => {
    const main = item.weather[0]?.main ?? '';
    const desc = item.weather[0]?.description ?? '';
    const temp = item.main.temp;
    const humidity = item.main.humidity;
    const windSpeed = item.wind.speed;
    const rainProb = (item.pop ?? 0) * 100;
    const hoursAhead = index * 3;
    const timing = hoursAhead === 0 ? 'Now' : 
                   hoursAhead <= 3 ? 'Next 3h' :
                   hoursAhead <= 6 ? 'Next 6h' : 
                   hoursAhead <= 12 ? 'Next 12h' : 
                   hoursAhead <= 24 ? 'Next 24h' : 
                   hoursAhead <= 36 ? 'Next 36h' : 'Next 48h';

    // 1. Frost / Extreme Cold (Critical)
    if (temp <= 2) {
      alerts.push({ 
        icon: '❄️', 
        msg: `Extreme cold / Frost risk (${Math.round(temp)}°C) — High risk of crop damage. Apply light evening irrigation to raise soil temperature. Use frost covers or windbreaks for sensitive crops.`, 
        color: '#b71c1c', 
        severity: 'CRITICAL',
        timing 
      });
    }

    // 2. Thunderstorm alerts (Critical)
    if (main.toLowerCase().includes('thunder') || main.toLowerCase().includes('storm')) {
      alerts.push({ 
        icon: '⚠️', 
        msg: `Thunderstorm expected — Stop all field operations immediately. Seek shelter. Risk of lightning and crop damage.`, 
        color: '#b71c1c', 
        severity: 'CRITICAL',
        timing 
      });
    }

    // 3. Rain alerts (High / Medium / Low)
    const isHeavyRain = rainProb > 70 || (main.toLowerCase().includes('rain') && (desc.toLowerCase().includes('heavy') || desc.toLowerCase().includes('extreme') || desc.toLowerCase().includes('shower')));
    const isModerateRain = !isHeavyRain && (rainProb > 30 || (main.toLowerCase().includes('rain') && desc.toLowerCase().includes('moderate')));
    const isLightRain = !isHeavyRain && !isModerateRain && (rainProb > 10 || main.toLowerCase().includes('drizzle') || (main.toLowerCase().includes('rain') && desc.toLowerCase().includes('light')));

    if (isHeavyRain) {
      alerts.push({ 
        icon: '🌧️', 
        msg: `Heavy rain expected (${desc}) — Delay irrigation, harvesting, and spraying. Ensure proper drainage in fields to prevent waterlogging.`, 
        color: '#0d47a1', 
        severity: 'HIGH',
        timing 
      });
    } else if (isModerateRain) {
      alerts.push({ 
        icon: '🌦️', 
        msg: `Moderate rain possible — Plan indoor activities. Avoid applying solid fertilizers or spraying pesticides as they may wash away.`, 
        color: '#1565c0', 
        severity: 'MEDIUM',
        timing 
      });
    } else if (isLightRain) {
      alerts.push({ 
        icon: '💧', 
        msg: `Light rain possible (${desc}) — Monitor weather updates. Clear sky windows might be short, plan accordingly.`, 
        color: '#1976d2', 
        severity: 'LOW',
        timing 
      });
    }

    // 4. Wind alerts (High / Medium)
    if (windSpeed > 15) {
      alerts.push({ 
        icon: '🌪️', 
        msg: `Severe gale force winds (${windSpeed.toFixed(1)} m/s) — High risk of lodging for tall crops (sugarcane, maize). Secure polyhouse sheets and suspend all high-altitude work.`, 
        color: '#b71c1c', 
        severity: 'HIGH',
        timing 
      });
    } else if (windSpeed > 10 && windSpeed <= 15) {
      alerts.push({ 
        icon: '💨', 
        msg: `Strong winds (${windSpeed.toFixed(1)} m/s) — Avoid spraying pesticides/herbicides. Risk of crop lodging and uneven spray drift.`, 
        color: '#e65100', 
        severity: 'HIGH',
        timing 
      });
    } else if (windSpeed > 5 && windSpeed <= 10) {
      alerts.push({ 
        icon: '🌬️', 
        msg: `Windy conditions (${windSpeed.toFixed(1)} m/s) — Delay precision activities like spraying. Secure light field equipment.`, 
        color: '#f57c00', 
        severity: 'MEDIUM',
        timing 
      });
    }

    // 5. Temperature alerts (High / Medium)
    if (temp > 40) {
      alerts.push({ 
        icon: '🌡️', 
        msg: `Extreme heat (${Math.round(temp)}°C) — Avoid midday field work. Increase irrigation frequency. Monitor for heat stress in crops.`, 
        color: '#d84315', 
        severity: 'HIGH',
        timing 
      });
    } else if (temp > 32 && temp <= 40) {
      alerts.push({ 
        icon: '☀️', 
        msg: `High temperature (${Math.round(temp)}°C) — Work during cooler hours (early morning/evening). Ensure adequate crop moisture.`, 
        color: '#f57c00', 
        severity: 'MEDIUM',
        timing 
      });
    } else if (temp > 2 && temp < 10) {
      alerts.push({ 
        icon: '🥶', 
        msg: `Cold conditions (${Math.round(temp)}°C) — Risk of frost damage. Protect sensitive crops. Delay planting tender varieties.`, 
        color: '#1565c0', 
        severity: 'MEDIUM',
        timing 
      });
    }

    // 6. Fog/Mist/Cloudy alerts (Low)
    if (main.toLowerCase().includes('mist') || main.toLowerCase().includes('fog')) {
      alerts.push({ 
        icon: '🌫️', 
        msg: `Foggy/Misty conditions — Reduced visibility. Delay spraying operations. Monitor closely for fungal diseases due to leaf wetness.`, 
        color: '#616161', 
        severity: 'LOW',
        timing 
      });
    }

    // 7. Cloudy weather info
    if (main.toLowerCase().includes('cloud') && !main.toLowerCase().includes('rain')) {
      alerts.push({ 
        icon: '☁️', 
        msg: `Cloudy weather (${desc}) — Good conditions for transplanting and weeding. Lower risk of heat stress. Watch for potential rain.`, 
        color: '#78909c', 
        severity: 'INFO',
        timing 
      });
    }

    // 8. Disease Risk alerts (Medium)
    if (humidity > 80 && temp > 20 && temp < 35) {
      alerts.push({ 
        icon: '🦠', 
        msg: `Warm humid conditions (humidity ${humidity}%, temp ${Math.round(temp)}°C) — High risk of fungal diseases (e.g. blight, blast). Monitor crops closely and prepare organic/chemical fungicides.`, 
        color: '#6a1b9a', 
        severity: 'MEDIUM',
        timing 
      });
    } else if (humidity > 85 && temp >= 10 && temp <= 20) {
      alerts.push({ 
        icon: '🦠', 
        msg: `Cool humid conditions (humidity ${humidity}%, temp ${Math.round(temp)}°C) — Condensation risk. High probability of downy/powdery mildew. Ensure proper field spacing.`, 
        color: '#6a1b9a', 
        severity: 'MEDIUM',
        timing 
      });
    }

    // 9. Evapotranspiration / Water Stress alerts (Medium)
    if (humidity < 30 && temp > 30 && windSpeed > 4) {
      alerts.push({ 
        icon: '🍂', 
        msg: `Dry warm winds (humidity ${humidity}%, wind ${windSpeed.toFixed(1)} m/s) — High evapotranspiration rate. Rapid soil moisture depletion. Increase irrigation volume.`, 
        color: '#f57c00', 
        severity: 'MEDIUM',
        timing 
      });
    }

    // 10. Cold Wet Soil alerts (Medium)
    if (temp < 15 && isHeavyRain) {
      alerts.push({ 
        icon: '🍄', 
        msg: `Cold wet soil (temp ${Math.round(temp)}°C with heavy rain) — Favorable conditions for root rot and damping-off fungi. Avoid sowing new seeds; ensure fields drain quickly.`, 
        color: '#1565c0', 
        severity: 'MEDIUM',
        timing 
      });
    }

    // 11. Ideal Spraying Conditions (Info)
    if (main.toLowerCase().includes('clear') && humidity < 70 && windSpeed < 5 && rainProb < 20) {
      alerts.push({ 
        icon: '✅', 
        msg: `Ideal conditions for spraying — Clear sky, low wind (${windSpeed.toFixed(1)} m/s), humidity ${humidity}%. Good time for pesticide or foliar fertilizer application.`, 
        color: '#2e7d32', 
        severity: 'INFO',
        timing 
      });
    }

    // 12. General weather info - what's happening
    if (index < 8) { // Only for next 24 hours
      const weatherDesc = main.toLowerCase();
      if (weatherDesc === 'clear') {
        alerts.push({ 
          icon: '🌤️', 
          msg: `Clear skies ahead — Perfect for field work, harvesting, and spraying operations. Make the most of this weather window.`, 
          color: '#2e7d32', 
          severity: 'INFO',
          timing 
        });
      }
    }
  });

  // Remove duplicates and prioritize by severity
  const severityOrder: Record<string, number> = { 'CRITICAL': 1, 'HIGH': 2, 'MEDIUM': 3, 'LOW': 4, 'INFO': 5 };
  const uniqueAlerts = alerts
    .filter((a, i, arr) => arr.findIndex(x => x.msg === a.msg) === i)
    .sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])
    .slice(0, 8); // Show top 8 most important alerts

  return (
    <div>
      <h1 className="page-title">🌤️ Weather Alerts</h1>

      {/* Location Detect */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        {soilProfiles.length > 0 && (
          <div style={{ marginBottom: '1.25rem', borderBottom: '1px solid #eee', paddingBottom: '1.25rem' }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.9rem', color: '#555', fontWeight: 600 }}>
              Select Registered Field Location:
            </label>
            <select
              value={selectedPlotId}
              onChange={e => {
                const val = e.target.value;
                setSelectedPlotId(val);
                if (val === 'custom') {
                  setManualMode(true);
                } else {
                  const selected = soilProfiles.find(p => p.id === val);
                  if (selected) {
                    setLat(selected.latitude);
                    setLon(selected.longitude);
                    setLocationName(selected.plotName || 'Your Field');
                    fetchWeather(selected.latitude, selected.longitude);
                    setManualMode(false);
                  }
                }
              }}
              style={{ width: '100%', maxWidth: 400, padding: '8px 12px', borderRadius: 6, border: '1px solid #ccc', fontSize: '1rem' }}
            >
              {soilProfiles.map(p => (
                <option key={p.id} value={p.id}>
                  {p.plotName} ({p.latitude.toFixed(4)}, {p.longitude.toFixed(4)})
                </option>
              ))}
              <option value="custom">-- Custom Coordinates --</option>
            </select>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0, color: 'var(--green-dark)', fontSize: '1.1rem' }}>
              {locationName ? `📍 ${locationName}` : '📍 Your Field Location'}
            </h3>
            {lat && lon && (
              <div style={{ marginTop: '8px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>
                  <strong>Coordinates:</strong> {lat.toFixed(4)}, {lon.toFixed(4)}
                </p>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#666', fontStyle: 'italic' }}>
                  💡 {selectedPlotId && selectedPlotId !== 'custom' ? 'Using registered plot coordinates' : 'Using detected/manual coordinates'}
                </p>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={() => { setSelectedPlotId('custom'); detectAndFetch(); }} disabled={locating || loading}
              style={{ padding: '8px 20px' }}>
              {locating ? '⏳ Detecting…' : loading ? '⏳ Loading…' : '🎯 Auto Detect'}
            </button>
            <button 
              className="btn-secondary" 
              onClick={() => { setManualMode(!manualMode); setSelectedPlotId('custom'); }}
              style={{ padding: '8px 20px', background: '#f5f5f5', color: '#333', border: '1px solid #ddd' }}>
              📍 Manual Entry
            </button>
          </div>
        </div>



        {/* Manual Coordinate Input */}
        {manualMode && (
          <div style={{ marginTop: '1rem', padding: '1.25rem', background: '#f9f9f9', borderRadius: 8, border: '1px solid #e0e0e0' }}>
            <div style={{ marginBottom: '1rem', padding: '12px', background: '#e3f2fd', borderRadius: 6, borderLeft: '3px solid #1565c0' }}>
              <p style={{ margin: '0 0 8px', fontSize: '0.95rem', color: '#1565c0', fontWeight: 600 }}>
                📍 Enter Your Location Coordinates
              </p>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#666', lineHeight: 1.5 }}>
                <strong>Popular Indian Cities:</strong><br/>
                • New Delhi: <code>28.6139, 77.2090</code><br/>
                • Mumbai: <code>19.0760, 72.8777</code><br/>
                • Bangalore: <code>12.9716, 77.5946</code><br/>
                • Chennai: <code>13.0827, 80.2707</code><br/>
                • Kolkata: <code>22.5726, 88.3639</code>
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.75rem', alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 4, color: '#555', fontWeight: 500 }}>Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  placeholder="28.6139"
                  value={manualLat}
                  onChange={(e) => setManualLat(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: 4, fontSize: '0.95rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 4, color: '#555', fontWeight: 500 }}>Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  placeholder="77.2090"
                  value={manualLon}
                  onChange={(e) => setManualLon(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: 4, fontSize: '0.95rem' }}
                />
              </div>
              <button 
                className="btn-primary" 
                onClick={handleManualSubmit}
                disabled={loading}
                style={{ padding: '10px 24px', height: 'fit-content' }}>
                🌤️ Get Weather
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div style={{ 
          padding: '16px 20px', 
          background: '#fff3cd', 
          border: '1px solid #ffc107', 
          borderRadius: 8, 
          marginBottom: '1.5rem',
          borderLeft: '4px solid #ff6f00'
        }}>
          <p style={{ 
            margin: 0, 
            color: '#c62828', 
            whiteSpace: 'pre-line',
            lineHeight: 1.6
          }}>{error}</p>
          {error.includes('API key') && (
            <p style={{ margin: '12px 0 0', fontSize: '0.85rem', color: '#555' }}>
              💡 <strong>For developers:</strong> Add your OpenWeatherMap API key in environment variables as <code>OPENWEATHERMAP_API_KEY</code>.
              Get a free key at <a href="https://openweathermap.org/api" target="_blank" rel="noreferrer" style={{ color: '#1565c0' }}>openweathermap.org</a>
            </p>
          )}
        </div>
      )}

      {/* Current Weather */}
      {current && (
        <div className="card" style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, #1565c0 0%, #2e7d32 100%)', color: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '4rem', lineHeight: 1 }}>{weatherIcon(current.weather[0]?.main)}</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, marginTop: 8 }}>{Math.round(current.main.temp)}°C</div>
              <div style={{ fontSize: '1rem', opacity: 0.9, textTransform: 'capitalize' }}>{current.weather[0]?.description}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {[
                { label: 'Feels Like', val: `${Math.round(current.main.feels_like)}°C` },
                { label: 'Humidity', val: `${current.main.humidity}%` },
                { label: 'Wind', val: `${current.wind.speed.toFixed(1)} m/s` },
                { label: 'Pressure', val: `${current.main.pressure} hPa` },
              ].map(({ label, val }) => (
                <div key={label} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '8px 12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>{label}</div>
                  <div style={{ fontWeight: 700, fontSize: '1rem' }}>{val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Farming Alerts */}
      {uniqueAlerts.length > 0 && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '0.75rem', color: 'var(--green-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            ⚠️ Weather Forecast & Farming Alerts
            <span style={{ fontSize: '0.75rem', fontWeight: 'normal', color: '#666' }}>
              (Next 48 hours)
            </span>
          </h3>
          {uniqueAlerts.map((a, i) => {
            const severityBadgeColor = a.severity === 'CRITICAL' ? '#b71c1c' 
              : a.severity === 'HIGH' ? '#d84315' 
              : a.severity === 'MEDIUM' ? '#f57c00'
              : a.severity === 'LOW' ? '#616161'
              : '#2e7d32';
            
            return (
              <div key={i} style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: '0.75rem', 
                padding: '12px 16px', 
                background: a.severity === 'CRITICAL' ? '#ffebee' : a.severity === 'INFO' ? '#e8f5e9' : '#fff3cd', 
                borderRadius: 8, 
                marginBottom: 10, 
                borderLeft: `4px solid ${a.color}`,
                boxShadow: a.severity === 'CRITICAL' ? '0 2px 8px rgba(183, 28, 28, 0.2)' : 'none'
              }}>
                <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{a.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 4 }}>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      fontWeight: 700, 
                      color: '#fff',
                      background: severityBadgeColor,
                      padding: '2px 8px',
                      borderRadius: 12,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {a.severity}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#666', fontWeight: 600 }}>
                      {a.timing}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.9rem', color: a.color, fontWeight: 500, lineHeight: 1.5 }}>
                    {a.msg}
                  </span>
                </div>
              </div>
            );
          })}
          <div style={{ marginTop: '1rem', padding: '10px 14px', background: '#e3f2fd', borderRadius: 6, fontSize: '0.85rem', color: '#1565c0' }}>
            💡 <strong>Tip:</strong> Check this page regularly for updated weather warnings. Plan your farming activities based on these alerts to protect your crops and optimize yields.
          </div>
        </div>
      )}

      {/* 5-Day Forecast */}
      {days.length > 0 && (
        <div className="card">
          <h3 style={{ marginBottom: '1rem', color: 'var(--green-dark)' }}>📅 5-Day Forecast</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
            {days.map(([day, items]) => {
              const noon = items.find(i => i.dt_txt.includes('12:00')) ?? items[0];
              const maxT = Math.max(...items.map(i => i.main.temp));
              const minT = Math.min(...items.map(i => i.main.temp));
              const date = new Date(day);
              const dayName = date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
              return (
                <div key={day} style={{ background: '#f1f8e9', borderRadius: 10, padding: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: 6 }}>{dayName}</div>
                  <div style={{ fontSize: '2rem' }}>{weatherIcon(noon.weather[0]?.main)}</div>
                  <div style={{ fontSize: '0.8rem', textTransform: 'capitalize', color: '#555', margin: '4px 0' }}>
                    {noon.weather[0]?.description}
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--green-dark)' }}>
                    {Math.round(maxT)}° / {Math.round(minT)}°
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#888', marginTop: 4 }}>
                    💧 {noon.main.humidity}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!loading && !error && forecast.length === 0 && (
        <div className="card" style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
          <p style={{ fontSize: '1.1rem' }}>Click "Detect & Get Weather" to see weather for your field location.</p>
        </div>
      )}
    </div>
  );
};

export default WeatherPage;
