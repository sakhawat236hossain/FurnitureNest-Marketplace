"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";

export default function OrderButton({ product, variant = "add", className = "" }) {
  const { addToCart } = useCart();

  const handleAction = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, true);
  };

  if (variant === "buy") {
    return (
      <button
        type="button"
        onClick={handleAction}
        className={`inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all duration-200 hover:from-amber-600 hover:to-orange-600 hover:scale-[1.02] active:scale-[0.98] ${className}`}
      >
        <ShoppingCart size={18} /> Buy Now (COD)
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleAction}
      className={`inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-orange-500/20 transition-all duration-200 hover:from-amber-600 hover:to-orange-600 hover:scale-[1.02] active:scale-[0.98] ${className}`}
    >
      <ShoppingCart size={16} /> Add to Cart
    </button>
  );
}
