import { NextRequest, NextResponse } from "next/server";
import { readDB } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const db = readDB();
  const trip = db.trips.find((t) => t.id === params.id);
  if (!trip) return NextResponse.json({ error: "Trip not found" }, { status: 404 });
  return NextResponse.json({ ...trip, availableSeats: trip.totalSeats - trip.bookedSeats.length });
}
