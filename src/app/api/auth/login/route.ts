import { userModel } from "@/app/models/user.model";
import { dbConnect } from "@/app/utils/conn";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const zEmail = z.string().email();
const zPassword = z
  .string()
  .min(8, { message: "password must be at least 8 characters" });

export const POST = async (req: NextRequest) => {
  await dbConnect();
  try {
    const cookie = await cookies();
    const body = await req.json();
    const { email, password } = body;
    const validatedEmail = zEmail.safeParse(email);
    const validatedPassword = zPassword.safeParse(password);
    if (!validatedEmail.success) {
      return NextResponse.json(validatedEmail.error?.issues[0].message, {
        status: 400,
      });
    }
    if (!validatedPassword.success) {
      return NextResponse.json(validatedPassword.error?.issues[0].message, {
        status: 400,
      });
    }
    const userExists = await userModel.findOne({ email });
    if (!userExists) {
      return NextResponse.json("User does not exist", { status: 404 });
    }
    const isPassworMatch = await bcrypt.compare(password, userExists.password);
    if (!isPassworMatch) {
      return NextResponse.json("wrong password, try again!", { status: 401 });
    }
    const token = await jwt.sign(
      { _id: userExists._id, email: userExists.email },
      process.env.JWT_SECRET_KEY as string
    );
    cookie.set("loginToken", token);
    await userModel.updateOne({ email }, { $set: { loginToken: token } });

    const updatedUser = await userModel.findOne({ email }).select("-password");
    return NextResponse.json(
      { message: "Logged in successfully", updatedUser },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(error);
  }
};
