
import connectToDatabase from "@/lib/db";
import Brand from "@/models/Brand";
import Category from "@/models/Category";
import Product from "@/models/Product";


export async function searchcategory(id:string) {
    await connectToDatabase();
    const category=id;
    if (!category || typeof category !== 'string') {
       
         console.error('Category name is required and should be a string');
      
    }
      const foundCategory = await Category.findOne({ slug: category, vadmin: 'approve' }).exec();
    
     
 
    return JSON.stringify(foundCategory );
}

export async function getProductById(id:string) {


    await connectToDatabase();

    if (!id ) { 
        console.error("Invalid or missing product ");
    }
   
   
    await Category.find();
    await Brand.find();
    const product = await Product.findOne({ slug: id,vadmin:"approve" })
      .populate("category")
      .populate("brand").exec();



      return JSON.stringify(product );
}
export async function getproductbycatgory(categorySlug:string){

    // Ensure database connection
    await connectToDatabase();

    // Await the params object

    // Validate and ensure `categorySlug` is available
    if (!categorySlug) {
      console.error('Category slug is required');
      
    }

  

    // Find the category by slug with "approve" status
    const foundCategory = await Category.findOne({ slug: categorySlug, vadmin: 'approve' });

    if (!foundCategory) {
      console.error('Category not found. Please check the slug.');
      
    }
    
    // Check if products exist for the category
    const productCount = await Product.countDocuments({
      category: foundCategory?._id,
      vadmin: 'approve',
    });

    if (productCount === 0) {
      console.error('No products found for this category.');
        
    }
await Brand.find();
    // Fetch the products with populated references
    const products = await Product.find({
      category: foundCategory?._id,
      vadmin: 'approve',
    })
      .populate('category', 'name slug') // Populate category with only needed fields
      .populate('brand', 'name')        // Populate brand with only needed fields
      .populate('user', 'name email')  // Populate user with only needed fields
      .exec();
      return JSON.stringify(products );
}

