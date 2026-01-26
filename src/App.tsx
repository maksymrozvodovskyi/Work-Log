import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { NuqsAdapter } from "nuqs/adapters/react-router";
import MainLayout from "@/layout/MainLayout";
import AuthLayout from "@/layout/AuthLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import RangePage from "@/pages/RangePage";
import ReportsPage from "@/pages/ReportsPage";
import ProjectsPage from "@/pages/ProjectsPage";
import VacationPage from "./pages/VacationPage";
import AnnouncementsPage from "@/pages/AnnouncementsPage";
import FeedbacksPage from "@/pages/FeedbacksPage";
import QAPage from "@/pages/QAPage";
import ClientsPage from "@/pages/ClientsPage";
import SettingsPage from "@/pages/SettingsPage";
import UserProfilePage from "@/pages/UserProfilePage/index";
import ResumeTab from "@/pages/UserProfilePage/components/ResumeTab";
import TimeTrackerTab from "@/pages/UserProfilePage/components/TimeTrackerTab";
import VacationTab from "@/pages/UserProfilePage/components/VacationTab";
import SubTechnologiesTab from "@/pages/UserProfilePage/components/SubTechnologiesTab";
import ProjectsTab from "@/pages/UserProfilePage/components/ProjectsTab";
import RangeTab from "@/pages/UserProfilePage/components/RangeTab";
import TeamTab from "@/pages/UserProfilePage/components/TeamTab";
import OvertimeTab from "@/pages/UserProfilePage/components/OvertimeTab";
import FeedbacksTab from "@/pages/UserProfilePage/components/FeedbacksTab";
import LoginPage from "@/pages/LoginPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import VerifyCodePage from "@/pages/VerifyCodePage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";

export default function App() {
  return (
    <NuqsAdapter>
      <BrowserRouter>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/verify-code" element={<VerifyCodePage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Route>
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<RangePage />} />
            <Route path="/range" element={<RangePage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/vacations" element={<VacationPage />} />
            <Route path="/announcements" element={<AnnouncementsPage />} />
            <Route path="/feedbacks" element={<FeedbacksPage />} />
            <Route path="/qa" element={<QAPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/users/:id" element={<UserProfilePage />}>
              <Route path="resume" element={<ResumeTab />} />
              <Route path="time-tracker" element={<TimeTrackerTab />} />
              <Route path="vacation" element={<VacationTab />} />
              <Route path="sub-technologies" element={<SubTechnologiesTab />} />
              <Route path="projects" element={<ProjectsTab />} />
              <Route path="range" element={<RangeTab />} />
              <Route path="team" element={<TeamTab />} />
              <Route path="overtime" element={<OvertimeTab />} />
              <Route path="feedbacks" element={<FeedbacksTab />} />
              <Route index element={<Navigate to="resume" replace />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </NuqsAdapter>
  );
}
