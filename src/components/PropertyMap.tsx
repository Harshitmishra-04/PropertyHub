import { Card } from "@/components/ui/card";
import ClientOnlyMap from "./ClientOnlyMap";
import MapErrorBoundary from "./maps/MapErrorBoundary";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

interface PropertyMapProps {
  latitude: number;
  longitude: number;
  title?: string;
  height?: string;
}

const PropertyMapContent = ({ latitude, longitude, title, height = "400px" }: PropertyMapProps) => {

  return (
    <Card className="overflow-hidden">
      <div style={{ height, width: "100%" }}>
        <MapContainer
          center={[latitude, longitude]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[latitude, longitude]}>
            {title && <Popup>{title}</Popup>}
          </Marker>
        </MapContainer>
      </div>
    </Card>
  );
};

const PropertyMap = (props: PropertyMapProps) => {
  if (!props.latitude || !props.longitude || isNaN(props.latitude) || isNaN(props.longitude)) {
    return (
      <Card className="overflow-hidden p-8 text-center">
        <p className="text-muted-foreground">Invalid location coordinates</p>
      </Card>
    );
  }

  return (
    <ClientOnlyMap fallback={
      <Card className="overflow-hidden p-8 text-center">
        <p className="text-muted-foreground">Loading map...</p>
      </Card>
    }>
      <MapErrorBoundary fallback={
        <Card className="overflow-hidden p-8 text-center">
          <p className="text-muted-foreground">Map failed to load. Please refresh the page.</p>
        </Card>
      }>
        <PropertyMapContent {...props} />
      </MapErrorBoundary>
    </ClientOnlyMap>
  );
};

export default PropertyMap;
