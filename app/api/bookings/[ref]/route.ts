import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";

// GET booking by bookingRef or id
export async function GET(
  req: NextRequest,
  { params }: { params: { ref: string } }
) {
  const db = readDB();
  const ref = params.ref;
  const booking = db.bookings.find(
    (b) => b.bookingRef === ref || b.id === ref
  );
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

  const trip = db.trips.find((t) => t.id === booking.tripId);
  return NextResponse.json({ booking, trip });
}

// PATCH — modify seats
export async function PATCH(
  req: NextRequest,
  { params }: { params: { ref: string } }
) {
  const body = await req.json();
  const { newSeats } = body;
  const db = readDB();
  const bookingIndex = db.bookings.findIndex((b) => b.bookingRef === params.ref || b.id === params.ref);

  if (bookingIndex === -1) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

  const booking = db.bookings[bookingIndex];
  if (booking.status === "cancelled") return NextResponse.json({ error: "Booking is cancelled" }, { status: 400 });

  const tripIndex = db.trips.findIndex((t) => t.id === booking.tripId);
  if (tripIndex === -1) return NextResponse.json({ error: "Trip not found" }, { status: 404 });

  const trip = db.trips[tripIndex];
  const otherBooked = trip.bookedSeats.filter((s) => !booking.seats.includes(s));
  const conflicts = newSeats.filter((s: string) => otherBooked.includes(s));

  if (conflicts.length > 0) {
    return NextResponse.json({ error: `Seats unavailable: ${conflicts.join(", ")}` }, { status: 409 });
  }

  // Update trip seats
  db.trips[tripIndex].bookedSeats = [...otherBooked, ...newSeats];

  // Update booking
  db.bookings[bookingIndex].seats = newSeats;
  db.bookings[bookingIndex].totalAmount = trip.price * newSeats.length;

  writeDB(db);
  return NextResponse.json(db.bookings[bookingIndex]);
}

// DELETE — cancel booking
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { ref: string } }
) {
  const db = readDB();
  const bookingIndex = db.bookings.findIndex((b) => b.bookingRef === params.ref || b.id === params.ref);
  if (bookingIndex === -1) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

  const booking = db.bookings[bookingIndex];
  const tripIndex = db.trips.findIndex((t) => t.id === booking.tripId);

  if (tripIndex !== -1) {
    db.trips[tripIndex].bookedSeats = db.trips[tripIndex].bookedSeats.filter(
      (s) => !booking.seats.includes(s)
    );
  }

  db.bookings[bookingIndex].status = "cancelled";
  writeDB(db);
  return NextResponse.json({ message: "Booking cancelled successfully" });
}
