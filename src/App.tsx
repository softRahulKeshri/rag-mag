import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import Login from "./components/Login";

// App components
import ChatServiceApp from "./apps/ChatServiceApp/ChatServiceApp";
import PitchAnalyzerApp from "./apps/PitchAnalyzerApp/PitchAnalyzerApp";
import ResumeParserApp from "./apps/ResumeParserApp/ResumeParserApp";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Route: Login */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes (inside Layout) */}
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/resume-parser/*" element={<ResumeParserApp />} />
                <Route path="/pitch-analyzer/*" element={<PitchAnalyzerApp />} />
                <Route path="/chat-service/*" element={<ChatServiceApp />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
