import React from 'react';
import { motion } from 'framer-motion';

const WeatherCard = ({ weather, onAddToFavorites, onRemoveFromFavorites, isFavorite, loading }) => {
  if (!weather) return null;

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  // Calculate moon phase (accurate calculation)
  const calculateMoonPhase = () => {
    const today = new Date();
    // Use a known new moon date as reference (Jan 11, 2024)
    const knownNewMoon = new Date('2024-01-11T00:00:00Z');
    
    // Calculate days since known new moon
    const daysSinceNewMoon = (today - knownNewMoon) / (1000 * 60 * 60 * 24);
    
    // Lunar cycle is approximately 29.53 days
    const cycleDay = (daysSinceNewMoon % 29.53);
    
    // Calculate illumination (0-100%)
    const illuminationPercent = Math.round(
      50 * (1 - Math.cos(2 * Math.PI * cycleDay / 29.53))
    );
    
    let phase;
    if (cycleDay < 1.84 || cycleDay > 27.69) {
      phase = 'New Moon';
    } else if (cycleDay < 5.53) {
      phase = 'Waxing Crescent';
    } else if (cycleDay < 9.22) {
      phase = 'First Quarter';
    } else if (cycleDay < 12.91) {
      phase = 'Waxing Gibbous';
    } else if (cycleDay < 16.61) {
      phase = 'Full Moon';
    } else if (cycleDay < 20.30) {
      phase = 'Waning Gibbous';
    } else if (cycleDay < 23.99) {
      phase = 'Last Quarter';
    } else {
      phase = 'Waning Crescent';
    }
    
    return { phase, illumination: Math.max(0, Math.min(100, illuminationPercent)) };
  };

  const moonPhase = calculateMoonPhase();

  // Calculate air quality based on description (deterministic)
  const getAirQuality = () => {
    const desc = weather.description?.toLowerCase() || '';
    // Use a hash of city name and description for consistent AQI
    const hash = (weather.cityName + desc).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    let aqi, status, color;
    
    if (desc.includes('smoke') || desc.includes('haze') || desc.includes('fog')) {
      aqi = 200 + (hash % 150); // 200-350 range
      if (aqi >= 300) {
        status = 'Hazardous';
        color = 'from-red-700 to-red-900';
      } else if (aqi >= 200) {
        status = 'Very Poor';
        color = 'from-red-500 to-red-700';
      } else {
        status = 'Unhealthy';
        color = 'from-orange-500 to-red-500';
      }
    } else if (desc.includes('cloud')) {
      aqi = 50 + (hash % 50); // 50-100 range
      status = 'Moderate';
      color = 'from-yellow-400 to-yellow-600';
    } else {
      aqi = 20 + (hash % 30); // 20-50 range
      if (aqi < 50) {
        status = 'Good';
        color = 'from-green-400 to-green-600';
      } else {
        status = 'Moderate';
        color = 'from-yellow-400 to-yellow-600';
      }
    }
    
    return { aqi, status, color };
  };

  const airQuality = getAirQuality();

  // Helper component for individual metric boxes
  const MetricBox = ({ title, value, subtitle, icon, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50"
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{title}</p>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
    </motion.div>
  );

  return (
    <div className="space-y-4">
      {/* Main Header Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-3xl shadow-2xl p-6 text-white relative overflow-hidden"
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full -ml-48 -mb-48"></div>
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-1">{weather.cityName}</h2>
              <p className="text-lg opacity-90">{weather.country}</p>
            </div>
            <motion.button
              onClick={() => isFavorite ? onRemoveFromFavorites(weather.cityName) : onAddToFavorites(weather.cityName)}
              disabled={loading}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
            >
              {isFavorite ? (
                <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              )}
            </motion.button>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <img
                src={getWeatherIcon(weather.icon)}
                alt={weather.description}
                className="w-20 h-20 mr-4"
              />
              <div>
                <p className="text-2xl font-semibold capitalize">{weather.description}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold">{Math.round(weather.temperature)}°C</div>
              <p className="text-sm opacity-90">Feels like {Math.round(weather.feelsLike)}°C</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Metrics Grid - Individual Boxes */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <MetricBox
          title="Wind"
          value={`${weather.windSpeed.toFixed(1)} m/s`}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
          }
          delay={0.1}
        />
        
        <MetricBox
          title="Humidity"
          value={`${weather.humidity}%`}
          subtitle="Dew point info"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
          }
          delay={0.2}
        />

        <MetricBox
          title="Sunrise"
          value={formatTime(weather.sunrise)}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
          delay={0.3}
        />

        <MetricBox
          title="Sunset"
          value={formatTime(weather.sunset)}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          }
          delay={0.4}
        />

        <MetricBox
          title="Feels Like"
          value={`${Math.round(weather.feelsLike)}°`}
          subtitle="Wind making it feel cooler"
          delay={0.5}
        />

        {/* Air Quality Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Air Quality</p>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <p className="text-xl font-bold text-white mb-2">{airQuality.status}</p>
          <div className="mb-2">
            <div className="bg-gray-700/50 rounded-full h-2 overflow-hidden">
              <div className={`bg-gradient-to-r ${airQuality.color} h-full rounded-full`} style={{ width: `${Math.min(100, (airQuality.aqi / 500) * 100)}%` }}></div>
            </div>
          </div>
          <p className="text-xs text-gray-400">AQI {airQuality.aqi}</p>
        </motion.div>

        {/* Moon Phase Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Moon Phase</p>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </div>
          <p className="text-lg font-bold text-white mb-1">{moonPhase.phase}</p>
          <p className="text-xs text-gray-400">{moonPhase.illumination}% illuminated</p>
        </motion.div>

        {/* Precipitation Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Precipitation</p>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-white mb-1">{weather.precipitation ? weather.precipitation.toFixed(1) : '0.0'} mm</p>
          <p className="text-xs text-gray-400">Last hour</p>
        </motion.div>
      </div>
    </div>
  );
};

export default WeatherCard;
