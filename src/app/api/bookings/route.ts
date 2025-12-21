import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  // 1. Check User Session
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Fetch Bookings
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select(
      `
      *,
      room_types (
        name,
        image_url
      )
    `
    )
    .eq("guest_id", user.id)
    .order("check_in_date", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ bookings });
}
