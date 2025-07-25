"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthWrapperProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "peserta";
}

export default function AuthWrapper({ children, requiredRole }: AuthWrapperProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const sessionToken = localStorage.getItem("session_token");
    const userRole = localStorage.getItem("user_role");

    if (!sessionToken) {
      router.push("/login");
      return;
    }

    if (requiredRole && userRole !== requiredRole) {
      // Redirect ke dashboard yang sesuai dengan role
      if (userRole === "admin") {
        router.push("/dashboard-admin");
      } else if (userRole === "peserta") {
        router.push("/dashboard-peserta");
      } else {
        router.push("/login");
      }
      return;
    }

    setIsAuthenticated(true);
    setIsLoading(false);
  }, [router, requiredRole]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
