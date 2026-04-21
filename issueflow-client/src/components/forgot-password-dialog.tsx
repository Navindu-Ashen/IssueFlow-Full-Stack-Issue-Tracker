import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type ForgotStep = "email" | "otp" | "password" | "success";

type ForgotPasswordDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSendOtp?: (email: string) => void | Promise<void>;
  onResendOtp?: (email: string) => void | Promise<void>;
  onVerifyOtp?: (email: string, otp: string) => boolean | Promise<boolean>;
  onResetPassword?: (
    email: string,
    otp: string,
    newPassword: string,
  ) => boolean | Promise<boolean>;
  onSuccess?: (email: string) => void;
};

const OTP_LENGTH = 6;
const OTP_EXPIRY_SECONDS = 10 * 60;

const FORGOT_STEPS: Array<{ value: ForgotStep; label: string }> = [
  { value: "email", label: "Email" },
  { value: "otp", label: "OTP Verification" },
  { value: "password", label: "New Password" },
  { value: "success", label: "Success" },
];

const forgotEmailSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address."),
});

const forgotPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(1, "Password is required.")
      .min(8, "Password must be at least 8 characters long."),
    confirmPassword: z.string().min(1, "Please confirm your new password."),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type ForgotEmailValues = z.infer<typeof forgotEmailSchema>;
type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

function formatSeconds(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function ForgotPasswordDialog({
  open,
  onOpenChange,
  onSendOtp,
  onResendOtp,
  onVerifyOtp,
  onResetPassword,
  onSuccess,
}: ForgotPasswordDialogProps) {
  const [forgotStep, setForgotStep] = useState<ForgotStep>("email");
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [otpSecondsLeft, setOtpSecondsLeft] = useState(OTP_EXPIRY_SECONDS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const emailForm = useForm<ForgotEmailValues>({
    resolver: zodResolver(forgotEmailSchema),
    defaultValues: { email: "" },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const passwordForm = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const currentStepIndex = useMemo(
    () => FORGOT_STEPS.findIndex((step) => step.value === forgotStep),
    [forgotStep],
  );

  const progressValue =
    ((currentStepIndex + 1) / FORGOT_STEPS.length) * 100 || 0;

  const resetForgotPasswordFlow = () => {
    setForgotStep("email");
    setResetEmail("");
    setResetOtp("");
    setOtpSecondsLeft(OTP_EXPIRY_SECONDS);
    setIsSubmitting(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    emailForm.reset({ email: "" });
    passwordForm.reset({ newPassword: "", confirmPassword: "" });
  };

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) resetForgotPasswordFlow();
  };

  useEffect(() => {
    if (forgotStep !== "otp" || otpSecondsLeft <= 0) return;

    const interval = window.setInterval(() => {
      setOtpSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [forgotStep, otpSecondsLeft]);

  const handleSendOtp = async (values: ForgotEmailValues) => {
    const email = values.email.trim();

    try {
      setIsSubmitting(true);
      await onSendOtp?.(email);
      setResetEmail(email);
      setResetOtp("");
      setOtpSecondsLeft(OTP_EXPIRY_SECONDS);
      setForgotStep("otp");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    const email = resetEmail.trim();
    if (!email || isSubmitting) return;

    try {
      setIsSubmitting(true);
      if (onResendOtp) {
        await onResendOtp(email);
      } else {
        await onSendOtp?.(email);
      }
      setResetOtp("");
      setOtpSecondsLeft(OTP_EXPIRY_SECONDS);
      toast.success("A new OTP has been sent to your email.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (resetOtp.length !== OTP_LENGTH || otpSecondsLeft <= 0) return;

    try {
      setIsSubmitting(true);
      const canProceed = onVerifyOtp
        ? await onVerifyOtp(resetEmail.trim(), resetOtp)
        : true;

      if (canProceed !== false) {
        passwordForm.reset({ newPassword: "", confirmPassword: "" });
        setForgotStep("password");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (values: ForgotPasswordValues) => {
    try {
      setIsSubmitting(true);
      const canProceed = onResetPassword
        ? await onResetPassword(resetEmail.trim(), resetOtp, values.newPassword)
        : true;

      if (canProceed !== false) {
        setForgotStep("success");
        onSuccess?.(resetEmail.trim());
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-md border-[#9D5FD4]/20"
        onInteractOutside={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Reset your password</DialogTitle>
          <DialogDescription>
            Follow each step to recover your account securely.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <div className="flex items-center justify-end text-sm">
            <span className="text-muted-foreground">
              {currentStepIndex + 1}/{FORGOT_STEPS.length}
            </span>
          </div>
          <Progress
            value={progressValue}
            className="h-2 bg-[#9D5FD4]/15 *:data-[slot=progress-indicator]:bg-[#8B4FC3]"
          />
        </div>

        <Tabs value={forgotStep}>
          <TabsContent value="email" className="mt-2">
            <form
              id="forgot-password-email-form"
              onSubmit={emailForm.handleSubmit(handleSendOtp)}
            >
              <FieldGroup>
                <Controller
                  name="email"
                  control={emailForm.control}
                  render={({ field, fieldState }) => {
                    const showError =
                      fieldState.invalid &&
                      (fieldState.isTouched ||
                        emailForm.formState.submitCount > 0);

                    return (
                      <Field data-invalid={showError}>
                        <FieldLabel htmlFor="reset-email">
                          Email address
                        </FieldLabel>
                        <Input
                          {...field}
                          id="reset-email"
                          type="email"
                          placeholder="m@example.com"
                          autoComplete="email"
                          aria-invalid={showError}
                        />
                        <div
                          className={cn(
                            "overflow-hidden transition-all duration-200",
                            showError
                              ? "mt-1 max-h-16 translate-y-0 opacity-100"
                              : "max-h-0 -translate-y-1 opacity-0",
                          )}
                        >
                          {showError ? (
                            <FieldError errors={[fieldState.error]} />
                          ) : null}
                        </div>
                      </Field>
                    );
                  }}
                />
                <FieldDescription>
                  We&apos;ll send a one-time verification code to this email.
                </FieldDescription>
                <Button
                  type="submit"
                  form="forgot-password-email-form"
                  className="bg-[#9D5FD4] text-white hover:bg-[#8B4FC3]"
                  disabled={isSubmitting}
                >
                  Send OTP
                </Button>
              </FieldGroup>
            </form>
          </TabsContent>

          <TabsContent value="otp" className="mt-2">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="reset-otp">Enter OTP</FieldLabel>
                <InputOTP
                  id="reset-otp"
                  maxLength={OTP_LENGTH}
                  value={resetOtp}
                  onChange={(value) => setResetOtp(value)}
                  containerClassName="justify-center"
                >
                  <InputOTPGroup>
                    {Array.from({ length: OTP_LENGTH }, (_, index) => (
                      <InputOTPSlot key={index} index={index} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </Field>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Time remaining:{" "}
                  <span className="font-medium text-foreground">
                    {formatSeconds(otpSecondsLeft)}
                  </span>
                </span>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isSubmitting}
                  className="font-medium text-[#9D5FD4] underline-offset-2 transition-colors hover:text-[#8B4FC3] hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline"
                >
                  Resend OTP
                </button>
              </div>

              <FieldDescription>
                Enter the OTP sent to your inbox. The code expires in 10
                minutes.
              </FieldDescription>

              <Button
                type="button"
                onClick={handleVerifyOtp}
                className="bg-[#9D5FD4] text-white hover:bg-[#8B4FC3]"
                disabled={
                  resetOtp.length !== OTP_LENGTH ||
                  otpSecondsLeft <= 0 ||
                  isSubmitting
                }
              >
                Verify OTP
              </Button>
            </FieldGroup>
          </TabsContent>

          <TabsContent value="password" className="mt-2">
            <form
              id="forgot-password-reset-form"
              onSubmit={passwordForm.handleSubmit(handleResetPassword)}
            >
              <FieldGroup>
                <Controller
                  name="newPassword"
                  control={passwordForm.control}
                  render={({ field, fieldState }) => {
                    const showError =
                      fieldState.invalid &&
                      (fieldState.isTouched ||
                        passwordForm.formState.submitCount > 0);

                    return (
                      <Field data-invalid={showError}>
                        <FieldLabel htmlFor="new-password">
                          New password
                        </FieldLabel>
                        <div className="relative">
                          <Input
                            {...field}
                            id="new-password"
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Enter new password"
                            className="pr-10"
                            autoComplete="new-password"
                            aria-invalid={showError}
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword((prev) => !prev)}
                            className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
                            aria-label={
                              showNewPassword
                                ? "Hide new password"
                                : "Show new password"
                            }
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        <div
                          className={cn(
                            "overflow-hidden transition-all duration-200",
                            showError
                              ? "mt-1 max-h-16 translate-y-0 opacity-100"
                              : "max-h-0 -translate-y-1 opacity-0",
                          )}
                        >
                          {showError ? (
                            <FieldError errors={[fieldState.error]} />
                          ) : null}
                        </div>
                      </Field>
                    );
                  }}
                />

                <Controller
                  name="confirmPassword"
                  control={passwordForm.control}
                  render={({ field, fieldState }) => {
                    const showError =
                      fieldState.invalid &&
                      (fieldState.isTouched ||
                        passwordForm.formState.submitCount > 0);

                    return (
                      <Field data-invalid={showError}>
                        <FieldLabel htmlFor="confirm-password">
                          Confirm password
                        </FieldLabel>
                        <div className="relative">
                          <Input
                            {...field}
                            id="confirm-password"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Re-enter new password"
                            className="pr-10"
                            autoComplete="new-password"
                            aria-invalid={showError}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword((prev) => !prev)
                            }
                            className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
                            aria-label={
                              showConfirmPassword
                                ? "Hide confirm password"
                                : "Show confirm password"
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        <div
                          className={cn(
                            "overflow-hidden transition-all duration-200",
                            showError
                              ? "mt-1 max-h-16 translate-y-0 opacity-100"
                              : "max-h-0 -translate-y-1 opacity-0",
                          )}
                        >
                          {showError ? (
                            <FieldError errors={[fieldState.error]} />
                          ) : null}
                        </div>
                      </Field>
                    );
                  }}
                />

                <FieldDescription>
                  Make sure both password fields match.
                </FieldDescription>
                <Button
                  type="submit"
                  form="forgot-password-reset-form"
                  className="bg-[#9D5FD4] text-white hover:bg-[#8B4FC3]"
                  disabled={isSubmitting}
                >
                  Update Password
                </Button>
              </FieldGroup>
            </form>
          </TabsContent>

          <TabsContent value="success" className="mt-2">
            <div className="rounded-xl border border-[#9D5FD4]/20 bg-[#9D5FD4]/5 p-4 text-center">
              <h3 className="text-lg font-semibold text-[#8B4FC3]">
                Password updated successfully
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Your password has been reset for{" "}
                <span className="font-medium text-foreground">
                  {resetEmail || "your account"}
                </span>
                . You can now login using the new password.
              </p>
              <Button
                type="button"
                onClick={() => handleOpenChange(false)}
                className="mt-4 bg-[#9D5FD4] text-white hover:bg-[#8B4FC3]"
              >
                Back to Login
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
