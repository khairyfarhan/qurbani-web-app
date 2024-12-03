// src/components/UserManagement.js
"use client";

import { useState, useEffect } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { collection, addDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

const UserManagement = () => {
  const [state, setState] = useState({
    users: [],
    loading: true,
    error: null
  });
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "agent"
  });

  useEffect(() => {
    const usersRef = collection(db, "users");
    const unsubscribe = onSnapshot(usersRef,
      (snapshot) => {
        const usersList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setState(prev => ({ ...prev, users: usersList, loading: false }));
      },
      (error) => setState(prev => ({ ...prev, error: error.message, loading: false }))
    );

    return () => unsubscribe();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );

      await addDoc(collection(db, "users"), {
        uid: userCredential.user.uid,
        email: formData.email,
        role: formData.role,
      });

      setFormData({ email: "", password: "", role: "agent" });
    } catch (error) {
      setState(prev => ({ ...prev, error: error.message }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleDeleteUser = async (userId) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      await deleteDoc(doc(db, "users", userId));
    } catch (error) {
      setState(prev => ({ ...prev, error: error.message }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      
      {state.loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      ) : (
        <>
          <form onSubmit={handleAddUser} className="mb-6 space-y-4">
            <div className="flex gap-4">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Email"
                className="p-2 border rounded"
                required
              />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Password"
                className="p-2 border rounded"
                required
              />
              <select
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                className="p-2 border rounded"
              >
                <option value="agent">Agent</option>
                <option value="supplier">Supplier</option>
                <option value="admin">Admin</option>
              </select>
              <button
                type="submit"
                className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-800"
                disabled={state.loading}
              >
                Add User
              </button>
            </div>
          </form>
          
          {state.error && (
            <div className="text-red-600 mb-4">{state.error}</div>
          )}
          
          <div>
            <h3 className="text-xl font-bold mb-2">Existing Users</h3>
            <ul className="space-y-2">
              {state.users.map((user) => (
                <li key={user.id} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                  <span>{user.email} ({user.role})</span>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-800"
                    disabled={state.loading}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default UserManagement;