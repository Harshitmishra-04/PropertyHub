import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProperties } from "@/contexts/PropertiesContext";
import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, CheckCircle, Clock, Users, XCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { apiGet } from "@/lib/api";
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

const AdminDashboard = () => {
  const { user } = useAuth();
  const { properties, approveProperty, rejectProperty, deleteProperty } = useProperties();
  const [users, setUsers] = useState<Array<{ id: string; email: string; name: string; role: string; createdAt: string }>>([]);
  
  const pendingCount = properties.filter(p => p.approvalStatus === "pending").length;
  const approvedCount = properties.filter(p => p.approvalStatus === "approved").length;

  const handleApprove = (propertyId: string) => {
    approveProperty(propertyId);
    toast.success("Property approved successfully!");
  };

  const [rejectDialogOpen, setRejectDialogOpen] = useState<string | null>(null);

  const handleReject = (propertyId: string) => {
    rejectProperty(propertyId);
    toast.info("Property rejected");
    setRejectDialogOpen(null);
  };

  const handleDelete = async (propertyId: string) => {
    try {
      await deleteProperty(propertyId);
      toast.success("Property deleted successfully!");
    } catch (e) {
      console.error("Delete failed:", e);
      toast.error("Failed to delete property. Please try again.");
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await apiGet<any[]>("/admin/users");
        setUsers(
          data.map((u) => ({
            id: u.id,
            email: u.email,
            name: u.name,
            role: u.role,
            createdAt: u.createdAt,
          }))
        );
      } catch (e) {
        // Non-admins or when API is unavailable: keep empty.
        setUsers([]);
      }
    };
    fetchUsers();
  }, []);

  const stats = [
    {
      title: "Total Properties",
      value: properties.length,
      icon: Building2,
      description: "All listings",
    },
    {
      title: "Approved",
      value: approvedCount,
      icon: CheckCircle,
      description: "Live properties",
    },
    {
      title: "Pending Approval",
      value: pendingCount,
      icon: Clock,
      description: "Awaiting review",
    },
    {
      title: "Total Users",
      value: users.length,
      icon: Users,
      description: "Registered users",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <BackButton label="Back to Home" to="/" />
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>Review and approve property listings</CardDescription>
          </CardHeader>
          <CardContent>
            {properties.filter(p => p.approvalStatus === "pending").length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No pending approvals</p>
            ) : (
              <div className="space-y-4">
                {properties.filter(p => p.approvalStatus === "pending").map((property) => (
                  <div
                    key={property.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={property.image}
                        alt={property.title}
                        className="w-20 h-20 rounded object-cover"
                      />
                      <div>
                        <p className="font-medium">{property.title}</p>
                        <p className="text-sm text-muted-foreground">{property.location}</p>
                        <p className="text-sm font-semibold mt-1">
                          ₹{property.price.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(property.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <AlertDialog open={rejectDialogOpen === property.id} onOpenChange={(open) => setRejectDialogOpen(open ? property.id : null)}>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setRejectDialogOpen(property.id)}
                          >
                            Reject
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Reject Property</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to reject "{property.title}"? This will mark the property as rejected and it will not be visible to users.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleReject(property.id)}>
                              Reject
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Property</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this property? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => void handleDelete(property.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Registered Users</CardTitle>
            <CardDescription>Users created in the database</CardDescription>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No users found (or you are not an admin).</p>
            ) : (
              <div className="space-y-3">
                {users.slice(0, 20).map((u) => (
                  <div key={u.id} className="flex items-center justify-between border rounded-lg p-4">
                    <div>
                      <p className="font-medium">{u.name}</p>
                      <p className="text-sm text-muted-foreground">{u.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={u.role === "admin" ? "default" : "secondary"}>{u.role}</Badge>
                    </div>
                  </div>
                ))}
                {users.length > 20 && (
                  <p className="text-xs text-muted-foreground">Showing first 20 users.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All Properties</CardTitle>
            <CardDescription>Manage all property listings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {properties.slice(0, 10).map((property) => (
                <div
                  key={property.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{property.title}</p>
                        <Badge variant={property.approvalStatus === "approved" ? "default" : "secondary"}>
                          {property.approvalStatus}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{property.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold">₹{property.price.toLocaleString("en-IN")}</p>
                      <p className="text-sm text-muted-foreground capitalize">{property.type}</p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="ghost">
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
                            <AlertDialogAction onClick={() => void handleDelete(property.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
