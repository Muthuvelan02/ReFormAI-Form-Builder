"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

function SideNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const path = usePathname();

  // Handle screen resizing
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(true);
        setIsMobile(false);
      } else {
        setIsOpen(false);
        setIsMobile(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Show menu icon only when sidebar is collapsed on mobile */}
      {isMobile && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-75 left-4 z-50 p-2 bg-white shadow-lg rounded-md md:hidden"
          aria-label="Open Sidebar"
        >
          <Menu className="h-6 w-6 text-primary" />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-75 left-0 h-full w-[52%] max-w-[280px] bg-white shadow-lg transition-transform duration-300 ease-in-out z-40",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0 md:w-[220px] md:border-r md:shadow-none"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b md:hidden">
          <button onClick={() => setIsOpen(false)} aria-label="Close Sidebar">
            <ArrowLeft className="h-6 w-6 text-gray-700" />
          </button>
        </div>

        {/* Sidebar Links */}
        <nav className="p-5 ">
          {[
            { name: "Dashboard", path: "/dashboard" },
            { name: "Responses", path: "/dashboard/responses" },
          ].map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "block p-3 text-gray-700 rounded-lg mt-3 hover:bg-gray-200 transition",
                path === item.path && "bg-gray-300 font-semibold"
              )}
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Background Overlay (Appears on mobile when sidebar is open) */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

export default SideNav;
