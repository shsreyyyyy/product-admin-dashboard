"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getProduct } from "@/lib/api";
import Loader from "@/components/Loader";
export default function Detail() {
  const { id } = useParams();
  const router = useRouter();
  const [p, setP] = useState(),
    [loading, setLoading] = useState(true),
    [err, setErr] = useState(false);
  useEffect(() => {
    getProduct(id)
      .then((r) => setP(r.data))
      .catch(() => setErr(true))
      .finally(() => setLoading(false));
  }, [id]);
  if (loading) return <Loader />;
  if (err || !p)
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Link href="/products" className="mt-4 inline-block text-blue-600">
          Back to products
        </Link>
      </div>
    );
  return (
    <div>
      <button
        onClick={() => router.back()}
        className="mb-5 text-sm text-blue-600"
      >
        ← Back
      </button>
      <div className="grid gap-7 rounded-2xl border bg-white p-6 md:grid-cols-2">
        <div className="grid grid-cols-2 gap-3">
          {(p.images?.length ? p.images : [p.thumbnail]).map((x, i) => (
            <img
              key={i}
              src={x}
              className="h-56 w-full rounded-lg object-cover"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          ))}
        </div>
        <div>
          <h1 className="text-3xl font-bold">{p.title}</h1>
          <p className="mt-2 text-slate-500">{p.description}</p>
          <div className="mt-5 text-2xl font-bold">${p.price}</div>
          <p className="mt-2">
            ⭐ {p.rating} · Stock {p.stock} · {p.category}
          </p>
          <h2 className="mt-8 text-xl font-semibold">Reviews</h2>
          <div className="mt-3 space-y-3">
            {p.reviews?.length ? (
              p.reviews.map((r, i) => (
                <div key={i} className="rounded-lg bg-slate-50 p-3">
                  <div className="font-medium">
                    ⭐ {r.rating} — {r.reviewerName}
                  </div>
                  <p className="text-sm text-slate-600">{r.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-slate-500">No reviews.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
