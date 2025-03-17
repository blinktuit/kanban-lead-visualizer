
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/95">
      <div className="text-center max-w-md mx-auto p-8 glass-card rounded-lg animate-fade-in">
        <h1 className="text-6xl font-light mb-6 text-foreground">404</h1>
        <p className="text-xl text-foreground/80 mb-8">
          The page you're looking for doesn't exist.
        </p>
        <Link to="/">
          <Button className="flex items-center gap-2 mx-auto">
            <ArrowLeft className="h-4 w-4" />
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
