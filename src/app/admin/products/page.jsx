"use client";

import withRole from "@/utils/roleMiddleware"; // Import the middleware
import ProductsCreationForm from "@/components/ui/ProductsCreationForm"; // Import the Products Creation Form component

function ProductsPage() {
  return (
    <div className="container mx-auto mt-4">
      <h1 className="text-2xl font-bold mb-4">Manage Products</h1>
      <ProductsCreationForm />
    </div>
  );
}

// Wrap the ProductsPage with `withRole` middleware for Admin access only
export default withRole(ProductsPage, "admin");
