// /app/api/search/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db'; // Connect to MongoDB
import Product from '@/models/Product'; // Your Product model
import Category from '@/models/Category';

export async function GET(req: NextRequest) {
  await dbConnect(); // Connect to the database
 await Category.find();
  // Extract search query from the request URL
  const { searchParams } = new URL(req.url);
  const searchTerm = searchParams.get('searchTerm') || '';

  try {
    // Search for products matching the searchTerm
    const products = await Product.find({
      name: { $regex: searchTerm, $options: 'i' }, vadmin: "approve" // Case-insensitive search
    }).populate("category name");

    // Return the search results as JSON
    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error searching for products:', error);
    return NextResponse.json(
      { message: 'Error retrieving products' },
      { status: 500 }
    );
  }
}
