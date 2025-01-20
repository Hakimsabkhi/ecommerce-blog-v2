import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Promotion from "@/models/Promotion"; // Import Brand model
import cloudinary from "@/lib/cloudinary";
import stream from "stream";
import { getToken } from "next-auth/jwt";
import User from "@/models/User";

interface CloudinaryUploadResult {
  secure_url: string;
}

// Utility function to extract public ID from the image URL
const extractPublicId = (url: string): string => {
    const matches = url.match(/\/([^\/]+)\.(jpg|jpeg|png|gif|webp)$/);
    if (matches) {
      return matches[1];
    }
    const segments = url.split("/");
    const lastSegment = segments.pop();
    return lastSegment ? lastSegment.split(".")[0] : "";
  };
export async function PUT( req: NextRequest ){
    await connectToDatabase();
    const token=await getToken({req,secret:process.env.NEXTAUTH_SECRET});
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  //fatcg the user
  
      // Find the user by email
      const user = await User.findOne({ email:token.email});
  
      
      if (!user || user.role !== 'Admin' && user.role !== 'SuperAdmin') {
        return NextResponse.json({ error: 'Forbidden: Access is denied' }, { status: 404 });
      }
    try {
      // Handle form data
      const formData = await req.formData();
      const id =formData.get('id') as string ;

      const name = formData.get('name') as string | null;
      const bannerFile = formData.get('banner') as File | null;
  
      if (!id) {
        return NextResponse.json(
          { message: "id is required" },
          { status: 400 }
        );
      }
  
      const existingPromotion= await Promotion.findById(id);
      if (!existingPromotion) {
        return NextResponse.json({ message: "Promotion not found" }, { status: 404 });
      }
  

   
  
     
  
      let imageUrl = existingPromotion.bannerUrl;
   
  
      // Handle image file upload and deletion of the old image
      if (bannerFile) {
        if (existingPromotion.bannerUrl) {
          const publicId = extractPublicId(existingPromotion.bannerUrl);
          if (publicId) {
            await cloudinary.uploader.destroy(`Promotion/${publicId}`);
            
          }
        }
  
        const imageBuffer = Buffer.from(await bannerFile.arrayBuffer());
        const imageStream = new stream.PassThrough();
        imageStream.end(imageBuffer);
  
        const { secure_url: newImageUrl } = await new Promise<CloudinaryUploadResult>(
          (resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                folder: "Promotion",
                format: "webp",
              },
              (error, result) => {
                if (error) return reject(new Error(`Image upload failed: ${error.message}`));
                resolve(result as CloudinaryUploadResult); // Ensure the result is typed correctly
              }
            );
            imageStream.pipe(uploadStream);
          }
        );
  
        imageUrl = newImageUrl; // Update imageUrl with the uploaded URL
        existingPromotion.bannerUrl = imageUrl;
      }
     
   
    
      // Update company with new values if provided
      if (name !== null) existingPromotion.name = name;
      
     
      existingPromotion.user = user;
      existingPromotion.updatedAt = new Date();
      await existingPromotion.save(); // Save the updated brand
      return NextResponse.json(existingPromotion, { status: 200 });
    } catch (error) {
      console.error(error); // Log error for debugging
      return NextResponse.json(
        { message: "Error updating Promotion", error },
        { status: 500 }
      );
    }
  }
  