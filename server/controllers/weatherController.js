const { getWeatherData } = require('../services/weatherService');
const { asyncHandler } = require('../middleware/errorMiddleware');

// @desc    Get current weather + observation suitability for the configured city
// @route   GET /api/weather
// @access  Private
const getWeather = asyncHandler(async (req, res) => {
  // getWeatherData never throws - it always resolves to either live data
  // or clearly-labelled demo data, so this route never 500s on weather issues.
  const weather = await getWeatherData();
  res.json(weather);
});

module.exports = { getWeather };
