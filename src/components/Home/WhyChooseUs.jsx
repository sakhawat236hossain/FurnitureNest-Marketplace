'use client';

import React, { useEffect, useRef } from 'react';
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
} from 'framer-motion';

// Counter Component
function Counter({ value, suffix = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    stiffness: 60,
    damping: 20,
  });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, motionValue, value]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent =
          Math.floor(latest).toLocaleString() + suffix;
      }
    });

    return () => unsubscribe();
  }, [springValue, suffix]);

  return (
    <span
      ref={ref}
      className="text-3xl font-extrabold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent"
    >
      0
    </span>
  );
}

const features = [
  {
    id: 1,
    icon: '🚚',
    title: 'Free Delivery',
    desc: 'Fast and secure delivery service across Bangladesh for selected products.',
  },
  {
    id: 2,
    icon: '🛡️',
    title: '2 Years Warranty',
    desc: 'Premium quality furniture backed by a reliable warranty and support.',
  },
  {
    id: 3,
    icon: '🎨',
    title: 'Modern Design',
    desc: 'Elegant and contemporary furniture crafted for modern living spaces.',
  },
  {
    id: 4,
    icon: '💳',
    title: 'Easy Payment',
    desc: 'Flexible payment options including online payment, card and cash on delivery.',
  },
];

const cardVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: 'easeOut',
    },
  }),
};

export default function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden py-24 bg-gradient-to-b from-white via-gray-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      {/* Animated glow backgrounds */}
      <motion.div
        animate={{
          x: [0, 120, 0],
          y: [0, -60, 0],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-amber-400/20 blur-3xl"
      />

      <motion.div
        animate={{
          x: [0, -100, 0],
          y: [0, 80, 0],
          rotate: [360, 180, 0],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
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
            Why Choose Us
          </span>

          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white">
            Crafted for Comfort,
            <span className="block bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              Designed for Life
            </span>
          </h2>

          <p className="mt-5 text-base sm:text-lg leading-8 text-gray-600 dark:text-gray-400">
            We combine premium craftsmanship, modern design and trusted service
            to create furniture that lasts for years.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              custom={index}
              variants={cardVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{
                y: -10,
                rotateX: 3,
                rotateY: index % 2 === 0 ? 3 : -3,
                scale: 1.02,
              }}
              className="group relative overflow-hidden rounded-[2rem] border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 p-8 shadow-lg backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/20"
            >
              {/* Animated light streak */}
              <motion.div
                animate={{ x: ['-120%', '120%'] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
                className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent blur-sm"
              />

              {/* Icon */}
              <motion.div
                whileHover={{ rotate: 8, scale: 1.1 }}
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-3xl shadow-lg shadow-orange-500/20"
              >
                {feature.icon}
              </motion.div>

              <h3 className="mt-6 text-xl font-bold text-gray-900 dark:text-white">
                {feature.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-400">
                {feature.desc}
              </p>

              {/* Bottom accent */}
              <div className="absolute inset-x-6 bottom-0 h-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>

        {/* Animated Counter Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16 rounded-[2rem] border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 p-6 sm:p-8 backdrop-blur-xl shadow-lg"
        >
          <div className="grid grid-cols-2 gap-6 text-center sm:grid-cols-4">
            {[
              { value: 10, suffix: '+', label: 'Years Experience' },
              { value: 5000, suffix: '+', label: 'Happy Customers' },
              { value: 500, suffix: '+', label: 'Premium Products' },
              { value: 98, suffix: '%', label: 'Satisfaction Rate' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="rounded-2xl bg-white/60 dark:bg-white/5 p-4 backdrop-blur border border-gray-200 dark:border-white/10 shadow-sm"
              >
                <Counter value={item.value} suffix={item.suffix} />

                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {item.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}