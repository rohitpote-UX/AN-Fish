import { PLACEHOLDERS } from "@/data/placeholders";

export interface WhatsAppOrderPayload {
  customerName: string;
  phone: string;
  address: string;
  slot: "morning" | "evening";
  specialNotes?: string;
  items: Array<{
    name: string;
    weight: string;
    cut: string;
    quantity: number;
  }>;
}

export function generateWhatsAppOrderUrl(payload: WhatsAppOrderPayload): string {
  const itemsText = payload.items
    .map(
      (item, i) =>
        `${i + 1}. *${item.name}* (${item.weight}, ${item.cut}) x ${item.quantity}`
    )
    .join("\n");

  const message =
    `*ए एन फिश वर्ल्ड — कराड (ताजी मासोळी ऑर्डर)*\n\n` +
    `👤 *ग्राहक:* ${payload.customerName}\n` +
    `📞 *मोबाईल:* ${payload.phone}\n` +
    `📍 *डिलिव्हरी पत्ता:* ${payload.address}\n` +
    `⏰ *वेळ:* ${
      payload.slot === "morning"
        ? "सकाळची आवक (8:30 - 11:30 AM)"
        : "संध्याकाळची आवक (5:00 - 7:30 PM)"
    }\n` +
    (payload.specialNotes ? `📝 *विशेष सूचना:* ${payload.specialNotes}\n` : "") +
    `\n🐟 *मागवलेली मासोळी:*\n${itemsText}\n\n` +
    `कृपया आजचे अचूक दर व डिलिव्हरी वेळ कन्फर्म करावी.`;

  const cleanNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || PLACEHOLDERS.WHATSAPP_NUMBER).replace(
    /[^0-9]/g,
    ""
  );

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}
