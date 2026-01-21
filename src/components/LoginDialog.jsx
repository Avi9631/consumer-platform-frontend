"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/context/AuthContext";
import { Phone, ArrowRight, RefreshCw } from "lucide-react";
import { toast } from "sonner";

// Validation schemas
const phoneSchema = z.object({
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number")
    .length(10, "Mobile number must be exactly 10 digits"),
});

const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only numbers"),
});

const signupSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters"),
  lastName: z
    .string()
    .max(50, "Last name must be less than 50 characters")
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
});

/**
 * LoginDialog Component
 * Handles mobile OTP authentication flow with signup completion
 * @param {boolean} open - Controls dialog visibility
 * @param {function} onOpenChange - Callback for dialog open state change
 */
export default function LoginDialog({ open, onOpenChange }) {
  const { login, updateUser } = useAuth();
  const [step, setStep] = useState("phone"); // "phone" | "otp" | "signup"
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [userData, setUserData] = useState(null); // Store user data for signup step

  // Form for phone number step
  const phoneForm = useForm({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phone: "",
    },
  });

  // Form for OTP step
  const otpForm = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  // Form for signup step
  const signupForm = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setStep("phone");
      setPhone("");
      setUserData(null);
      phoneForm.reset();
      otpForm.reset();
      signupForm.reset();
      setResendTimer(0);
      setOtpValues(["", "", "", "", "", ""]);
    }
  }, [open, phoneForm, otpForm, signupForm]);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleSendOtp = async (values) => {
    setLoading(true);
    setPhone(values.phone); // Store phone for later use
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/otp/send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phone: values.phone }),
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok) {
        setStep("otp");
        setResendTimer(30); // 30 seconds cooldown
        toast.success("OTP Sent", {
          description: `OTP has been sent to ${values.phone}`,
        });
      } else {
        toast.error("Failed to Send OTP", {
          description: data.message || "Please try again later.",
        });
      }
    } catch (error) {
      toast.error("Error", {
        description: "Failed to send OTP. Please check your connection.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/otp/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phone, otp: values.otp }),
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok && data.data) {
        const { isSignUp, user } = data.data;

        if (isSignUp) {
          // New user - show signup form
          setUserData(user);
          setStep("signup");
          toast.success("OTP Verified", {
            description: "Please complete your profile to continue.",
          });
        } else {
          // Existing user - login directly
          toast.success("Login Successful", {
            description: `Welcome back ${user.firstName}!`,
          });
          login(user);
          onOpenChange(false);
        }
      } else {
        toast.error("Verification Failed", {
          description: data.message || "Invalid OTP. Please try again.",
        });
        otpForm.reset();
      }
    } catch (error) {
      toast.error("Error", {
        description: "Failed to verify OTP. Please check your connection.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/otp/resend`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phone }),
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok) {
        setResendTimer(30);
        setOtpValues(["", "", "", "", "", ""]);
        otpForm.reset();
        toast.success("OTP Resent", {
          description: "A new OTP has been sent to your phone.",
        });
      } else {
        toast.error("Failed to Resend OTP", {
          description: data.message || "Please try again later.",
        });
      }
    } catch (error) {
      toast.error("Error", {
        description: "Failed to resend OTP. Please check your connection.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    const newValues = [...otpValues];
    newValues[index] = value.slice(-1); // Only keep the last digit
    setOtpValues(newValues);

    // Update form value
    const otpString = newValues.join("");
    otpForm.setValue("otp", otpString);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpValues[index]) {
      // Focus previous input on backspace if current is empty
      if (index > 0) {
        document.getElementById(`otp-${index - 1}`)?.focus();
      }
    } else if (e.key === "ArrowRight" && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleSignupSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/consumerUser/update`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok && data.data) {
        toast.success("Profile Completed", {
          description: `Welcome ${data.data.user.firstName}!`,
        });

        // Login with updated user data
        login(data.data.user);
        onOpenChange(false);
      } else {
        toast.error("Update Failed", {
          description: data.message || "Failed to update profile. Please try again.",
        });
      }
    } catch (error) {
      toast.error("Error", {
        description: "Failed to update profile. Please check your connection.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">
            {step === "phone" 
              ? "Login with Mobile" 
              : step === "otp" 
                ? "Verify OTP" 
                : "Complete Your Profile"}
          </SheetTitle>
          <SheetDescription>
            {step === "phone"
              ? "Enter your mobile number to receive an OTP"
              : step === "otp"
                ? `Enter the 6-digit OTP sent to ${phone}`
                : "Please provide your details to complete signup"}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-4">
          {step === "phone" ? (
            <Form {...phoneForm}>
              <form onSubmit={phoneForm.handleSubmit(handleSendOtp)} className="space-y-4">
                <FormField
                  control={phoneForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Number</FormLabel>
                      <FormControl className="mt-2">
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="tel"
                            placeholder="Enter 10-digit mobile number"
                            className="pl-10"
                            disabled={loading}
                            maxLength={10}
                            {...field}
                            onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ""))}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full group"
                >
                  {loading ? (
                    "Sending OTP..."
                  ) : (
                    <>
                      Send OTP
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
          ) : step === "otp" ? (
            <Form {...otpForm}>
              <form onSubmit={otpForm.handleSubmit(handleVerifyOtp)} className="space-y-4">
                <FormItem>
                  <FormLabel>Enter OTP</FormLabel>
                  <FormControl>
                    <div className="flex justify-center gap-2">
                      {otpValues.map((value, index) => (
                        <Input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={value}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          disabled={loading}
                          className="w-12 h-12 text-center text-lg font-bold"
                          placeholder="0"
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>

                <Button
                  type="submit"
                  disabled={loading || otpValues.join("").length !== 6}
                  className="w-full"
                >
                  {loading ? "Verifying..." : "Verify & Login"}
                </Button>

                <div className="flex items-center justify-between text-sm">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => {
                      setStep("phone");
                      setOtpValues(["", "", "", "", "", ""]);
                      otpForm.reset();
                    }}
                    className="p-0 h-auto text-muted-foreground"
                  >
                    Change Number
                  </Button>

                  <Button
                    type="button"
                    variant="link"
                    onClick={handleResendOtp}
                    disabled={resendTimer > 0 || loading}
                    className="p-0 h-auto"
                  >
                    {resendTimer > 0 ? (
                      `Resend in ${resendTimer}s`
                    ) : (
                      <>
                        <RefreshCw className="mr-1 h-3 w-3" />
                        Resend OTP
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <Form {...signupForm}>
              <form onSubmit={signupForm.handleSubmit(handleSignupSubmit)} className="space-y-4">
                <FormField
                  control={signupForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your first name"
                          disabled={loading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={signupForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your last name (optional)"
                          disabled={loading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={signupForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email (optional)"
                          disabled={loading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "Completing Profile..." : "Complete Profile"}
                </Button>
              </form>
            </Form>
          )}
        </div>

        <div className="text-xs text-center text-muted-foreground">
          By continuing, you agree to our Terms & Privacy Policy
        </div>
      </SheetContent>
    </Sheet>
  );
}
