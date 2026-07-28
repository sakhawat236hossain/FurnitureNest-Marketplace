'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [open, setOpen] = useState(false);

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

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-3">
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
        {open && (
          <div className="md:hidden pb-4 border-t border-white/10 bg-slate-900/95 rounded-b-2xl">
            <nav className="flex flex-col gap-4 pt-4 text-sm font-medium text-gray-200 px-2">
              <Links />

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
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}