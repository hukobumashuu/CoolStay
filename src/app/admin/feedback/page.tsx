"use client";

import React, { useEffect, useState } from "react";
import { MessageSquare, Star, User, Search, Reply, Inbox } from "lucide-react";

type Feedback = {
  id: string;
  guestName: string;
  targetName: string;
  rating: number;
  comment: string;
  date: string;
  status: string;
};

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
  const [feedbackData, setFeedbackData] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await fetch("/api/admin/feedback");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setFeedbackData(data);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeedback();
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#cde4fa] p-8 -m-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-serif font-bold text-black mb-2">
            Guest Feedback
          </h1>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search reviews..."
            className="w-full pl-12 pr-4 py-3 rounded-full border-none shadow-sm bg-white/80 focus:ring-2 focus:ring-[#0f2452] outline-none"
          />
        </div>
      </div>

      <div className="w-full max-w-6xl space-y-6">
        {isLoading ? (
          <div className="text-slate-500 font-medium animate-pulse">
            Loading reviews...
          </div>
        ) : feedbackData.length === 0 ? (
          /* --- NEW: Empty State --- */
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
            <div className="bg-white p-6 rounded-full mb-4 shadow-sm">
              <Inbox className="w-12 h-12 text-[#0f2452]" />
            </div>
            <h3 className="text-xl font-bold text-[#0f2452]">
              No Feedback Yet
            </h3>
            <p className="text-slate-600">
              When guests leave reviews, they will appear here.
            </p>
          </div>
        ) : (
          feedbackData.map((item) => (
            <div
              key={item.id}
              className="bg-[#e8f4fd] rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow border border-blue-100"
            >
              <div className="flex flex-col md:flex-row gap-6">
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
                </div>

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

                <div className="flex flex-row md:flex-col justify-end md:justify-center gap-2 border-t md:border-t-0 md:border-l border-blue-200 pt-4 md:pt-0 md:pl-4">
                  <button className="bg-[#0f2452] hover:bg-[#1a3a75] text-white px-6 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors shadow-sm w-full justify-center">
                    <Reply className="w-4 h-4" />
                    REPLY
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
