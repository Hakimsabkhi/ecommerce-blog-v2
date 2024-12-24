import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Notification from '@/models/Notifications';
import { getToken } from 'next-auth/jwt';
import Order from '@/models/order';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const page = Number(req.nextUrl.searchParams.get('page')) || 1;
    const limit = Number(req.nextUrl.searchParams.get('limit')) || 10;
    await Order.find();
    const notifications = await Notification.find({ seen: false })
      .populate({
        path: 'order',
        select: 'ref createdAt',
        populate: { path: 'user', select: 'username' },
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Notification.countDocuments({ seen: false });

    return NextResponse.json({ notifications, total });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Error fetching notifications' }, { status: 500 });
  }
}
