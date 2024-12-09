"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/firebaseConfig";
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
  // addDoc,
} from "firebase/firestore";
import Navbar from "@/components/ui/Navbar";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch all registered users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersList);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users.");
      }
    };

    fetchUsers();
  }, []);

  // Update a user's details
  const handleUpdateUser = async (userId, updatedData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await updateDoc(doc(db, "users", userId), updatedData);
      setSuccess("User updated successfully.");
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, ...updatedData } : user
        )
      );
    } catch (err) {
      console.error("Error updating user:", err);
      setError("Failed to update user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Delete a user
  const handleDeleteUser = async (userId) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await deleteDoc(doc(db, "users", userId));
      setSuccess("User deleted successfully.");
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Failed to delete user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto mt-4">
        <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}

        <ul className="space-y-4">
          {users.map((user) => (
            <li
              key={user.id}
              className="flex flex-col gap-4 p-4 border rounded shadow-sm"
            >
              <div>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Name:</strong> {user.name || "N/A"}
                </p>
                <p>
                  <strong>Phone:</strong> {user.phone || "N/A"}
                </p>
                <p>
                  <strong>Country:</strong> {user.country || "N/A"}
                </p>
                <p>
                  <strong>Role:</strong> {user.role}
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() =>
                    handleUpdateUser(user.id, { role: "admin" })
                  }
                  disabled={loading}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Make Admin
                </button>
                <button
                  onClick={() =>
                    handleUpdateUser(user.id, { role: "agent" })
                  }
                  disabled={loading}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Make Agent
                </button>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  disabled={loading}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Delete User
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
