'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import {
  Mail,
  Phone,
  Shield,
  Calendar,
  User,
} from 'lucide-react';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        let email = session?.user?.email;

        // credentials login support
        if (!email) {
          const storedUser = localStorage.getItem('user');

          if (storedUser) {
            email = JSON.parse(storedUser).email;
          }
        }

        if (!email) {
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `/api/profile?email=${email}`
        );

        setProfile(res.data);
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
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-400 border-t-transparent" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-sm text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Profile not found.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Card */}
      <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-xl">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col items-center gap-5 sm:flex-row">
            {profile.image ? (
              <img
                src={profile.image}
                alt={profile.name}
                className="h-28 w-28 rounded-full border-4 border-white/30 object-cover shadow-lg"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white/30 bg-white/10 text-4xl font-bold shadow-lg">
                {profile.name?.charAt(0) || 'U'}
              </div>
            )}

            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-black">
                {profile.name}
              </h1>

              <p className="mt-1 text-white/90">
                {profile.email}
              </p>

              <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1 text-sm font-medium backdrop-blur">
                <Shield size={16} />
                {profile.role || 'user'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-400/10 text-amber-600 dark:text-amber-300">
            <User size={20} />
          </div>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Personal Information
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <InfoCard
            icon={User}
            label="Full Name"
            value={profile.name}
          />

          <InfoCard
            icon={Mail}
            label="Email Address"
            value={profile.email}
          />

          <InfoCard
            icon={Phone}
            label="Phone Number"
            value={profile.phone || 'Not provided'}
          />

          <InfoCard
            icon={Shield}
            label="Account Role"
            value={profile.role || 'user'}
          />

          <InfoCard
            icon={Calendar}
            label="Joined On"
            value={
              profile.createdAt
                ? new Date(profile.createdAt).toLocaleDateString()
                : 'N/A'
            }
          />

          <InfoCard
            icon={Shield}
            label="Provider"
            value={profile.provider || 'credentials'}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2">
        <button className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-4 text-left shadow-sm transition hover:border-amber-400 hover:shadow-lg">
          <p className="font-semibold text-gray-900 dark:text-white">
            Edit Profile
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Update your personal information
          </p>
        </button>

        <button className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-4 text-left shadow-sm transition hover:border-amber-400 hover:shadow-lg">
          <p className="font-semibold text-gray-900 dark:text-white">
            Change Password
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Keep your account secure
          </p>
        </button>
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-slate-900 text-amber-500 shadow-sm">
          <Icon size={18} />
        </div>

        <div className="min-w-0">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {label}
          </p>

          <p className="truncate font-medium text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}