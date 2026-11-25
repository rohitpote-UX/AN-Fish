"use client";

import { FileText } from "lucide-react";

export function PrintButton() {
  return (
    <button onClick={() => window.print()} className="flex h-11 items-center gap-2 rounded-xl bg-[#DC5252] px-4 text-sm font-bold text-white hover:brightness-110">
      <FileText className="size-4" /> PDF / प्रिंट
    </button>
  );
}
