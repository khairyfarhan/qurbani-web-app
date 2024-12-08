"use client";

import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirectUrl") || "/login";

  useEffect(() => {
    const checkAccess = async () => {
      if (!loading) {
        if (!user) {
          const currentPath = window.location.pathname;
          router.push(`/login?redirectUrl=${encodeURIComponent(currentPath)}`);
          return;
        }

        if (requiredRoles.length > 0) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          const userData = userDoc.data();

          if (!userData || !requiredRoles.includes(userData.role)) {
            router.push("/unauthorized");
            return;
          }
        }
      }
    };

    checkAccess();
  }, [user, loading, router, requiredRoles, redirectUrl]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{user ? children : null}</>;
};

export default ProtectedRoute;
