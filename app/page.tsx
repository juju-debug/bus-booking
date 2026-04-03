import Link from "next/link";

const stats = [
  { value: "50+", label: "Daily Trips" },
  { value: "8", label: "Destinations" },
  { value: "4", label: "Bus Operators" },
  { value: "100%", label: "Seat Visibility" },
];

const features = [
  {
    icon: "🗺️",
    title: "Visual Seat Map",
    desc: "See exactly which seats are available in real time with our interactive bus layout.",
  },
  {
    icon: "⚡",
    title: "Instant Booking",
    desc: "Reserve your seat in under 60 seconds. No account needed, no hassle.",
  },
  {
    icon: "🔁",
    title: "Modify or Cancel",
    desc: "Plans changed? Easily modify your seats or cancel your booking anytime.",
  },
  {
    icon: "🔍",
    title: "Find Your Booking",
    desc: "Retrieve any booking instantly with your reference number and ID.",
  },
  {
    icon: "💺",
    title: "Choose Your Seat",
    desc: "Window, aisle, front, or back — pick exactly where you want to sit.",
  },
  {
    icon: "🔔",
    title: "Live Availability",
    desc: "Seat counts and occupancy update in real time as others book.",
  },
];

const routes = [
  { from: "Nairobi", to: "Mombasa", duration: "6h 30m", from_price: 950 },
  { from: "Nairobi", to: "Kisumu", duration: "6h 30m", from_price: 1100 },
  { from: "Nairobi", to: "Nakuru", duration: "2h 30m", from_price: 600 },
  { from: "Nairobi", to: "Eldoret", duration: "5h 00m", from_price: 900 },
];

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center text-center px-4 py-20">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full"
            style={{ background: "radial-gradient(ellipse, rgba(249,115,22,0.12) 0%, transparent 70%)" }} />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full"
            style={{ background: "radial-gradient(ellipse, rgba(249,115,22,0.05) 0%, transparent 70%)" }} />
          {/* Decorative dots */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-orange-500/20"
              style={{
                left: `${(i * 37) % 100}%`,
                top: `${(i * 53) % 100}%`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-4xl mx-auto animate-slide-up">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-xs text-orange-400 mb-8 border border-orange-500/20">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-slow"></span>
            Live seat availability · No account required
          </div>

          <h1 className="font-display font-800 text-5xl sm:text-6xl md:text-7xl text-white leading-[1.05] mb-6">
            Book your bus seat<br />
            <span className="text-gradient">with confidence.</span>
          </h1>

          <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            SwiftRide gives you a real-time visual seat map, instant booking, and complete control
            over your reservation — all without signing up.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/trips" className="btn-primary px-8 py-3.5 rounded-2xl text-base w-full sm:w-auto">
              Find Available Trips →
            </Link>
            <Link href="/my-booking" className="btn-ghost px-8 py-3.5 rounded-2xl text-base w-full sm:w-auto">
              Retrieve My Booking
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-4 mb-24">
        <div className="glass rounded-3xl p-8 border border-white/7 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display font-bold text-4xl text-gradient mb-1">{s.value}</p>
              <p className="text-slate-500 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Routes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-28">
        <div className="mb-10">
          <p className="text-orange-500 text-sm font-semibold uppercase tracking-widest mb-2">Popular Routes</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">Where do you want to go?</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {routes.map((r) => (
            <Link
              key={`${r.from}-${r.to}`}
              href={`/trips?from=${r.from}&to=${r.to}`}
              className="glass rounded-2xl p-5 border border-white/7 card-hover group"
            >
              <div className="mb-4">
                <p className="text-white font-display font-bold text-lg group-hover:text-orange-400 transition-colors">
                  {r.from}
                </p>
                <div className="flex items-center gap-1 my-1">
                  <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-orange-500/30" />
                  <span className="text-orange-500 text-xs">→</span>
                </div>
                <p className="text-white font-display font-bold text-lg">{r.to}</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-xs">⏱ {r.duration}</span>
                <span className="text-orange-400 font-semibold text-sm">
                  From KES {r.from_price.toLocaleString()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-28">
        <div className="mb-10">
          <p className="text-orange-500 text-sm font-semibold uppercase tracking-widest mb-2">Why SwiftRide</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">Built for travellers, not tech experts.</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.title} className="glass rounded-2xl p-6 border border-white/7 card-hover">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-display font-semibold text-white text-lg mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-28">
        <div className="glass rounded-3xl p-10 border border-white/7 text-center"
          style={{ background: "linear-gradient(135deg, rgba(249,115,22,0.06), rgba(255,255,255,0.03))" }}>
          <p className="text-orange-500 text-sm font-semibold uppercase tracking-widest mb-3">How It Works</p>
          <h2 className="font-display font-bold text-3xl text-white mb-10">3 simple steps to your seat</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Find Your Trip", desc: "Search by origin, destination, date, and bus type to find the best option." },
              { step: "02", title: "Pick Your Seat", desc: "View the live seat map and tap any available seat to select it." },
              { step: "03", title: "Confirm & Go", desc: "Fill in your details and receive a booking reference. Pay at the station." },
            ].map((s) => (
              <div key={s.step} className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-700/10 border border-orange-500/20 flex items-center justify-center mb-4">
                  <span className="font-display font-bold text-orange-400 text-lg">{s.step}</span>
                </div>
                <h3 className="font-display font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-slate-400 text-sm text-center leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link href="/trips" className="btn-primary inline-block px-8 py-3.5 rounded-2xl text-base">
              Start Booking Now →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
