import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Notification from '@/models/Notifications';
import { getToken } from 'next-auth/jwt';

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const updates = await req.json();

    const ids = updates.map((update: { _id: string }) => update._id);

    await Notification.updateMany(
      { _id: { $in: ids } },
      { $set: { seen: true } }
    );

    return NextResponse.json({ message: 'Notifications updated' });
  } catch (error) {
    console.error('Error updating notifications:', error);
    return NextResponse.json({ error: 'Error updating notifications' }, { status: 500 });
  }
}
