"use client";
import { Trip } from "@/lib/types";

interface SeatMapProps {
  trip: Trip;
  selectedSeats: string[];
  onSeatToggle: (seat: string) => void;
  highlightSeats?: string[];
  readOnly?: boolean;
}

const COLS = ["A", "B", "C", "D"];

export default function SeatMap({
  trip,
  selectedSeats,
  onSeatToggle,
  highlightSeats = [],
  readOnly = false,
}: SeatMapProps) {
  const { rows, aisleAfter } = trip.layout;

  function getSeatStatus(seat: string): "available" | "booked" | "selected" | "your-booking" {
    if (highlightSeats.includes(seat)) return "your-booking";
    if (trip.bookedSeats.includes(seat)) return "booked";
    if (selectedSeats.includes(seat)) return "selected";
    return "available";
  }

  const styleMap = {
    available: "seat-available cursor-pointer",
    booked: "seat-booked",
    selected: "seat-selected",
    "your-booking": "seat-your-booking cursor-default",
  };

  const totalSeats = trip.totalSeats;
  const bookedCount = trip.bookedSeats.length;
  const availableCount = totalSeats - bookedCount;
  const occupancy = Math.round((bookedCount / totalSeats) * 100);

  return (
    <div className="space-y-5">
      {/* Occupancy bar */}
      <div>
        <div className="flex justify-between text-xs text-slate-500 mb-1.5">
          <span>{availableCount} seats available</span>
          <span>{occupancy}% occupied</span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${occupancy}%`,
              background: occupancy > 80 ? "#ef4444" : occupancy > 50 ? "#f97316" : "#22c55e",
            }}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs">
        {[
          { cls: "seat-available", label: "Available" },
          { cls: "seat-selected", label: "Selected" },
          { cls: "seat-booked", label: "Occupied" },
          ...(highlightSeats.length ? [{ cls: "seat-your-booking", label: "Your Seat" }] : []),
        ].map(({ cls, label }) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`w-6 h-5 rounded-md ${cls} flex items-center justify-center text-[9px] font-bold`}>●</div>
            <span className="text-slate-400">{label}</span>
          </div>
        ))}
      </div>

      {/* Bus shell */}
      <div className="relative">
        <div className="glass rounded-3xl p-6 border border-white/8">
          {/* Bus front */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500/20 to-orange-700/20 border border-orange-500/30 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#f97316">
                  <path d="M12 2C7 2 4 5 4 8v12h16V8c0-3-3-6-8-6zm0 2c4 0 6 2.2 6 4H6c0-1.8 2-4 6-4z"/>
                </svg>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Driver</p>
                <p className="text-xs text-slate-400 font-mono-custom">{trip.busNumber}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Front</p>
              <div className="flex gap-1 mt-1">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-6 h-3 rounded-sm bg-white/5 border border-white/10" />
                ))}
              </div>
            </div>
          </div>

          {/* Column headers */}
          <div className="grid grid-cols-5 gap-2 mb-3 px-1">
            <div className="text-center" />
            {COLS.map((col, i) => (
              <div key={col}>
                {i === aisleAfter && <div className="mb-1" />}
                <div className="text-center text-[10px] font-mono-custom text-slate-500 uppercase">{col}</div>
              </div>
            ))}
          </div>

          {/* Seats */}
          <div className="space-y-2">
            {Array.from({ length: rows }, (_, rowIdx) => {
              const rowNum = rowIdx + 1;
              return (
                <div key={rowNum} className="grid grid-cols-5 gap-2 items-center">
                  {/* Row number */}
                  <div className="text-center text-[10px] font-mono-custom text-slate-600">{rowNum}</div>

                  {/* Seats A, B | aisle | C, D */}
                  {COLS.map((col, colIdx) => {
                    const seatId = `${rowNum}${col}`;
                    const status = getSeatStatus(seatId);
                    const isAisle = colIdx === aisleAfter;

                    return (
                      <div key={col} className={isAisle ? "relative" : ""}>
                        {isAisle && (
                          <div className="absolute -left-1 top-0 bottom-0 w-px bg-white/5" />
                        )}
                        <button
                          onClick={() => {
                            if (!readOnly && status !== "booked" && status !== "your-booking") {
                              onSeatToggle(seatId);
                            }
                          }}
                          disabled={readOnly || status === "booked" || status === "your-booking"}
                          title={
                            status === "booked"
                              ? `Seat ${seatId} — Occupied`
                              : status === "your-booking"
                              ? `Seat ${seatId} — Your seat`
                              : `Seat ${seatId} — Click to ${status === "selected" ? "deselect" : "select"}`
                          }
                          className={`w-full aspect-square rounded-lg text-[11px] font-bold font-mono-custom transition-all duration-150 ${styleMap[status]}`}
                        >
                          {status === "booked" ? "✕" : status === "selected" ? "✓" : status === "your-booking" ? "★" : seatId}
                        </button>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Bus rear */}
          <div className="mt-6 pt-4 border-t border-white/8">
            <div className="flex justify-center gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-8 h-3 rounded-sm bg-white/5 border border-white/10" />
              ))}
            </div>
            <p className="text-center text-[10px] text-slate-600 mt-2 uppercase tracking-widest">Rear Exit</p>
          </div>
        </div>
      </div>

      {/* Selected summary */}
      {selectedSeats.length > 0 && (
        <div className="flex items-center justify-between glass rounded-xl px-4 py-3 border border-orange-500/20">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-slate-400">Selected:</span>
            {selectedSeats.map((s) => (
              <span key={s} className="badge badge-luxury">{s}</span>
            ))}
          </div>
          <span className="text-orange-400 font-display font-semibold text-sm">
            KES {(trip.price * selectedSeats.length).toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
}
