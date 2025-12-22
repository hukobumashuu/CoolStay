import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = await createClient();

    // Insert into 'event_inquiries' table
    const { error } = await supabase.from("event_inquiries").insert({
      full_name: body.fullName,
      email: body.email,
      phone: body.phone,
      event_type: body.eventType,
      preferred_date: body.date,
      guest_count: body.guestCount,
      message: body.message,
      status: "new", // Default status for admin to track
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Event inquiry error:", error);
    return NextResponse.json(
      { error: "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}
