"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function withRole(Component, requiredRole) {
  return function ProtectedComponent(props) {
    const { user, userData, loading, initialized } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (initialized && (!user || userData?.role !== requiredRole)) {
        router.push("/login"); // Redirect if unauthorized
      }
    }, [user, userData, loading, initialized, requiredRole, router]);

    // Show a loading spinner while user data is being checked
    if (loading || !initialized) return <div>Loading...</div>;

    // Prevent rendering the protected component if the user is not authorized
    if (!user || userData?.role !== requiredRole) return null;

    // Render the protected component
    return <Component {...props} />;
  };
}
