import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import type { Review } from "@/data/mockReviews";
import { addReviewLocal, listReviews, markReviewHelpful, subscribeLocalDb } from "@/lib/localDb";

interface ReviewsContextType {
  reviews: Review[];
  getPropertyReviews: (propertyId: string) => Review[];
  addReview: (review: Omit<Review, "id" | "date" | "helpful">) => Promise<void>;
  getAverageRating: (propertyId: string) => number;
  markHelpful: (reviewId: string) => Promise<void>;
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export const ReviewsProvider = ({ children }: { children: ReactNode }) => {
  const [reviews, setReviews] = useState<Review[]>([]);

  const fetchReviews = useCallback(async () => {
    try {
      setReviews(listReviews());
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
    const unsub = subscribeLocalDb(fetchReviews);
    return unsub;
  }, [fetchReviews]);

  const getPropertyReviews = (propertyId: string) => {
    return reviews.filter((review) => review.propertyId === propertyId);
  };

  const addReview = async (review: Omit<Review, "id" | "date" | "helpful">) => {
    try {
      // Input validation
      if (!review.propertyId || !review.propertyId.trim()) {
        throw new Error('Property ID is required');
      }
      if (!review.userName || !review.userName.trim()) {
        throw new Error('User name is required');
      }
      if (!review.rating || review.rating < 1 || review.rating > 5) {
        throw new Error('Rating must be between 1 and 5');
      }

      const newReview = addReviewLocal({
        ...review,
        userName: review.userName.trim(),
        comment: review.comment?.trim() || "",
      });
      setReviews((prev) => [newReview, ...prev]);
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  };

  const getAverageRating = (propertyId: string) => {
    const propertyReviews = getPropertyReviews(propertyId);
    if (propertyReviews.length === 0) return 0;
    const sum = propertyReviews.reduce((acc, review) => acc + review.rating, 0);
    return Number((sum / propertyReviews.length).toFixed(1));
  };

  const markHelpful = async (reviewId: string) => {
    try {
      const review = reviews.find(r => r.id === reviewId);
      if (!review) {
        throw new Error('Review not found');
      }
      markReviewHelpful(reviewId);
      setReviews((prev) =>
        prev.map((review) =>
          review.id === reviewId ? { ...review, helpful: review.helpful + 1 } : review
        )
      );
    } catch (error) {
      console.error('Error marking review as helpful:', error);
      throw error;
    }
  };

  return (
    <ReviewsContext.Provider
      value={{ reviews, getPropertyReviews, addReview, getAverageRating, markHelpful }}
    >
      {children}
    </ReviewsContext.Provider>
  );
};

export const useReviews = () => {
  const context = useContext(ReviewsContext);
  if (!context) {
    throw new Error("useReviews must be used within ReviewsProvider");
  }
  return context;
};
