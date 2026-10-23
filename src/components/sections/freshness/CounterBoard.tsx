"use client";

import React, { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { Radio, RefreshCw, MessageCircle, AlertCircle, ArrowUpRight } from "lucide-react";
import { PLACEHOLDERS } from "@/data/placeholders";

interface CatchRow {
  fish: string;
  today: string;
  updated: string;
  status: string;
}

export function CounterBoard() {
  const locale = useLocale();
  const isMarathi = locale === "mr";

  const [rows, setRows] = useState<CatchRow[]>([
    {
      fish: "King Surmai (किंग सुरमई)",
      today: "Fresh Catch Available · ₹[FILL: RATE_SURMAI]/kg",
      updated: "Today, 7:15 AM",
      status: "Available",
    },
    {
      fish: "Silver Pomfret (पापलेट)",
      today: "Dawn Pier Catch · ₹[FILL: RATE_POMFRET]/kg",
      updated: "Today, 7:20 AM",
      status: "Available",
    },
    {
      fish: "Tiger Prawns (मोठी कोळंबी)",
      today: "Ice Slurry Packed · ₹[FILL: RATE_PRAWNS]/kg",
      updated: "Today, 7:30 AM",
      status: "Available",
    },
  ]);
  const [lastSynced, setLastSynced] = useState("Today · 7:30 AM");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/catch")
      .then((res) => res.json())
      .then((data) => {
        if (active && data.rows) {
          setRows(data.rows);
          if (data.lastSynced) setLastSynced(data.lastSynced);
        }
      })
      .catch(() => {
        // Fallback is already initialized in state
      });
    return () => {
      active = false;
    };
  }, []);

  const cleanPhone = PLACEHOLDERS.WHATSAPP_NUMBER.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    isMarathi
      ? "नमस्कार AN Fish World कराड, मला आजच्या मलकापूर दालनातील ताज्या आवकमधून रिझर्व्ह करायचे आहे."
      : "Hello AN Fish World Karad, I would like to reserve from today's Malkapur counter stock."
  )}`;

  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl bg-[#0F1F10] text-white border border-white/10 shadow-2xl p-6 sm:p-10 space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-mono-accent text-[#6EC6F0] font-bold uppercase tracking-wider">
              {isMarathi ? "थेट दालन आवक बोर्ड" : "LIVE TELEMETRY BOARD"}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1 font-mono-accent">
            Karad — Malakapur counter
          </h3>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono-accent text-white/60">
          <span>Synced: {lastSynced}</span>
          <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/10 text-[11px] text-[#6EC6F0]">
            Staff Mobile Feed
          </span>
        </div>
      </div>

      {/* Alethia-Style Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-xs font-mono-accent uppercase tracking-wider text-white/50">
              <th className="py-3 px-4 font-semibold">{isMarathi ? "मासा (Fish)" : "Fish"}</th>
              <th className="py-3 px-4 font-semibold">{isMarathi ? "आजची आवक (Today)" : "Today"}</th>
              <th className="py-3 px-4 font-semibold text-right">{isMarathi ? "वेळ (Updated)" : "Updated"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/05 font-mono-accent text-sm">
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-white/05 transition-colors group">
                <td className="py-4 px-4 font-bold text-white group-hover:text-[#6EC6F0] transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#0A9AD9]">{idx + 1}.</span>
                    <span>{row.fish}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-white/80">
                  <span className="inline-block px-2.5 py-1 rounded-lg bg-white/05 border border-white/10 text-xs">
                    {row.today}
                  </span>
                </td>
                <td className="py-4 px-4 text-right text-xs text-white/60">
                  {row.updated}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Notice & CTA Footer */}
      <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono-accent">
        <div className="flex items-center gap-2 text-white/50">
          <AlertCircle className="w-3.5 h-3.5 text-[#0A9AD9] shrink-0" />
          <span>
            {isMarathi
              ? "दररोज सकाळी बंदर लिलावानंतर दर अद्ययावत केले जातात. [FILL] मूल्ये थेट फोन ॲपवरून सिंक होतात."
              : "Live rates fluctuate with coastal auction supply. [FILL] values sync automatically via staff phone app."}
          </span>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0A9AD9] hover:bg-[#6EC6F0] text-white hover:text-[#0F1F10] font-bold text-xs uppercase tracking-wider transition-all self-start sm:self-auto cursor-pointer"
        >
          <MessageCircle className="w-3.5 h-3.5 fill-current" />
          <span>{isMarathi ? "ताजी आवक रिझर्व्ह करा" : "Reserve Today's Catch"}</span>
        </a>
      </div>
    </div>
  );
}
