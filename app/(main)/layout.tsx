import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { KeyboardShortcutsModal } from "@/components/layout/keyboard-shortcuts-modal";
import { KeyboardShortcutsProvider } from "@/components/layout/keyboard-shortcuts-provider";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <KeyboardShortcutsProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 ml-64 p-8">
            {children}
          </main>
        </div>
        <KeyboardShortcutsModal />
      </div>
    </KeyboardShortcutsProvider>
  );
}