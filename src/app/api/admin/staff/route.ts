import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { SupabaseClient } from "@supabase/supabase-js";

// Helper for security check with proper typing
async function checkAdmin(supabase: SupabaseClient) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  // Use our safe is_admin RPC function if available
  const { data: isAdmin } = await supabase.rpc("is_admin");
  return isAdmin;
}

// GET: Fetch all staff
export async function GET() {
  const supabase = await createClient();

  if (!(await checkAdmin(supabase))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: staff, error } = await supabase
    .from("staff")
    .select("*")
    .order("full_name", { ascending: true });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(staff);
}

// POST: Add new staff member
export async function POST(request: Request) {
  const supabase = await createClient();

  if (!(await checkAdmin(supabase))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // ✅ Include user_id in the insert
    const { data, error } = await supabase
      .from("staff")
      .insert([
        {
          user_id: body.user_id || null, // <--- Added this link
          employee_id: body.employee_id,
          full_name: body.full_name,
          email: body.email,
          phone: body.phone,
          position: body.position,
          department: body.department,
          status: body.status || "active",
          hire_date: body.hire_date || new Date().toISOString(),
          salary: body.salary || 0,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PATCH: Update staff details
export async function PATCH(request: Request) {
  const supabase = await createClient();

  if (!(await checkAdmin(supabase))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    const { data, error } = await supabase
      .from("staff")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE: Remove staff member
export async function DELETE(request: Request) {
  const supabase = await createClient();

  if (!(await checkAdmin(supabase))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id)
      return NextResponse.json({ error: "ID required" }, { status: 400 });

    const { error } = await supabase.from("staff").delete().eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
