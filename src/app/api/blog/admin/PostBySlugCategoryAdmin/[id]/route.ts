import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import BlogCategory from '@/models/PostSections/PostCategory';
import BlogMainSection from '@/models/PostSections/PostMainSectionModel';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();

  try {
   
    const {id:blogcategory} = await params;

    if (!blogcategory || typeof blogcategory !== 'string') {
      return NextResponse.json(
        { message: 'blogcategory is required and should be a string' },
        { status: 400 }
      );
    }

    // Find the category by name const blog = await BlogMainSection.findOne({ slug: slugblog, vadmin: "not-approve" })

    const foundCategory = await BlogCategory.findOne({ slug: blogcategory});
  
    if (!foundCategory) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }
   
    // Find products by the category ID
    const blog = await BlogMainSection.find({ blogCategory: foundCategory._id ,vadmin: "not-approve"}).populate('blogCategory' , 'slug').exec();
   
    return NextResponse.json(blog, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
