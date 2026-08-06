"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import CartDrawer from "@/components/Cart/CartDrawer";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const { totalItemsCount, setIsCartOpen } = useCart();

  const user = session?.user || null;

  const handleLogout = async () => {
    try {
      localStorage.removeItem("user");
    } catch (e) {}
    await signOut({ callbackUrl: "/" });
  };

  const handleDashboard = () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role === "admin") {
      router.push("/admin");
    } else if (user.role === "seller") {
      router.push("/seller");
    } else {
      router.push("/dashboard/user");
    }
  };

  const Links = () => (
    <>
      <Link href="/" className="hover:text-amber-400 transition">
        Home
      </Link>

      <Link href="/categories" className="hover:text-amber-400 transition">
        Categories
      </Link>

      <Link href="/featured" className="hover:text-amber-400 transition">
        Featured
      </Link>

      <Link href="/latest" className="hover:text-amber-400 transition">
        Latest
      </Link>

      <Link href="/about" className="hover:text-amber-400 transition">
        About
      </Link>

      <Link href="/contact" className="hover:text-amber-400 transition">
        Contact
      </Link>

      <Link href="/faq" className="hover:text-amber-400 transition">
        FAQ
      </Link>
    </>
  );

  return (
    <>
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center font-extrabold shadow-md shadow-amber-500/20">
                F
              </div>

              <span className="text-2xl font-extrabold text-white tracking-wide">
                FurnishNest
              </span>
            </Link>

            {/* Desktop Menu */}
            <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-gray-200">
              <Links />
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-2 rounded-xl bg-white/10 px-3.5 py-2 text-sm font-medium text-white hover:bg-white/20 transition"
                aria-label="Shopping Cart"
              >
                <ShoppingBag size={19} className="text-amber-400" />
                <span>Cart</span>
                {totalItemsCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[11px] font-black text-slate-950 shadow-md">
                    {totalItemsCount}
                  </span>
                )}
              </button>

              {user ? (
                <>
                  <button
                    onClick={handleDashboard}
                    className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 transition"
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </button>

                  <Link
                    href="/dashboard/profile"
                    className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-1.5 hover:bg-white/20 transition"
                  >
                    {user.image ? (
                      <img
                        src={user.image}
                        alt="profile"
                        className="w-7 h-7 rounded-full object-cover border border-white/20"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs font-bold">
                        {user.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                    )}

                    <span className="text-sm text-white font-medium max-w-28 truncate">
                      {user.name}
                    </span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 rounded-xl border border-red-400/30 px-3 py-2 text-sm font-medium text-red-300 hover:bg-red-500/10 transition"
                  >
                    <LogOut size={16} />
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm font-medium text-gray-200 hover:text-amber-400 transition"
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md hover:scale-105 transition duration-300"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu & Cart Trigger */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
                aria-label="Shopping Cart"
              >
                <ShoppingBag size={20} className="text-amber-400" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-black text-slate-950">
                    {totalItemsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setOpen(!open)}
                className="p-2 rounded-lg hover:bg-white/10 transition text-white"
                aria-label="Toggle menu"
              >
                {open ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {open && (
            <div className="lg:hidden pb-5 pt-2 border-t border-white/10 bg-slate-900/95 rounded-b-2xl">
              <nav className="flex flex-col gap-3 pt-2 text-sm font-medium text-gray-200 px-2">
                <Links />

                {user ? (
                  <>
                    <button
                      onClick={handleDashboard}
                      className="flex items-center gap-2 pt-3 border-t border-white/10 text-left hover:text-amber-400 transition"
                    >
                      <LayoutDashboard size={18} />
                      Dashboard
                    </button>

                    <Link
                      href="/dashboard/profile"
                      className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5 hover:bg-white/10 transition"
                    >
                      {user.image ? (
                        <img
                          src={user.image}
                          alt="profile"
                          className="w-8 h-8 rounded-full object-cover border border-white/20"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs font-bold">
                          {user.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                      )}

                      <div className="flex flex-col">
                        <span className="text-white font-medium">
                          {user.name}
                        </span>
                        <span className="text-xs text-gray-400 capitalize">
                          {user.role || "user"}
                        </span>
                      </div>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 rounded-xl border border-red-400/30 px-3 py-2.5 text-left text-red-300 hover:bg-red-500/10 transition"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="pt-3 border-t border-white/10 hover:text-amber-400 transition"
                    >
                      Login
                    </Link>

                    <Link
                      href="/register"
                      className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-2.5 rounded-xl text-center font-semibold transition"
                    >
                      Register
                    </Link>
                  </>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Global Slide-Over Cart Drawer */}
      <CartDrawer />
    </>
  );
}
