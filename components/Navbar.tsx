"use client";

import { User } from "lucide-react";

interface NavbarProps {
  user: { email: string } | null;
}

export default function Navbar({ user }: NavbarProps) {
  return (
    <header className="h-16 bg-gray-900 border-b border-gray-800 sticky top-0 z-40 lg:ml-60">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-200">Dashboard</h1>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-300">{user.email}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/50">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
