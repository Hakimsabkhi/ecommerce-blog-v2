import connectToDatabase from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";
import Promotion from '@/models/Promotion';
import Websiteinfo from '@/models/Websiteinfo';
import Boutique from '@/models/Boutique';

  
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
     
    //const products = product.map((product) => product.category);
    return JSON.stringify(product );
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
export async function getstore(){
  await connectToDatabase(); 
  const boutique = await Boutique.find().limit(2).exec();
  return JSON.stringify(boutique );
}

export async function getstores(){
  await connectToDatabase(); 
  const boutique = await Boutique.find().exec();
  return JSON.stringify(boutique );
}

  
export async function getWebsiteinfo() {
  await connectToDatabase();
  const company = await Websiteinfo.findOne({}).exec();
  return JSON.stringify(company );
}