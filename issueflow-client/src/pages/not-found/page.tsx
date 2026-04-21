import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div
      className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 text-center"
      style={{
        fontFamily: "Poppins, sans-serif",
        background:
          "radial-gradient(circle at 10% 10%, rgba(157,95,212,0.22), transparent 35%), radial-gradient(circle at 90% 15%, rgba(157,95,212,0.18), transparent 30%), linear-gradient(135deg, #f7f2fc 0%, #f3edf9 45%, #efe6f8 100%)",
      }}
    >
      <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#9D5FD4]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-[#9D5FD4]/20 blur-3xl" />

      <img src="/icon.png" alt="IssueFlow Logo" className="h-18" />

      <div>
        <h1 className="text-6xl font-bold text-[#9D5FD4]">404</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Oops! The page you're looking for doesn't exist.
        </p>
      </div>

      <Link
        to="/dashboard"
        className="inline-flex items-center rounded-lg bg-[#9D5FD4] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#8B4FC3]"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
