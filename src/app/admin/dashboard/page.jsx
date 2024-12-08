"use client";

import ProtectedRoute from "@/components/ui/ProtectedRoute";
import Navbar from "@/components/ui/Navbar";
import UserManagement from "@/components/ui/UserManagement";
import withRole from "@/utils/roleMiddleware";

function AdminDashboard() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
          <UserManagement />
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default withRole(AdminDashboard, "admin");
