import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata = {
  title: "Home Renovate",
  description: "Generated A 3D model for your home",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} overflow-hidden w-full h-dvh`}>{children}</body>
    </html>
  );
}
