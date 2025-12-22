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
  MoreVertical,
  LucideIcon,
} from "lucide-react";
import { toast } from "sonner"; // Import toast

// --- TYPES ---
interface UserProfile {
  full_name: string | null;
  email: string | null;
  phone: string | null;
}

interface RoomType {
  name: string;
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

// --- STATS COMPONENT ---
function StatCard({
  label,
  count,
  icon: Icon,
  color,
}: {
  label: string;
  count: number;
  icon: LucideIcon;
  color: string;
}) {
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

const TABS = ["All", "Pending", "Confirmed", "Checked In", "Cancelled"];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("All");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch bookings
  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/admin/bookings");
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setBookings(data);
    } catch {
      console.error("Failed to load bookings");
      // Optional: toast.error("Could not load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Handle Status Update
  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setProcessingId(id);
    const toastId = toast.loading("Updating status...");

    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update");
      }

      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );

      toast.dismiss(toastId);
      toast.success(`Booking marked as ${newStatus.replace("_", " ")}`);
    } catch (err: unknown) {
      toast.dismiss(toastId);
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setProcessingId(null);
    }
  };

  // Filter Logic
  const filteredBookings = bookings.filter((b) => {
    // 1. Tab Filter
    const matchesTab =
      activeTab === "All"
        ? true
        : activeTab === "Pending"
        ? b.status === "pending"
        : activeTab === "Confirmed"
        ? b.status === "confirmed"
        : activeTab === "Checked In"
        ? b.status === "checked_in"
        : activeTab === "Cancelled"
        ? b.status === "cancelled"
        : true;

    // 2. Search Filter
    const searchLower = searchQuery.toLowerCase();
    const guestName = b.users?.full_name?.toLowerCase() || "";
    const roomName = b.room_types?.name.toLowerCase() || "";
    const bookingId = b.id.toLowerCase();

    const matchesSearch =
      guestName.includes(searchLower) ||
      bookingId.includes(searchLower) ||
      roomName.includes(searchLower);

    return matchesTab && matchesSearch;
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
      {/* 1. Header Section */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-10 gap-8">
        <div>
          <h1 className="text-4xl font-serif font-black text-[#0A1A44] tracking-tight">
            Reservations
          </h1>
          <p className="text-slate-500 font-medium mt-2 flex items-center gap-2">
            <span>Admin Dashboard</span>
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            <span>Booking Management</span>
          </p>
        </div>

        {/* Stats Row */}
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

      {/* 2. Controls Toolbar */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 mb-8 sticky top-4 z-20 backdrop-blur-xl">
        {/* Tabs */}
        <div className="flex p-1 bg-slate-100 rounded-xl w-full md:w-auto overflow-x-auto no-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === tab
                  ? "bg-white text-[#0A1A44] shadow-sm ring-1 ring-black/5 scale-100"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 scale-95 opacity-70 hover:opacity-100 hover:scale-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80 mr-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search guests, rooms, IDs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-transparent bg-slate-100 focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-blue-500/10 text-sm font-medium transition-all outline-none"
          />
        </div>
      </div>

      {/* 3. Bookings List */}
      <div className="space-y-5">
        {loading ? (
          <div className="text-center py-24 flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-[#0A1A44] animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-[#0A1A44] rounded-full"></div>
              </div>
            </div>
            <p className="text-slate-400 font-medium animate-pulse">
              Syncing reservations...
            </p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarClock className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-700">
              No bookings found
            </h3>
            <p className="text-sm text-slate-400 mt-1 max-w-xs mx-auto">
              We couldn&apos;t find any reservations matching your current
              filters.
            </p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onUpdate={handleStatusUpdate}
              processingId={processingId}
            />
          ))
        )}
      </div>
    </div>
  );
}

// --- CARD COMPONENT ---

interface BookingCardProps {
  booking: Booking;
  onUpdate: (id: string, status: string) => Promise<void>;
  processingId: string | null;
}

function BookingCard({ booking, onUpdate, processingId }: BookingCardProps) {
  const isProcessing = processingId === booking.id;

  // --- Date Logic ---
  const checkInDate = new Date(booking.check_in_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  checkInDate.setHours(0, 0, 0, 0);
  const isEarly = today < checkInDate;

  // Status Styling Configuration
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
  };

  const status = statusConfig[booking.status] || statusConfig.pending;

  return (
    <div className="group relative bg-white rounded-2xl p-0 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 transition-all duration-300 overflow-hidden">
      {/* Left Colored Accent Bar */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1.5 ${status.border} transition-all group-hover:w-2`}
      ></div>

      <div className="flex flex-col xl:flex-row p-6 pl-8 gap-6 xl:gap-8 items-start xl:items-center">
        {/* 1. Profile Section */}
        <div className="flex items-center gap-5 min-w-[280px]">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-slate-100 to-slate-200 text-[#0A1A44] flex items-center justify-center font-serif font-bold text-xl shadow-inner">
              {booking.users?.full_name?.charAt(0) || "G"}
            </div>
            {/* Small Status Dot on Avatar */}
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

        {/* 2. Visual Timeline (Date Flow) */}
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
            <span className="text-xs text-slate-400">
              {new Date(booking.check_in_date).toLocaleDateString(undefined, {
                weekday: "short",
              })}
            </span>
          </div>

          {/* Visual Arrow Connector */}
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
            <span className="text-xs text-slate-400">
              {new Date(booking.check_out_date).toLocaleDateString(undefined, {
                weekday: "short",
              })}
            </span>
          </div>
        </div>

        {/* 3. Metrics (Guests & Price) */}
        <div className="flex items-center gap-8 min-w-[180px]">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Guests
            </p>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-400" />
              <span className="font-bold text-slate-700">
                {booking.guests_count}
              </span>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Total
            </p>
            <span className="font-bold text-[#0A1A44] text-lg">
              ₱{booking.total_amount?.toLocaleString()}
            </span>
          </div>
        </div>

        {/* 4. Actions & Status Pill */}
        <div className="flex flex-col sm:flex-row xl:flex-col items-end gap-3 w-full xl:w-auto min-w-[140px]">
          <div
            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${status.color}`}
          >
            {status.label}
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            {booking.status === "pending" && (
              <>
                <ActionButton
                  icon={XCircle}
                  label="Decline"
                  color="hover:bg-red-50 text-red-500 border border-red-100"
                  onClick={() => onUpdate(booking.id, "cancelled")}
                  isLoading={isProcessing}
                  variant="danger"
                />
                <ActionButton
                  icon={CheckCircle}
                  label="Confirm"
                  color="bg-[#0A1A44] text-white hover:bg-blue-900"
                  onClick={() => onUpdate(booking.id, "confirmed")}
                  isLoading={isProcessing}
                  variant="primary"
                />
              </>
            )}

            {booking.status === "confirmed" && (
              <ActionButton
                icon={LogIn}
                label={
                  isEarly
                    ? `Due ${checkInDate.toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}`
                    : "Check In"
                }
                color={
                  isEarly
                    ? "bg-slate-100 text-slate-400 border border-slate-200"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }
                onClick={() => onUpdate(booking.id, "checked_in")}
                isLoading={isProcessing}
                variant="primary"
                disabled={isEarly}
              />
            )}

            {booking.status === "checked_in" && (
              <ActionButton
                icon={LogOut}
                label="Check Out"
                color="bg-slate-800 text-white hover:bg-black"
                onClick={() => onUpdate(booking.id, "checked_out")}
                isLoading={isProcessing}
                variant="primary"
              />
            )}
            {(booking.status === "cancelled" ||
              booking.status === "checked_out") && (
              <button className="p-2 text-slate-300 hover:text-slate-500 transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
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
  const baseStyles =
    "flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed";
  const widthStyle = variant === "danger" ? "w-auto" : "w-full";

  return (
    <button
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`${baseStyles} ${color} ${widthStyle} shadow-sm hover:shadow-md active:scale-95`}
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
