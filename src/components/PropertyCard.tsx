import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Maximize, Heart, GitCompare, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useComparison } from "@/contexts/ComparisonContext";
import { Property } from "@/contexts/PropertiesContext";
import { toast } from "sonner";

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInComparison, addToComparison, removeFromComparison } = useComparison();
  
  if (!property || !property.id) {
    return null;
  }
  
  const propertyIsFavorite = isFavorite(property.id);
  const propertyInComparison = isInComparison(property.id);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleFavorite(property.id);
    toast.success(propertyIsFavorite ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleToggleComparison = (e: React.MouseEvent) => {
    e.preventDefault();
    if (propertyInComparison) {
      removeFromComparison(property.id);
    } else {
      addToComparison(property.id);
    }
  };

  return (
    <Link to={`/property/${property.id}`} className="block h-full">
      <Card className="group flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-card border-border/50">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={property.image || '/placeholder.svg'}
            alt={property.title || 'Property'}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
          <div className="absolute left-3 top-3 flex gap-2">
            {property.type && (
          <Badge
                variant={property.type === "sale" ? "default" : property.type === "leasing" ? "secondary" : "outline"}
          >
                For {property.type === "sale" ? "Sale" : property.type === "leasing" ? "Leasing" : "Rent"}
              </Badge>
            )}
            {property.featured && (
              <Badge variant="default" className="bg-yellow-500">
                <Star className="mr-1 h-3 w-3" />
                Featured
          </Badge>
            )}
            {property.constructionStatus === "under-construction" && (
              <Badge variant="outline">UC</Badge>
            )}
          </div>
          <button
            onClick={handleToggleFavorite}
            className="absolute right-3 top-3 rounded-full bg-background/80 p-2 backdrop-blur transition-colors hover:bg-background"
          >
            <Heart
              className={`h-5 w-5 ${
                propertyIsFavorite ? "fill-destructive text-destructive" : "text-foreground"
              }`}
            />
          </button>
          <button
            onClick={handleToggleComparison}
            className="absolute right-14 top-3 rounded-full bg-background/80 p-2 backdrop-blur transition-colors hover:bg-background"
          >
            <GitCompare
              className={`h-5 w-5 ${
                propertyInComparison ? "text-primary" : "text-foreground"
              }`}
            />
          </button>
        </div>
        <CardContent className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">
              ₹{(property.price || 0).toLocaleString("en-IN")}
              {(property.type === "rent" || property.type === "leasing") && <span className="text-sm font-normal">/month</span>}
            </span>
          </div>
          <h3 className="mb-2 line-clamp-1 font-semibold">{property.title || 'Untitled Property'}</h3>
          <div className="mb-3 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{property.location || 'Location not specified'}</span>
          </div>
        </CardContent>
        <CardFooter className="border-t p-4">
          <div className="flex w-full items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{property.bedrooms || 0} Beds</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{property.bathrooms || 0} Baths</span>
            </div>
            <div className="flex items-center gap-1">
              <Maximize className="h-4 w-4" />
              <span>{property.area || 0} sqft</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default PropertyCard;
