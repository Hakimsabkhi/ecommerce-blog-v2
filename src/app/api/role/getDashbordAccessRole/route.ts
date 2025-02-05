import connectToDatabase from "@/lib/db";
import Role from "@/models/Role";
import User from "@/models/User";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

/**
 * Helper: Retrieves user based on the JWT token in the request.
 */
async function getUserFromToken(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return { error: "Unauthorized", status: 401 };
  }

  const user = await User.findOne({ _id: token.id }).exec();
  if (!user) {
    return { error: "User not found", status: 404 };
  }

  return { user };
}

export async function GET(req: NextRequest) {
  await connectToDatabase();
  try {
    // 1) Get user or return any error from token retrieval
    const connectUser = await getUserFromToken(req);
    if ("error" in connectUser) {
      return NextResponse.json(
        { error: connectUser.error },
        { status: connectUser.status }
      );
    }

    // 2) At this point, we have a valid user
    const userRole = connectUser.user.role;

    // 3) SuperAdmin short-circuit
    if (userRole === "SuperAdmin") {
      return NextResponse.json(true);
    }

    // 5) Check if the role actually exists in the Role collection
    const roleExists = await Role.exists({ name: userRole });
    if (roleExists) {
      console.log("User's role exists and is valid.");
      return NextResponse.json(true);
    } else {
      console.log("Role does not exist. Returning false.");
      return NextResponse.json(false);
    }
  } catch (err) {
    console.error("Error in GET /api/role/getDashbordAccessRole:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}