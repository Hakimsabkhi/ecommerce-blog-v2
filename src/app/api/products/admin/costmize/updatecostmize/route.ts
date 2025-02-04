import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import CustomizeProduct from "@/models/CustomizeProduct";
import { getToken } from "next-auth/jwt";
import User from "@/models/User";




export async function PUT(req: NextRequest) {
  await connectToDatabase();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findOne({ email: token.email });
  if (
    !user ||
    (user.role !== "Admin" &&
      
      user.role !== "SuperAdmin")
  ) {
    return NextResponse.json(
      { error: "Forbidden: Access is denied" },
      { status: 403 }
    );
  }

  try {
    const formData = await req.formData();
    const id = formData.get("id") as string;

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const existingCustomizeProduct= await CustomizeProduct.findById(id);
    if (!existingCustomizeProduct) {
      return NextResponse.json(
        { message: "existingCustomizeProduct not found" },
        { status: 404 }
      );
    }

    const wbtitle = formData.get("wbtitle") as string ;
    const wbsubtitle = formData.get("wbsubtitle") as string ;
    const pctitle = formData.get("pctitle") as string ;
    const pcsubtitle = formData.get("pcsubtitle") as string ;
    const cptitle = formData.get("cptitle") as string ;
    const cpsubtitle = formData.get("cpsubtitle") as string ;

    // Update company with new values if provided
    if (wbtitle !== null) existingCustomizeProduct.wbtitle = wbtitle;
    if (wbsubtitle !== null) existingCustomizeProduct.wbsubtitle = wbsubtitle;
    if (pctitle !== null) existingCustomizeProduct.pctitle = pctitle;
    if (pcsubtitle !== null) existingCustomizeProduct.pcsubtitle = pcsubtitle;
    if (cptitle !== null) existingCustomizeProduct.cptitle = cptitle;
    if (cpsubtitle !== null) existingCustomizeProduct.cpsubtitle = cpsubtitle;
    
    

    existingCustomizeProduct.user = user;
    existingCustomizeProduct.updatedAt = new Date();

    await existingCustomizeProduct.save();
    return NextResponse.json(existingCustomizeProduct, { status: 200 });
  } catch (error) {
    console.error("Error updating existingCustomizeProduct:", error);
    return NextResponse.json(
      {
        message: "Error updating existingCustomizeProduct",
        error: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}