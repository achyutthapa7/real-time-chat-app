import { userModel } from "@/app/models/user.model";
import { dbConnect } from "@/app/utils/conn";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  await dbConnect();
  try {
    const cookie = await cookies();
    const payload = req?.headers?.get("payload");
    const parsedPayload = payload ? JSON.parse(payload) : null;
    cookie.delete("loginToken");
    await userModel.findByIdAndUpdate(parsedPayload?._id, {
      $set: {
        loginToken: "",
      },
    });
    return NextResponse.json("Logged out successfully", {
      status: 200,
    });
  } catch (error) {
    console.error("Error while logging out", error);
    return NextResponse.json(error, { status: 500 });
  }
};
