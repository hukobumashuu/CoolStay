"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { X, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StaffSchema } from "@/lib/schemas";
import { z } from "zod";

// 1. Define the DB shape separately
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
  staffToEdit?: StaffMember | null; // 2. Use the interface instead of 'any'
}

type StaffFormValues = z.infer<typeof StaffSchema>;

export default function StaffModal({
  isOpen,
  onClose,
  onSuccess,
  staffToEdit,
}: StaffModalProps) {
  const [loading, setLoading] = useState(false);

  // 3. Remove <StaffFormValues> generic here. Let TS infer it from the resolver.
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(StaffSchema),
    mode: "onChange",
    defaultValues: {
      employee_id: "",
      full_name: "",
      email: "",
      phone: "",
      position: "Staff",
      department: "Housekeeping",
      status: "active",
      salary: 15000,
      hire_date: new Date().toISOString().split("T")[0],
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (staffToEdit) {
        reset({
          employee_id: staffToEdit.employee_id,
          full_name: staffToEdit.full_name,
          email: staffToEdit.email,
          phone: staffToEdit.phone,
          position: staffToEdit.position,
          department: staffToEdit.department,
          // FIX: Cast string to the specific enum type
          status: staffToEdit.status as "active" | "inactive" | "terminated",
          salary: staffToEdit.salary,
          hire_date: staffToEdit.hire_date
            ? new Date(staffToEdit.hire_date).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
        });
      } else {
        reset({
          employee_id: "",
          full_name: "",
          email: "",
          phone: "",
          position: "Staff",
          department: "Housekeeping",
          status: "active",
          salary: 15000,
          hire_date: new Date().toISOString().split("T")[0],
        });
      }
    }
  }, [isOpen, staffToEdit, reset]);

  if (!isOpen) return null;

  // 4. Explicitly type 'data' here using the inferred Zod type
  const onSubmit = async (data: StaffFormValues) => {
    setLoading(true);
    try {
      const method = staffToEdit ? "PATCH" : "POST";
      const body = staffToEdit ? { ...data, id: staffToEdit.id } : data;

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

  const inputClass = (hasError: boolean) =>
    `w-full p-2.5 bg-slate-50 border ${
      hasError ? "border-red-500" : "border-slate-200"
    } rounded-lg focus:ring-2 focus:ring-[#0A1A44] outline-none text-sm`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-[#0A1A44] p-5 text-white flex justify-between items-center shrink-0">
          <h2 className="text-lg font-bold font-serif">
            {staffToEdit ? "Edit Staff Member" : "Add New Staff"}
          </h2>
          <button
            onClick={onClose}
            className="hover:bg-white/10 p-1 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 space-y-4 overflow-y-auto custom-scrollbar"
        >
          {/* ... Inputs remain the same ... */}
          {/* Just showing one example of register usage */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Employee ID
              </label>
              <input
                {...register("employee_id")}
                placeholder="EMP-001"
                className={inputClass(!!errors.employee_id)}
                disabled={!!staffToEdit}
              />
              {errors.employee_id && (
                <p className="text-xs text-red-500">
                  {errors.employee_id.message as string}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Full Name
              </label>
              <input
                {...register("full_name")}
                placeholder="John Doe"
                className={inputClass(!!errors.full_name)}
              />
              {errors.full_name && (
                <p className="text-xs text-red-500">
                  {errors.full_name.message as string}
                </p>
              )}
            </div>
          </div>

          {/* ... Rest of form ... */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Email
              </label>
              <input
                type="email"
                {...register("email")}
                className={inputClass(!!errors.email)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Phone
              </label>
              <input
                {...register("phone")}
                className={inputClass(!!errors.phone)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Department
              </label>
              <select
                {...register("department")}
                className={inputClass(!!errors.department)}
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
                {...register("position")}
                className={inputClass(!!errors.position)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Status
              </label>
              <select
                {...register("status")}
                className={inputClass(!!errors.status)}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="terminated">Terminated</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Salary (₱)
              </label>
              <input
                type="number"
                {...register("salary")}
                className={inputClass(!!errors.salary)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Date Hired
            </label>
            <input
              type="date"
              {...register("hire_date")}
              className={inputClass(!!errors.hire_date)}
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
              className="flex-1 bg-[#0A1A44] text-white"
              disabled={loading}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {staffToEdit ? "Save Changes" : "Create Profile"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
