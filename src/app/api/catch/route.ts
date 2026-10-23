import { NextResponse } from "next/server";

export interface CatchBoardRow {
  fish: string;
  today: string;
  updated: string;
  status: "Available" | "Fast Selling" | "Sold Out";
}

export interface CatchApiResponse {
  counter: string;
  location: string;
  lastSynced: string;
  source: string;
  rows: CatchBoardRow[];
}

export async function GET() {
  // Configured to pull from Google Sheet / Staff CMS once connected.
  // Shows [FILL] values until the external sheet webhook is plugged in.
  const data: CatchApiResponse = {
    counter: "Karad — Malakapur counter",
    location: "Pune-Bangalore Highway, Nehru Nagar, Malkapur, Karad",
    lastSynced: "Today · 7:30 AM",
    source: "[FILL: GOOGLE_SHEET_FEED_URL]",
    rows: [
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
    ],
  };

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
    },
  });
}
