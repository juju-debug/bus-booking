import { NextRequest, NextResponse } from "next/server";
import { readDB } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const date = searchParams.get("date");
  const busType = searchParams.get("busType");

  const db = readDB();
  let trips = db.trips;

  if (from) trips = trips.filter((t) => t.from.toLowerCase().includes(from.toLowerCase()));
  if (to) trips = trips.filter((t) => t.to.toLowerCase().includes(to.toLowerCase()));
  if (date) trips = trips.filter((t) => t.departureDate === date);
  if (busType && busType !== "All") trips = trips.filter((t) => t.busType === busType);

  // Add available seats count
  const enriched = trips.map((trip) => ({
    ...trip,
    availableSeats: trip.totalSeats - trip.bookedSeats.length,
  }));

  return NextResponse.json(enriched);
}
