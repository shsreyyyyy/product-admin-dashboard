import Protected from "@/components/Protected";
import Layout from "@/components/Layout";
export default function ProductsLayout({ children }) {
  return (
    <Protected>
      <Layout>{children}</Layout>
    </Protected>
  );
}
