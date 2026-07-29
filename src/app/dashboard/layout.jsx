"use client";
import { useState } from "react";
import DashboardSidebar from "@/components/Dashboard/DashboardSidebar";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
export default function DashboardLayout({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      {" "}
      <div className="flex">
        {" "}
        <DashboardSidebar open={open} setOpen={setOpen} />{" "}
        <div className="flex min-w-0 flex-1 flex-col">
          {" "}
          <DashboardHeader setOpen={setOpen} />{" "}
          <main className="flex-1 p-4 sm:p-6 lg:p-8"> {children} </main>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
