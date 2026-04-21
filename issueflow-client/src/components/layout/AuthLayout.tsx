import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden p-6 md:p-10"
      style={{
        fontFamily: "Poppins, sans-serif",
        background:
          "radial-gradient(circle at 10% 10%, rgba(157,95,212,0.22), transparent 35%), radial-gradient(circle at 90% 15%, rgba(157,95,212,0.18), transparent 30%), linear-gradient(135deg, #f7f2fc 0%, #f3edf9 45%, #efe6f8 100%)",
      }}
    >
      <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#9D5FD4]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-[#9D5FD4]/20 blur-3xl" />

      <Outlet />
    </div>
  );
}
