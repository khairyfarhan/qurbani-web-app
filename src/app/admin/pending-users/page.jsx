"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/firebase/firebaseConfig";
import {
  collection,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import Navbar from "@/components/ui/Navbar";

export default function PendingUsers() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch pending users from Firestore
  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "pendingUsers"));
        const users = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPendingUsers(users);
      } catch (err) {
        console.error("Error fetching pending users:", err); // Log the error
        setErrorMessage("Failed to fetch pending users");
      }
    };

    fetchPendingUsers();
  }, []);

  // Approve user and assign a role
  const handleApprove = async (userId, role) => {
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const userDocRef = doc(db, "pendingUsers", userId);
      const userDocSnapshot = await getDoc(userDocRef);

      if (!userDocSnapshot.exists()) {
        throw new Error("User document does not exist");
      }

      const userData = userDocSnapshot.data();

      // Add the approved user to the "users" collection
      await updateDoc(doc(db, "users", userId), { ...userData, role });
      // Remove from "pendingUsers"
      await deleteDoc(userDocRef);

      setPendingUsers((prev) => prev.filter((user) => user.id !== userId));
      setSuccessMessage("User approved successfully");
    } catch (err) {
      console.error("Error approving user:", err); // Log the error
      setErrorMessage("Failed to approve user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (userId) => {
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const userDocRef = doc(db, "pendingUsers", userId);
      await deleteDoc(userDocRef);

      setPendingUsers((prev) => prev.filter((user) => user.id !== userId));
      setSuccessMessage("User rejected successfully");
    } catch (err) {
      console.error("Error rejecting user:", err); // Log the error
      setErrorMessage("Failed to reject user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="container mx-auto mt-4">
        <h2 className="text-2xl font-bold mb-4">Pending User Approvals</h2>

        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}

        <ul className="space-y-4">
          {pendingUsers.map((user) => (
            <li
              key={user.id}
              className="flex items-center justify-between p-4 border rounded shadow-sm"
            >
              <div>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Name:</strong> {user.name}
                </p>
                <p>
                  <strong>Phone:</strong> {user.phone}
                </p>
                <p>
                  <strong>Country:</strong> {user.country}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <select
                  defaultValue="user"
                  onChange={(e) => (user.role = e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="agent">Agent</option>
                  <option value="supplier">Supplier</option>
                </select>
                <button
                  onClick={() => handleApprove(user.id, user.role)}
                  disabled={loading}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(user.id)}
                  disabled={loading}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
