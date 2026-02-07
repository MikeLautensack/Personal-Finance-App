// import { redirect } from "next/navigation";
// import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { QueryProvider } from "@/components/query-provider";

// TODO: Re-enable auth when ready to set up OAuth
// Mock user for local development
const mockUser = {
  id: "local-dev-user",
  email: "dev@localhost",
  user_metadata: {
    full_name: "Local Dev",
  },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Re-enable auth when ready to set up OAuth
  // const supabase = await createClient();
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();
  // if (!user) {
  //   redirect("/");
  // }

  const user = mockUser;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Sidebar />
      <div className="lg:pl-64">
        <Header user={user} />
        <QueryProvider>
          <main className="py-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </QueryProvider>
      </div>
    </div>
  );
}
