"use client";
import SellerSidebar from "@/components/Seller/SellerSidebar";
export default function SellerLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex">
      {" "}
      <SellerSidebar />{" "}
      <main className="flex-1 p-4 sm:p-6 lg:p-8"> {children} </main>{" "}
    </div>
  );
}
