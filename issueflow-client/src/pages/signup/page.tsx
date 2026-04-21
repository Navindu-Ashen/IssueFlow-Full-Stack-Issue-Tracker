import { SignupForm } from "@/components/signup-form";

export default function SignupPage() {
  return (
    <div className="z-10 w-full max-w-sm md:max-w-4xl">
      <div className="rounded-2xl border border-[#9D5FD4]/20 bg-white/90 p-2 shadow-[0_10px_40px_-15px_rgba(157,95,212,0.45)] backdrop-blur">
        <SignupForm />
      </div>
    </div>
  );
}
