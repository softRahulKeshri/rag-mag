import { Routes, Route } from 'react-router-dom';

const FinanceApp = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Finance App</h1>
      <p>This is the finance app landing page.</p>
      
      <Routes>
        <Route path="reports" element={<div>Financial Reports</div>} />
        <Route path="budgets" element={<div>Budget Management</div>} />
        <Route path="analytics" element={<div>Financial Analytics</div>} />
      </Routes>
    </div>
  );
};

export default FinanceApp;
