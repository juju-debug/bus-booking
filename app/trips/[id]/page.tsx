"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SeatMap from "@/components/SeatMap";
import { Trip } from "@/lib/types";
import { useToast } from "@/components/ToastProvider";

const STEPS = ["Select Seats", "Your Details", "Confirm"];

const amenityIcons: Record<string, string> = {
  "AC": "❄️", "WiFi": "📶", "USB Charging": "🔌",
  "Reclining Seats": "💺", "Onboard Snacks": "🍪",
};

export default function TripDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useToast();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "", idNumber: "", phone: "", email: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch(`/api/trips/${id}`)
      .then((r) => r.json())
      .then((data) => { setTrip(data); setLoading(false); })
      .catch(() => { showToast("Failed to load trip.", "error"); setLoading(false); });
  }, [id, showToast]);

  function toggleSeat(seat: string) {
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  }

  function validateForm() {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = "Full name is required";
    if (!form.idNumber.trim()) errors.idNumber = "ID / Passport number is required";
    if (!/^(\+254|07|01)\d{8,9}$/.test(form.phone.replace(/\s/g, "")))
      errors.phone = "Enter a valid Kenyan phone number";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errors.email = "Enter a valid email address";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleBooking() {
    if (!trip) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripId: trip.id,
          passenger: form,
          seats: selectedSeats,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");
      showToast(`Booking confirmed! Ref: ${data.bookingRef}`, "success");
      router.push(`/my-booking?ref=${data.bookingRef}`);
    } catch (err: any) {
      showToast(err.message || "Something went wrong.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 flex justify-center items-center gap-3 text-slate-400">
        <div className="w-5 h-5 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
        Loading trip details…
      </div>
    );
  }
  if (!trip) return <div className="text-center py-20 text-slate-400">Trip not found.</div>;

  const totalPrice = trip.price * selectedSeats.length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back */}
      <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition-colors">
        ← Back to trips
      </button>

      {/* Trip header */}
      <div className="glass rounded-2xl p-6 border border-white/7 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`badge ${trip.busType === "Luxury" ? "badge-luxury" : "badge-standard"}`}>
                {trip.busType === "Luxury" ? "⭐" : "🚌"} {trip.busType}
              </span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">
              {trip.from} <span className="text-orange-500">→</span> {trip.to}
            </h1>
            <p className="text-slate-400 text-sm mt-1">{trip.operator} · {trip.busNumber}</p>
          </div>
          <div className="text-left md:text-right">
            <p className="font-display font-bold text-3xl text-gradient">KES {trip.price.toLocaleString()}</p>
            <p className="text-slate-500 text-xs">per seat · Pay at station</p>
          </div>
        </div>

        <div className="mt-5 pt-5 border-t border-white/7 flex flex-wrap gap-6">
          <div>
            <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Departure</p>
            <p className="font-display font-bold text-white text-xl">{trip.departureTime}</p>
            <p className="text-slate-400 text-xs">{new Date(trip.departureDate + "T00:00:00").toLocaleDateString("en-KE", { weekday: "long", day: "numeric", month: "long" })}</p>
          </div>
          <div className="flex items-center">
            <div className="text-slate-600">→ {trip.duration} →</div>
          </div>
          <div>
            <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Arrival</p>
            <p className="font-display font-bold text-white text-xl">{trip.arrivalTime}</p>
            <p className="text-slate-400 text-xs">{trip.to}</p>
          </div>
          <div className="ml-auto">
            <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Amenities</p>
            <div className="flex flex-wrap gap-1">
              {trip.amenities.map((a) => (
                <span key={a} title={a} className="text-base">{amenityIcons[a] ?? "•"}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`flex items-center gap-2 text-sm font-medium transition-colors ${
              i === step ? "text-orange-400 step-active" : i < step ? "text-green-400 step-done" : "text-slate-600 step-inactive"
            }`}>
              <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                i === step ? "border-orange-500 bg-orange-500/20 text-orange-400" :
                i < step ? "border-green-500 bg-green-500/20 text-green-400" :
                "border-slate-700 text-slate-600"
              }`}>
                {i < step ? "✓" : i + 1}
              </div>
              <span className="hidden sm:block">{s}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`h-px flex-1 w-8 sm:w-16 transition-colors ${i < step ? "bg-green-500/40" : "bg-white/10"}`} />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main area */}
        <div className="lg:col-span-2">
          {/* STEP 0: Seat selection */}
          {step === 0 && (
            <div className="glass rounded-2xl p-6 border border-white/7">
              <h2 className="font-display font-semibold text-white text-lg mb-5">
                Choose Your Seats
                {selectedSeats.length > 0 && (
                  <span className="ml-2 text-sm text-orange-400">({selectedSeats.length} selected)</span>
                )}
              </h2>
              <SeatMap trip={trip} selectedSeats={selectedSeats} onSeatToggle={toggleSeat} />
            </div>
          )}

          {/* STEP 1: Passenger details */}
          {step === 1 && (
            <div className="glass rounded-2xl p-6 border border-white/7">
              <h2 className="font-display font-semibold text-white text-lg mb-5">Your Details</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">Full Name *</label>
                  <input
                    className="input-field"
                    placeholder="e.g. Jane Wanjiku"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  {formErrors.name && <p className="text-red-400 text-xs mt-1">{formErrors.name}</p>}
                </div>
                <div>
                  <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">National ID / Passport Number *</label>
                  <input
                    className="input-field"
                    placeholder="e.g. 34567890"
                    value={form.idNumber}
                    onChange={(e) => setForm({ ...form, idNumber: e.target.value })}
                  />
                  {formErrors.idNumber && <p className="text-red-400 text-xs mt-1">{formErrors.idNumber}</p>}
                </div>
                <div>
                  <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">Phone Number *</label>
                  <input
                    className="input-field"
                    placeholder="e.g. 0712 345 678"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                  {formErrors.phone && <p className="text-red-400 text-xs mt-1">{formErrors.phone}</p>}
                </div>
                <div>
                  <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">Email Address (optional)</label>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="e.g. jane@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                  {formErrors.email && <p className="text-red-400 text-xs mt-1">{formErrors.email}</p>}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Confirmation */}
          {step === 2 && (
            <div className="glass rounded-2xl p-6 border border-white/7 space-y-5">
              <h2 className="font-display font-semibold text-white text-lg">Confirm Your Booking</h2>

              <div className="space-y-3">
                <h3 className="text-slate-400 text-xs uppercase tracking-wider">Trip Details</h3>
                {[
                  ["Route", `${trip.from} → ${trip.to}`],
                  ["Date", new Date(trip.departureDate + "T00:00:00").toLocaleDateString("en-KE", { weekday: "long", day: "numeric", month: "long", year: "numeric" })],
                  ["Departure", trip.departureTime],
                  ["Arrival", trip.arrivalTime],
                  ["Bus", `${trip.operator} · ${trip.busNumber}`],
                  ["Selected Seats", selectedSeats.join(", ")],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between text-sm py-2 border-b border-white/5">
                    <span className="text-slate-500">{label}</span>
                    <span className="text-white font-medium text-right max-w-xs">{value}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <h3 className="text-slate-400 text-xs uppercase tracking-wider">Passenger Details</h3>
                {[
                  ["Name", form.name],
                  ["ID / Passport", form.idNumber],
                  ["Phone", form.phone],
                  ...(form.email ? [["Email", form.email]] : []),
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between text-sm py-2 border-b border-white/5">
                    <span className="text-slate-500">{label}</span>
                    <span className="text-white font-medium">{value}</span>
                  </div>
                ))}
              </div>

              <div className="glass-strong rounded-xl p-4 border border-orange-500/20"
                style={{ background: "rgba(249,115,22,0.06)" }}>
                <p className="text-slate-400 text-xs mb-1">Total Amount Due</p>
                <p className="font-display font-bold text-2xl text-gradient">KES {totalPrice.toLocaleString()}</p>
                <p className="text-slate-500 text-xs mt-1">
                  {selectedSeats.length} seat{selectedSeats.length > 1 ? "s" : ""} × KES {trip.price.toLocaleString()} · Pay at the station
                </p>
              </div>

              <div className="glass rounded-xl px-4 py-3 border border-yellow-500/20 text-xs text-yellow-300/70">
                ⚠️ Please arrive at the bus station at least 30 minutes before departure and present your booking reference.
              </div>
            </div>
          )}
        </div>

        {/* Sidebar summary */}
        <div className="space-y-4">
          <div className="glass rounded-2xl p-5 border border-white/7 sticky top-20">
            <h3 className="font-display font-semibold text-white mb-4">Booking Summary</h3>

            <div className="space-y-2 mb-4">
              {selectedSeats.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-4">No seats selected yet</p>
              ) : (
                selectedSeats.map((s) => (
                  <div key={s} className="flex items-center justify-between text-sm">
                    <span className="badge badge-luxury">Seat {s}</span>
                    <span className="text-slate-300">KES {trip.price.toLocaleString()}</span>
                  </div>
                ))
              )}
            </div>

            {selectedSeats.length > 0 && (
              <>
                <div className="border-t border-white/7 pt-3 flex justify-between font-display font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-gradient">KES {totalPrice.toLocaleString()}</span>
                </div>
                <p className="text-slate-600 text-xs mt-1 text-right">Pay at station</p>
              </>
            )}

            {/* Navigation buttons */}
            <div className="mt-5 space-y-2">
              {step === 0 && (
                <button
                  className="btn-primary w-full py-2.5 rounded-xl text-sm"
                  disabled={selectedSeats.length === 0}
                  onClick={() => setStep(1)}
                >
                  Continue to Details →
                </button>
              )}
              {step === 1 && (
                <>
                  <button
                    className="btn-primary w-full py-2.5 rounded-xl text-sm"
                    onClick={() => { if (validateForm()) setStep(2); }}
                  >
                    Review Booking →
                  </button>
                  <button className="btn-ghost w-full py-2.5 rounded-xl text-sm" onClick={() => setStep(0)}>
                    ← Back
                  </button>
                </>
              )}
              {step === 2 && (
                <>
                  <button
                    className="btn-primary w-full py-2.5 rounded-xl text-sm"
                    disabled={submitting}
                    onClick={handleBooking}
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        Confirming…
                      </span>
                    ) : "Confirm Booking ✓"}
                  </button>
                  <button className="btn-ghost w-full py-2.5 rounded-xl text-sm" onClick={() => setStep(1)}>
                    ← Edit Details
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
