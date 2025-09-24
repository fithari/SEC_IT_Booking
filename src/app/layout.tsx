// src/app/layout.tsx

import "./globals.css";

export const metadata = {
  title: "IT Support Request",
  description: "Submit your IT support request",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}