"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProduct } from "@/lib/api";
import ProductForm from "@/components/ProductForm";
import Loader from "@/components/Loader";
export default function Edit() {
  const { id } = useParams();
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
  if (err) return <div className="text-red-600">Product not found.</div>;
  return (
    <>
      <h1 className="mb-5 text-2xl font-bold">Edit Product</h1>
      <ProductForm product={p} />
    </>
  );
}
