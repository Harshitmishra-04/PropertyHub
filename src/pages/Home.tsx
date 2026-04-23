import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import SearchBar, { SearchFilters } from "@/components/SearchBar";
import PropertyCard from "@/components/PropertyCard";
import { useProperties } from "@/contexts/PropertiesContext";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, Shield, TrendingUp, Star } from "lucide-react";
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
      
      <section className="relative min-h-[95vh] flex items-center overflow-hidden bg-background pt-20">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, -30, 0]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-20 -left-20 w-[40rem] h-[40rem] bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70" 
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.5, 1],
              x: [0, -50, 0],
              y: [0, 50, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-40 -right-20 w-[35rem] h-[35rem] bg-indigo-300/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70" 
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              x: [0, 30, 0],
              y: [0, -40, 0]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute -bottom-40 left-1/2 w-[30rem] h-[30rem] bg-sky-300/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-60" 
          />
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] z-0"></div>

        <div className="container relative mx-auto px-4 z-10 w-full flex flex-col items-center pt-10 pb-20">
          
          {/* Floating Decorator Cards */}
          <motion.div
            initial={{ opacity: 0, x: -100, rotate: -10 }}
            animate={{ opacity: 1, x: 0, rotate: -6, y: [0, -15, 0] }}
            transition={{ 
              opacity: { duration: 0.8 },
              x: { duration: 0.8, type: "spring", stiffness: 50 },
              y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
            }}
            className="hidden lg:flex absolute left-4 top-20 flex-col items-center bg-white p-4 rounded-2xl shadow-xl border border-white/40 backdrop-blur-md z-20"
          >
            <div className="flex gap-2 mb-2">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            </div>
            <span className="text-sm font-bold text-slate-800">Top Rated Agency</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 100, rotate: 10 }}
            animate={{ opacity: 1, x: 0, rotate: 6, y: [0, 15, 0] }}
            transition={{ 
              opacity: { duration: 0.8, delay: 0.2 },
              x: { duration: 0.8, type: "spring", stiffness: 50, delay: 0.2 },
              y: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }
            }}
            className="hidden lg:flex absolute right-4 top-40 items-center gap-3 bg-white/90 p-4 rounded-2xl shadow-xl border border-white/40 backdrop-blur-md z-20"
          >
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800">100% Secure</div>
              <div className="text-xs text-slate-500">Verified Properties</div>
            </div>
          </motion.div>

          <div className="mx-auto max-w-5xl text-center flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, type: "spring", bounce: 0.5 }}
              className="mb-8 inline-flex items-center rounded-full border border-primary/30 bg-white/80 px-5 py-2 text-sm font-bold text-primary shadow-lg backdrop-blur-md hover:scale-105 transition-transform cursor-pointer"
            >
              <span className="flex h-2.5 w-2.5 rounded-full bg-primary mr-3 animate-pulse"></span>
              ✨ Discover The New Way To Real Estate
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, type: "spring", stiffness: 80 }}
              className="mb-6 text-6xl font-extrabold tracking-tight text-foreground md:text-7xl lg:text-[6rem] leading-[1.1] drop-shadow-sm"
            >
              Find Your <br className="hidden md:block"/> 
              <span className="relative inline-block mt-2">
                <span className="relative z-10 text-white bg-primary px-6 py-2 rounded-3xl shadow-xl inline-block -rotate-2 transform hover:rotate-0 transition-transform duration-300">
                  Perfect Home
                </span>
                <motion.svg 
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.5, delay: 0.8, ease: "easeInOut" }}
                  className="absolute w-full h-8 -bottom-6 left-0 text-primary/30 -z-10" 
                  viewBox="0 0 100 20" 
                  preserveAspectRatio="none"
                >
                  <path d="M0 10 Q 50 20 100 10" stroke="currentColor" strokeWidth="4" fill="transparent" strokeLinecap="round" />
                </motion.svg>
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-12 text-lg text-muted-foreground md:text-2xl font-medium max-w-2xl leading-relaxed"
            >
              Explore thousands of premier properties for sale and rent across the country with our intelligent search.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4, type: "spring", stiffness: 100 }}
              className="w-full relative z-30"
            >
              <SearchBar onSearch={handleSearch} variant="hero" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.6, type: "spring", stiffness: 50 }}
              className="mt-20 w-full max-w-6xl relative rounded-[3rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.25)] border-[8px] border-white/80 bg-white group cursor-pointer"
            >
              <div className="aspect-[21/9] w-full relative overflow-hidden">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  src={heroImage}
                  alt="Modern Home"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                
                {/* Floating Play Button overlay on image */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.5, type: "spring" }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <div className="w-20 h-20 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 shadow-2xl group-hover:bg-white/50 transition-colors">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[14px] border-l-primary border-b-8 border-b-transparent ml-1" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-background py-10 relative z-20 -mt-16 md:-mt-28">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {[
              { icon: Building2, count: "10,000+", label: "Properties Listed" },
              { icon: Shield, count: "100%", label: "Verified Listings" },
              { icon: TrendingUp, count: "50,000+", label: "Happy Customers" }
            ].map((stat, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true, margin: "-50px" }}
                 transition={{ delay: i * 0.15, duration: 0.6, type: "spring", stiffness: 80 }}
                 className="flex flex-col items-center text-center p-8 rounded-[2rem] bg-white/80 backdrop-blur-xl border border-border/40 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-2 hover:shadow-[0_30px_50px_-15px_rgba(0,0,0,0.1)] transition-all duration-300"
               >
                 <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                   <stat.icon className="h-8 w-8 text-primary" />
                 </div>
                 <div className="text-4xl font-extrabold text-foreground mb-2">{stat.count}</div>
                 <div className="text-muted-foreground font-medium text-lg">{stat.label}</div>
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
