import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  DocumentTextIcon,
  CheckCircleIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightIcon,
  SparklesIcon,
  RocketLaunchIcon,
  CpuChipIcon,
} from "@heroicons/react/24/outline";

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const apps = [
    {
      id: "resume-parser",
      title: "Resume Parser",
      description:
        "Intelligent resume analysis and parsing with advanced AI capabilities",
      icon: <DocumentTextIcon className="w-8 h-8" />,
      gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
      bgGradient: "from-violet-50 via-purple-50 to-fuchsia-50",
      hoverGradient: "from-violet-600 via-purple-600 to-fuchsia-600",
      features: [
        "AI-Powered Analysis",
        "Smart Extraction",
        "Real-time Processing",
      ],
    },
    {
      id: "pitch-analyzer",
      title: "Pitch Analyzer",
      description: "Comprehensive pitch analysis and feedback system",
      icon: <CheckCircleIcon className="w-8 h-8" />,
      gradient: "from-emerald-500 via-teal-500 to-cyan-500",
      bgGradient: "from-emerald-50 via-teal-50 to-cyan-50",
      hoverGradient: "from-emerald-600 via-teal-600 to-cyan-600",
      features: ["Deep Insights", "Performance Metrics", "Actionable Feedback"],
    },
    {
      id: "chat-service",
      title: "Chat Service",
      description: "Advanced AI-powered chat and communication platform",
      icon: <ChatBubbleLeftRightIcon className="w-8 h-8" />,
      gradient: "from-blue-500 via-indigo-500 to-purple-500",
      bgGradient: "from-blue-50 via-indigo-50 to-purple-50",
      hoverGradient: "from-blue-600 via-indigo-600 to-purple-600",
      features: [
        "Smart Conversations",
        "Multi-modal Support",
        "Context Awareness",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating orbs */}
        <div
          className={`absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl transition-all duration-1000 ${
            isLoaded ? "animate-pulse" : "opacity-0"
          }`}
        ></div>
        <div
          className={`absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl transition-all duration-1000 delay-300 ${
            isLoaded ? "animate-pulse" : "opacity-0"
          }`}
        ></div>
        <div
          className={`absolute bottom-20 left-1/4 w-80 h-80 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl transition-all duration-1000 delay-500 ${
            isLoaded ? "animate-pulse" : "opacity-0"
          }`}
        ></div>

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px] opacity-30"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <header className="text-center pt-20 pb-16 px-6">
          <div className="max-w-5xl mx-auto">
            {/* Animated logo */}
            <div
              className={`flex justify-center mb-8 transition-all duration-1000 ${
                isLoaded
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <div className="relative group">
                <img
                  src="/magure_ai_logo.svg"
                  alt="Magure AI Logo"
                  className="h-24 w-auto md:h-32 transition-all duration-500 group-hover:scale-110 drop-shadow-2xl"
                />
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/30 via-blue-400/30 to-pink-400/30 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>

            {/* Main heading with animated gradient */}
            <h1
              className={`text-6xl md:text-7xl font-bold mb-6 transition-all duration-1000 delay-200 ${
                isLoaded
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent animate-gradient-x">
                Welcome to Magure.ai
              </span>
            </h1>

            {/* Subtitle with typing effect */}
            <p
              className={`text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-400 ${
                isLoaded
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              Discover our suite of intelligent AI-powered tools designed to
              enhance your productivity and decision-making capabilities.
            </p>

            {/* Feature highlights */}
            <div
              className={`flex flex-wrap justify-center gap-6 mt-8 transition-all duration-1000 delay-600 ${
                isLoaded
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <div className="flex items-center space-x-2 text-sm text-gray-600 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200/50">
                <SparklesIcon className="w-4 h-4 text-purple-500" />
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200/50">
                <RocketLaunchIcon className="w-4 h-4 text-blue-500" />
                <span>Lightning Fast</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200/50">
                <CpuChipIcon className="w-4 h-4 text-emerald-500" />
                <span>Smart Analytics</span>
              </div>
            </div>
          </div>
        </header>

        {/* Apps Grid */}
        <main className="max-w-7xl mx-auto px-6 pb-20">
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-1000 delay-700 ${
              isLoaded
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            {apps.map((app) => (
              <Link key={app.id} to={`/${app.id}`} className="group relative">
                <div className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-white/20">
                  {/* Animated background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${app.bgGradient} opacity-0 group-hover:opacity-100 transition-all duration-700`}
                  ></div>

                  {/* Floating particles effect */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all duration-500 delay-100"></div>
                    <div className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all duration-500 delay-200"></div>
                    <div className="absolute top-1/2 right-8 w-1 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-500 delay-300"></div>
                  </div>

                  {/* Card content */}
                  <div className="relative p-8">
                    {/* Icon with enhanced animation */}
                    <div
                      className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r ${app.gradient} text-white mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg group-hover:shadow-xl`}
                    >
                      <div className="group-hover:animate-pulse">
                        {app.icon}
                      </div>
                    </div>

                    {/* Title with enhanced typography */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors duration-300">
                      {app.title}
                    </h2>

                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300 mb-6">
                      {app.description}
                    </p>

                    {/* Feature list */}
                    <div className="space-y-2 mb-6">
                      {app.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-center space-x-2 text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300"
                        >
                          <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Enhanced CTA */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-purple-600 font-semibold group-hover:text-purple-700 transition-colors duration-300">
                        <span>Get Started</span>
                        <ArrowRightIcon className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform duration-300" />
                      </div>

                      {/* Status indicator */}
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-gray-500">Live</span>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced hover overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${app.hoverGradient} opacity-0 group-hover:opacity-5 transition-opacity duration-700 rounded-3xl`}
                  ></div>

                  {/* Border glow effect */}
                  <div
                    className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${app.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10 blur-xl`}
                  ></div>
                </div>
              </Link>
            ))}
          </div>
        </main>

        {/* Enhanced Footer */}
        <footer className="text-center py-16 px-6 relative">
          <div className="max-w-4xl mx-auto">
            {/* Decorative line */}
            <div className="w-24 h-1 bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 rounded-full mx-auto mb-8"></div>

            <p className="text-gray-600 text-lg font-medium">
              Powered by advanced AI technology • Built for modern professionals
            </p>

            {/* Additional footer content */}
            <div className="flex justify-center space-x-8 mt-6 text-sm text-gray-500">
              <span>© 2024 Magure.ai</span>
              <span>•</span>
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
