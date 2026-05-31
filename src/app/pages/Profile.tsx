import { Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Star, MapPin, Briefcase, Edit, Crown, Award, Calendar } from 'lucide-react';
import { mockReviews, mockProjects } from '../data/mockData';
import { Button } from '../components/ui/button';

export default function Profile() {
  const { user } = useAuth();

  if (!user) return null;

  const userReviews = mockReviews.filter((r) => r.revieweeId === user.id);
  const completedProjects = mockProjects.filter(
    (p) => p.status === 'completed' && p.freelancerId === user.id
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-32"></div>

        {/* Profile Info */}
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-16 mb-6">
            <div className="flex items-end gap-4">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-indigo-600 border-4 border-white shadow-lg flex items-center justify-center">
                  <span className="text-4xl text-white">{user.name.charAt(0)}</span>
                </div>
              )}
              <div className="mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-600 capitalize">{user.role}</p>
              </div>
            </div>
            <Link
              to="/profile/edit"
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{user.completedProjects || 0}</p>
              <p className="text-gray-600 text-sm">Completed Projects</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center gap-1">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <p className="text-2xl font-bold text-gray-900">
                  {user.rating ? user.rating.toFixed(1) : 'N/A'}
                </p>
              </div>
              <p className="text-gray-600 text-sm">Rating</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">
                {user.verified ? '✓' : '✗'}
              </p>
              <p className="text-gray-600 text-sm">
                {user.verified ? 'Verified' : 'Not Verified'}
              </p>
            </div>
          </div>

          {/* Subscription Status */}
          <div className="mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-100">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="bg-indigo-600 rounded-lg p-2">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Current Plan: Free
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Upgrade to unlock premium features and grow your {user.role === 'freelancer' ? 'freelance career' : 'business'}
                  </p>
                  <Button size="sm" asChild className="bg-indigo-600 hover:bg-indigo-700">
                    <Link to="/pricing">
                      View Plans
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Leave a Review */}
          <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-100">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="bg-green-600 rounded-lg p-2">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Share Your Experience
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Help us improve by leaving a review for completed projects or the platform
                  </p>
                  <Button size="sm" asChild className="bg-green-600 hover:bg-green-700">
                    <Link to="/submit-review">
                      Leave a Review
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">About</h2>
            <p className="text-gray-700">
              {user.bio || 'No bio provided yet.'}
            </p>
          </div>

          {/* Skills (for freelancers) */}
          {user.role === 'freelancer' && user.skills && user.skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Hourly Rate (for freelancers) */}
          {user.role === 'freelancer' && user.hourlyRate && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Hourly Rate</h2>
              <p className="text-2xl font-bold text-indigo-600">${user.hourlyRate}/hour</p>
            </div>
          )}

          {/* Portfolio (for freelancers) */}
          {user.role === 'freelancer' && user.portfolio && user.portfolio.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Portfolio</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.portfolio.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
                    {item.imageUrl && (
                      <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover" />
                    )}
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          item.type === 'project'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-purple-100 text-purple-700'
                        }`}>
                          {item.type === 'project' ? 'Project' : 'Academic Paper'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(item.date).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {item.tags.map((tag, idx) => (
                            <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                          View {item.type === 'project' ? 'Project' : 'Paper'} →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Portfolio (for freelancers) */}
          {user.role === 'freelancer' && completedProjects.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Award className="w-6 h-6 text-indigo-600" />
                  Portfolio ({completedProjects.length})
                </h2>
                <Link
                  to="/completed-projects"
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                >
                  View All
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {completedProjects.slice(0, 3).map((project) => {
                  const customerReview = project.customerReview;
                  return (
                    <div
                      key={project.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <Link
                          to={`/projects/${project.id}`}
                          className="font-semibold text-gray-900 hover:text-indigo-600 transition flex-1"
                        >
                          {project.title}
                        </Link>
                        {customerReview?.otherPartyRating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-semibold text-gray-900">
                              {customerReview.otherPartyRating.toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {project.completedAt
                              ? new Date(project.completedAt).toLocaleDateString()
                              : 'N/A'}
                          </span>
                        </div>
                        <span>•</span>
                        <span className="font-medium">${project.budget}</span>
                        <span>•</span>
                        <span>{project.category}</span>
                      </div>
                      {customerReview?.otherPartyComment && (
                        <div className="mt-3 p-2 bg-gray-50 rounded text-sm text-gray-700 italic">
                          "{customerReview.otherPartyComment}"
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Reviews */}
          {userReviews.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Reviews ({userReviews.length})</h2>
              <div className="space-y-4">
                {userReviews.map((review) => (
                  <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-2">
                      {review.reviewerAvatar && (
                        <img
                          src={review.reviewerAvatar}
                          alt={review.reviewerName}
                          className="w-10 h-10 rounded-full"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-gray-900">{review.reviewerName}</p>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? 'text-yellow-500 fill-yellow-500'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm">{review.comment}</p>
                        <p className="text-gray-500 text-xs mt-2">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {userReviews.length === 0 && (
            <div className="text-center py-8">
              <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">No reviews yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
