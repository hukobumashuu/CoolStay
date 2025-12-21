import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  // 1. Fetch Key Data
  // Get all payments (for Revenue)
  const { data: payments } = await supabase
    .from("payments")
    .select("amount, created_at, status");

  // Get all bookings (for Room Popularity & Occupancy)
  const { data: bookings } = await supabase
    .from("bookings")
    .select("*, room_types(name)");

  // Get recent reports log
  const { data: reports } = await supabase
    .from("analytics_reports")
    .select("*")
    .order("generated_at", { ascending: false })
    .limit(5);

  // 2. Calculate KPI Stats
  const totalRevenue =
    payments
      ?.filter((p) => p.status === "paid" || p.status === "completed")
      .reduce((sum, p) => sum + Number(p.amount), 0) || 0;

  const totalBookings = bookings?.length || 0;

  // Count guests currently checked in
  const activeGuests =
    bookings?.filter((b) => b.status === "checked_in").length || 0;

  // 3. Process Monthly Revenue for Area Chart
  const revenueByMonth = new Array(12).fill(0);
  payments?.forEach((p) => {
    if (p.status === "paid" || p.status === "completed") {
      const month = new Date(p.created_at).getMonth(); // 0 = Jan, 11 = Dec
      revenueByMonth[month] += Number(p.amount);
    }
  });

  const chartData = [
    { name: "Jan", total: revenueByMonth[0] },
    { name: "Feb", total: revenueByMonth[1] },
    { name: "Mar", total: revenueByMonth[2] },
    { name: "Apr", total: revenueByMonth[3] },
    { name: "May", total: revenueByMonth[4] },
    { name: "Jun", total: revenueByMonth[5] },
    { name: "Jul", total: revenueByMonth[6] },
    { name: "Aug", total: revenueByMonth[7] },
    { name: "Sep", total: revenueByMonth[8] },
    { name: "Oct", total: revenueByMonth[9] },
    { name: "Nov", total: revenueByMonth[10] },
    { name: "Dec", total: revenueByMonth[11] },
  ];

  // 4. Process Room Popularity for Bar Chart
  const roomCounts: Record<string, number> = {};
  bookings?.forEach((b) => {
    const roomName = b.room_types?.name || "Unknown";
    roomCounts[roomName] = (roomCounts[roomName] || 0) + 1;
  });

  const roomData = Object.keys(roomCounts)
    .map((name) => ({
      name,
      bookings: roomCounts[name],
      color: "#0077b6", // Default blue
    }))
    .sort((a, b) => b.bookings - a.bookings)
    .slice(0, 5); // Top 5

  // 5. Send Response
  return NextResponse.json({
    kpi: {
      totalRevenue,
      totalBookings,
      activeGuests,
      avgRating: 4.8, // Hardcoded for now until we aggregate reviews
    },
    revenueChart: chartData,
    roomPopularity: roomData,
    recentReports: reports || [],
  });
}
