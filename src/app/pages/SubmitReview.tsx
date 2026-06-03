import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router';
import { Star, Send, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { SuccessModal } from '../components/SuccessModal';
import { toast } from 'sonner';

export default function SubmitReview() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const projectId = searchParams.get('projectId') || '';
  const projectTitle = searchParams.get('projectTitle') || 'Recent Project';
  const companyId = searchParams.get('companyId') || '';
  const companyName = searchParams.get('companyName') || 'Company';
  const freelancerId = searchParams.get('freelancerId') || '';
  const freelancerName = searchParams.get('freelancerName') || 'Freelancer';

  const [projectRating, setProjectRating] = useState(0);
  const [projectComment, setProjectComment] = useState('');

  const [companyRating, setCompanyRating] = useState(0);
  const [companyComment, setCompanyComment] = useState('');

  const [freelancerRating, setFreelancerRating] = useState(0);
  const [freelancerComment, setFreelancerComment] = useState('');

  const [platformRating, setPlatformRating] = useState(0);
  const [platformComment, setPlatformComment] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  if (!user) {
    navigate('/auth/login');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const reviews = [];

    if (user.role === 'freelancer' && projectId) {
      if (projectRating > 0) {
        reviews.push({
          type: 'project',
          rating: projectRating,
          comment: projectComment,
        });
      }
      if (companyRating > 0) {
        reviews.push({
          type: 'company',
          rating: companyRating,
          comment: companyComment,
        });
      }
    }

    if (user.role === 'customer' && freelancerId) {
      if (freelancerRating > 0) {
        reviews.push({
          type: 'freelancer',
          rating: freelancerRating,
          comment: freelancerComment,
        });
      }
    }

    if (platformRating > 0) {
      reviews.push({
        type: 'platform',
        rating: platformRating,
        comment: platformComment,
      });
    }

    if (reviews.length === 0) {
      toast.error('Please provide at least one rating');
      return;
    }

    setShowSuccessModal(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit Review</h1>
        <p className="text-gray-600">Share your experience to help improve our platform</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {user.role === 'freelancer' && projectId && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Project Review</CardTitle>
                <CardDescription>
                  How was your experience with "{projectTitle}"?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Rating</Label>
                  <StarRating rating={projectRating} onRatingChange={setProjectRating} />
                </div>
                <div>
                  <Label htmlFor="projectComment">Comments (optional)</Label>
                  <Textarea
                    id="projectComment"
                    placeholder="Share details about the project requirements, timeline, and overall experience..."
                    value={projectComment}
                    onChange={(e) => setProjectComment(e.target.value)}
                    className="mt-1.5"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Company Review</CardTitle>
                <CardDescription>
                  How was working with {companyName}?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Rating</Label>
                  <StarRating rating={companyRating} onRatingChange={setCompanyRating} />
                </div>
                <div>
                  <Label htmlFor="companyComment">Comments (optional)</Label>
                  <Textarea
                    id="companyComment"
                    placeholder="Share your experience with communication, payment, and professionalism..."
                    value={companyComment}
                    onChange={(e) => setCompanyComment(e.target.value)}
                    className="mt-1.5"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {user.role === 'customer' && freelancerId && (
          <Card>
            <CardHeader>
              <CardTitle>Freelancer Review</CardTitle>
              <CardDescription>
                How was your experience working with {freelancerName}?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Rating</Label>
                <StarRating rating={freelancerRating} onRatingChange={setFreelancerRating} />
              </div>
              <div>
                <Label htmlFor="freelancerComment">Comments (optional)</Label>
                <Textarea
                  id="freelancerComment"
                  placeholder="Share details about the quality of work, communication, and timeliness..."
                  value={freelancerComment}
                  onChange={(e) => setFreelancerComment(e.target.value)}
                  className="mt-1.5"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Platform Review</CardTitle>
            <CardDescription>
              How would you rate your overall experience with our platform?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Rating</Label>
              <StarRating rating={platformRating} onRatingChange={setPlatformRating} />
            </div>
            <div>
              <Label htmlFor="platformComment">Comments (optional)</Label>
              <Textarea
                id="platformComment"
                placeholder="Share your feedback about features, usability, and suggestions for improvement..."
                value={platformComment}
                onChange={(e) => setPlatformComment(e.target.value)}
                className="mt-1.5"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button type="submit" className="gap-2">
            <Send className="w-4 h-4" />
            Submit Reviews
          </Button>
        </div>
      </form>

      {/* Success Modal */}
      {showSuccessModal && (
        <SuccessModal
          title="Review Submitted Successfully"
          message="Thank you for your feedback! Your review has been submitted and will help improve our platform and community."
          icon={<CheckCircle className="w-8 h-8 text-green-600" />}
          accentColor="green"
          actions={[
            {
              label: 'Go to Dashboard',
              onClick: () => {
                setShowSuccessModal(false);
                navigate('/dashboard');
              },
            },
            {
              label: 'View Profile',
              onClick: () => {
                setShowSuccessModal(false);
                navigate('/profile');
              },
            },
          ]}
          onClose={() => {
            setShowSuccessModal(false);
            navigate('/dashboard');
          }}
        />
      )}
    </div>
  );
}

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

function StarRating({ rating, onRatingChange }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex gap-2 mt-1.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRatingChange(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 rounded"
        >
          <Star
            className={`w-8 h-8 transition-colors ${
              star <= (hoverRating || rating)
                ? 'text-yellow-500 fill-yellow-500'
                : 'text-gray-300'
            }`}
          />
        </button>
      ))}
      {rating > 0 && (
        <span className="ml-2 text-sm text-gray-600 self-center">
          {rating} star{rating !== 1 ? 's' : ''}
        </span>
      )}
    </div>
  );
}
