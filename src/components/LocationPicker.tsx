import { useState, useCallback, memo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ClientOnlyMap from "./ClientOnlyMap";
import MapErrorBoundary from "./maps/MapErrorBoundary";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  initialLat?: number;
  initialLng?: number;
}

interface MapClickHandlerProps {
  onLocationClick: (lat: number, lng: number) => void;
}

const MapClickHandler = memo(({ onLocationClick }: MapClickHandlerProps) => {
  useMapEvents({
    click: (e: any) => {
      onLocationClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
});

MapClickHandler.displayName = "MapClickHandler";

const LocationPickerContent = ({ onLocationSelect, initialLat = 20.5937, initialLng = 78.9629 }: LocationPickerProps) => {
  const validLat = isNaN(initialLat || 0) || !initialLat ? 20.5937 : initialLat;
  const validLng = isNaN(initialLng || 0) || !initialLng ? 78.9629 : initialLng;
  
  const [position, setPosition] = useState<[number, number]>([validLat, validLng]);
  const [address, setAddress] = useState("");

  const handleMapClick = useCallback(async (lat: number, lng: number) => {
    setPosition([lat, lng]);
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      const fetchedAddress = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      setAddress(fetchedAddress);
      onLocationSelect(lat, lng, fetchedAddress);
    } catch (error) {
      const defaultAddress = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      setAddress(defaultAddress);
      onLocationSelect(lat, lng, defaultAddress);
    }
  }, [onLocationSelect]);

  const handleAddressChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = e.target.value;
    setAddress(newAddress);
    if (newAddress.trim()) {
      // Update location when user types, using current coordinates
      onLocationSelect(position[0], position[1], newAddress);
    }
  }, [position, onLocationSelect]);

  return (
    <div className="space-y-4">
      <div>
        <Label>Click on map to select location</Label>
        <Input
          type="text"
          value={address}
          onChange={handleAddressChange}
          placeholder="Address will appear here..."
          className="mt-2"
        />
      </div>
      <Card className="overflow-hidden">
        <div style={{ height: "400px", width: "100%" }}>
          <MapContainer
            center={position}
            zoom={5}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapClickHandler onLocationClick={handleMapClick} />
            <Marker position={position} />
          </MapContainer>
        </div>
      </Card>
      <p className="text-sm text-muted-foreground">
        Coordinates: {position[0].toFixed(4)}, {position[1].toFixed(4)}
      </p>
    </div>
  );
};

const LocationPicker = (props: LocationPickerProps) => {
  return (
    <ClientOnlyMap fallback={
      <div className="space-y-4">
        <div>
          <Label>Click on map to select location</Label>
          <Input
            type="text"
            placeholder="Address will appear here..."
            className="mt-2"
            disabled
          />
        </div>
        <Card className="overflow-hidden p-8 text-center">
          <p className="text-muted-foreground">Loading map...</p>
        </Card>
      </div>
    }>
      <MapErrorBoundary fallback={
        <div className="space-y-4">
          <div>
            <Label>Click on map to select location</Label>
            <Input
              type="text"
              placeholder="Map unavailable"
              className="mt-2"
              disabled
            />
          </div>
          <Card className="overflow-hidden p-8 text-center">
            <p className="text-muted-foreground">Map failed to load. Please refresh the page.</p>
          </Card>
        </div>
      }>
        <LocationPickerContent {...props} />
      </MapErrorBoundary>
    </ClientOnlyMap>
  );
};

export default LocationPicker;
