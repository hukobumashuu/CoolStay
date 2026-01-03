import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// --- TYPES for Manual Fetching ---
interface Payment {
  id: string;
  booking_id: string | null;
  user_id: string | null; // Some payments might link directly to user
  amount: number;
  payment_method: string;
  status: string;
  created_at: string;
  description: string | null;
}

interface Booking {
  id: string;
  guest_id: string | null;
  check_in_date: string;
  check_out_date: string;
  room_type_id: string | null;
}

interface User {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
}

interface RoomType {
  id: string;
  name: string;
}

// GET: Fetch all transactions
export async function GET() {
  try {
    const supabase = await createClient();

    // 1. Check User (Security)
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 2. Fetch All Payments (Raw)
    const { data: rawPayments, error: paymentsError } = await supabase
      .from("payments")
      .select("*")
      .order("created_at", { ascending: false });

    if (paymentsError) throw paymentsError;
    const payments = rawPayments as Payment[];

    // 3. Extract Booking IDs
    const bookingIds = Array.from(
      new Set(payments.map((p) => p.booking_id).filter(Boolean) as string[])
    );

    // 4. Fetch Related Bookings (Raw)
    const bookingsMap: Record<string, Booking> = {}; // Fixed: const
    const userIds = new Set<string>(); // Fixed: const
    const roomTypeIds = new Set<string>(); // Fixed: const

    if (bookingIds.length > 0) {
      const { data: bookings } = await supabase
        .from("bookings")
        .select("id, guest_id, check_in_date, check_out_date, room_type_id")
        .in("id", bookingIds);

      (bookings as Booking[])?.forEach((b) => {
        bookingsMap[b.id] = b;
        if (b.guest_id) userIds.add(b.guest_id);
        if (b.room_type_id) roomTypeIds.add(b.room_type_id);
      });
    }

    // 5. Fetch Users (Raw)
    const usersMap: Record<string, User> = {}; // Fixed: const
    const userIdArray = Array.from(userIds);

    if (userIdArray.length > 0) {
      const { data: users } = await supabase
        .from("users")
        .select("id, full_name, email, phone")
        .in("id", userIdArray);

      (users as User[])?.forEach((u) => {
        usersMap[u.id] = u;
      });
    }

    // 6. Fetch Room Types (Raw - for Receipt Name)
    const roomsMap: Record<string, string> = {}; // Fixed: const
    const roomTypeIdArray = Array.from(roomTypeIds);

    if (roomTypeIdArray.length > 0) {
      const { data: rooms } = await supabase
        .from("room_types")
        .select("id, name")
        .in("id", roomTypeIdArray);

      (rooms as RoomType[])?.forEach((r) => {
        roomsMap[r.id] = r.name;
      });
    }

    // 7. Stitch it all together
    const formatted = payments.map((p) => {
      const booking = p.booking_id ? bookingsMap[p.booking_id] : null;
      const guestId = booking?.guest_id || p.user_id;
      const user = guestId ? usersMap[guestId] : null;
      const roomName = booking?.room_type_id
        ? roomsMap[booking.room_type_id]
        : "General";

      return {
        id: p.id,
        booking_id: p.booking_id,
        guest: user?.full_name || "Unknown Guest",
        email: user?.email || "N/A",
        phone: user?.phone || "N/A",
        amount: p.amount,
        method: p.payment_method,
        type: (p.amount || 0) < 0 ? "Refund" : "Payment",
        status: p.status,
        date: p.created_at
          ? new Date(p.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "N/A",
        room_name: roomName,
        check_in: booking?.check_in_date,
        check_out: booking?.check_out_date,
      };
    });

    return NextResponse.json(formatted);
  } catch (err: unknown) {
    console.error("Billing API Error:", err);
    let message = "Internal Server Error";
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST: Record a new Transaction (Payment or Refund)
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { booking_id, amount, method, type, notes } = body;

    const finalAmount =
      type === "refund" ? -Math.abs(amount) : Math.abs(amount);
    const status = method === "cash" ? "paid" : "pending";

    const { data, error } = await supabase
      .from("payments")
      .insert({
        id: crypto.randomUUID(),
        booking_id,
        amount: finalAmount,
        payment_method: method,
        status: status,
        description: notes,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (err: unknown) {
    let message = "Transaction Failed";
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
