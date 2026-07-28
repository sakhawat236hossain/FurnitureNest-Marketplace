'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { uploadImageToCloudinary } from '@/utils/cloudinary';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Lock,
  ImagePlus,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import GoogleLoginButton from '@/components/Auth/GoogleLoginButton';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.email('Enter a valid email'),
  phone: z.string().regex(/^01[3-9]\d{8}$/, 'Invalid BD number'),
  password: z.string().min(6, 'Minimum 6 characters'),
  image: z.any().optional(),
});

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      let imageUrl = '';

      if (data.image?.[0]) {
        imageUrl = await uploadImageToCloudinary(data.image[0]);
      }

      const res = await axios.post('/api/auth/register', {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        image: imageUrl,
      });

      if (res.data.success) {
        toast.success('Registration successful');

        // user data localStorage এ save
        localStorage.setItem(
          'user',
          JSON.stringify({
            name: data.name,
            email: data.email,
            phone: data.phone,
            image: imageUrl,
          })
        );

        reset();

        // home page এ redirect
        setTimeout(() => {
          router.push('/');
        }, 1000);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Registration failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#f59e0b22,transparent_35%),radial-gradient(circle_at_bottom_left,#ea580c22,transparent_35%)]" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md rounded-[28px] border border-white/10 bg-white/5 p-8 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.45)]"
      >
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            F
          </div>

          <h1 className="mt-4 text-3xl font-black text-white">
            Create Account
          </h1>

          <p className="mt-2 text-gray-400">
            Join FurnishNest today
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <GoogleLoginButton />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>

            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-950/80 px-3 text-gray-400 backdrop-blur">
                Or create account with email
              </span>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 space-y-4"
        >
          <InputField
            icon={User}
            placeholder="Full Name"
            error={errors.name?.message}
            register={register('name')}
          />

          <InputField
            icon={Mail}
            type="email"
            placeholder="Email Address"
            error={errors.email?.message}
            register={register('email')}
          />

          <InputField
            icon={Phone}
            type="tel"
            placeholder="Phone Number"
            error={errors.phone?.message}
            register={register('phone')}
          />

          <InputField
            icon={Lock}
            type="password"
            placeholder="Password"
            error={errors.password?.message}
            register={register('password')}
          />

          <div>
            <label className="flex items-center gap-2 text-sm text-gray-300 mb-2">
              <ImagePlus size={16} /> Profile Image
            </label>

            <input
              type="file"
              accept="image/*"
              {...register('image')}
              className="w-full text-sm text-gray-300 file:mr-4 file:rounded-xl file:border-0 file:bg-amber-500 file:px-4 file:py-2 file:text-white hover:file:bg-amber-600"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 py-3 font-semibold text-white shadow-lg shadow-orange-500/20 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Account'}
          </motion.button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-amber-400 hover:text-amber-300 font-medium cursor-pointer"
          >
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

function InputField({
  icon: Icon,
  register,
  error,
  type = 'text',
  placeholder,
}) {
  return (
    <div>
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-amber-400 transition">
        <Icon className="text-amber-400" size={18} />

        <input
          type={type}
          placeholder={placeholder}
          {...register}
          className="w-full bg-transparent text-white placeholder:text-gray-500 outline-none"
        />
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}