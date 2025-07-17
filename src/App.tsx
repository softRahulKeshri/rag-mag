


import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Home from './components/Home';

// App components
import AnalyticsApp from './apps/AnalyticsApp';
import MarketingApp from './apps/MarketingApp';
// import CRMApp from './apps/CRMApp';
// import FinanceApp from './apps/FinanceApp';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Super App Header */}
        <header className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-3xl font-bold text-gray-900">Magure Super App</h1>
          </div>
        </header>

        {/* Main App Grid */}
        <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* App Cards */}
            <Link to="/analytics" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold text-gray-900">Analytics</h2>
              <p className="mt-2 text-gray-600">Advanced analytics and reporting</p>
            </Link>

            <Link to="/marketing" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold text-gray-900">Marketing</h2>
              <p className="mt-2 text-gray-600">Marketing automation and campaigns</p>
            </Link>

            <Link to="/crm" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold text-gray-900">CRM</h2>
              <p className="mt-2 text-gray-600">Customer relationship management</p>
            </Link>

            <Link to="/finance" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold text-gray-900">Finance</h2>
              <p className="mt-2 text-gray-600">Financial management and reporting</p>
            </Link>
          </div>

          {/* Nested App Routes */}
          <Routes>
            <Route path="/analytics/*" element={<AnalyticsApp />} />
            <Route path="/marketing/*" element={<MarketingApp />} />
            <Route path="/crm/*" element={<AnalyticsApp />} />
            <Route path="/finance/*" element={<MarketingApp />} />
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
