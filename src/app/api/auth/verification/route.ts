import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/app/utils/conn";
import { userModel } from "@/app/models/user.model";
export const POST = async (req: NextRequest) => {
  await dbConnect();
  try {
    const body = await req.json();
    const { verificationCode } = body;
    const emailAddress = req.nextUrl.searchParams.get("emailAddress");
    if (!emailAddress) {
      return NextResponse.json(
        {
          message: "Email address not found",
        },
        { status: 404 }
      );
    }
    const registeredUser = await userModel.findOne({
      email: emailAddress,
    });
    const optExpiryTime = registeredUser?.verificationCodeExpiry;
    const otp = registeredUser?.verificationCode;

    if (Date.now() > optExpiryTime) {
      return NextResponse.json(
        { message: "Verification code expired" },
        { status: 400 }
      );
    }
    if (verificationCode !== otp) {
      return NextResponse.json(
        { message: "Invalid verification code" },
        { status: 409 }
      );
    }
    if (verificationCode === otp) {
      registeredUser.isVerified = true;
      await registeredUser.save();
    }
    return NextResponse.json(
      { message: "Verification successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while verifying email:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
