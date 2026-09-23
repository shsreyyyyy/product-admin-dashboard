"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  getCategories,
  getProducts,
  searchProducts,
  deleteProduct,
} from "@/lib/api";
import Loader from "@/components/Loader";
const clampPage = (v, total, size) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0
    ? Math.min(Math.ceil(total / size) || 1, Math.floor(n))
    : 1;
};
export default function Products() {
  const sp = useSearchParams(),
    router = useRouter();
  const rawSize = Number(sp.get("size")),
    size = [10, 20, 50].includes(rawSize) ? rawSize : 10;
  const [q, setQ] = useState(sp.get("q") || ""),
    [draft, setDraft] = useState(sp.get("q") || ""),
    [category, setCategory] = useState(sp.get("category") || ""),
    [sort, setSort] = useState(sp.get("sort") || ""),
    [data, setData] = useState({ products: [], total: 0 }),
    [cats, setCats] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [deleting, setDeleting] = useState(null);
  const [page, setPage] = useState(clampPage(sp.get("page"), data.total, size));
  const abortRef = useRef(null);
  useEffect(() => {
    const t = setTimeout(() => setQ(draft), 450);
    return () => clearTimeout(t);
  }, [draft]);
  useEffect(() => {
    getCategories()
      .then((r) =>
        setCats(
          r.data.map((x) => (typeof x === "string" ? x : x.slug || x.name)),
        ),
      )
      .catch(() => {});
  }, []);
  useEffect(() => {
    const n = Number(sp.get("page"));
    if (n > 0) setPage(n);
  }, [sp]);
  useEffect(() => {
    const p = clampPage(sp.get("page"), data.total, size);
    if (data.total && p !== page) setPage(p);
  }, [data.total, size]);
  const requestId = useRef(0);
  const load = useCallback(async () => {
    const id = ++requestId.current;
    setLoading(true);
    setError("");
    const params = { limit: size, skip: (page - 1) * size };
    if (sort) {
      params.sortBy = sort;
      params.order = "asc";
    }
    try {
      let r;
      if (q.trim()) r = await searchProducts(q.trim(), params);
      else if (category) {
        r = await getProducts({ ...params, category });
      } else r = await getProducts(params);
      if (id === requestId.current) setData(r.data);
    } catch (e) {
      if (id === requestId.current) setError("Could not load products.");
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, [q, category, sort, page, size]);
  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    const next = new URLSearchParams(sp.toString());
    q ? next.set("q", q) : next.delete("q");
    category ? next.set("category", category) : next.delete("category");
    sort ? next.set("sort", sort) : next.delete("sort");
    next.set("page", "" + page);
    next.set("size", "" + size);
    router.replace(`/products?${next.toString()}`, { scroll: false });
  }, [q, category, sort, page, size]);
  const totalPages = Math.max(1, Math.ceil(data.total / size));
  const safePage = Math.min(page, totalPages);
  const pages = useMemo(() => {
    let a = [];
    for (let i = 1; i <= totalPages; i++)
      if (i <= 2 || i > totalPages - 2 || Math.abs(i - safePage) <= 1)
        a.push(i);
    return [...new Set(a)];
  }, [totalPages, safePage]);
  async function remove(id) {
    if (!confirm("Delete this product?")) return;
    setDeleting(id);
    try {
      await deleteProduct(id);
      setData((d) => ({
        ...d,
        products: d.products.filter((p) => p.id !== id),
        total: Math.max(0, d.total - 1),
      }));
    } catch {
      setError("Delete failed. Please retry.");
    } finally {
      setDeleting(null);
    }
  }
  function changeFilter(fn) {
    fn();
    setPage(1);
  }
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-sm text-slate-500">
            {data.total
              ? `Showing ${(safePage - 1) * size + 1}–${Math.min(safePage * size, data.total)} of ${data.total}`
              : "No products"}
          </p>
        </div>
        <Link
          href="/products/new"
          className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white"
        >
          + Add Product
        </Link>
      </div>
      <div className="mb-5 grid gap-3 md:grid-cols-4">
        <input
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            setPage(1);
          }}
          placeholder="Search products…"
          className="rounded-lg border bg-white p-2.5"
        />
        <select
          value={category}
          onChange={(e) => changeFilter(() => setCategory(e.target.value))}
          className="rounded-lg border bg-white p-2.5"
        >
          <option value="">All categories</option>
          {cats.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => changeFilter(() => setSort(e.target.value))}
          className="rounded-lg border bg-white p-2.5"
        >
          <option value="">Sort: Default</option>
          <option value="price">Price</option>
          <option value="rating">Rating</option>
          <option value="title">Title</option>
        </select>
        <select
          value={size}
          onChange={(e) =>
            router.push(`/products?size=${e.target.value}&page=1`)
          }
          className="rounded-lg border bg-white p-2.5"
        >
          <option value="10">10 / page</option>
          <option value="20">20 / page</option>
          <option value="50">50 / page</option>
        </select>
      </div>
      {loading ? (
        <Loader />
      ) : error ? (
        <div className="rounded-xl border bg-white p-10 text-center">
          <p className="text-red-600">{error}</p>
          <button onClick={load} className="mt-3 rounded-lg border px-4 py-2">
            Retry
          </button>
        </div>
      ) : !data.products.length ? (
        <div className="rounded-xl border bg-white p-10 text-center text-slate-500">
          No products found.
        </div>
      ) : (
        <>
          <div className="hidden overflow-x-auto rounded-xl border bg-white md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-slate-50">
                <tr>
                  {[
                    "Product",
                    "Category",
                    "Price",
                    "Rating",
                    "Stock",
                    "Actions",
                  ].map((h) => (
                    <th key={h} className="p-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.products.map((p) => (
                  <tr key={p.id} className="border-b last:border-0">
                    <td className="p-3">
                      <Link
                        href={`/products/${p.id}`}
                        className="flex items-center gap-3 font-medium hover:underline"
                      >
                        <img
                          src={p.thumbnail}
                          className="h-12 w-12 rounded object-cover"
                        />
                        {p.title}
                      </Link>
                    </td>
                    <td className="p-3">{p.category}</td>
                    <td className="p-3">${p.price}</td>
                    <td className="p-3">{p.rating}</td>
                    <td className="p-3">{p.stock}</td>
                    <td className="p-3">
                      <Link
                        href={`/products/${p.id}/edit`}
                        className="mr-3 text-blue-600"
                      >
                        Edit
                      </Link>
                      <button
                        disabled={deleting === p.id}
                        onClick={() => remove(p.id)}
                        className="text-red-600"
                      >
                        {deleting === p.id ? "…" : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid gap-3 md:hidden">
            {data.products.map((p) => (
              <div key={p.id} className="rounded-xl border bg-white p-4">
                <Link href={`/products/${p.id}`} className="flex gap-3">
                  <img
                    src={p.thumbnail}
                    className="h-20 w-20 rounded object-cover"
                  />
                  <div>
                    <h2 className="font-semibold">{p.title}</h2>
                    <p className="text-sm text-slate-500">{p.category}</p>
                    <p className="mt-1">
                      ${p.price} · ⭐ {p.rating} · Stock {p.stock}
                    </p>
                  </div>
                </Link>
                <div className="mt-3 border-t pt-3">
                  <Link
                    href={`/products/${p.id}/edit`}
                    className="mr-4 text-blue-600"
                  >
                    Edit
                  </Link>
                  <button onClick={() => remove(p.id)} className="text-red-600">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <button
              disabled={safePage <= 1}
              onClick={() => setPage(safePage - 1)}
              className="rounded-lg border px-3 py-2 disabled:opacity-40"
            >
              Previous
            </button>
            {pages.map((n, i) => (
              <span key={n}>
                {i && n - pages[i - 1] > 1 ? (
                  <span className="px-1">…</span>
                ) : null}
                <button
                  onClick={() => setPage(n)}
                  className={`rounded-lg border px-3 py-2 ${n === safePage ? "bg-slate-900 text-white" : ""}`}
                >
                  {n}
                </button>
              </span>
            ))}
            <button
              disabled={safePage >= totalPages}
              onClick={() => setPage(safePage + 1)}
              className="rounded-lg border px-3 py-2 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
