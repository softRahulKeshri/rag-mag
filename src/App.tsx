import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AuthGuard from "./components/AuthGuard";

// App components
import ChatServiceApp from "./apps/ChatServiceApp/ChatServiceApp";
import PitchAnalyzerApp from "./apps/PitchAnalyzerApp/PitchAnalyzerApp";
import ResumeParserApp from "./apps/ResumeParserApp/ResumeParserApp";
import ProfilePage from "./components/ProfilePage";

// Toast Provider
import { ToastProvider } from "./components/ui/ToastContext";

const App = () => {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          {/* Public Routes: Login & Signup */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes (wrapped with AuthGuard) */}
          <Route
            path="/*"
            element={
              <AuthGuard>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route
                      path="/resume-parser/*"
                      element={<ResumeParserApp />}
                    />
                    <Route
                      path="/pitch-analyzer/*"
                      element={<PitchAnalyzerApp />}
                    />
                    <Route path="/chat-service/*" element={<ChatServiceApp />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Layout>
              </AuthGuard>
            }
          />
        </Routes>
      </Router>
    </ToastProvider>
  );
};

export default App;
