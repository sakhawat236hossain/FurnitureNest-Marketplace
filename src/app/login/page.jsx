"use client";

import { useRouter } from "next/navigation";
import { getSession, signIn } from "next-auth/react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import GoogleLoginButton from "@/components/Auth/GoogleLoginButton";

const schema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error("Invalid email or password");
      }

      const activeSession = await getSession();
      const role = activeSession?.user?.role?.toLowerCase();

      toast.success("Login successful");

      router.replace(
        role === "admin"
          ? "/admin"
          : role === "seller"
            ? "/seller"
            : "/dashboard/user"
      );
    } catch (error) {
      toast.error(error.message || "Login failed");
    }
  };

  // Demo login function
  const demoLogin = async (email) => {
    const password = "Ab1234";

    setValue("email", email);
    setValue("password", password);

    await onSubmit({ email, password });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden px-4 py-10">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#f59e0b22,transparent_35%),radial-gradient(circle_at_bottom_left,#ea580c22,transparent_35%)]" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-2xl rounded-[28px] border border-white/10 bg-white/5 p-8 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.45)]"
      >
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            F
          </div>

          <h1 className="mt-4 text-3xl font-black text-white">
            Welcome Back
          </h1>

          <p className="mt-2 text-gray-400">
            Login to continue shopping premium furniture
          </p>
        </div>

        {/* Demo Login Cards */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => demoLogin("admin@gmail.com")}
            className="rounded-2xl border border-amber-400/20 bg-white/5 p-4 text-left hover:border-amber-400 hover:bg-white/10 transition duration-300"
          >
            <p className="text-xs text-gray-400">Admin Login</p>
            <p className="text-sm font-semibold text-white truncate">
              admin@gmail.com
            </p>
            <p className="text-xs text-amber-400 mt-1">Pass: Ab1234</p>
          </button>

          <button
            type="button"
            onClick={() => demoLogin("seller@gmail.com")}
            className="rounded-2xl border border-amber-400/20 bg-white/5 p-4 text-left hover:border-amber-400 hover:bg-white/10 transition duration-300"
          >
            <p className="text-xs text-gray-400">Seller Login</p>
            <p className="text-sm font-semibold text-white truncate">
              seller@gmail.com
            </p>
            <p className="text-xs text-amber-400 mt-1">Pass: Ab1234</p>
          </button>

          <button
            type="button"
            onClick={() => demoLogin("user@gmail.com")}
            className="rounded-2xl border border-amber-400/20 bg-white/5 p-4 text-left hover:border-amber-400 hover:bg-white/10 transition duration-300"
          >
            <p className="text-xs text-gray-400">User Login</p>
            <p className="text-sm font-semibold text-white truncate">
              user@gmail.com
            </p>
            <p className="text-xs text-amber-400 mt-1">Pass: Ab1234</p>
          </button>
        </div>

        {/* Google Login */}
        <div className="mt-8 space-y-4">
          <GoogleLoginButton />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>

            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-950/80 px-3 text-gray-400 backdrop-blur">
                Or continue with email
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <InputField
            icon={Mail}
            type="email"
            placeholder="Email Address"
            error={errors.email?.message}
            register={register("email")}
          />

          <InputField
            icon={Lock}
            type="password"
            placeholder="Password"
            error={errors.password?.message}
            register={register("password")}
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full cursor-pointer rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 py-3 font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:shadow-orange-500/40"
          >
            Login
          </motion.button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-amber-400 hover:text-amber-300 font-medium transition"
          >
            Register
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
  type = "text",
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

      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
}