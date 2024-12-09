"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/firebaseConfig";
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import Navbar from "@/components/ui/Navbar";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState(null); // User being edited
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch all users
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

  // Handle Search
  const filteredUsers = users.filter((user) =>
    ["email", "name", "phone"]
      .map((key) => user[key]?.toLowerCase())
      .some((value) => value?.includes(searchTerm.toLowerCase()))
  );

  // Handle Update User
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
      setEditingUser(null); // Close edit modal/inline editing
    } catch (err) {
      console.error("Error updating user:", err);
      setError("Failed to update user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete User
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
        <h2 className="text-2xl font-bold mb-4">User Management</h2>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by email, name, or phone"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}

        <ul className="space-y-4">
          {filteredUsers.map((user) => (
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
                  onClick={() => setEditingUser(user)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  disabled={loading}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Edit Modal/Inline Editing */}
        {editingUser && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Edit User</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdateUser(editingUser.id, {
                    name: editingUser.name,
                    phone: editingUser.phone,
                    country: editingUser.country,
                    role: editingUser.role,
                  });
                }}
              >
                <div className="mb-4">
                  <label className="block mb-2">Name:</label>
                  <input
                    type="text"
                    value={editingUser.name || ""}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, name: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2">Phone:</label>
                  <input
                    type="text"
                    value={editingUser.phone || ""}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, phone: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2">Country:</label>
                  <input
                    type="text"
                    value={editingUser.country || ""}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, country: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2">Role:</label>
                  <select
                    value={editingUser.role || "user"}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, role: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                  >
                    <option value="admin">Admin</option>
                    <option value="agent">Agent</option>
                    <option value="supplier">Supplier</option>
                  </select>
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
