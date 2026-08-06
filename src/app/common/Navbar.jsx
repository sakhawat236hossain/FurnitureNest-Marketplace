"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, User, LogOut } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  const { data: session } = useSession();
  const router = useRouter();

  // Sync user from NextAuth or localStorage
  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
      return;
    }

    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [session]);

  const handleLogout = async () => {
    localStorage.removeItem("user");

    if (session?.user) {
      await signOut({ callbackUrl: "/" });
    } else {
      setUser(null);
      router.push("/");
    }
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
      <Link href="/" className="hover:text-amber-500 transition">
        Home
      </Link>

      <Link href="/categories" className="hover:text-amber-500 transition">
        Categories
      </Link>

      <Link href="/featured" className="hover:text-amber-500 transition">
        Featured
      </Link>

      <Link href="/latest" className="hover:text-amber-500 transition">
        Latest
      </Link>

      <Link href="/contact" className="hover:text-amber-500 transition">
        Contact
      </Link>

    </>
  );

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center font-bold shadow-md">
              F
            </div>

            <span className="text-2xl font-extrabold text-white tracking-wide">
              FurnishNest
            </span>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-200">
            <Links />
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
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
                  className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 hover:bg-white/20 transition"
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt="profile"
                      className="w-8 h-8 rounded-full object-cover border border-white/20"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-sm font-bold">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}

                  <span className="text-sm text-white font-medium max-w-28 truncate">
                    {user.name}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-xl border border-red-400/30 px-4 py-2 text-sm font-medium text-red-300 hover:bg-red-500/10 transition"
                >
                  <LogOut size={18} />
                  Logout
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
                  className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md hover:scale-105 hover:shadow-lg transition duration-300"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition text-white"
            aria-label="Open menu"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden pb-4 border-t border-white/10 bg-slate-900/95 rounded-b-2xl">
            <nav className="flex flex-col gap-4 pt-4 text-sm font-medium text-gray-200 px-2">
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
                    className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-3 hover:bg-white/10 transition"
                  >
                    {user.image ? (
                      <img
                        src={user.image}
                        alt="profile"
                        className="w-9 h-9 rounded-full object-cover border border-white/20"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center text-white text-sm font-bold">
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
                    className="flex items-center gap-2 rounded-xl border border-red-400/30 px-3 py-3 text-left text-red-300 hover:bg-red-500/10 transition"
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
                    className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-2 rounded-xl text-center font-semibold hover:scale-[1.02] transition duration-300"
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
  );
}
