"use client";

import React from "react";
import { FileText, CheckCircle2, Clock } from "lucide-react";

// Mock Data for Invoices
const invoices = [
  {
    id: "INV-001",
    guest: "Juan Dela Cruz",
    amount: "₱ 5,400.00",
    status: "Paid",
    date: "Oct 24, 2025",
  },
  {
    id: "INV-002",
    guest: "Maria Clara",
    amount: "₱ 3,200.00",
    status: "Pending",
    date: "Oct 25, 2025",
  },
  {
    id: "INV-003",
    guest: "Antonio Luna",
    amount: "₱ 12,500.00",
    status: "Paid",
    date: "Oct 26, 2025",
  },
  {
    id: "INV-004",
    guest: "Jose Rizal",
    amount: "₱ 4,100.00",
    status: "Pending",
    date: "Oct 27, 2025",
  },
];

export default function BillingPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#cde4fa] p-8 -m-6 font-sans">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-serif font-bold text-black">
          Billing & Invoices
        </h1>

        {/* Simple Stat Cards */}
        <div className="hidden md:flex gap-4">
          <div className="bg-[#0f2452] text-white px-6 py-3 rounded-xl flex flex-col items-center shadow-lg">
            <span className="text-xs opacity-80 uppercase tracking-widest">
              Total Revenue
            </span>
            <span className="font-bold text-xl">₱ 25,200.00</span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-6xl space-y-4">
        {/* Header Row (Optional, helpful for data density) */}
        <div className="hidden md:flex px-8 text-sm font-bold text-slate-600 uppercase tracking-wider">
          <div className="w-1/5">Invoice ID</div>
          <div className="w-1/4">Guest Name</div>
          <div className="w-1/5">Date</div>
          <div className="w-1/5">Amount</div>
          <div className="w-1/5 text-right">Status</div>
        </div>

        {invoices.map((inv) => (
          <div
            key={inv.id}
            className="flex flex-col md:flex-row items-center justify-between bg-[#a3cbf5] rounded-full px-8 py-5 shadow-sm w-full gap-4 md:gap-0 hover:bg-[#90bceb] transition-colors group"
          >
            {/* Left Data Info */}
            <div className="flex flex-col md:flex-row md:items-center w-full text-black font-semibold text-lg gap-2 md:gap-0">
              <div className="md:w-1/5 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#0f2452]" />
                <span>{inv.id}</span>
              </div>

              <div className="md:w-1/4">
                <span className="md:hidden text-sm opacity-60 mr-2">
                  Guest:
                </span>
                {inv.guest}
              </div>

              <div className="md:w-1/5 text-sm opacity-80 md:opacity-100">
                {inv.date}
              </div>

              <div className="md:w-1/5 font-bold text-[#0f2452]">
                {inv.amount}
              </div>
            </div>

            {/* Right Action / Status */}
            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
              <div
                className={`px-4 py-1 rounded-full text-sm font-bold flex items-center gap-2
                    ${
                      inv.status === "Paid"
                        ? "bg-green-200 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
              >
                {inv.status === "Paid" ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Clock className="w-4 h-4" />
                )}
                {inv.status}
              </div>

              <button className="bg-[#0f2452] hover:bg-[#1a3a75] text-white px-6 py-2 rounded-lg font-bold text-sm tracking-wide transition-colors shadow-md whitespace-nowrap">
                VIEW
              </button>
            </div>
          </div>
        ))}

        {/* Empty State / Loader Placeholder */}
        <div className="h-20 bg-[#a3cbf5] rounded-full w-full opacity-40 border-2 border-dashed border-slate-400/30 flex items-center justify-center text-slate-500 font-medium">
          No more invoices to load
        </div>
      </div>
    </div>
  );
}
