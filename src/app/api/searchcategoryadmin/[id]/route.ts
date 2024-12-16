import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Category from '@/models/Category';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Ensure database connection
    await dbConnect();

    // Await the params object
    const { id: category } = await context.params;

    // Validate and ensure `category` is available
    if (!category || typeof category !== 'string') {
      return NextResponse.json(
        { message: 'Category name is required and should be a string' },
        { status: 400 }
      );
    }

    // Find the category by slug with "not-approve" status
    const foundCategory = await Category.findOne({ slug: category, vadmin: 'not-approve' }).exec();

    if (!foundCategory) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json(foundCategory, { status: 200 });
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
