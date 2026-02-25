"use client";

import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  color: "indigo" | "green" | "slate";
}

export default function StatsCard({ icon: Icon, label, value, color }: StatsCardProps) {
  const colorClasses = {
    indigo: "from-blue-600 to-blue-700",
    green: "from-green-600 to-green-700",
    slate: "from-gray-600 to-gray-700",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 transition-all hover:scale-105 duration-300"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400 mb-1">{label}</p>
          <p className="text-3xl font-semibold text-gray-200">{value}</p>
        </div>
        <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
}
