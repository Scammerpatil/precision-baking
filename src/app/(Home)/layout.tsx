"use client";
import "../globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import { UserProvider } from "@/context/AuthProvider";

const Component = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <head>
        <title>
          PrecisionBaking | Bake with Accuracy, Perfect Every Recipe!
        </title>
        <meta
          name="description"
          content="Precision Baking is a revolutionary AI-powered tool designed for bakers, chefs, and culinary professionals who demand accuracy in their recipes. Many online recipes use imprecise measurements like 'cups' and 'spoons', which can lead to inconsistent results. Our platform solves this by converting these vague units into precise gram-based measurements using a comprehensive ingredient density database and advanced real-time conversion algorithms."
        />
      </head>
      <body className={`antialiased`}>
        <Toaster />
        <Navbar />
        {children}
      </body>
    </html>
  );
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserProvider>
      <Component>{children}</Component>
    </UserProvider>
  );
}
