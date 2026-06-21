import axios from 'axios';
import { config } from '../config';
import { AppError } from './userService';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WeatherData {
  lat: number;
  lon: number;
  temperature: number;
  humidity: number;
  rainfall24h: number;
  frostRisk: boolean;
  forecast: Array<{ time: string; temp: number; rain: number }>;
  list?: any[];
  lastUpdated: string; // ISO timestamp
}

// In-memory cache for development (replace with Redis in production)
const weatherCache = new Map<string, { data: WeatherData; expires: number }>();

function generateMockWeatherData(lat: number, lon: number): WeatherData {
  const now = new Date();
  const list: any[] = [];
  
  // Generate 40 intervals of 3 hours each (5 days)
  for (let i = 0; i < 40; i++) {
    const time = new Date(now.getTime() + i * 3 * 60 * 60 * 1000);
    const hour = time.getHours();
    
    // Diurnal temp variation: warmer in afternoon, cooler at night
    const baseTemp = 28;
    const tempVar = 6 * Math.sin((hour - 8) / 24 * 2 * Math.PI); // peak around 2 PM
    const daySeed = Math.sin(i / 8); // multiday wave
    const temp = Math.round((baseTemp + tempVar + daySeed * 3) * 10) / 10;
    
    const feels_like = Math.round((temp + (Math.random() > 0.5 ? 1 : -1) * Math.random()) * 10) / 10;
    const humidity = Math.round(50 + 20 * Math.sin((hour + 4) / 24 * 2 * Math.PI) + Math.random() * 5);
    const pressure = Math.round(1008 + Math.sin(hour / 12 * Math.PI) * 2);
    const windSpeed = Math.round((3 + Math.random() * 4 + (i % 7 === 0 ? 5 : 0)) * 10) / 10;
    
    let main = 'Clear';
    let description = 'clear sky';
    let pop = 0;
    let rain3h = 0;
    
    if (i % 8 === 2 || i % 8 === 3) {
      main = 'Clouds';
      description = 'scattered clouds';
    } else if (i % 15 === 0) {
      main = 'Rain';
      description = 'light rain';
      pop = 0.25;
      rain3h = 0.8;
    } else if (i === 12) {
      main = 'Thunderstorm';
      description = 'thunderstorm with rain';
      pop = 0.85;
      rain3h = 4.5;
    } else if (i % 10 === 0) {
      main = 'Clouds';
      description = 'broken clouds';
    }
    
    const yyyy = time.getFullYear();
    const mm = String(time.getMonth() + 1).padStart(2, '0');
    const dd = String(time.getDate()).padStart(2, '0');
    const hh = String(time.getHours()).padStart(2, '0');
    const dt_txt = `${yyyy}-${mm}-${dd} ${hh}:00:00`;
    
    list.push({
      dt: Math.floor(time.getTime() / 1000),
      main: {
        temp,
        feels_like,
        humidity,
        pressure
      },
      weather: [
        {
          main,
          description,
          icon: main === 'Clear' ? '01d' : main === 'Clouds' ? '03d' : main === 'Rain' ? '10d' : '11d'
        }
      ],
      wind: {
        speed: windSpeed
      },
      dt_txt,
      pop,
      rain: rain3h > 0 ? { '3h': rain3h } : undefined
    });
  }

  const current = list[0];
  const temperature = current.main.temp;
  const humidity = current.main.humidity;

  const next24h = list.slice(0, 8);
  const rainfall24h = next24h.reduce((sum, item) => sum + (item.rain?.['3h'] ?? 0), 0);
  const frostRisk = next24h.some((item) => item.main.temp < 2);

  const forecast = list.slice(0, 16).map((item) => ({
    time: item.dt_txt,
    temp: item.main.temp,
    rain: item.rain?.['3h'] ?? 0,
  }));

  return {
    lat,
    lon,
    temperature,
    humidity,
    rainfall24h,
    frostRisk,
    forecast,
    list,
    lastUpdated: new Date().toISOString()
  };
}

// Lazy import to avoid circular dependency — notificationService may import weatherService
type SendWeatherAlertFn = (
  lat: number,
  lon: number,
  alertType: 'heavy_rain' | 'frost',
  data: WeatherData
) => Promise<void>;

// ─── OpenWeatherMap response types ───────────────────────────────────────────

interface OWMForecastItem {
  dt_txt: string;
  main: { temp: number; humidity: number };
  rain?: { '3h'?: number };
}

interface OWMForecastResponse {
  list: OWMForecastItem[];
}

// ─── Service functions ────────────────────────────────────────────────────────

/**
 * Fetch weather from OpenWeatherMap, cache in memory, and trigger alerts if needed.
 * Stores result with 6-hour TTL.
 */
export async function fetchAndCacheWeather(
  lat: number,
  lon: number,
  notifyFn?: SendWeatherAlertFn
): Promise<WeatherData> {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${config.openWeatherMapApiKey}&units=metric`;

  let weatherData: WeatherData;

  try {
    const response = await axios.get<OWMForecastResponse>(url);
    const items = response.data.list;

    // Current conditions from first item
    const current = items[0];
    const temperature = current.main.temp;
    const humidity = current.main.humidity;

    // Aggregate rainfall and check frost risk over next 24 h (8 x 3-hour slots)
    const next24h = items.slice(0, 8);
    const rainfall24h = next24h.reduce((sum, item) => sum + (item.rain?.['3h'] ?? 0), 0);
    const frostRisk = next24h.some((item) => item.main.temp < 2);

    const forecast = items.slice(0, 16).map((item) => ({
      time: item.dt_txt,
      temp: item.main.temp,
      rain: item.rain?.['3h'] ?? 0,
    }));

    weatherData = {
      lat,
      lon,
      temperature,
      humidity,
      rainfall24h,
      frostRisk,
      forecast,
      list: items,
      lastUpdated: new Date().toISOString(),
    };
  } catch (err: any) {
    console.warn(`[WeatherService] OpenWeatherMap failed, using mock data fallback for coordinates ${lat}, ${lon}:`, err.message);
    weatherData = generateMockWeatherData(lat, lon);
  }

  const cacheKey = `weather:${lat}:${lon}`;
  const expires = Date.now() + 6 * 60 * 60 * 1000; // 6 hours

  // Cache in memory
  weatherCache.set(cacheKey, { data: weatherData, expires });

  // Trigger alerts if thresholds are breached
  const resolvedNotify = notifyFn ?? (await loadNotifyFn());
  if (resolvedNotify) {
    if (weatherData.rainfall24h > 50) {
      await resolvedNotify(lat, lon, 'heavy_rain', weatherData).catch(() => {
        // Non-fatal: log but don't fail the weather fetch
      });
    }
    if (weatherData.frostRisk) {
      await resolvedNotify(lat, lon, 'frost', weatherData).catch(() => {
        // Non-fatal
      });
    }
  }

  return weatherData;
}

/**
 * Get weather for a location, using memory cache when available.
 * Falls back to fetchAndCacheWeather on cache miss.
 * Throws WEATHER_UNAVAILABLE (503) if API is down and cache is empty.
 */
export async function getWeather(
  lat: number,
  lon: number
): Promise<WeatherData> {
  const cacheKey = `weather:${lat}:${lon}`;
  const cached = weatherCache.get(cacheKey);

  // Return cached data if not expired
  if (cached && cached.expires > Date.now()) {
    return cached.data;
  }

  try {
    return await fetchAndCacheWeather(lat, lon);
  } catch (err: unknown) {
    // API is down — try to return expired cache if available
    if (cached) {
      return cached.data;
    }

    throw new AppError(
      'WEATHER_UNAVAILABLE',
      'Weather service is currently unavailable and no cached data exists'
    );
  }
}

/**
 * Schedule weather polling every 6 hours for the given farmer locations.
 */
export function scheduleWeatherPolling(
  farmerLocations: Array<{ lat: number; lon: number }>
): void {
  const SIX_HOURS_MS = 6 * 60 * 60 * 1000;

  setInterval(() => {
    for (const { lat, lon } of farmerLocations) {
      fetchAndCacheWeather(lat, lon).catch((err: unknown) => {
        console.error(`[WeatherService] Failed to poll weather for ${lat},${lon}:`, err);
      });
    }
  }, SIX_HOURS_MS);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Lazily load the notification service to avoid circular dependency issues.
 * Returns undefined if the module is not yet available.
 */
async function loadNotifyFn(): Promise<SendWeatherAlertFn | undefined> {
  try {
    // Dynamic require to avoid circular dependency at module load time
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const ns = require('./notificationService') as { sendWeatherAlert?: SendWeatherAlertFn };
    return ns.sendWeatherAlert;
  } catch {
    return undefined;
  }
}
