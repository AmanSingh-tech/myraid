"use client";

import { cn } from "@/lib/utils";

interface BadgeProps {
  status: "TODO" | "IN_PROGRESS" | "DONE";
}

export default function Badge({ status }: BadgeProps) {
  const variants = {
    TODO: "bg-gray-800 text-gray-300 border-gray-700",
    IN_PROGRESS: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    DONE: "bg-green-500/10 text-green-400 border-green-500/30",
  };

  const labels = {
    TODO: "To Do",
    IN_PROGRESS: "In Progress",
    DONE: "Done",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm",
        variants[status]
      )}
    >
      {labels[status]}
    </span>
  );
}
