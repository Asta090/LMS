import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

const Unauthorized = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleRedirect = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Redirect based on user role
    switch (user?.role) {
      case "admin":
        navigate("/admin/dashboard");
        break;
      case "teacher":
        navigate("/teacher/dashboard");
        break;
      case "student":
        navigate("/student/dashboard");
        break;
      default:
        navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md text-center">
        <ShieldAlert className="mx-auto h-16 w-16 text-red-500 mb-6" />
        <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
        <p className="text-lg text-muted-foreground mb-8">
          You don't have permission to access this page.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => navigate(-1)} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
          <Button onClick={handleRedirect}>
            <Home className="mr-2 h-4 w-4" />
            {isAuthenticated ? "Go to Dashboard" : "Go to Login"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized; 