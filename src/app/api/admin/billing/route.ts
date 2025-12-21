import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // 1. Check User (Security)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error("Billing API Auth Error:", authError);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Fetch Payments (With Error Logging)
    console.log("Fetching payments from DB...");
    const { data: payments, error: paymentError } = await supabase
      .from("payments")
      .select("*")
      .order("created_at", { ascending: false });

    if (paymentError) {
      console.error("Supabase Payment Error:", paymentError.message);
      return NextResponse.json(
        { error: paymentError.message },
        { status: 500 }
      );
    }

    // SAFETY CHECK: Ensure payments is an array
    const safePayments = payments || [];
    console.log(`Found ${safePayments.length} payments.`);

    // 3. Get User IDs (Safe extraction)
    const userIds = Array.from(
      new Set(safePayments.map((p) => p.user_id).filter(Boolean))
    );

    // 4. Fetch User Names
    const usersMap: Record<string, string> = {};

    if (userIds.length > 0) {
      const { data: users, error: userError } = await supabase
        .from("users")
        .select("id, full_name")
        .in("id", userIds);

      if (userError) {
        console.error("Supabase User Fetch Error:", userError.message);
        // We don't crash here, just continue with unknown guests
      } else if (users) {
        users.forEach((u) => {
          usersMap[u.id] = u.full_name;
        });
      }
    }

    // 5. Format Data
    const formattedPayments = safePayments.map((p) => ({
      id: p.id,
      guest: usersMap[p.user_id] || "Unknown Guest",
      amount: p.amount ? `₱ ${Number(p.amount).toLocaleString()}` : "₱ 0.00",
      status:
        p.status === "completed" || p.status === "paid" ? "Paid" : "Pending",
      date: p.created_at
        ? new Date(p.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "N/A",
    }));

    return NextResponse.json(formattedPayments);
  } catch (err: unknown) {
    // Catch unexpected crashes safely
    console.error("Billing API Critical Crash:", err);

    let errorMessage = "Unknown Error";
    if (err instanceof Error) {
      errorMessage = err.message;
    }

    return NextResponse.json(
      { error: "Internal Server Error", details: errorMessage },
      { status: 500 }
    );
  }
}
