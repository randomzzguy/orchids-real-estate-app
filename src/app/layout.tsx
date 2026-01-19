import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { VisualEditsMessenger } from "orchids-visual-edits";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Nestify - Find Your Dream Home",
  description: "Swipe through stunning properties and discover your perfect home",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen">
        <AuthProvider>
          {children}
          <Toaster 
            position="top-center" 
            toastOptions={{
              style: {
                background: 'oklch(0.14 0.01 260)',
                border: '1px solid oklch(0.28 0.01 260)',
                color: 'oklch(0.97 0.01 260)',
              },
            }}
          />
        </AuthProvider>
        <VisualEditsMessenger />
      </body>
    </html>
  );
}
