import {  NextResponse } from 'next/server';
import connectToDatabase from "@/lib/db";
import Products from "@/models/Product";
import Category from '@/models/Category';
export async function GET(){
    try{
      
      await connectToDatabase();
      await Category.find()
      const products = await  Products.find({vadmin:"approve"}).populate("category _id name slug");
    
      return NextResponse.json(products, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
    }
  }