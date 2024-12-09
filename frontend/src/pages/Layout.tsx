import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/toaster";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div>
        <SidebarProvider>
          <AppSidebar />
          <main className="my-10 mx-auto px-8 w-screen">{children}</main>
          <Toaster />
        </SidebarProvider>
      </div>
    </>
  );
}
