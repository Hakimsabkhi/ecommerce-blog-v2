import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import CustomizeProduct from '@/models/CustomizeProduct';

import { getToken } from 'next-auth/jwt';
import User from '@/models/User';


export async function POST(req: NextRequest) {
  await connectToDatabase();
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch the user
  const user = await User.findOne({ email: token.email });

  if (!user || (user.role !== 'Admin'  && user.role !== 'SuperAdmin')) {
    return NextResponse.json({ error: 'Forbidden: Access is denied' }, { status: 403 });
  }

  try {
    // Handle form data
    const {wbtitle,wbsubtitle,pctitle,pcsubtitle,cptitle,cpsubtitle} = await req.json();

   

    if (!wbtitle||!pctitle||!cptitle ) {
      return NextResponse.json({ message: 'title are required' }, { status: 400 });
    }

    const existingCustomizeProduct= await CustomizeProduct.find({});

    if (existingCustomizeProduct.length > 0) {
      return NextResponse.json({ message: 'A CustomizeProduct already exists' }, { status: 400 });
    }

    
    const newCustomizeProduct= new CustomizeProduct({
      wbtitle,
      wbsubtitle,
      pctitle,
      pcsubtitle,
      cptitle,
      cpsubtitle,
      user,
    });

    await newCustomizeProduct.save();
    return NextResponse.json(newCustomizeProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating CustomizeProduct:', error);
    return NextResponse.json({ message: 'Error creating CustomizeProduct' }, { status: 500 });
  }
}
