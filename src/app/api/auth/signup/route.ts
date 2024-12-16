import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/db';
import UserModel from '@/models/User';

// In-memory rate limiting store
const rateLimit = new Map<string, { count: number; lastRequest: number }>();

// ZeroBounce API Key (replace with your actual API key)
const ZEROBOUNCE_API_KEY = process.env.ZEROBOUNCE_API_KEY;

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const name = formData.get('name') as string;
  const lastname = formData.get('lastname') as string;
  const email = (formData.get('email') as string).toLowerCase();
  const password = formData.get('password') as string;
  const role = formData.get('role') as string;
  const username = `${name} ${lastname}`;

  if (!username || !email || !password) {
    return NextResponse.json({ message: 'Username, email, and password are required' }, { status: 400 });
  }

  try {
    // Rate limiting logic
    const clientIp = req.headers.get('x-forwarded-for') || req.ip || 'unknown-ip';
    const rateLimitInfo = rateLimit.get(clientIp) || { count: 0, lastRequest: Date.now() };

    if (Date.now() - rateLimitInfo.lastRequest < 60000 && rateLimitInfo.count >= 5) {
      return NextResponse.json({ error: 'Rate limit exceeded. Please wait a minute before trying again.' }, { status: 429 });
    }

    rateLimitInfo.count++;
    rateLimitInfo.lastRequest = Date.now();
    rateLimit.set(clientIp, rateLimitInfo);

    // Validate email with ZeroBounce API
    const emailValidationResult = await validateEmailWithZeroBounce(email);

    if (!emailValidationResult || emailValidationResult.status !== 'valid') {
      return NextResponse.json({ message: 'Invalid email address' }, { status: 403 });
    }

    await connectToDatabase();

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = bcrypt.hashSync(password, 12);
    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
      role: role || 'Visiteur', // Default role if not provided
    });

    await newUser.save();
    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error during signup:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// Function to validate email with ZeroBounce API
async function validateEmailWithZeroBounce(email: string) {
  const response = await fetch(`https://api.zerobounce.net/v2/validate?api_key=${ZEROBOUNCE_API_KEY}&email=${email}`, {
    method: 'GET',
  });

  if (!response.ok) {
    console.error('Failed to validate email with ZeroBounce:', response.statusText);
    return null;
  }

  const data = await response.json();
  return data;
}
