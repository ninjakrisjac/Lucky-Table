import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";

// const clash = localFont({
//   src: "../fonts/ClashDisplay-Variable.ttf",
//   variable: "--font-clash",
//   display: "swap",
//   // Fallback if local font is missing
//   fallback: ["system-ui", "sans-serif"],
// });

// If local font is not available, we can use Space Grotesk as a high-quality Google Font alternative
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-clash", // Reusing the variable name to keep tailwind config simple
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LUCKY TABLE | Encrypted Probability",
  description: "High-stakes probability engine powered by FHE.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrains.variable}`}>
      <body className="bg-void text-metal antialiased selection:bg-neon-acid selection:text-black">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
