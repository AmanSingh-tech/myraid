"use client";

import { Edit2, Trash2 } from "lucide-react";
import Badge from "./Badge";
import { motion } from "framer-motion";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  createdAt: string;
}

interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  loading: boolean;
}

export default function TaskTable({ tasks, onEdit, onDelete, loading }: TaskTableProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-800 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">📋</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-200 mb-2">No tasks yet</h3>
        <p className="text-sm text-gray-500">Create your first task to get started</p>
      </motion.div>
    );
  }

  return (
    <div className="overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Title
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Description
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Created
              </th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <motion.tr
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
              >
                <td className="py-4 px-4">
                  <p className="font-medium text-gray-200">{task.title}</p>
                </td>
                <td className="py-4 px-4">
                  <p className="text-sm text-gray-400 max-w-xs truncate">{task.description}</p>
                </td>
                <td className="py-4 px-4">
                  <Badge status={task.status} />
                </td>
                <td className="py-4 px-4">
                  <p className="text-sm text-gray-400">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </p>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(task)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-500/10 hover:text-blue-400 transition-all text-gray-400"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(task.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-all text-gray-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-xl hover:shadow-2xl hover:shadow-blue-500/5 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-medium text-gray-200 mb-1">{task.title}</h4>
                <p className="text-sm text-gray-400">{task.description}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Badge status={task.status} />
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEdit(task)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-500/10 hover:text-blue-400 transition-all text-gray-400"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(task.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-all text-gray-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
