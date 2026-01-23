import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";
import LocationPicker from "@/components/LocationPicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useProperties } from "@/contexts/PropertiesContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Upload, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormErrors {
  title?: string;
  location?: string;
  price?: string;
  city?: string;
  locality?: string;
  bedrooms?: string;
  bathrooms?: string;
  area?: string;
  description?: string;
  sellerName?: string;
  sellerEmail?: string;
  sellerPhone?: string;
}

const SellProperty = () => {
  const navigate = useNavigate();
  const { addProperty } = useProperties();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    type: "sale" as "sale" | "rent" | "leasing",
    location: "",
    city: "",
    locality: "",
    area: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    propertyType: "Apartment" as "Apartment" | "Villa" | "Plot" | "Commercial" | "House",
    description: "",
    amenities: "",
    image: "",
    images: "",
    coordinates: { lat: 20.5937, lng: 78.9629 },
    constructionStatus: "ready" as "ready" | "under-construction",
    floorPlan: "",
    virtualTour: "",
    facing: undefined as string | undefined,
    furnished: "unfurnished" as "furnished" | "semi-furnished" | "unfurnished",
    parking: "",
    floor: "",
    totalFloors: "",
    age: "",
    bhk: "",
    sellerName: "",
    sellerEmail: "",
    sellerPhone: "",
    sellerType: "owner" as "owner" | "broker" | "builder",
    sellerCompany: "",
    featured: false,
    listingPackage: "free" as "free" | "featured" | "premium" | "banner",
  });

  // Convert file to base64 for localStorage storage
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      toast.error("Please select valid image files");
      return;
    }

    if (imageFiles.length + uploadedImages.length > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }

    try {
      const base64Images = await Promise.all(imageFiles.map(file => fileToBase64(file)));
      setUploadedImages(prev => [...prev, ...base64Images]);
      
      // Set first uploaded image as main image if no main image is set
      if (!formData.image && base64Images.length > 0) {
        setFormData(prev => ({ ...prev, image: base64Images[0] }));
      }
      
      toast.success(`${imageFiles.length} image(s) uploaded successfully`);
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error("Failed to upload images. Please try again.");
    }
  };

  const removeUploadedImage = (index: number) => {
    setUploadedImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      // Update main image if we removed it
      if (index === 0 && newImages.length > 0) {
        setFormData(prev => ({ ...prev, image: newImages[0] }));
      } else if (newImages.length === 0) {
        setFormData(prev => ({ ...prev, image: "" }));
      }
      return newImages;
    });
  };

  const validateField = (name: keyof FormErrors, value: string): string => {
    switch (name) {
      case 'title':
        if (!value.trim()) return 'Property title is required';
        if (value.trim().length < 5) return 'Title must be at least 5 characters';
        break;
      case 'location':
        if (!value.trim()) return 'Location is required';
        break;
      case 'city':
        if (!value.trim()) return 'City is required';
        break;
      case 'locality':
        if (!value.trim()) return 'Locality is required';
        break;
      case 'price':
        if (!value.trim()) return 'Price is required';
        if (isNaN(parseFloat(value)) || parseFloat(value) <= 0) return 'Please enter a valid price';
        break;
      case 'bedrooms':
        if (!value.trim()) return 'Number of bedrooms is required';
        if (isNaN(parseInt(value)) || parseInt(value) < 0) return 'Please enter a valid number';
        break;
      case 'bathrooms':
        if (!value.trim()) return 'Number of bathrooms is required';
        if (isNaN(parseInt(value)) || parseInt(value) < 0) return 'Please enter a valid number';
        break;
      case 'area':
        if (!value.trim()) return 'Area is required';
        if (isNaN(parseFloat(value)) || parseFloat(value) <= 0) return 'Please enter a valid area';
        break;
      case 'description':
        if (!value.trim()) return 'Description is required';
        if (value.trim().length < 20) return 'Description must be at least 20 characters';
        break;
      case 'sellerName':
        if (!value.trim()) return 'Seller name is required';
        break;
      case 'sellerEmail':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email';
        break;
      case 'sellerPhone':
        if (!value.trim()) return 'Phone number is required';
        if (!/^[\d\s\+\-\(\)]+$/.test(value)) return 'Please enter a valid phone number';
        break;
    }
    return '';
  };

  const handleFieldChange = (field: keyof FormErrors, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleBlur = (field: keyof FormErrors) => {
    const value = formData[field as keyof typeof formData] as string;
    const error = validateField(field, value || '');
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    newErrors.title = validateField('title', formData.title);
    newErrors.location = validateField('location', formData.location);
    newErrors.city = validateField('city', formData.city);
    newErrors.locality = validateField('locality', formData.locality);
    newErrors.price = validateField('price', formData.price);
    newErrors.bedrooms = validateField('bedrooms', formData.bedrooms);
    newErrors.bathrooms = validateField('bathrooms', formData.bathrooms);
    newErrors.area = validateField('area', formData.area);
    newErrors.description = validateField('description', formData.description);
    newErrors.sellerName = validateField('sellerName', formData.sellerName || user?.name || '');
    newErrors.sellerEmail = validateField('sellerEmail', formData.sellerEmail || user?.email || '');
    newErrors.sellerPhone = validateField('sellerPhone', formData.sellerPhone);

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    const parts = address.split(',');
    const locality = parts[0]?.trim() || "";
    const city = parts[parts.length - 1]?.trim() || "";
    
    setFormData(prev => ({
      ...prev,
      location: address,
      locality: locality || prev.locality,
      city: city || prev.city,
      coordinates: { lat, lng },
    }));

    // Clear location error
    if (errors.location) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.location;
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    // Combine uploaded images with URL images
    const urlImages = formData.images
      ? formData.images.split(',').map(img => img.trim()).filter(Boolean)
      : [];
    
    const allImages = uploadedImages.length > 0 
      ? [...uploadedImages, ...urlImages]
      : formData.image
      ? [formData.image, ...urlImages]
      : urlImages.length > 0
      ? urlImages
      : ["/placeholder.svg"];

    try {
      await addProperty({
        title: formData.title.trim(),
        type: formData.type,
        location: formData.location.trim(),
        city: formData.city.trim() || "Unknown",
        locality: formData.locality.trim() || formData.location.trim(),
        area: parseFloat(formData.area) || 0,
        price: parseFloat(formData.price) || 0,
        bedrooms: parseInt(formData.bedrooms) || 0,
        bathrooms: parseInt(formData.bathrooms) || 0,
        propertyType: formData.propertyType,
        description: formData.description.trim(),
        amenities: formData.amenities.split(',').map(a => a.trim()).filter(Boolean),
        image: allImages[0] || "/placeholder.svg",
        images: allImages,
        coordinates: formData.coordinates,
        constructionStatus: formData.constructionStatus,
        floorPlan: formData.floorPlan || undefined,
        virtualTour: formData.virtualTour || undefined,
        sellerInfo: {
          id: user?.id || `seller-${Date.now()}`,
          name: formData.sellerName.trim() || user?.name || "Unknown",
          email: formData.sellerEmail.trim() || user?.email || "",
          phone: formData.sellerPhone.trim() || "",
          type: formData.sellerType,
          company: formData.sellerCompany || undefined,
        },
        featured: formData.featured,
        listingPackage: formData.listingPackage,
        facing: formData.facing || undefined,
        furnished: formData.furnished,
        parking: formData.parking ? parseInt(formData.parking) : undefined,
        floor: formData.floor ? parseInt(formData.floor) : undefined,
        totalFloors: formData.totalFloors ? parseInt(formData.totalFloors) : undefined,
        age: formData.age ? parseInt(formData.age) : undefined,
        bhk: formData.bhk ? parseInt(formData.bhk) : undefined,
      });

      toast.success("Property submitted successfully! It's pending approval.");
      navigate("/dashboard");
    } catch (error: any) {
      console.error('Error submitting property:', error);
      toast.error(error?.message || "Failed to submit property. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <BackButton label="Back to Home" to="/" />
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold">List Your Property</h1>
            <p className="text-lg text-muted-foreground">
              Fill in the details below to list your property
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Property Title <span className="text-destructive">*</span></Label>
                  <Input
                    id="title"
                    placeholder="e.g., Luxury 3BHK Apartment in Bandra"
                    value={formData.title}
                    onChange={(e) => handleFieldChange('title', e.target.value)}
                    onBlur={() => handleBlur('title')}
                    className={cn(errors.title && "border-destructive")}
                    required
                    disabled={isSubmitting}
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.title}
                    </p>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="propertyType">Property Type <span className="text-destructive">*</span></Label>
                    <Select 
                      value={formData.propertyType}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, propertyType: value as any }))}
                      required
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className={cn(errors.propertyType && "border-destructive")}>
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Apartment">Apartment</SelectItem>
                        <SelectItem value="Villa">Villa</SelectItem>
                        <SelectItem value="House">House</SelectItem>
                        <SelectItem value="Plot">Plot</SelectItem>
                        <SelectItem value="Commercial">Commercial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="listingType">Listing Type <span className="text-destructive">*</span></Label>
                    <Select 
                      value={formData.type} 
                      onValueChange={(value: "sale" | "rent" | "leasing") => setFormData(prev => ({ ...prev, type: value }))}
                      required
                      disabled={isSubmitting}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sale">For Sale</SelectItem>
                        <SelectItem value="rent">For Rent</SelectItem>
                        <SelectItem value="leasing">For Leasing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="city">City <span className="text-destructive">*</span></Label>
                    <Input
                      id="city"
                      placeholder="e.g., Mumbai"
                      value={formData.city}
                      onChange={(e) => handleFieldChange('city', e.target.value)}
                      onBlur={() => handleBlur('city')}
                      className={cn(errors.city && "border-destructive")}
                      required
                      disabled={isSubmitting}
                    />
                    {errors.city && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.city}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="locality">Locality <span className="text-destructive">*</span></Label>
                    <Input
                      id="locality"
                      placeholder="e.g., Bandra West"
                      value={formData.locality}
                      onChange={(e) => handleFieldChange('locality', e.target.value)}
                      onBlur={() => handleBlur('locality')}
                      className={cn(errors.locality && "border-destructive")}
                      required
                      disabled={isSubmitting}
                    />
                    {errors.locality && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.locality}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="constructionStatus">Construction Status <span className="text-destructive">*</span></Label>
                  <Select 
                    value={formData.constructionStatus} 
                    onValueChange={(value: "ready" | "under-construction") => setFormData(prev => ({ ...prev, constructionStatus: value }))}
                    required
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ready">Ready to Move</SelectItem>
                      <SelectItem value="under-construction">Under Construction</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Location <span className="text-destructive">*</span></Label>
                  <LocationPicker 
                    onLocationSelect={handleLocationSelect}
                    initialLat={formData.coordinates.lat}
                    initialLng={formData.coordinates.lng}
                  />
                  {errors.location && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.location}
                    </p>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Bedrooms <span className="text-destructive">*</span></Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      placeholder="e.g., 3"
                      value={formData.bedrooms}
                      onChange={(e) => handleFieldChange('bedrooms', e.target.value)}
                      onBlur={() => handleBlur('bedrooms')}
                      className={cn(errors.bedrooms && "border-destructive")}
                      required
                      min="0"
                      disabled={isSubmitting}
                    />
                    {errors.bedrooms && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.bedrooms}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Bathrooms <span className="text-destructive">*</span></Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      placeholder="e.g., 2"
                      value={formData.bathrooms}
                      onChange={(e) => handleFieldChange('bathrooms', e.target.value)}
                      onBlur={() => handleBlur('bathrooms')}
                      className={cn(errors.bathrooms && "border-destructive")}
                      required
                      min="0"
                      disabled={isSubmitting}
                    />
                    {errors.bathrooms && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.bathrooms}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bhk">BHK</Label>
                    <Input
                      id="bhk"
                      type="number"
                      placeholder="e.g., 3"
                      value={formData.bhk}
                      onChange={(e) => setFormData(prev => ({ ...prev, bhk: e.target.value }))}
                      min="0"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="area">Area (sqft) <span className="text-destructive">*</span></Label>
                    <Input
                      id="area"
                      type="number"
                      placeholder="e.g., 1200"
                      value={formData.area}
                      onChange={(e) => handleFieldChange('area', e.target.value)}
                      onBlur={() => handleBlur('area')}
                      className={cn(errors.area && "border-destructive")}
                      required
                      min="0"
                      disabled={isSubmitting}
                    />
                    {errors.area && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.area}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="parking">Parking Spaces</Label>
                    <Input
                      id="parking"
                      type="number"
                      placeholder="e.g., 2"
                      value={formData.parking}
                      onChange={(e) => setFormData(prev => ({ ...prev, parking: e.target.value }))}
                      min="0"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age">Age (years)</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="e.g., 5"
                      value={formData.age}
                      onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                      min="0"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="floor">Floor</Label>
                    <Input
                      id="floor"
                      type="number"
                      placeholder="e.g., 5"
                      value={formData.floor}
                      onChange={(e) => setFormData(prev => ({ ...prev, floor: e.target.value }))}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="totalFloors">Total Floors</Label>
                    <Input
                      id="totalFloors"
                      type="number"
                      placeholder="e.g., 10"
                      value={formData.totalFloors}
                      onChange={(e) => setFormData(prev => ({ ...prev, totalFloors: e.target.value }))}
                      min="0"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="facing">Facing (Optional)</Label>
                    <Select 
                      value={formData.facing || undefined} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, facing: value }))}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select facing (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="North">North</SelectItem>
                        <SelectItem value="South">South</SelectItem>
                        <SelectItem value="East">East</SelectItem>
                        <SelectItem value="West">West</SelectItem>
                        <SelectItem value="North-East">North-East</SelectItem>
                        <SelectItem value="North-West">North-West</SelectItem>
                        <SelectItem value="South-East">South-East</SelectItem>
                        <SelectItem value="South-West">South-West</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="furnished">Furnishing</Label>
                  <Select 
                    value={formData.furnished} 
                    onValueChange={(value: "furnished" | "semi-furnished" | "unfurnished") => setFormData(prev => ({ ...prev, furnished: value }))}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select furnishing" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="furnished">Furnished</SelectItem>
                      <SelectItem value="semi-furnished">Semi-Furnished</SelectItem>
                      <SelectItem value="unfurnished">Unfurnished</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹) <span className="text-destructive">*</span></Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="e.g., 15000000"
                    value={formData.price}
                    onChange={(e) => handleFieldChange('price', e.target.value)}
                    onBlur={() => handleBlur('price')}
                    className={cn(errors.price && "border-destructive")}
                    required
                    min="0"
                    disabled={isSubmitting}
                  />
                  {errors.price && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.price}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description <span className="text-destructive">*</span></Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your property..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleFieldChange('description', e.target.value)}
                    onBlur={() => handleBlur('description')}
                    className={cn(errors.description && "border-destructive")}
                    required
                    disabled={isSubmitting}
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.description}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amenities">Amenities (comma-separated)</Label>
                  <Input
                    id="amenities"
                    placeholder="e.g., Swimming Pool, Gym, Parking"
                    value={formData.amenities}
                    onChange={(e) => setFormData(prev => ({ ...prev, amenities: e.target.value }))}
                    disabled={isSubmitting}
                  />
                </div>

                {/* Image Upload Section */}
                <div className="space-y-4">
                  <Label>Property Images</Label>
                  <div className="space-y-4">
                    {/* File Upload */}
                    <div className="flex items-center gap-4">
                      <label
                        htmlFor="image-upload"
                        className={cn(
                          "flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
                          "hover:bg-accent hover:border-primary",
                          isSubmitting && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <Upload className="h-4 w-4" />
                        <span className="text-sm font-medium">Upload Images</span>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={isSubmitting}
                        />
                      </label>
                      <span className="text-sm text-muted-foreground">
                        (Max 10 images, JPG/PNG)
                      </span>
                    </div>

                    {/* Uploaded Images Preview */}
                    {uploadedImages.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {uploadedImages.map((img, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={img}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border"
                            />
                            {index === 0 && (
                              <span className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                                Main
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => removeUploadedImage(index)}
                              className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              disabled={isSubmitting}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* URL Input (Alternative) */}
                    <div className="space-y-2">
                      <Label htmlFor="image">Or enter Image URL (Main)</Label>
                      <Input
                        id="image"
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={formData.image}
                        onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                        disabled={isSubmitting || uploadedImages.length > 0}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="images">Additional Image URLs (comma-separated)</Label>
                      <Input
                        id="images"
                        type="text"
                        placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
                        value={formData.images}
                        onChange={(e) => setFormData(prev => ({ ...prev, images: e.target.value }))}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="floorPlan">Floor Plan URL (optional)</Label>
                  <Input
                    id="floorPlan"
                    type="url"
                    placeholder="https://example.com/floorplan.jpg"
                    value={formData.floorPlan}
                    onChange={(e) => setFormData(prev => ({ ...prev, floorPlan: e.target.value }))}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="virtualTour">Virtual Tour URL (optional)</Label>
                  <Input
                    id="virtualTour"
                    type="url"
                    placeholder="https://example.com/virtual-tour"
                    value={formData.virtualTour}
                    onChange={(e) => setFormData(prev => ({ ...prev, virtualTour: e.target.value }))}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="border-t pt-6">
                  <h3 className="mb-4 text-lg font-semibold">Seller Information</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="sellerType">Seller Type <span className="text-destructive">*</span></Label>
                      <Select 
                        value={formData.sellerType} 
                        onValueChange={(value: "owner" | "broker" | "builder") => setFormData(prev => ({ ...prev, sellerType: value }))}
                        required
                        disabled={isSubmitting}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="owner">Owner</SelectItem>
                          <SelectItem value="broker">Broker</SelectItem>
                          <SelectItem value="builder">Builder</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sellerName">Name <span className="text-destructive">*</span></Label>
                      <Input
                        id="sellerName"
                        placeholder={user?.name || "Your name"}
                        value={formData.sellerName}
                        onChange={(e) => handleFieldChange('sellerName', e.target.value)}
                        onBlur={() => handleBlur('sellerName')}
                        className={cn(errors.sellerName && "border-destructive")}
                        required
                        disabled={isSubmitting}
                      />
                      {errors.sellerName && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.sellerName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="sellerEmail">Email <span className="text-destructive">*</span></Label>
                      <Input
                        id="sellerEmail"
                        type="email"
                        placeholder={user?.email || "your@email.com"}
                        value={formData.sellerEmail}
                        onChange={(e) => handleFieldChange('sellerEmail', e.target.value)}
                        onBlur={() => handleBlur('sellerEmail')}
                        className={cn(errors.sellerEmail && "border-destructive")}
                        required
                        disabled={isSubmitting}
                      />
                      {errors.sellerEmail && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.sellerEmail}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sellerPhone">Phone <span className="text-destructive">*</span></Label>
                      <Input
                        id="sellerPhone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.sellerPhone}
                        onChange={(e) => handleFieldChange('sellerPhone', e.target.value)}
                        onBlur={() => handleBlur('sellerPhone')}
                        className={cn(errors.sellerPhone && "border-destructive")}
                        required
                        disabled={isSubmitting}
                      />
                      {errors.sellerPhone && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.sellerPhone}
                        </p>
                      )}
                    </div>
                  </div>

                  {(formData.sellerType === "broker" || formData.sellerType === "builder") && (
                    <div className="mt-4 space-y-2">
                      <Label htmlFor="sellerCompany">Company Name</Label>
                      <Input
                        id="sellerCompany"
                        placeholder="Company name"
                        value={formData.sellerCompany}
                        onChange={(e) => setFormData(prev => ({ ...prev, sellerCompany: e.target.value }))}
                        disabled={isSubmitting}
                      />
                    </div>
                  )}
                </div>

                <div className="border-t pt-6">
                  <h3 className="mb-4 text-lg font-semibold">Listing Options</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="featured"
                        checked={formData.featured}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked as boolean }))}
                        disabled={isSubmitting}
                      />
                      <Label htmlFor="featured" className="cursor-pointer">
                        Mark as Featured Listing
                      </Label>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="listingPackage">Listing Package</Label>
                      <Select 
                        value={formData.listingPackage} 
                        onValueChange={(value: "free" | "featured" | "premium" | "banner") => setFormData(prev => ({ ...prev, listingPackage: value }))}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select package" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free">Free</SelectItem>
                          <SelectItem value="featured">Featured</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                          <SelectItem value="banner">Banner</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Property Listing"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SellProperty;
