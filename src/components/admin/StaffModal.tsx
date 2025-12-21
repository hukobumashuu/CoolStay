"use client";

import { useState } from "react";
// Removed unused createClient import
import { Button } from "@/components/ui/Button";
import { X, Loader2 } from "lucide-react";

// Matches DB Schema
interface StaffMember {
  id?: number;
  employee_id: string;
  full_name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  status: string;
  salary: number;
  hire_date?: string;
}

interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  staffToEdit?: StaffMember | null;
}

const INITIAL_DATA = {
  employee_id: "",
  full_name: "",
  email: "",
  phone: "",
  position: "Staff",
  department: "Housekeeping",
  status: "active",
  salary: 15000,
  hire_date: new Date().toISOString().split("T")[0], // Today's date YYYY-MM-DD
};

export default function StaffModal({
  isOpen,
  onClose,
  onSuccess,
  staffToEdit,
}: StaffModalProps) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<StaffMember>(() => {
    if (staffToEdit) {
      return {
        ...staffToEdit,
        // Ensure hire_date is formatted for input type="date"
        hire_date: staffToEdit.hire_date
          ? new Date(staffToEdit.hire_date).toISOString().split("T")[0]
          : INITIAL_DATA.hire_date,
      };
    }
    return INITIAL_DATA;
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // We use the same API route for both Add (POST) and Edit (PATCH)
      const method = staffToEdit ? "PATCH" : "POST";
      const body = staffToEdit ? { ...formData, id: staffToEdit.id } : formData;

      const res = await fetch("/api/admin/staff", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save");
      }

      onSuccess();
      onClose();
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#0A1A44] p-5 text-white flex justify-between items-center shrink-0">
          <h2 className="text-lg font-bold font-serif">
            {staffToEdit ? "Edit Staff Member" : "Add New Staff"}
          </h2>
          <button
            onClick={onClose}
            className="hover:bg-white/10 p-1 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 overflow-y-auto custom-scrollbar"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Employee ID
              </label>
              <input
                required
                type="text"
                placeholder="EMP-001"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0A1A44] outline-none font-mono text-sm"
                value={formData.employee_id}
                onChange={(e) =>
                  setFormData({ ...formData, employee_id: e.target.value })
                }
                disabled={!!staffToEdit} // ID usually shouldn't change
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Full Name
              </label>
              <input
                required
                type="text"
                placeholder="John Doe"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0A1A44] outline-none text-sm"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Email
              </label>
              <input
                required
                type="email"
                placeholder="email@company.com"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0A1A44] outline-none text-sm"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Phone
              </label>
              <input
                required
                type="tel"
                placeholder="0912..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0A1A44] outline-none text-sm"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Department
              </label>
              <select
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0A1A44] outline-none text-sm"
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
              >
                <option value="Front Desk">Front Desk</option>
                <option value="Housekeeping">Housekeeping</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Management">Management</option>
                <option value="Security">Security</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Position
              </label>
              <input
                required
                type="text"
                placeholder="e.g. Senior Manager"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0A1A44] outline-none text-sm"
                value={formData.position}
                onChange={(e) =>
                  setFormData({ ...formData, position: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Status
              </label>
              <select
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0A1A44] outline-none text-sm"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="terminated">Terminated</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Monthly Salary (₱)
              </label>
              <input
                required
                type="number"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0A1A44] outline-none text-sm"
                value={formData.salary}
                onChange={(e) =>
                  setFormData({ ...formData, salary: Number(e.target.value) })
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Date Hired
            </label>
            <input
              type="date"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0A1A44] outline-none text-sm"
              value={formData.hire_date}
              onChange={(e) =>
                setFormData({ ...formData, hire_date: e.target.value })
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
              className="flex-1 bg-[#0A1A44] text-white hover:bg-blue-900 flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {staffToEdit ? "Save Changes" : "Create Profile"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
