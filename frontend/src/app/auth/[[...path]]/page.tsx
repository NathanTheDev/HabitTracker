"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  createCode,
  consumeCode,
  resendCode,
} from "supertokens-web-js/recipe/passwordless";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function OtpInput({
  value,
  onChange,
  autoFocus,
}: {
  value: string;
  onChange: (v: string) => void;
  autoFocus?: boolean;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length: 6 }, (_, i) => value[i] ?? "");

  function focusAt(i: number) {
    refs.current[i]?.focus();
  }

  function handleChange(i: number, raw: string) {
    const digit = raw.replace(/\D/g, "").slice(-1);
    if (!digit) return;
    const next = [...digits];
    next[i] = digit;
    onChange(next.join(""));
    if (i < 5) focusAt(i + 1);
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = [...digits];
      if (next[i]) {
        next[i] = "";
        onChange(next.join("").replace(/\s+$/, ""));
      } else if (i > 0) {
        next[i - 1] = "";
        onChange(next.join("").replace(/\s+$/, ""));
        focusAt(i - 1);
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      if (i > 0) focusAt(i - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      if (i < 5) focusAt(i + 1);
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(pasted);
    focusAt(Math.min(pasted.length, 5));
  }

  return (
    <div className="flex gap-2 justify-center">
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={2}
          value={digit}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          autoFocus={autoFocus && i === 0}
          className="w-11 h-12 text-center text-xl font-semibold rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
        />
      ))}
    </div>
  );
}

type Step = "email" | "otp";

export default function AuthPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await createCode({ email });
      if (res.status === "OK") {
        setStep("otp");
      } else {
        setError("Failed to send code. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await consumeCode({ userInputCode: otp });
      if (res.status === "OK") {
        router.replace("/dashboard");
        return;
      } else if (res.status === "RESTART_FLOW_ERROR") {
        setStep("email");
        setOtp("");
        setError("Code expired. Please request a new one.");
      } else {
        setError("Incorrect code. Please try again.");
        setOtp("");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  async function handleResend() {
    setLoading(true);
    setError(null);
    try {
      const res = await resendCode();
      if (res.status === "RESTART_FLOW_ERROR") {
        setStep("email");
        setOtp("");
        setError("Session expired. Please start again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-foreground">
            {step === "email" ? "Sign in to HabitTracker" : "Check your email"}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {step === "email"
              ? "We'll send you a one-time code to sign in."
              : `We sent a 6-digit code to ${email}`}
          </p>
        </div>

        {step === "email" ? (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              className="rounded-2xl"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending…" : "Send code"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <OtpInput value={otp} onChange={setOtp} autoFocus />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button
              type="submit"
              className="w-full"
              disabled={loading || otp.length !== 6}
            >
              {loading ? "Verifying…" : "Verify code"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleResend}
              disabled={loading}
            >
              Resend code
            </Button>
          </form>
        )}
      </div>
    </main>
  );
}
