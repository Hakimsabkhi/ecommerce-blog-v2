import connectToDatabase from "@/lib/db";
import Review from "@/models/Review";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
// GET function to handle GET requests
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) {
    await connectToDatabase();
  
    const { id } = await params;
  
    if (!id) {
      return NextResponse.json(
        { message: "Invalid or missing brand ID" },
        { status: 400 }
      );
    }
  
    try {
      await User.find({});

      const review = await Review.findById(id).populate('user', '_id username email').exec();
    
      if (!review) {
        return NextResponse.json({ message: "Review not found" }, { status: 404 });
      }
      return NextResponse.json(review, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { message: "Error fetching review" },
        { status: 500 }
      );
    }
  }
  