import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, ThumbsUp } from "lucide-react";
import { useReviews } from "@/contexts/ReviewsContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface PropertyReviewsProps {
  propertyId: string;
}

const PropertyReviews = ({ propertyId }: PropertyReviewsProps) => {
  const { getPropertyReviews, addReview, getAverageRating, markHelpful } = useReviews();
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const propertyReviews = getPropertyReviews(propertyId);
  const averageRating = getAverageRating(propertyId);

  const handleSubmitReview = () => {
    if (!user) {
      toast.error("Please login to submit a review");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    addReview({
      propertyId,
      userId: user.id,
      userName: user.name,
      rating,
      comment,
    });

    toast.success("Review submitted successfully!");
    setComment("");
    setRating(5);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Reviews & Ratings</CardTitle>
            {propertyReviews.length > 0 && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= averageRating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold">{averageRating}</span>
                <span className="text-sm text-muted-foreground">
                  ({propertyReviews.length} reviews)
                </span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {propertyReviews.length === 0 ? (
          <p className="pb-6 text-sm text-muted-foreground">
            No reviews yet. Be the first to review this property.
          </p>
        ) : (
          <div className="space-y-6 pb-6">
            {propertyReviews.map((review) => (
              <div key={review.id} className="border-b pb-6 last:border-0">
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{review.userName}</p>
                    <p className="text-sm text-muted-foreground">{review.date}</p>
                  </div>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="mb-3 text-sm">{review.comment}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => markHelpful(review.id)}
                  className="gap-2"
                >
                  <ThumbsUp className="h-4 w-4" />
                  Helpful ({review.helpful})
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 border-t pt-4 space-y-4">
          <p className="text-sm font-medium">
            {user ? "Write a review" : "Login to write a review"}
          </p>
          <div>
            <p className="mb-2 text-sm text-muted-foreground">Your Rating</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                  disabled={!user}
                >
                  <Star
                    className={`h-7 w-7 ${
                      star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm text-muted-foreground">Your Review</p>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this property..."
              rows={4}
              disabled={!user}
            />
          </div>
          <Button onClick={handleSubmitReview} className="w-full md:w-auto" disabled={!user}>
            Submit Review
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyReviews;
