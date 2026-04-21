import type { ReactNode } from "react";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // TODO: Wire up authentication check here.
  // For now, always render children.
  // When auth is implemented:
  //   const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  //   if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
