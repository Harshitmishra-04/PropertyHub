import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <BackButton label="Back to Home" to="/" />
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>1. Introduction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              PropertyHub ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
            </p>
            <p>
              Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>2. Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>We may collect information about you in a variety of ways. The information we may collect includes:</p>
            
            <div>
              <h3 className="font-semibold mb-2">Personal Data</h3>
              <p className="mb-2">Personally identifiable information that you voluntarily provide to us when you:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Register for an account</li>
                <li>List a property</li>
                <li>Contact us through our website</li>
                <li>Subscribe to our newsletter</li>
              </ul>
              <p className="mt-2">This may include your name, email address, phone number, postal address, and other contact information.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Property Information</h3>
              <p>When you list a property, we collect information about the property including location, price, features, images, and other details you provide.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Usage Data</h3>
              <p>We automatically collect certain information when you visit our website, including:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Pages you visit and time spent on pages</li>
                <li>Referring website addresses</li>
                <li>Device information</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>3. How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>We use the information we collect for various purposes, including:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>To provide, maintain, and improve our services</li>
              <li>To process your property listings and inquiries</li>
              <li>To communicate with you about your account and our services</li>
              <li>To send you marketing communications (with your consent)</li>
              <li>To detect, prevent, and address technical issues</li>
              <li>To analyze usage patterns and improve user experience</li>
              <li>To comply with legal obligations</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>4. Information Sharing and Disclosure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>We may share your information in the following situations:</p>
            
            <div>
              <h3 className="font-semibold mb-2">With Property Buyers/Renters</h3>
              <p>When you list a property, your contact information may be shared with potential buyers or renters who express interest in your property.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">With Service Providers</h3>
              <p>We may share your information with third-party service providers who perform services on our behalf, such as hosting, analytics, and customer support.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">For Legal Reasons</h3>
              <p>We may disclose your information if required by law or in response to valid requests by public authorities.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Business Transfers</h3>
              <p>If we are involved in a merger, acquisition, or asset sale, your information may be transferred as part of that transaction.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>5. Data Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              We use administrative, technical, and physical security measures to help protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
            <p>
              We implement appropriate security measures including encryption, secure servers, and access controls to protect your data from unauthorized access, alteration, disclosure, or destruction.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>6. Your Privacy Rights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>Depending on your location, you may have the following rights regarding your personal information:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Access:</strong> Request access to your personal information</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Objection:</strong> Object to processing of your personal information</li>
              <li><strong>Data Portability:</strong> Request transfer of your data to another service</li>
              <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing where applicable</li>
            </ul>
            <p>
              To exercise these rights, please contact us using the information provided at the end of this policy.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>7. Cookies and Tracking Technologies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              We use cookies and similar tracking technologies to track activity on our website and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.
            </p>
            <p>
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>8. Children's Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Our service is not intended for children under the age of 18. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>9. Data Retention</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              We will retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
            </p>
            <p>
              When we no longer need your personal information, we will securely delete or anonymize it.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>10. Changes to This Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
            <p>
              You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>11. Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <p className="mt-2">
              Email: privacy@propertyhub.com<br />
              Phone: +91 123 456 7890<br />
              Address: 123 Property Street, Real Estate District, Mumbai, Maharashtra 400001, India
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

