import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Role from '@/models/Role';

export async function GET() {
  await connectToDatabase();
  try {
    const roles = await Role.find({ name: { $nin: ['Admin', 'SuperAdmin'] }}, { name: 1, access: 1 }).lean();
    return NextResponse.json({ roles });
  } catch (err) {
    console.log(err)
  }
}


