"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import { setToken } from "@/lib/auth";
export default function Login() {
  const router = useRouter();
  const [u, setU] = useState("emilys"),
    [p, setP] = useState("emilyspass"),
    [loading, setLoading] = useState(false),
    [error, setError] = useState("");
  async function submit(e) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const { data } = await login(u, p);
      setToken(data.accessToken || data.token);
      router.replace("/products");
    } catch (e) {
      setError(e.response?.data?.message || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  }
  return (
    <main className="min-h-screen grid place-items-center bg-slate-100 px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-2xl bg-white p-7 shadow-sm"
      >
        <h1 className="text-2xl font-bold">Product Admin</h1>
        <p className="mt-1 mb-6 text-sm text-slate-500">
          Sign in to manage products
        </p>
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
        <label className="block text-sm font-medium">
          Username
          <input
            value={u}
            onChange={(e) => setU(e.target.value)}
            className="mt-1 mb-4 w-full rounded-lg border p-2.5"
          />
        </label>
        <label className="block text-sm font-medium">
          Password
          <input
            type="password"
            value={p}
            onChange={(e) => setP(e.target.value)}
            className="mt-1 mb-5 w-full rounded-lg border p-2.5"
          />
        </label>
        <button
          disabled={loading}
          className="w-full rounded-lg bg-slate-900 p-2.5 font-medium text-white disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Login"}
        </button>
        <p className="mt-4 text-xs text-slate-500">Demo: emilys / emilyspass</p>
      </form>
    </main>
  );
}
