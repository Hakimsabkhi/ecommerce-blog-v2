import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Category from '@/models/Category';
import Brand from '@/models/Brand';
import User from '@/models/User';
import Product from '@/models/Product';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();

  try {
   
    const category = params.id;


    if (!category || typeof category !== 'string') {
      return NextResponse.json(
        { message: 'Category name is required and should be a string' },
        { status: 400 }
      );
    }

    // Find the category by name
    const foundCategory = await Category.findOne({ slug: category ,vadmin: "approve"})

    if (!foundCategory) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }
    await User.find({});
    await Brand.find({});
    // Find products by the category ID
    const products = await Product.find({ category: foundCategory._id , vadmin:"approve"}).populate('category brand user').exec();
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
