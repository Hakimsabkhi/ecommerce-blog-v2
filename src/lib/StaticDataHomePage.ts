import connectToDatabase from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";
import Promotion from '@/models/Promotion';
import Websiteinfo from '@/models/Websiteinfo';
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
  
interface CategoryType {
  _id: string;
  name: string;
  imageUrl?: string;
  slug: string;
  numberproduct?: number;
}
// 1) Incremental Static Regeneration at the page level
export const revalidate = 60;
//Collection et Furniture
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
    return JSON.stringify(products as unknown as Products[]);
}



//promation

export async function promotionData() {

    await connectToDatabase(); // Ensure the database connection is established

    // Fetch all categories but only return the name and imageUrl fields
    const promotion = await Promotion.findOne({}).exec(); // Only select the 'name' and 'imageUrl' fields
   
        // Return the fetched category names and image URLs
    return promotion;
}
  //Banner
  
  export async function getWebsiteinfoData() {
  await connectToDatabase();
  const company = await Websiteinfo.findOne({}).exec();
  return company;
}
//Categories
export async function getCategoriesData(): Promise<CategoryType[]> {
  await connectToDatabase();

  // Use .lean() to get plain JS objects instead of Mongoose documents
  const categories = await Category.find({ vadmin: "approve" }).lean();

  // Convert ObjectId _id to string
  return categories.map((cat) => ({
    ...cat,
    _id: cat._id.toString(),
    imageUrl: cat.imageUrl ?? "/fallback.jpg",
  }));

}
//sellers
export async function getBestsellersData() {
  await connectToDatabase();
  // You can adjust the filters as needed (e.g., `statuspage: "home-page"` or any other filters)
  const bestsellers = await Product.find({
    vadmin: "approve",
    statuspage: "home-page",
  }).lean();

  // Convert `_id` to string so Next.js won’t complain
  return bestsellers.map((item) => ({
    ...item,
    _id: item._id.toString(),
    imageUrl: item.imageUrl ?? "/fallback.jpg", // optional fallback
  }));
}