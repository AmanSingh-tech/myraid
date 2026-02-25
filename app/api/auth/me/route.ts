import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ErrorHandler, createErrorResponse } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get("token")?.value;

    if (!token) {
      const error = ErrorHandler.tokenMissing();
      return NextResponse.json(
        createErrorResponse(error.message, error.errorCode),
        { status: error.statusCode }
      );
    }

    // Verify token
    let payload;
    try {
      payload = await verifyToken(token);
    } catch (error) {
      const err = ErrorHandler.tokenInvalid();
      return NextResponse.json(
        createErrorResponse(err.message, err.errorCode),
        { status: err.statusCode }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      const error = ErrorHandler.userNotFound();
      return NextResponse.json(
        createErrorResponse(error.message, error.errorCode),
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: { user },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get user error:", error);
    const err = ErrorHandler.internalError();
    return NextResponse.json(
      createErrorResponse(err.message, err.errorCode),
      { status: err.statusCode }
    );
  }
}
