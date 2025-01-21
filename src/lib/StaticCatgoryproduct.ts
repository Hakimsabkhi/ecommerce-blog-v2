
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
