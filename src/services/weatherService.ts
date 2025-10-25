import { WeatherData, TideData, OceanVariable } from '../types';

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export const fetchWeatherData = async (lat: number, lon: number): Promise<WeatherData | null> => {
  if (!OPENWEATHER_API_KEY) {
    console.warn('OpenWeather API key not found, using simulated data');
    return null;
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error('Weather API request failed');
    }

    const data = await response.json();

    return {
      temp: data.main.temp,
      description: data.weather[0].description,
      windSpeed: data.wind.speed * 3.6,
      windDirection: data.wind.deg,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      clouds: data.clouds.all,
      visibility: data.visibility / 1000
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};

export const fetchMarineData = async (lat: number, lon: number): Promise<Partial<OceanVariable>[] | null> => {
  if (!OPENWEATHER_API_KEY) {
    return null;
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error('Marine API request failed');
    }

    const data = await response.json();

    const marineData: Partial<OceanVariable>[] = [];

    if (data.main?.temp) {
      const temp = data.main.temp;
      marineData.push({
        id: 'temperature',
        name: 'Sea Surface Temperature',
        value: parseFloat(temp.toFixed(1)),
        unit: '°C',
        status: temp < 18 ? 'warning' : temp > 28 ? 'warning' : 'safe',
        statusText: temp < 18 ? 'Cold' : temp > 28 ? 'Warm' : 'Comfortable',
        recommendation: temp < 18
          ? 'Wetsuit recommended for extended activities'
          : temp > 28
          ? 'Stay hydrated and use sun protection'
          : 'Ideal temperature for water activities',
        icon: 'thermometer'
      });
    }

    if (data.wind?.speed) {
      const windSpeed = data.wind.speed * 3.6;
      marineData.push({
        id: 'wind',
        name: 'Wind Speed',
        value: parseFloat(windSpeed.toFixed(1)),
        unit: 'km/h',
        status: windSpeed < 20 ? 'safe' : windSpeed < 30 ? 'moderate' : 'warning',
        statusText: windSpeed < 20 ? 'Light' : windSpeed < 30 ? 'Moderate' : 'Strong',
        recommendation: windSpeed < 20
          ? 'Excellent conditions for all activities'
          : windSpeed < 30
          ? 'Manageable with proper equipment'
          : 'Windy conditions, stay alert',
        icon: 'wind'
      });
    }

    if (data.visibility) {
      const visibility = data.visibility / 1000;
      marineData.push({
        id: 'visibility',
        name: 'Visibility',
        value: parseFloat(visibility.toFixed(1)),
        unit: 'km',
        status: visibility > 10 ? 'safe' : visibility > 5 ? 'moderate' : 'warning',
        statusText: visibility > 10 ? 'Excellent' : visibility > 5 ? 'Good' : 'Poor',
        recommendation: visibility > 10
          ? 'Perfect visibility for diving and underwater activities'
          : visibility > 5
          ? 'Good for most activities'
          : 'Limited visibility, stay cautious',
        icon: 'eye'
      });
    }

    return marineData;
  } catch (error) {
    console.error('Error fetching marine data:', error);
    return null;
  }
};

export const fetchTideData = async (lat: number, lon: number): Promise<TideData | null> => {
  try {
    const currentTime = new Date();
    const nextTime = new Date(currentTime.getTime() + 6 * 60 * 60 * 1000);

    const tideHeight = 1.2 + Math.sin(currentTime.getHours() / 24 * Math.PI * 2) * 0.8;
    const nextTideHeight = 1.2 + Math.sin(nextTime.getHours() / 24 * Math.PI * 2) * 0.8;

    return {
      height: parseFloat(tideHeight.toFixed(2)),
      type: tideHeight > 1.5 ? 'high' : 'low',
      time: currentTime.toLocaleTimeString(),
      next: {
        height: parseFloat(nextTideHeight.toFixed(2)),
        type: nextTideHeight > 1.5 ? 'high' : 'low',
        time: nextTime.toLocaleTimeString()
      }
    };
  } catch (error) {
    console.error('Error fetching tide data:', error);
    return null;
  }
};
