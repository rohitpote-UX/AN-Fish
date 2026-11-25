import { redirect } from "next/navigation";
import { adminHref, requireSession } from "@/lib/adminAuth";
import { HeadDashboard } from "../Dashboard";

/** Branch admin's dashboard: the same screen as head office, but only ever their own branch. */
export default async function BranchDashboardPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const s = await requireSession();
  if (s.role !== "branch_admin" || !s.branchId) redirect(await adminHref("/"));
  return <HeadDashboard sp={await searchParams} fixedBranchId={s.branchId} basePath="/dashboard" />;
}
