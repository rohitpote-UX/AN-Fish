import { redirect } from "next/navigation";
import { adminHref, requireSession } from "@/lib/adminAuth";
import { HeadDashboard } from "../Dashboard";
import { LowStockAlert } from "../LowStockAlert";

/** Branch admin's dashboard: the same screen as head office, but only ever their own branch. */
export default async function BranchDashboardPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const s = await requireSession();
  if (s.role !== "branch_admin" || !s.branchId) redirect(await adminHref("/"));
  return (
    <div className="mx-auto max-w-[1400px] space-y-5">
      <LowStockAlert branchId={s.branchId} />
      <HeadDashboard sp={await searchParams} fixedBranchId={s.branchId} basePath="/dashboard" />
    </div>
  );
}
