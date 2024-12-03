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
    initialized: false
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        if (user) {
          try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            setState(prev => ({
              ...prev,
              user,
              userData: userDoc.data(),
              loading: false,
              initialized: true,
              error: null
            }));
          } catch (error) {
            setState(prev => ({
              ...prev,
              error: error.message,
              loading: false,
              initialized: true
            }));
          }
        } else {
          setState(prev => ({
            ...prev,
            user: null,
            userData: null,
            loading: false,
            initialized: true,
            error: null
          }));
        }
      },
      (error) => {
        setState(prev => ({
          ...prev,
          error: error.message,
          loading: false,
          initialized: true
        }));
      }
    );

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      setState(prev => ({ ...prev, error: error.message }));
    }
  };

  const value = {
    user: state.user,
    userData: state.userData,
    loading: state.loading,
    error: state.error,
    initialized: state.initialized,
    signOut,
    isAdmin: state.userData?.role === 'admin',
    isAgent: state.userData?.role === 'agent',
    isSupplier: state.userData?.role === 'supplier'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};