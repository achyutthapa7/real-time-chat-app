import mongoose, { Document } from "mongoose";
import bcrypt from "bcryptjs";
import { TUSER } from "../zod/validator";
interface IUser extends Document, TUSER {}

const userSchema = new mongoose.Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: {
      type: String,
      required: false,
      default: "https://ssl.gstatic.com/accounts/ui/avatar_2x.png",
    },
    loginToken: { type: String, required: false, default: "" },
    verificationCode: { type: Number, required: false, default: null },
    verificationCodeExpiry: {
      type: Date,
      required: false,
      default: Date.now(),
    },
    isVerified: { type: Boolean, required: false, default: false },
  },
  {
    timestamps: true,
  }
);

userSchema.pre<IUser>("save", async function (next) {
  try {
    const genSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, genSalt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    console.error("Error hashing password", error);
    throw error;
  }
});

export const userModel =
  mongoose.models.users || mongoose.model<IUser>("users", userSchema);
