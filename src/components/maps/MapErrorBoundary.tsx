import { Component, ReactNode, ErrorInfo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

class MapErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Map component error:", error, errorInfo);
    console.error("Error stack:", error.stack);
    console.error("Error message:", error.message);
    console.error("Component stack:", errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <Card className="p-8 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-destructive mb-2" />
          <p className="text-muted-foreground">Failed to load map. Please refresh the page.</p>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default MapErrorBoundary;

