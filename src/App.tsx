


import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';

// App components
import AnalyticsApp from './apps/AnalyticsApp';
import MarketingApp from './apps/MarketingApp';
import CRMApp from './apps/CRMApp';
import FinanceApp from './apps/FinanceApp';
// import CRMApp from './apps/CRMApp';
// import FinanceApp from './apps/FinanceApp';

const App = () => {
  return (
    <Router>


          {/* Nested App Routes */}
          <Routes>
            <Route path="/analytics/*" element={<AnalyticsApp />} />
            <Route path="/marketing/*" element={<MarketingApp />} />
            <Route path="/crm/*" element={<CRMApp />} />
            <Route path="/finance/*" element={<FinanceApp />} />
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
    </Router>
  );
};

export default App;
