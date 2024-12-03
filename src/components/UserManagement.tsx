// src/components/UserManagement.tsx
"use client";

import { useState, useEffect } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("agent");

  useEffect(() => {
    // Fetch users from Firestore on component load
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    };

    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Add user data to Firestore
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        email,
        role,
      });

      // Refresh the user list
      setUsers([...users, { uid: user.uid, email, role }]);
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Error adding user: ", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteDoc(doc(db, "users", userId));
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user: ", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      <div className="mb-6">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="mr-2 p-2 border rounded"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="mr-2 p-2 border rounded"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="mr-2 p-2 border rounded"
        >
          <option value="agent">Agent</option>
          <option value="supplier">Supplier</option>
          <option value="admin">Admin</option>
        </select>
        <button
          onClick={handleAddUser}
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-800"
        >
          Add User
        </button>
      </div>
      <div>
        <h3 className="text-xl font-bold mb-2">Existing Users</h3>
        <ul>
          {users.map((user) => (
            <li key={user.id} className="mb-2">
              {user.email} ({user.role})
              <button
                onClick={() => handleDeleteUser(user.id)}
                className="ml-4 bg-red-600 text-white px-2 py-1 rounded hover:bg-red-800"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserManagement;
