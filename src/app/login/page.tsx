"use client";

import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (session?.user?.role) {
      const redirect = session.user.role === "admin" ? "/admin" : "/employee";
      router.replace(redirect);
    }
  }, [router, session]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const response = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setIsSubmitting(false);

    if (!response?.ok) {
      setError(response?.error ?? "Invalid credentials");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-white/10 bg-zinc-900/70 p-8 shadow-lg shadow-black/30">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-amber-300">PulseDesk</p>
          <h1 className="text-3xl font-semibold text-white">Sign in</h1>
          <p className="text-sm text-zinc-400">
            Use any sample email from the brochure to continue (password is
            <span className="font-semibold text-white"> employee123</span> for
            employees, <span className="font-semibold text-white">admin123</span> for
            admins).
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-xs uppercase tracking-[0.3em] text-zinc-400">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-amber-300 focus:outline-none"
            />
          </label>
          <label className="block text-xs uppercase tracking-[0.3em] text-zinc-400">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-amber-300 focus:outline-none"
            />
          </label>
          {error && <p className="text-xs text-rose-400">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-amber-400 px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="text-xs text-zinc-500">
          Need to go back?
          <Link className="ml-1 text-amber-300" href="/">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
