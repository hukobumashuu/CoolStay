import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { logAdminAction } from "@/lib/admin-logger";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Get Current Admin User
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { supply_id, type, quantity, notes } = await request.json();

    // 1. Get Current Stock
    const { data: item, error: fetchError } = await supabase
      .from("inventory_supplies")
      .select("current_stock, item_name")
      .eq("id", supply_id)
      .single();

    if (fetchError || !item) throw new Error("Item not found");

    const qty = Number(quantity);
    let newStock = item.current_stock;

    // 2. Calculate New Stock
    if (type === "restock") {
      newStock += qty;
    } else if (type === "usage") {
      newStock -= qty;
      if (newStock < 0)
        return NextResponse.json(
          { error: "Insufficient stock" },
          { status: 400 }
        );
    }

    // 3. Update Inventory Table
    const { error: updateError } = await supabase
      .from("inventory_supplies")
      .update({
        current_stock: newStock,
        last_restocked:
          type === "restock" ? new Date().toISOString() : undefined,
      })
      .eq("id", supply_id);

    if (updateError) throw updateError;

    // 4. Log usage in supply_usage_logs (for reports)
    if (type === "usage") {
      await supabase.from("supply_usage_logs").insert({
        supply_id,
        quantity_used: qty,
        used_by: user.email || "Admin",
        usage_date: new Date().toISOString(),
        notes: notes || "Daily usage",
      });
    }

    // ✅ 5. LOG ADMIN ACTION (for Audit Trail)
    await logAdminAction(
      supabase,
      user.id,
      type === "restock" ? "Restocked Inventory" : "Used Inventory",
      `Item: ${item.item_name} | Qty: ${qty}`
    );

    return NextResponse.json({ success: true, new_stock: newStock });
  } catch (error: unknown) {
    let message = "Internal Server Error";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
