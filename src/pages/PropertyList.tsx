import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";
import SearchBar, { SearchFilters } from "@/components/SearchBar";
import PropertyCard from "@/components/PropertyCard";
import FilterSidebar from "@/components/FilterSidebar";
import { useProperties } from "@/contexts/PropertiesContext";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List, Map } from "lucide-react";
import { usePropertyFilters, PropertyFilters } from "@/hooks/usePropertyFilters";
import AIChatAssistant from "@/components/AIChatAssistant";
import PropertyMapView from "@/components/PropertyMapView";

const PropertyList = () => {
  const { type } = useParams<{ type: string }>();
  const location = useLocation();
  const { properties, loading } = useProperties();
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid");
  const [searchFilters, setSearchFilters] = useState<SearchFilters | null>(null);
  const [sidebarFilters, setSidebarFilters] = useState<PropertyFilters>({});

  useEffect(() => {
    if (location.state && (location.state as any).searchFilters) {
      setSearchFilters((location.state as any).searchFilters);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);
  
  const safeProperties = Array.isArray(properties) ? properties : [];
  
  const typeFilteredProperties = safeProperties.filter(
    (property) => {
      if (!property || !property.type || !property.approvalStatus) return false;
      if (type === "rent") {
        return property.type === "rent" && property.approvalStatus === "approved";
      } else if (type === "leasing") {
        return property.type === "leasing" && property.approvalStatus === "approved";
      } else {
        return property.type === "sale" && property.approvalStatus === "approved";
      }
    }
  );

  const allFilters: PropertyFilters = {
    ...sidebarFilters,
    ...(searchFilters && {
      location: searchFilters.location,
      propertyType: searchFilters.propertyType,
      priceRange: searchFilters.priceRange,
    }),
  };

  const filteredProperties = usePropertyFilters(typeFilteredProperties, allFilters);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [searchFilters, sidebarFilters, viewMode]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="border-b bg-muted/30 py-6">
        <div className="container mx-auto px-4">
          <BackButton label="Back to Home" to="/" className="mb-4" />
          <h1 className="mb-4 text-3xl font-bold">
            Properties for {type === "rent" ? "Rent" : type === "leasing" ? "Leasing" : "Sale"}
          </h1>
          <SearchBar variant="compact" onSearch={setSearchFilters} />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="w-full lg:w-64">
            <FilterSidebar onFilterChange={setSidebarFilters} />
          </aside>

          <main className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-muted-foreground">
                {filteredProperties.length} properties found
              </p>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "map" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("map")}
                >
                  <Map className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {filteredProperties.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">No properties found matching your criteria.</p>
                <Button variant="outline" className="mt-4" onClick={() => {
                  setSearchFilters(null);
                  setSidebarFilters({});
                }}>
                  Clear Filters
                </Button>
              </div>
            ) : viewMode === "map" ? (
              <PropertyMapView properties={filteredProperties} />
            ) : (
              <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
      <AIChatAssistant />
    </div>
  );
};

export default PropertyList;
