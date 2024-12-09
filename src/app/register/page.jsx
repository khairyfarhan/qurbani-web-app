"use client";

import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

// Predefined list of countries and their phone prefixes
const countryOptions = [
  { name: "Singapore", code: "+65" },
  { name: "Indonesia", code: "+62" },
  { name: "Malaysia", code: "+60" },
  { name: "Brunei", code: "+673" },
  { name: "Australia", code: "+61" },
  { name: "India", code: "+91" },
  // Add more countries here as needed
];

export default function Registration() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(""); // Tracks selected country
  const [phonePrefix, setPhonePrefix] = useState(""); // Tracks selected phone prefix
  const [phone, setPhone] = useState(""); // Tracks phone number without prefix
  const [errorMessage, setErrorMessage] = useState(null); // Renamed for clarity
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccess(null);

    if (!name || !email || !company || !selectedCountry || !phone) {
      setErrorMessage("All fields are required");
      return;
    }

    try {
      await addDoc(collection(db, "pendingUsers"), {
        name,
        email,
        company,
        phone: `${phonePrefix} ${phone}`, // Combine prefix and phone number
        country: selectedCountry,
        role: "pending", // Default role
        createdAt: new Date(),
      });
      setSuccess("Registration submitted successfully");
      setName("");
      setEmail("");
      setCompany("");
      setSelectedCountry("");
      setPhonePrefix("");
      setPhone("");
    } catch (err) {
      console.error("Registration error:", err); // Log the error for debugging
      setErrorMessage("Failed to register. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 p-4 border rounded shadow"
      >
        <h1 className="text-2xl font-bold">Register</h1>
        {errorMessage && <div className="text-red-500">{errorMessage}</div>}
        {success && <div className="text-green-500">{success}</div>}

        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium">
            Company
          </label>
          <input
            id="company"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Your company name"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="country" className="block text-sm font-medium">
            Country
          </label>
          <select
            id="country"
            value={selectedCountry}
            onChange={(e) => {
              setSelectedCountry(e.target.value);
              const selectedOption = countryOptions.find(
                (option) => option.name === e.target.value
              );
              setPhonePrefix(selectedOption ? selectedOption.code : "");
            }}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select your country</option>
            {countryOptions.map((option) => (
              <option key={option.code} value={option.name}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium">
            Phone Number
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={phonePrefix}
              readOnly
              className="w-1/4 p-2 border rounded bg-gray-100"
              placeholder="Prefix"
            />
            <input
              id="phone"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Your phone number"
              className="w-3/4 p-2 border rounded"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
