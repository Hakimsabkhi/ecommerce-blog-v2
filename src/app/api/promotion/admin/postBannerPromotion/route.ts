import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Promotion from '@/models/Promotion';
import cloudinary from '@/lib/cloudinary';
import stream from 'stream';
import { getToken } from 'next-auth/jwt';
import User from '@/models/User';

interface CloudinaryUploadResult {
  secure_url: string;
}

export async function POST(req: NextRequest) {
  await connectToDatabase();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch the user
  const user = await User.findOne({ email: token.email });
  if (!user || (user.role !== 'Admin' && user.role !== 'Consulter' && user.role !== 'SuperAdmin')) {
    return NextResponse.json({ error: 'Forbidden: Access is denied' }, { status: 403 });
  }

  try {
    // Handle form data
    const formData = await req.formData();
    const name = formData.get('name') as string | null;
    const bannerFile = formData.get('banner') as File | null;

    if (!name) {
      return NextResponse.json({ message: 'Name is required' }, { status: 400 });
    }

    const existingPromotion = await Promotion.find({});
    if (existingPromotion.length > 0) {
      return NextResponse.json({ message: 'Promotion already exists' }, { status: 400 });
    }

    let imageUrl = '';
    if (bannerFile) {
      const imageBuffer = await bannerFile.arrayBuffer();
      const bufferStream = new stream.PassThrough();
      bufferStream.end(Buffer.from(imageBuffer));

      const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'Promotion',
            format: 'webp',
          },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result as CloudinaryUploadResult);
          }
        );

        bufferStream.pipe(uploadStream);
      });

      imageUrl = result.secure_url; // Extract the secure_url from the result
    }

    const newPromotion = new Promotion({ name, bannerUrl: imageUrl, user });
    await newPromotion.save();

    return NextResponse.json(newPromotion, { status: 201 });
  } catch (error) {
    console.error('Error creating Promotion:', error);
    return NextResponse.json({ message: 'Error creating Promotion' }, { status: 500 });
  }
}
