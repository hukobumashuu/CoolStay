import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !user) {
      return NextResponse.json(
        { error: authError?.message || "Invalid login credentials" },
        { status: 401 }
      );
    }

    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    const redirectUrl =
      profile?.role === "admin" ? "/admin/dashboard" : "/dashboard";

    return NextResponse.json({ redirectUrl });
  } catch (error) {
    // FIX: We now use the variable by logging it
    console.error("Login API Error:", error);

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
