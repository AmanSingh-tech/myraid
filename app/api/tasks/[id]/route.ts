import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateTaskSchema } from "@/lib/validation";
import { encrypt, decrypt } from "@/lib/encryption";
import { ErrorHandler, createErrorResponse } from "@/lib/errors";

/**
 * GET /api/tasks/:id - Get a specific task
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;

    // Get task
    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      const error = ErrorHandler.taskNotFound();
      return NextResponse.json(
        createErrorResponse(error.message, error.errorCode),
        { status: error.statusCode }
      );
    }

    // Check if task belongs to user
    if (task.userId !== payload.userId) {
      const error = ErrorHandler.forbiddenAccess();
      return NextResponse.json(
        createErrorResponse(error.message, error.errorCode),
        { status: error.statusCode }
      );
    }

    // Decrypt description
    const decryptedTask = {
      ...task,
      description: decrypt(task.description),
    };

    return NextResponse.json(
      {
        success: true,
        data: { task: decryptedTask },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get task error:", error);
    const err = ErrorHandler.internalError();
    return NextResponse.json(
      createErrorResponse(err.message, err.errorCode),
      { status: err.statusCode }
    );
  }
}

/**
 * PATCH /api/tasks/:id - Update a task
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;
    const body = await request.json();

    // Validate input
    const validation = updateTaskSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        createErrorResponse(validation.error.errors[0].message, "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    // Check if task exists and belongs to user
    const existingTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      const error = ErrorHandler.taskNotFound();
      return NextResponse.json(
        createErrorResponse(error.message, error.errorCode),
        { status: error.statusCode }
      );
    }

    if (existingTask.userId !== payload.userId) {
      const error = ErrorHandler.forbiddenAccess();
      return NextResponse.json(
        createErrorResponse(error.message, error.errorCode),
        { status: error.statusCode }
      );
    }

    const { title, description, status } = validation.data;

    // Prepare update data
    const updateData: any = {};

    if (title !== undefined) {
      updateData.title = title;
    }

    if (description !== undefined) {
      updateData.description = encrypt(description);
    }

    if (status !== undefined) {
      updateData.status = status;
    }

    // Update task
    const updatedTask = await prisma.task.update({
      where: { id },
      data: updateData,
    });

    // Decrypt description for response
    return NextResponse.json(
      {
        success: true,
        message: "Task updated successfully",
        data: {
          task: {
            ...updatedTask,
            description: decrypt(updatedTask.description),
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update task error:", error);
    const err = ErrorHandler.internalError();
    return NextResponse.json(
      createErrorResponse(err.message, err.errorCode),
      { status: err.statusCode }
    );
  }
}

/**
 * DELETE /api/tasks/:id - Delete a task
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;

    // Check if task exists and belongs to user
    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      const error = ErrorHandler.taskNotFound();
      return NextResponse.json(
        createErrorResponse(error.message, error.errorCode),
        { status: error.statusCode }
      );
    }

    if (task.userId !== payload.userId) {
      const error = ErrorHandler.forbiddenAccess();
      return NextResponse.json(
        createErrorResponse(error.message, error.errorCode),
        { status: error.statusCode }
      );
    }

    // Delete task
    await prisma.task.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Task deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete task error:", error);
    const err = ErrorHandler.internalError();
    return NextResponse.json(
      createErrorResponse(err.message, err.errorCode),
      { status: err.statusCode }
    );
  }
}
