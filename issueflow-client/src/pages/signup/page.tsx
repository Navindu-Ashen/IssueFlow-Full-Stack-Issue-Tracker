import { SignupForm } from "@/components/signup-form";

type SignupPageProps = {
  onCreateAccount?: () => void;
  onNavigateToLogin?: () => void;
};

export default function SignupPage({
  onCreateAccount,
  onNavigateToLogin,
}: SignupPageProps) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <SignupForm
          onCreateAccount={onCreateAccount}
          onNavigateToLogin={onNavigateToLogin}
        />
      </div>
    </div>
  );
}
