// src/components/Navbar.js
"use client";

import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h2 className="text-xl font-bold">Qurbani Web App Admin</h2>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="hidden md:inline">Welcome, {user.email}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <span>Loading...</span>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;