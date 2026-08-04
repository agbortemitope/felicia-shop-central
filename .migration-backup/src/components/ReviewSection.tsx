import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Star, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fetchReviews, submitReview } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface ReviewSectionProps {
  productId: string;
}

const Stars = ({ value }: { value: number }) => (
  <div className="flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i <= value ? "fill-primary text-primary" : "text-muted-foreground"}`}
      />
    ))}
  </div>
);

export const ReviewSection = ({ productId }: ReviewSectionProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => fetchReviews(productId),
  });

  const mutation = useMutation({
    mutationFn: submitReview,
    onSuccess: () => {
      setName("");
      setComment("");
      setRating(5);
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      toast({ title: "Review published", description: "Thanks for sharing your experience." });
    },
    onError: () => {
      toast({ title: "Could not save review", description: "Please try again." });
    },
  });

  const average =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({ title: "Name required", description: "Please add your name." });
      return;
    }
    mutation.mutate({ product_id: productId, author_name: name, rating, comment });
  };

  return (
    <section className="mt-16" data-lovable-id="reviews-section">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">Customer Reviews</h2>
        {reviews && reviews.length > 0 && (
          <div className="flex items-center gap-3">
            <Stars value={Math.round(average)} />
            <span className="text-sm text-muted-foreground">
              {average.toFixed(1)} · {reviews.length} review{reviews.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : !reviews || reviews.length === 0 ? (
            <Card className="p-8 text-center">
              <Stars value={0} />
              <p className="mt-4 font-medium">No reviews yet</p>
              <p className="text-sm text-muted-foreground">
                Be the first customer to review this product.
              </p>
            </Card>
          ) : (
            reviews.map((review) => (
              <Card key={review.id} className="p-5 space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-semibold">{review.author_name}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                <Stars value={review.rating} />
                {review.comment && (
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                )}
              </Card>
            ))
          )}
        </div>

        <Card className="p-6 h-fit">
          <h3 className="font-semibold mb-4">Write a review</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="review-name">Your name</Label>
              <Input
                id="review-name"
                value={name}
                maxLength={60}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane D."
              />
            </div>
            <div>
              <Label>Rating</Label>
              <div className="flex items-center gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRating(i)}
                    aria-label={`Rate ${i} stars`}
                  >
                    <Star
                      className={`w-6 h-6 transition-colors ${
                        i <= rating ? "fill-primary text-primary" : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="review-comment">Comment</Label>
              <Textarea
                id="review-comment"
                value={comment}
                maxLength={1000}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you think of this product?"
                rows={4}
              />
            </div>
            <Button type="submit" className="w-full" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Publish review"
              )}
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
};
