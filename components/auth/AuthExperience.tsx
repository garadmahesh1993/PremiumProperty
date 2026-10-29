"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandMark } from "@/components/brand/BrandMark";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

type AuthMode = "login" | "signup";

function safeNextPath(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return "/account";
  return value;
}

export function AuthExperience({ initialMode }: { initialMode: AuthMode }) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [codeStep, setCodeStep] = useState(false);
  const [nextPath, setNextPath] = useState("/account");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const next = safeNextPath(new URLSearchParams(window.location.search).get("next"));
    setNextPath(next);
    try {
      const saved = JSON.parse(localStorage.getItem("pp-account-profile") || "null");
      if (saved?.verified === true && next !== "/account") router.replace(next);
    } catch {
      // Ignore malformed local profile data and continue to the sign-in screen.
    }
  }, [router]);

  function requestCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (mode === "signup" && !name.trim()) {
      setError("Enter your name to create an account.");
      return;
    }
    if (mode === "signup" && email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address or leave it blank.");
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      setError("Enter a 10-digit mobile number.");
      return;
    }
    setCodeStep(true);
  }

  function verifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^\d{6}$/.test(code)) {
      setError("Enter a 6-digit code to continue.");
      return;
    }
    const profile = { name: name.trim(), email: email.trim(), phone, verified: true, accountType: mode === "signup" ? "new" : "existing" };
    try {
      localStorage.setItem("pp-account-profile", JSON.stringify(profile));
    } catch {
      setError("This browser could not save your account session. Check browser storage settings and try again.");
      return;
    }
    if (nextPath !== "/account") {
      router.replace(nextPath);
      return;
    }
    setSuccess(true);
  }

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode);
    setCodeStep(false);
    setCode("");
    setError("");
    setSuccess(false);
  }

  return <><SiteHeader/><main id="main-content" className="route-page auth-page"><section className="auth-card">
    <BrandMark/>
    <span className="eyebrow">YOUR PREMIUMPROPERTY ACCOUNT</span>
    <div className="auth-mode-tabs" role="tablist" aria-label="Account access">
      <button type="button" role="tab" aria-selected={mode === "login"} className={mode === "login" ? "is-active" : ""} onClick={() => changeMode("login")}>Log in</button>
      <button type="button" role="tab" aria-selected={mode === "signup"} className={mode === "signup" ? "is-active" : ""} onClick={() => changeMode("signup")}>Create account</button>
    </div>
    <h1>{success ? "You’re signed in" : mode === "signup" ? "Create your account" : "Welcome back"}</h1>
    <p>{success ? "Your account session is saved in this browser." : codeStep ? `Enter the verification code to ${mode === "signup" ? "finish creating your account" : "continue"}.` : mode === "signup" ? "Add your details and continue with your mobile number." : "Use your mobile number to continue to your account."}</p>
    {success ? <div className="auth-success-actions"><Link className="button button-teal" href="/account">Open my account →</Link><Link href="/post-property">Post a property →</Link></div> : <form className="auth-form" onSubmit={codeStep ? verifyCode : requestCode}>
      {mode === "signup" && !codeStep && <><label>Full name<input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name"/></label><label>Email address <span className="auth-optional">(optional)</span><input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com"/></label></>}
      <label>Mobile number<input type="tel" inputMode="numeric" autoComplete="tel-national" value={phone} onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="10-digit mobile number"/></label>
      {codeStep && <label>6-digit verification code<input type="text" inputMode="numeric" autoComplete="one-time-code" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="Enter 6 digits"/></label>}
      {error && <p className="error-note" role="alert">{error}</p>}
      <button className="button button-orange" type="submit">{codeStep ? "Verify & continue →" : "Continue with phone →"}</button>
      {codeStep && <button className="auth-back-button" type="button" onClick={() => { setCodeStep(false); setCode(""); setError(""); }}>Change mobile number</button>}
      <small>This frontend preview does not send SMS or verify identity. Enter any 6 digits to continue. Account details stay in this browser.</small>
    </form>}
  </section></main><SiteFooter/></>;
}
