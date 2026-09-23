import "./globals.css";
export const metadata = {
  title: "Product Admin Dashboard",
  description: "DummyJSON product admin assignment",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
