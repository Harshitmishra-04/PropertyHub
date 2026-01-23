import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import App from "./App.tsx";
import "./index.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { RecentlyViewedProvider } from "./contexts/RecentlyViewedContext";
import { ComparisonProvider } from "./contexts/ComparisonContext";
import { ReviewsProvider } from "./contexts/ReviewsContext";
import { AuthProvider } from "./contexts/AuthContext";
import { PropertiesProvider } from "./contexts/PropertiesContext";
import { LeadsProvider } from "./contexts/LeadsContext";
import ErrorBoundary from "./components/ErrorBoundary";
import "./lib/leafletInit";
import { ensureSeeded } from "./lib/localDb";

// Seed localStorage with demo data on first load
ensureSeeded();

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ErrorBoundary>
          <AuthProvider>
            <PropertiesProvider>
                <LeadsProvider>
              <FavoritesProvider>
                <RecentlyViewedProvider>
                  <ComparisonProvider>
                    <ReviewsProvider>
                      <App />
                    </ReviewsProvider>
                  </ComparisonProvider>
                </RecentlyViewedProvider>
              </FavoritesProvider>
                </LeadsProvider>
            </PropertiesProvider>
          </AuthProvider>
          </ErrorBoundary>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);
