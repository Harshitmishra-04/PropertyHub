import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
  addPropertyLocal,
  deletePropertyLocal,
  listProperties,
  subscribeLocalDb,
  updatePropertyLocal,
} from "@/lib/localDb";

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

// Helper function to convert database property to app property
const mapDbPropertyToProperty = (dbProp: any): Property => {
  const coordinates = typeof dbProp.coordinates === 'object' 
    ? dbProp.coordinates 
    : (typeof dbProp.coordinates === 'string' ? JSON.parse(dbProp.coordinates) : { lat: 0, lng: 0 });
  
  const sellerInfo = typeof dbProp.seller_info === 'object'
    ? dbProp.seller_info
    : (typeof dbProp.seller_info === 'string' ? JSON.parse(dbProp.seller_info) : {});

  const neighborhood = dbProp.neighborhood 
    ? (typeof dbProp.neighborhood === 'object' ? dbProp.neighborhood : JSON.parse(dbProp.neighborhood))
    : undefined;

  return {
    id: dbProp.id,
    title: dbProp.title || 'Untitled Property',
    price: Number(dbProp.price) || 0,
    location: dbProp.location || '',
    city: dbProp.city || '',
    locality: dbProp.locality || '',
    bedrooms: Number(dbProp.bedrooms) || 0,
    bathrooms: Number(dbProp.bathrooms) || 0,
    area: Number(dbProp.area) || 0,
    image: dbProp.image || '/placeholder.svg',
    type: dbProp.type || 'sale',
    propertyType: dbProp.property_type || 'Apartment',
    description: dbProp.description || '',
    amenities: Array.isArray(dbProp.amenities) ? dbProp.amenities : [],
    images: Array.isArray(dbProp.images) && dbProp.images.length > 0 
      ? dbProp.images 
      : [dbProp.image || '/placeholder.svg'],
    coordinates: coordinates,
    approvalStatus: dbProp.approval_status || 'pending',
    constructionStatus: dbProp.construction_status || 'ready',
    floorPlan: dbProp.floor_plan || undefined,
    virtualTour: dbProp.virtual_tour || undefined,
    sellerInfo: sellerInfo as SellerInfo,
    featured: Boolean(dbProp.featured),
    listingPackage: dbProp.listing_package || 'free',
    createdAt: dbProp.created_at || new Date().toISOString(),
    updatedAt: dbProp.updated_at || new Date().toISOString(),
    views: Number(dbProp.views) || 0,
    enquiries: Number(dbProp.enquiries) || 0,
    neighborhood: neighborhood,
    facing: dbProp.facing || undefined,
    furnished: dbProp.furnished || undefined,
    parking: dbProp.parking ? Number(dbProp.parking) : undefined,
    floor: dbProp.floor ? Number(dbProp.floor) : undefined,
    totalFloors: dbProp.total_floors ? Number(dbProp.total_floors) : undefined,
    age: dbProp.age ? Number(dbProp.age) : undefined,
    bhk: dbProp.bhk ? Number(dbProp.bhk) : undefined,
  };
};

// Helper function to convert app property to database property
const mapPropertyToDbProperty = (property: Partial<Property>, userId?: string) => {
  return {
    title: property.title,
    price: property.price,
    location: property.location,
    city: property.city,
    locality: property.locality,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    area: property.area,
    image: property.image,
    type: property.type,
    property_type: property.propertyType,
    description: property.description || '',
    amenities: property.amenities || [],
    images: property.images || [],
    coordinates: property.coordinates || { lat: 0, lng: 0 },
    approval_status: property.approvalStatus || 'pending',
    construction_status: property.constructionStatus || 'ready',
    floor_plan: property.floorPlan || null,
    virtual_tour: property.virtualTour || null,
    seller_info: property.sellerInfo || {},
    featured: property.featured || false,
    listing_package: property.listingPackage || 'free',
    views: property.views || 0,
    enquiries: property.enquiries || 0,
    neighborhood: property.neighborhood || null,
    facing: property.facing || null,
    furnished: property.furnished || null,
    parking: property.parking || null,
    floor: property.floor || null,
    total_floors: property.totalFloors || null,
    age: property.age || null,
    bhk: property.bhk || null,
    seller_id: userId || null,
  };
};

export const PropertiesProvider = ({ children }: { children: ReactNode }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      const all = listProperties();

      // Match previous behavior: guests see approved only; non-admin sees approved or own.
      const filtered = all.filter((p) => {
        if (user?.role === "admin") return true;
        if (!user) return p.approvalStatus === "approved";
        const isOwn = p.sellerInfo?.id === user.id || p.sellerInfo?.email === user.email;
        return p.approvalStatus === "approved" || isOwn;
      });

      setProperties(filtered);
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

      const newProperty = addPropertyLocal(property);
      setProperties((prev) => [newProperty, ...prev]);
    } catch (error) {
      console.error('Error adding property:', error);
      throw error;
    }
  };

  const deleteProperty = async (propertyId: string) => {
    try {
      deletePropertyLocal(propertyId);
      setProperties(prev => prev.filter(p => p.id !== propertyId));
    } catch (error) {
      console.error('Error deleting property:', error);
      throw error;
    }
  };

  const updateProperty = async (propertyId: string, updates: Partial<Property>) => {
    try {
      const updated = updatePropertyLocal(propertyId, updates);
      if (updated) {
        setProperties((prev) => prev.map((p) => (p.id === propertyId ? updated : p)));
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
