import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { getToken } from "next-auth/jwt";
import User from "@/models/User";

export async function GET( req: NextRequest,context: { params: Promise<{ id: string }> }) {
  await dbConnect();

 
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch the user
  const user = await User.findOne({ email: token.email });
  if (!user || !(user.role === 'Admin' || user.role === 'Consulter' || user.role === 'SuperAdmin')) {
    return NextResponse.json({ error: 'Forbidden: Access is denied' }, { status: 403 });
  }
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
