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
