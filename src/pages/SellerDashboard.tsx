import { useAuth } from "@/contexts/AuthContext";
import { useProperties } from "@/contexts/PropertiesContext";
import { useLeads } from "@/contexts/LeadsContext";
import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Building2, 
  Eye, 
  MessageSquare, 
  TrendingUp, 
  Phone, 
  Mail, 
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const SellerDashboard = () => {
  const { user } = useAuth();
  const { properties } = useProperties();
  const { leads, getLeadsBySeller, updateLeadStatus, deleteLead } = useLeads();

  const sellerProperties = properties.filter(
    p => p.sellerInfo.id === user?.id || p.sellerInfo.email === user?.email
  );

  const sellerLeads = user ? getLeadsBySeller(user.id) : [];

  const totalViews = sellerProperties.reduce((sum, p) => sum + (p.views || 0), 0);
  const totalEnquiries = sellerProperties.reduce((sum, p) => sum + (p.enquiries || 0), 0);
  const newLeads = sellerLeads.filter(l => l.status === 'new').length;
  const contactedLeads = sellerLeads.filter(l => l.status === 'contacted').length;
  const interestedLeads = sellerLeads.filter(l => l.status === 'interested').length;

  const handleStatusChange = (leadId: string, status: string, notes?: string) => {
    updateLeadStatus(leadId, status as any, notes);
    toast.success("Lead status updated");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'contacted': return 'bg-yellow-500';
      case 'interested': return 'bg-green-500';
      case 'not-interested': return 'bg-red-500';
      case 'closed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <BackButton label="Back to Home" to="/" />
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Seller Dashboard</h1>
          <p className="text-muted-foreground">Manage your properties and leads</p>
        </div>

        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Properties</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sellerProperties.length}</div>
              <p className="text-xs text-muted-foreground">Total listings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalViews}</div>
              <p className="text-xs text-muted-foreground">All time views</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Enquiries</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEnquiries}</div>
              <p className="text-xs text-muted-foreground">Property enquiries</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Leads</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sellerLeads.length}</div>
              <p className="text-xs text-muted-foreground">{newLeads} new leads</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>My Properties</CardTitle>
                  <CardDescription>Manage your property listings</CardDescription>
                </div>
                <Button asChild>
                  <Link to="/sell">Add Property</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {sellerProperties.length === 0 ? (
                <div className="py-8 text-center">
                  <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">You haven't listed any properties yet</p>
                  <Button asChild>
                    <Link to="/sell">List Your First Property</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {sellerProperties.map((property) => (
                    <div
                      key={property.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={property.image}
                          alt={property.title}
                          className="h-16 w-16 rounded object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/property/${property.id}`}
                              className="font-semibold hover:text-primary"
                            >
                              {property.title}
                            </Link>
                            <Badge variant={property.approvalStatus === "approved" ? "default" : "secondary"}>
                              {property.approvalStatus}
                            </Badge>
                            {property.featured && (
                              <Badge variant="default" className="bg-yellow-500">
                                Featured
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{property.location}</p>
                          <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {property.views || 0} views
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              {property.enquiries || 0} enquiries
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₹{property.price.toLocaleString("en-IN")}</p>
                        <p className="text-xs text-muted-foreground capitalize">{property.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lead Status</CardTitle>
              <CardDescription>Overview of your leads</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500" />
                  <span className="text-sm">New</span>
                </div>
                <Badge>{newLeads}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <span className="text-sm">Contacted</span>
                </div>
                <Badge variant="secondary">{contactedLeads}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="text-sm">Interested</span>
                </div>
                <Badge variant="default" className="bg-green-500">{interestedLeads}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-gray-500" />
                  <span className="text-sm">Closed</span>
                </div>
                <Badge variant="outline">
                  {sellerLeads.filter(l => l.status === 'closed').length}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Lead Management</CardTitle>
            <CardDescription>Manage and track your property enquiries</CardDescription>
          </CardHeader>
          <CardContent>
            {sellerLeads.length === 0 ? (
              <div className="py-8 text-center">
                <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No leads yet. Leads will appear here when buyers contact you.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sellerLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="rounded-lg border p-4"
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <Link
                            to={`/property/${lead.propertyId}`}
                            className="font-semibold hover:text-primary"
                          >
                            {lead.propertyTitle}
                          </Link>
                          <Badge className={getStatusColor(lead.status)}>
                            {lead.status}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">Buyer:</span>
                            {lead.buyerName}
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3" />
                            <a href={`tel:${lead.buyerPhone}`} className="hover:text-primary">
                              {lead.buyerPhone}
                            </a>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3" />
                            <a href={`mailto:${lead.buyerEmail}`} className="hover:text-primary">
                              {lead.buyerEmail}
                            </a>
                          </div>
                          {lead.message && (
                            <div className="mt-2 rounded bg-muted p-2">
                              <p className="text-xs">{lead.message}</p>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-xs">
                            <Calendar className="h-3 w-3" />
                            {new Date(lead.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 flex flex-col gap-2">
                        <Select
                          value={lead.status}
                          onValueChange={(value) => handleStatusChange(lead.id, value)}
                        >
                          <SelectTrigger className="w-[150px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="contacted">Contacted</SelectItem>
                            <SelectItem value="interested">Interested</SelectItem>
                            <SelectItem value="not-interested">Not Interested</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="w-full">
                              <FileText className="mr-2 h-4 w-4" />
                              Add Notes
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add Notes</DialogTitle>
                              <DialogDescription>
                                Add notes about this lead for your reference
                              </DialogDescription>
                            </DialogHeader>
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.currentTarget);
                                const notes = formData.get('notes') as string;
                                handleStatusChange(lead.id, lead.status, notes);
                                (e.target as HTMLFormElement).reset();
                              }}
                              className="space-y-4"
                            >
                              <Textarea
                                name="notes"
                                placeholder="Add your notes here..."
                                defaultValue={lead.notes || ''}
                              />
                              <Button type="submit" className="w-full">Save Notes</Button>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                    {lead.notes && (
                      <div className="mt-2 rounded bg-muted p-2">
                        <p className="text-xs font-medium mb-1">Notes:</p>
                        <p className="text-xs text-muted-foreground">{lead.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SellerDashboard;

