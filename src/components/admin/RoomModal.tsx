"use client";

import { useState } from "react"; // Removed useEffect
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

interface RoomType {
  id: string;
  name: string;
  description: string;
  base_price: number;
  capacity: number;
  total_rooms: number;
  image_url: string;
}

interface RoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  roomToEdit?: RoomType | null;
}

const INITIAL_DATA = {
  name: "",
  description: "",
  base_price: "",
  capacity: "2",
  total_rooms: "5",
  image_url: "",
};

export default function RoomModal({
  isOpen,
  onClose,
  onSuccess,
  roomToEdit,
}: RoomModalProps) {
  const [loading, setLoading] = useState(false);

  // FIX: Initialize state ONCE based on props.
  // Because we will force the component to re-mount in the parent, this always gets fresh data.
  const [formData, setFormData] = useState(() => {
    if (roomToEdit) {
      return {
        name: roomToEdit.name,
        description: roomToEdit.description || "",
        base_price: roomToEdit.base_price.toString(),
        capacity: roomToEdit.capacity.toString(),
        total_rooms: roomToEdit.total_rooms.toString(),
        image_url: roomToEdit.image_url || "",
      };
    }
    return INITIAL_DATA;
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();

    const payload = {
      name: formData.name,
      description: formData.description,
      base_price: Number(formData.base_price),
      capacity: Number(formData.capacity),
      total_rooms: Number(formData.total_rooms),
      image_url: formData.image_url,
      updated_at: new Date().toISOString(),
    };

    let error;

    if (roomToEdit) {
      // --- UPDATE MODE ---
      const { error: updateError } = await supabase
        .from("room_types")
        .update(payload)
        .eq("id", roomToEdit.id);
      error = updateError;
    } else {
      // --- CREATE MODE ---
      const { error: insertError } = await supabase.from("room_types").insert({
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        ...payload,
      });
      error = insertError;
    }

    if (error) {
      alert("Error: " + error.message);
    } else {
      onSuccess();
      onClose();
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#0A1A44] p-6 text-white flex justify-between items-center shrink-0">
          <h2 className="text-xl font-serif font-bold">
            {roomToEdit ? "Edit Room Details" : "Add New Room"}
          </h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {/* Room Name */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Room Name
            </label>
            <input
              required
              type="text"
              placeholder="e.g. Deluxe Ocean View"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0A1A44] outline-none transition-all"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Price */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Price (Night)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400">₱</span>
                <input
                  required
                  type="number"
                  className="w-full p-3 pl-8 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0A1A44] outline-none"
                  value={formData.base_price}
                  onChange={(e) =>
                    setFormData({ ...formData, base_price: e.target.value })
                  }
                />
              </div>
            </div>
            {/* Total Rooms */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Total Units
              </label>
              <input
                required
                type="number"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0A1A44] outline-none"
                value={formData.total_rooms}
                onChange={(e) =>
                  setFormData({ ...formData, total_rooms: e.target.value })
                }
              />
            </div>
          </div>

          {/* Capacity */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Max Capacity (Persons)
            </label>
            <input
              required
              type="number"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0A1A44] outline-none"
              value={formData.capacity}
              onChange={(e) =>
                setFormData({ ...formData, capacity: e.target.value })
              }
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Image URL
            </label>
            <input
              type="url"
              placeholder="https://..."
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0A1A44] outline-none"
              value={formData.image_url}
              onChange={(e) =>
                setFormData({ ...formData, image_url: e.target.value })
              }
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Room details..."
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0A1A44] outline-none resize-none"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="pt-4 flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#0A1A44] text-white hover:bg-blue-900"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : roomToEdit
                ? "Save Changes"
                : "Create Room"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
