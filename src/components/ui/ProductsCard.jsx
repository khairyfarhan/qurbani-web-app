"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

export default function ProductsCard({ agentId }) {
  const [products, setProducts] = useState([]);
  const [chosenProducts, setChosenProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const fetchedProducts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(fetchedProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products.");
      }
    };

    fetchProducts();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await setDoc(doc(db, "chosenProducts", agentId), { products: chosenProducts });
      setSuccess("Selected products saved successfully.");
    } catch (err) {
      console.error("Error saving chosen products:", err);
      setError("Failed to save selected products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleProductSelection = (productId) => {
    setChosenProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-2">Select Products</h2>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <ul className="space-y-2 max-h-64 overflow-y-auto">
        {products.map((product) => (
          <li key={product.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={chosenProducts.includes(product.id)}
              onChange={() => toggleProductSelection(product.id)}
            />
            <label>{product.name} - {product.country}</label>
          </li>
        ))}
      </ul>
      <button
        onClick={handleSave}
        disabled={loading}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save Preferences
      </button>
    </div>
  );
}
