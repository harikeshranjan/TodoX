import Navbar from "@/components/navbar";
import { Provider } from "@/components/provider";
import Sidebar from "@/components/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/hooks/use-sidebar";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <SidebarProvider>
          {/* <TaskProvider> */}
          <Navbar />
          {children}
          {/* </TaskProvider> */}
          <Sidebar />
        </SidebarProvider>
      </ThemeProvider>
    </Provider>
  );
}