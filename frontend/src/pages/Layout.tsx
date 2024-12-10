import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/toaster";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div>
        <SidebarProvider>
          <div className="visible md:hidden">
            <SidebarTrigger />
          </div>
          <AppSidebar />
          <main className="my-10 mx-auto px-8 w-screen">{children}</main>
          <Toaster />
        </SidebarProvider>
      </div>
    </>
  );
}
