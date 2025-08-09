import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
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
      <div className="min-h-screen bg-black">
        <Header />
        <main className="pt-20 pb-20 md:pb-8 px-6 md:px-8">
          {children}
        </main>
        <MobileNav />
        <KeyboardShortcutsModal />
      </div>
    </KeyboardShortcutsProvider>
  );
}