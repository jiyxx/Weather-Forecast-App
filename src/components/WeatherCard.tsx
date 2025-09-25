import { Wind, Eye, Droplets, MapPin } from 'lucide-react';
import DateDisplay from './DateDisplay';
import { Sun, Cloud, CloudRain, Snowflake, CloudLightning } from 'lucide-react';

interface WeatherCardProps {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  city: string;
  country: string;
}

export default function WeatherCard({
  temperature,
  condition,
  humidity,
  windSpeed,
  visibility,
  city,
  country
}: WeatherCardProps) {
  
  // Function to get appropriate weather icon
  const getWeatherIcon = (condition: string) => {
    const lower = condition.toLowerCase();
    if (lower.includes('thunder')) return <CloudLightning className="w-16 h-16 text-yellow-200" />;
    if (lower.includes('rain') || lower.includes('drizzle')) return <CloudRain className="w-16 h-16 text-blue-300" />;
    if (lower.includes('snow') || lower.includes('blizzard')) return <Snowflake className="w-16 h-16 text-blue-100" />;
    if (lower.includes('cloud') || lower.includes('overcast')) return <Cloud className="w-16 h-16 text-blue-500" />;
    return <Sun className="w-16 h-16 text-yellow-300" />;
  };

  return (
    <div className="bg-[#C2D7F4] rounded-xl shadow-lg p-6 h-full">
      {/* Header */}
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2 mb-1">
          <MapPin className="w-5 h-5 text-gray-600" />
          <h2 className="text-2xl font-bold text-gray-800">{city}, {country}</h2>
        </div>
        <DateDisplay />
      </div>
      
      {/* Main Weather Display */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex flex-col items-center">
          {getWeatherIcon(condition)}
          <div className="text-4xl font-bold text-gray-800 mt-2">
            {Math.round(temperature)}°C
          </div>
          <div className="text-lg text-gray-600 capitalize">
            {condition}
          </div>
        </div>
      </div>
      
      {/* Weather Details */}
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
          <Droplets className="w-5 h-5 text-blue-500 mb-1" />
          <span className="text-gray-600">Humidity</span>
          <span className="font-semibold text-gray-900">{humidity}%</span>
        </div>
        
        <div className="flex flex-col items-center p-3 bg-green-50 rounded-lg">
          <Wind className="w-5 h-5 text-green-500 mb-1" />
          <span className="text-gray-600">Wind</span>
          <span className="font-semibold text-gray-900">{windSpeed} km/h</span>
        </div>
        
        <div className="flex flex-col items-center p-3 bg-purple-50 rounded-lg">
          <Eye className="w-5 h-5 text-purple-500 mb-1" />
          <span className="text-gray-600">Visibility</span>
          <span className="font-semibold text-gray-900">{visibility} km</span>
        </div>
      </div>
    </div>
  );
}
