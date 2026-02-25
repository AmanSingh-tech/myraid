import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createTaskSchema, taskQuerySchema } from "@/lib/validation";
import { encrypt, decrypt } from "@/lib/encryption";
import { ErrorHandler, createErrorResponse } from "@/lib/errors";

/**
 * GET /api/tasks - Get all tasks for authenticated user
 * Supports pagination, filtering by status, and search
 */
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

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const queryValidation = taskQuerySchema.safeParse({
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "10",
      status: searchParams.get("status") || undefined,
      search: searchParams.get("search") || undefined,
    });

    if (!queryValidation.success) {
      return NextResponse.json(
        createErrorResponse(queryValidation.error.errors[0].message, "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    const { page, limit, status, search } = queryValidation.data;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build filter conditions
    const where: any = {
      userId: payload.userId,
    };

    if (status) {
      where.status = status;
    }

    if (search) {
      where.title = {
        contains: search,
        mode: "insensitive",
      };
    }

    // Get tasks with pagination
    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.task.count({ where }),
    ]);

    // Decrypt task descriptions
    const decryptedTasks = tasks.map((task) => {
      try {
        return {
          ...task,
          description: decrypt(task.description),
        };
      } catch (err) {
        console.error(`Failed to decrypt task ${task.id}:`, err);
        return {
          ...task,
          description: "[Decryption failed]",
        };
      }
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          tasks: decryptedTasks,
          pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages: Math.ceil(total / limitNum),
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get tasks error:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack");
    const err = ErrorHandler.internalError();
    return NextResponse.json(
      createErrorResponse(err.message, err.errorCode),
      { status: err.statusCode }
    );
  }
}

/**
 * POST /api/tasks - Create a new task
 */
export async function POST(request: NextRequest) {
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

    const body = await request.json();

    // Validate input
    const validation = createTaskSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        createErrorResponse(validation.error.errors[0].message, "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    const { title, description, status } = validation.data;

    // Encrypt description
    const encryptedDescription = encrypt(description);

    // Create task
    const task = await prisma.task.create({
      data: {
        title,
        description: encryptedDescription,
        status: status || "TODO",
        userId: payload.userId,
      },
    });

    // Return task with decrypted description
    return NextResponse.json(
      {
        success: true,
        message: "Task created successfully",
        data: {
          task: {
            ...task,
            description: description, // Return original unencrypted description
          },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create task error:", error);
    const err = ErrorHandler.internalError();
    return NextResponse.json(
      createErrorResponse(err.message, err.errorCode),
      { status: err.statusCode }
    );
  }
}
