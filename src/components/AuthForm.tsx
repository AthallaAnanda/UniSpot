"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, LoaderCircle, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { safeNext } from "@/lib/auth";
import { useAuth } from "./AuthProvider";
import "./AuthForm.css";

type Mode = "login" | "signup" | "forgot" | "reset";
const copy = {
  login: { title: "Welcome back.", description: "Your next opportunity is waiting.", action: "Log in" },
  signup: { title: "Find your people.", description: "Create an account. Open up a world of possibilities.", action: "Create account" },
  forgot: { title: "Forgot your password?", description: "We’ll send you a link to get back into your account.", action: "Send reset link" },
  reset: { title: "A fresh start.", description: "Choose a new password for your UniSpot account.", action: "Save password" },
};
function ProviderIcon({ name }: { name: "google" | "apple" | "x" }) {
  if (name === "google") return <svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true"><path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.89-1.74 2.98-4.3 2.98-7.36Z"/><path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.62-2.42l-3.24-2.51c-.9.6-2.05.97-3.38.97-2.6 0-4.8-1.76-5.59-4.13H3.07v2.59A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.41 13.91a6 6 0 0 1 0-3.82V7.5H3.07a10 10 0 0 0 0 9l3.34-2.59Z"/><path fill="#EA4335" d="M12 5.96c1.47 0 2.78.5 3.82 1.5l2.87-2.87A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.93 5.5l3.34 2.59A6 6 0 0 1 12 5.96Z"/></svg>;
  if (name === "apple") return <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.1 12.3c0-2 1.6-3 1.7-3.1-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.7.8-3.4.8s-1.8-.8-2.9-.8c-1.5 0-2.8.9-3.6 2.2-1.5 2.6-.4 6.5 1 8.6.7 1 1.5 2.1 2.6 2.1s1.5-.7 2.9-.7 1.7.7 2.9.7 1.9-1 2.6-2c.8-1.1 1.1-2.2 1.2-2.3-.1 0-2.3-.9-2.3-3.8ZM14.7 6.2c.6-.8 1.1-1.9 1-3-.9 0-2 .6-2.7 1.4-.6.7-1.2 1.8-1.1 2.8 1 .1 2.1-.5 2.8-1.2Z"/></svg>;
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.6 5.5 22H2.4l8.2-9.4L.8 2h6.5l5.8 7.7L18.9 2Zm-1.1 18h1.7L6.4 3.9H4.5L17.8 20Z"/></svg>;
}

export default function AuthForm({ mode, canReset = true }: { mode: Mode; canReset?: boolean }) {
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const router = useRouter();
  const auth = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [pending, setPending] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(params.get("error") ? "This sign-in link could not be verified. It may have expired or been opened in a different browser. Please try again." : "");
  const [providers, setProviders] = useState({ google: false, apple: false, x: false });
  useEffect(() => { const controller = new AbortController(); void fetch("/api/auth/providers", { signal: controller.signal }).then(r => r.json()).then(setProviders).catch(() => {}); return () => controller.abort(); }, []);
  const details = copy[mode];
  const hasSocial = mode === "login" || mode === "signup";
  const callback = (destination: string) => `${window.location.origin}/auth/callback?next=${encodeURIComponent(destination)}`;
  async function complete() {
    await auth.refresh();
    router.replace(next);
    router.refresh();
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending("email"); setError(""); setMessage("");
    try {
      const supabase = createClient();
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        await complete();
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({ email: email.trim(), password, options: { data: { full_name: name.trim() }, emailRedirectTo: callback(next) } });
        if (error) throw error;
        if (data.session) await complete();
        else { setMessage("Check your inbox for a confirmation link. Once your email is confirmed, you can log in to UniSpot."); setPassword(""); }
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: callback("/reset-password") });
        if (error) throw error;
        setMessage("If this email has a UniSpot account, you’ll receive a password reset link. Open it in this browser to continue.");
      } else {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        setMessage("Your password has been saved."); setPassword("");
      }
    } catch (problem) { setError(problem instanceof Error ? problem.message : "Something went wrong. Please try again."); }
    finally { setPending(""); }
  }
  async function oauth(provider: keyof typeof providers) {
    if (pending) return;
    setPending(provider); setError("");
    try {
      const { error } = await createClient().auth.signInWithOAuth({ provider, options: { redirectTo: callback(next) } });
      if (error) throw error;
    } catch (problem) { setError(problem instanceof Error ? problem.message : "Couldn’t start sign-in."); setPending(""); }
  }
  async function resend() {
    setPending("resend"); setError("");
    try {
      const { error } = await createClient().auth.resend({ type: "signup", email: email.trim(), options: { emailRedirectTo: callback(next) } });
      if (error) throw error;
      setMessage("A new confirmation link has been requested. Please check your inbox and spam folder.");
    } catch (problem) { setError(problem instanceof Error ? problem.message : "Couldn’t resend your confirmation email."); }
    finally { setPending(""); }
  }
  return <main className="auth-page">
    <aside className="auth-story"><Link href="/" className="auth-brand"><img src="/brand/unispot.svg" width={122} height={36} alt="UniSpot" /></Link><div className="auth-story-copy"><span className="auth-eyebrow">A LITTLE CURIOSITY. A WORLD OF POSSIBILITY.</span><h2>Your next chapter<br />starts with<br /><em>showing up.</em></h2><p>Discover opportunities, meet your community,<br />and find the places where you belong.</p><div className="auth-story-tags"><span>Learn something new</span><span>Find your community</span><span>Make your next move <ArrowRight size={14} /></span></div></div><span className="auth-story-foot">Find your people. Find your possibilities.</span><div className="auth-orbit auth-orbit-one" /><div className="auth-orbit auth-orbit-two" /></aside>
    <section className="auth-form-side"><Link href="/discover" className="auth-back"><ArrowLeft size={15} />Back to discover</Link><div className="auth-card"><Link href="/" className="auth-mobile-brand"><img src="/brand/unispot.svg" width={110} height={33} alt="UniSpot" /></Link><div className="auth-symbol"><img src="/brand/unispot-icon.svg" alt="" width={35} height={35} /></div><h1>{details.title}</h1><p className="auth-description">{details.description}</p>
      {hasSocial && <><div className="auth-social">{(["google", "apple", "x"] as const).map(provider => <button key={provider} type="button" disabled={!!pending || !providers[provider]} onClick={() => void oauth(provider)} title={!providers[provider] ? "This provider is awaiting configuration" : undefined}><ProviderIcon name={provider} /><span>Continue with {provider === "x" ? "X / Twitter" : provider === "apple" ? "Apple" : "Google"}</span>{pending === provider && <LoaderCircle className="auth-spinner" size={16} />}</button>)}</div>{!providers.google && !providers.apple && !providers.x && <p className="auth-provider-note">Social sign-in is being set up. You can use email below.</p>}<div className="auth-divider"><span>or continue with email</span></div></>}
      {mode === "reset" && !canReset ? <div className="auth-alert" role="alert">Open a valid password reset or invitation link to continue. <Link href="/forgot-password">Request a new link</Link>.</div> : <form onSubmit={submit} aria-busy={!!pending}>
        {mode === "signup" && <label className="auth-field">Your name<input name="name" autoComplete="name" required maxLength={100} placeholder="How should we call you?" value={name} onChange={e => setName(e.target.value)} /></label>}
        {mode !== "reset" && <label className="auth-field">Email address<input name="email" type="email" autoComplete="email" autoCapitalize="none" spellCheck={false} required maxLength={254} placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} /></label>}
        {mode !== "forgot" && <label className="auth-field"><span>{mode === "reset" ? "New password" : "Password"}{mode === "login" && <Link href="/forgot-password">Forgot password?</Link>}</span><div className="auth-password"><input name="password" type={visible ? "text" : "password"} autoComplete={mode === "login" ? "current-password" : "new-password"} required minLength={mode === "login" ? undefined : 8} maxLength={128} placeholder={mode === "login" ? "Enter your password" : "At least 8 characters"} value={password} onChange={e => setPassword(e.target.value)} /><button type="button" aria-label={visible ? "Hide password" : "Show password"} onClick={() => setVisible(!visible)}>{visible ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>}
        {error && <p className="auth-alert" role="alert">{error}</p>}{message && <div className="auth-success" role="status">{mode === "reset" ? <Check size={18} /> : <Mail size={18} />}<span>{message}</span></div>}
        <button className="auth-submit" type="submit" disabled={!!pending}>{pending === "email" ? <LoaderCircle size={18} className="auth-spinner" /> : <>{details.action}<ArrowRight size={17} /></>}</button>
        {message && mode === "signup" && <button className="auth-resend" type="button" disabled={!!pending} onClick={() => void resend()}>{pending === "resend" ? "Sending…" : "Resend confirmation email"}</button>}
        {message && mode === "reset" && <Link className="auth-resend" href={next}>Continue to UniSpot<ArrowRight size={14} /></Link>}
      </form>}
      <p className="auth-switch">{mode === "login" ? <>New to UniSpot? <Link href={`/signup?next=${encodeURIComponent(next)}`}>Create an account</Link></> : mode === "signup" ? <>Already have an account? <Link href={`/login?next=${encodeURIComponent(next)}`}>Log in</Link></> : <Link href="/login"><ArrowLeft size={13} />Back to log in</Link>}</p>
      <p className="auth-footer-note">A home for your next possibility.</p>
    </div></section>
  </main>;
}
