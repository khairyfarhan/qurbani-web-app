"use client";

import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null); // Renamed for clarity
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, userData } = useAuth();

  // Redirect only when user data is available and valid
  useEffect(() => {
    if (user && userData) {
      const role = userData.role;
      router.push(role === "admin" ? "/admin/dashboard" : "/dashboard");
    }
  }, [user, userData, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Role-based redirection will be handled in useEffect
    } catch (err) {
      console.error("Login failed:", err); // Log error for debugging
      setErrorMessage("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleLogin} className="w-full max-w-md space-y-4">
        <h1 className="text-3xl font-bold mb-4">Login to Qurbani Web App</h1>
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        {errorMessage && <div className="text-red-600">{errorMessage}</div>}
      </form>
    </div>
  );
}
