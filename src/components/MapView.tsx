import { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

interface MapViewProps {
  latitude?: number;
  longitude?: number;
  location: string;
}

export const MapView = ({ latitude, longitude, location }: MapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current || !latitude || !longitude) return;

    const lat = latitude;
    const lon = longitude;
    const zoom = 10;

    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lon-0.1},${lat-0.1},${lon+0.1},${lat+0.1}&layer=mapnik&marker=${lat},${lon}`;

    mapRef.current.innerHTML = `
      <iframe
        width="100%"
        height="100%"
        frameborder="0"
        scrolling="no"
        marginheight="0"
        marginwidth="0"
        src="${mapUrl}"
        style="border: none; border-radius: 0.75rem;"
      ></iframe>
    `;
  }, [latitude, longitude]);

  if (!latitude || !longitude) {
    return (
      <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-xl p-8 h-80 flex flex-col items-center justify-center">
        <MapPin className="w-12 h-12 text-cyan-400 mb-3" />
        <p className="text-cyan-700 font-semibold">Search for a location to view map</p>
        <p className="text-cyan-600 text-sm mt-2">Map will display once coordinates are available</p>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg">
      <div className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white px-4 py-3">
        <p className="font-semibold flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          {location}
        </p>
      </div>
      <div ref={mapRef} className="h-80 bg-gray-100" />
    </div>
  );
};
