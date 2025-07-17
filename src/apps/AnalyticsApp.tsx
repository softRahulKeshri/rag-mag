import { Routes, Route } from 'react-router-dom';

const AnalyticsApp = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Analytics App</h1>
      <p>This is the analytics app landing page.</p>
      
      <Routes>
        <Route path="reports" element={<div>Reports section</div>} />
        <Route path="dashboards" element={<div>Dashboards section</div>} />
        <Route path="metrics" element={<div>Metrics section</div>} />
      </Routes>
    </div>
  );
};

export default AnalyticsApp;
