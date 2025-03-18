import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/hooks/use-sidebar";
import { TaskProvider } from "@/hooks/use-task";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider>
        <TaskProvider>
          <Navbar />
          {children}
        </TaskProvider>
        <Sidebar />
      </SidebarProvider>
    </ThemeProvider>
  );
}