export interface Review {
  id: string;
  propertyId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

export const mockReviews: Review[] = [
  {
    id: "r1",
    propertyId: "1",
    userId: "u1",
    userName: "Raj Kumar",
    rating: 5,
    comment: "Excellent property with great amenities. The location is perfect and the society is well-maintained. Highly recommended!",
    date: "2024-10-15",
    helpful: 12,
  },
  {
    id: "r2",
    propertyId: "1",
    userId: "u2",
    userName: "Priya Sharma",
    rating: 4,
    comment: "Good property overall. The parking could be better but everything else is great.",
    date: "2024-10-10",
    helpful: 8,
  },
  {
    id: "r3",
    propertyId: "2",
    userId: "u3",
    userName: "Amit Patel",
    rating: 5,
    comment: "Perfect for IT professionals! Very close to office and has all necessary facilities.",
    date: "2024-10-12",
    helpful: 15,
  },
  {
    id: "r4",
    propertyId: "3",
    userId: "u4",
    userName: "Sneha Reddy",
    rating: 5,
    comment: "Dream home for our family! Spacious, beautiful garden, and safe neighborhood.",
    date: "2024-10-08",
    helpful: 20,
  },
  {
    id: "r5",
    propertyId: "4",
    userId: "u5",
    userName: "Vikram Singh",
    rating: 4,
    comment: "Great views and location. Slightly expensive but worth it.",
    date: "2024-10-05",
    helpful: 6,
  },
];
