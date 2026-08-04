"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  User,
  PlusSquare,
  Package,
  ShoppingCart,
  BarChart3,
  LogOut,
} from "lucide-react";

const links = [
  { name: "Overview", href: "/seller", icon: LayoutDashboard },
  { name: "Vendor Profile", href: "/seller/profile", icon: User },
  { name: "Add Furniture", href: "/seller/add-furniture", icon: PlusSquare },
  { name: "My Furniture", href: "/seller/my-furniture", icon: Package },
  { name: "Requested Orders", href: "/seller/orders", icon: ShoppingCart },
  { name: "Sales Overview", href: "/seller/sales", icon: BarChart3 },
];

export default function SellerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-72 flex-col justify-between border-r border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-5 min-h-screen">
      <div>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center font-bold shadow-md">
            F
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white">
              Seller Panel
            </h2>
            <span className="text-xs uppercase font-semibold text-amber-500 tracking-wider">
              Vendor Mode
            </span>
          </div>
        </div>

        <nav className="space-y-2">
          {links.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-linear-to-r from-amber-400 to-orange-500 text-white shadow-md"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5"
                }`}
              >
                <Icon size={18} /> {item.name}
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
  );
}
