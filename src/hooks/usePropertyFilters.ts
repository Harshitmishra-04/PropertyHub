import { useMemo } from 'react';

export interface PropertyFilters {
  location?: string;
  city?: string;
  locality?: string;
  propertyType?: string;
  propertyTypes?: string[];
  priceRange?: string;
  bedrooms?: number[];
  amenities?: string[];
  minPrice?: number;
  maxPrice?: number;
  constructionStatus?: "ready" | "under-construction";
  furnished?: "furnished" | "semi-furnished" | "unfurnished";
  bhk?: number[];
}

export const usePropertyFilters = (properties: any[], filters: PropertyFilters) => {
  return useMemo(() => {
    if (!Array.isArray(properties)) {
      return [];
    }
    let filtered = [...properties];

    if (filters.location && filters.location.trim()) {
      const searchTerm = filters.location.toLowerCase();
      filtered = filtered.filter((prop) => {
        if (!prop) return false;
        return (
          (prop.location && prop.location.toLowerCase().includes(searchTerm)) ||
          (prop.city && prop.city.toLowerCase().includes(searchTerm)) ||
          (prop.locality && prop.locality.toLowerCase().includes(searchTerm))
        );
      });
    }

    if (filters.city && filters.city.trim()) {
      filtered = filtered.filter((prop) =>
        prop.city?.toLowerCase().includes(filters.city!.toLowerCase())
      );
    }

    if (filters.locality && filters.locality.trim()) {
      filtered = filtered.filter((prop) =>
        prop.locality?.toLowerCase().includes(filters.locality!.toLowerCase())
      );
    }

    if (filters.propertyType && filters.propertyType !== 'all') {
      filtered = filtered.filter(
        (prop) => prop && prop.propertyType && prop.propertyType.toLowerCase() === filters.propertyType?.toLowerCase()
      );
    }

    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
      filtered = filtered.filter((prop) =>
        prop && prop.propertyType && filters.propertyTypes!.includes(prop.propertyType)
      );
    }

    if (filters.constructionStatus) {
      filtered = filtered.filter((prop) =>
        prop.constructionStatus === filters.constructionStatus
      );
    }

    if (filters.furnished) {
      filtered = filtered.filter((prop) =>
        prop.furnished === filters.furnished
      );
    }

    if (filters.bhk && filters.bhk.length > 0) {
      filtered = filtered.filter((prop) =>
        filters.bhk!.includes(prop.bhk || prop.bedrooms)
      );
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map((val) => {
        if (val === '200+') return [20000000, Infinity];
        return parseInt(val) * 100000;
      });
      
      if (min !== undefined && max !== undefined) {
        filtered = filtered.filter((prop) => {
          const price = prop.price;
          return price >= min[0] && (max[1] === Infinity ? true : price <= max[1]);
        });
      }
    }

    if (filters.minPrice !== undefined) {
      filtered = filtered.filter((prop) => prop && prop.price !== undefined && prop.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter((prop) => prop && prop.price !== undefined && prop.price <= filters.maxPrice!);
    }

    if (filters.bedrooms && filters.bedrooms.length > 0) {
      filtered = filtered.filter((prop) => 
        prop && prop.bedrooms !== undefined && filters.bedrooms!.includes(prop.bedrooms)
      );
    }

    if (filters.amenities && filters.amenities.length > 0) {
      filtered = filtered.filter((prop) => {
        if (!prop || !Array.isArray(prop.amenities)) return false;
        return filters.amenities!.every((amenity) =>
          prop.amenities.some((propAmenity: string) =>
            propAmenity && propAmenity.toLowerCase().includes(amenity.toLowerCase())
          )
        );
      });
    }

    return filtered;
  }, [properties, filters]);
};
