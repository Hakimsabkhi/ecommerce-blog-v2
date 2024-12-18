// /app/api/order/route.ts

import { NextRequest, NextResponse } from "next/server";
import Order from "@/models/order"; // Adjust path to where your Order model is located
import  connectDB  from "@/lib/db"; // MongoDB connection utility
import User from "@/models/User";
import { getToken } from "next-auth/jwt";
import Product from "@/models/Product";
import Notifications from "@/models/Notifications";
// POST - Create a new order
export async function POST(req: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();
    
    const body = await req.json();
    
    const token=await getToken({req,secret:process.env.NEXTAUTH_SECRET});
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = await User.findOne({ email:token.email});
    // Parse the request body
    if (!user){
        return NextResponse.json({ success: false, message: "Missing required connect" }, { status: 505 });
    }

    const { items, totalWithShipping,paymentMethod,address,selectedMethod,deliveryCost} = body;
   
    // Validate required fields
    if (!user || !address || !items || !paymentMethod||!selectedMethod||!totalWithShipping) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }


   const orderItems = items.map((item: any) => ({
    product: item._id,
    refproduct:item.ref,
    name: item.name,
    tva:item.tva,
    quantity: item.quantity,
    image: item.imageUrl,
    price: item.price,
    discount: item.discount,
  }));

for (let i = 0; i < orderItems.length; i++) {
    // Your loop body here
    console.log(orderItems[i].product); // Example: access each item in orderItems
    const oldproduct = await Product.findOne({_id:orderItems[i].product})
    if(oldproduct)
    {
      if(oldproduct.stock>=orderItems[i].quantity)
      {
        oldproduct.stock-=orderItems[i].quantity;
       
        oldproduct.save();
      }

    }
  }
 
    // Create a new order
    const newOrder = new Order({
      user,
      address,
      orderItems,
      paymentMethod:paymentMethod,
      deliveryMethod:selectedMethod,
      deliveryCost,
      total:totalWithShipping+1,
      ref: `ORDER-${Math.random().toString(36).substring(2, 10).toUpperCase()}`, // Example ref generation
      orderStatus: 'Processing',
    });

    // Save the order to the database
     const savedOrder = await newOrder.save();
    const newNotification = new Notifications({
      order:savedOrder,
    })
    await newNotification.save();
    // Return success response
    return NextResponse.json({
      success: true,
      ref: savedOrder.ref, // Return the order reference
  
    }, { status: 200});
  }  catch (error) {
    // Cast error as Error type to access its message property
    const err = error as Error;

    console.error("Error creating order:", err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
