"use client";

// UserManagement.jsx

import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/firebase/firebaseConfig"; // Update path to use alias

const USERS_PER_PAGE = 10;

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // Default role
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // Fetch users from Firestore
  useEffect(() => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, orderBy("email"), limit(USERS_PER_PAGE));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersList);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === USERS_PER_PAGE);
    });

    return () => unsubscribe();
  }, []);

  // Load more users
  const loadMoreUsers = () => {
    if (!hasMore || !lastVisible) return;

    const usersRef = collection(db, "users");
    const q = query(
      usersRef,
      orderBy("email"),
      startAfter(lastVisible),
      limit(USERS_PER_PAGE)
    );

    onSnapshot(q, (snapshot) => {
      const moreUsers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers((prevUsers) => [...prevUsers, ...moreUsers]);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === USERS_PER_PAGE);
    });
  };

  // Add a new user
  const handleAddUser = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
  
    try {
      // Add a new user document directly to Firestore
      const newUserRef = await addDoc(collection(db, "users"), {
        email,
        role, // Role from the dropdown
        uid: "", // Leave UID empty for now
        createdAt: new Date(),
      });
  
      setSuccess("User added successfully");
      setEmail("");
      setPassword("");
      setRole("user"); // Reset role to default
  
      // Log the document ID for debugging
      console.log("User document added with ID:", newUserRef.id);
    } catch (err) {
      setError(`Error adding user: ${err.message}`);
      console.error(err);
    }
  };
  

  // Delete a user
  const handleDeleteUser = async (id) => {
    try {
      await deleteDoc(doc(db, "users", id));
      setSuccess("User deleted successfully");
    } catch (err) {
      setError(`Error deleting user: ${err.message}`);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">User Management</h2>

      {/* Add User Form */}
      <form onSubmit={handleAddUser} className="mb-4 space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border p-2 w-full"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border p-2 w-full"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="agent">Agent</option>
        </select>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add User
        </button>
      </form>

      {/* Feedback Messages */}
      {error && <p className="text-red-500">Error: {error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      {/* User List */}
      <ul className="list-disc pl-6">
        {users.map((user) => (
          <li key={user.id} className="mb-2">
            {user.email} - {user.role || "No role assigned"}
            <button
              onClick={() => handleDeleteUser(user.id)}
              className="text-red-500 ml-4"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* Load More Button */}
      {hasMore && (
        <button
          onClick={loadMoreUsers}
          className="bg-gray-200 px-4 py-2 mt-4"
        >
          Load More
        </button>
      )}
    </div>
  );
}
