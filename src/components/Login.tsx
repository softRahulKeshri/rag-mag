import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useActions, useAuth, useError } from "../store";
import { useToast } from "./ui/ToastContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Global store hooks
  const { login } = useActions();
  const { isLoading } = useAuth();
  const authError = useError('auth');
  const { showToast } = useToast();

  const handleSignupRedirect = () => {
    navigate("/signup");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      showToast("Please fill in all fields", "error");
      return;
    }

    try {
      await login({ username: username.trim(), password });

      // Store token for compatibility with existing auth system
      localStorage.setItem("token", "authenticated");

      showToast("Login successful! Welcome back!", "success");
      navigate("/");
    } catch (error) {
      // Error is already handled by the global store, but we can show a specific message
      const errorMessage = authError || (error instanceof Error ? error.message : "Login failed");

      // Handle specific error cases
      if (
        errorMessage.includes("not found") ||
        errorMessage.includes("does not exist")
      ) {
        showToast(
          "User not found. Please check your username or sign up.",
          "error"
        );
      } else if (
        errorMessage.includes("password") ||
        errorMessage.includes("invalid")
      ) {
        showToast("Invalid password. Please try again.", "error");
      } else {
        showToast(errorMessage, "error");
      }
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4">
      {/* Premium Animated Background Elements */}

      {/* Main Gradient Orbs */}
      <div className="absolute top-[-200px] left-[-150px] w-[500px] h-[500px] bg-gradient-to-br from-blue-400/20 via-purple-400/15 to-cyan-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse"></div>
      <div
        className="absolute bottom-[-200px] right-[-150px] w-[600px] h-[600px] bg-gradient-to-br from-purple-400/20 via-pink-400/15 to-indigo-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute top-[30%] right-[15%] w-[300px] h-[300px] bg-gradient-to-br from-cyan-400/15 via-blue-400/10 to-purple-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>

      {/* Floating Geometric Shapes */}
      <div className="absolute top-[20%] left-[10%] w-16 h-16 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg rotate-45 animate-float"></div>
      <div
        className="absolute bottom-[30%] left-[20%] w-12 h-12 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full animate-float"
        style={{ animationDelay: "1.5s" }}
      ></div>
      <div
        className="absolute top-[60%] right-[25%] w-20 h-20 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-lg rotate-12 animate-float"
        style={{ animationDelay: "2.5s" }}
      ></div>

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(156, 146, 172, 0.03) 1px, transparent 0)`,
            backgroundSize: "60px 60px",
          }}
        ></div>
      </div>

      {/* Animated Light Rays */}
      <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-400/20 to-transparent animate-pulse"></div>
      <div
        className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-purple-400/20 to-transparent animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      {/* Floating Particles */}
      <div className="absolute top-[15%] left-[15%] w-2 h-2 bg-blue-400/30 rounded-full animate-bounce"></div>
      <div
        className="absolute top-[25%] right-[20%] w-1 h-1 bg-purple-400/40 rounded-full animate-bounce"
        style={{ animationDelay: "0.5s" }}
      ></div>
      <div
        className="absolute bottom-[20%] left-[30%] w-1.5 h-1.5 bg-cyan-400/35 rounded-full animate-bounce"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute bottom-[35%] right-[10%] w-1 h-1 bg-pink-400/30 rounded-full animate-bounce"
        style={{ animationDelay: "1.5s" }}
      ></div>

      {/* Premium Glass Morphism Card */}
      <div className="z-10 w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 space-y-6 border border-white/20">
        <div className="text-center">
          <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Magure
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">Welcome Back</h2>
          <p className="text-gray-500 text-sm">
            Sign in to continue to your dashboard
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              required
              placeholder="Enter your username"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 text-white font-semibold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-700 hover:via-purple-700 hover:to-blue-700 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <span
            onClick={handleSignupRedirect}
            className="text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer transition-colors duration-200"
          >
            Sign up
          </span>
        </p>
      </div>

      {/* Additional Premium Effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/5 pointer-events-none"></div>
    </div>
  );
};

export default Login;
