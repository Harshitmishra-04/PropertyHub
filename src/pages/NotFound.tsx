import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-20">
        <BackButton label="Back to Home" to="/" />
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <h1 className="mb-4 text-6xl font-bold">404</h1>
            <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
            <p className="mb-6 text-sm text-muted-foreground">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <Button asChild>
              <Link to="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
