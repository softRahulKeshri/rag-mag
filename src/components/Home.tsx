import { Link } from "react-router-dom";

const Home = () => {
  const apps = [
    {
      id: "resume-parser",
      title: "Resume Parser",
      description:
        "Intelligent resume analysis and parsing with advanced AI capabilities",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1v5h5v10H6V3h7z" />
          <path d="M9 12h6v2H9zm0 4h6v2H9z" />
        </svg>
      ),
      gradient: "from-purple-500 to-indigo-600",
      bgGradient: "from-purple-50 to-indigo-50",
    },
    {
      id: "pitch-analyzer",
      title: "Pitch Analyzer",
      description: "Comprehensive pitch analysis and feedback system",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      ),
      gradient: "from-emerald-500 to-teal-600",
      bgGradient: "from-emerald-50 to-teal-50",
    },
    {
      id: "chat-service",
      title: "Chat Service",
      description: "Advanced AI-powered chat and communication platform",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
        </svg>
      ),
      gradient: "from-blue-500 to-cyan-600",
      bgGradient: "from-blue-50 to-cyan-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-indigo-50/50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-indigo-200/20 to-transparent rounded-full blur-3xl"></div>

      {/* Main content */}
      <div className="relative z-10">
        {/* Header Section */}
        <header className="text-center pt-16 pb-12 px-6">
          <div className="max-w-4xl mx-auto">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <img 
                src="/magure_ai_logo.svg" 
                alt="Magure AI Logo" 
                className="h-20 w-auto md:h-24"
              />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              Welcome to Magure.ai
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Discover our suite of intelligent AI-powered tools designed to
              enhance your productivity and decision-making capabilities.
            </p>
          </div>
        </header>

        {/* Apps Grid */}
        <main className="max-w-7xl mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {apps.map((app) => (
              <Link key={app.id} to={`/${app.id}`} className="group relative">
                <div className="relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                  {/* Card background gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${app.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  ></div>

                  {/* Card content */}
                  <div className="relative p-8">
                    {/* Icon */}
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r ${app.gradient} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      {app.icon}
                    </div>

                    {/* Title and description */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors">
                      {app.title}
                    </h2>
                    <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                      {app.description}
                    </p>

                    {/* Arrow indicator */}
                    <div className="mt-6 flex items-center text-purple-600 font-medium group-hover:text-purple-700 transition-colors">
                      <span>Get Started</span>
                      <svg
                        className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                </div>
              </Link>
            ))}
          </div>
        </main>

        {/* Footer section */}
        <footer className="text-center py-12 px-6">
          <div className="max-w-2xl mx-auto">
            <p className="text-gray-500 text-sm">
              Powered by advanced AI technology • Built for modern professionals
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
