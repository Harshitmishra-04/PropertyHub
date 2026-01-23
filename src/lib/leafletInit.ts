import L from "leaflet";
import "leaflet/dist/leaflet.css";

export const initLeaflet = () => {
  if (typeof window === "undefined") return;
  
  try {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  } catch (error) {
    console.warn("Failed to initialize Leaflet icons:", error);
  }
};

if (typeof window !== "undefined") {
  initLeaflet();
}

