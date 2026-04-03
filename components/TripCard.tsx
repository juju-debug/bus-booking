import Link from "next/link";
import { Trip } from "@/lib/types";

interface TripCardProps {
  trip: Trip & { availableSeats: number };
}

const amenityIcons: Record<string, string> = {
  "AC": "❄️",
  "WiFi": "📶",
  "USB Charging": "🔌",
  "Reclining Seats": "💺",
  "Onboard Snacks": "🍪",
};

export default function TripCard({ trip }: TripCardProps) {
  const occupancy = Math.round(((trip.totalSeats - trip.availableSeats) / trip.totalSeats) * 100);
  const almostFull = trip.availableSeats <= 8;

  return (
    <div className="glass rounded-2xl p-5 border border-white/7 card-hover">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`badge ${trip.busType === "Luxury" ? "badge-luxury" : "badge-standard"}`}>
              {trip.busType === "Luxury" ? "⭐" : "🚌"} {trip.busType}
            </span>
            {almostFull && (
              <span className="badge" style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171" }}>
                🔥 Almost Full
              </span>
            )}
          </div>
          <h3 className="font-display font-bold text-white text-lg">
            {trip.from} <span className="text-orange-500">→</span> {trip.to}
          </h3>
          <p className="text-slate-500 text-xs mt-0.5">{trip.operator} · {trip.busNumber}</p>
        </div>
        <div className="text-right">
          <p className="font-display font-bold text-2xl text-gradient">KES {trip.price.toLocaleString()}</p>
          <p className="text-slate-500 text-xs">per seat</p>
        </div>
      </div>

      {/* Times */}
      <div className="flex items-center gap-3 mb-4">
        <div className="text-center">
          <p className="font-display font-bold text-white text-xl">{trip.departureTime}</p>
          <p className="text-slate-500 text-xs">{trip.from}</p>
        </div>
        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full flex items-center gap-1">
            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-orange-500/30"></div>
            <div className="text-orange-500 text-xs">🚌</div>
            <div className="h-px flex-1 bg-gradient-to-r from-orange-500/30 to-white/10"></div>
          </div>
          <p className="text-slate-500 text-[11px]">{trip.duration}</p>
        </div>
        <div className="text-center">
          <p className="font-display font-bold text-white text-xl">{trip.arrivalTime}</p>
          <p className="text-slate-500 text-xs">{trip.to}</p>
        </div>
      </div>

      {/* Date & seats */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-400 text-xs">
          <span>📅</span>
          <span>{new Date(trip.departureDate + "T00:00:00").toLocaleDateString("en-KE", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${occupancy}%`,
                background: occupancy > 80 ? "#ef4444" : occupancy > 50 ? "#f97316" : "#22c55e",
              }}
            />
          </div>
          <span className={almostFull ? "text-red-400" : "text-slate-400"}>
            {trip.availableSeats} left
          </span>
        </div>
      </div>

      {/* Amenities */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {trip.amenities.map((a) => (
          <span key={a} className="text-[11px] text-slate-400 glass px-2 py-0.5 rounded-full flex items-center gap-1">
            {amenityIcons[a] ?? "•"} {a}
          </span>
        ))}
      </div>

      {/* CTA */}
      <Link
        href={`/trips/${trip.id}`}
        className="btn-primary w-full py-2.5 rounded-xl text-sm text-center block"
      >
        Select Seats →
      </Link>
    </div>
  );
}
