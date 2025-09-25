import { format } from 'date-fns';
import { Sun, Cloud, CloudRain, Snowflake } from 'lucide-react';

interface ForecastDay {
  date: string;
  maxTemp: number;
  minTemp: number;
  condition: string;
  pop?: number;
}

interface ForecastCardProps {
  forecast: ForecastDay[];
}

export default function ForecastCard({ forecast }: ForecastCardProps) {
  
  const getWeatherIcon = (condition: string) => {
    const lower = condition.toLowerCase();
    if (lower.includes('rain') || lower.includes('drizzle')) return <CloudRain className="w-8 h-8 text-blue-400" />;
    if (lower.includes('snow') || lower.includes('blizzard')) return <Snowflake className="w-8 h-8 text-blue-200" />;
    // Clear sky -> brighter yellow sun
    if (lower.includes('clear')) return <Sun className="w-8 h-8 text-yellow-500" />;
    // Any cloud type -> blue cloud icon
    if (lower.includes('cloud')) return <Cloud className="w-8 h-8 text-blue-500" />;
    return <Sun className="w-8 h-8 text-yellow-300" />;
  };

  const getRowClasses = (condition: string) => {
    const lower = condition.toLowerCase();
    if (lower.includes('rain') || lower.includes('drizzle')) return 'bg-blue-50 hover:bg-blue-100';
    if (lower.includes('snow') || lower.includes('blizzard')) return 'bg-blue-50 hover:bg-blue-100';
    if (lower.includes('clear')) return 'bg-yellow-50 hover:bg-yellow-100';
    // Any cloud type -> blue tinted row
    if (lower.includes('cloud')) return 'bg-blue-50 hover:bg-blue-100';
    return 'bg-white hover:bg-gray-50';
  };

  const formatDate = (dateStr: string, index: number) => {
    const date = new Date(dateStr);
    if (index === 0) return 'Today';
    if (index === 1) return 'Tomorrow';
    return format(date, 'EEE'); // Mon, Tue, etc.
  };

  return (
    <div className="bg-[#C2D7F4] rounded-xl shadow-lg p-6 w-full max-w-4xl mx-auto">
      <h3 className="text-xl font-bold text-gray-800 mb-4">7-Day Forecast</h3>
      
      <div className="space-y-3">
        {forecast.map((day, index) => {
          const isRain = day.condition.toLowerCase().includes('rain');
          const rainPct = typeof day.pop === 'number' ? Math.round(day.pop * 100) : null;
          return (
            <div key={day.date} className={`flex items-center justify-between p-3 rounded-lg transition-colors ${getRowClasses(day.condition)}`}>
              
              {/* Day */}
              <div className="flex-1 text-left">
                <span className="font-medium text-gray-800">
                  {formatDate(day.date, index)}
                </span>
              </div>
              
              {/* Weather Icon */}
              <div className="flex-1 flex justify-center">
                {getWeatherIcon(day.condition)}
              </div>
              
              {/* Condition */}
              <div className="flex-1 text-center">
                <span className="text-sm text-gray-600 capitalize">
                  {day.condition}
                </span>
                {isRain && rainPct !== null && (
                  <div className="text-xs text-blue-700 mt-1">Rain: {rainPct}%</div>
                )}
              </div>
              
              {/* Temperature Range */}
              <div className="flex-1 text-right">
                <span className="font-semibold text-gray-800">
                  {Math.round(day.maxTemp)}°
                </span>
                <span className="text-gray-500 ml-1">
                  {Math.round(day.minTemp)}°
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

