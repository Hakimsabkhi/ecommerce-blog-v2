import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import CustomizeProduct from "@/models/CustomizeProduct";
import { getToken } from "next-auth/jwt";
import User from "@/models/User";
import cloudinary from "@/lib/cloudinary";
import stream from "stream";
interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  [key: string]: string; // Assuming additional properties are strings
}


export async function PUT(req: NextRequest) {
  await connectToDatabase();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findOne({ email: token.email });
  if (
    !user ||
    (user.role !== "Admin" &&
      
      user.role !== "SuperAdmin")
  ) {
    return NextResponse.json(
      { error: "Forbidden: Access is denied" },
      { status: 403 }
    );
  }

  try {
    const formData = await req.formData();
    const id = formData.get("id") as string;

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const existingCustomizeProduct= await CustomizeProduct.findById(id);
    if (!existingCustomizeProduct) {
      return NextResponse.json(
        { message: "existingCustomizeProduct not found" },
        { status: 404 }
      );
    }
    const BestProductTitle = formData.get("BestProductTitle") as string ;
    const BestProductSubtitle = formData.get("BestProductSubtitle") as string ;
    const BestProductBannerFile = formData.get("BestProductBannerFile") as File ;
    const ProductCollectionTitle = formData.get("ProductCollectionTitle") as string ;
    const ProductCollectionSubtitle = formData.get("ProductCollectionSubtitle") as string ;
    const ProductCollectionBannerFile = formData.get("ProductCollectionBannerFile") as File ;
    const ProductPromotionTitle = formData.get("ProductPromotionTitle") as string ;
    const ProductPromotionSubtitle = formData.get("ProductPromotionSubtitle") as string ;
    const ProductPromotionBannerFile = formData.get("ProductPromotionBannerFile") as File ;
    
   


 


    // Update company with new values if provided
    if (BestProductTitle !== null) existingCustomizeProduct.BestProductTitle = BestProductTitle;
    if (BestProductSubtitle !== null) existingCustomizeProduct.BestProductSubtitle = BestProductSubtitle;
    if (ProductCollectionTitle !== null) existingCustomizeProduct.ProductCollectionTitle = ProductCollectionTitle;
    if (ProductCollectionSubtitle !== null) existingCustomizeProduct.ProductCollectionSubtitle = ProductCollectionSubtitle;
    if (ProductPromotionTitle !== null) existingCustomizeProduct.ProductPromotionTitle = ProductPromotionTitle;
    if (ProductPromotionSubtitle !== null) existingCustomizeProduct.ProductPromotionSubtitle = ProductPromotionSubtitle;
         let BestProductBanner = existingCustomizeProduct.BestProductBanner;
        let ProductPromotionBanner = existingCustomizeProduct.ProductPromotionBanner;
        let ProductCollectionBanner = existingCustomizeProduct.ProductCollectionBanner;

        // Reusable function for Cloudinary upload
        const uploadToCloudinary = async (file: File, folder: string, format: string): Promise<string> => {
          const buffer = Buffer.from(await file.arrayBuffer());
          const bufferStream = new stream.PassThrough();
          bufferStream.end(buffer);
    
          const result: CloudinaryUploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { folder, format },
              (error, result) => {
                if (error) return reject(new Error(`Upload failed: ${error.message}`));
                resolve(result as CloudinaryUploadResult);
              }
            );
            bufferStream.pipe(uploadStream);
          });
    
          return result.secure_url;
        };
    
        if (BestProductBannerFile) {
          if (existingCustomizeProduct.BestProductBanner) {
            const publicId = extractPublicId(existingCustomizeProduct.BestProductBanner);
            if (publicId) await cloudinary.uploader.destroy(publicId);
          }
          BestProductBanner = await uploadToCloudinary(BestProductBannerFile, "banner", "webp");
          existingCustomizeProduct.BestProductBanner=BestProductBanner;
        }
    
        if (ProductPromotionBannerFile) {
          if (existingCustomizeProduct.ProductPromotionBanner) {
            const publicId = extractPublicId(existingCustomizeProduct.ProductPromotionBanner);
            if (publicId) await cloudinary.uploader.destroy(publicId);
          }
          ProductPromotionBanner = await uploadToCloudinary(ProductPromotionBannerFile, "banner", "webp");
          existingCustomizeProduct.ProductPromotionBanner=ProductPromotionBanner;
        }
    
        if (ProductCollectionBannerFile) {
          if (existingCustomizeProduct.ProductCollectionBanner) {
            const publicId = extractPublicId(existingCustomizeProduct.ProductCollectionBanner);
            if (publicId) await cloudinary.uploader.destroy(publicId);
          }
          ProductCollectionBanner = await uploadToCloudinary(ProductCollectionBannerFile, "banner", "webp");
          existingCustomizeProduct.ProductCollectionBanner=ProductCollectionBanner;
        }
    
    

    existingCustomizeProduct.user = user;
    existingCustomizeProduct.updatedAt = new Date();

    await existingCustomizeProduct.save();
    return NextResponse.json(existingCustomizeProduct, { status: 200 });
  } catch (error) {
    console.error("Error updating existingCustomizeProduct:", error);
    return NextResponse.json(
      {
        message: "Error updating existingCustomizeProduct",
        error: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}

function extractPublicId(url: string): string {
  const matches = url.match(/\/([^\/]+)\.(jpg|jpeg|png|gif|webp|svg)$/);
  if (matches) {
    return matches[1];
  }
  const segments = url.split("/");
  const lastSegment = segments.pop();
  return lastSegment ? lastSegment.split(".")[0] : "";
}
