import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useRecentlyViewed } from "@/contexts/RecentlyViewedContext";
import { useProperties } from "@/contexts/PropertiesContext";
import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PropertyCard from "@/components/PropertyCard";
import { Heart, Clock, Building2, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const UserDashboard = () => {
  const { user } = useAuth();
  const { favorites } = useFavorites();
  const { recentlyViewed } = useRecentlyViewed();
  const { properties } = useProperties();

  const favoriteProperties = properties.filter((p) => favorites.includes(p.id));
  const recentProperties = properties.filter((p) => recentlyViewed.includes(p.id));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <BackButton label="Back to Home" to="/" />
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saved Properties</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{favorites.length}</div>
              <p className="text-xs text-muted-foreground">Properties you've favorited</p>
              <Link to="/buy">
                <Button variant="link" className="px-0 mt-2">Browse Properties</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recently Viewed</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recentlyViewed.length}</div>
              <p className="text-xs text-muted-foreground">Properties you've checked out</p>
              <Link to="/rent">
                <Button variant="link" className="px-0 mt-2">View Rentals</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Listings</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {properties.filter(p => p.sellerInfo.id === user?.id || p.sellerInfo.email === user?.email).length}
              </div>
              <p className="text-xs text-muted-foreground">Properties you've posted</p>
              <div className="mt-2 flex gap-2">
                <Link to="/sell">
                  <Button variant="link" className="px-0">Post Property</Button>
                </Link>
                {properties.filter(p => p.sellerInfo.id === user?.id || p.sellerInfo.email === user?.email).length > 0 && (
                  <Link to="/seller-dashboard">
                    <Button variant="link" className="px-0">Manage</Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {favoriteProperties.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Your Favorite Properties</CardTitle>
              <CardDescription>Properties you've saved for later</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteProperties.slice(0, 3).map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {recentProperties.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Recently Viewed</CardTitle>
              <CardDescription>Properties you've recently checked out</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentProperties.slice(0, 3).map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>What would you like to do?</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Link to="/buy">
              <Button>Browse Properties</Button>
            </Link>
            <Link to="/sell">
              <Button variant="outline">List Property</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
