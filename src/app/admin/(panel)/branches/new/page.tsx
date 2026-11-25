import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { adminHref, requireAbnexa } from "@/lib/adminAuth";
import { NewBranchForm } from "./NewBranchForm";

export default async function NewBranchPage() {
  await requireAbnexa();
  return (
    <div className="mx-auto max-w-3xl">
      <Link href={await adminHref("/")} className="mb-4 inline-flex items-center gap-1.5 text-sm font-bold text-[#0D9488]">
        <ArrowLeft className="size-4" /> सर्व शाखा
      </Link>
      <h1 className="mb-6 text-2xl font-extrabold">नवीन शाखा</h1>
      <NewBranchForm />
    </div>
  );
}
