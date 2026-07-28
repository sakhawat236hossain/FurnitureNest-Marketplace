'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const latestProducts = [
  {
    id: 1,
    name: 'Scandinavian Lounge Chair',
    category: 'Living Room',
    image:
      'https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=900&auto=format&fit=crop',
    price: '৳12,500',
    date: 'New Arrival',
  },
  {
    id: 2,
    name: 'Minimalist Dining Set',
    category: 'Dining',
    image:
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=900&auto=format&fit=crop',
    price: '৳28,000',
    date: 'July 2026',
  },
  {
    id: 3,
    name: 'Luxury Bedroom Collection',
    category: 'Bedroom',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=900&auto=format&fit=crop',
    price: '৳55,000',
    date: 'Limited Edition',
  },
];

const cardVariant = {
  hidden: { opacity: 0, x: -80, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      delay: i * 0.2,
      duration: 0.7,
      ease: 'easeOut',
    },
  }),
};

export default function LatestSection() {
  return (
    <section className="relative overflow-hidden py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 transition-colors duration-300">
      {/* Animated floating glow */}
      <motion.div
        animate={{
          x: [0, 120, 0],
          y: [0, -60, 0],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-amber-400/20 blur-3xl"
      />

      <motion.div
        animate={{
          x: [0, -100, 0],
          y: [0, 80, 0],
          rotate: [360, 180, 0],
        }}
        transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
        className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300 px-4 py-1 text-sm font-medium border border-amber-200 dark:border-amber-400/20 backdrop-blur">
            ✨ Latest Collection
          </span>

          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white">
            Fresh Arrivals for
            <span className="block bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              Modern Living
            </span>
          </h2>

          <p className="mt-5 text-base sm:text-lg leading-8 text-gray-600 dark:text-gray-400">
            Discover the newest additions to our premium furniture collection,
            carefully selected for style, comfort and craftsmanship.
          </p>
        </motion.div>

        {/* Animated Cards */}
        <div className="mt-16 space-y-10">
          {latestProducts.map((item, index) => (
            <motion.div
              key={item.id}
              custom={index}
              variants={cardVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{
                y: -8,
                rotateX: 2,
                rotateY: index % 2 === 0 ? 2 : -2,
              }}
              className="group relative overflow-hidden rounded-[2rem] border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 shadow-lg backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/20"
            >
              {/* Animated border glow */}
              <motion.div
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent blur-sm"
              />

              <div className="grid gap-0 md:grid-cols-2">
                {/* Image */}
                <div
                  className={`overflow-hidden ${
                    index % 2 === 1 ? 'md:order-2' : ''
                  }`}
                >
                  <motion.img
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.6 }}
                    src={item.image}
                    alt={item.name}
                    className="h-72 w-full object-cover md:h-full"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col justify-center p-8 sm:p-10">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="rounded-full bg-amber-100 dark:bg-amber-400/10 px-3 py-1 font-medium text-amber-700 dark:text-amber-300">
                      {item.category}
                    </span>

                    <span className="text-gray-500 dark:text-gray-400">
                      •
                    </span>

                    <span className="text-gray-500 dark:text-gray-400">
                      {item.date}
                    </span>
                  </div>

                  <motion.h3
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-4 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white"
                  >
                    {item.name}
                  </motion.h3>

                  <p className="mt-4 text-gray-600 dark:text-gray-400 leading-7">
                    Premium materials, modern craftsmanship and timeless design
                    make this collection a perfect choice for elegant interiors.
                  </p>

                  <div className="mt-6 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Starting from
                      </p>

                      <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
                        {item.price}
                      </p>
                    </div>

                    <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
                      <Link
                        href={`/product/${item.id}`}
                        className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:shadow-orange-500/40"
                      >
                        View Details
                        <span>→</span>
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16 text-center"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
            <Link
              href="/latest"
              className="inline-flex items-center gap-2 rounded-2xl border border-gray-300 dark:border-white/10 bg-white/70 dark:bg-white/5 px-6 py-3 text-sm font-semibold text-gray-900 dark:text-white backdrop-blur transition-all duration-300 hover:border-amber-400 hover:text-amber-500 dark:hover:border-amber-400 dark:hover:text-amber-300 shadow-lg hover:shadow-xl hover:shadow-amber-500/10"
            >
              Browse All New Arrivals
              <span>→</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}