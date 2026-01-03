"use client";

import { useState } from "react";
import {
  X,
  Loader2,
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  Banknote,
} from "lucide-react";
import { toast } from "sonner";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  bookingId?: string; // Optional: Pre-select booking if opened from a specific row
}

export default function TransactionModal({
  isOpen,
  onClose,
  onSuccess,
  bookingId,
}: TransactionModalProps) {
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<"payment" | "refund">("payment");
  const [method, setMethod] = useState("cash");
  const [amount, setAmount] = useState("");
  const [targetBookingId, setTargetBookingId] = useState(bookingId || "");
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking_id: targetBookingId, // In a real app, this would be a dropdown of active bookings
          amount: Number(amount),
          method,
          type,
          notes,
        }),
      });

      if (!res.ok) throw new Error("Transaction failed");

      toast.success(type === "payment" ? "Payment Recorded" : "Refund Issued");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to record transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div
          className={`p-6 text-white flex justify-between items-center ${
            type === "payment" ? "bg-[#0A1A44]" : "bg-red-600"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl">
              {type === "payment" ? (
                <ArrowDownLeft className="w-6 h-6" />
              ) : (
                <ArrowUpRight className="w-6 h-6" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif">
                {type === "payment" ? "Record Payment" : "Issue Refund"}
              </h2>
              <p className="text-xs opacity-80">
                {type === "payment"
                  ? "Receive money from guest"
                  : "Return money to guest"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Toggle Type */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setType("payment")}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                type === "payment"
                  ? "bg-white shadow-sm text-[#0A1A44]"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Payment
            </button>
            <button
              type="button"
              onClick={() => setType("refund")}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                type === "refund"
                  ? "bg-white shadow-sm text-red-600"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Refund
            </button>
          </div>

          {/* Booking ID (Simplified for now - strictly should be a search/dropdown) */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Booking Reference
            </label>
            <input
              required
              type="text"
              placeholder="e.g. Booking ID"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0A1A44] outline-none"
              value={targetBookingId}
              onChange={(e) => setTargetBookingId(e.target.value)}
            />
          </div>

          {/* Amount & Method Row */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Amount (₱)
              </label>
              <input
                required
                type="number"
                min="1"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0A1A44] outline-none font-mono font-bold text-lg"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="w-1/3">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Method
              </label>
              <select
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
              >
                <option value="cash">Cash</option>
                <option value="gcash">GCash</option>
                <option value="card">Card</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Notes / Reason
            </label>
            <textarea
              rows={2}
              placeholder={
                type === "refund" ? "Reason for refund..." : "Optional notes..."
              }
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0A1A44] outline-none text-sm"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !amount || !targetBookingId}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2
              ${
                type === "payment"
                  ? "bg-[#0A1A44] hover:bg-blue-900"
                  : "bg-red-600 hover:bg-red-700"
              }`}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {type === "payment" ? (
                  <Banknote className="w-5 h-5" />
                ) : (
                  <CreditCard className="w-5 h-5" />
                )}
                {type === "payment" ? "Confirm Payment" : "Issue Refund"}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
