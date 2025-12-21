"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const menuItems = [
  { name: "Manage Bookings", href: "/admin/dashboard", icon: "📅" },
  { name: "Room Availability", href: "/admin/rooms", icon: "🏨" },
  { name: "Customer Management", href: "/admin/customers", icon: "👥" },
  { name: "Staff Management", href: "/admin/staff", icon: "👔" },
  { name: "Billing & Invoices", href: "/admin/billing", icon: "💳" },
  { name: "Guest Feedback", href: "/admin/feedback", icon: "⭐" },
  { name: "Reports & Analytics", href: "/admin/reports", icon: "📊" },
  { name: "Security & Verification", href: "/admin/security", icon: "🛡️" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-[#E8F4F8] border-r border-blue-100 z-40 hidden lg:flex flex-col">
      {/* Brand Header */}
      <div className="h-20 flex items-center gap-3 px-6 border-b border-blue-100 bg-white/50">
        <div className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-[#0A1A44]">
          <Image
            src="/images/logo/coolstaylogo.jpg"
            alt="Logo"
            fill
            className="object-cover"
          />
        </div>
        <span className="text-xl font-serif font-bold text-[#0A1A44]">
          CoolStay
        </span>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-[#0A1A44] text-white shadow-md"
                  : "text-gray-600 hover:bg-blue-100 hover:text-[#0A1A44]"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-6 border-t border-blue-100 text-xs text-gray-400 text-center">
        <p>&copy; 2025 CoolStay Admin</p>
        <p>v1.0.0</p>
      </div>
    </aside>
  );
}
