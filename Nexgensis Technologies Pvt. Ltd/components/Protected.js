"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth";
export default function Protected({ children }) {
  const [ok, setOk] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (getToken()) setOk(true);
    else router.replace("/login");
  }, [router]);
  return ok ? (
    children
  ) : (
    <div className="min-h-screen grid place-items-center text-slate-500">
      Checking login…
    </div>
  );
}
