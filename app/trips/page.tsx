"use client";
import { useEffect, useState, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import TripCard from "@/components/TripCard";
import { Trip } from "@/lib/types";

const CITIES = [
  "",
  "Nairobi",
  "Nairobi (CBD)",
  "Nairobi (Westlands)",
  "Nairobi (Embakasi)",
  "Nairobi (Eastleigh)",
  "Nairobi (Kasarani)",
  "Nairobi (Karen)",
  "Mombasa",
  "Kisumu",
  "Nakuru",
  "Eldoret",
  "Kisii",
  "Thika",
  "Machakos",
  "Naivasha",
  "Nyeri",
  "Meru",
  "Embu",
  "Nanyuki",
  "Kericho",
  "Kitale",
  "Kakamega",
  "Bungoma",
  "Narok",
  "Voi",
  "Malindi",
  "Garissa",
];

function TripsContent() {
  const searchParams = useSearchParams();

  const [trips, setTrips] = useState<(Trip & { availableSeats: number })[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const [from, setFrom] = useState(searchParams.get("from") || "");
  const [to, setTo] = useState(searchParams.get("to") || "");
  const [sortBy, setSortBy] = useState("time");

  const fetchTrips = useCallback(async (sortOverride?: string) => {
    setLoading(true);
    setSearched(true);
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);

    try {
      const res = await fetch(`/api/trips?${params}`);
      let data = await res.json();

      const sort = sortOverride ?? sortBy;
      if (sort === "price") data = data.sort((a: Trip, b: Trip) => a.price - b.price);
      else if (sort === "time") data = data.sort((a: Trip, b: Trip) => a.departureTime.localeCompare(b.departureTime));
      else if (sort === "seats") data = data.sort((a: any, b: any) => b.availableSeats - a.availableSeats);

      setTrips(data);
    } catch {
      setTrips([]);
    } finally {
      setLoading(false);
    }
  }, [from, sortBy, to]);

  // Show trips by default (and still supports query params)
  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    fetchTrips();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-white mb-2">Find Your Trip</h1>
        <p className="text-slate-400">Search across all available routes and book your seat instantly.</p>
      </div>

      {/* Search form */}
      <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 border border-white/7 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1.5 uppercase tracking-wider">From</label>
            <select className="input-field" value={from} onChange={(e) => setFrom(e.target.value)}>
              {CITIES.map((c) => <option key={c} value={c}>{c || "Any city"}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1.5 uppercase tracking-wider">To</label>
            <select className="input-field" value={to} onChange={(e) => setTo(e.target.value)}>
              {CITIES.map((c) => <option key={c} value={c}>{c || "Any city"}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <button type="submit" className="btn-primary w-full py-2.5 rounded-xl text-sm">
              {loading ? "Searching…" : "Search Trips →"}
            </button>
          </div>
        </div>
      </form>

      {/* Results */}
      {searched && (
        <div>
          {/* Sort + count */}
          {!loading && trips.length > 0 && (
            <div className="flex items-center justify-between mb-5">
              <p className="text-slate-400 text-sm">
                <span className="text-white font-semibold">{trips.length}</span> trip{trips.length !== 1 ? "s" : ""} found
              </p>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-xs">Sort by:</span>
                {["time", "price", "seats"].map((s) => (
                  <button
                    key={s}
                    onClick={() => { setSortBy(s); fetchTrips(s); }}
                    className={`text-xs px-3 py-1 rounded-lg transition-colors capitalize ${sortBy === s ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" : "btn-ghost"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="glass rounded-2xl p-5 border border-white/7 animate-pulse">
                  <div className="h-5 bg-white/5 rounded mb-3 w-3/4" />
                  <div className="h-4 bg-white/5 rounded mb-2 w-1/2" />
                  <div className="h-16 bg-white/5 rounded mb-3" />
                  <div className="h-10 bg-white/5 rounded" />
                </div>
              ))}
            </div>
          ) : trips.length === 0 ? (
            <div className="text-center py-20 glass rounded-2xl border border-white/7">
              <div className="text-5xl mb-4">🚌</div>
              <h3 className="font-display font-bold text-white text-xl mb-2">No trips found</h3>
              <p className="text-slate-400 text-sm">Try adjusting your search — a different date or route might have availability.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {trips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          )}
        </div>
      )}

      {!searched && (
        <div className="text-center py-20">
          <div className="text-6xl mb-5">🗺️</div>
          <h3 className="font-display font-bold text-white text-xl mb-2">Search for your trip above</h3>
          <p className="text-slate-400 text-sm">Select a route, pick a date, and find your perfect bus.</p>
        </div>
      )}
    </div>
  );
}

export default function TripsPage() {
  return (
    <Suspense fallback={<div className="p-10 text-slate-400">Loading...</div>}>
      <TripsContent />
    </Suspense>
  );
}
