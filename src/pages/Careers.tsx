import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Briefcase, Clock, DollarSign, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Careers = () => {
  const jobOpenings = [
    {
      id: 1,
      title: "Senior Real Estate Agent",
      department: "Sales",
      location: "Mumbai, Maharashtra",
      type: "Full-time",
      salary: "₹6,00,000 - ₹10,00,000",
      description: "We are looking for an experienced real estate agent to join our sales team. You will be responsible for helping clients buy, sell, and rent properties.",
      requirements: [
        "Minimum 3 years of experience in real estate",
        "Strong communication and negotiation skills",
        "Valid real estate license",
        "Proven track record of successful sales",
      ],
    },
    {
      id: 2,
      title: "Property Marketing Specialist",
      department: "Marketing",
      location: "Delhi, NCR",
      type: "Full-time",
      salary: "₹4,00,000 - ₹7,00,000",
      description: "Join our marketing team to create compelling property listings and marketing campaigns. You'll work with photographers, videographers, and content creators.",
      requirements: [
        "Bachelor's degree in Marketing or related field",
        "2+ years of experience in digital marketing",
        "Proficiency in social media platforms",
        "Creative thinking and attention to detail",
      ],
    },
    {
      id: 3,
      title: "Full Stack Developer",
      department: "Technology",
      location: "Remote / Bangalore, Karnataka",
      type: "Full-time",
      salary: "₹8,00,000 - ₹15,00,000",
      description: "We're seeking a talented full-stack developer to help build and maintain our property listing platform. You'll work with modern technologies like React, Node.js, and TypeScript.",
      requirements: [
        "3+ years of experience in full-stack development",
        "Proficiency in React, Node.js, and TypeScript",
        "Experience with databases (PostgreSQL, MongoDB)",
        "Strong problem-solving skills",
      ],
    },
    {
      id: 4,
      title: "Customer Support Representative",
      department: "Support",
      location: "Pune, Maharashtra",
      type: "Full-time",
      salary: "₹2,50,000 - ₹4,00,000",
      description: "Help our customers navigate the platform and resolve their queries. This role involves handling customer inquiries via phone, email, and chat.",
      requirements: [
        "Excellent communication skills",
        "Customer service experience preferred",
        "Ability to work in shifts",
        "Patience and empathy",
      ],
    },
    {
      id: 5,
      title: "Property Photographer",
      department: "Media",
      location: "Hyderabad, Telangana",
      type: "Part-time / Freelance",
      salary: "₹500 - ₹1,500 per property",
      description: "Capture stunning photos and videos of properties for our listings. You'll travel to various locations and work with property owners and agents.",
      requirements: [
        "Professional photography experience",
        "Own camera equipment",
        "Portfolio of real estate photography",
        "Flexible schedule",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <BackButton label="Back to Home" to="/" />
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Careers at PropertyHub</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join our team and help shape the future of real estate. We're always looking for talented individuals who share our passion for helping people find their perfect property.
          </p>
        </div>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Why Work With Us?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Competitive Benefits</h3>
                <p className="text-sm text-muted-foreground">
                  We offer competitive salaries, health insurance, and flexible work arrangements to support your well-being.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Growth Opportunities</h3>
                <p className="text-sm text-muted-foreground">
                  Advance your career with professional development programs, training, and mentorship opportunities.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Innovative Culture</h3>
                <p className="text-sm text-muted-foreground">
                  Work in a dynamic environment where your ideas matter and innovation is encouraged.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Open Positions</h2>
          <div className="space-y-6">
            {jobOpenings.map((job) => (
              <Card key={job.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="mb-2">{job.title}</CardTitle>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant="outline">{job.department}</Badge>
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {job.location}
                        </Badge>
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Briefcase className="h-3 w-3" />
                          {job.type}
                        </Badge>
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {job.salary}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <CardDescription>{job.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Requirements:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {job.requirements.map((req, idx) => (
                        <li key={idx}>{req}</li>
                      ))}
                    </ul>
                  </div>
                  <Button asChild>
                    <a href={`mailto:careers@propertyhub.com?subject=Application for ${job.title}`}>
                      <Mail className="mr-2 h-4 w-4" />
                      Apply Now
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Don't See a Role That Fits?</CardTitle>
            <CardDescription>
              We're always interested in hearing from talented individuals. Send us your resume and we'll keep you in mind for future opportunities.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <a href="mailto:careers@propertyhub.com?subject=General Application">
                <Mail className="mr-2 h-4 w-4" />
                Send General Application
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Careers;

