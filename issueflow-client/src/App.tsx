import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

import AuthLayout from "@/components/layout/AuthLayout";
import MainLayout from "@/components/layout/MainLayout";

import LoginPage from "@/pages/login/page";
import SignupPage from "@/pages/signup/page";
import DashboardPage from "@/pages/dashboard/page";
import IssuesPage from "@/pages/issues/page";
import ActivitiesPage from "@/pages/activities/page";
import PrivacyPoliciesPage from "@/pages/privacy-policies/page";
import TermsAndConditionsPage from "@/pages/terms-and-conditions/page";
import NotFoundPage from "@/pages/not-found/page";

import ProtectedRoute from "@/components/shared/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/privacy-policies" element={<PrivacyPoliciesPage />} />
          <Route
            path="/terms-and-conditions"
            element={<TermsAndConditionsPage />}
          />
        </Route>

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/issues" element={<IssuesPage />} />
          <Route path="/activities" element={<ActivitiesPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Toaster position="top-right" />
    </Router>
  );
}

export default App;
