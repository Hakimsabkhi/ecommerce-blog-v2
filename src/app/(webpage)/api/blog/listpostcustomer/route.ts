import { NextResponse, NextRequest } from 'next/server';
import connectToDatabase from '@/lib/db';
import PostMainSection from '@/models/PostSections/PostMainSectionModel';
import User from '@/models/User';
import BlogCategory from '@/models/PostSections/BlogCategory';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    await User.find({});
    await BlogCategory.find({});
    const Posts = await PostMainSection.find({ vadmin: 'approve' })
      .populate('blogCategory')
      .populate('user', '_id username')
      .exec();

    return NextResponse.json(Posts);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error fetching titles:', error.message);
      return NextResponse.json(
        { error: 'Failed to fetch titles', details: error.message },
        { status: 500 }
      );
    } else {
      console.error('Unknown error occurred:', error);
      return NextResponse.json(
        { error: 'An unknown error occurred' },
        { status: 500 }
      );
    }
  }
}
