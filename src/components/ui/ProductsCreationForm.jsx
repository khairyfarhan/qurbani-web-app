"use client";

import { useState } from "react";
import { db } from "@/firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

export default function ProductsCreationForm() {
  const [country, setCountry] = useState("");
  const [animalType, setAnimalType] = useState("");
  const [productId, setProductId] = useState("");
  const [priceSGD, setPriceSGD] = useState("");
  const [priceMYR, setPriceMYR] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!country || !animalType || !productId || !priceSGD) {
      setError("Country, animal type, product ID, and SGD price are required.");
      return;
    }

    try {
      await addDoc(collection(db, "products"), {
        country,
        animalType,
        productId,
        prices: {
          SGD: parseFloat(priceSGD),
          MYR: priceMYR ? parseFloat(priceMYR) : null,
        },
        createdAt: new Date(),
      });
      setSuccess("Product added successfully!");
      setCountry("");
      setAnimalType("");
      setProductId("");
      setPriceSGD("");
      setPriceMYR("");
    } catch (err) {
      setError("Failed to add product. Please try again.");
    }
  };

  return (
    <div className="container mx-auto mt-4">
      <h2 className="text-2xl font-bold mb-4">Create New Product</h2>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="country" className="block text-sm font-medium">
            Country
          </label>
          <input
            id="country"
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Enter country name"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="animalType" className="block text-sm font-medium">
            Animal Type
          </label>
          <input
            id="animalType"
            type="text"
            value={animalType}
            onChange={(e) => setAnimalType(e.target.value)}
            placeholder="Enter animal type"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="productId" className="block text-sm font-medium">
            Product ID
          </label>
          <input
            id="productId"
            type="text"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            placeholder="Enter product ID"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="priceSGD" className="block text-sm font-medium">
            Price (SGD)
          </label>
          <input
            id="priceSGD"
            type="number"
            value={priceSGD}
            onChange={(e) => setPriceSGD(e.target.value)}
            placeholder="Price in SGD"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="priceMYR" className="block text-sm font-medium">
            Price (MYR)
          </label>
          <input
            id="priceMYR"
            type="number"
            value={priceMYR}
            onChange={(e) => setPriceMYR(e.target.value)}
            placeholder="Price in MYR"
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}
