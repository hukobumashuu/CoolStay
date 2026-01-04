import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET: Fetch all bookings with Payments
// GET: Fetch all bookings with Payments
export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // UPDATED QUERY: Added missing fields (payment_method, created_at, description)
    const { data, error } = await supabase
      .from("bookings")
      .select(
        `
        *,
        users (full_name, email, phone),
        room_types (name),
        payments (
          id,
          amount,
          status,
          proof_url,
          payment_method,
          created_at,
          description
        )
      `
      )
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
// PATCH: Update Booking Status (With Security Checks)
export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { id, status } = body;

    // 1. Fetch the booking first (We need the check_in_date)
    const { data: booking, error: fetchError } = await supabase
      .from("bookings")
      .select("check_in_date, status")
      .eq("id", id)
      .single();

    if (fetchError || !booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // 2. SECURITY CHECK: Prevent Early Check-In
    if (status === "checked_in") {
      const checkInDate = new Date(booking.check_in_date);
      const today = new Date();

      // Reset time to midnight for fair date comparison
      checkInDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      if (today < checkInDate) {
        return NextResponse.json(
          {
            error: `Cannot check in yet. Scheduled for ${booking.check_in_date}`,
          },
          { status: 400 }
        );
      }
    }

    // 3. Update the booking status
    const { data, error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: unknown) {
    let errorMessage = "An unexpected error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// POST: Admin creates a manual booking (Updated)
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const {
      room_type_id,
      check_in_date,
      check_out_date,
      guests_count,
      total_amount,
      special_requests,
    } = body;

    // 1. Get Current User
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 2. SECURITY: Check for Duplicate Booking by SAME User
    // Prevents accidental double-clicks or booking the same dates twice
    const { data: existingUserBookings } = await supabase
      .from("bookings")
      .select("id, room_type_id, status")
      .eq("guest_id", user.id)
      .neq("status", "cancelled") // Ignore cancelled
      .neq("status", "checked_out") // Ignore past trips
      // Overlap Check: (StartA < EndB) and (EndA > StartB)
      .lt("check_in_date", check_out_date)
      .gt("check_out_date", check_in_date);

    // If they already have a booking during this time...
    if (existingUserBookings && existingUserBookings.length > 0) {
      // Option A: Strict Mode (Block completely)
      // return NextResponse.json({ error: "You already have a booking for these dates." }, { status: 400 });

      // Option B: Smart Mode (Block only if it's the SAME Room Type)
      // This allows them to book 2 DIFFERENT rooms, but not the same one twice.
      const duplicateRoom = existingUserBookings.find(
        (b) => b.room_type_id === room_type_id
      );
      if (duplicateRoom) {
        return NextResponse.json(
          {
            error:
              "You already have a booking for this room type on these dates.",
          },
          { status: 409 } // 409 Conflict
        );
      }
    }

    // 3. AVAILABILITY CHECK (Your existing logic to check if room is full)
    const { count: conflictCount } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("room_type_id", room_type_id)
      .neq("status", "cancelled")
      .lt("check_in_date", check_out_date)
      .gt("check_out_date", check_in_date);

    const { data: roomType } = await supabase
      .from("room_types")
      .select("total_rooms")
      .eq("id", room_type_id)
      .single();

    if ((conflictCount || 0) >= (roomType?.total_rooms || 0)) {
      return NextResponse.json(
        { error: "Room is fully booked for these dates" },
        { status: 400 }
      );
    }

    // 4. Create Booking
    const { data, error } = await supabase
      .from("bookings")
      .insert({
        guest_id: user.id,
        room_type_id,
        check_in_date,
        check_out_date,
        guests_count,
        total_amount,
        special_requests,
        status: "pending",
        payment_status: "pending",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: unknown) {
    let message = "Internal Server Error";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
