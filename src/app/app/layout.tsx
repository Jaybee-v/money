import { AppSidebar } from "@/components/navigation/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getSession } from "@/lib/session";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Ma gestion de budget",
  description: "Generated by create next app",
};

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await getSession();

  if (!user) redirect("/");

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="h-screen w-screen p-1 md:p-4">
        <SidebarTrigger className="md:hidden" />
        {children}
      </main>
    </SidebarProvider>
  );
}
