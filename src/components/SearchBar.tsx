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
    <form onSubmit={handleSearch} className={`${isHero ? "w-full max-w-4xl mx-auto" : ""}`}>
      <div className={`flex ${isHero ? "flex-col md:flex-row items-center rounded-full bg-card/95 backdrop-blur-xl p-3 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-border/30 transition-all hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)]" : "flex-row"} gap-3`}>
        <Input
          name="location"
          placeholder="Enter Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className={isHero ? "flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 text-base rounded-full px-6 h-14" : "flex-1"}
        />
        {isHero && <div className="h-8 w-px bg-border/50 hidden md:block" />}
        <Select value={propertyType} onValueChange={setPropertyType}>
          <SelectTrigger className={isHero ? "md:w-[200px] border-0 bg-transparent shadow-none focus:ring-0 text-base h-14" : "w-[150px]"}>
            <SelectValue placeholder="Property Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apartment">Apartment</SelectItem>
            <SelectItem value="villa">Villa</SelectItem>
            <SelectItem value="house">House</SelectItem>
            <SelectItem value="plot">Plot</SelectItem>
          </SelectContent>
        </Select>
        {isHero && <div className="h-8 w-px bg-border/50 hidden md:block" />}
        <Select value={priceRange} onValueChange={setPriceRange}>
          <SelectTrigger className={isHero ? "md:w-[200px] border-0 bg-transparent shadow-none focus:ring-0 text-base h-14" : "w-[150px]"}>
            <SelectValue placeholder="Budget" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0-50">₹0 - ₹50L</SelectItem>
            <SelectItem value="50-100">₹50L - ₹1Cr</SelectItem>
            <SelectItem value="100-200">₹1Cr - ₹2Cr</SelectItem>
            <SelectItem value="200+">₹2Cr+</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" size={isHero ? "lg" : "default"} className={`${isHero ? "rounded-full px-8 h-14 font-semibold text-base transition-transform hover:scale-105 shadow-[0_10px_20px_-10px_var(--primary)]" : ""} gap-2 w-full md:w-auto mt-2 md:mt-0`}>
          <Search className="h-5 w-5" />
          Search
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
