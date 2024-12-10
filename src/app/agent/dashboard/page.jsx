"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import Navbar from "@/components/ui/Navbar";
import OrderSummaryCard from "@/components/ui/OrderSummaryCard";
import ProfileCard from "@/components/ui/ProfileCard";

export default function AgentDashboard() {
  const { user, userData } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const q = query(
          collection(db, "orders"),
          where("agentId", "==", user?.uid)
        );
        const querySnapshot = await getDocs(q);
        const fetchedOrders = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(fetchedOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.uid) {
      fetchOrders();
    }
  }, [user?.uid]);

  return (
    <div>
      <Navbar />
      <div className="container mx-auto mt-4">
        <h1 className="text-2xl font-bold mb-4">Agent Dashboard</h1>

        {error && <p className="text-red-500">{error}</p>}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Account Details */}
            <ProfileCard
              name={userData?.name}
              email={user?.email}
              phone={userData?.phone}
              role={userData?.role}
            />

            {/* Order Summary */}
            <OrderSummaryCard orders={orders} />
          </div>
        )}
      </div>
    </div>
  );
}
