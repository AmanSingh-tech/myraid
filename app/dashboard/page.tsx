"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Search, CheckCircle2, Clock, ListTodo } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import StatsCard from "@/components/StatsCard";
import TaskTable from "@/components/TaskTable";
import Modal from "@/components/Modal";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  createdAt: string;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<{ email: string } | null>(null);

  // Form states
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"TODO" | "IN_PROGRESS" | "DONE">("TODO");

  // Edit states
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  // Fetch user
  useEffect(() => {
    fetchUser();
  }, []);

  // Fetch tasks
  useEffect(() => {
    fetchTasks();
  }, [pagination.page, searchQuery, statusFilter]);

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.data.user);
      } else {
        router.push("/login");
      }
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (statusFilter) {
        params.append("status", statusFilter);
      }

      if (searchQuery) {
        params.append("search", searchQuery);
      }

      const response = await fetch(`/api/tasks?${params}`, {
        credentials: "include",
      });
      const data = await response.json();

      if (response.ok) {
        setTasks(data.data.tasks);
        setPagination(data.data.pagination);
        setError("");
      } else {
        setError(data.message || "Failed to fetch tasks");
      }
    } catch (err) {
      setError("An error occurred while fetching tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ title, description, status }),
      });

      const data = await response.json();

      if (response.ok) {
        setTitle("");
        setDescription("");
        setStatus("TODO");
        setShowCreateForm(false);
        fetchTasks();
      } else {
        setError(data.message || "Failed to create task");
      }
    } catch (err) {
      setError("An error occurred while creating task");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTask = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;

    setLoading(true);

    try {
      const response = await fetch(`/api/tasks/${editingTask.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title: editingTask.title,
          description: editingTask.description,
          status: editingTask.status,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setEditingTask(null);
        fetchTasks();
      } else {
        setError(data.message || "Failed to update task");
      }
    } catch (err) {
      setError("An error occurred while updating task");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    setLoading(true);

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        fetchTasks();
      } else {
        const data = await response.json();
        setError(data.message || "Failed to delete task");
      }
    } catch (err) {
      setError("An error occurred while deleting task");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchTasks();
  };

  // Calculate stats
  const completedTasks = tasks.filter((t) => t.status === "DONE").length;
  const pendingTasks = tasks.filter((t) => t.status === "TODO").length;
  const inProgressTasks = tasks.filter((t) => t.status === "IN_PROGRESS").length;

  return (
    <div className="min-h-screen bg-gray-950">
      <Sidebar onLogout={handleLogout} />
      <Navbar user={user} />

      {/* Main Content */}
      <main className="lg:ml-60 pt-16">
        <div className="px-6 py-8 max-w-7xl mx-auto">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-semibold text-gray-200 mb-2">
              Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""}
            </h2>
            <p className="text-gray-400">Here's what's happening with your tasks today.</p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatsCard
              icon={ListTodo}
              label="Total Tasks"
              value={pagination.total}
              color="slate"
            />
            <StatsCard
              icon={CheckCircle2}
              label="Completed"
              value={completedTasks}
              color="green"
            />
            <StatsCard
              icon={Clock}
              label="In Progress"
              value={inProgressTasks}
              color="indigo"
            />
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 backdrop-blur-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Task Management Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-6"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-200">Tasks</h3>
                <p className="text-sm text-gray-400 mt-1">
                  Manage and track your tasks
                </p>
              </div>
              <button
                onClick={() => setShowCreateForm(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-br from-blue-600 to-purple-600 text-white text-sm font-medium rounded-xl hover:scale-105 transition-all shadow-lg shadow-blue-500/50"
              >
                <Plus className="w-4 h-4" />
                New Task
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6 pb-6 border-b border-gray-800">
              {/* Search */}
              <div className="flex-1">
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tasks..."
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-600 transition-colors"
                  />
                </form>
              </div>

              {/* Status Filter */}
              <div className="sm:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPagination((prev) => ({ ...prev, page: 1 }));
                  }}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-600 transition-colors"
                >
                  <option value="">All Statuses</option>
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </select>
              </div>
            </div>

            {/* Task Table */}
            <TaskTable
              tasks={tasks}
              onEdit={setEditingTask}
              onDelete={handleDeleteTask}
              loading={loading}
            />

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-6 pt-6 border-t border-gray-800 flex items-center justify-between">
                <p className="text-sm text-gray-400">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                  {pagination.total} tasks
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                    }
                    disabled={pagination.page === 1}
                    className="px-4 py-2 text-sm font-medium text-gray-200 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-sm font-medium text-gray-300">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                    }
                    disabled={pagination.page === pagination.totalPages}
                    className="px-4 py-2 text-sm font-medium text-gray-200 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      {/* Create Task Modal */}
      <Modal
        isOpen={showCreateForm}
        onClose={() => {
          setShowCreateForm(false);
          setTitle("");
          setDescription("");
          setStatus("TODO");
        }}
        title="Create New Task"
        onSubmit={handleCreateTask}
        submitLabel="Create Task"
        loading={loading}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-600 transition-colors"
              placeholder="Enter task title"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-600 transition-colors resize-none"
              rows={4}
              placeholder="Enter task description"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Status
            </label>
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "TODO" | "IN_PROGRESS" | "DONE")
              }
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-600 transition-colors"
              disabled={loading}
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* Edit Task Modal */}
      {editingTask && (
        <Modal
          isOpen={true}
          onClose={() => setEditingTask(null)}
          title="Edit Task"
          onSubmit={handleUpdateTask}
          submitLabel="Update Task"
          loading={loading}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title
              </label>
              <input
                type="text"
                value={editingTask.title}
                onChange={(e) =>
                  setEditingTask({ ...editingTask, title: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-600 transition-colors"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={editingTask.description}
                onChange={(e) =>
                  setEditingTask({
                    ...editingTask,
                    description: e.target.value,
                  })
                }
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-600 transition-colors resize-none"
                rows={4}
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status
              </label>
              <select
                value={editingTask.status}
                onChange={(e) =>
                  setEditingTask({
                    ...editingTask,
                    status: e.target.value as "TODO" | "IN_PROGRESS" | "DONE",
                  })
                }
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-600 transition-colors"
                disabled={loading}
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
