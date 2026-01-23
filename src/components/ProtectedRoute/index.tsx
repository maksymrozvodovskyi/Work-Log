import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

type ProtectedRoutePropsType = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRoutePropsType) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
