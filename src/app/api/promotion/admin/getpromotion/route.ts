import {NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Promotion from '@/models/Promotion';




export async function GET() {
  try {
    await connectToDatabase(); // Ensure the database connection is established

    // Fetch all categories but only return the name and imageUrl fields
    const promotion = await Promotion.findOne({}).exec(); // Only select the 'name' and 'imageUrl' fields
   
    // Return the fetched category names and image URLs
    return NextResponse.json(promotion, { status: 200 });
  } catch (error) {
    console.error('Error fetching Company:', error);
    return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
  }
}
  