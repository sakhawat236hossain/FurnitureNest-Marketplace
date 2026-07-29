"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  PlusSquare,
  Package,
  ShoppingCart,
  BarChart3,
} from "lucide-react";
const links = [
  { name: "Vendor Profile", href: "/seller/profile", icon: User },
  { name: "Add Furniture", href: "/seller/add-furniture", icon: PlusSquare },
  { name: "My Added Furniture", href: "/seller/my-furniture", icon: Package },
  { name: "Requested Orders", href: "/seller/orders", icon: ShoppingCart },
  { name: "Sales Overview", href: "/seller/sales", icon: BarChart3 },
];
export default function SellerSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex w-72 flex-col border-r border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-5">
      {" "}
      <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8">
        {" "}
        Seller Panel{" "}
      </h2>{" "}
      <nav className="space-y-2">
        {" "}
        {links.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${active ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white" : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5"}`}
            >
              {" "}
              <Icon size={18} /> {item.name}{" "}
            </Link>
          );
        })}{" "}
      </nav>{" "}
    </aside>
  );
}
