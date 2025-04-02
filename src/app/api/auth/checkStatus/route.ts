import { userModel } from "@/app/models/user.model";
import { dbConnect } from "@/app/utils/conn";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  await dbConnect();
  try {
    const payload = req.headers.get("payload");
    const parsedPayload = payload ? JSON.parse(payload) : null;
    const user = await userModel
      .findById(parsedPayload._id)
      .select("-password");
    if (!user) {
      return NextResponse.json("User not found", { status: 404 });
    }
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error while checking status", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
};
