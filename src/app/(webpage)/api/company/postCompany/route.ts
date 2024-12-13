import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Company from '@/models/Company';
import cloudinary from '@/lib/cloudinary';
import upload from '@/lib/multer'; // Adjust the path according to your project structure
import stream from 'stream';
import { promisify } from 'util';
import { getToken } from 'next-auth/jwt';
import User from '@/models/User';

const uploadFiles = promisify(upload.fields([{ name: 'image', maxCount: 1 }, { name: 'logo', maxCount: 1 }]));



export async function POST(req: NextRequest) {
    await connectToDatabase();
    const token=await getToken({req,secret:process.env.NEXTAUTH_SECRET});
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  //fatcg the user
  
      // Find the user by email
      const user = await User.findOne({ email:token.email});
  
      
      if (!user || user.role !== 'Admin' && user.role !== 'Consulter'&& user.role !== 'SuperAdmin') {
        return NextResponse.json({ error: 'Forbidden: Access is denied' }, { status: 404 });
      }
    try {
      // Handle form data
      const formData = await req.formData();

      const name = formData.get('name') as string | null;
      const address = formData.get('address') as string | null;
      const city = formData.get('city') as string | null;
      const governorate = formData.get('governorate') as string | null;
      const zipcode = formData.get('zipcode') as string | null;
      const phone = formData.get('phone') as string | null;
      const email = formData.get('email') as string | null;
      const facebook = formData.get('facebook') as string | null;
      const linkedin = formData.get('linkedin') as string | null;
      const instagram = formData.get('instagram') as string | null;
      const imageFile = formData.get('image') as File | null;
      const bannerFile = formData.get('banner') as File | null;
      const bannerFilecontacts = formData.get('bannercontacts') as File | null;
      if (!name||!address||!city||!governorate||!zipcode||!phone||!email ) {
        return NextResponse.json({ message: 'Name , Addres , City , Governorate , Zipcode And Phone is required' }, { status: 400 });
      }
  
      const existingCompany= await Company.find({ });

      if (existingCompany.length>0) {
        return NextResponse.json({ message: 'Company with this  already exists' }, { status: 400 });
      }
      
      let logoUrl = '';
  
      if (imageFile) {
        const imageBuffer = await imageFile.arrayBuffer();
        const bufferStream = new stream.PassThrough();
        bufferStream.end(Buffer.from(imageBuffer));
  
        const result = await new Promise<any>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'company',
              format: 'svg' 
             },
            (error, result) => {
              if (error) {
                return reject(error);
              }
              resolve(result);
            }
          );
  
          bufferStream.pipe(uploadStream);
        });
  
        logoUrl = result.secure_url; // Extract the secure_url from the result
      }
        
      let imageUrl = '';
      if (bannerFile) {
        const imageBuffer = await bannerFile.arrayBuffer();
        const bufferStream = new stream.PassThrough();
        bufferStream.end(Buffer.from(imageBuffer));
  
        const result = await new Promise<any>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'company',
              format: 'webp' 
             },
            (error, result) => {
              if (error) {
                return reject(error);
              }
              resolve(result);
            }
          );
  
          bufferStream.pipe(uploadStream);
        });
  
        imageUrl = result.secure_url; // Extract the secure_url from the result
      }
  
      let bannercontacts = '';
      if (bannerFilecontacts) {
        const imageBuffer = await bannerFilecontacts.arrayBuffer();
        const bufferStream = new stream.PassThrough();
        bufferStream.end(Buffer.from(imageBuffer));
  
        const result = await new Promise<any>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'company',
              format: 'webp' 
             },
            (error, result) => {
              if (error) {
                return reject(error);
              }
              resolve(result);
            }
          );
  
          bufferStream.pipe(uploadStream);
        });
  
        bannercontacts = result.secure_url; // Extract the secure_url from the result
      }
     

      const newCompany = new Company({ name, governorate,city,address,zipcode ,email,logoUrl,imageUrl,bannercontacts,phone,facebook,linkedin,instagram,user });
      await newCompany.save();
      return NextResponse.json(newCompany, { status: 201 });
    } catch (error) {
      return NextResponse.json({ message: 'Error creating Company' }, { status: 500 });
    }
  }