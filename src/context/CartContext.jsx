"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on client render
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("fn_cart");
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Sync cart changes to localStorage
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem("fn_cart", JSON.stringify(cart));
      } catch (e) {
        console.error("Failed to save cart to localStorage", e);
      }
    }
  }, [cart, isInitialized]);

  const addToCart = (product, quantity = 1, openDrawer = true) => {
    const id = product._id?.toString() || product.id?.toString();
    if (!id) {
      toast.error("Invalid product");
      return;
    }

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        toast.success(`Updated ${product.name} quantity in cart`);
        return updated;
      }

      const item = {
        id,
        name: product.name,
        price: Number(product.price) || 0,
        image: product.images?.[0] || product.image || "/placeholder.png",
        category: product.category || "Furniture",
        vendorName: product.vendorName || "FurnishNest Vendor",
        vendorEmail: product.vendorEmail || "",
        quantity,
      };

      toast.success(`Added ${product.name} to cart`);
      return [...prevCart, item];
    });

    if (openDrawer) {
      setIsCartOpen(true);
    }
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    toast.info("Item removed from cart");
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem("fn_cart");
    } catch (e) {}
  };

  const totalItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        totalItemsCount,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
