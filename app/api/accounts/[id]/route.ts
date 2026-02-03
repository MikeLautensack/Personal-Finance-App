import { NextRequest, NextResponse } from "next/server";
import { getAccountById, updateAccount, deleteAccount } from "@/lib/data";
import { UpdateAccountInput } from "@/lib/types";

type RouteParams = {
  params: Promise<{ id: string }>;
};

// GET /api/accounts/[id] - Get a single account
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const account = await getAccountById(id);

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    return NextResponse.json(account);
  } catch (error) {
    console.error("Error fetching account:", error);
    return NextResponse.json(
      { error: "Failed to fetch account" },
      { status: 500 }
    );
  }
}

// PUT /api/accounts/[id] - Update an account
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate type if provided
    if (body.type) {
      const validTypes = [
        "checking",
        "savings",
        "credit_card",
        "investment",
        "loan",
        "cash",
        "other",
      ];
      if (!validTypes.includes(body.type)) {
        return NextResponse.json(
          { error: "Invalid account type" },
          { status: 400 }
        );
      }
    }

    const input: UpdateAccountInput = {
      name: body.name,
      type: body.type,
      balance: body.balance,
      institution: body.institution,
      account_number: body.account_number,
      color: body.color,
      icon: body.icon,
      is_active: body.is_active,
      include_in_net_worth: body.include_in_net_worth,
    };

    const account = await updateAccount(id, input);

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    return NextResponse.json(account);
  } catch (error) {
    console.error("Error updating account:", error);
    return NextResponse.json(
      { error: "Failed to update account" },
      { status: 500 }
    );
  }
}

// PATCH /api/accounts/[id] - Partial update an account
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  return PUT(request, { params });
}

// DELETE /api/accounts/[id] - Delete an account
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const success = await deleteAccount(id);

    if (!success) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}
