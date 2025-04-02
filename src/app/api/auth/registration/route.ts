import { userModel } from "@/app/models/user.model";
import { dbConnect } from "@/app/utils/conn";
import { validateUserDataFromBody, zUser } from "@/app/zod/validator";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
export interface IBODY {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const POST = async (req: NextRequest) => {
  await dbConnect();
  try {
    const body: IBODY = await req.json();
    const { firstName, lastName, email, password, confirmPassword } = body;
    if (password !== confirmPassword)
      return NextResponse.json(
        { message: "passwords don't match, please try again!" },
        { status: 400 }
      );
    const { success, error } = validateUserDataFromBody(body);

    if (!success) {
      const errors = error.issues.map((err) => err.message);
      return NextResponse.json(errors, { status: 400 });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already exists, please use another one!" },
        { status: 409 }
      );
    }
    const newUser = new userModel({
      firstName,
      lastName,
      email,
      password,
    });
    await newUser.save();
    //send otp to the email address later
    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(error);
  }
};
