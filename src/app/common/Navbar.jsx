'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  LogOut,
  User,
} from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [localUser, setLocalUser] = useState(null);

  const { data: session, status } = useSession();

  // localStorage user load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      setLocalUser(JSON.parse(storedUser));
    }
  }, []);

  // Google session or localStorage user
  const user = session?.user || localUser;

  const handleLogout = async () => {
    localStorage.removeItem('user');

    if (session) {
      await signOut({ callbackUrl: '/' });
    } else {
      window.location.href = '/';
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
    <header className="sticky top-0 z-50 cursor-pointer bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800 shadow-lg">
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

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-3 relative">
            {status === 'loading' ? (
              <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse" />
            ) : user ? (
              <>
                {/* Dashboard button */}
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-200 hover:border-amber-400 hover:text-amber-300 transition"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>

                {/* Profile dropdown */}
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1 pr-3 hover:border-amber-400 transition"
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover border border-amber-400/40"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center font-bold">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                  )}

                  <span className="text-sm text-white max-w-28 truncate">
                    {user.name}
                  </span>
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-14 w-64 rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur-xl p-2 shadow-2xl"
                    >
                      <div className="px-3 py-3 border-b border-white/10">
                        <p className="text-sm font-semibold text-white truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>

                      <Link
                        href="dashboard/profile"
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-gray-200 hover:bg-white/5 hover:text-amber-300 transition"
                        onClick={() => setProfileOpen(false)}
                      >
                        <User size={16} />
                        Profile
                      </Link>

                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-gray-200 hover:bg-white/5 hover:text-amber-300 transition"
                        onClick={() => setProfileOpen(false)}
                      >
                        <LayoutDashboard size={16} />
                        Dashboard
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-200 hover:text-amber-400 transition cursor-pointer"
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
            {open ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden overflow-hidden border-t border-white/10 bg-slate-900/95 rounded-b-2xl"
            >
              <nav className="flex flex-col gap-4 pt-4 pb-4 text-sm font-medium text-gray-200 px-4 cursor-pointer">
                <Links />

                <div className="border-t border-white/10 pt-4">
                  {user ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name}
                            className="w-12 h-12 rounded-full object-cover border border-amber-400/40"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center font-bold">
                            {user.name?.charAt(0) || 'U'}
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="text-white font-semibold truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <Link
                        href="/profile"
                        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 hover:border-amber-400 hover:text-amber-300 transition"
                        onClick={() => setOpen(false)}
                      >
                        <User size={18} />
                        Profile
                      </Link>

                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 hover:border-amber-400 hover:text-amber-300 transition"
                        onClick={() => setOpen(false)}
                      >
                        <LayoutDashboard size={18} />
                        Dashboard
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/10 px-4 py-3 text-red-400 hover:bg-red-500/20 transition"
                      >
                        <LogOut size={18} />
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <Link
                        href="/login"
                        className="rounded-xl border border-white/10 px-4 py-3 text-center hover:border-amber-400 hover:text-amber-300 transition"
                        onClick={() => setOpen(false)}
                      >
                        Login
                      </Link>

                      <Link
                        href="/register"
                        className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-3 rounded-xl text-center font-semibold hover:scale-[1.02] transition duration-300"
                        onClick={() => setOpen(false)}
                      >
                        Register
                      </Link>
                    </div>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}