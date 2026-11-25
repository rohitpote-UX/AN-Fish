export type OrderStatus = "new" | "confirmed" | "ready" | "completed" | "cancelled";

export const ORDER_LABEL: Record<OrderStatus, { t: string; cls: string }> = {
  new: { t: "नवीन", cls: "bg-amber-100 text-amber-800" },
  confirmed: { t: "कन्फर्म", cls: "bg-sky-100 text-sky-800" },
  ready: { t: "तयार", cls: "bg-teal-100 text-teal-800" },
  completed: { t: "पूर्ण", cls: "bg-emerald-100 text-emerald-800" },
  cancelled: { t: "रद्द", cls: "bg-red-100 text-red-700" },
};

export const ORDER_NEXT: Partial<Record<OrderStatus, { to: OrderStatus; t: string }>> = {
  new: { to: "confirmed", t: "कन्फर्म करा" },
  confirmed: { to: "ready", t: "तयार झाले" },
  ready: { to: "completed", t: "दिले / पूर्ण" },
};

const MSG: Record<OrderStatus, string> = {
  new: "तुमची ऑर्डर मिळाली आहे. लवकरच कन्फर्म करतो. 🙏",
  confirmed: "तुमची ऑर्डर कन्फर्म केली आहे. ✅ तयार झाल्यावर आम्ही कळवू.",
  ready: "तुमची ऑर्डर तयार आहे! कृपया दालनात येऊन घेऊन जा. 🏪",
  completed: "ऑर्डर पूर्ण झाली. आमच्याकडून खरेदी केल्याबद्दल धन्यवाद! 🙏",
  cancelled: "क्षमस्व, तुमची ऑर्डर रद्द करण्यात आली आहे. अधिक माहितीसाठी संपर्क करा.",
};

/** Ready-to-send WhatsApp link with a formatted message for the customer. */
export function orderWaLink(o: { id: number; phone: string; name: string; branch: string; items: string[]; total: number }, status: OrderStatus): string {
  const bar = "━━━━━━━━━━━━━━";
  const text = [
    "🐟 *AN FISH WORLD*", bar,
    `🧾 *ऑर्डर #${o.id}*  ·  ${ORDER_LABEL[status].t}`,
    `📍 ${o.branch.replace(/^ए एन फिश वर्ल्ड\s*—\s*/, "")}`,
    "", `नमस्कार ${o.name},`, MSG[status], "",
    ...o.items.filter(Boolean).map((l) => `▪️ ${l}`),
    bar, `💰 *अंदाजे रक्कम: ₹${o.total.toLocaleString("en-IN")}*`, "🏪 पैसे दालनात द्यायचे",
  ].join("\n");
  return `https://wa.me/91${o.phone}?text=${encodeURIComponent(text)}`;
}
