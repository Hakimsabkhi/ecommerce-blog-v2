import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Category from "@/models/Category";

import cloudinary from "@/lib/cloudinary";

import stream from "stream";
import User from "@/models/User";
import { getToken } from "next-auth/jwt";
function slugifyCategoryName(name: string): string {
  return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").trim(); // Remove any special characters
}

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
  ) {
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
      const name = formData.get("name") as string;
      
      const imageFile = formData.get("image") as File | null;
      const logoFile = formData.get("logo") as File | null;
      const bannerFile = formData.get("banner") as File | null;
      const id = params.id; // Get ID from params
  
      if (!id) {
        return NextResponse.json(
          { message: "ID  are required" },
          { status: 400 }
        );
      }
  
      const existingCategory = await Category.findById(id);
      if (!existingCategory) {
        return NextResponse.json(
          { message: "Category not found" },
          { status: 404 }
        );
      }
  
      if (existingCategory.name !== name) {
        const duplicateCategory = await Category.findOne({ name });
        if (duplicateCategory) {
          return NextResponse.json(
            { message: "Category with this name already exists" },
            { status: 400 }
          );
        }
      }
  
      // Initialize URLs with existing values
      let imageUrl = existingCategory.imageUrl;
      let logoUrl = existingCategory.logoUrl;
      let bannerUrl = existingCategory.bannerUrl;
  
      // Handle image file upload
      if (imageFile) {
        if (existingCategory.imageUrl) {
          const publicId = extractPublicId(existingCategory.imageUrl);
          if (publicId) {
            
            
            await cloudinary.uploader.destroy('categories/' + publicId);
          }
        }
  
        const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
        const imageStream = new stream.PassThrough();
        imageStream.end(imageBuffer);
  
        const { secure_url: newImageUrl } = await new Promise<any>(
          (resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { folder: "categories" ,
                format: 'webp' 
              },
              (error, result) => {
                if (error)
                  return reject(
                    new Error(`Image upload failed: ${error.message}`)
                  );
                resolve(result);
              }
            );
            imageStream.pipe(uploadStream);
          }
        );
  
        imageUrl = newImageUrl; // Update imageUrl with the uploaded URL
      }
  
      // Handle logo file upload
      if (logoFile) {
        if (existingCategory.logoUrl) {
          const publicId = extractPublicId(existingCategory.logoUrl);
          if (publicId) {
            
            
            await cloudinary.uploader.destroy('categories/logos/' + publicId);
          }
        }
  
        const logoBuffer = Buffer.from(await logoFile.arrayBuffer());
        const logoStream = new stream.PassThrough();
        logoStream.end(logoBuffer);
  
        const { secure_url: newLogoUrl } = await new Promise<any>(
          (resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { folder: "categories/logos",
                format: 'svg' 
               },
              (error, result) => {
                if (error)
                  return reject(
                    new Error(`Logo upload failed: ${error.message}`)
                  );
                resolve(result);
              }
            );
            logoStream.pipe(uploadStream);
          }
        );
  
        logoUrl = newLogoUrl; // Update logoUrl with the uploaded URL
      }
      // Handle logo file upload
      if (bannerFile) {
       
          if (existingCategory.bannerUrl) {
            const publicId = extractPublicId(existingCategory.bannerUrl);
            if (publicId) {
              
              
              await cloudinary.uploader.destroy('categories/banner/' + publicId);
            }
          }
    
        const bannerBuffer = Buffer.from(await bannerFile.arrayBuffer());
        const bannerStream = new stream.PassThrough();
        bannerStream.end(bannerBuffer);
  
        const { secure_url: newBannerUrl } = await new Promise<any>(
          (resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { folder: "categories/banner",
                format: 'webp' 
               },
              (error, result) => {
                if (error)
                  return reject(
                    new Error(`Logo upload failed: ${error.message}`)
                  );
                resolve(result);
              }
            );
            bannerStream.pipe(uploadStream);
          }
        );
  
        bannerUrl = newBannerUrl; // Update logoUrl with the uploaded URL
      }
      // Update category with new values
      existingCategory.name = name;
      existingCategory.logoUrl = logoUrl;
      existingCategory.imageUrl = imageUrl;
      existingCategory.bannerUrl = bannerUrl;
      existingCategory.user = user;
      await existingCategory.save();
  
      return NextResponse.json(existingCategory, { status: 200 });
    } catch (error) {
      console.error(error); // Log error for debugging
      return NextResponse.json(
        { message: "Error updating category", error },
        { status: 500 }
      );
    }
  }
  
  
  
  function extractPublicId(url: string): string {
    const matches = url.match(/\/([^\/]+)\.(jpg|jpeg|png|gif|webp)$/);
    if (matches) {
      return matches[1];
    }
    const segments = url.split("/");
    const lastSegment = segments.pop();
    return lastSegment ? lastSegment.split(".")[0] : "";
  }