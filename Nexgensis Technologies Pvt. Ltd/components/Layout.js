"use client";
import { useRouter } from "next/navigation";
import { clearToken } from "@/lib/auth";
export default function Layout({ children }) {
  const router = useRouter();
  return (
    <div className="min-h-screen">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <a href="/products" className="text-xl font-bold">
            Product Admin
          </a>
          <button
            onClick={() => {
              clearToken();
              router.replace("/login");
            }}
            className="rounded-lg border px-3 py-2 text-sm hover:bg-slate-50"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}
