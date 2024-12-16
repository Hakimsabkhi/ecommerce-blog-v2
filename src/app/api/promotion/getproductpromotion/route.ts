import { NextRequest, NextResponse } from "next/server"; // Use the new Next.js 13 API route types
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Brand from "@/models/Brand";

// Handler for GET requests
export async function GET(
    req: NextRequest
  ) {
    try {
      await dbConnect();
     
      await Category.find();
      await Brand.find();
      const product = await Product.find({discount: { $gt: 0 }  ,vadmin:"approve" })
        .populate("category")
        .populate("brand").exec();
  
      if (!product) {
        return new NextResponse(JSON.stringify({ message: "Product discount  not found" }), { status: 404});
      }
  
      return new NextResponse(JSON.stringify(product), { status: 200 });
  
    } catch (error) {
      console.error("Error fetching product discount:", error);
      return new NextResponse(JSON.stringify({ message: "Error fetching product discount" }), { status: 500 });
    }
  }