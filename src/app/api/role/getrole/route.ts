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
      const role = new Role({ name: 'Admin', access: {} });
      await role.save();
    }
    if(!visitorExists){
      const role = new Role({ name: 'Visiteur', access: {} });
      await role.save();
    }
    const roles = await Role.find({ name: { $nin: [ 'SuperAdmin'] }}, { name: 1, access: 1 }).lean();
    console.log('Admin exists:', adminExists);
    console.log('Visitor exists:', visitorExists);
    return NextResponse.json({ roles });
  } catch (err) {
    console.log(err)
  }
}


