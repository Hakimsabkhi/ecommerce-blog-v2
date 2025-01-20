import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Role from '@/models/Role';

export async function GET() {
  await connectToDatabase();
  try {
    const role = await Role.find({ name: { $nin: [ 'SuperAdmin'] }}, { name: 1, access: 1 }).lean();
    const adminExists = role.some(role => role.name === 'Admin');
    const visitorExists = role.some(role => role.name === 'Visiteur');
    if(!adminExists){
      const role = new Role({ name: 'Admin', access: {
        Entreprise: true,
        'P Category': true,
        Brands: true,
        Categories: true,
        Products: true,
        Promotion: true,
        Reviews: true,
        Users: true,
        Role: true,
        Orders: true,
        Invoice: true,
        Revenue: true,
        'All Post': true,
        'P Comments': true,
        } });
      await role.save();
    }
    if(!visitorExists){
      const role = new Role({ name: 'Visiteur', access: {} });
      await role.save();
    }
    const roles = await Role.find({ name: { $nin: [ 'SuperAdmin'] }}, { name: 1, access: 1 }).lean();
    return NextResponse.json({ roles });
  } catch (err) {
    console.log(err)
  }
}


