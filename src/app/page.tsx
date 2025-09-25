'use client';

import { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import WeatherCard from '@/components/WeatherCard';
import ForecastCard from '@/components/ForecastCard';
import AQICard from '@/components/AQICard';
import { getCurrentWeather, getWeatherForecast, getAQI, getCityCoordinates } from '@/lib/weatherApi';
import type { WeatherData, ForecastDay, AQIData, Coordinates } from '@/lib/weatherApi';

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastDay[]>([]);
  const [aqiData, setAqiData] = useState<AQIData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coords, setCoords] = useState<Coordinates | null>(null);

  const fetchWeatherData = async (city: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const weather = await getCurrentWeather(city);
      setWeatherData(weather);

      const forecast = await getWeatherForecast(city);
      setForecastData(forecast);

      const coordinates = await getCityCoordinates(city);
      setCoords(coordinates);
      const aqi = await getAQI(coordinates.lat, coordinates.lon, `${weather.city}, ${weather.country}`);
      setAqiData(aqi);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch weather data. Please try again.';
      setError(message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData('New Delhi');
  }, []);

  // Real-time AQI refresh every 60s using last known coordinates
  useEffect(() => {
    if (!coords || !weatherData) return;
    const id = setInterval(async () => {
      try {
        const aqi = await getAQI(coords.lat, coords.lon, `${weatherData.city}, ${weatherData.country}`);
        setAqiData(aqi);
      } catch (e) {
        console.error('AQI refresh failed', e);
      }
    }, 60000);
    return () => clearInterval(id);
  }, [coords, weatherData?.city, weatherData?.country]);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Weather Dashboard</h1>
          <p className="text-blue-100">Get weather forecasts and air quality information</p>
        </div>

        <SearchBar onSearch={fetchWeatherData} isLoading={isLoading} />

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 max-w-md mx-auto">
            <p>{error}</p>
          </div>
        )}

        {isLoading && (
          <div className="text-center text-white mb-8">
            <div className="inline-block w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mb-2"></div>
            <p>Loading weather data...</p>
          </div>
        )}

        {weatherData && !isLoading && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
              <WeatherCard
                temperature={weatherData.temperature}
                condition={weatherData.condition}
                humidity={weatherData.humidity}
                windSpeed={weatherData.windSpeed}
                visibility={weatherData.visibility}
                city={weatherData.city}
                country={weatherData.country}
              />
              {aqiData && (
                <AQICard aqi={aqiData.aqi} location={aqiData.location} />
              )}
            </div>

            {forecastData.length > 0 && (
              <ForecastCard forecast={forecastData} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

