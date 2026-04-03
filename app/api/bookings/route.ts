import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";
import { generateBookingRef } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { tripId, passenger, seats } = body;

  if (!tripId || !passenger || !seats || seats.length === 0) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const db = readDB();
  const tripIndex = db.trips.findIndex((t) => t.id === tripId);
  if (tripIndex === -1) return NextResponse.json({ error: "Trip not found" }, { status: 404 });

  const trip = db.trips[tripIndex];

  // Check seat availability
  const conflicts = seats.filter((s: string) => trip.bookedSeats.includes(s));
  if (conflicts.length > 0) {
    return NextResponse.json({ error: `Seats already booked: ${conflicts.join(", ")}` }, { status: 409 });
  }

  // Mark seats as booked on the trip
  db.trips[tripIndex].bookedSeats = [...trip.bookedSeats, ...seats];

  // Create booking record
  const booking = {
    id: uuidv4(),
    bookingRef: generateBookingRef(),
    tripId,
    passenger,
    seats,
    status: "confirmed" as const,
    createdAt: new Date().toISOString(),
    totalAmount: trip.price * seats.length,
  };

  db.bookings.push(booking);
  writeDB(db);

  return NextResponse.json(booking, { status: 201 });
}

export async function GET() {
  const db = readDB();
  return NextResponse.json(db.bookings);
}
