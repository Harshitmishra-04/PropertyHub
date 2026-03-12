import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";
import { useProperties } from "@/contexts/PropertiesContext";
import { useLeads } from "@/contexts/LeadsContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Maximize, Share2, Heart, Phone, Mail, GitCompare, Building2, Star, Eye, MessageSquare, Home, School, Hospital, ShoppingBag, Train, Video, FileText, User, Briefcase, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useRecentlyViewed } from "@/contexts/RecentlyViewedContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useComparison } from "@/contexts/ComparisonContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import PropertyMap from "@/components/PropertyMap";
import PropertyReviews from "@/components/PropertyReviews";
import PropertyCard from "@/components/PropertyCard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { properties, incrementViews, incrementEnquiries, deleteProperty } = useProperties();
  const { addLead } = useLeads();
  const { user, isAdmin } = useAuth();
  const property = properties.find((p) => p.id === id);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToRecentlyViewed } = useRecentlyViewed();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToComparison, isInComparison, removeFromComparison } = useComparison();

  const isPropertyOwner = property && user && (
    property.sellerInfo.email === user.email || 
    property.sellerInfo.id === user.id
  );
  
  const canDelete = isAdmin || isPropertyOwner;

  useEffect(() => {
    if (id) {
      addToRecentlyViewed(id);
      incrementViews(id);
    }
  }, [id, addToRecentlyViewed, incrementViews]);

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">Property not found</h1>
          <Link to="/" className="mt-4 inline-block text-primary hover:underline">
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const buyerName = (formData.get('name') as string) || '';
    const buyerEmail = (formData.get('email') as string) || '';
    const buyerPhone = (formData.get('phone') as string) || '';
    const message = (formData.get('message') as string) || '';

    if (!buyerName.trim() || !buyerEmail.trim() || !buyerPhone.trim()) {
      toast.error("Please fill in your name, email and phone.");
      return;
    }

    if (id && property) {
      try {
        await incrementEnquiries(id);
        await addLead({
          propertyId: id,
          propertyTitle: property.title,
          sellerId: property.sellerInfo.id,
          sellerName: property.sellerInfo.name,
          buyerName: buyerName.trim(),
          buyerEmail: buyerEmail.trim(),
          buyerPhone: buyerPhone.trim(),
          message: message.trim() || undefined,
        });
        toast.success("Your inquiry has been sent successfully!");
        (e.target as HTMLFormElement).reset();
      } catch (error) {
        console.error("Inquiry error:", error);
        toast.error("Failed to send inquiry. Please try again.");
      }
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: property.title,
      text: `Check out this property: ${property.title} - ₹${property.price.toLocaleString("en-IN")}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success("Property shared successfully!");
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        toast.error("Failed to share property");
      }
    }
  };

  const handleDelete = () => {
    if (!id) return;
    deleteProperty(id);
    toast.success("Property deleted successfully!");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <BackButton label="Back to Properties" />
        <div className="mb-8 grid gap-4 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <div className="relative aspect-video overflow-hidden rounded-xl">
              <img
                src={property.images[selectedImage]}
                alt={property.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute right-4 top-4 flex gap-2">
                {canDelete && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="icon" variant="destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Property</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{property.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
                <Button size="icon" variant="secondary" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() => {
                    toggleFavorite(property.id);
                    toast.success(isFavorite(property.id) ? 'Removed from favorites' : 'Added to favorites');
                  }}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      isFavorite(property.id) ? 'fill-destructive text-destructive' : ''
                    }`}
                  />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() => {
                    if (isInComparison(property.id)) {
                      removeFromComparison(property.id);
                    } else {
                      addToComparison(property.id);
                    }
                  }}
                >
                  <GitCompare
                    className={`h-4 w-4 ${
                      isInComparison(property.id) ? 'text-primary' : ''
                    }`}
                  />
                </Button>
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-4 lg:flex-col">
            {property.images.slice(0, 3).map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative aspect-video overflow-hidden rounded-lg ${
                  selectedImage === index ? "ring-2 ring-primary" : ""
                }`}
              >
                <img
                  src={image}
                  alt={`View ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                  <Badge
                      variant={property.type === "sale" ? "default" : property.type === "leasing" ? "secondary" : "outline"}
                    className="mb-2"
                  >
                      For {property.type === "sale" ? "Sale" : property.type === "leasing" ? "Leasing" : "Rent"}
                    </Badge>
                    {property.featured && (
                      <Badge variant="default" className="bg-yellow-500">
                        <Star className="mr-1 h-3 w-3" />
                        Featured
                      </Badge>
                    )}
                    <Badge variant="outline">
                      {property.constructionStatus === "ready" ? "Ready to Move" : "Under Construction"}
                  </Badge>
                  </div>
                  <h1 className="text-3xl font-bold">{property.title}</h1>
                  <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-5 w-5" />
                    <span>{property.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">
                    ₹{property.price.toLocaleString("en-IN")}
                  </div>
                  {property.type === "rent" && (
                    <span className="text-sm text-muted-foreground">/month</span>
                  )}
                  {property.type === "leasing" && (
                    <span className="text-sm text-muted-foreground">/month</span>
                  )}
                  <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{property.views || 0} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{property.enquiries || 0} enquiries</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-6 border-y py-4">
                <div className="flex items-center gap-2">
                  <Bed className="h-5 w-5 text-muted-foreground" />
                  <span className="font-semibold">{property.bedrooms}</span>
                  <span className="text-sm text-muted-foreground">Bedrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="h-5 w-5 text-muted-foreground" />
                  <span className="font-semibold">{property.bathrooms}</span>
                  <span className="text-sm text-muted-foreground">Bathrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Maximize className="h-5 w-5 text-muted-foreground" />
                  <span className="font-semibold">{property.area}</span>
                  <span className="text-sm text-muted-foreground">sqft</span>
                </div>
              </div>
            </div>

            <Card>
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-bold">Description</h2>
                <p className="text-muted-foreground">{property.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-bold">Property Details</h2>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {property.facing && (
                    <div>
                      <p className="text-sm text-muted-foreground">Facing</p>
                      <p className="font-semibold">{property.facing}</p>
                    </div>
                  )}
                  {property.furnished && (
                    <div>
                      <p className="text-sm text-muted-foreground">Furnishing</p>
                      <p className="font-semibold capitalize">{property.furnished.replace('-', ' ')}</p>
                    </div>
                  )}
                  {property.parking !== undefined && (
                    <div>
                      <p className="text-sm text-muted-foreground">Parking</p>
                      <p className="font-semibold">{property.parking} {property.parking === 1 ? 'space' : 'spaces'}</p>
                    </div>
                  )}
                  {property.floor !== undefined && (
                    <div>
                      <p className="text-sm text-muted-foreground">Floor</p>
                      <p className="font-semibold">{property.floor} of {property.totalFloors}</p>
                    </div>
                  )}
                  {property.age !== undefined && (
                    <div>
                      <p className="text-sm text-muted-foreground">Age</p>
                      <p className="font-semibold">{property.age} {property.age === 1 ? 'year' : 'years'}</p>
                    </div>
                  )}
                  {property.bhk && (
                    <div>
                      <p className="text-sm text-muted-foreground">BHK</p>
                      <p className="font-semibold">{property.bhk} BHK</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {property.floorPlan && (
              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold">Floor Plan</h2>
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="rounded-lg border">
                    <img
                      src={property.floorPlan}
                      alt="Floor Plan"
                      className="h-auto w-full rounded-lg"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {property.virtualTour && (
              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold">Virtual Tour</h2>
                    <Video className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <iframe
                      src={property.virtualTour}
                      className="h-full w-full"
                      allow="fullscreen"
                      title="Virtual Tour"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {property.neighborhood && (
              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold">Neighborhood Insights</h2>
                    {property.neighborhood.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{property.neighborhood.rating}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    {property.neighborhood.schools && property.neighborhood.schools.length > 0 && (
                      <div>
                        <div className="mb-2 flex items-center gap-2">
                          <School className="h-4 w-4 text-muted-foreground" />
                          <h3 className="font-semibold">Schools</h3>
                        </div>
                        <ul className="ml-6 list-disc space-y-1 text-sm text-muted-foreground">
                          {property.neighborhood.schools.map((school, idx) => (
                            <li key={idx}>{school}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {property.neighborhood.hospitals && property.neighborhood.hospitals.length > 0 && (
                      <div>
                        <div className="mb-2 flex items-center gap-2">
                          <Hospital className="h-4 w-4 text-muted-foreground" />
                          <h3 className="font-semibold">Hospitals</h3>
                        </div>
                        <ul className="ml-6 list-disc space-y-1 text-sm text-muted-foreground">
                          {property.neighborhood.hospitals.map((hospital, idx) => (
                            <li key={idx}>{hospital}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {property.neighborhood.shoppingMalls && property.neighborhood.shoppingMalls.length > 0 && (
                      <div>
                        <div className="mb-2 flex items-center gap-2">
                          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                          <h3 className="font-semibold">Shopping Malls</h3>
                        </div>
                        <ul className="ml-6 list-disc space-y-1 text-sm text-muted-foreground">
                          {property.neighborhood.shoppingMalls.map((mall, idx) => (
                            <li key={idx}>{mall}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {property.neighborhood.connectivity && property.neighborhood.connectivity.length > 0 && (
                      <div>
                        <div className="mb-2 flex items-center gap-2">
                          <Train className="h-4 w-4 text-muted-foreground" />
                          <h3 className="font-semibold">Connectivity</h3>
                        </div>
                        <ul className="ml-6 list-disc space-y-1 text-sm text-muted-foreground">
                          {property.neighborhood.connectivity.map((conn, idx) => (
                            <li key={idx}>{conn}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-bold">Amenities</h2>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {property.amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-2 rounded-lg bg-muted p-3"
                    >
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span className="text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {property.coordinates && property.coordinates.lat && property.coordinates.lng && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-4 text-xl font-bold">Location</h2>
                  <PropertyMap
                    latitude={property.coordinates.lat}
                    longitude={property.coordinates.lng}
                    title={property.title}
                  />
                </CardContent>
              </Card>
            )}

            <PropertyReviews propertyId={property.id} />
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  {property.sellerInfo.type === "builder" ? (
                    <Building2 className="h-5 w-5 text-primary" />
                  ) : property.sellerInfo.type === "broker" ? (
                    <Briefcase className="h-5 w-5 text-primary" />
                  ) : (
                    <User className="h-5 w-5 text-primary" />
                  )}
                  <h2 className="text-xl font-bold">
                    {property.sellerInfo.type === "builder" ? "Builder" : property.sellerInfo.type === "broker" ? "Broker" : "Owner"}
                  </h2>
                </div>
                <div className="mb-4 space-y-2">
                  <p className="font-semibold">{property.sellerInfo.name}</p>
                  {property.sellerInfo.company && (
                    <p className="text-sm text-muted-foreground">{property.sellerInfo.company}</p>
                  )}
                  {property.sellerInfo.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold">{property.sellerInfo.rating}</span>
                      {property.sellerInfo.totalListings && (
                        <span className="text-sm text-muted-foreground">
                          ({property.sellerInfo.totalListings} listings)
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="mb-4 space-y-2 border-t pt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${property.sellerInfo.phone}`} className="text-primary hover:underline">
                      {property.sellerInfo.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${property.sellerInfo.email}`} className="text-primary hover:underline">
                      {property.sellerInfo.email}
                    </a>
                  </div>
                </div>
                <h2 className="mb-4 text-xl font-bold">Contact Owner</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="mb-3 w-full gap-2">
                      <Phone className="h-4 w-4" />
                      Schedule a Visit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Schedule a Property Visit</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <Input name="name" placeholder="Your Name" defaultValue={user?.name || ''} required />
                      <Input name="email" type="email" placeholder="Your Email" defaultValue={user?.email || ''} required />
                      <Input name="phone" type="tel" placeholder="Your Phone" required />
                      <Textarea name="message" placeholder="Your Message (optional)" />
                      <Button type="submit" className="w-full">
                        Send Inquiry
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" className="w-full gap-2" asChild>
                  <a
                    href={`mailto:${property.sellerInfo.email}?subject=${encodeURIComponent(
                      `Inquiry about ${property.title}`
                    )}&body=${encodeURIComponent(
                      `Hi ${property.sellerInfo.name},\n\nI am interested in your property "${property.title}" located at ${property.location}. Please share more details.\n\nThank you,\n`
                    )}`}
                  >
                    <Mail className="h-4 w-4" />
                    Send Email
                  </a>
                </Button>
                <div className="mt-6 rounded-lg bg-muted p-4">
                  <p className="text-sm text-muted-foreground">
                    Response time: Within 2 hours
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="mb-6 text-2xl font-bold">Similar Properties</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {properties
              .filter((p) => p && p.id && p.id !== property.id && p.type === property.type && p.approvalStatus === "approved")
              .slice(0, 3)
              .map((prop) => {
                if (!prop || !prop.id) return null;
                return <PropertyCard key={prop.id} property={prop} />;
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
