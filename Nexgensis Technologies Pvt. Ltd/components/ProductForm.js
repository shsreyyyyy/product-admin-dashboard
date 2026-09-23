"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { addProduct, updateProduct } from "@/lib/api";
export default function ProductForm({ product }) {
  const router = useRouter();
  const [f, setF] = useState({
      title: "",
      price: "",
      category: "",
      stock: "",
      description: "",
    }),
    [errors, setErrors] = useState({}),
    [loading, setLoading] = useState(false),
    [error, setError] = useState("");
  useEffect(() => {
    if (product)
      setF({
        title: product.title || "",
        price: product.price ?? "",
        category: product.category || "",
        stock: product.stock ?? "",
        description: product.description || "",
      });
  }, [product]);
  function validate() {
    let e = {};
    if (!f.title.trim()) e.title = "Title is required";
    if (f.price === "" || Number(f.price) < 0)
      e.price = "Valid price is required";
    if (!f.category.trim()) e.category = "Category is required";
    if (f.stock === "" || Number(f.stock) < 0)
      e.stock = "Valid stock is required";
    setErrors(e);
    return !Object.keys(e).length;
  }
  async function submit(e) {
    e.preventDefault();
    if (loading || !validate()) return;
    setLoading(true);
    setError("");
    try {
      if (product)
        await updateProduct(product.id, {
          ...f,
          price: Number(f.price),
          stock: Number(f.stock),
        });
      else
        await addProduct({
          ...f,
          price: Number(f.price),
          stock: Number(f.stock),
        });
      router.push("/products");
    } catch (e) {
      setError("Save failed. Please retry.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <form
      onSubmit={submit}
      className="max-w-2xl rounded-2xl border bg-white p-6"
    >
      {error && (
        <div className="mb-4 rounded bg-red-50 p-3 text-red-700">{error}</div>
      )}
      {[
        ["title", "Title"],
        ["category", "Category"],
        ["price", "Price"],
        ["stock", "Stock"],
      ].map(([k, l]) => (
        <label key={k} className="mb-4 block text-sm font-medium">
          {l}
          <input
            type={k === "price" || k === "stock" ? "number" : "text"}
            value={f[k]}
            onChange={(e) => setF({ ...f, [k]: e.target.value })}
            className="mt-1 w-full rounded-lg border p-2.5"
          />
          {errors[k] && (
            <span className="text-xs text-red-600">{errors[k]}</span>
          )}
        </label>
      ))}
      <label className="block text-sm font-medium">
        Description
        <textarea
          value={f.description}
          onChange={(e) => setF({ ...f, description: e.target.value })}
          rows="5"
          className="mt-1 w-full rounded-lg border p-2.5"
        />
      </label>
      <div className="mt-5 flex gap-3">
        <button
          disabled={loading}
          className="rounded-lg bg-slate-900 px-4 py-2.5 text-white disabled:opacity-50"
        >
          {loading ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border px-4 py-2.5"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
