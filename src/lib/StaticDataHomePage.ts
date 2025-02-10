import { cache } from "react";
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
export const revalidate =1000;

//Collection et Furniture
// 2) Fetch sellers (best-selling products) directly from the DB
export const getApprovedProducts = cache(async function getApprovedProducts() {
    await connectToDatabase();
    await Category.find();
    const product = await Product.find({ vadmin: "approve" }).populate({
      path: 'category', // The field you're populating
      match: { vadmin: "approve" }, // Only populate categories where status is "approved"
    }).lean();
    
    return JSON.stringify(product);
});

// Banner
export const getWebsiteinfoData = cache(async function getWebsiteinfoData() {
  await connectToDatabase();
  const company = await Websiteinfo.findOne({}).exec();
  return company;
});

// Categories
export const getApprovedCategories = cache(async function getApprovedCategories(): Promise<CategoryType[]> {
  await connectToDatabase();
  // Use .lean() to get plain JS objects instead of Mongoose documents
  const categories = await Category.find({ vadmin: "approve" }).lean();
  // Convert ObjectId _id to string
  return categories.map((cat) => ({
    ...cat,
    _id: cat._id.toString(),
    imageUrl: cat.imageUrl ?? "/fallback.jpg",
  }));
});

// Sellers
export const getHomepageBestsellers = cache(async function getHomepageBestsellers() {
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
});


export const getApprovedStores = cache(async function getApprovedStores() {
  await connectToDatabase(); 
  const boutique = await Boutique.find({ vadmin: "approve" }).exec();
  return JSON.stringify(boutique);
});
  
export const getWebsiteInfoJSON = cache(async function getWebsiteInfoJSON() {
  await connectToDatabase();
  const company = await Websiteinfo.findOne({}).exec();
  return JSON.stringify(company);
});

// Title category
export const getCustomCategoryTitle = cache(async function getCustomCategoryTitle() {
  await connectToDatabase();
  const titlecategory = await CustomizeCategoy.findOne().exec();
  return JSON.stringify(titlecategory);
});

// Title brand
export const getCustomBrandTitle = cache(async function getCustomBrandTitle() {
  await connectToDatabase();
  const titlebrand = await CustomizeBrand.findOne().exec();
  return JSON.stringify(titlebrand);
});

// Title product
export const getCustomProductTitle = cache(async function getCustomProductTitle() {
  await connectToDatabase();
  const titleproduct = await CustomizeProduct.findOne().exec();
  return JSON.stringify(titleproduct);
});

export const getBestProducts = cache(async function getBestProducts() {
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
});

export const getBestCollections = cache(async function getBestCollections() {
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
});

export const getApprovedCategoriesData = cache(async function getApprovedCategoriesData() {
  await connectToDatabase(); // Ensure the database connection is established
  // Fetch all categories but only return the name and imageUrl fields
  const categories = await Category.find({ vadmin: "approve" }).exec(); // Only select the 'name' and 'imageUrl' fields
  // Return the fetched category names and image URLs
  return JSON.stringify(categories);
});
