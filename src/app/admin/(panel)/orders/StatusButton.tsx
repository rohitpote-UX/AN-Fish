"use client";

import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { setOrderStatusAction, type OrderStatus } from "./actions";

/**
 * Changes the order status and (for confirm / ready / cancel) opens WhatsApp with the
 * customer's message already written, so the admin only has to press Send.
 */
export function StatusButton({ orderId, to, label, waHref, confirmText, className }: {
  orderId: number; to: OrderStatus; label: string; waHref?: string; confirmText?: string; className: string;
}) {
  const [pending, start] = useTransition();
  const click = () => {
    if (confirmText && !window.confirm(confirmText)) return;
    // Open the tab synchronously (pop-up blockers), then point it at WhatsApp once the status is saved.
    const tab = waHref ? window.open("", "_blank") : null;
    start(async () => {
      await setOrderStatusAction(orderId, to);
      if (tab && waHref) tab.location.href = waHref;
    });
  };
  return (
    <button type="button" onClick={click} disabled={pending} className={`${className} inline-flex items-center gap-1.5 disabled:opacity-70`}>
      {pending && <Loader2 className="size-4 animate-spin" />}
      {label}
    </button>
  );
}
