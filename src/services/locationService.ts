import { LocationCoordinates } from '../types';

export const geocodeLocation = async (location: string): Promise<LocationCoordinates | null> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`,
      {
        headers: {
          'User-Agent': 'OceanSafeApp/1.0'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }

    const data = await response.json();

    if (data.length === 0) {
      return null;
    }

    return {
      latitude: parseFloat(data[0].lat),
      longitude: parseFloat(data[0].lon),
      display_name: data[0].display_name
    };
  } catch (error) {
    console.error('Error geocoding location:', error);
    return null;
  }
};

export const reverseGeocode = async (lat: number, lon: number): Promise<string | null> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      {
        headers: {
          'User-Agent': 'OceanSafeApp/1.0'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Reverse geocoding request failed');
    }

    const data = await response.json();
    return data.display_name || null;
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return null;
  }
};

export const searchLocations = async (query: string): Promise<LocationCoordinates[]> => {
  if (!query || query.length < 2) {
    return [];
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`,
      {
        headers: {
          'User-Agent': 'OceanSafeApp/1.0'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Location search failed');
    }

    const data = await response.json();

    return data.map((item: any) => ({
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
      display_name: item.display_name
    }));
  } catch (error) {
    console.error('Error searching locations:', error);
    return [];
  }
};
