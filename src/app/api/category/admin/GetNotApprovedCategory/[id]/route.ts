import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";

export async function GET(
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Ensure database connection
    await dbConnect();

    // Destructure the category ID from params
    const { id: categorySlug } = await context.params;

    // Find the category by slug with "not-approve" status
    const foundCategory = await Category.findOne({
      slug: categorySlug,
      vadmin: "not-approve",
    }).exec();

    if (!foundCategory) {
      return NextResponse.json({ message: 'No Category found with vadmin not-approve' }, { status: 202 });
    }

    return NextResponse.json(foundCategory, { status: 200 });
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
