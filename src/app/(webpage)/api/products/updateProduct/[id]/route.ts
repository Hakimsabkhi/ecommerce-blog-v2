import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import cloudinary from "@/lib/cloudinary";
import stream from "stream";
import User from "@/models/User";
import Brand from "@/models/Brand";
import { getToken } from "next-auth/jwt";
import Category from "@/models/Category";

const extractPublicId = (url: string): string => {
  const matches = url.match(/\/([^\/]+)\.(jpg|jpeg|png|gif|webp)$/);
  if (matches) {
    return matches[1];
  }
  const segments = url.split("/");
  const lastSegment = segments.pop();
  return lastSegment ? lastSegment.split(".")[0] : "";
};

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();

  // Check token for authentication
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch the authenticated user
  const user = await User.findOne({ email: token.email });
  if (!user || !(user.role === "Admin" || user.role === "Consulter" || user.role === "SuperAdmin")) {
    return NextResponse.json({ error: "Forbidden: Access is denied" }, { status: 403 });
  }

  try {
    // Get form data
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const ref = formData.get("ref") as string;
    const category = formData.get("category") as string;
    let brand = formData.get("brand") as string | null;
    const stock = formData.get("stock");
    const price = formData.get("price");
    const tva = formData.get("tva");
    const discount = formData.get("discount");
    const info = formData.get("info") as string | null;
    const color = formData.get("color") as string | null;
    const material = formData.get("material") as string | null;
    const weight = formData.get("weight") as string | null;
    const warranty = formData.get("warranty") as string | null;
    const dimensions = formData.get("dimensions") as string | null;
    const imageFile = formData.get("image") as File | null;
    const id = params.id;

    const imageFiles: File[] = [];
    const entries = Array.from(formData.entries());
    for (let i = 0; i < entries.length; i++) {
      const file = formData.get(`images[${i}]`) as File;
      if (file) {
        imageFiles.push(file);
      }
    }

    // Validate the product ID
    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    // Fetch the existing product
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    // Handle image file upload
    let imageUrl = existingProduct.imageUrl;
    if (imageFile) {
      if (existingProduct.imageUrl) {
        const publicId = extractPublicId(existingProduct.imageUrl);
        if (publicId) {
          await cloudinary.uploader.destroy("Products/" + publicId);
        }
      }

      const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
      const imageStream = new stream.PassThrough();
      imageStream.end(imageBuffer);

      const { secure_url: newImageUrl } = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "Products", format: "webp" },
          (error, result) => {
            if (error) return reject(new Error(`Image upload failed: ${error.message}`));
            resolve(result);
          }
        );
        imageStream.pipe(uploadStream);
      });

      imageUrl = newImageUrl;
    }

    // Upload multiple images to Cloudinary
    const uploadedImages = await Promise.all(
      imageFiles.map(async (imageFile) => {
        const imageBuffer = await imageFile.arrayBuffer();
        const bufferStream = new stream.PassThrough();
        bufferStream.end(Buffer.from(imageBuffer));

        const result = await new Promise<any>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "Products/images", format: "webp" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          bufferStream.pipe(uploadStream);
        });

        return result.secure_url;
      })
    );

    // Handle brand update (it can be null or a valid ObjectId)
    if (brand && brand.trim() !== "") {
      const validBrand = await Brand.findById(brand);
      if (!validBrand) {
        return NextResponse.json({ message: "Invalid brand selected" }, { status: 400 });
      }
      existingProduct.brand = validBrand._id;
    } else {
      existingProduct.brand = null; // If brand is not provided or empty, set it to null
    }
    if(category){
      const existingoldcategory = await Category.findById(existingProduct.category)
      const existingcategory = await Category.findById(category);
    if(existingProduct.category!=category){
      if (existingcategory){
        existingcategory.numberproduct += 1; // Increment the review count
        existingcategory.save();
      }
     
     
      if (existingoldcategory){
        existingoldcategory.numberproduct -= 1; // Increment the review count
  
        existingoldcategory.save();
      }
    }
    }
    // Update product fields
    existingProduct.name = name || existingProduct.name;
    existingProduct.description = description || existingProduct.description;
    existingProduct.ref = ref || existingProduct.ref;
    existingProduct.category = category || existingProduct.category;
    existingProduct.stock = stock ? parseInt(stock as string, 10) : existingProduct.stock;
    existingProduct.price = price ? parseFloat(price as string) : existingProduct.price;
    existingProduct.tva = tva ? parseFloat(tva as string) : existingProduct.tva;
    existingProduct.discount = discount ? Number(discount) : existingProduct.discount;
    existingProduct.info = info || existingProduct.info;
    existingProduct.color = color || existingProduct.color;
    existingProduct.material = material || existingProduct.material;
    existingProduct.weight = weight || existingProduct.weight;
    existingProduct.warranty = warranty || existingProduct.warranty;
    existingProduct.dimensions = dimensions || existingProduct.dimensions;
    existingProduct.imageUrl = imageUrl;

    if (uploadedImages && uploadedImages.length > 0) {
      const images = existingProduct.images || [];
      existingProduct.images = [...images, ...uploadedImages];
    }

    // Update the user field
    existingProduct.user = user;
    existingProduct.updatedAt = new Date();

    // Save the updated product
    await existingProduct.save();

    return NextResponse.json(existingProduct, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error updating product", error }, { status: 500 });
  }
}
