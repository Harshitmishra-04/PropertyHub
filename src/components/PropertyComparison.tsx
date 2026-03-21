import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Bed, Bath, Maximize, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useProperties } from "@/contexts/PropertiesContext";
import { useComparison } from "@/contexts/ComparisonContext";

interface ComparisonProperty {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: "sale" | "rent";
  propertyType: string;
  amenities: string[];
  image: string;
}

interface PropertyComparisonProps {
  initialProperties?: string[];
  onClose?: () => void;
}

const PropertyComparison = ({ initialProperties = [], onClose }: PropertyComparisonProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(initialProperties);
  const { properties } = useProperties();
  const { removeFromComparison } = useComparison();
  
  const selectedProperties = selectedIds
    .map(id => properties.find(p => p.id === id))
    .filter(Boolean) as ComparisonProperty[];

  const removeProperty = async (id: string) => {
    setSelectedIds(prev => prev.filter(pId => pId !== id));
    try {
      await removeFromComparison(id);
    } catch {
      // keep local UI state updated even if API fails
    }
  };

  if (selectedProperties.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            No properties selected for comparison. Add properties from the listing pages.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Compare Properties</h2>
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Close Comparison
          </Button>
        )}
      </div>

      <div className="overflow-x-auto">
        <div className="inline-flex gap-6 pb-4">
          {selectedProperties.map((property) => (
            <Card key={property.id} className="w-80 flex-shrink-0">
              <div className="relative">
                <img
                  src={property.image}
                  alt={property.title}
                  className="h-48 w-full object-cover"
                />
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute right-2 top-2"
                  onClick={() => void removeProperty(property.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardContent className="space-y-4 p-4">
                <div>
                  <Badge className="mb-2">
                    {property.type === "sale" ? "For Sale" : "For Rent"}
                  </Badge>
                  <h3 className="mb-2 font-semibold">{property.title}</h3>
                  <p className="mb-2 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {property.location}
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    ₹{property.price.toLocaleString("en-IN")}
                    {property.type === "rent" && (
                      <span className="text-sm font-normal">/month</span>
                    )}
                  </p>
                </div>

                <div className="space-y-2 border-t pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Bed className="h-4 w-4" />
                      Bedrooms
                    </span>
                    <span className="font-semibold">{property.bedrooms}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Bath className="h-4 w-4" />
                      Bathrooms
                    </span>
                    <span className="font-semibold">{property.bathrooms}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Maximize className="h-4 w-4" />
                      Area
                    </span>
                    <span className="font-semibold">{property.area} sqft</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-semibold">{property.propertyType}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="mb-2 text-sm font-semibold">Amenities:</p>
                  <div className="flex flex-wrap gap-1">
                    {property.amenities.map((amenity) => (
                      <Badge key={amenity} variant="secondary" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Link to={`/property/${property.id}`}>
                  <Button className="w-full">View Details</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyComparison;
