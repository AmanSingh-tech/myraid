import { NextRequest, NextResponse } from "next/server";
import * as bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";
import { registerSchema } from "@/lib/validation";
import { ErrorHandler, createErrorResponse } from "@/lib/errors";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        createErrorResponse(validation.error.errors[0].message, "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      const error = ErrorHandler.userExists();
      return NextResponse.json(
        createErrorResponse(error.message, error.errorCode),
        { status: error.statusCode }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });

    // Generate JWT token
    const token = await signToken(user.id);

    // Create response with HTTP-only cookie
    const response = NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        data: { user },
      },
      { status: 201 }
    );

    // Set secure HTTP-only cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    const err = ErrorHandler.internalError();
    return NextResponse.json(
      createErrorResponse(err.message, err.errorCode),
      { status: err.statusCode }
    );
  }
}
