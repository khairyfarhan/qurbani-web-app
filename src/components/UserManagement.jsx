"use client";

import { useState, useEffect } from "react";
import { auth, db } from "../firebase/firebaseConfig";
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
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@radix-ui/react-alert-dialog";
const USERS_PER_PAGE = 10;

const UserManagement = () => {
  const [state, setState] = useState({
    users: [],
    loading: true,
    error: null,
    lastDoc: null,
    hasMore: true,
  });

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "agent",
  });

  const [search, setSearch] = useState("");
  const [deleteUser, setDeleteUser] = useState(null);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, orderBy("email"), limit(USERS_PER_PAGE));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const usersList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setState((prev) => ({
          ...prev,
          users: usersList,
          lastDoc: snapshot.docs[snapshot.docs.length - 1],
          loading: false,
          hasMore: snapshot.docs.length === USERS_PER_PAGE,
        }));
      },
      (error) =>
        setState((prev) => ({ ...prev, error: error.message, loading: false })),
    );

    return () => unsubscribe();
  }, []);

  const loadMore = async () => {
    if (!state.lastDoc) return;

    const usersRef = collection(db, "users");
    const q = query(
      usersRef,
      orderBy("email"),
      startAfter(state.lastDoc),
      limit(USERS_PER_PAGE),
    );

    const snapshot = await getDocs(q);
    const newUsers = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setState((prev) => ({
      ...prev,
      users: [...prev.users, ...newUsers],
      lastDoc: snapshot.docs[snapshot.docs.length - 1],
      hasMore: snapshot.docs.length === USERS_PER_PAGE,
    }));
  };

  const validateForm = () => {
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setValidationError("Invalid email format");
      return false;
    }
    if (formData.password.length < 6) {
      setValidationError("Password must be at least 6 characters");
      return false;
    }
    setValidationError("");
    return true;
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password,
      );

      await addDoc(collection(db, "users"), {
        uid: userCredential.user.uid,
        email: formData.email,
        role: formData.role,
        createdAt: new Date().toISOString(),
      });

      setFormData({ email: "", password: "", role: "agent" });
    } catch (error) {
      setState((prev) => ({ ...prev, error: error.message }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteUser) return;

    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await deleteDoc(doc(db, "users", deleteUser.id));
      setDeleteUser(null);
    } catch (error) {
      setState((prev) => ({ ...prev, error: error.message }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const filteredUsers = state.users.filter(
    (user) =>
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.role.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>

      {state.loading && !state.users.length ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      ) : (
        <>
          <form onSubmit={handleAddUser} className="mb-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="Email"
                className="p-2 border rounded flex-1"
                required
              />
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
                placeholder="Password"
                className="p-2 border rounded flex-1"
                required
              />
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, role: e.target.value }))
                }
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
            {validationError && (
              <div className="text-red-600">{validationError}</div>
            )}
          </form>

          {state.error && (
            <div className="text-red-600 mb-4">{state.error}</div>
          )}

          <div className="mb-4">
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="p-2 border rounded w-full"
            />
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2">Existing Users</h3>
            <ul className="space-y-2">
              {filteredUsers.map((user) => (
                <li
                  key={user.id}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded"
                >
                  <div>
                    <span className="font-medium">{user.email}</span>
                    <span className="ml-2 text-sm text-gray-600">
                      ({user.role})
                    </span>
                  </div>
                  <button
                    onClick={() => setDeleteUser(user)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-800"
                    disabled={state.loading}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>

            {state.hasMore && (
              <button
                onClick={loadMore}
                className="mt-4 w-full p-2 bg-gray-100 hover:bg-gray-200 rounded"
                disabled={state.loading}
              >
                Load More
              </button>
            )}
          </div>

          <AlertDialog
            open={!!deleteUser}
            onOpenChange={() => setDeleteUser(null)}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete User</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete {deleteUser?.email}? This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <button
                  onClick={() => setDeleteUser(null)}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 ml-2"
                >
                  Delete
                </button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
};

export default UserManagement;
