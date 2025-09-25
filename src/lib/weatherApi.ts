export type Coordinates = { lat: number; lon: number };
export type WeatherData = {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  city: string;
  country: string;
};
export type ForecastDay = {
  date: string; // ISO date
  minTemp: number;
  maxTemp: number;
  condition: string;
  pop?: number; // probability of precipitation 0..1
};
export type AQIData = { aqi: number; location: string };

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

function requireApiKey() {
  if (!API_KEY) throw new Error('Missing NEXT_PUBLIC_WEATHER_API_KEY');
  return API_KEY;
}

async function requestJson(url: string, label: string) {
  const res = await fetch(url);
  if (!res.ok) {
    let details = '';
    try {
      const data = await res.json();
      if (data?.message) details = `: ${data.message}`;
    } catch {
      // ignore parse errors
    }
    if (res.status === 401) {
      throw new Error('Invalid API key. Please verify NEXT_PUBLIC_WEATHER_API_KEY.');
    }
    if (res.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    throw new Error(`${label} failed (${res.status})${details}`);
  }
  return res.json();
}

export async function getCityCoordinates(city: string): Promise<Coordinates & { city: string; country: string }> {
  const key = requireApiKey();
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${key}`;
  const data = await requestJson(url, 'Geocoding');
  if (!Array.isArray(data) || data.length === 0) throw new Error('City not found. Please check the spelling.');
  const { lat, lon, name, country } = data[0];
  return { lat, lon, city: name, country };
}

export async function getCurrentWeather(city: string): Promise<WeatherData> {
  const key = requireApiKey();
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${key}`;
  const data = await requestJson(url, 'Current weather');
  return {
    temperature: data.main.temp,
    condition: data.weather?.[0]?.description || 'N/A',
    humidity: data.main.humidity,
    windSpeed: (data.wind?.speed ?? 0) * 3.6, // km/h
    visibility: (data.visibility ?? 0) / 1000, // km
    city: data.name,
    country: data.sys?.country,
  };
}

async function getWeatherForecastFallback(city: string): Promise<ForecastDay[]> {
  const key = requireApiKey();
  const coords = await getCityCoordinates(city);
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${key}`;
  const data = await requestJson(url, 'Forecast');
  const byDate = new Map<string, { min: number; max: number; counts: Record<string, number>; popSum: number; n: number }>();
  for (const item of data.list || []) {
    const dt = new Date((item.dt ?? 0) * 1000);
    const date = dt.toISOString().slice(0, 10);
    const min = item.main?.temp_min ?? item.main?.temp ?? 0;
    const max = item.main?.temp_max ?? item.main?.temp ?? 0;
    const desc = item.weather?.[0]?.description || 'N/A';
    const pop = typeof item.pop === 'number' ? item.pop : 0;
    const agg = byDate.get(date) || { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY, counts: {}, popSum: 0, n: 0 };
    agg.min = Math.min(agg.min, min);
    agg.max = Math.max(agg.max, max);
    agg.counts[desc] = (agg.counts[desc] || 0) + 1;
    agg.popSum += pop;
    agg.n += 1;
    byDate.set(date, agg);
  }
  const days = Array.from(byDate.keys()).sort().slice(0, 7);
  return days.map((date) => {
    const agg = byDate.get(date)!;
    let topDesc = 'N/A';
    let topCount = -1;
    for (const [desc, count] of Object.entries(agg.counts)) {
      if (count > topCount) {
        topCount = count;
        topDesc = desc;
      }
    }
    return {
      date,
      minTemp: agg.min === Number.POSITIVE_INFINITY ? 0 : agg.min,
      maxTemp: agg.max === Number.NEGATIVE_INFINITY ? 0 : agg.max,
      condition: topDesc,
      pop: agg.n ? agg.popSum / agg.n : undefined,
    };
  });
}

export async function getWeatherForecast(city: string): Promise<ForecastDay[]> {
  const key = requireApiKey();
  // Try One Call daily forecast for up to 7 days
  try {
    const coords = await getCityCoordinates(city);
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lon}&exclude=current,minutely,hourly,alerts&units=metric&appid=${key}`;
    const data = await requestJson(url, 'Daily forecast');
    const result: ForecastDay[] = (data.daily || []).slice(0, 7).map((d: any) => {
      const date = new Date((d.dt ?? 0) * 1000).toISOString().slice(0, 10);
      const minTemp = d.temp?.min ?? 0;
      const maxTemp = d.temp?.max ?? 0;
      const condition = d.weather?.[0]?.description || 'N/A';
      const pop = typeof d.pop === 'number' ? d.pop : undefined; // 0..1
      return { date, minTemp, maxTemp, condition, pop };
    });
    if (result.length) return result;
    // Fall through to fallback if no daily data
  } catch (err) {
    // Fall back if One Call is unavailable for this key/plan
  }
  // Fallback: aggregate 5-day/3h forecast into daily values (up to 5 days typically)
  return getWeatherForecastFallback(city);
}

// Compute US EPA AQI (0-500) from pollutant concentration using breakpoints
function computeAQIFromBreakpoints(C: number, breakpoints: { Clow: number; Chigh: number; Ilow: number; Ihigh: number }[]) {
  for (const bp of breakpoints) {
    if (C >= bp.Clow && C <= bp.Chigh) {
      const { Clow, Chigh, Ilow, Ihigh } = bp;
      // Linear interpolation
      return ((Ihigh - Ilow) / (Chigh - Clow)) * (C - Clow) + Ilow;
    }
  }
  return undefined;
}

function computeUSAQI(components: any): number {
  // Units from OpenWeather: PM2_5, PM10 are µg/m3
  const pm25 = components?.pm2_5;
  const pm10 = components?.pm10;

  // EPA breakpoints
  const pm25BP = [
    { Clow: 0.0, Chigh: 12.0, Ilow: 0, Ihigh: 50 },
    { Clow: 12.1, Chigh: 35.4, Ilow: 51, Ihigh: 100 },
    { Clow: 35.5, Chigh: 55.4, Ilow: 101, Ihigh: 150 },
    { Clow: 55.5, Chigh: 150.4, Ilow: 151, Ihigh: 200 },
    { Clow: 150.5, Chigh: 250.4, Ilow: 201, Ihigh: 300 },
    { Clow: 250.5, Chigh: 350.4, Ilow: 301, Ihigh: 400 },
    { Clow: 350.5, Chigh: 500.4, Ilow: 401, Ihigh: 500 },
  ];
  const pm10BP = [
    { Clow: 0, Chigh: 54, Ilow: 0, Ihigh: 50 },
    { Clow: 55, Chigh: 154, Ilow: 51, Ihigh: 100 },
    { Clow: 155, Chigh: 254, Ilow: 101, Ihigh: 150 },
    { Clow: 255, Chigh: 354, Ilow: 151, Ihigh: 200 },
    { Clow: 355, Chigh: 424, Ilow: 201, Ihigh: 300 },
    { Clow: 425, Chigh: 504, Ilow: 301, Ihigh: 400 },
    { Clow: 505, Chigh: 604, Ilow: 401, Ihigh: 500 },
  ];

  const aqiValues: number[] = [];
  const pm25AQI = Number.isFinite(pm25) ? computeAQIFromBreakpoints(pm25, pm25BP) : undefined;
  if (pm25AQI !== undefined) aqiValues.push(pm25AQI);
  const pm10AQI = Number.isFinite(pm10) ? computeAQIFromBreakpoints(pm10, pm10BP) : undefined;
  if (pm10AQI !== undefined) aqiValues.push(pm10AQI);

  // If we have at least one pollutant AQI, return the max (overall AQI)
  if (aqiValues.length) return Math.round(Math.max(...aqiValues));

  // Fallback: map OpenWeather 1..5 to 0..500 bands if components missing
  const owIndex = components?.ow_aqi_1_to_5;
  if (owIndex >= 1 && owIndex <= 5) {
    const bandCenters = { 1: 25, 2: 75, 3: 125, 4: 175, 5: 250 } as const;
    return bandCenters[owIndex as 1 | 2 | 3 | 4 | 5];
  }

  return 0;
}

export async function getAQI(lat: number, lon: number, location: string): Promise<AQIData> {
  const key = requireApiKey();
  const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${key}`;
  const data = await requestJson(url, 'Air quality');
  const entry = data.list?.[0];
  const components = entry?.components ?? {};
  // Attach original OWI index if needed for fallback mapping
  components.ow_aqi_1_to_5 = entry?.main?.aqi;
  const aqi = computeUSAQI(components); // 0..500
  return { aqi, location };
}

