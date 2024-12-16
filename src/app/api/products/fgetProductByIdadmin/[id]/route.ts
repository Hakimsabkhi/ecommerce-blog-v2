import { NextRequest, NextResponse } from "next/server"; // Use Next.js 13 route handler types
import dbConnect from "@/lib/db"; // Database connection utility
import Product from "@/models/Product";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Connect to the database
    await dbConnect();

    const { id } = params;

    // Validate the `id`
    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { message: "Invalid or missing product ID" },
        { status: 400 }
      );
    }

    // Fetch the product by `slug`
    const product = await Product.findOne({ slug: id, vadmin: "not-approve" })
      .populate("category")
      .populate("brand")
      .exec();

    // If the product does not exist
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // Return the product data
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);

    // Handle `error` safely
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Internal server error", details: error.message },
        { status: 500 }
      );
    }

    // Fallback for unknown error types
    return NextResponse.json(
      { message: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
