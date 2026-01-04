"use client";

import { useState, useRef, useEffect } from "react";
import {
  X,
  Upload,
  Loader2,
  QrCode,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface UserPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: {
    id: string;
    total_amount: number;
  };
  onSuccess: () => void;
}

export default function UserPaymentModal({
  isOpen,
  onClose,
  booking,
  onSuccess,
}: UserPaymentModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  // Default to 50% downpayment as it's the most common action
  const [amountToPay, setAmountToPay] = useState<number>(
    booking.total_amount / 2
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Reset to 50% when opening
      setAmountToPay(booking.total_amount / 2);
      setFile(null);
    }
  }, [isOpen, booking.total_amount]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Please attach your proof of payment.");
      return;
    }

    if (amountToPay <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Uploading receipt...");

    try {
      const supabase = createClient();

      // 1. Upload Image
      const fileExt = file.name.split(".").pop();
      const fileName = `${booking.id}_${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("payment-proofs")
        .upload(fileName, file);

      if (uploadError) throw new Error("Upload failed: " + uploadError.message);

      // 2. Get Public URL
      const { data: urlData } = supabase.storage
        .from("payment-proofs")
        .getPublicUrl(fileName);

      // 3. Record Transaction
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking_id: booking.id,
          amount: amountToPay, // Send the user's input amount
          method: "gcash",
          proof_url: urlData.publicUrl,
        }),
      });

      if (!res.ok) throw new Error("Failed to record payment");

      toast.dismiss(toastId);
      toast.success("Payment submitted for review!");
      onSuccess();
      onClose();
    } catch (error: unknown) {
      toast.dismiss(toastId);
      let msg = "An error occurred";
      if (error instanceof Error) msg = error.message;
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="bg-[#0057E7] p-5 md:p-6 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm">
              <QrCode className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold font-serif tracking-tight">
                Secure Payment
              </h2>
              <p className="text-blue-100 text-xs md:text-sm font-medium">
                Confirm your booking via GCash
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-0 overflow-y-auto custom-scrollbar">
          <div className="flex flex-col md:grid md:grid-cols-2 h-full divide-y md:divide-y-0 md:divide-x divide-slate-100">
            {/* LEFT: QR Code */}
            <div className="p-6 md:p-8 flex flex-col items-center justify-center bg-slate-50/50">
              <div className="mb-6 flex flex-col items-center">
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                  Step 1
                </span>
                <h3 className="text-lg font-bold text-slate-800">
                  Scan to Pay
                </h3>
                <p className="text-slate-500 text-sm text-center max-w-[250px]">
                  Open your GCash app and scan the code.
                </p>
              </div>

              <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200 mb-6">
                <div className="relative w-64 h-64 md:w-72 md:h-72 bg-[#0057E7]/5 rounded-2xl flex items-center justify-center overflow-hidden">
                  {/* Replace with your image */}
                  <div className="text-center p-4">
                    <QrCode className="w-24 h-24 text-[#0057E7]/20 mx-auto mb-2" />
                    <span className="text-xs text-slate-400 font-medium">
                      Official GCash QR
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Info className="w-4 h-4" />
                <span>
                  Ensure the Recipient Name matches <b>CoolStay Resort</b>
                </span>
              </div>
            </div>

            {/* RIGHT: Input & Upload */}
            <div className="p-6 md:p-8 flex flex-col justify-center bg-white">
              {/* AMOUNT INPUT SECTION */}
              <div className="mb-6">
                <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">
                  Step 2
                </span>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  How much are you paying today?
                </label>

                <div className="relative mb-3">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-400">
                    ₱
                  </span>
                  <input
                    type="number"
                    value={amountToPay}
                    onChange={(e) => setAmountToPay(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-2xl font-bold text-[#0A1A44] outline-none focus:border-[#0057E7] focus:bg-white transition-all"
                  />
                </div>

                {/* Preset Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setAmountToPay(booking.total_amount / 2)}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${
                      amountToPay === booking.total_amount / 2
                        ? "bg-blue-50 border-blue-200 text-blue-700"
                        : "border-slate-100 text-slate-500 hover:border-slate-300"
                    }`}
                  >
                    Pay 50% Downpayment
                  </button>
                  <button
                    onClick={() => setAmountToPay(booking.total_amount)}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${
                      amountToPay === booking.total_amount
                        ? "bg-green-50 border-green-200 text-green-700"
                        : "border-slate-100 text-slate-500 hover:border-slate-300"
                    }`}
                  >
                    Pay Full Amount
                  </button>
                </div>

                <p className="text-xs text-slate-400 mt-3 text-center">
                  Total Booking Cost:{" "}
                  <b>₱{booking.total_amount.toLocaleString()}</b>
                </p>
              </div>

              {/* Dropzone */}
              <div className="mb-4">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Upload Receipt
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`
                        relative group w-full min-h-40 border-3 border-dashed rounded-3xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-300
                        ${
                          file
                            ? "border-green-400 bg-green-50/50"
                            : "border-slate-200 hover:border-[#0057E7] hover:bg-blue-50/50"
                        }
                     `}
                >
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />

                  {file ? (
                    <div className="text-center p-4 animate-in zoom-in-50">
                      <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <p className="font-bold text-slate-800 text-sm truncate max-w-[200px]">
                        {file.name}
                      </p>
                      <p className="text-[10px] text-green-600 font-bold uppercase tracking-wide">
                        Ready to submit
                      </p>
                    </div>
                  ) : (
                    <div className="text-center p-4">
                      <Upload className="w-8 h-8 text-slate-400 group-hover:text-[#0057E7] mx-auto mb-2 transition-colors" />
                      <p className="font-bold text-sm text-slate-600 group-hover:text-[#0057E7]">
                        Click to Upload
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-yellow-50 p-3 rounded-xl flex gap-2 items-start mb-4">
                <AlertCircle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-700 leading-snug">
                  Your booking will be confirmed once the Admin verifies your{" "}
                  {amountToPay < booking.total_amount
                    ? "downpayment"
                    : "payment"}
                  .
                </p>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading || !file || amountToPay <= 0}
                className="w-full bg-[#0057E7] hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Submit Payment"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
