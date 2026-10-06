const axios = require('axios');

// Clearly-labelled fallback data used only when the real API key is missing
// or the request to OpenWeather fails. This keeps the dashboard/weather page
// functional during a demo even without internet access or a configured key.
const DEMO_WEATHER_DATA = {
  isDemoData: true,
  location: process.env.WEATHER_CITY || 'Chennai',
  temperature: 29,
  feelsLike: 32,
  humidity: 68,
  cloudCover: 35,
  windSpeed: 3.6,
  condition: 'Clear',
  description: 'clear sky',
};

// Simple, clearly-labelled rules for whether tonight is good for observation.
// This is NOT a scientific forecast model - just a basic heuristic for the demo.
const calculateSuitability = ({ cloudCover, condition, windSpeed }) => {
  const stormyConditions = ['Thunderstorm', 'Rain', 'Drizzle', 'Snow'];
  const isStormy = stormyConditions.includes(condition);

  if (isStormy || cloudCover > 70 || windSpeed > 12) {
    return {
      level: 'Unfavorable',
      reason: isStormy
        ? `${condition} conditions make observation unsafe/ineffective`
        : cloudCover > 70
        ? 'Cloud cover is too high for clear observation'
        : 'Wind speed is too high for stable equipment operation',
    };
  }

  if (cloudCover >= 40) {
    return {
      level: 'Moderate',
      reason: 'Partial cloud cover may affect visibility',
    };
  }

  return {
    level: 'Suitable',
    reason: 'Clear skies and calm wind - good conditions for observation',
  };
};

// Fetches current weather for the configured city from OpenWeather.
// Falls back to demo data (never throws) so the rest of the app keeps working.
const getWeatherData = async () => {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const city = process.env.WEATHER_CITY || 'Chennai';

  if (!apiKey || apiKey === 'your_api_key_here') {
    return {
      ...DEMO_WEATHER_DATA,
      suitability: calculateSuitability(DEMO_WEATHER_DATA),
      note: 'DEMO DATA - set OPENWEATHER_API_KEY in server/.env for live weather',
    };
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&units=metric&appid=${apiKey}`;

    const { data } = await axios.get(url, { timeout: 8000 });

    const weather = {
      isDemoData: false,
      location: data.name || city,
      temperature: Math.round(data.main?.temp),
      feelsLike: Math.round(data.main?.feels_like),
      humidity: data.main?.humidity,
      cloudCover: data.clouds?.all ?? 0,
      windSpeed: data.wind?.speed ?? 0,
      condition: data.weather?.[0]?.main || 'Unknown',
      description: data.weather?.[0]?.description || '',
    };

    return {
      ...weather,
      suitability: calculateSuitability(weather),
    };
  } catch (error) {
    console.error('OpenWeather API request failed:', error.message);
    return {
      ...DEMO_WEATHER_DATA,
      suitability: calculateSuitability(DEMO_WEATHER_DATA),
      note: 'DEMO DATA - live weather request failed, showing fallback data',
      error: 'Weather data is currently unavailable.',
    };
  }
};

module.exports = { getWeatherData, calculateSuitability };
