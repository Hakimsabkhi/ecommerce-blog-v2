import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";

export async function GET(context: { params: Promise<{ id: string }> }) {
  await dbConnect();

  try {
    const { id: categorySlug } = await context.params;

    // Find the category by slug with "not-approve" status
    const foundCategory = await Category.findOne({
      slug: categorySlug,
      vadmin: "not-approve",
    }).exec();

    if (!foundCategory) {
      return NextResponse.json(
        { message: "No Category found with vadmin not-approve" },
        { status: 202 }
      );
    }

    // Find products by the category ID
    const products = await Product.find({
      category: foundCategory._id,
      vadmin: "not-approve",
    })
      .populate("category brand user")
      .exec();
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
