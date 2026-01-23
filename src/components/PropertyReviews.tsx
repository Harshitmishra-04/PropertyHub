import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, ThumbsUp } from "lucide-react";
import { useReviews } from "@/contexts/ReviewsContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface PropertyReviewsProps {
  propertyId: string;
}

const PropertyReviews = ({ propertyId }: PropertyReviewsProps) => {
  const { getPropertyReviews, addReview, getAverageRating, markHelpful } = useReviews();
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
    setIsDialogOpen(false);
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
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Write a Review</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Write Your Review</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">Your Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-8 w-8 ${
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
                  <label className="mb-2 block text-sm font-medium">Your Review</label>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience with this property..."
                    rows={5}
                  />
                </div>
                <Button onClick={handleSubmitReview} className="w-full">
                  Submit Review
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {propertyReviews.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">
            No reviews yet. Be the first to review!
          </p>
        ) : (
          <div className="space-y-6">
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
      </CardContent>
    </Card>
  );
};

export default PropertyReviews;
