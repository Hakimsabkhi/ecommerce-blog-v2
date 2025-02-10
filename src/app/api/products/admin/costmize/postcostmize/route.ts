import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import CustomizeProduct from '@/models/CustomizeProduct';
import cloudinary from '@/lib/cloudinary';
import stream from 'stream';
import { getToken } from 'next-auth/jwt';
import User from '@/models/User';
interface UploadResult {
  secure_url: string;
  public_id: string;
  [key: string]: unknown; // Extend as needed for other Cloudinary properties
}

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
    const formData = await req.formData();
    const BestProductTitle = formData.get("BestProductTitle") as string ;
    const BestProductSubtitle = formData.get("BestProductSubtitle") as string ;
    const BestProductBannerFile = formData.get("BestProductBannerFile") as File ;
    const ProductCollectionTitle = formData.get("ProductCollectionTitle") as string ;
    const ProductCollectionSubtitle = formData.get("ProductCollectionSubtitle") as string ;
    const ProductCollectionBannerFile = formData.get("ProductCollectionBannerFile") as File ;
    const ProductPromotionTitle = formData.get("ProductPromotionTitle") as string ;
    const ProductPromotionSubtitle = formData.get("ProductPromotionSubtitle") as string ;
    const ProductPromotionBannerFile = formData.get("ProductPromotionBannerFile") as File ;


    if (!BestProductTitle||!ProductCollectionTitle||!ProductPromotionTitle ||!BestProductBannerFile||!ProductCollectionBannerFile||!ProductPromotionBannerFile) {
      return NextResponse.json({ message: 'title and image are required' }, { status: 400 });
    }

    const existingCustomizeProduct= await CustomizeProduct.find({});

    if (existingCustomizeProduct.length > 0) {
      return NextResponse.json({ message: 'A CustomizeProduct already exists' }, { status: 400 });
    }

     let BestProductBanner = '';
         let ProductCollectionBanner = '';
         let ProductPromotionBanner = '';
     
         // Helper function for Cloudinary upload
         const uploadToCloudinary = async (file: File, folder: string, format: string): Promise<UploadResult> => {
           const fileBuffer = await file.arrayBuffer();
           const bufferStream = new stream.PassThrough();
           bufferStream.end(Buffer.from(fileBuffer));
     
           return new Promise<UploadResult>((resolve, reject) => {
             const uploadStream = cloudinary.uploader.upload_stream(
               { folder, format },
               (error, result) => {
                 if (error) {
                   return reject(error);
                 }
                 resolve(result as UploadResult);
               }
             );
             bufferStream.pipe(uploadStream);
           });
         };
     
         if (BestProductBannerFile) {
          console.log(BestProductBannerFile)
           const result = await uploadToCloudinary(BestProductBannerFile, 'banner', 'webp');
           BestProductBanner = result.secure_url;
         }
     
         if ( ProductPromotionBannerFile) {
           const result = await uploadToCloudinary(ProductPromotionBannerFile, 'banner', 'webp');
           ProductPromotionBanner = result.secure_url;
         }
     
         if (ProductCollectionBannerFile) {
           const result = await uploadToCloudinary(ProductCollectionBannerFile, 'banner', 'webp');
           ProductCollectionBanner = result.secure_url;
         }

    const newCustomizeProduct= new CustomizeProduct({
      BestProductTitle,
      BestProductSubtitle,
      BestProductBanner,
      ProductCollectionTitle,
      ProductCollectionSubtitle,
      ProductCollectionBanner,
      ProductPromotionTitle,
      ProductPromotionSubtitle,
      ProductPromotionBanner,
      user,
    });

    await newCustomizeProduct.save(); 
    return NextResponse.json(/* newCustomizeProduct, */ { status: 201 });
  } catch (error) {
    console.error('Error creating CustomizeProduct:', error);
    return NextResponse.json({ message: 'Error creating CustomizeProduct' }, { status: 500 });
  }
}
