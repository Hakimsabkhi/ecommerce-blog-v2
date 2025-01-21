import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET 
export async function POST(req: NextRequest)  {
    const { token } = req.query;
  
    if (!token) {
        return NextResponse.json(
            {
              error: 'Token is required'
            },
            { status: 400 }
          );
     
    }
  
    try {
      // Verify the token using the JWT secret
      const decoded = jwt.verify(token as string, JWT_SECRET) as { email: string };
  
      // If verification succeeds, you can proceed with updating the user record (mark as verified)
      console.log('Decoded token:', decoded); // You can log it or update your database
  
      // Example: You would find the user by email and mark them as verified in the database
      // const user = await User.findOne({ email: decoded.email });
      // user.isVerified = true;
      // await user.save();
      return NextResponse.json(
        {
          message: "Email verified successfully.",
        },
        { status: 429 }
      );
    
    } catch (error) {
      // Handle verification errors (e.g., invalid or expired token)

      return NextResponse.json(
        {
            error: "Email verified successfully.",
        }, { status: 400 })
    }
  }