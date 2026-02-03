import { NextRequest, NextResponse } from "next/server";
import { getAccounts, createAccount } from "@/lib/data";
import { CreateAccountInput, AccountSearchParams } from "@/lib/types";

// GET /api/accounts - List accounts with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const params: AccountSearchParams = {
      type:
        (searchParams.get("type") as AccountSearchParams["type"]) || undefined,
      is_active:
        (searchParams.get("is_active") as "true" | "false") || undefined,
      sort:
        (searchParams.get("sort") as "name" | "balance" | "type") || undefined,
      order: (searchParams.get("order") as "asc" | "desc") || undefined,
    };

    const accounts = await getAccounts(params);
    return NextResponse.json(accounts);
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return NextResponse.json(
      { error: "Failed to fetch accounts" },
      { status: 500 }
    );
  }
}

// POST /api/accounts - Create a new account
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: "Account name is required" },
        { status: 400 }
      );
    }

    if (!body.type) {
      return NextResponse.json(
        { error: "Account type is required" },
        { status: 400 }
      );
    }

    // Validate type
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

    const input: CreateAccountInput = {
      name: body.name,
      type: body.type,
      balance: body.balance,
      currency: body.currency,
      institution: body.institution,
      account_number: body.account_number,
      color: body.color,
      icon: body.icon,
    };

    const account = await createAccount(input);
    return NextResponse.json(account, { status: 201 });
  } catch (error) {
    console.error("Error creating account:", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}
