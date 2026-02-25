import Link from "next/link";
import { CheckSquare, Shield, Lock, Database, Search, ShieldCheck, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-200">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-gray-950 pointer-events-none" />
        
        <div className="relative max-w-6xl mx-auto px-4 py-20 sm:py-32">
          <div className="text-center mb-16">
            {/* Logo with 3D effect */}
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl mb-8 shadow-2xl shadow-blue-500/50 transform hover:scale-105 transition-all duration-300">
              <CheckSquare className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="text-6xl sm:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Task Manager Pro
            </h1>
            
            <p className="text-2xl text-blue-400 mb-4 font-semibold">
              Secure Task Management with JWT Authentication
            </p>
            
            <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-12">
              A production-grade full stack application demonstrating authentication, security and scalable architecture.
            </p>

            {/* CTA Buttons with 3D effect */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link
                href="/dashboard"
                className="group flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-br from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-2xl shadow-blue-500/50 hover:shadow-blue-500/70 hover:scale-105 transition-all duration-300"
              >
                Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/login"
                className="px-8 py-4 bg-gray-900 border-2 border-gray-800 text-gray-200 font-semibold rounded-xl hover:bg-gray-800 hover:border-gray-700 hover:scale-105 transition-all duration-300 shadow-xl"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="px-8 py-4 bg-gray-900 border-2 border-gray-800 text-gray-200 font-semibold rounded-xl hover:bg-gray-800 hover:border-gray-700 hover:scale-105 transition-all duration-300 shadow-xl"
              >
                Register
              </Link>
            </div>

            {/* Protected Route Testing */}
            <div className="inline-block bg-blue-500/10 backdrop-blur-sm border border-blue-500/30 rounded-xl px-6 py-3">
              <div className="flex items-center gap-2 text-blue-400 text-sm">
                <Shield className="w-5 h-5" />
                <span>Click Dashboard without logging in to test route protection.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-4 text-gray-200">Features</h2>
        <p className="text-center text-gray-400 mb-12">Enterprise-grade security and functionality</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature Card 1 */}
          <div className="group bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl mb-4 shadow-lg group-hover:shadow-blue-500/50 transition-shadow">
              <Lock className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-200">Secure Authentication</h3>
            <p className="text-gray-400">JWT-based authentication with HTTP-only cookies and bcrypt password hashing.</p>
          </div>

          {/* Feature Card 2 */}
          <div className="group bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl mb-4 shadow-lg group-hover:shadow-purple-500/50 transition-shadow">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-200">Protected APIs</h3>
            <p className="text-gray-400">Middleware-protected routes ensuring secure access to resources.</p>
          </div>

          {/* Feature Card 3 */}
          <div className="group bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl mb-4 shadow-lg group-hover:shadow-blue-500/50 transition-shadow">
              <Database className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-200">Encrypted Data</h3>
            <p className="text-gray-400">AES-256-CBC encryption for sensitive task descriptions.</p>
          </div>

          {/* Feature Card 4 */}
          <div className="group bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mb-4 shadow-lg group-hover:shadow-blue-500/50 transition-shadow">
              <Database className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-200">Prisma ORM</h3>
            <p className="text-gray-400">Type-safe database queries with PostgreSQL and Prisma.</p>
          </div>

          {/* Feature Card 5 */}
          <div className="group bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl mb-4 shadow-lg group-hover:shadow-purple-500/50 transition-shadow">
              <Search className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-200">Pagination and Search</h3>
            <p className="text-gray-400">Built-in pagination, filtering, and search capabilities.</p>
          </div>

          {/* Feature Card 6 */}
          <div className="group bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl mb-4 shadow-lg group-hover:shadow-blue-500/50 transition-shadow">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-200">Middleware Protection</h3>
            <p className="text-gray-400">Next.js middleware for comprehensive route protection.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
