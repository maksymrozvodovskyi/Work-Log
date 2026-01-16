import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NuqsAdapter } from "nuqs/adapters/react-router";
import MainLayout from "@/layout/MainLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import HomePage from "@/pages/HomePage";
import RangePage from "@/pages/RangePage";
import ReportsPage from "@/pages/ReportsPage";
import ProjectsPage from "@/pages/ProjectsPage";
import VacationsPage from "@/pages/VacationsPage";
import AnnouncementsPage from "@/pages/AnnouncementsPage";
import FeedbacksPage from "@/pages/FeedbacksPage";
import QAPage from "@/pages/QAPage";
import ClientsPage from "@/pages/ClientsPage";
import SettingsPage from "@/pages/SettingsPage";
import LoginPage from "@/pages/LoginPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import VerifyCodePage from "@/pages/VerifyCodePage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";

export default function App() {
  return (
    <NuqsAdapter>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-code" element={<VerifyCodePage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<HomePage />} />
            <Route path="/range" element={<RangePage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/vacations" element={<VacationsPage />} />
            <Route path="/announcements" element={<AnnouncementsPage />} />
            <Route path="/feedbacks" element={<FeedbacksPage />} />
            <Route path="/qa" element={<QAPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </NuqsAdapter>
  );
}
