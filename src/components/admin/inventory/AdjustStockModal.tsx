"use client";

import { useState } from "react";
import { X, Loader2, ArrowDown, ArrowUp } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";

interface Item {
  id: string;
  item_name: string;
  current_stock: number;
  unit: string;
}

interface AdjustStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  item: Item | null;
}

export default function AdjustStockModal({
  isOpen,
  onClose,
  onSuccess,
  item,
}: AdjustStockModalProps) {
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<"restock" | "usage">("usage");
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");

  if (!isOpen || !item) return null;

  const handleSubmit = async () => {
    if (quantity <= 0) return toast.error("Quantity must be greater than 0");
    if (type === "usage" && quantity > item.current_stock)
      return toast.error("Not enough stock!");

    setLoading(true);
    try {
      const res = await fetch("/api/admin/inventory/adjust", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supply_id: item.id,
          type,
          quantity,
          notes,
          user_name: "Admin", // Replace with real auth user if available
        }),
      });

      if (!res.ok) throw new Error("Failed");

      toast.success("Stock updated!");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Error updating stock");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
          <div>
            <h2 className="font-bold">Adjust Stock</h2>
            <p className="text-xs text-slate-300">
              {item.item_name} (Current: {item.current_stock} {item.unit})
            </p>
          </div>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Toggle Type */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setType("usage")}
              className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                type === "usage"
                  ? "bg-white text-red-600 shadow-sm"
                  : "text-slate-400"
              }`}
            >
              <ArrowDown className="w-4 h-4" /> OUT (Usage)
            </button>
            <button
              onClick={() => setType("restock")}
              className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                type === "restock"
                  ? "bg-white text-green-600 shadow-sm"
                  : "text-slate-400"
              }`}
            >
              <ArrowUp className="w-4 h-4" /> IN (Restock)
            </button>
          </div>

          {/* Quantity Input */}
          <div className="text-center">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Quantity
            </label>
            <div className="flex items-center justify-center gap-4 mt-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 font-bold text-slate-600"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-20 text-center text-3xl font-bold text-slate-800 outline-none border-b-2 border-slate-200 focus:border-blue-500"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 font-bold text-slate-600"
              >
                +
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-1">{item.unit}</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Notes (Optional)
            </label>
            <input
              className="w-full p-2 border rounded-lg text-sm"
              placeholder={
                type === "usage"
                  ? "e.g. Room 101 request"
                  : "e.g. Monthly delivery"
              }
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full mt-2 ${
              type === "restock"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              `Confirm ${type === "restock" ? "Restock" : "Usage"}`
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
