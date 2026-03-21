import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
  addPropertyLocal,
  deletePropertyLocal,
  listProperties,
  subscribeLocalDb,
  updatePropertyLocal,
} from "@/lib/localDb";
import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/api";

export interface SellerInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: "owner" | "broker" | "builder";
  company?: string;
  rating?: number;
  totalListings?: number;
}

export interface NeighborhoodInsights {
  schools?: string[];
  hospitals?: string[];
  shoppingMalls?: string[];
  connectivity?: string[];
  rating?: number;
}

export interface Property {
  id: string;
  sellerId?: string;
  title: string;
  price: number;
  location: string;
  city: string;
  locality: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  type: "sale" | "rent" | "leasing";
  propertyType: "Apartment" | "Villa" | "Plot" | "Commercial" | "House";
  description: string;
  amenities: string[];
  images: string[];
  coordinates: { lat: number; lng: number };
  approvalStatus: "pending" | "approved" | "rejected";
  constructionStatus: "ready" | "under-construction";
  floorPlan?: string;
  virtualTour?: string;
  sellerInfo: SellerInfo;
  featured: boolean;
  listingPackage?: "free" | "featured" | "premium" | "banner";
  createdAt: string;
  updatedAt: string;
  views: number;
  enquiries: number;
  neighborhood?: NeighborhoodInsights;
  facing?: string;
  furnished?: "furnished" | "semi-furnished" | "unfurnished";
  parking?: number;
  floor?: number;
  totalFloors?: number;
  age?: number;
  bhk?: number;
}

interface PropertiesContextType {
  properties: Property[];
  loading: boolean;
  addProperty: (property: Omit<Property, 'id' | 'approvalStatus' | 'createdAt' | 'updatedAt' | 'views' | 'enquiries'>) => Promise<void>;
  deleteProperty: (propertyId: string) => Promise<void>;
  updateProperty: (propertyId: string, updates: Partial<Property>) => Promise<void>;
  approveProperty: (propertyId: string) => Promise<void>;
  rejectProperty: (propertyId: string) => Promise<void>;
  incrementViews: (propertyId: string) => Promise<void>;
  incrementEnquiries: (propertyId: string) => Promise<void>;
}

const PropertiesContext = createContext<PropertiesContextType | undefined>(undefined);

// Helper function to convert API property (Prisma) to app property
const mapApiPropertyToProperty = (apiProp: any): Property => {
  const parseJsonArray = (value: any): string[] => {
    if (Array.isArray(value)) return value as string[];
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? (parsed as string[]) : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  const coordinates =
    typeof apiProp.coordinates === "object"
      ? apiProp.coordinates
      : typeof apiProp.coordinates === "string"
      ? JSON.parse(apiProp.coordinates)
      : { lat: 0, lng: 0 };

  const sellerInfo =
    typeof apiProp.sellerInfo === "object"
      ? apiProp.sellerInfo
      : typeof apiProp.sellerInfo === "string"
      ? JSON.parse(apiProp.sellerInfo)
      : {};

  const neighborhood = apiProp.neighborhood
    ? typeof apiProp.neighborhood === "object"
      ? apiProp.neighborhood
      : JSON.parse(apiProp.neighborhood)
    : undefined;

  return {
    id: apiProp.id,
    sellerId: apiProp.sellerId || undefined,
    title: apiProp.title || "Untitled Property",
    price: Number(apiProp.price) || 0,
    location: apiProp.location || "",
    city: apiProp.city || "",
    locality: apiProp.locality || "",
    bedrooms: Number(apiProp.bedrooms) || 0,
    bathrooms: Number(apiProp.bathrooms) || 0,
    area: Number(apiProp.area) || 0,
    image: apiProp.image || "/placeholder.svg",
    type: apiProp.type || "sale",
    propertyType: apiProp.propertyType || "Apartment",
    description: apiProp.description || "",
    amenities: parseJsonArray(apiProp.amenities),
    images: (() => {
      const parsedImages = parseJsonArray(apiProp.images);
      if (parsedImages.length > 0) return parsedImages;
      return [apiProp.image || "/placeholder.svg"];
    })(),
    coordinates,
    approvalStatus: apiProp.approvalStatus || "pending",
    constructionStatus: apiProp.constructionStatus || "ready",
    floorPlan: apiProp.floorPlan || undefined,
    virtualTour: apiProp.virtualTour || undefined,
    sellerInfo: sellerInfo as SellerInfo,
    featured: Boolean(apiProp.featured),
    listingPackage: apiProp.listingPackage || "free",
    createdAt: apiProp.createdAt || new Date().toISOString(),
    updatedAt: apiProp.updatedAt || new Date().toISOString(),
    views: Number(apiProp.views) || 0,
    enquiries: Number(apiProp.enquiries) || 0,
    neighborhood,
    facing: apiProp.facing || undefined,
    furnished: apiProp.furnished || undefined,
    parking: apiProp.parking ? Number(apiProp.parking) : undefined,
    floor: apiProp.floor ? Number(apiProp.floor) : undefined,
    totalFloors: apiProp.totalFloors ? Number(apiProp.totalFloors) : undefined,
    age: apiProp.age ? Number(apiProp.age) : undefined,
    bhk: apiProp.bhk ? Number(apiProp.bhk) : undefined,
  };
};

export const PropertiesProvider = ({ children }: { children: ReactNode }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      // Try backend API first
      try {
        const apiProps = await apiGet<any[]>("/properties");
        const mapped = apiProps.map(mapApiPropertyToProperty);

        const filtered = mapped.filter((p) => {
          if (user?.role === "admin") return true;
          if (!user) return p.approvalStatus === "approved";
          const isOwn =
            p.sellerInfo?.id === user.id || p.sellerInfo?.email === user.email;
          return p.approvalStatus === "approved" || isOwn;
        });

        setProperties(filtered);
        return;
      } catch (apiError) {
        console.warn("Falling back to local properties:", apiError);
      }

      // Fallback to local storage
      const allLocal = listProperties();
      const filteredLocal = allLocal.filter((p) => {
        if (user?.role === "admin") return true;
        if (!user) return p.approvalStatus === "approved";
        const isOwn =
          p.sellerInfo?.id === user.id || p.sellerInfo?.email === user.email;
        return p.approvalStatus === "approved" || isOwn;
      });

      setProperties(filteredLocal);
    } catch (error: any) {
      console.error('Error fetching properties:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProperties();
    const unsub = subscribeLocalDb(fetchProperties);
    return unsub;
  }, [fetchProperties]);

  const addProperty = async (property: Omit<Property, 'id' | 'approvalStatus' | 'createdAt' | 'updatedAt' | 'views' | 'enquiries'>) => {
    try {
      // Input validation
      if (!property.title || !property.title.trim()) {
        throw new Error('Property title is required');
      }
      if (!property.price || property.price <= 0) {
        throw new Error('Valid price is required');
      }
      if (!property.location || !property.location.trim()) {
        throw new Error('Location is required');
      }

      // Logged-in users should persist to backend only
      if (user) {
        const created = await apiPost<any>("/properties", {
          ...property,
          approvalStatus: "pending",
        });
        const mapped = mapApiPropertyToProperty(created);
        setProperties((prev) => [mapped, ...prev]);
        return;
      }

      // Guest fallback (local-only mode)
      const newProperty = addPropertyLocal(property);
      setProperties((prev) => [newProperty, ...prev]);
    } catch (error) {
      console.error('Error adding property:', error);
      throw error;
    }
  };

  const deleteProperty = async (propertyId: string) => {
    try {
      // If logged in, always try backend first.
      // If backend fails (401/403/500), we should NOT silently fall back to local,
      // otherwise admin thinks delete succeeded but nothing changes on the live DB.
      if (user) {
        await apiDelete(`/properties/${propertyId}`);
        setProperties((prev) => prev.filter((p) => p.id !== propertyId));
        return;
      }

      // Guest/unknown auth: fallback to local behavior.
      deletePropertyLocal(propertyId);
      setProperties((prev) => prev.filter((p) => p.id !== propertyId));
    } catch (error) {
      console.error("Error deleting property:", error);
      throw error;
    }
  };

  const updateProperty = async (propertyId: string, updates: Partial<Property>) => {
    try {
      if (user) {
        const updatedApi = await apiPatch<any>(`/properties/${propertyId}`, updates);
        const mapped = mapApiPropertyToProperty(updatedApi);
        setProperties((prev) => prev.map((p) => (p.id === propertyId ? mapped : p)));
        return;
      }

      const updatedLocal = updatePropertyLocal(propertyId, updates);
      if (updatedLocal) {
        setProperties((prev) => prev.map((p) => (p.id === propertyId ? updatedLocal : p)));
      }
    } catch (error) {
      console.error('Error updating property:', error);
      throw error;
    }
  };

  const incrementViews = async (propertyId: string) => {
    try {
      const property = properties.find(p => p.id === propertyId);
      if (property) {
        await updateProperty(propertyId, { views: (property.views || 0) + 1 });
      }
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  };

  const incrementEnquiries = async (propertyId: string) => {
    try {
      const property = properties.find(p => p.id === propertyId);
      if (property) {
        await updateProperty(propertyId, { enquiries: (property.enquiries || 0) + 1 });
      }
    } catch (error) {
      console.error('Error incrementing enquiries:', error);
    }
  };

  const approveProperty = async (propertyId: string) => {
    await updateProperty(propertyId, { approvalStatus: 'approved' });
  };

  const rejectProperty = async (propertyId: string) => {
    await updateProperty(propertyId, { approvalStatus: 'rejected' });
  };

  return (
    <PropertiesContext.Provider value={{
      properties: Array.isArray(properties) ? properties : [],
      loading,
      addProperty,
      deleteProperty,
      updateProperty,
      approveProperty,
      rejectProperty,
      incrementViews,
      incrementEnquiries,
    }}>
      {children}
    </PropertiesContext.Provider>
  );
};

export const useProperties = () => {
  const context = useContext(PropertiesContext);
  if (!context) {
    throw new Error('useProperties must be used within PropertiesProvider');
  }
  return context;
};
