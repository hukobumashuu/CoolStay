import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// FIX 1: Removed unused 'request' parameter
export async function GET() {
  try {
    const supabase = await createClient();

    // 1. Check Admin Status
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: adminProfile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (adminProfile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 2. Fetch Customers
    const { data: customers, error } = await supabase
      .from("users")
      .select("id, full_name, email, phone, created_at, role")
      .neq("role", "admin")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(customers);
  } catch (error: unknown) {
    // FIX 2: Handle 'unknown' type safely
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
