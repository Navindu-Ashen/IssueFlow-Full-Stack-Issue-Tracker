import { useEffect, useState } from "react";
import DashboardPage from "@/pages/dashboard/page";
import LoginPage from "@/pages/login/page";
import SignupPage from "@/pages/signup/page";

type AppRoute = "/login" | "/signup" | "/dashboard";

const normalizeRoute = (pathname: string): AppRoute => {
  const cleanPath = pathname.replace(/\/+$/, "") || "/";

  if (cleanPath === "/signup") return "/signup";
  if (cleanPath === "/dashboard") return "/dashboard";
  return "/login";
};

function App() {
  const [route, setRoute] = useState<AppRoute>(() => {
    if (typeof window === "undefined") return "/login";
    return normalizeRoute(window.location.pathname);
  });

  const navigate = (nextRoute: AppRoute, replace = false) => {
    if (typeof window === "undefined") return;

    if (replace) {
      window.history.replaceState(null, "", nextRoute);
    } else {
      window.history.pushState(null, "", nextRoute);
    }

    setRoute(nextRoute);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";

    // Force unknown paths to /login without triggering a state update in the effect body
    if (!["/login", "/signup", "/dashboard"].includes(currentPath)) {
      window.history.replaceState(null, "", "/login");
    }

    const handlePopState = () => {
      setRoute(normalizeRoute(window.location.pathname));
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  if (route === "/dashboard") {
    return <DashboardPage />;
  }

  if (route === "/signup") {
    return (
      <SignupPage
        onCreateAccount={() => navigate("/dashboard")}
        onNavigateToLogin={() => navigate("/login")}
      />
    );
  }

  return (
    <LoginPage
      onLogin={() => navigate("/dashboard")}
      onNavigateToSignup={() => navigate("/signup")}
    />
  );
}

export default App;
