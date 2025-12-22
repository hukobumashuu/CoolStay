"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  CalendarCheck,
  BedDouble,
  UserCog,
  IdCard,
  FileText,
  MessageSquare,
  BarChart3,
  Megaphone,
  ShieldCheck,
  ClipboardList, // Import the new icon
} from "lucide-react";

const menuItems = [
  { name: "Manage Bookings", href: "/admin/dashboard", icon: CalendarCheck },
  { name: "Event Inquiries", href: "/admin/inquiries", icon: ClipboardList },
  { name: "Room Availability", href: "/admin/rooms", icon: BedDouble },
  { name: "Customer Management", href: "/admin/customers", icon: UserCog },
  { name: "Staff Management", href: "/admin/staff", icon: IdCard },
  { name: "Billing & Invoices", href: "/admin/billing", icon: FileText },
  {
    name: "Guest Engagement & Feedback",
    href: "/admin/feedback",
    icon: MessageSquare,
  },
  { name: "Reports & Analytics", href: "/admin/reports", icon: BarChart3 },
  {
    name: "Discounts & Promotions",
    href: "/admin/promotions",
    icon: Megaphone,
  },
  {
    name: "Security & Verification",
    href: "/admin/security",
    icon: ShieldCheck,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-[#9ecbf7] z-40 hidden lg:flex flex-col font-sans">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-center gap-3 bg-[#0A1A44] shadow-md z-50 shrink-0">
        <div className="relative h-8 w-8 rounded-full overflow-hidden border-2 border-white/20">
          <Image
            src="/images/logo/coolstaylogo.jpg"
            alt="CoolStay Logo"
            fill
            className="object-cover"
          />
        </div>
        <h1 className="text-xl font-serif font-bold text-white tracking-wide">
          CoolStay
        </h1>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2 custom-scrollbar border-r border-blue-300/50">
        <div className="px-2 mb-4">
          <h2 className="text-xl font-serif font-bold text-slate-900">
            Dashboard
          </h2>
        </div>

        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-[#3b82f6]/40 border-2 border-[#2563eb] text-black shadow-sm"
                  : "text-slate-900 hover:bg-blue-300/50 border-2 border-transparent"
              }`}
            >
              <item.icon
                className={`w-5 h-5 ${
                  isActive ? "text-black" : "text-slate-800"
                }`}
              />
              <span className="leading-none">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
