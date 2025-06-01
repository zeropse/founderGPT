import AppNavbar from "@/components/AppNavbar";
import AppFooter from "@/components/AppFooter";

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <AppNavbar />
      <main className="flex-1">{children}</main>
      <AppFooter />
    </div>
  );
}
