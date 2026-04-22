export default function TermsAndConditionsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 flex flex-col items-center">
      <img src="/logo-primary.png" alt="IssueFlow Logo" className="mb-8 h-12 w-auto" />
      <div className="w-full space-y-8 text-foreground">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#5F2C8A]">Terms and Conditions</h1>
          <p className="mt-2 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#5F2C8A]">1. Acceptance of Terms</h2>
          <p className="text-sm leading-7 text-muted-foreground">
            By accessing or using the IssueFlow service, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree, you must cease using our application immediately.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#5F2C8A]">2. User Conduct</h2>
          <p className="text-sm leading-7 text-muted-foreground">
            You agree not to use the service for any unlawful purpose or in any way that interrupts, damages, or impairs the service. You are solely responsible for interactions with other users and any content you post, including issues and comments.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#5F2C8A]">3. Account Registration</h2>
          <p className="text-sm leading-7 text-muted-foreground">
            To use certain features of the service, you must register for an account. You agree to provide accurate, current, and complete information and keep your password confidential.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#5F2C8A]">4. Limitation of Liability</h2>
          <p className="text-sm leading-7 text-muted-foreground">
            IssueFlow and its affiliates will not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service, or any unauthorized access to your data.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#5F2C8A]">5. Changes to Terms</h2>
          <p className="text-sm leading-7 text-muted-foreground">
            We reserve the right to modify these terms at any time. We will post the most current version on our site, and continued use of the service constitutes acceptance of the new terms.
          </p>
        </section>
      </div>
    </div>
  );
}
