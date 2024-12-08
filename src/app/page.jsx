"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user, userData } = useAuth();
  const router = useRouter();

  // Redirect based on authentication status and role
  if (!user) {
    router.push("/login"); // Redirect to login if not logged in
  } else {
    const role = userData?.role || "user";
    router.push(role === "admin" ? "/admin/dashboard" : "/dashboard");
  }

  return <div>Loading...</div>; // Optional loading state
}
