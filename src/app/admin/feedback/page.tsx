"use client";

import React, { useState } from "react";
import { MessageSquare, Star, User, Search, Reply } from "lucide-react";

// --- Types based on your DB Schema (joined views) ---
type Feedback = {
  id: string;
  guestName: string; // From public.users
  targetName: string; // From public.Rooms (name) or public.Cottages (name)
  rating: number; // From public.reviews (1-5)
  comment: string; // From public.reviews
  date: string; // From public.reviews (created_at)
  status: "Unread" | "Replied" | "Pending"; // Mock status for UI flow
};

// --- Mock Data ---
const feedbackData: Feedback[] = [
  {
    id: "REV-101",
    guestName: "Maria Clara",
    targetName: "Deluxe Ocean View",
    rating: 5,
    comment:
      "The view was absolutely breathtaking! The staff was very accommodating. Will definitely recommend this to my friends.",
    date: "Oct 24, 2025",
    status: "Unread",
  },
  {
    id: "REV-102",
    guestName: "Juan Dela Cruz",
    targetName: "Family Cottage A",
    rating: 4,
    comment:
      "Great stay, but the WiFi signal in the cottage was a bit weak. Otherwise, the pool was fantastic.",
    date: "Oct 23, 2025",
    status: "Replied",
  },
  {
    id: "REV-103",
    guestName: "Antonio Luna",
    targetName: "Standard Room 204",
    rating: 2,
    comment:
      "The air conditioning was noisy and it took a while to cool the room down. Needs maintenance.",
    date: "Oct 22, 2025",
    status: "Pending",
  },
  {
    id: "REV-104",
    guestName: "Gabriela Silang",
    targetName: "Barkada Room",
    rating: 5,
    comment: "Perfect for our team building! Spacious and clean.",
    date: "Oct 20, 2025",
    status: "Unread",
  },
];

// Helper to render stars
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
          }`}
        />
      ))}
    </div>
  );
};

export default function GuestEngagementPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#cde4fa] p-8 -m-6 font-sans">
      {/* --- Header & Stats --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-serif font-bold text-black mb-2">
            Guest Feedback
          </h1>
          <p className="text-slate-600 font-medium">
            Manage reviews and engage with your guests.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="flex gap-4">
          <div className="bg-[#0f2452] text-white px-6 py-4 rounded-xl flex flex-col items-center shadow-lg min-w-[140px]">
            <span className="text-3xl font-bold font-serif">4.5</span>
            <span className="text-xs opacity-80 uppercase tracking-widest mt-1">
              Avg Rating
            </span>
          </div>
          <div className="bg-[#a3cbf5] text-[#0f2452] px-6 py-4 rounded-xl flex flex-col items-center shadow-md min-w-[140px]">
            <span className="text-3xl font-bold font-serif">128</span>
            <span className="text-xs font-bold uppercase tracking-widest mt-1">
              Total Reviews
            </span>
          </div>
        </div>
      </div>

      {/* --- Toolbar --- */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search reviews or guest names..."
            className="w-full pl-12 pr-4 py-3 rounded-full border-none shadow-sm bg-white/80 focus:ring-2 focus:ring-[#0f2452] outline-none"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-white/50 rounded-full p-1 shadow-sm">
          {["All", "Unread", "Replied", "Low Rating"].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                activeFilter === filter
                  ? "bg-[#0f2452] text-white shadow-md"
                  : "text-slate-600 hover:bg-white/80"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* --- Feedback List --- */}
      <div className="w-full max-w-6xl space-y-6">
        {feedbackData.map((item) => (
          <div
            key={item.id}
            className="bg-[#e8f4fd] rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow border border-blue-100"
          >
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left: User Info */}
              <div className="flex flex-col items-center md:items-start md:w-48 shrink-0 gap-2 text-center md:text-left border-b md:border-b-0 md:border-r border-blue-200 pb-4 md:pb-0 md:pr-4">
                <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center text-[#0f2452]">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-black leading-tight">
                    {item.guestName}
                  </h3>
                  <span className="text-xs font-semibold text-slate-500">
                    {item.date}
                  </span>
                </div>
                <div
                  className={`mt-2 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                    item.status === "Unread"
                      ? "bg-red-100 text-red-600"
                      : item.status === "Replied"
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {item.status}
                </div>
              </div>

              {/* Middle: Content */}
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#0f2452] text-white text-xs px-2 py-1 rounded-md font-bold">
                      {item.targetName}
                    </span>
                    <StarRating rating={item.rating} />
                  </div>
                </div>

                <div className="bg-white/60 p-4 rounded-2xl relative">
                  <MessageSquare className="absolute top-4 left-3 w-4 h-4 text-blue-300" />
                  <p className="pl-6 text-slate-800 font-medium italic">
                    &quot;{item.comment}&quot;
                  </p>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex flex-row md:flex-col justify-end md:justify-center gap-2 border-t md:border-t-0 md:border-l border-blue-200 pt-4 md:pt-0 md:pl-4">
                <button className="bg-[#0f2452] hover:bg-[#1a3a75] text-white px-6 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors shadow-sm w-full justify-center">
                  <Reply className="w-4 h-4" />
                  REPLY
                </button>
                <button className="bg-white hover:bg-gray-50 text-[#0f2452] border-2 border-[#0f2452]/10 px-6 py-2 rounded-xl font-bold text-sm transition-colors w-full">
                  HIDE
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        <div className="py-10 text-center">
          <p className="text-slate-500 font-medium">End of feedback list</p>
        </div>
      </div>
    </div>
  );
}
