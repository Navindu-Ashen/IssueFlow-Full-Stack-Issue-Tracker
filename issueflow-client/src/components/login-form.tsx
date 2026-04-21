import { useState, type ComponentProps } from "react";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ForgotPasswordDialog } from "@/components/forgot-password-dialog";

type LoginFormProps = ComponentProps<"div">;

const loginFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address."),
  password: z.string(),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export function LoginForm({ className, ...props }: LoginFormProps) {
  const navigate = useNavigate();
  const [forgotOpen, setForgotOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const onSubmit = () => {
    navigate("/dashboard");
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            className="p-6 md:p-8"
            onSubmit={form.handleSubmit(onSubmit)}
            id="login-form"
          >
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <img
                  src="/icon.png"
                  alt="IssueFlow Logo"
                  className="h-18 mb-2"
                />
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Login to your IssueFlow account
                </p>
              </div>

              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => {
                  const showEmailError =
                    fieldState.invalid &&
                    (fieldState.isTouched || form.formState.submitCount > 0);

                  return (
                    <Field data-invalid={showEmailError}>
                      <FieldLabel htmlFor="login-email">Email</FieldLabel>
                      <Input
                        {...field}
                        id="login-email"
                        type="email"
                        placeholder="m@example.com"
                        aria-invalid={showEmailError}
                        autoComplete="email"
                      />
                      <div
                        className={cn(
                          "overflow-hidden transition-all duration-200",
                          showEmailError
                            ? "mt-1 max-h-16 translate-y-0 opacity-100"
                            : "max-h-0 -translate-y-1 opacity-0",
                        )}
                      >
                        {showEmailError ? (
                          <FieldError errors={[fieldState.error]} />
                        ) : null}
                      </div>
                    </Field>
                  );
                }}
              />

              <Controller
                name="password"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="login-password">Password</FieldLabel>
                      <button
                        type="button"
                        onClick={() => setForgotOpen(true)}
                        className="ml-auto text-sm text-[#9D5FD4] underline-offset-2 transition-colors hover:text-[#8B4FC3] hover:underline"
                      >
                        Forgot your password?
                      </button>
                    </div>
                    <div className="relative">
                      <Input
                        {...field}
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        className="pr-10"
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </Field>
                )}
              />

              <Field>
                <Button
                  type="submit"
                  form="login-form"
                  className="bg-[#9D5FD4] text-white hover:bg-[#8B4FC3]"
                >
                  Login
                </Button>
              </Field>

              <FieldDescription className="text-center">
                Don&apos;t have an account?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-[#9D5FD4]! transition-colors hover:text-[#8B4FC3]!"
                >
                  Sign up
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>

          <div className="relative hidden bg-muted md:block">
            <img
              src="./login-banner.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>

      <ForgotPasswordDialog open={forgotOpen} onOpenChange={setForgotOpen} />

      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our{" "}
        <Link
          to="/terms-and-conditions"
          className="text-[#9D5FD4]! transition-colors hover:text-[#8B4FC3]!"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          to="/privacy-policies"
          className="text-[#9D5FD4]! transition-colors hover:text-[#8B4FC3]!"
        >
          Privacy Policy
        </Link>
        .
      </FieldDescription>
    </div>
  );
}
