import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: reviews, error } = await supabase
    .from("reviews")
    .select(
      `
      *,
      users ( full_name ),
      Rooms ( name ),
      Cottages ( name )
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Helper to determine the target name (Room OR Cottage)
  const formattedReviews = reviews.map((r) => ({
    id: r.id,
    guestName: r.users?.full_name || "Anonymous",
    targetName: r.Rooms?.name || r.Cottages?.name || "General Review",
    rating: r.rating,
    comment: r.comment,
    date: new Date(r.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    status: "Unread", // Default status since we don't have a status column in reviews yet
  }));

  return NextResponse.json(formattedReviews);
}
