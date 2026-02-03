import { NextRequest, NextResponse } from "next/server";
import { getCategories, createCategory } from "@/lib/data";
import { CreateCategoryInput, CategorySearchParams } from "@/lib/types";

// GET /api/categories - List categories with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const params: CategorySearchParams = {
      type: (searchParams.get("type") as "expense" | "income") || undefined,
      search: searchParams.get("search") || undefined,
    };

    const categories = await getCategories(params);
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create a new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    if (!body.type) {
      return NextResponse.json(
        { error: "Category type is required" },
        { status: 400 }
      );
    }

    // Validate type
    if (!["expense", "income"].includes(body.type)) {
      return NextResponse.json(
        { error: "Invalid category type. Must be 'expense' or 'income'" },
        { status: 400 }
      );
    }

    const input: CreateCategoryInput = {
      name: body.name,
      type: body.type,
      icon: body.icon,
      color: body.color,
      parent_id: body.parent_id,
    };

    const category = await createCategory(input);
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
