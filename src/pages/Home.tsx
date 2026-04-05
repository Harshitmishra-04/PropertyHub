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
import { motion } from "framer-motion";

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
      
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-black/40">
        <div className="absolute inset-0 -z-10">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src={heroImage}
            alt="Hero"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/60" />
        </div>
        <div className="container relative mx-auto px-4 z-10 w-full">
          <div className="mx-auto max-w-4xl text-center flex flex-col items-center bg-black/30 p-8 md:p-16 rounded-[3rem] backdrop-blur-md border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mb-6 text-5xl font-extrabold tracking-tight text-white md:text-7xl lg:text-8xl drop-shadow-2xl"
            >
              Discover Your <br className="hidden md:block"/> <span className="text-primary italic font-light">Dream Property</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-10 text-lg text-white/90 md:text-2xl font-light max-w-2xl drop-shadow"
            >
              Explore thousands of premier properties for sale and rent across India.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="w-full"
            >
              <SearchBar onSearch={handleSearch} variant="hero" />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-background py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              { icon: Building2, count: "10,000+", label: "Properties Listed" },
              { icon: Shield, count: "100%", label: "Verified Listings" },
              { icon: TrendingUp, count: "50,000+", label: "Happy Customers" }
            ].map((stat, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: i * 0.1, duration: 0.5 }}
                 className="flex flex-col items-center text-center p-6 rounded-2xl bg-muted/50 border border-border/50 hover:bg-muted/80 transition-colors"
               >
                 <stat.icon className="mb-4 h-12 w-12 text-primary" />
                 <div className="text-4xl font-bold text-foreground mb-2">{stat.count}</div>
                 <div className="text-muted-foreground font-medium">{stat.label}</div>
               </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AIRecommendations />

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4"
          >
            <div>
              <h2 className="text-4xl font-bold text-foreground tracking-tight">Featured Properties</h2>
              <p className="mt-3 text-lg text-muted-foreground max-w-2xl">
                Handpicked premium properties curated explicitly for your highly refined taste.
              </p>
            </div>
            <Button variant="outline" className="rounded-full px-6" asChild>
              <Link to="/buy">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {approvedProperties.slice(0, 3).map((property, idx) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
              >
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-primary z-0" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay z-0" />
        <div className="container relative mx-auto px-4 text-center z-10 text-primary-foreground">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-6 text-4xl md:text-5xl font-bold tracking-tight">Ready to Find Your Perfect Home?</h2>
            <p className="mb-10 text-xl opacity-90 max-w-2xl mx-auto font-light">
              Join thousands of happy homeowners who found their dream property with us.
            </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row mt-8">
            <Button size="lg" variant="secondary" className="rounded-full px-8 h-14 text-lg hidden md:flex" asChild>
              <Link to="/buy">Browse Properties</Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-lg border-primary-foreground bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <Link to="/sell">List Your Property</Link>
            </Button>
          </div>
          </motion.div>
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
