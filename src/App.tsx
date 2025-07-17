


import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';

// App components
import ChatServiceApp from './apps/ChatServiceApp/ChatServiceApp';
import PitchAnalyzerApp from './apps/PitchAnalyzerApp/PitchAnalyzerApp';
import ResumeParserApp from './apps/ResumeParserApp/ResumeParserApp';

const App = () => {
  return (
    <Router>


          {/* Nested App Routes */}
          <Routes>
            <Route path="/resume-parser/*" element={<ResumeParserApp />} />
            <Route path="/pitch-analyzer/*" element={<PitchAnalyzerApp />} />
            <Route path="/chat-service/*" element={<ChatServiceApp />} />
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
    </Router>
  );
};

export default App;
