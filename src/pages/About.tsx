import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Users, Award, TrendingUp } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <BackButton label="Back to Home" to="/" />
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold">About PropertyHub</h1>
            <p className="text-lg text-muted-foreground">
              Your trusted partner in finding the perfect property
            </p>
          </div>

          <div className="prose prose-lg mx-auto mb-12">
            <p className="text-muted-foreground">
              PropertyHub is India's leading real estate platform, connecting millions of buyers,
              sellers, and renters across the country. With our comprehensive database of verified
              properties and user-friendly interface, we make property search and transactions
              simple and transparent.
            </p>
            <p className="text-muted-foreground">
              Founded in 2024, we've grown to become one of the most trusted names in real estate,
              helping thousands of families find their dream homes and investors discover lucrative
              opportunities.
            </p>
          </div>

          <div className="mb-12 grid gap-6 md:grid-cols-2">
            <Card>
              <CardContent className="p-6">
                <Building2 className="mb-4 h-12 w-12 text-primary" />
                <h3 className="mb-2 text-xl font-bold">10,000+ Properties</h3>
                <p className="text-muted-foreground">
                  Extensive database of verified properties across major cities
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Users className="mb-4 h-12 w-12 text-primary" />
                <h3 className="mb-2 text-xl font-bold">50,000+ Users</h3>
                <p className="text-muted-foreground">
                  Growing community of satisfied buyers, sellers, and renters
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Award className="mb-4 h-12 w-12 text-primary" />
                <h3 className="mb-2 text-xl font-bold">100% Verified</h3>
                <p className="text-muted-foreground">
                  All listings are verified for authenticity and accuracy
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <TrendingUp className="mb-4 h-12 w-12 text-primary" />
                <h3 className="mb-2 text-xl font-bold">Market Leader</h3>
                <p className="text-muted-foreground">
                  Recognized as one of India's fastest-growing proptech companies
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-8">
              <h2 className="mb-4 text-2xl font-bold">Our Mission</h2>
              <p className="mb-4 text-muted-foreground">
                To democratize real estate by making property search, comparison, and transactions
                accessible, transparent, and hassle-free for everyone.
              </p>
              <h2 className="mb-4 text-2xl font-bold">Our Vision</h2>
              <p className="text-muted-foreground">
                To be India's most trusted and comprehensive real estate platform, empowering
                millions to make informed property decisions with confidence.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;
