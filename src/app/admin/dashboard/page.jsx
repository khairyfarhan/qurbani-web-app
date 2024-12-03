// src/app/admin/dashboard/page.tsx
"use client";

import ProtectedRoute from "../../../components/ProtectedRoute";
import Navbar from "../../../components/Navbar";
import UserManagement from "../../../components/UserManagement";

export default function AdminDashboard() {
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
