import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import Home from "./pages/Home";
import PropertyList from "./pages/PropertyList";
import PropertyDetail from "./pages/PropertyDetail";
import SellProperty from "./pages/SellProperty";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Careers from "./pages/Careers";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import ComparisonPage from "./pages/ComparisonPage";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import SellerDashboard from "./pages/SellerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/buy" element={<PropertyList />} />
        <Route path="/rent" element={<PropertyList />} />
        <Route path="/leasing" element={<PropertyList />} />
        <Route path="/property/:id" element={<PropertyDetail />} />
        <Route path="/sell" element={<SellProperty />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/compare" element={<ComparisonPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute requireAdmin>
              <AnalyticsDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller-dashboard"
          element={
            <ProtectedRoute>
              <SellerDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
      <Sonner />
    </>
  );
};

export default App;
