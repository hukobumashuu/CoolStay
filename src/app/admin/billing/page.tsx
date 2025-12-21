"use client";

import React, { useEffect, useState } from "react";
import { FileText, CheckCircle2, Clock } from "lucide-react";

type Invoice = {
  id: string;
  guest: string;
  amount: string;
  status: string;
  date: string;
};

export default function BillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await fetch("/api/admin/billing");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setInvoices(data);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#cde4fa] p-8 -m-6 font-sans">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-serif font-bold text-black">
          Billing & Invoices
        </h1>
      </div>

      <div className="w-full max-w-6xl space-y-4">
        {/* Header Row */}
        <div className="hidden md:flex px-8 text-sm font-bold text-slate-600 uppercase tracking-wider">
          <div className="w-1/5">Invoice ID</div>
          <div className="w-1/4">Guest Name</div>
          <div className="w-1/5">Date</div>
          <div className="w-1/5">Amount</div>
          <div className="w-1/5 text-right">Status</div>
        </div>

        {isLoading ? (
          <div className="text-slate-500 font-medium animate-pulse">
            Loading invoices...
          </div>
        ) : (
          invoices.map((inv) => (
            <div
              key={inv.id}
              className="flex flex-col md:flex-row items-center justify-between bg-[#a3cbf5] rounded-full px-8 py-5 shadow-sm w-full gap-4 md:gap-0 hover:bg-[#90bceb] transition-colors group"
            >
              <div className="flex flex-col md:flex-row md:items-center w-full text-black font-semibold text-lg gap-2 md:gap-0">
                <div className="md:w-1/5 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#0f2452]" />
                  <span className="text-sm truncate w-24" title={inv.id}>
                    {inv.id.substring(0, 8)}...
                  </span>
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
          ))
        )}
      </div>
    </div>
  );
}
