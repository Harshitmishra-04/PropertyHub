import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface FilterSidebarProps {
  onFilterChange?: (filters: any) => void;
}

const FilterSidebar = ({ onFilterChange }: FilterSidebarProps) => {
  const [priceRange, setPriceRange] = useState([0, 50000000]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);
  const [selectedBHK, setSelectedBHK] = useState<number[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [constructionStatus, setConstructionStatus] = useState<"ready" | "under-construction" | "all">("all");
  const [furnished, setFurnished] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("all");

  const handlePropertyTypeChange = (type: string, checked: boolean) => {
    setSelectedPropertyTypes((prev) =>
      checked ? [...prev, type] : prev.filter((t) => t !== type)
    );
  };

  const handleBHKChange = (bhk: number, checked: boolean) => {
    setSelectedBHK((prev) =>
      checked ? [...prev, bhk] : prev.filter((b) => b !== bhk)
    );
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setSelectedAmenities((prev) =>
      checked ? [...prev, amenity] : prev.filter((a) => a !== amenity)
    );
  };

  const handleApplyFilters = () => {
    onFilterChange?.({
      propertyTypes: selectedPropertyTypes,
      bedrooms: selectedBHK,
      bhk: selectedBHK,
      amenities: selectedAmenities,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      constructionStatus: constructionStatus !== "all" ? constructionStatus : undefined,
      furnished: furnished !== "all" ? furnished : undefined,
      city: selectedCity !== "all" ? selectedCity : undefined,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Property Type</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {["Apartment", "Villa", "House", "Plot", "Commercial"].map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={type}
                checked={selectedPropertyTypes.includes(type)}
                onCheckedChange={(checked) => handlePropertyTypeChange(type, checked as boolean)}
              />
              <Label htmlFor={type} className="cursor-pointer">
                {type}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">BHK Type</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3, 4, 5].map((bhk) => (
            <div key={bhk} className="flex items-center space-x-2">
              <Checkbox
                id={`bhk-${bhk}`}
                checked={selectedBHK.includes(bhk)}
                onCheckedChange={(checked) => handleBHKChange(bhk, checked as boolean)}
              />
              <Label htmlFor={`bhk-${bhk}`} className="cursor-pointer">
                {bhk === 5 ? '5+ BHK' : `${bhk} BHK`}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>₹{(priceRange[0] / 100000).toFixed(0)}L</span>
            <span>₹{(priceRange[1] / 10000000).toFixed(0)}Cr</span>
          </div>
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={50000000}
            step={100000}
            className="w-full"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">City</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedCity || undefined} onValueChange={setSelectedCity}>
            <SelectTrigger>
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              <SelectItem value="Mumbai">Mumbai</SelectItem>
              <SelectItem value="Bangalore">Bangalore</SelectItem>
              <SelectItem value="Delhi">Delhi</SelectItem>
              <SelectItem value="Pune">Pune</SelectItem>
              <SelectItem value="Gurgaon">Gurgaon</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Construction Status</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={constructionStatus} onValueChange={(value) => setConstructionStatus(value as any)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="status-all" />
              <Label htmlFor="status-all" className="cursor-pointer">All</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ready" id="status-ready" />
              <Label htmlFor="status-ready" className="cursor-pointer">Ready to Move</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="under-construction" id="status-uc" />
              <Label htmlFor="status-uc" className="cursor-pointer">Under Construction</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Furnishing</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={furnished || undefined} onValueChange={setFurnished}>
            <SelectTrigger>
              <SelectValue placeholder="Select furnishing" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="furnished">Furnished</SelectItem>
              <SelectItem value="semi-furnished">Semi-Furnished</SelectItem>
              <SelectItem value="unfurnished">Unfurnished</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Amenities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {["Parking", "Gym", "Swimming Pool", "Garden", "Security"].map((amenity) => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox
                id={amenity}
                checked={selectedAmenities.includes(amenity)}
                onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
              />
              <Label htmlFor={amenity} className="cursor-pointer">
                {amenity}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      <Button className="w-full" onClick={handleApplyFilters}>Apply Filters</Button>
    </div>
  );
};

export default FilterSidebar;
