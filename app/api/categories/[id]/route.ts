import { NextRequest, NextResponse } from "next/server";
import { getCategoryById, updateCategory, deleteCategory } from "@/lib/data";
import { UpdateCategoryInput } from "@/lib/types";

type RouteParams = {
  params: Promise<{ id: string }>;
};

// GET /api/categories/[id] - Get a single category
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const category = await getCategoryById(id);

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

// PUT /api/categories/[id] - Update a category
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const input: UpdateCategoryInput = {
      name: body.name,
      icon: body.icon,
      color: body.color,
      parent_id: body.parent_id,
      sort_order: body.sort_order,
    };

    const category = await updateCategory(id, input);

    if (!category) {
      return NextResponse.json(
        {
          error:
            "Category not found or cannot be updated (system categories are read-only)",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

// PATCH /api/categories/[id] - Partial update a category
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  return PUT(request, { params });
}

// DELETE /api/categories/[id] - Delete a category
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const success = await deleteCategory(id);

    if (!success) {
      return NextResponse.json(
        {
          error:
            "Category not found or cannot be deleted (system categories are protected)",
        },
        { status: 404 }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
