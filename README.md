# SwiftRide — Bus Seat Booking System

A modern, full-featured bus seat booking web application built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**. Data is persisted in a local **JSON file** — no database required.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18 or higher
- npm v9 or higher

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗂 Project Structure

```
bus-booking/
├── app/
│   ├── api/
│   │   ├── trips/           # GET all trips (with filters), GET single trip
│   │   └── bookings/        # POST create, GET all, GET/PATCH/DELETE by ref
│   ├── trips/               # Trip listing + search page
│   │   └── [id]/            # Individual trip detail + seat booking page
│   ├── my-booking/          # Retrieve, modify, cancel booking page
│   ├── layout.tsx           # Root layout with Navbar & Footer
│   ├── page.tsx             # Homepage / landing page
│   └── globals.css          # Global styles & design tokens
├── components/
│   ├── Navbar.tsx           # Sticky top navigation
│   ├── Footer.tsx           # Site footer
│   ├── SeatMap.tsx          # Interactive visual seat layout component
│   ├── TripCard.tsx         # Trip summary card for listings
│   └── ToastProvider.tsx    # Global toast notification system
├── data/
│   └── db.json              # All trips and bookings stored here
├── lib/
│   ├── types.ts             # TypeScript interfaces
│   ├── db.ts                # JSON read/write utilities
│   └── utils.ts             # Helpers (ref generator, formatting)
└── README.md
```

---

## ✨ Features

### Core Booking Features
- **Search Trips** — filter by origin, destination, date, and bus type
- **Visual Seat Map** — real-time interactive 44-seat bus layout with aisle
- **Multi-Seat Selection** — select multiple seats in one booking
- **3-Step Booking Flow** — Seats → Details → Confirm
- **Booking Reference** — auto-generated unique reference code (e.g. `BK-A3F7XKQP`)
- **Retrieve Booking** — look up any booking by reference number
- **Modify Seats** — change selected seats on an existing booking
- **Cancel Booking** — instantly cancels and releases seats

### Rich UX Features
- **Occupancy Bar** — visual fill bar per seat map and per trip card
- **Almost Full Warning** — alerts when a trip has ≤ 8 seats remaining
- **Sort Trips** — sort results by time, price, or available seats
- **Amenity Icons** — AC, WiFi, USB, Reclining Seats, Snacks displayed visually
- **Form Validation** — phone number, required fields, email format
- **Toast Notifications** — success, error, and info messages
- **Mobile Responsive** — fully responsive across all screen sizes
- **Sticky Booking Summary** — sidebar updates as you select seats

### Design
- **Dark theme** with orange accent (`#f97316`)
- Custom fonts: **Syne** (display) + **DM Sans** (body) + **JetBrains Mono** (codes)
- Glass-morphism cards with subtle borders
- Smooth animations and hover micro-interactions

---

## 📡 API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/trips` | List all trips (supports `?from=&to=&date=&busType=`) |
| GET | `/api/trips/:id` | Get single trip details |
| POST | `/api/bookings` | Create a new booking |
| GET | `/api/bookings/:ref` | Get booking by reference code |
| PATCH | `/api/bookings/:ref` | Modify seats on an existing booking |
| DELETE | `/api/bookings/:ref` | Cancel a booking |

---

## 💾 Data Storage

All data lives in `data/db.json`:
- **trips** — pre-seeded with 8 trips across 5 Kenyan routes
- **bookings** — populated as users book (starts empty)

No database setup needed.

---

## 📦 Submission

1. Delete the `node_modules` folder
2. Zip the entire `bus-booking` folder
3. Upload to Blackboard

---

## 🛠 Built With

- [Next.js 14](https://nextjs.org/) — React framework with App Router
- [TypeScript](https://www.typescriptlang.org/) — Type safety
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first styling
- [Lucide React](https://lucide.dev/) — Icon library
- [UUID](https://github.com/uuidjs/uuid) — Unique booking IDs

---

*Payment is assumed to be made at the bus station before boarding. No financial transactions are processed by this system.*
