import "@/styles/globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "@/hooks/useAuth";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";

export const metadata: Metadata = {
  title: "SkillWork | Let The Work Find You",
  description: "An automated work-allocation platform that brings suitable tasks directly to skilled, verified workers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: "#F8FCFF", color: "#0F172A", minHeight: "100vh" }}>
        <AuthProvider>
          <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Navbar />
            <div style={{ display: "flex", flex: 1 }}>
              <Sidebar />
              <main
                style={{
                  flex: 1,
                  padding: "24px",
                  maxWidth: "1280px",
                  margin: "0 auto",
                  width: "100%",
                  paddingBottom: "80px", // space for mobile nav
                }}
              >
                {children}
              </main>
            </div>
            <MobileNav />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
