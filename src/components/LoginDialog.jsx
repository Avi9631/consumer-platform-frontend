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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
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

/**
 * LoginDialog Component
 * Handles mobile OTP authentication flow
 * @param {boolean} open - Controls dialog visibility
 * @param {function} onOpenChange - Callback for dialog open state change
 * @param {function} onLoginSuccess - Callback on successful login
 */
export default function LoginDialog({ open, onOpenChange, onLoginSuccess }) {
  const [step, setStep] = useState("phone"); // "phone" | "otp"
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

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

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setStep("phone");
      setPhone("");
      phoneForm.reset();
      otpForm.reset();
      setResendTimer(0);
    }
  }, [open, phoneForm, otpForm]);

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

      if (response.ok) {
        toast.success("Login Successful", {
          description: `Welcome ${data.data.user.firstName}!`,
        });
        onLoginSuccess(data.data.user);
        onOpenChange(false);
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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">
            {step === "phone" ? "Login with Mobile" : "Verify OTP"}
          </SheetTitle>
          <SheetDescription>
            {step === "phone"
              ? "Enter your mobile number to receive an OTP"
              : `Enter the 6-digit OTP sent to ${phone}`}
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
          ) : (
            <Form {...otpForm}>
              <form onSubmit={otpForm.handleSubmit(handleVerifyOtp)} className="space-y-4">
                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enter OTP</FormLabel>
                      <FormControl>
                        <div className="flex justify-center">
                          <InputOTP
                            maxLength={6}
                            pattern={REGEXP_ONLY_DIGITS}
                            disabled={loading}
                            {...field}
                          >
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
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
                  {loading ? "Verifying..." : "Verify & Login"}
                </Button>

                <div className="flex items-center justify-between text-sm">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => {
                      setStep("phone");
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
          )}
        </div>

        <div className="text-xs text-center text-muted-foreground">
          By continuing, you agree to our Terms & Privacy Policy
        </div>
      </SheetContent>
    </Sheet>
  );
}
