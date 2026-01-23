import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch?: (filters: SearchFilters) => void;
  variant?: "hero" | "compact";
}

export interface SearchFilters {
  location: string;
  propertyType: string;
  priceRange: string;
}

const SearchBar = ({ onSearch, variant = "hero" }: SearchBarProps) => {
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [priceRange, setPriceRange] = useState("");

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const filters: SearchFilters = {
      location: location || "",
      propertyType: propertyType || "",
      priceRange: priceRange || "",
    };
    onSearch?.(filters);
  };

  const isHero = variant === "hero";

  return (
    <form onSubmit={handleSearch} className={`${isHero ? "w-full" : ""}`}>
      <div className={`flex ${isHero ? "flex-col md:flex-row" : "flex-row"} gap-3 ${isHero ? "rounded-xl bg-background p-4 shadow-lg" : ""}`}>
        <Input
          name="location"
          placeholder="Enter Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className={isHero ? "flex-1" : "flex-1"}
        />
        <Select value={propertyType} onValueChange={setPropertyType}>
          <SelectTrigger className={isHero ? "md:w-[200px]" : "w-[150px]"}>
            <SelectValue placeholder="Property Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apartment">Apartment</SelectItem>
            <SelectItem value="villa">Villa</SelectItem>
            <SelectItem value="house">House</SelectItem>
            <SelectItem value="plot">Plot</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priceRange} onValueChange={setPriceRange}>
          <SelectTrigger className={isHero ? "md:w-[200px]" : "w-[150px]"}>
            <SelectValue placeholder="Budget" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0-50">₹0 - ₹50L</SelectItem>
            <SelectItem value="50-100">₹50L - ₹1Cr</SelectItem>
            <SelectItem value="100-200">₹1Cr - ₹2Cr</SelectItem>
            <SelectItem value="200+">₹2Cr+</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" size={isHero ? "default" : "default"} className="gap-2">
          <Search className="h-4 w-4" />
          Search
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
