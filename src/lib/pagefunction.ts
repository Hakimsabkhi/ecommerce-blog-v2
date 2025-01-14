import connectToDatabase from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";
import Promotion from '@/models/Promotion';
interface Brand {
    _id: string;
    name: string;
  }
  
  interface Category {
    _id: string;
    name: string;
    slug: string;
  }
  
  interface Products {
    _id: string;
    name: string;
    description: string;
    ref: string;
    tva: number;
    price: number;
    imageUrl?: string;
    brand?: Brand;
    stock: number;
    discount?: number;
    color?: string;
    material?: string;
    status?: string;
    statuspage: string;
    category: Category;
    slug: string;
  }
// 1) Incremental Static Regeneration at the page level
export const revalidate = 60;

// 2) Fetch sellers (best-selling products) directly from the DB
export async function getproductstatusData() {
    await connectToDatabase();
    await Category.find()
    const product = await  Product.find({vadmin:"approve"}) .populate({
      path: 'category', // The field you're populating
      match: { 
        vadmin: "approve" }, // Only populate categories where status is "approved"
    }).lean();
    const products = product.filter(product => product.category);
    return products as unknown as Products[];
}





export async function promotionData() {

    await connectToDatabase(); // Ensure the database connection is established

    // Fetch all categories but only return the name and imageUrl fields
    const promotion = await Promotion.findOne({}).exec(); // Only select the 'name' and 'imageUrl' fields
   
        // Return the fetched category names and image URLs
    return promotion;
}
  