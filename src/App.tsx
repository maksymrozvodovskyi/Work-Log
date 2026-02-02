import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { NuqsAdapter } from "nuqs/adapters/react-router";
import MainLayout from "@/layout/MainLayout";
import AuthLayout from "@/layout/AuthLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import Loader from "@/components/Loader";

const RangePage = lazy(() => import("@/pages/RangePage"));
const ReportsPage = lazy(() => import("@/pages/ReportsPage"));
const ProjectsPage = lazy(() => import("@/pages/ProjectsPage"));
const ProjectsTimelinePage = lazy(() => import("@/pages/ProjectsTimelinePage"));
const VacationPage = lazy(() => import("@/pages/VacationPage"));
const AnnouncementsPage = lazy(() => import("@/pages/AnnouncementsPage"));
const FeedbacksPage = lazy(() => import("@/pages/FeedbacksPage"));
const QAPage = lazy(() => import("@/pages/QAPage"));
const ClientsPage = lazy(() => import("@/pages/ClientsPage"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage"));
const UserProfilePage = lazy(() => import("@/pages/UserProfilePage/index"));
const ResumeTab = lazy(() => import("@/pages/UserProfilePage/components/ResumeTab"));
const TimeTrackerTab = lazy(() => import("@/pages/UserProfilePage/components/TimeTrackerTab"));
const VacationTab = lazy(() => import("@/pages/UserProfilePage/components/VacationTab"));
const SubTechnologiesTab = lazy(() => import("@/pages/UserProfilePage/components/SubTechnologiesTab"));
const ProjectsTab = lazy(() => import("@/pages/UserProfilePage/components/ProjectsTab"));
const RangeTab = lazy(() => import("@/pages/UserProfilePage/components/RangeTab"));
const TeamTab = lazy(() => import("@/pages/UserProfilePage/components/TeamTab"));
const OvertimeTab = lazy(() => import("@/pages/UserProfilePage/components/OvertimeTab"));
const FeedbacksTab = lazy(() => import("@/pages/UserProfilePage/components/FeedbacksTab"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const ForgotPasswordPage = lazy(() => import("@/pages/ForgotPasswordPage"));
const VerifyCodePage = lazy(() => import("@/pages/VerifyCodePage"));
const ResetPasswordPage = lazy(() => import("@/pages/ResetPasswordPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

export default function App() {
  return (
    <NuqsAdapter>
      <BrowserRouter>
        <Suspense fallback={<Loader size="large" />}>
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
              <Route path="/projects/timeline" element={<ProjectsTimelinePage />} />
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
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </NuqsAdapter>
  );
}
