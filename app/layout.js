import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata = {
  title: "Renovate IT",
  description: "Generated A 3D model for your home",
  openGraph: {
    title: "Renovate IT",
    description: "Generated A 3D model for your home",
    url: "https://renovate-it.netlify.app/",
    images: [
      {
        url: "https://renovate-it.netlify.app/Renovate-IT.png",
        width: 1366,
        height: 768,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Renovate IT",
    description:
      "Generated A 3D model for your home",
    creator: "@mahdii_Dz",
    image: ["https://renovate-it.netlify.app/Renovate-IT.png",],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} overflow-hidden w-full h-dvh`}>
        {children}
      </body>
    </html>
  );
}
