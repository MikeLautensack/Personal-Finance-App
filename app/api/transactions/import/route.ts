import { NextRequest, NextResponse } from "next/server";
import { parseChaseCSV } from "@/lib/csv-parser";
import { getSupabaseClient } from "@/lib/data/utils";

// POST /api/transactions/import - Import transactions from Chase CSV
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const accountId = formData.get("account_id") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (!accountId) {
      return NextResponse.json(
        { error: "Account ID is required" },
        { status: 400 }
      );
    }

    const csvContent = await file.text();
    const { rows, format, errors: parseErrors } = parseChaseCSV(csvContent);

    if (format === "unknown") {
      return NextResponse.json(
        { error: parseErrors[0] || "Unrecognized CSV format" },
        { status: 400 }
      );
    }

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "No valid transactions found in CSV" },
        { status: 400 }
      );
    }

    const { client: supabase, userId } = await getSupabaseClient();

    // Build transaction rows for bulk insert
    const transactionRows = rows.map((row) => ({
      user_id: userId,
      account_id: accountId,
      type: row.type,
      amount: row.amount,
      currency: "USD",
      description: row.description,
      notes: row.chase_category
        ? `Chase category: ${row.chase_category}`
        : null,
      date: row.date,
      is_recurring: false,
      is_pending: false,
    }));

    // Insert in batches of 500 (Supabase limit)
    const BATCH_SIZE = 500;
    let totalInserted = 0;
    const insertErrors: string[] = [];

    for (let i = 0; i < transactionRows.length; i += BATCH_SIZE) {
      const batch = transactionRows.slice(i, i + BATCH_SIZE);

      const { data, error } = await supabase
        .from("transactions")
        .insert(batch)
        .select("id");

      if (error) {
        console.error(`Error inserting batch starting at ${i}:`, error);
        insertErrors.push(`Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${error.message}`);
      } else {
        totalInserted += data.length;
      }
    }

    return NextResponse.json({
      imported: totalInserted,
      total: rows.length,
      format,
      parseErrors: parseErrors.length > 0 ? parseErrors : undefined,
      insertErrors: insertErrors.length > 0 ? insertErrors : undefined,
    });
  } catch (error) {
    console.error("Error importing transactions:", error);
    return NextResponse.json(
      { error: "Failed to import transactions" },
      { status: 500 }
    );
  }
}
