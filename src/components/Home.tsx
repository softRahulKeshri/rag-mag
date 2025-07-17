import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100">
    {/* Main App Grid */}
    <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* App Cards */}
        <Link to="/resume-parser" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-gray-900">Resume Parser</h2>
          <p className="mt-2 text-gray-600">Resume Parser</p>
        </Link>

        <Link to="/pitch-analyzer" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-gray-900">Pitch Analyzer</h2>
          <p className="mt-2 text-gray-600">Pitch Analyzer</p>
        </Link>

        <Link to="/chat-service" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-gray-900">Chat Service</h2>
          <p className="mt-2 text-gray-600">Chat Service</p>
        </Link>
      </div>
    </main>
  </div>
)};

export default Home;
