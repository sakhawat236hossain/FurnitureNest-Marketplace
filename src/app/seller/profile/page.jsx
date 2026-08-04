"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Mail, Phone, Shield, Calendar } from "lucide-react";

export default function SellerProfilePage() {
  const { data: session } = useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      let email = session?.user?.email;

      if (!email && typeof window !== "undefined") {
        const stored = localStorage.getItem("user");
        if (stored) email = JSON.parse(stored).email;
      }

      if (!email) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`/api/profile?email=${email}`);
        setUser(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [session]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  if (!user) return <p className="text-gray-500">No seller profile found.</p>;

  return (
    <div className="space-y-6 rounded-3xl bg-white p-6 shadow-sm dark:bg-slate-900">
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <img
          src={user.image}
          alt={user.name}
          className="h-24 w-24 rounded-full object-cover"
        />
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {user.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
          <span className="mt-2 inline-flex rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-700">
            {user.role}
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 p-4 dark:border-white/10">
          <div className="mb-2 flex items-center gap-2 text-amber-600">
            <Mail size={18} />
            <span className="text-sm font-semibold">Email</span>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {user.email}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 p-4 dark:border-white/10">
          <div className="mb-2 flex items-center gap-2 text-amber-600">
            <Phone size={18} />
            <span className="text-sm font-semibold">Phone</span>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {user.phone || "Not provided"}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 p-4 dark:border-white/10">
          <div className="mb-2 flex items-center gap-2 text-amber-600">
            <Shield size={18} />
            <span className="text-sm font-semibold">Role</span>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {user.role || "seller"}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 p-4 dark:border-white/10">
          <div className="mb-2 flex items-center gap-2 text-amber-600">
            <Calendar size={18} />
            <span className="text-sm font-semibold">Joined</span>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {user.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}
