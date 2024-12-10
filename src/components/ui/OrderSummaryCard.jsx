"use client";

export default function OrderSummaryCard({ orders }) {
  const totalOrders = orders.length;
  const totalAmount = orders.reduce(
    (sum, order) => sum + (order.currency === "SGD" ? order.price : 0), // Modify as needed for RM
    0
  );

  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-2">Order Summary</h2>
      <p>
        <strong>Total Orders:</strong> {totalOrders}
      </p>
      <p>
        <strong>Total Amount (SGD):</strong> {totalAmount.toFixed(2)}
      </p>
      <a
        href="/agents/orders"
        className="text-blue-500 underline hover:text-blue-700"
      >
        View Order History
      </a>
    </div>
  );
}
