"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  LayoutDashboard,
  User,
  ShoppingBag,
  Heart,
  Settings,
  LogOut,
  Package,
  Users,
  BarChart3,
  ClipboardList,
  PlusSquare,
  Sparkles,
  FolderTree,
  Building2,
} from "lucide-react";

const userMenu = [
  { name: "Dashboard", href: "/dashboard/user", icon: LayoutDashboard },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
  { name: "Wishlist", href: "/dashboard/wishlist", icon: Heart },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

const sellerMenu = [
  { name: "Seller Dashboard", href: "/seller", icon: LayoutDashboard },
  { name: "Vendor Profile", href: "/seller/profile", icon: User },
  { name: "Add Furniture", href: "/seller/add-furniture", icon: PlusSquare },
  { name: "My Furniture", href: "/seller/my-furniture", icon: Package },
  { name: "Requested Orders", href: "/seller/orders", icon: ClipboardList },
  { name: "Sales Overview", href: "/seller/sales", icon: BarChart3 },
];

const adminMenu = [
  { name: "Admin Profile", href: "/admin/profile", icon: User },
  { name: "Manage Furniture", href: "/admin/furniture", icon: Package },
  { name: "Manage Categories", href: "/admin/categories", icon: FolderTree },
  { name: "Manage Sellers", href: "/admin/sellers", icon: Building2 },
  { name: "Manage Users", href: "/admin/users", icon: Users },
  { name: "Featured Items", href: "/admin/featured", icon: Sparkles },
];

export default function DashboardSidebar({ open: controlledOpen, setOpen: setControlledOpen }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const [mounted, setMounted] = useState(false);
  const [role, setRole] = useState("user");
  const [localOpen, setLocalOpen] = useState(false);
  const isOpen = controlledOpen ?? localOpen;
  const setOpen = setControlledOpen ?? setLocalOpen;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let active = true;

    const syncRole = async () => {
      let email = session?.user?.email;

      if (!email && typeof window !== "undefined") {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          email = parsed.email;
          if (parsed.role) setRole(parsed.role);
        }
      } else if (session?.user?.role) {
        setRole(session.user.role);
      }

      if (email) {
        try {
          const res = await axios.get(`/api/profile?email=${email}`);
          if (active && res.data?.role) {
            setRole(res.data.role);

            const storedUser = localStorage.getItem("user");
            if (storedUser) {
              const parsed = JSON.parse(storedUser);
              parsed.role = res.data.role;
              localStorage.setItem("user", JSON.stringify(parsed));
            }
          }
        } catch (err) {
          if (active) {
            console.error("Failed to sync role:", err);
          }
        }
      }
    };

    syncRole();

    return () => {
      active = false;
    };
  }, [session]);

  if (!mounted) {
    return (
      <aside className="hidden w-72 border-r border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900 md:sticky md:top-0 md:block md:h-screen">
        <div className="h-8 w-32 rounded bg-gray-200 dark:bg-white/10 animate-pulse mb-8" />
      </aside>
    );
  }

  let menu = userMenu;

  if (role === "seller") {
    menu = sellerMenu;
  } else if (role === "admin") {
    menu = adminMenu;
  }

  return (
    <>
      {isOpen && <button aria-label="Close menu" onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-slate-950/40 md:hidden" />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[86vw] flex-col justify-between overflow-y-auto border-r border-gray-200 bg-white p-5 shadow-2xl transition-transform duration-300 dark:border-white/10 dark:bg-slate-900 md:sticky md:top-0 md:h-screen md:w-72 md:max-w-none md:translate-x-0 md:shadow-none ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
      <div>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center font-bold shadow-md">
            F
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white">
              {role === "admin"
                ? "Admin Panel"
                : role === "seller"
                  ? "Seller Panel"
                  : "User Panel"}
            </h2>
            <span className="text-xs uppercase font-semibold text-amber-500 tracking-wider">
              {role}
            </span>
          </div>
        </div>

        <nav className="space-y-2">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5"
                }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <button
        onClick={() => {
          localStorage.removeItem("user");
          signOut({ callbackUrl: "/" });
        }}
        className="mt-8 flex w-full items-center gap-3 rounded-2xl border border-red-200 dark:border-red-500/20 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
      >
        <LogOut size={18} />
        Logout
      </button>
      </aside>
    </>
  );
}
