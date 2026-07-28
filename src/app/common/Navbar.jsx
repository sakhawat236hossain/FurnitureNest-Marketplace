'use client';

import React, { useState } from 'react';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const Links = () => (
    <>
      <a href="#home" className="hover:text-amber-500 transition">
        Home
      </a>

      <a href="#categories" className="hover:text-amber-500 transition">
        Categories
      </a>

      <a href="#featured" className="hover:text-amber-500 transition">
        Featured
      </a>

      <a href="#latest" className="hover:text-amber-500 transition">
        Latest
      </a>

      <a href="#contact" className="hover:text-amber-500 transition">
        Contact
      </a>
    </>
  );

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center font-bold shadow-md">
              F
            </div>

            <span className="text-2xl font-extrabold text-white tracking-wide">
              FurnishNest
            </span>
          </a>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-200">
            <Links />
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="/login"
              className="text-sm font-medium text-gray-200 hover:text-amber-400 transition"
            >
              Login
            </a>

            <a
              href="/register"
              className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md hover:scale-105 hover:shadow-lg transition duration-300"
            >
              Register
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition text-white"
            aria-label="Open menu"
          >
            {open ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden pb-4 border-t border-white/10 bg-slate-900/95 rounded-b-2xl">
            <nav className="flex flex-col gap-4 pt-4 text-sm font-medium text-gray-200 px-2">
              <Links />

              <a
                href="/login"
                className="pt-3 border-t border-white/10 hover:text-amber-400 transition"
              >
                Login
              </a>

              <a
                href="/register"
                className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-2 rounded-xl text-center font-semibold hover:scale-[1.02] transition duration-300"
              >
                Register
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}