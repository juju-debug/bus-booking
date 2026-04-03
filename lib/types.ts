export interface BusLayout {
  rows: number;
  seatsPerRow: number;
  aisleAfter: number;
}

export interface Trip {
  id: string;
  busNumber: string;
  operator: string;
  from: string;
  to: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  busType: "Luxury" | "Standard";
  amenities: string[];
  totalSeats: number;
  layout: BusLayout;
  bookedSeats: string[];
}

export interface Passenger {
  name: string;
  idNumber: string;
  phone: string;
  email: string;
}

export interface Booking {
  id: string;
  bookingRef: string;
  tripId: string;
  passenger: Passenger;
  seats: string[];
  status: "confirmed" | "cancelled";
  createdAt: string;
  totalAmount: number;
}

export interface DB {
  trips: Trip[];
  bookings: Booking[];
}

export type SeatStatus = "available" | "booked" | "selected" | "your-booking";
