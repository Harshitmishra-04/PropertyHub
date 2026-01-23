import { useComparison } from "@/contexts/ComparisonContext";
import { useProperties } from "@/contexts/PropertiesContext";
import Navbar from "@/components/Navbar";
import PropertyComparison from "@/components/PropertyComparison";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const ComparisonPage = () => {
  const { comparisonList } = useComparison();
  const { properties } = useProperties();
  const propertiesToCompare = properties.filter((p) => comparisonList.includes(p.id));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/buy">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Listings
            </Link>
          </Button>
        </div>
        <PropertyComparison initialProperties={comparisonList} />
      </div>
    </div>
  );
};

export default ComparisonPage;
