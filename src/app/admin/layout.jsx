"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import DashboardSidebar from "@/components/Dashboard/DashboardSidebar";

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    let role = session?.user?.role;

    // localStorage fallback
    if (!role) {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        role = JSON.parse(storedUser).role;
      }
    }

    if (role === "admin") {
      setChecking(false);
    } else {
      router.push("/login");
    }
  }, [session, status, router]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <div className="flex min-h-screen">
        <DashboardSidebar open={menuOpen} setOpen={setMenuOpen} />
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <button onClick={() => setMenuOpen(true)} className="mb-4 rounded-xl border border-gray-200 p-2 text-gray-700 dark:border-white/10 dark:text-white md:hidden" aria-label="Open menu">
            <Menu size={21} />
          </button>
          {children}
        </main>
      </div>
    </div>
  );
}
