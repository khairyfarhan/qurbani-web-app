"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext"; // Use AuthContext for signOut
import { useRouter } from "next/navigation";
import { Menu, X, User } from "lucide-react";

const Navbar = () => {
  const { user, signOut } = useAuth(); // Use signOut from AuthContext
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut(); // Use context signOut
      router.push("/login"); // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <h2 className="text-xl font-bold">Qurbani Web App Admin</h2>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-2">
                  <User className="h-6 w-6" />
                  <span>{user.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  disabled={loading}
                  className="bg-red-500 px-4 py-2 rounded hover:bg-red-700 transition-colors"
                >
                  {loading ? "Logging out..." : "Logout"}
                </button>
              </>
            ) : (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            {user ? (
              <>
                <div className="flex items-center gap-2 py-2">
                  <User className="h-6 w-6" />
                  <span>{user.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  disabled={loading}
                  className="w-full bg-red-500 px-4 py-2 rounded hover:bg-red-700 transition-colors"
                >
                  {loading ? "Logging out..." : "Logout"}
                </button>
              </>
            ) : (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
