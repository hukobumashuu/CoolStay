import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET: Fetch all bookings (Admin View)
export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase
      .from("bookings")
      .select(
        `
        *,
        users (full_name, email, phone),
        room_types (name)
      `
      )
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: unknown) {
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

// POST: Admin creates a manual booking (Walk-in)
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      roomId,
      checkIn,
      checkOut,
      guests,
      paymentStatus, // 'paid' (if cash) or 'pending'
    } = body;

    // 1. AVAILABILITY CHECK
    // Check if room is actually free for these dates
    const { count: conflictCount } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("room_type_id", roomId)
      .neq("status", "cancelled")
      .lt("check_in_date", checkOut)
      .gt("check_out_date", checkIn);

    const { data: roomType } = await supabase
      .from("room_types")
      .select("total_rooms, base_price")
      .eq("id", roomId)
      .single();

    if ((conflictCount || 0) >= (roomType?.total_rooms || 0)) {
      return NextResponse.json(
        { error: "Room is fully booked for these dates" },
        { status: 400 }
      );
    }

    // 2. FIND OR CREATE USER
    // We search by email to see if they are a returning guest
    let userId;

    // Search existing user
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      userId = existingUser.id;
    } else {
      // Create new "Ghost" User
      // We use the Admin Auth API to create a user without sending a confirmation email immediately if possible,
      // or we just use standard signUp. Note: On server side, strictly we should use service_role for this,
      // but for now let's use the standard flow or a direct insert if you have triggers.
      // BETTER APPROACH for this setup: Use signUp with a temp password.
      const tempPassword = "WalkInGuest123!";
      const { data: newUser, error: createError } = await supabase.auth.signUp({
        email,
        password: tempPassword,
        options: {
          data: {
            full_name: `${firstName} ${lastName}`,
            phone: phone,
            role: "user",
          },
        },
      });

      if (createError)
        throw new Error(
          "Could not create guest account: " + createError.message
        );
      userId = newUser.user?.id;
    }

    if (!userId) throw new Error("Failed to resolve Guest ID");

    // 3. CALCULATE PRICE
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights =
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) || 1; // Default to 1 if day tour
    const totalAmount = (roomType?.base_price || 0) * nights;

    // 4. CREATE BOOKING
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        guest_id: userId,
        room_type_id: roomId,
        check_in_date: checkIn,
        check_out_date: checkOut,
        guests_count: guests,
        total_amount: totalAmount,
        status: "confirmed", // Walk-ins are usually confirmed immediately
        payment_status: paymentStatus || "pending",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (bookingError) throw bookingError;

    return NextResponse.json(booking);
  } catch (error: unknown) {
    // Changed 'any' to 'unknown'
    let message = "Internal Error";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
