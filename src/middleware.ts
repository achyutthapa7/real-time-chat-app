import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
export const middleware = async (req: NextRequest) => {
  try {
    const exceptionRoutes = ["/api/auth/login", "/api/auth/registration"];
    if (
      exceptionRoutes.length > 0 &&
      exceptionRoutes.includes(req.nextUrl.pathname)
    ) {
      return NextResponse.next();
    }
    const cookie = await cookies();
    const token = cookie?.get("loginToken")?.value;
    if (!token) {
      return NextResponse.json("unauthorized user", { status: 401 });
    }
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET_KEY as string
    );
    const { payload } = await jwtVerify(token, secret);
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("payload", JSON.stringify(payload));
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  } catch (error) {
    console.error("Error in middleware", error);
    return NextResponse.json(error, { status: 500 });
  }
};

export const config = {
  matcher: ["/api/:path*"],
};
