import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M4 16c0 1.1.9 2 2 2h1v1c0 .6.4 1 1 1s1-.4 1-1v-1h6v1c0 .6.4 1 1 1s1-.4 1-1v-1h1c1.1 0 2-.9 2-2V8c0-3-3-5-8-5S4 5 4 8v8zm3.5 0c-.8 0-1.5-.7-1.5-1.5S6.7 13 7.5 13s1.5.7 1.5 1.5S8.3 16 7.5 16zm9 0c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5zM6 9V8c0-1.7 2.7-3 6-3s6 1.3 6 3v1H6z"/>
                </svg>
              </div>
              <span className="font-display font-bold text-lg text-white">Swift<span className="text-gradient">Ride</span></span>
            </div>
            <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
              Kenya&apos;s most reliable bus seat booking platform. Travel with confidence, comfort, and clarity.
            </p>
            <p className="text-slate-600 text-xs mt-4">
              Payment is made at the bus station before boarding. No online payment required.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-semibold text-white text-sm mb-4">Navigation</h4>
            <ul className="space-y-2.5">
              {[["Home", "/"], ["Find Trips", "/trips"], ["My Booking", "/my-booking"]].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-slate-500 hover:text-orange-400 text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Routes */}
          <div>
            <h4 className="font-display font-semibold text-white text-sm mb-4">Popular Routes</h4>
            <ul className="space-y-2.5">
              {["Nairobi → Mombasa", "Nairobi → Kisumu", "Nairobi → Nakuru", "Nairobi → Eldoret", "Mombasa → Nairobi"].map((r) => (
                <li key={r} className="text-slate-500 text-sm">{r}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-xs">© {new Date().getFullYear()} SwiftRide. All rights reserved.</p>
          <p className="text-slate-600 text-xs">Built with Next.js · Data stored in JSON</p>
        </div>
      </div>
    </footer>
  );
}
