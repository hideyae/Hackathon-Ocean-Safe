import { OceanVariable, ActivityType, ActivityCondition, LocationCoordinates } from '../types';
import { fetchWeatherData, fetchMarineData, fetchTideData } from '../services/weatherService';

export const generateOceanData = async (coords?: LocationCoordinates): Promise<OceanVariable[]> => {
  let realData: Partial<OceanVariable>[] | null = null;

  if (coords) {
    realData = await fetchMarineData(coords.latitude, coords.longitude);
  }

  const current = Math.random() * 3;
  const waveHeight = Math.random() * 4;
  const safetyIndex = Math.random() * 100;

  const variables: OceanVariable[] = [];

  if (realData && realData.length > 0) {
    realData.forEach(data => {
      if (data.id && data.name && data.value !== undefined) {
        variables.push(data as OceanVariable);
      }
    });
  }

  const hasTemp = variables.some(v => v.id === 'temperature');
  if (!hasTemp) {
    const temp = Math.random() * 15 + 15;
    variables.push({
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

  const hasWind = variables.some(v => v.id === 'wind');
  if (!hasWind) {
    const windSpeed = Math.random() * 40;
    variables.push({
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

  const hasVisibility = variables.some(v => v.id === 'visibility');
  if (!hasVisibility) {
    const visibility = Math.random() * 30 + 5;
    variables.push({
      id: 'visibility',
      name: 'Visibility',
      value: parseFloat(visibility.toFixed(1)),
      unit: 'm',
      status: visibility > 20 ? 'safe' : visibility > 10 ? 'moderate' : 'warning',
      statusText: visibility > 20 ? 'Excellent' : visibility > 10 ? 'Good' : 'Poor',
      recommendation: visibility > 20
        ? 'Perfect visibility for diving and underwater activities'
        : visibility > 10
        ? 'Good for most activities'
        : 'Limited visibility, stay cautious',
      icon: 'eye'
    });
  }

  variables.push({
    id: 'currents',
    name: 'Ocean Currents',
    value: parseFloat(current.toFixed(2)),
    unit: 'm/s',
    status: current < 1 ? 'safe' : current < 2 ? 'moderate' : 'warning',
    statusText: current < 1 ? 'Calm' : current < 2 ? 'Moderate' : 'Strong',
    recommendation: current < 1
      ? 'Safe for all water activities'
      : current < 2
      ? 'Exercise caution, suitable for experienced users'
      : 'Strong currents present, only for experts',
    icon: 'waves'
  });

  variables.push({
    id: 'waves',
    name: 'Wave Height',
    value: parseFloat(waveHeight.toFixed(1)),
    unit: 'm',
    status: waveHeight < 1.5 ? 'safe' : waveHeight < 3 ? 'moderate' : 'warning',
    statusText: waveHeight < 1.5 ? 'Small' : waveHeight < 3 ? 'Moderate' : 'Large',
    recommendation: waveHeight < 1.5
      ? 'Calm conditions, perfect for beginners'
      : waveHeight < 3
      ? 'Good for intermediate activities'
      : 'Challenging conditions, advanced skills required',
    icon: 'activity'
  });

  variables.push({
    id: 'safety',
    name: 'Overall Safety Index',
    value: parseFloat(safetyIndex.toFixed(0)),
    unit: '%',
    status: safetyIndex > 70 ? 'safe' : safetyIndex > 40 ? 'moderate' : 'warning',
    statusText: safetyIndex > 70 ? 'Safe' : safetyIndex > 40 ? 'Moderate' : 'Caution',
    recommendation: safetyIndex > 70
      ? 'Conditions are favorable for ocean activities'
      : safetyIndex > 40
      ? 'Check specific conditions before proceeding'
      : 'Consider postponing non-essential activities',
    icon: 'shield'
  });

  return variables;
};

export const calculateActivityConditions = async (
  activity: ActivityType,
  location: string,
  date: string,
  coords?: LocationCoordinates
): Promise<ActivityCondition> => {
  const variables = await generateOceanData(coords);

  let weather = null;
  let tide = null;

  if (coords) {
    weather = await fetchWeatherData(coords.latitude, coords.longitude);
    tide = await fetchTideData(coords.latitude, coords.longitude);
  }

  const activityRequirements: Record<ActivityType, { ideal: string[]; concerns: string }> = {
    surfing: {
      ideal: ['waves', 'wind', 'currents'],
      concerns: 'Large waves recommended, moderate currents acceptable'
    },
    fishing: {
      ideal: ['currents', 'visibility', 'wind'],
      concerns: 'Calm conditions preferred, good visibility helps'
    },
    diving: {
      ideal: ['visibility', 'currents', 'temperature'],
      concerns: 'Excellent visibility crucial, calm currents essential'
    },
    sailing: {
      ideal: ['wind', 'waves', 'visibility'],
      concerns: 'Moderate wind ideal, manageable waves'
    },
    kayaking: {
      ideal: ['currents', 'waves', 'wind'],
      concerns: 'Calm conditions preferred, low wind speeds'
    },
    swimming: {
      ideal: ['temperature', 'currents', 'waves'],
      concerns: 'Comfortable temperature, calm conditions essential'
    }
  };

  const safeCount = variables.filter(v => v.status === 'safe').length;
  const score = Math.round((safeCount / variables.length) * 100);

  const overall = score > 70
    ? `Excellent conditions for ${activity}`
    : score > 50
    ? 'Good conditions with minor concerns'
    : 'Challenging conditions, proceed with caution';

  const details = activityRequirements[activity].concerns;

  const safety = [
    'Always check local weather updates before heading out',
    'Wear appropriate safety gear and equipment',
    'Never go alone - use the buddy system',
    'Know your limits and skill level',
    'Have emergency contact information readily available'
  ];

  return {
    activity,
    location,
    date,
    score,
    overall,
    details,
    safety,
    variables,
    latitude: coords?.latitude,
    longitude: coords?.longitude,
    weather: weather || undefined,
    tide: tide || undefined
  };
};

export const getActivityIcon = (activity: ActivityType): string => {
  const icons: Record<ActivityType, string> = {
    surfing: 'waves',
    fishing: 'fish',
    diving: 'anchor',
    sailing: 'ship',
    kayaking: 'move',
    swimming: 'droplet'
  };
  return icons[activity];
};

export const getActivityColor = (activity: ActivityType): string => {
  const colors: Record<ActivityType, string> = {
    surfing: 'from-cyan-500 to-blue-600',
    fishing: 'from-teal-500 to-green-600',
    diving: 'from-blue-600 to-cyan-700',
    sailing: 'from-sky-500 to-blue-700',
    kayaking: 'from-emerald-500 to-teal-600',
    swimming: 'from-blue-400 to-cyan-600'
  };
  return colors[activity];
};
