import React from 'react';

export default function Footer() {
  return (
    <footer
      id="contact"
      className="bg-gray-900 text-gray-300 mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white text-black flex items-center justify-center font-bold">
                F
              </div>
              <h3 className="text-2xl font-bold text-white">
                FurnishNest
              </h3>
            </div>

            <p className="mt-4 text-sm leading-6 text-gray-400">
              Quality furniture delivered to your doorstep. Stylish, durable and
              comfortable furniture for every home.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h4>

            <ul className="space-y-3 text-sm">
              <li>
                <a href="#home" className="hover:text-white transition">
                  Home
                </a>
              </li>

              <li>
                <a
                  href="#featured"
                  className="hover:text-white transition"
                >
                  Featured Furniture
                </a>
              </li>

              <li>
                <a href="#latest" className="hover:text-white transition">
                  Latest Collection
                </a>
              </li>

              <li>
                <a
                  href="#contact"
                  className="hover:text-white transition"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Contact
            </h4>

            <ul className="space-y-3 text-sm text-gray-400">
              <li>📧 support@furnishnest.com</li>
              <li>📞 +880 1700-000000</li>
              <li>📍 Dhaka, Bangladesh</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Follow Us
            </h4>

            <div className="flex gap-4 text-sm">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition"
              >
                Facebook
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition"
              >
                Instagram
              </a>

              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition"
              >
                X
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 text-center text-sm text-gray-500">
          © 2026 FurnishNest. All rights reserved.
        </div>
      </div>
    </footer>
  );
}