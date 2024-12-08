"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState({
    user: null,
    userData: null,
    loading: true,
    error: null,
    initialized: false,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        if (user) {
          try {
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            // Debugging: Log the entire document snapshot
            if (userDoc.exists()) {
              console.log("Firestore Document Data:", userDoc.data());
            } else {
              console.error(
                "No user document found in Firestore for UID:",
                user.uid,
              );
            }

            setState((prev) => ({
              ...prev,
              user,
              userData: userDoc.data(),
              loading: false,
              initialized: true,
              error: null,
            }));
          } catch (error) {
            console.error("Error fetching user document:", error);
            setState((prev) => ({
              ...prev,
              error: error.message,
              loading: false,
              initialized: true,
            }));
          }
        } else {
          setState((prev) => ({
            ...prev,
            user: null,
            userData: null,
            loading: false,
            initialized: true,
            error: null,
          }));
        }
      },
      (error) => {
        console.error("Error in onAuthStateChanged:", error);
        setState((prev) => ({
          ...prev,
          error: error.message,
          loading: false,
          initialized: true,
        }));
      },
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log("AuthContext State Updated:", state);
  }, [state]);

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      // Clear state after sign out
      setState((prev) => ({
        ...prev,
        user: null,
        userData: null,
        error: null,
      }));
    } catch (error) {
      console.error("Error during sign out:", error);
      setState((prev) => ({ ...prev, error: error.message }));
    }
  };

  const hasRole = (role) => state.userData?.role === role;

  const value = {
    user: state.user,
    userData: state.userData,
    loading: state.loading,
    error: state.error,
    initialized: state.initialized,
    signOut,
    hasRole,
    isAdmin: hasRole("admin"),
    isAgent: hasRole("agent"),
    isSupplier: hasRole("supplier"),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
