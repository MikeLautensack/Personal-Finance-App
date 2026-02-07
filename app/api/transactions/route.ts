import { NextRequest, NextResponse } from "next/server";
import {
  getTransactions,
  getTransactionsPaginated,
  createTransaction,
} from "@/lib/data";
import { CreateTransactionInput, TransactionSearchParams } from "@/lib/types";

// GET /api/transactions - List transactions with filtering and optional pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const params: TransactionSearchParams = {
      type:
        (searchParams.get("type") as TransactionSearchParams["type"]) ||
        undefined,
      month: searchParams.get("month") || undefined,
      search: searchParams.get("search") || undefined,
      account_id: searchParams.get("account_id") || undefined,
      category_id: searchParams.get("category_id") || undefined,
      sort: (searchParams.get("sort") as "date" | "amount") || undefined,
      order: (searchParams.get("order") as "asc" | "desc") || undefined,
    };

    // If cursor param is present, use paginated response
    const cursorParam = searchParams.get("cursor");
    const limitParam = searchParams.get("limit");

    if (cursorParam !== null || limitParam !== null) {
      const cursor = cursorParam ? parseInt(cursorParam, 10) : 0;
      const limit = limitParam ? parseInt(limitParam, 10) : 30;

      const result = await getTransactionsPaginated(params, cursor, limit);
      return NextResponse.json(result);
    }

    // Default: return all transactions (backwards compatible)
    const transactions = await getTransactions(params);
    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

// POST /api/transactions - Create a new transaction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "account_id",
      "type",
      "amount",
      "description",
      "date",
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate type
    if (!["expense", "income", "transfer"].includes(body.type)) {
      return NextResponse.json(
        { error: "Invalid transaction type" },
        { status: 400 }
      );
    }

    // Validate amount
    if (typeof body.amount !== "number" || body.amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be a positive number" },
        { status: 400 }
      );
    }

    // Validate transfer has destination account
    if (body.type === "transfer" && !body.transfer_account_id) {
      return NextResponse.json(
        { error: "Transfer requires a destination account" },
        { status: 400 }
      );
    }

    const input: CreateTransactionInput = {
      account_id: body.account_id,
      category_id: body.category_id,
      type: body.type,
      amount: body.amount,
      description: body.description,
      notes: body.notes,
      date: body.date,
      transfer_account_id: body.transfer_account_id,
      tags: body.tags,
      location: body.location,
      is_pending: body.is_pending,
    };

    const transaction = await createTransaction(input);
    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}
