import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Property } from "@/contexts/PropertiesContext";
import ClientOnlyMap from "./ClientOnlyMap";
import MapErrorBoundary from "./maps/MapErrorBoundary";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

if (typeof window !== "undefined") {
  try {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  } catch (error) {
    console.warn("Leaflet icon setup failed:", error);
  }
}

const MapInitializer = () => {
  const map = useMap();
  
  useEffect(() => {
    const timer1 = setTimeout(() => {
      map.invalidateSize();
    }, 100);
    
    const timer2 = setTimeout(() => {
      map.invalidateSize();
    }, 500);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [map]);
  
  return null;
};

interface PropertyMapViewProps {
  properties: Property[];
  height?: string;
}

const PropertyMapViewContent = ({ properties, height = "600px" }: PropertyMapViewProps) => {
  const [isReady, setIsReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (typeof L === "undefined") {
        setMapError("Leaflet library not loaded");
        return;
      }
      
      const timer = setTimeout(() => {
        try {
          if (L && L.Map && L.tileLayer) {
            setIsReady(true);
          } else {
            setMapError("Leaflet Map not available");
          }
        } catch (error) {
          console.error("Map initialization error:", error);
          setMapError("Failed to initialize map");
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, []);

  const validProperties = properties.filter(p => 
    p && 
    p.coordinates && 
    typeof p.coordinates.lat === 'number' && 
    typeof p.coordinates.lng === 'number' &&
    !isNaN(p.coordinates.lat) &&
    !isNaN(p.coordinates.lng)
  );
  
  if (validProperties.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No properties with valid locations to display on map</p>
      </Card>
    );
  }

  if (mapError) {
    return (
      <Card className="p-8 text-center">
        <p className="text-destructive mb-2">{mapError}</p>
        <p className="text-sm text-muted-foreground">Please refresh the page or try again later.</p>
      </Card>
    );
  }

  if (!isReady) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">Loading map...</p>
      </Card>
    );
  }

  const centerLat = validProperties.reduce((sum, p) => sum + p.coordinates.lat, 0) / validProperties.length;
  const centerLng = validProperties.reduce((sum, p) => sum + p.coordinates.lng, 0) / validProperties.length;

  // Ensure valid center coordinates
  const validCenterLat = isNaN(centerLat) || !centerLat ? 20.5937 : centerLat;
  const validCenterLng = isNaN(centerLng) || !centerLng ? 78.9629 : centerLng;

  return (
    <Card className="overflow-hidden">
      <div style={{ height, width: "100%", position: "relative", minHeight: "400px" }}>
        <MapContainer
          key={`map-${validCenterLat}-${validCenterLng}-${validProperties.length}`}
          center={[validCenterLat, validCenterLng]}
          zoom={validProperties.length === 1 ? 13 : 5}
          style={{ height: "100%", width: "100%", zIndex: 0 }}
          scrollWheelZoom={true}
          whenReady={() => {
            console.log("Map is ready");
            setMapError(null);
          }}
        >
          <MapInitializer />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
            minZoom={1}
            noWrap={false}
          />
          {validProperties.map((property) => {
            const lat = property.coordinates?.lat;
            const lng = property.coordinates?.lng;
            if (!lat || !lng || isNaN(lat) || isNaN(lng)) return null;
            
            return (
              <Marker
                key={property.id}
                position={[lat, lng]}
              >
                <Popup>
                  <div className="min-w-[200px]">
                    <h3 className="font-semibold mb-2">{property.title || 'Untitled Property'}</h3>
                    <p className="text-sm text-muted-foreground mb-1">{property.location || 'Location not specified'}</p>
                    <p className="font-bold text-primary mb-2">
                      ₹{(property.price || 0).toLocaleString("en-IN")}
                      {(property.type === "rent" || property.type === "leasing") && "/month"}
                    </p>
                    <p className="text-sm mb-3">{property.bedrooms || 0} BHK</p>
                    <Link to={`/property/${property.id}`}>
                      <Button size="sm" className="w-full">View Details</Button>
                    </Link>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </Card>
  );
};

const PropertyMapView = (props: PropertyMapViewProps) => {
  if (!props.properties || props.properties.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No properties to display on map</p>
      </Card>
    );
  }

  const validProperties = props.properties.filter(p => 
    p && 
    p.coordinates && 
    typeof p.coordinates.lat === 'number' && 
    typeof p.coordinates.lng === 'number' &&
    !isNaN(p.coordinates.lat) &&
    !isNaN(p.coordinates.lng)
  );
  
  if (validProperties.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No properties with valid locations to display on map</p>
      </Card>
    );
  }

  return (
    <ClientOnlyMap fallback={
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">Loading map...</p>
      </Card>
    }>
      <MapErrorBoundary fallback={
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Map failed to load. Please refresh the page.</p>
        </Card>
      }>
        <PropertyMapViewContent {...props} />
      </MapErrorBoundary>
    </ClientOnlyMap>
  );
};

export default PropertyMapView;
