"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SeatMap from "@/components/SeatMap";
import { Booking, Trip } from "@/lib/types";
import { useToast } from "@/components/ToastProvider";

function MyBookingContent() {
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const [refInput, setRefInput] = useState(searchParams.get("ref") || "");
  const [idInput, setIdInput] = useState("");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const [modifyMode, setModifyMode] = useState(false);
  const [newSeats, setNewSeats] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  async function fetchBooking(ref: string) {
    if (!ref.trim()) return;
    setLoading(true);
    setNotFound(false);
    setBooking(null);
    setTrip(null);
    setModifyMode(false);

    try {
      const res = await fetch(`/api/bookings/${ref.trim().toUpperCase()}`);
      if (!res.ok) { setNotFound(true); return; }
      const data = await res.json();
      // Simple ID verification if provided
      if (idInput.trim() && data.booking.passenger.idNumber !== idInput.trim()) {
        showToast("ID number does not match this booking.", "error");
        setNotFound(true);
        return;
      }
      setBooking(data.booking);
      setTrip(data.trip);
      setNewSeats(data.booking.seats);
    } catch {
      setNotFound(true);
      showToast("Failed to retrieve booking.", "error");
    } finally {
      setLoading(false);
    }
  }

  // Auto-load if ref is in URL
  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      setRefInput(ref);
      fetchBooking(ref);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCancel() {
    if (!booking) return;
    if (!confirm("Are you sure you want to cancel this booking? This action cannot be undone.")) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/bookings/${booking.bookingRef}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast("Booking cancelled successfully.", "info");
      setBooking({ ...booking, status: "cancelled" });
    } catch (e: any) {
      showToast(e.message || "Could not cancel booking.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleModify() {
    if (!booking || !trip) return;
    if (newSeats.length === 0) { showToast("Please select at least one seat.", "error"); return; }
    setSaving(true);
    try {
      const res = await fetch(`/api/bookings/${booking.bookingRef}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newSeats }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast("Seats updated successfully!", "success");
      setBooking({ ...booking, seats: newSeats, totalAmount: trip.price * newSeats.length });

      // Refresh trip data to get updated booked seats
      const tripRes = await fetch(`/api/trips/${trip.id}`);
      const tripData = await tripRes.json();
      setTrip(tripData);
      setModifyMode(false);
    } catch (e: any) {
      showToast(e.message || "Could not update seats.", "error");
    } finally {
      setSaving(false);
    }
  }

  // Build a modified trip view for the seat map (excluding current booking's seats so they appear selectable)
  const tripForModify = trip && booking ? {
    ...trip,
    bookedSeats: trip.bookedSeats.filter((s) => !booking.seats.includes(s)),
  } : trip;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-white mb-2">My Booking</h1>
        <p className="text-slate-400">Enter your booking reference to view, modify, or cancel your reservation.</p>
      </div>

      {/* Lookup form */}
      <div className="glass rounded-2xl p-6 border border-white/7 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">Booking Reference</label>
            <input
              className="input-field font-mono-custom tracking-widest uppercase"
              placeholder="e.g. BK-A3F7XKQP"
              value={refInput}
              onChange={(e) => setRefInput(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && fetchBooking(refInput)}
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">ID Number (optional)</label>
            <input
              className="input-field"
              placeholder="For verification"
              value={idInput}
              onChange={(e) => setIdInput(e.target.value)}
            />
          </div>
        </div>
        <button
          className="btn-primary mt-4 px-8 py-2.5 rounded-xl text-sm"
          onClick={() => fetchBooking(refInput)}
          disabled={loading || !refInput.trim()}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              Searching…
            </span>
          ) : "Find Booking →"}
        </button>
      </div>

      {/* Not found */}
      {notFound && (
        <div className="text-center py-16 glass rounded-2xl border border-white/7">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="font-display font-bold text-white text-xl mb-2">No booking found</h3>
          <p className="text-slate-400 text-sm">Double-check your reference number. It should look like <span className="font-mono-custom text-orange-400">BK-XXXXXXXX</span>.</p>
        </div>
      )}

      {/* Booking result */}
      {booking && trip && (
        <div className="space-y-6 animate-slide-up">
          {/* Status banner */}
          <div className={`rounded-2xl p-4 flex items-center gap-3 ${
            booking.status === "confirmed"
              ? "bg-green-500/10 border border-green-500/20"
              : "bg-red-500/10 border border-red-500/20"
          }`}>
            <span className="text-2xl">{booking.status === "confirmed" ? "✅" : "❌"}</span>
            <div>
              <p className={`font-display font-semibold ${booking.status === "confirmed" ? "text-green-400" : "text-red-400"}`}>
                Booking {booking.status === "confirmed" ? "Confirmed" : "Cancelled"}
              </p>
              <p className="text-slate-400 text-xs">Reference: <span className="font-mono-custom text-white">{booking.bookingRef}</span></p>
            </div>
            <span className={`ml-auto badge ${booking.status === "confirmed" ? "badge-confirmed" : "badge-cancelled"}`}>
              {booking.status}
            </span>
          </div>

          {/* Booking details */}
          <div className="glass rounded-2xl p-6 border border-white/7">
            <h2 className="font-display font-semibold text-white text-lg mb-5">Booking Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-slate-500 text-xs uppercase tracking-wider">Trip Info</h3>
                {[
                  ["Route", `${trip.from} → ${trip.to}`],
                  ["Date", new Date(trip.departureDate + "T00:00:00").toLocaleDateString("en-KE", { weekday: "long", day: "numeric", month: "long", year: "numeric" })],
                  ["Departure", trip.departureTime],
                  ["Arrival", trip.arrivalTime],
                  ["Operator", trip.operator],
                  ["Bus", trip.busNumber],
                  ["Bus Type", trip.busType],
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between text-sm border-b border-white/5 pb-2">
                    <span className="text-slate-500">{l}</span>
                    <span className="text-white font-medium text-right">{v}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <h3 className="text-slate-500 text-xs uppercase tracking-wider">Passenger Info</h3>
                {[
                  ["Name", booking.passenger.name],
                  ["ID / Passport", booking.passenger.idNumber],
                  ["Phone", booking.passenger.phone],
                  ...(booking.passenger.email ? [["Email", booking.passenger.email]] : []),
                  ["Seats", booking.seats.join(", ")],
                  ["Total Amount", `KES ${booking.totalAmount.toLocaleString()}`],
                  ["Booked On", new Date(booking.createdAt).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })],
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between text-sm border-b border-white/5 pb-2">
                    <span className="text-slate-500">{l}</span>
                    <span className={`font-medium text-right ${l === "Total Amount" ? "text-gradient font-bold" : "text-white"}`}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Seat Map — view only / modify */}
          {booking.status === "confirmed" && (
            <div className="glass rounded-2xl p-6 border border-white/7">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold text-white text-lg">
                  {modifyMode ? "Select New Seats" : "Your Seats"}
                </h2>
                {!modifyMode && (
                  <button className="btn-ghost text-sm px-4 py-2 rounded-xl" onClick={() => { setModifyMode(true); setNewSeats(booking.seats); }}>
                    ✏️ Modify Seats
                  </button>
                )}
              </div>

              {modifyMode && tripForModify ? (
                <>
                  <p className="text-slate-400 text-sm mb-4">
                    Select your new preferred seats. You currently have {booking.seats.length} seat{booking.seats.length > 1 ? "s" : ""}.
                  </p>
                  <SeatMap
                    trip={tripForModify}
                    selectedSeats={newSeats}
                    onSeatToggle={(seat) =>
                      setNewSeats((prev) => prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat])
                    }
                  />
                  <div className="flex gap-3 mt-5">
                    <button
                      className="btn-primary flex-1 py-2.5 rounded-xl text-sm"
                      disabled={saving || newSeats.length === 0}
                      onClick={handleModify}
                    >
                      {saving ? "Saving…" : `Save Changes (${newSeats.length} seat${newSeats.length !== 1 ? "s" : ""})`}
                    </button>
                    <button className="btn-ghost px-5 py-2.5 rounded-xl text-sm" onClick={() => setModifyMode(false)}>
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <SeatMap
                  trip={trip}
                  selectedSeats={[]}
                  onSeatToggle={() => {}}
                  highlightSeats={booking.seats}
                  readOnly
                />
              )}
            </div>
          )}

          {/* Actions */}
          {booking.status === "confirmed" && !modifyMode && (
            <div className="glass rounded-2xl p-5 border border-white/7">
              <h3 className="font-display font-semibold text-white mb-4">Booking Actions</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-red-400 border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 transition-colors"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  {saving ? "Cancelling…" : "🗑️ Cancel Booking"}
                </button>
              </div>
              <p className="text-slate-600 text-xs mt-3">
                ⚠️ Cancellations release your seat immediately. No refund process needed since payment is at the station.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function MyBookingPage() {
  return (
    <Suspense fallback={<div className="p-10 text-slate-400">Loading...</div>}>
      <MyBookingContent />
    </Suspense>
  );
}
