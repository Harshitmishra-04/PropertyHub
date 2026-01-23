import { ReactNode, useState, useEffect } from "react";

interface ClientOnlyMapProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const ClientOnlyMap = ({ children, fallback = null }: ClientOnlyMapProps) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      requestAnimationFrame(() => {
        setHasMounted(true);
      });
    }
  }, []);

  if (!hasMounted || typeof window === "undefined") {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
};

export default ClientOnlyMap;

