import { useAuth } from "@/contexts/AuthContext";
import { useProperties } from "@/contexts/PropertiesContext";
import { useLeads } from "@/contexts/LeadsContext";
import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Eye,
  Heart,
  TrendingUp,
  Users,
  DollarSign,
  MapPin,
  Star,
  Activity,
  Building2,
  MessageSquare,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const AnalyticsDashboard = () => {
  const { user } = useAuth();
  const { properties } = useProperties();
  const { leads } = useLeads();

  const totalProperties = properties.length;
  const approvedProperties = properties.filter(p => p.approvalStatus === 'approved').length;
  const pendingProperties = properties.filter(p => p.approvalStatus === 'pending').length;
  const totalViews = properties.reduce((sum, p) => sum + (p.views || 0), 0);
  const totalEnquiries = properties.reduce((sum, p) => sum + (p.enquiries || 0), 0);
  const totalLeads = leads.length;

  const propertyTypes = properties.reduce((acc, prop) => {
    acc[prop.propertyType] = (acc[prop.propertyType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topLocations = Object.entries(
    properties.reduce((acc, prop) => {
      const city = prop.city || prop.location.split(',')[prop.location.split(',').length - 1]?.trim() || prop.location;
      acc[city] = (acc[city] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const stats = [
    {
      title: "Total Views",
      value: totalViews.toLocaleString("en-IN"),
      change: "All properties",
      icon: Eye,
      trend: "up",
    },
    {
      title: "Total Enquiries",
      value: totalEnquiries.toLocaleString("en-IN"),
      change: "Property enquiries",
      icon: MessageSquare,
      trend: "up",
    },
    {
      title: "Total Leads",
      value: totalLeads.toLocaleString("en-IN"),
      change: "Buyer leads",
      icon: Users,
      trend: "up",
    },
    {
      title: "Properties",
      value: totalProperties.toString(),
      change: `${approvedProperties} approved`,
      icon: Building2,
      trend: "neutral",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <BackButton label="Back to Home" to="/" />
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Performance insights and key metrics</p>
        </div>

        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.change} {stat.trend === "up" && "from last month"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Property Status</CardTitle>
              <CardDescription>Overview of property listings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Activity className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Total Properties</p>
                    <p className="text-xs text-muted-foreground">All listings</p>
                  </div>
                </div>
                <p className="text-2xl font-bold">{totalProperties}</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                    <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Approved</p>
                    <p className="text-xs text-muted-foreground">Live properties</p>
                  </div>
                </div>
                <Badge variant="default">{approvedProperties}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/20">
                    <Activity className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Pending</p>
                    <p className="text-xs text-muted-foreground">Awaiting approval</p>
                  </div>
                </div>
                <Badge variant="secondary">{pendingProperties}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Property Types</CardTitle>
              <CardDescription>Distribution by property type</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(propertyTypes).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <DollarSign className="h-5 w-5" />
                    </div>
                    <p className="font-medium">{type}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${(count / totalProperties) * 100}%` }}
                      />
                    </div>
                    <p className="w-12 text-right font-semibold">{count}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Locations</CardTitle>
              <CardDescription>Most popular cities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {topLocations.map(([location, count]) => (
                <div key={location} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <p className="font-medium">{location}</p>
                  </div>
                  <Badge variant="secondary">{count} properties</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Insights</CardTitle>
              <CardDescription>Sales and rental performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Properties for Sale</p>
                  <p className="text-xs text-muted-foreground">
                    {properties.filter((p) => p.type === "sale").length > 0 ? (
                      <>Avg: ₹{(
                        properties
                          .filter((p) => p.type === "sale")
                          .reduce((sum, p) => sum + p.price, 0) /
                        properties.filter((p) => p.type === "sale").length
                      ).toLocaleString("en-IN")}</>
                    ) : 'No properties'}
                  </p>
                </div>
                <p className="text-2xl font-bold">
                  {properties.filter((p) => p.type === "sale").length}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Properties for Rent</p>
                  <p className="text-xs text-muted-foreground">
                    {properties.filter((p) => p.type === "rent").length > 0 ? (
                      <>Avg: ₹{(
                        properties
                          .filter((p) => p.type === "rent")
                          .reduce((sum, p) => sum + p.price, 0) /
                        properties.filter((p) => p.type === "rent").length
                      ).toLocaleString("en-IN")}/mo</>
                    ) : 'No properties'}
                  </p>
                </div>
                <p className="text-2xl font-bold">
                  {properties.filter((p) => p.type === "rent").length}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Properties for Leasing</p>
                  <p className="text-xs text-muted-foreground">
                    {properties.filter((p) => p.type === "leasing").length > 0 ? (
                      <>Avg: ₹{(
                        properties
                          .filter((p) => p.type === "leasing")
                          .reduce((sum, p) => sum + p.price, 0) /
                        properties.filter((p) => p.type === "leasing").length
                      ).toLocaleString("en-IN")}/mo</>
                    ) : 'No properties'}
                  </p>
                </div>
                <p className="text-2xl font-bold">
                  {properties.filter((p) => p.type === "leasing").length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
