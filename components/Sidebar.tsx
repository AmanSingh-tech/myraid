"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  CheckSquare, 
  User, 
  LogOut 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onLogout: () => void;
}

export default function Sidebar({ onLogout }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Tasks",
      href: "/dashboard#tasks",
      icon: CheckSquare,
    },
    {
      name: "Profile",
      href: "/dashboard#profile",
      icon: User,
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-60 h-screen bg-gray-900 border-r border-gray-800 fixed left-0 top-0">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/50">
            <CheckSquare className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-gray-200">Task Manager</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href.includes("#") && pathname === "/dashboard");
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:scale-105",
                isActive
                  ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30"
                  : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-gray-200 hover:scale-105 transition-all"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
