"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, X, Trash2, Plus, Minus, ArrowRight, ShieldCheck } from "lucide-react";

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItemsCount,
    totalPrice,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex justify-end bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300"
      onClick={() => setIsCartOpen(false)}
    >
      <div
        className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
              <ShoppingBag size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Your Shopping Cart
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {totalItemsCount} item{totalItemsCount !== 1 ? "s" : ""} selected
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/10 dark:hover:text-white"
            aria-label="Close cart drawer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center py-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-500 dark:bg-amber-500/10">
                <ShoppingBag size={32} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">
                Your cart is empty
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                Explore our premium furniture collection and add items to your cart.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:scale-105 transition"
              >
                Browse Furniture
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 rounded-2xl border border-gray-100 bg-slate-50/50 p-4 dark:border-white/10 dark:bg-slate-950/50"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-20 w-20 rounded-xl object-cover border border-gray-200 dark:border-white/10"
                />

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 transition p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                      Seller: {item.vendorName}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-base font-extrabold text-gray-900 dark:text-white">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </p>

                    <div className="flex items-center rounded-xl border border-gray-200 bg-white dark:border-white/10 dark:bg-slate-900">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 text-gray-600 hover:text-amber-500 dark:text-gray-300"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-2 text-xs font-bold text-gray-900 dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 text-gray-600 hover:text-amber-500 dark:text-gray-300"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-gray-200 p-6 dark:border-white/10 bg-white dark:bg-slate-900 space-y-4">
            <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
              <ShieldCheck size={16} />
              <span>Cash on Delivery available nationwide</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Subtotal Amount
              </span>
              <span className="text-2xl font-black text-gray-900 dark:text-white">
                ৳{totalPrice.toLocaleString()}
              </span>
            </div>

            <div className="grid gap-2">
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 hover:scale-[1.02] transition"
              >
                Checkout (Cash on Delivery)
                <ArrowRight size={16} />
              </Link>
              <button
                onClick={clearCart}
                className="w-full text-center text-xs text-gray-500 hover:text-red-500 py-1 transition"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
