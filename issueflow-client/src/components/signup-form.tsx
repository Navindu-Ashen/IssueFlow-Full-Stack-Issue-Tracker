import {
  useEffect,
  useRef,
  useState,
  type ComponentProps,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { cn } from "@/lib/utils";
import * as authService from "@/services/authService";
import { useAuthStore } from "@/stores/authStore";

type SignupFormProps = ComponentProps<"div">;

const signupFormSchema = z
  .object({
    profileImage: z.custom<File | null>(
      (file) => file instanceof File,
      "Profile image is required.",
    ),
    name: z.string().trim().min(1, "Name is required."),
    email: z
      .string()
      .trim()
      .min(1, "Email is required.")
      .regex(
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address.",
      ),
    password: z
      .string()
      .min(1, "Password is required.")
      .min(8, "Password must be at least 8 characters long."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupFormSchema>;

export function SignupForm({ className, ...props }: SignupFormProps) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [profileImagePreviewUrl, setProfileImagePreviewUrl] = useState("");
  const [namePreview, setNamePreview] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const setUser = useAuthStore((s) => s.setUser);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      profileImage: null,
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    return () => {
      if (profileImagePreviewUrl) {
        URL.revokeObjectURL(profileImagePreviewUrl);
      }
    };
  }, [profileImagePreviewUrl]);

  const handlePickImage = () => {
    fileInputRef.current?.click();
  };

  const handleProfileImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: (file: File | null) => void,
  ) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFileName(file?.name ?? "");

    if (profileImagePreviewUrl) {
      URL.revokeObjectURL(profileImagePreviewUrl);
    }

    if (file) {
      setProfileImagePreviewUrl(URL.createObjectURL(file));
    } else {
      setProfileImagePreviewUrl("");
    }

    onChange(file);
  };

  const onSubmit = async (values: SignupFormValues) => {
    try {
      setIsSubmitting(true);

      let finalProfilePictureUrl = "";

      if (values.profileImage) {
        const uploadData = await authService.uploadImage(values.profileImage);
        finalProfilePictureUrl = uploadData.imageUrl;
      }

      const res = await authService.register({
        name: values.name,
        email: values.email,
        password: values.password,
        profilePictureUrl: finalProfilePictureUrl,
      });
      setUser(res.user);
      navigate("/dashboard");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Registration failed",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const initials =
    namePreview
      .trim()
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            className="p-6 md:p-8"
            onSubmit={form.handleSubmit(onSubmit)}
            id="signup-form"
          >
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <img
                  src="/icon.png"
                  alt="IssueFlow Logo"
                  className="mb-2 h-18"
                />
                <h1 className="text-2xl font-bold">
                  Create your IssueFlow account
                </h1>
                <p className="text-sm text-balance text-muted-foreground">
                  Enter your details below to create your account
                </p>
              </div>

              <Controller
                name="profileImage"
                control={form.control}
                render={({ field, fieldState }) => {
                  const showError =
                    fieldState.invalid &&
                    (fieldState.isTouched || form.formState.submitCount > 0);

                  return (
                    <Field className="items-center" data-invalid={showError}>
                      <div className="flex justify-center">
                        <FieldLabel
                          htmlFor="profile-image"
                          className="self-center"
                        >
                          Profile Image
                        </FieldLabel>
                      </div>

                      <button
                        type="button"
                        onClick={handlePickImage}
                        className="rounded-full flex items-center justify-center transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        aria-label="Pick profile image"
                      >
                        <Avatar className="size-20">
                          <AvatarImage
                            src={profileImagePreviewUrl}
                            alt="Profile preview"
                          />
                          <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                      </button>

                      <Input
                        id="profile-image"
                        name={field.name}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onBlur={field.onBlur}
                        ref={(node) => {
                          fileInputRef.current = node;
                          field.ref(node);
                        }}
                        onChange={(event) =>
                          handleProfileImageChange(event, field.onChange)
                        }
                      />

                      <div className="mt-2 flex flex-col items-center gap-2">
                        <FieldDescription className="text-center ">
                          {selectedFileName
                            ? `Profile image selected`
                            : "Tap avatar or button to pick an image from your device."}
                        </FieldDescription>

                        <div
                          className={cn(
                            "overflow-hidden transition-all duration-200",
                            showError
                              ? "max-h-16 translate-y-0 opacity-100"
                              : "max-h-0 -translate-y-1 opacity-0",
                          )}
                        >
                          {showError ? (
                            <FieldError errors={[fieldState.error]} />
                          ) : null}
                        </div>
                      </div>
                    </Field>
                  );
                }}
              />

              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => {
                  const showError =
                    fieldState.invalid &&
                    (fieldState.isTouched || form.formState.submitCount > 0);

                  return (
                    <Field data-invalid={showError}>
                      <FieldLabel htmlFor="name">Name</FieldLabel>
                      <Input
                        {...field}
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        autoComplete="name"
                        aria-invalid={showError}
                        onChange={(event) => {
                          field.onChange(event);
                          setNamePreview(event.target.value);
                        }}
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

              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => {
                  const showError =
                    fieldState.invalid &&
                    (fieldState.isTouched || form.formState.submitCount > 0);

                  return (
                    <Field data-invalid={showError}>
                      <FieldLabel htmlFor="email">Email</FieldLabel>
                      <Input
                        {...field}
                        id="email"
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

              <Field className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => {
                    const showError =
                      fieldState.invalid &&
                      (fieldState.isTouched || form.formState.submitCount > 0);

                    return (
                      <Field data-invalid={showError}>
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <div className="relative">
                          <Input
                            {...field}
                            id="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            aria-invalid={showError}
                            className="pr-10"
                            onChange={(event) => {
                              field.onChange(event);
                              void form.trigger("confirmPassword");
                            }}
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
                  control={form.control}
                  render={({ field, fieldState }) => {
                    const showError =
                      fieldState.invalid &&
                      (fieldState.isTouched || form.formState.submitCount > 0);

                    return (
                      <Field data-invalid={showError}>
                        <FieldLabel htmlFor="confirm-password">
                          Confirm Password
                        </FieldLabel>
                        <div className="relative">
                          <Input
                            {...field}
                            id="confirm-password"
                            type={showConfirmPassword ? "text" : "password"}
                            autoComplete="new-password"
                            aria-invalid={showError}
                            className="pr-10"
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
              </Field>

              <FieldDescription>
                Password must be at least 8 characters long.
              </FieldDescription>

              <Field>
                <Button
                  type="submit"
                  form="signup-form"
                  className="bg-[#9D5FD4] text-white hover:bg-[#8B4FC3]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </Field>

              <FieldDescription className="text-center">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-[#9D5FD4]! transition-colors hover:text-[#8B4FC3]!"
                >
                  Sign in
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>

          <div className="relative hidden bg-muted md:block">
            <img
              src="./signup-banner.jpg"
              alt="Signup Banner"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>

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
