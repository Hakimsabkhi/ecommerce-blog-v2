import {  NextResponse } from 'next/server';
import connectToDatabase from "@/lib/db";
import Products from "@/models/Product";
import Category from '@/models/Category';

export async function GET(){
    try{
      
      await connectToDatabase();
      await Category.find()
      const product = await  Products.find({vadmin:"approve"}) .populate({
        path: 'category', // The field you're populating
        match: { 
          vadmin: "approve" }, // Only populate categories where status is "approved"
      });
      const products = product.filter(product => product.category);
      return NextResponse.json(products, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
    }
  }