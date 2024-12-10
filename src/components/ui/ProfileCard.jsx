"use client";

export default function ProfileCard({ name, email, phone, role }) {
  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-2">Account Details</h2>
      <p>
        <strong>Name:</strong> {name || "N/A"}
      </p>
      <p>
        <strong>Email:</strong> {email || "N/A"}
      </p>
      <p>
        <strong>Phone:</strong> {phone || "N/A"}
      </p>
      <p>
        <strong>Role:</strong> {role || "N/A"}
      </p>
    </div>
  );
}
