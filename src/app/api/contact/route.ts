import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  phone: z.string().regex(/^[0-9]{10}$/, "Valid 10-digit mobile number required"),
  email: z.string().email().optional().or(z.literal("")),
  message: z.string().min(5, "Message must be at least 5 characters"),
  // Honeypot field (must remain empty)
  websiteUrl: z.string().max(0, "Spam detected").optional(),
});

// Simple in-memory rate limiting map
const ipRequests = new Map<string, { count: number; timestamp: number }>();

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown-ip";
    const now = Date.now();
    const windowMs = 60 * 1000;
    const maxReqs = 8;

    const record = ipRequests.get(ip);
    if (record) {
      if (now - record.timestamp < windowMs) {
        if (record.count >= maxReqs) {
          return NextResponse.json(
            { error: "Too many requests. Please try again in a minute." },
            { status: 429 }
          );
        }
        record.count++;
      } else {
        ipRequests.set(ip, { count: 1, timestamp: now });
      }
    } else {
      ipRequests.set(ip, { count: 1, timestamp: now });
    }

    const body = await req.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid form input", details: parsed.error.format() },
        { status: 400 }
      );
    }

    // Process valid contact inquiry
    return NextResponse.json({
      success: true,
      message: "Inquiry received. AN Fish World team will respond shortly.",
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
