import { z } from "zod";
import { IBODY } from "../api/auth/registration/route";

export const zUser = z.object({
  firstName: z
    .string()
    .min(3, { message: "first name cannot be less than 3 character " })
    .max(10, { message: "first name cannot be more than 10 character" }),
  lastName: z
    .string()
    .min(2, { message: "last name cannot be less than 2 character " })
    .max(10, { message: "last name cannot be more than 10 character" }),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "password must be at least 8 characters" }),
  profilePic: z.string().default(""),
  loginToken: z.string().default(""),
  verificationCode: z.number().max(6).min(6).nullable().default(null),
  verificationCodeExpiry: z.coerce.date().default(() => new Date()),
  isVerified: z.boolean().default(false),
});
export type TUSER = z.infer<typeof zUser>;

export const validateUserDataFromBody = (data: IBODY) => {
  const result = zUser.safeParse(data);
  return result;
};
