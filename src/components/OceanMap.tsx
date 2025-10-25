import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import oceanSafeLogo from '../assets/ocean-safe-logo.png';

type OceanVariable = {
    id?: string;
    name?: string;
    value?: number | string;
    unit?: string;
    // Add other fields as needed
};

type Props = {
    latitude: number;
    longitude: number;
    oceanData: Partial<OceanVariable>[];
};

export default function OceanMap({ latitude, longitude, oceanData }: Props) {
    return (
        <div>
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <img src={oceanSafeLogo} alt="Ocean Safe Logo" style={{ height: '80px' }} />
            </div>
            <MapContainer center={[latitude, longitude]} zoom={12} style={{ height: '400px', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[latitude, longitude]}>
                    <Popup>
                        Your location
                    </Popup>
                </Marker>
                {oceanData.map((variable, idx) => (
                    <Marker
                        key={variable.id || idx}
                        position={[latitude + 0.01 * idx, longitude + 0.01 * idx]}
                    >
                        <Popup>
                            {variable.name}: {variable.value} {variable.unit}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}