"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle,
  XCircle,
  LogIn,
  LogOut,
  Loader2,
  CalendarClock,
  Search,
  Users,
  Clock,
  Briefcase,
  ArrowRight,
  LucideIcon,
  AlertTriangle,
  UserX,
  Plus,
  Eye,
  DollarSign, // Added DollarSign
} from "lucide-react";
import { toast } from "sonner";
import AdminBookingModal from "@/components/admin/AdminBookingModal";
import PaymentProofModal from "@/components/admin/PaymentProofModal";
import TransactionModal from "@/components/admin/TransactionModal"; // Added TransactionModal

// --- TYPES ---
interface UserProfile {
  full_name: string | null;
  email: string | null;
  phone: string | null;
}

interface RoomType {
  name: string;
}

interface Payment {
  id: string;
  amount: number;
  status: string;
  proof_url: string | null;
}

// Extended type for the verification modal which needs guest name
interface PaymentVerification extends Payment {
  guestName?: string | null;
}

interface Booking {
  id: string;
  created_at: string;
  status: string;
  guests_count: number;
  check_in_date: string;
  check_out_date: string;
  total_amount: number;
  payment_status: string;
  users: UserProfile | null;
  room_types: RoomType | null;
  payments?: Payment[];
}

interface ActionButtonProps {
  label: string;
  icon: LucideIcon;
  color: string;
  onClick: () => void;
  isLoading: boolean;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
}

interface StatCardProps {
  label: string;
  count: number;
  icon: LucideIcon;
  color: string;
}

// --- STATS COMPONENT ---
function StatCard({ label, count, icon: Icon, color }: StatCardProps) {
  return (
    <div className="relative overflow-hidden bg-white p-6 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 flex items-center gap-5 flex-1 min-w-[220px] group transition-all hover:-translate-y-1 hover:shadow-lg">
      <div
        className={`absolute right-0 top-0 w-24 h-24 -mr-6 -mt-6 rounded-full opacity-10 transition-transform group-hover:scale-150 ${color}`}
      ></div>
      <div
        className={`p-4 rounded-2xl ${color} bg-opacity-10 text-current relative z-10`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <div className="relative z-10">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
          {label}
        </p>
        <p className="text-3xl font-serif font-bold text-slate-800">{count}</p>
      </div>
    </div>
  );
}

const TABS = [
  "All",
  "Pending",
  "Confirmed",
  "Checked In",
  "Cancelled",
  "No Show",
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("All");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal States
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [proofToVerify, setProofToVerify] =
    useState<PaymentVerification | null>(null);

  const [transactionPrefill, setTransactionPrefill] = useState<{
    bookingId: string;
    guestName: string;
    amount: number;
  } | null>(null);

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/admin/bookings");
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setBookings(data);
    } catch {
      console.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    if (newStatus === "no_show" && !confirm("Mark as No-Show?")) return;

    setProcessingId(id);
    const toastId = toast.loading("Updating...");

    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed");

      await fetchBookings(); // Refresh to get new states
      toast.dismiss(toastId);
      toast.success("Updated successfully");
    } catch {
      toast.dismiss(toastId);
      toast.error("Failed to update");
    } finally {
      setProcessingId(null);
    }
  };

  // Filter Logic
  const filteredBookings = bookings.filter((b) => {
    const matchesTab =
      activeTab === "All"
        ? true
        : activeTab === "No Show"
        ? b.status === "no_show"
        : activeTab === "Pending"
        ? b.status === "pending"
        : activeTab === "Confirmed"
        ? b.status === "confirmed"
        : activeTab === "Checked In"
        ? b.status === "checked_in"
        : activeTab === "Cancelled"
        ? b.status === "cancelled"
        : true;

    const searchLower = searchQuery.toLowerCase();
    return (
      matchesTab &&
      ((b.users?.full_name?.toLowerCase() || "").includes(searchLower) ||
        b.id.toLowerCase().includes(searchLower))
    );
  });

  // Derived Stats
  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const checkInCount = bookings.filter((b) => {
    const today = new Date().toDateString();
    return (
      new Date(b.check_in_date).toDateString() === today &&
      b.status === "confirmed"
    );
  }).length;
  const activeCount = bookings.filter((b) => b.status === "checked_in").length;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50/50 p-8 -m-6 font-sans text-slate-800">
      {/* Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-10 gap-8">
        <div>
          <h1 className="text-4xl font-serif font-black text-[#0A1A44] tracking-tight">
            Reservations
          </h1>
          <p className="text-slate-500 font-medium mt-2">
            Admin Dashboard • Booking Management
          </p>
        </div>
        <div className="flex flex-wrap gap-4 w-full xl:w-auto">
          <StatCard
            label="Pending"
            count={pendingCount}
            icon={Clock}
            color="text-yellow-600 bg-yellow-500"
          />
          <StatCard
            label="Arrivals Today"
            count={checkInCount}
            icon={Briefcase}
            color="text-blue-600 bg-blue-500"
          />
          <StatCard
            label="Active Guests"
            count={activeCount}
            icon={Users}
            color="text-green-600 bg-green-500"
          />
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 mb-8 sticky top-4 z-20 backdrop-blur-xl">
        <div className="flex p-1 bg-slate-100 rounded-xl w-full md:w-auto overflow-x-auto no-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === tab
                  ? "bg-white text-[#0A1A44] shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-transparent bg-slate-100 focus:bg-white focus:border-blue-100 text-sm font-medium outline-none"
            />
          </div>
          <button
            onClick={() => setIsBookingModalOpen(true)}
            className="flex items-center gap-2 bg-[#0A1A44] text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-900 transition-all shadow-md active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Booking</span>
          </button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-5">
        {loading ? (
          <div className="text-center py-24 flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-[#0A1A44]" />
            <p className="text-slate-400 font-medium">
              Syncing reservations...
            </p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm">
            <CalendarClock className="w-8 h-8 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-700">
              No bookings found
            </h3>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onUpdate={handleStatusUpdate}
              processingId={processingId}
              onVerifyProof={(payment) => setProofToVerify(payment)}
              onReceivePayment={(bookingId, guestName, balance) =>
                setTransactionPrefill({ bookingId, guestName, amount: balance })
              }
            />
          ))
        )}
      </div>

      {/* MODALS */}
      <AdminBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onSuccess={fetchBookings}
      />

      {/* Verify Payment Modal */}
      <PaymentProofModal
        isOpen={!!proofToVerify}
        onClose={() => setProofToVerify(null)}
        payment={
          proofToVerify
            ? {
                id: proofToVerify.id,
                guest: proofToVerify.guestName || "Unknown Guest", // Handle potential null
                amount: proofToVerify.amount,
                proof_url: proofToVerify.proof_url || "",
              }
            : null
        }
        onSuccess={() => {
          fetchBookings(); // Refresh balance after verification
        }}
      />

      <TransactionModal
        isOpen={!!transactionPrefill}
        onClose={() => setTransactionPrefill(null)}
        onSuccess={fetchBookings}
        prefill={transactionPrefill}
      />
    </div>
  );
}

// --- UPDATED CARD COMPONENT ---

interface BookingCardProps {
  booking: Booking;
  onUpdate: (id: string, status: string) => Promise<void>;
  processingId: string | null;
  onVerifyProof: (payment: PaymentVerification) => void;
  onReceivePayment: (id: string, name: string, balance: number) => void;
}

function BookingCard({
  booking,
  onUpdate,
  processingId,
  onVerifyProof,
  onReceivePayment,
}: BookingCardProps) {
  const isProcessing = processingId === booking.id;
  const checkInDate = new Date(booking.check_in_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  checkInDate.setHours(0, 0, 0, 0);
  const isEarly = today < checkInDate;
  const isOverdue = today > checkInDate && booking.status === "confirmed";

  // --- BALANCE CALCULATOR ---
  const totalAmount = booking.total_amount || 0;
  const totalPaid = (booking.payments || [])
    .filter((p) => p.status === "completed" || p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);

  const balanceDue = totalAmount - totalPaid;
  const isFullyPaid = balanceDue <= 0;

  // --- FIND PENDING PROOF ---
  // Is there a payment that is PENDING and HAS A PICTURE?
  const pendingProof = (booking.payments || []).find(
    (p) => p.status === "pending" && p.proof_url
  );

  // Status Styling
  const statusConfig: Record<
    string,
    { label: string; color: string; border: string }
  > = {
    pending: {
      label: "Pending",
      color: "text-yellow-600 bg-yellow-50",
      border: "bg-yellow-400",
    },
    confirmed: {
      label: "Confirmed",
      color: "text-green-600 bg-green-50",
      border: "bg-green-500",
    },
    checked_in: {
      label: "Checked In",
      color: "text-blue-600 bg-blue-50",
      border: "bg-blue-500",
    },
    checked_out: {
      label: "Completed",
      color: "text-slate-500 bg-slate-100",
      border: "bg-slate-400",
    },
    cancelled: {
      label: "Cancelled",
      color: "text-red-600 bg-red-50",
      border: "bg-red-500",
    },
    no_show: {
      label: "No Show",
      color: "text-purple-600 bg-purple-50",
      border: "bg-purple-500",
    },
  };
  const status = statusConfig[booking.status] || statusConfig.pending;

  return (
    <div
      className={`group relative bg-white rounded-2xl p-0 shadow-sm border transition-all duration-300 overflow-hidden ${
        isOverdue
          ? "border-red-300 ring-4 ring-red-50"
          : "border-slate-100 hover:shadow-md"
      }`}
    >
      {isOverdue && (
        <div className="bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 absolute top-0 right-0 z-10 rounded-bl-xl flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" /> Overdue Check-In
        </div>
      )}

      <div
        className={`absolute left-0 top-0 bottom-0 w-1.5 ${status.border} transition-all group-hover:w-2`}
      ></div>

      <div className="flex flex-col xl:flex-row p-6 pl-8 gap-6 xl:gap-8 items-start xl:items-center">
        {/* Profile */}
        <div className="flex items-center gap-5 min-w-[280px]">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-slate-100 to-slate-200 text-[#0A1A44] flex items-center justify-center font-serif font-bold text-xl shadow-inner">
              {booking.users?.full_name?.charAt(0) || "G"}
            </div>
            <div
              className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full ${status.border}`}
            ></div>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-lg leading-tight">
              {booking.users?.full_name || "Guest"}
            </h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mt-1 flex items-center gap-2">
              <span className="truncate max-w-[150px]">
                {booking.room_types?.name}
              </span>
            </p>
          </div>
        </div>

        {/* Date Timeline */}
        <div className="flex-1 w-full xl:w-auto bg-slate-50/50 rounded-xl p-4 border border-slate-100 flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Check In
            </span>
            <span className="font-bold text-slate-700">
              {new Date(booking.check_in_date).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="flex-1 flex items-center justify-center px-4 relative">
            <div className="h-0.5 w-full bg-slate-200 absolute"></div>
            <div className="w-6 h-6 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center relative z-10">
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </div>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Check Out
            </span>
            <span className="font-bold text-slate-700">
              {new Date(booking.check_out_date).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* FINANCIALS (UPDATED) */}
        <div className="flex flex-col min-w-[140px]">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Payment Status
          </p>
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#0A1A44] text-lg">
              ₱{totalAmount.toLocaleString()}
            </span>
          </div>
          {/* BALANCE INDICATOR */}
          {!isFullyPaid ? (
            <div className="mt-1">
              <p className="text-xs font-bold text-red-500 flex items-center gap-1 mb-1">
                Balance: ₱{balanceDue.toLocaleString()}
              </p>

              <button
                onClick={() =>
                  onReceivePayment(
                    booking.id,
                    booking.users?.full_name || "Guest",
                    balanceDue
                  )
                }
                className="bg-green-100 text-green-700 hover:bg-green-200 px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 transition-colors w-fit shadow-sm border border-green-200"
              >
                <DollarSign className="w-3 h-3" /> Receive Cash
              </button>
            </div>
          ) : (
            <p className="text-xs font-bold text-green-600 mt-1 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Fully Paid
            </p>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row xl:flex-col items-end gap-3 w-full xl:w-auto min-w-[140px]">
          <div
            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${status.color}`}
          >
            {status.label}
          </div>

          <div className="flex gap-2 w-full sm:w-auto justify-end">
            {/* PRIORITY 1: REVIEW PENDING PAYMENT */}
            {pendingProof && (
              <button
                onClick={() =>
                  onVerifyProof({
                    ...pendingProof,
                    guestName: booking.users?.full_name,
                  })
                }
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-200 animate-pulse"
              >
                <Eye className="w-3.5 h-3.5" /> Review Payment
              </button>
            )}

            {/* PRIORITY 2: STANDARD ACTIONS */}
            {booking.status === "pending" && !pendingProof && (
              <>
                <ActionButton
                  icon={XCircle}
                  label="Decline"
                  color="text-red-500 border border-red-100"
                  onClick={() => onUpdate(booking.id, "cancelled")}
                  isLoading={isProcessing}
                  variant="danger"
                />
                <ActionButton
                  icon={CheckCircle}
                  label="Confirm"
                  color="bg-[#0A1A44] text-white"
                  onClick={() => onUpdate(booking.id, "confirmed")}
                  isLoading={isProcessing}
                  variant="primary"
                />
              </>
            )}

            {booking.status === "confirmed" && (
              <>
                <ActionButton
                  icon={LogIn}
                  label={isEarly ? "Too Early" : "Check In"}
                  color={
                    isEarly
                      ? "bg-slate-100 text-slate-400"
                      : "bg-blue-600 text-white"
                  }
                  onClick={() => onUpdate(booking.id, "checked_in")}
                  isLoading={isProcessing}
                  disabled={isEarly}
                />
                {!isEarly && (
                  <ActionButton
                    icon={UserX}
                    label="No Show"
                    color="text-purple-600 border border-purple-200"
                    onClick={() => onUpdate(booking.id, "no_show")}
                    isLoading={isProcessing}
                    variant="secondary"
                  />
                )}
              </>
            )}

            {booking.status === "checked_in" && (
              <ActionButton
                icon={LogOut}
                label="Check Out"
                color="bg-slate-800 text-white"
                onClick={() => onUpdate(booking.id, "checked_out")}
                isLoading={isProcessing}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionButton({
  label,
  icon: Icon,
  color,
  onClick,
  isLoading,
  variant = "primary",
  disabled,
}: ActionButtonProps) {
  const widthStyle =
    variant === "danger" || variant === "secondary" ? "w-auto" : "w-full";
  return (
    <button
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${color} ${widthStyle} shadow-sm active:scale-95`}
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Icon className="w-3.5 h-3.5" />
      )}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
