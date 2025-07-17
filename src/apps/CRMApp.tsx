import { Routes, Route } from 'react-router-dom';

const CRMApp = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">CRM App</h1>
      <p>This is the CRM app landing page.</p>
      
      <Routes>
        <Route path="contacts" element={<div>Contacts section</div>} />
        <Route path="leads" element={<div>Leads section</div>} />
        <Route path="opportunities" element={<div>Opportunities section</div>} />
      </Routes>
    </div>
  );
};

export default CRMApp;
