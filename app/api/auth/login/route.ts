import { NextRequest, NextResponse } from "next/server";
import * as bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";
import { ErrorHandler, createErrorResponse } from "@/lib/errors";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        createErrorResponse(validation.error.errors[0].message, "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      const error = ErrorHandler.invalidCredentials();
      return NextResponse.json(
        createErrorResponse(error.message, error.errorCode),
        { status: error.statusCode }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      const error = ErrorHandler.invalidCredentials();
      return NextResponse.json(
        createErrorResponse(error.message, error.errorCode),
        { status: error.statusCode }
      );
    }

    // Generate JWT token
    const token = await signToken(user.id);

    // Create response with HTTP-only cookie
    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful",
        data: {
          user: {
            id: user.id,
            email: user.email,
            createdAt: user.createdAt,
          },
        },
      },
      { status: 200 }
    );

    // Set secure HTTP-only cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    console.log("Login successful for user:", user.id, "Token set in cookie");

    return response;
  } catch (error) {
    console.error("Login error:", error);
    const err = ErrorHandler.internalError();
    return NextResponse.json(
      createErrorResponse(err.message, err.errorCode),
      { status: err.statusCode }
    );
  }
}
