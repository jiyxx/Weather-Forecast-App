
function clampToRange(n: number, min: number, max: number) {
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
}

function classifyAQI(aqiRaw: number) {
  const aqi = Math.round(clampToRange(aqiRaw, 0, 500));
  if (aqi <= 50) {
    return { band: 'Good', panel: 'bg-green-50 text-green-900 border-green-200', bar: 'bg-green-500', dot: 'bg-green-600', advice: 'Air quality is satisfactory. Enjoy outdoor activities.' };
  } else if (aqi <= 100) {
    return { band: 'Moderate', panel: 'bg-yellow-50 text-yellow-900 border-yellow-200', bar: 'bg-yellow-500', dot: 'bg-yellow-600', advice: 'Acceptable air quality. Sensitive groups should limit prolonged outdoor exertion.' };
  } else if (aqi <= 150) {
    return { band: 'Unhealthy for Sensitive Groups', panel: 'bg-orange-50 text-orange-900 border-orange-200', bar: 'bg-orange-500', dot: 'bg-orange-600', advice: 'Sensitive people may experience effects. Consider shorter or less intense outdoor activities.' };
  } else if (aqi <= 200) {
    return { band: 'Unhealthy', panel: 'bg-red-50 text-red-900 border-red-200', bar: 'bg-red-500', dot: 'bg-red-600', advice: 'Everyone may begin to experience health effects. Reduce strenuous outdoor activity.' };
  } else if (aqi <= 300) {
    return { band: 'Very Unhealthy', panel: 'bg-purple-50 text-purple-900 border-purple-200', bar: 'bg-purple-500', dot: 'bg-purple-600', advice: 'Health alert: everyone may experience more serious effects. Avoid outdoor activity if possible.' };
  }
  return { band: 'Hazardous', panel: 'bg-rose-50 text-rose-900 border-rose-200', bar: 'bg-rose-600', dot: 'bg-rose-700', advice: 'Emergency conditions. Stay indoors, use air purification, and wear a mask if you must go outside.' };
}

export default function AQICard({ aqi, location }: { aqi: number; location: string }) {
  const info = classifyAQI(aqi);
  const percent = clampToRange((aqi / 500) * 100, 0, 100);

  return (
    <div className={`rounded-xl p-6 shadow border ${info.panel} h-full transition-colors duration-300 text-center`}>
      <h3 className="text-xl font-semibold mb-3">Air Quality Index</h3>

      <div className="flex flex-col items-center gap-1 mb-1">
        <div className="text-4xl font-extrabold leading-none">{Math.round(aqi)}</div>
        <div className="text-sm font-medium opacity-80">{info.band}</div>
      </div>
      <div className="text-sm mb-4 opacity-80">{location}</div>

      {/* Dynamic progress bar 0-500 */}
      <div className="mb-4">
        <div className="w-full h-2 bg-white/60 rounded-full overflow-hidden">
          <div className={`${info.bar} h-2 transition-all duration-500`} style={{ width: `${percent}%` }} />
        </div>
        <div className="flex justify-between text-[10px] mt-1 opacity-70">
          <span>0</span>
          <span>100</span>
          <span>200</span>
          <span>300</span>
          <span>400</span>
          <span>500</span>
        </div>
      </div>

      {/* Health advice */}
      <div className={`text-sm rounded-lg border px-3 py-2 flex items-center justify-center gap-2 bg-white/50`}>
        <div className={`mt-1 w-2 h-2 rounded-full ${info.dot}`} />
        <p className="leading-snug text-center">{info.advice}</p>
      </div>
    </div>
  );
}

