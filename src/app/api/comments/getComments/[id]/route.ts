import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import comments from '@/models/PostSections/CommentPost';
import User from '@/models/User';
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {

    // Connect to the database
    await connectToDatabase();
   
  
    try {
      // Handle form data
      
  
  
    if (!params.id) {
        return NextResponse.json({ message: 'blog is required' }, { status: 400 });
      }
  await User.find();
    
      
  const comment = await comments
  .find({ Post: params.id })
  .populate('user', 'username')  // Correctly specifying the field to populate
  .sort({ createdAt: -1 })
  .exec();

  
     
      return NextResponse.json( comment, { status: 201 });
    } catch (error) {
      return NextResponse.json({ message: 'Error creating category' }, { status: 500 });
    }
  }
  