"use client";

import React, { useState } from "react";
import {
  Ticket,
  Percent,
  Calendar,
  Plus,
  Copy,
  MoreVertical,
  Tag,
  ShoppingBag,
  Timer,
} from "lucide-react";

// --- Types ---
type Promotion = {
  id: string;
  code: string;
  name: string;
  discountValue: string; // e.g., "20%" or "₱500"
  type: "Percentage" | "Fixed";
  validUntil: string;
  usageCount: number;
  status: "Active" | "Scheduled" | "Expired";
  color: string;
};

// --- Mock Data ---
const activePromos: Promotion[] = [
  {
    id: "P-001",
    code: "SUMMER2025",
    name: "Summer Splash Sale",
    discountValue: "20%",
    type: "Percentage",
    validUntil: "May 30, 2025",
    usageCount: 45,
    status: "Active",
    color: "bg-blue-500",
  },
  {
    id: "P-002",
    code: "WELCOME500",
    name: "New Guest Welcome",
    discountValue: "₱ 500",
    type: "Fixed",
    validUntil: "Dec 31, 2025",
    usageCount: 12,
    status: "Active",
    color: "bg-[#0A1A44]",
  },
  {
    id: "P-003",
    code: "RAINYDAY",
    name: "Monsoon Special",
    discountValue: "15%",
    type: "Percentage",
    validUntil: "Nov 15, 2025",
    usageCount: 0,
    status: "Scheduled",
    color: "bg-teal-600",
  },
];

const expiredPromos: Promotion[] = [
  {
    id: "P-004",
    code: "FLASH10",
    name: "Flash Sale Oct",
    discountValue: "10%",
    type: "Percentage",
    validUntil: "Oct 10, 2025",
    usageCount: 150,
    status: "Expired",
    color: "bg-gray-400",
  },
];

// --- Components ---

// 1. The Ticket Card Component
const PromoTicket = ({ promo }: { promo: Promotion }) => (
  <div className="group relative flex bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-40 border border-blue-100">
    {/* Left Side: Visual & Value */}
    <div
      className={`${promo.color} w-32 flex flex-col items-center justify-center text-white p-4 relative`}
    >
      {/* Decorative Circles for Perforation Effect */}
      <div className="absolute -right-3 top-0 w-6 h-6 bg-[#cde4fa] rounded-full"></div>
      <div className="absolute -right-3 bottom-0 w-6 h-6 bg-[#cde4fa] rounded-full"></div>

      <span className="text-3xl font-serif font-bold">
        {promo.discountValue}
      </span>
      <span className="text-xs uppercase tracking-widest opacity-80 mt-1">
        OFF
      </span>
    </div>

    {/* Dashed Divider */}
    <div className="w-0 border-l-2 border-dashed border-gray-200 relative my-3"></div>

    {/* Right Side: Details */}
    <div className="flex-1 p-5 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start">
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider
                ${
                  promo.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
          >
            {promo.status}
          </span>
          <button className="text-gray-400 hover:text-[#0A1A44]">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
        <h3 className="font-bold text-[#0A1A44] text-lg mt-2">{promo.name}</h3>
        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
          <Calendar className="w-3 h-3" /> Valid until: {promo.validUntil}
        </p>
      </div>

      <div className="flex items-center justify-between bg-slate-50 rounded-lg p-2 border border-slate-100">
        <div className="flex items-center gap-2">
          <Ticket className="w-4 h-4 text-slate-400" />
          <span className="font-mono font-bold text-slate-700 tracking-wider">
            {promo.code}
          </span>
        </div>
        <button
          className="text-blue-500 hover:text-blue-700 transition-colors"
          title="Copy Code"
        >
          <Copy className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
);

export default function PromotionsPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#cde4fa] p-8 -m-6 font-sans">
      {/* --- Header --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-serif font-bold text-black">
            Promotions & Deals
          </h1>
          <p className="text-slate-600 font-medium mt-1">
            Manage coupons, discounts, and special offers.
          </p>
        </div>

        <button className="bg-[#0A1A44] hover:bg-[#1a3a75] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
          <Plus className="w-5 h-5" />
          Create New Promo
        </button>
      </div>

      {/* --- Quick Stats --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white/60 backdrop-blur-sm p-6 rounded-3xl border border-white/50 flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-full text-blue-600">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase">
              Active Coupons
            </p>
            <p className="text-2xl font-bold text-[#0A1A44]">3 Active</p>
          </div>
        </div>
        <div className="bg-white/60 backdrop-blur-sm p-6 rounded-3xl border border-white/50 flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-full text-green-600">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase">
              Total Redemptions
            </p>
            <p className="text-2xl font-bold text-[#0A1A44]">57 Used</p>
          </div>
        </div>
        <div className="bg-white/60 backdrop-blur-sm p-6 rounded-3xl border border-white/50 flex items-center gap-4">
          <div className="bg-purple-100 p-3 rounded-full text-purple-600">
            <Timer className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase">
              Expiring Soon
            </p>
            <p className="text-2xl font-bold text-[#0A1A44]">1 Promo</p>
          </div>
        </div>
      </div>

      {/* --- Active Promotions Grid --- */}
      <h2 className="text-xl font-bold text-[#0A1A44] mb-6 flex items-center gap-2">
        <Percent className="w-5 h-5" /> Active Campaigns
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
        {activePromos.map((promo) => (
          <PromoTicket key={promo.id} promo={promo} />
        ))}

        {/* "Add New" Placeholder Card */}
        <div className="border-2 border-dashed border-blue-300 rounded-xl h-40 flex flex-col items-center justify-center text-blue-400 cursor-pointer hover:bg-blue-50 transition-colors bg-white/30">
          <Plus className="w-8 h-8 mb-2" />
          <span className="font-bold text-sm">Add New Campaign</span>
        </div>
      </div>

      {/* --- Expired / Past Table --- */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-blue-100">
        <h3 className="text-lg font-bold text-slate-700 mb-4">
          Past Promotions
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs font-bold text-slate-400 uppercase border-b border-slate-100">
                <th className="pb-3 pl-2">Promo Name</th>
                <th className="pb-3">Code</th>
                <th className="pb-3">Discount</th>
                <th className="pb-3">Usage</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {expiredPromos.map((promo) => (
                <tr
                  key={promo.id}
                  className="border-b border-slate-50 last:border-0 hover:bg-slate-50"
                >
                  <td className="py-4 pl-2 font-medium text-slate-800">
                    {promo.name}
                  </td>
                  <td className="py-4 font-mono text-slate-500">
                    {promo.code}
                  </td>
                  <td className="py-4 text-slate-800">{promo.discountValue}</td>
                  <td className="py-4 text-slate-600">
                    {promo.usageCount} times
                  </td>
                  <td className="py-4">
                    <span className="text-xs font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded-md">
                      {promo.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
