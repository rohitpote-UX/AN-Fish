import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_WHATSAPP_NUMBER: z.string().default("+9198XXXXXXXX"),
  NEXT_PUBLIC_PHONE_NUMBER: z.string().default("+9198XXXXXXXX"),
  NEXT_PUBLIC_SITE_URL: z.string().default("https://anfishworld.com"),
  RESEND_API_KEY: z.string().optional(),
  RATE_LIMIT_MAX_REQUESTS: z.string().default("10"),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
  NEXT_PUBLIC_PHONE_NUMBER: process.env.NEXT_PUBLIC_PHONE_NUMBER,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  RATE_LIMIT_MAX_REQUESTS: process.env.RATE_LIMIT_MAX_REQUESTS,
});
