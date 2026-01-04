import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("inventory_supplies")
      .select("*")
      .order("category", { ascending: true })
      .order("item_name", { ascending: true });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: unknown) {
    let message = "Failed to fetch inventory";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const { item_name, category, min_stock, unit, cost } = body;

    const { data, error } = await supabase
      .from("inventory_supplies")
      .insert({
        item_name,
        category,
        minimum_stock: min_stock || 10,
        current_stock: 0, // Start at 0
        unit: unit || "pcs",
        cost_per_unit: cost || 0,
        last_restocked: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: unknown) {
    let message = "Failed to add item";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
