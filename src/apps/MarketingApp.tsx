import { Routes, Route } from 'react-router-dom';

const MarketingApp = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Marketing App</h1>
      <p>This is the marketing app landing page.</p>
      
      <Routes>
        <Route path="campaigns" element={<div>Campaigns section</div>} />
        <Route path="automation" element={<div>Automation section</div>} />
        <Route path="analytics" element={<div>Analytics section</div>} />
      </Routes>
    </div>
  );
};

export default MarketingApp;
