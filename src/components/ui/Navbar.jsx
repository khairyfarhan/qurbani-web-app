"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, User } from "lucide-react";

const Navbar = () => {
  const { user, userData, signOut: handleSignOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const logout = async () => {
    try {
      await handleSignOut();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  const getNavLinks = () => {
    if (!user) {
      // Links for unauthenticated users
      return [
        { name: "Register", href: "/register" },
        { name: "Login", href: "/login" },
      ];
    }

    // Links for authenticated users
    const links = [{ name: "Dashboard", href: "/admin/dashboard" }];

    if (userData?.role === "admin") {
      links.push(
        { name: "Pending Users", href: "/admin/pending-users" },
        { name: "User Management", href: "/admin/user-management" },
        { name: "Products", href: "/admin/products" } // Add the Products page link
      );
    }

    return links;
  };

  const navLinks = getNavLinks();

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <h2
            className="text-xl font-bold cursor-pointer"
            onClick={() => router.push("/")}
          >
            Qurbani Web App
          </h2>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => router.push(link.href)}
                className={`${
                  pathname === link.href ? "underline" : ""
                } hover:underline`}
              >
                {link.name}
              </button>
            ))}

            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-6 w-6" />
                  <span>{user.email}</span>
                </div>
                <button
                  onClick={logout}
                  className="bg-red-500 px-4 py-2 rounded hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => router.push(link.href)}
                className={`block w-full text-left px-4 py-2 hover:bg-blue-700 ${
                  pathname === link.href ? "bg-blue-800" : ""
                }`}
              >
                {link.name}
              </button>
            ))}

            {user && (
              <>
                <div className="flex items-center gap-2 px-4 py-2">
                  <User className="h-6 w-6" />
                  <span>{user.email}</span>
                </div>
                <button
                  onClick={logout}
                  className="block w-full bg-red-500 text-left px-4 py-2 rounded hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
