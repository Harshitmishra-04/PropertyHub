import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import SearchBar, { SearchFilters } from "@/components/SearchBar";
import PropertyCard from "@/components/PropertyCard";
import { useProperties } from "@/contexts/PropertiesContext";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, Shield, TrendingUp } from "lucide-react";
import heroImage from "@/assets/hero-property.jpg";
import AIChatAssistant from "@/components/AIChatAssistant";
import AIRecommendations from "@/components/AIRecommendations";

const Home = () => {
  const navigate = useNavigate();
  const [searchFilters, setSearchFilters] = useState<SearchFilters | null>(null);
  const { properties, loading } = useProperties();

  const handleSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
    navigate("/buy", { state: { searchFilters: filters } });
  };
  const safeProperties = Array.isArray(properties) ? properties : [];
  const approvedProperties = safeProperties.filter(p => p && p.approvalStatus === "approved");
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Hero"
            className="h-full w-full object-cover opacity-20"
          />
        </div>
        <div className="container relative mx-auto px-4 py-20 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold text-primary-foreground md:text-6xl">
              Find Your Dream Property
            </h1>
            <p className="mb-8 text-lg text-primary-foreground/90 md:text-xl">
              Search from thousands of properties available for sale and rent across India
            </p>
            <div className="mx-auto max-w-4xl">
              <SearchBar onSearch={handleSearch} variant="hero" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <Building2 className="mb-3 h-12 w-12 text-primary" />
              <div className="text-3xl font-bold text-foreground">10,000+</div>
              <div className="text-muted-foreground">Properties Listed</div>
            </div>
            <div className="flex flex-col items-center text-center">
              <Shield className="mb-3 h-12 w-12 text-primary" />
              <div className="text-3xl font-bold text-foreground">100%</div>
              <div className="text-muted-foreground">Verified Listings</div>
            </div>
            <div className="flex flex-col items-center text-center">
              <TrendingUp className="mb-3 h-12 w-12 text-primary" />
              <div className="text-3xl font-bold text-foreground">50,000+</div>
              <div className="text-muted-foreground">Happy Customers</div>
            </div>
          </div>
        </div>
      </section>

      <AIRecommendations />

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Featured Properties</h2>
              <p className="mt-2 text-muted-foreground">
                Handpicked properties just for you
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/buy">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {approvedProperties.slice(0, 3).map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-primary to-primary/80 py-16 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to Find Your Perfect Home?</h2>
          <p className="mb-8 text-lg opacity-90">
            Join thousands of happy homeowners who found their dream property with us
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/buy">Browse Properties</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <Link to="/sell">List Your Property</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2 text-xl font-bold text-primary">
                <Building2 className="h-6 w-6" />
                PropertyHub
              </div>
              <p className="text-sm text-muted-foreground">
                Your trusted partner in finding the perfect property
              </p>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Quick Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/buy" className="hover:text-primary">Buy</Link></li>
                <li><Link to="/rent" className="hover:text-primary">Rent</Link></li>
                <li><Link to="/sell" className="hover:text-primary">Sell</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/about" className="hover:text-primary">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
                <li><Link to="/careers" className="hover:text-primary">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/terms" className="hover:text-primary">Terms of Service</Link></li>
                <li><Link to="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            © 2024 PropertyHub. All rights reserved.
          </div>
        </div>
      </footer>
      <AIChatAssistant />
    </div>
  );
};

export default Home;
