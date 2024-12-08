"use client";

import React, { useState, useEffect } from "react";
import { db, auth } from "@/firebase/firebaseConfig";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function PendingUsers() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "pendingUsers"), where("status", "==", "pending"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPendingUsers(users);
    });

    return () => unsubscribe();
  }, []);

  const approveUser = async (user) => {
    try {
      // Create Firebase Auth account
      const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
      const uid = userCredential.user.uid;

      // Add to Firestore `users` collection
      await updateDoc(doc(db, "pendingUsers", user.id), { status: "approved" });
      await updateDoc(doc(db, "users", uid), {
        email: user.email,
        name: user.name,
        company: user.company,
        role: "user", // Default role
        createdAt: user.requestedAt,
      });

      setSuccess(`User ${user.email} approved successfully.`);
    } catch (err) {
      setError("Error approving user: " + err.message);
    }
  };

  const rejectUser = async (userId) => {
    try {
      await deleteDoc(doc(db, "pendingUsers", userId));
      setSuccess("User registration rejected.");
    } catch (err) {
      setError("Error rejecting user: " + err.message);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Pending User Approvals</h2>
      {pendingUsers.map((user) => (
        <div key={user.id} className="mb-4 p-4 border rounded">
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Company: {user.company}</p>
          <button onClick={() => approveUser(user)} className="bg-green-500 px-4 py-2 rounded text-white">
            Approve
          </button>
          <button onClick={() => rejectUser(user.id)} className="bg-red-500 px-4 py-2 rounded text-white ml-4">
            Reject
          </button>
        </div>
      ))}
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {success && <p className="text-green-500 mt-4">{success}</p>}
    </div>
  );
}
