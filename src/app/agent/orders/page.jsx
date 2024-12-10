"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

export default function AgentOrderForm({ agentId }) {
  const [products, setProducts] = useState([]);
  const [chosenProducts, setChosenProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChosenProducts = async () => {
      try {
        const docSnapshot = await getDoc(doc(db, "chosenProducts", agentId));
        if (docSnapshot.exists()) {
          setChosenProducts(docSnapshot.data().products || []);
        }

        const querySnapshot = await getDocs(collection(db, "products"));
        const fetchedProducts = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((product) => chosenProducts.includes(product.id));

        setProducts(fetchedProducts);
      } catch (err) {
        console.error("Error loading products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChosenProducts();
  }, [agentId]);

  return (
    <div>
      <h1>Submit Orders</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form>
          <label htmlFor="product">Select Product:</label>
          <select id="product" className="p-2 border rounded">
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} - {product.country}
              </option>
            ))}
          </select>
          {/* Add more form fields here */}
        </form>
      )}
    </div>
  );
}
