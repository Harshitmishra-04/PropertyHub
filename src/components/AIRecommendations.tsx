import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PropertyCard from "@/components/PropertyCard";
import { useProperties } from "@/contexts/PropertiesContext";
import { aiService } from "@/services/aiService";
import { Sparkles, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const AIRecommendations = () => {
  const { properties } = useProperties();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      if (!Array.isArray(properties) || properties.length === 0) {
        setLoading(false);
        return;
      }

      const userPrefs = {
        budget: 10000000,
        bedrooms: 3,
        propertyType: "Apartment",
      };

      const approvedProperties = properties.filter(p => p && p.approvalStatus === "approved");
      const aiRecommendations = await aiService.getPropertyRecommendations(
        userPrefs,
        approvedProperties
      );

      const recommendedProperties = aiRecommendations
        .map((rec) => {
          const property = approvedProperties.find((p) => p.id === rec.propertyId);
          return property ? { ...property, aiReason: rec.reason, aiScore: rec.score } : null;
        })
        .filter(Boolean);

      setRecommendations(recommendedProperties);
    } catch (error) {
      console.error("Failed to load AI recommendations:", error);
      toast.error("Failed to load AI recommendations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Array.isArray(properties) && properties.length > 0) {
      loadRecommendations();
    }
  }, [properties]);

  if (recommendations.length === 0 && !loading) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-primary" />
            <div>
              <h2 className="text-3xl font-bold">AI Recommended for You</h2>
              <p className="text-muted-foreground">
                Properties matched to your preferences using AI
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadRecommendations}
            disabled={loading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted" />
                <CardContent className="p-4 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {recommendations.map((property: any) => (
              <div key={property.id} className="relative">
                {property.aiReason && (
                  <Card className="mb-2 bg-primary/5 border-primary/20">
                    <CardContent className="p-3">
                      <p className="text-xs text-muted-foreground flex items-start gap-2">
                        <Sparkles className="h-3 w-3 mt-0.5 flex-shrink-0 text-primary" />
                        <span>{property.aiReason}</span>
                      </p>
                    </CardContent>
                  </Card>
                )}
                <PropertyCard property={property} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AIRecommendations;
