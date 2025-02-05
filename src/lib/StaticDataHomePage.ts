import connectToDatabase from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";
import Websiteinfo from '@/models/Websiteinfo';
import Boutique from '@/models/Boutique';
import CustomizeCategoy from "@/models/CustomizeCategoy";
import CustomizeBrand from "@/models/CustomizeBrand";
import CustomizeProduct from "@/models/CustomizeProduct";
import Brand from "@/models/Brand";

  
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
/* export async function getstore(){
  await connectToDatabase(); 
  const boutique = await Boutique.find({vadmin:"approve"}).limit(2).exec();
  return JSON.stringify(boutique );
}
 */
export async function getstores(){
  await connectToDatabase(); 
  const boutique = await Boutique.find({vadmin:"approve"}).exec();
  return JSON.stringify(boutique );
}

  
export async function getWebsiteinfo() {
  await connectToDatabase();
  const company = await Websiteinfo.findOne({}).exec();
  return JSON.stringify(company );
}
//title category
export async function gettitlecategory(){
  await connectToDatabase();
  const titlecategory = await CustomizeCategoy.findOne().exec();
  return JSON.stringify(titlecategory);
}
//title brand
export async function gettitlebrand(){
  await connectToDatabase();
  const titlebrand = await CustomizeBrand.findOne().exec();
  return JSON.stringify(titlebrand);
}
//title product
export async function gettitleproduct(){
  await connectToDatabase();
  const titleproduct = await CustomizeProduct.findOne().exec();
  return JSON.stringify(titleproduct);
}
export async function getBestproductData() {
  await connectToDatabase();
  // You can adjust the filters as needed (e.g., `statuspage: "home-page"` or any other filters)
  await Category.find();
  await Boutique.find();
  await Brand.find();
  const bestsellers = await Product.find({
    vadmin: "approve",
    statuspage: "home-page",
  }).lean()
  .populate('category')
  .populate('boutique')
  .populate('brand');
  return JSON.stringify(bestsellers);

  // Convert `_id` to string so Next.js won’t complain
 
}
export async function getBestCollectionData() {
  await connectToDatabase();
  // You can adjust the filters as needed (e.g., `statuspage: "home-page"` or any other filters)
  await Category.find();
  await Boutique.find();
  await Brand.find();
  const bestsellers = await Product.find({
    vadmin: "approve",
    statuspage: "best-collection",
  }).lean()
  .populate('category')
  .populate('boutique')
  .populate('brand');
  return JSON.stringify(bestsellers);

  // Convert `_id` to string so Next.js won’t complain
 
}