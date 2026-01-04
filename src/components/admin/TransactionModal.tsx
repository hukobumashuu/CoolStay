"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Search } from "lucide-react"; // Removed DollarSign
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";

// Types
interface BookingOption {
  id: string;
  guest_name: string;
  total_amount: number;
  balance: number;
}

// Helper Type for Supabase Result
interface BookingSearchResult {
  id: string;
  total_amount: number;
  users: {
    full_name: string | null;
  } | null;
}

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  prefill?: {
    bookingId: string;
    guestName: string;
    amount: number;
  } | null;
}

export default function TransactionModal({
  isOpen,
  onClose,
  onSuccess,
  prefill,
}: TransactionModalProps) {
  const [loading, setLoading] = useState(false);

  // Form State
  const [amount, setAmount] = useState<number | string>("");
  const [method, setMethod] = useState("cash");
  const [type, setType] = useState("payment");
  const [notes, setNotes] = useState("");

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [bookings, setBookings] = useState<BookingOption[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<BookingOption | null>(
    null
  );

  // 1. Handle Prefill Logic
  useEffect(() => {
    if (isOpen) {
      setNotes("");
      setMethod("cash");
      setType("payment");

      if (prefill) {
        setSelectedBooking({
          id: prefill.bookingId,
          guest_name: prefill.guestName,
          total_amount: 0,
          balance: prefill.amount,
        });
        setAmount(prefill.amount);
      } else {
        setSelectedBooking(null);
        setAmount("");
        setSearchQuery("");
        setBookings([]);
      }
    }
  }, [isOpen, prefill]);

  // 2. Search Logic
  useEffect(() => {
    if (!prefill && searchQuery.length > 2) {
      const search = async () => {
        const supabase = createClient();
        const { data } = await supabase
          .from("bookings")
          .select(`id, total_amount, users(full_name)`)
          .ilike("users.full_name", `%${searchQuery}%`)
          .limit(5);

        if (data) {
          // Fixed: Typed 'b' explicitly
          const formatted = (data as unknown as BookingSearchResult[]).map(
            (b) => ({
              id: b.id,
              guest_name: b.users?.full_name || "Unknown",
              total_amount: b.total_amount,
              balance: 0, // In a real app, calculate balance here too
            })
          );
          setBookings(formatted);
        }
      };
      const timer = setTimeout(search, 500);
      return () => clearTimeout(timer);
    }
  }, [searchQuery, prefill]);

  const handleSubmit = async () => {
    if (!selectedBooking || !amount) return;
    setLoading(true);

    try {
      const res = await fetch("/api/admin/billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking_id: selectedBooking.id,
          amount: Number(amount),
          method,
          type,
          notes:
            notes ||
            (type === "payment" ? "Manual payment recorded" : "Refund issued"),
        }),
      });

      if (!res.ok) throw new Error("Failed to record transaction");

      toast.success("Transaction recorded!");
      onSuccess();
      onClose();
    } catch {
      // Fixed: Removed unused 'error' variable
      toast.error("Error recording transaction");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#0A1A44] p-4 text-white flex justify-between items-center">
          <h2 className="font-bold">Record Transaction</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* 1. Guest Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Guest / Booking
            </label>
            {prefill ? (
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-blue-900 font-bold flex justify-between items-center">
                <span>{prefill.guestName}</span>
                <span className="text-xs bg-blue-200 px-2 py-1 rounded">
                  LOCKED
                </span>
              </div>
            ) : (
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search guest name..."
                  className="w-full pl-9 p-2 border rounded-lg text-sm"
                  value={selectedBooking?.guest_name || searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedBooking(null);
                  }}
                />
                {!selectedBooking && bookings.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white shadow-xl border rounded-lg mt-1 z-10 max-h-40 overflow-y-auto">
                    {bookings.map((b) => (
                      <div
                        key={b.id}
                        className="p-3 hover:bg-slate-50 cursor-pointer text-sm"
                        onClick={() => {
                          setSelectedBooking(b);
                          setBookings([]);
                        }}
                      >
                        <p className="font-bold">{b.guest_name}</p>
                        <p className="text-xs text-slate-400">
                          ID: {b.id.substring(0, 8)}...
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 2. Amount Input */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                ₱
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 p-3 bg-slate-50 border border-slate-200 rounded-lg font-bold text-lg outline-none focus:ring-2 ring-[#0A1A44]"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* 3. Type & Method */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Type
              </label>
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button
                  onClick={() => setType("payment")}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                    type === "payment"
                      ? "bg-green-500 text-white shadow-sm"
                      : "text-slate-500"
                  }`}
                >
                  Payment
                </button>
                <button
                  onClick={() => setType("refund")}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                    type === "refund"
                      ? "bg-red-500 text-white shadow-sm"
                      : "text-slate-500"
                  }`}
                >
                  Refund
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Method
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full p-2 border rounded-lg text-sm font-bold bg-white"
              >
                <option value="cash">Cash</option>
                <option value="gcash">GCash</option>
                <option value="card">Card</option>
              </select>
            </div>
          </div>

          {/* 4. Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 border rounded-lg text-sm"
              placeholder="e.g. Balance payment upon arrival"
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading || !selectedBooking || !amount}
            className="w-full bg-[#0A1A44] hover:bg-blue-900 py-6 text-base"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              `Confirm ${type === "payment" ? "Payment" : "Refund"}`
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
