import { NextRequest, NextResponse } from "next/server";
import {
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} from "@/lib/data";
import { UpdateTransactionInput } from "@/lib/types";

type RouteParams = {
  params: Promise<{ id: string }>;
};

// GET /api/transactions/[id] - Get a single transaction
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const transaction = await getTransactionById(id);

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(transaction);
  } catch (error) {
    console.error("Error fetching transaction:", error);
    return NextResponse.json(
      { error: "Failed to fetch transaction" },
      { status: 500 }
    );
  }
}

// PUT /api/transactions/[id] - Update a transaction
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate type if provided
    if (body.type && !["expense", "income", "transfer"].includes(body.type)) {
      return NextResponse.json(
        { error: "Invalid transaction type" },
        { status: 400 }
      );
    }

    // Validate amount if provided
    if (
      body.amount !== undefined &&
      (typeof body.amount !== "number" || body.amount <= 0)
    ) {
      return NextResponse.json(
        { error: "Amount must be a positive number" },
        { status: 400 }
      );
    }

    const input: UpdateTransactionInput = {
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

    const transaction = await updateTransaction(id, input);

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(transaction);
  } catch (error) {
    console.error("Error updating transaction:", error);
    return NextResponse.json(
      { error: "Failed to update transaction" },
      { status: 500 }
    );
  }
}

// PATCH /api/transactions/[id] - Partial update a transaction
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  // PATCH behaves the same as PUT for this API
  return PUT(request, { params });
}

// DELETE /api/transactions/[id] - Delete a transaction
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const success = await deleteTransaction(id);

    if (!success) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return NextResponse.json(
      { error: "Failed to delete transaction" },
      { status: 500 }
    );
  }
}
