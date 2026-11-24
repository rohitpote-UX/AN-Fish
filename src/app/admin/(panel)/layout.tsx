import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

// Every page inside (panel) requires a valid session.
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return <>{children}</>;
}
