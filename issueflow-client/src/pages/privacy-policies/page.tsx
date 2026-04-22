export default function PrivacyPoliciesPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 flex flex-col items-center">
      <img src="/logo-primary.png" alt="IssueFlow Logo" className="mb-8 h-12 w-auto" />
      <div className="w-full space-y-8 text-foreground">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#5F2C8A]">Privacy Policy</h1>
          <p className="mt-2 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#5F2C8A]">1. Information We Collect</h2>
          <p className="text-sm leading-7 text-muted-foreground">
            We collect information you provide directly to us when you register for an account, create an issue, or communicate with us. This includes personal information such as your name, email address, and any other details you choose to provide.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#5F2C8A]">2. How We Use Information</h2>
          <p className="text-sm leading-7 text-muted-foreground">
            We use the information we collect to provide, maintain, and improve our services, as well as to communicate with you. Your data helps us personalize your experience and ensure the functionality of our issue tracking platform.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#5F2C8A]">3. Data Security</h2>
          <p className="text-sm leading-7 text-muted-foreground">
            We implement reasonable security measures to protect the confidentiality of your personal information. However, no security system is impenetrable, and we cannot guarantee the security of our systems 100%.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#5F2C8A]">4. User Rights</h2>
          <p className="text-sm leading-7 text-muted-foreground">
            You have the right to access, update, and request deletion of your personal information at any time. You can view your information in the application's user dashboard or contact our support team.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#5F2C8A]">5. Contact Us</h2>
          <p className="text-sm leading-7 text-muted-foreground">
            If you have any questions about this Privacy Policy, please contact us at privacy@issueflow.com.
          </p>
        </section>
      </div>
    </div>
  );
}
