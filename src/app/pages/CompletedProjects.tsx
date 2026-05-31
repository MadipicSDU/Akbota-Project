import { Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, DollarSign, Star, FileText, CheckCircle, Award } from 'lucide-react';
import { mockProjects } from '../data/mockData';

export default function CompletedProjects() {
  const { user } = useAuth();

  if (!user) return null;

  const completedProjects = mockProjects.filter((p) => {
    if (p.status !== 'completed') return false;
    return p.customerId === user.id || p.freelancerId === user.id;
  });

  const isFreelancer = user.role === 'freelancer';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Award className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-900">Completed Projects</h1>
        </div>
        <p className="text-gray-600">
          {isFreelancer
            ? 'View your completed work and client reviews'
            : 'Review your completed projects and freelancer performance'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Completed</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{completedProjects.length}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">
                {isFreelancer ? 'Total Earned' : 'Total Spent'}
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                ${completedProjects.reduce((sum, p) => sum + p.budget, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Average Rating</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-3xl font-bold text-gray-900">
                  {user.rating ? user.rating.toFixed(1) : 'N/A'}
                </p>
                <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
              </div>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Projects List */}
      {completedProjects.length > 0 ? (
        <div className="space-y-6">
          {completedProjects.map((project) => {
            const userReview = isFreelancer ? project.freelancerReview : project.customerReview;
            const otherPartyReview = isFreelancer ? project.customerReview : project.freelancerReview;
            const hasReviewed = !!userReview?.submittedAt;
            const hasReceivedReview = !!otherPartyReview?.submittedAt;

            return (
              <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Link
                          to={`/projects/${project.id}`}
                          className="text-2xl font-bold text-gray-900 hover:text-indigo-600 transition"
                        >
                          {project.title}
                        </Link>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          Completed
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.skillsRequired.map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-2 text-gray-700">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-600">Budget</p>
                        <p className="font-semibold">${project.budget}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-600">Completed</p>
                        <p className="font-semibold">
                          {project.completedAt
                            ? new Date(project.completedAt).toLocaleDateString()
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-600">Deliverables</p>
                        <p className="font-semibold">{project.deliverables?.length || 0} files</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      {isFreelancer ? (
                        <>
                          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200">
                            {project.customerAvatar && (
                              <img src={project.customerAvatar} alt={project.customerName} />
                            )}
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Client</p>
                            <p className="font-semibold">{project.customerName}</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200">
                            {project.customerAvatar && (
                              <img
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${project.freelancerName}`}
                                alt={project.freelancerName}
                              />
                            )}
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Freelancer</p>
                            <p className="font-semibold">{project.freelancerName}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Reviews Section */}
                  <div className="space-y-4">
                    {/* Review from other party */}
                    {hasReceivedReview && otherPartyReview && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-semibold text-gray-900">
                                Review from {isFreelancer ? project.customerName : project.freelancerName}
                              </p>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < (otherPartyReview.otherPartyRating || 0)
                                        ? 'text-yellow-500 fill-yellow-500'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            {otherPartyReview.otherPartyComment && (
                              <p className="text-sm text-gray-700">
                                {otherPartyReview.otherPartyComment}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-3">
                      <Link
                        to={`/projects/${project.id}`}
                        className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition text-center font-medium"
                      >
                        View Details
                      </Link>
                      {!hasReviewed && (
                        <Link
                          to={`/submit-review?projectId=${project.id}&projectTitle=${encodeURIComponent(
                            project.title
                          )}&${
                            isFreelancer
                              ? `companyId=${project.customerId}&companyName=${encodeURIComponent(
                                  project.customerName
                                )}`
                              : `freelancerId=${project.freelancerId}&freelancerName=${encodeURIComponent(
                                  project.freelancerName || ''
                                )}`
                          }`}
                          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition text-center font-medium"
                        >
                          Leave Review
                        </Link>
                      )}
                      {hasReviewed && (
                        <div className="flex-1 bg-gray-100 text-gray-600 py-2 px-4 rounded-lg text-center font-medium cursor-not-allowed">
                          Review Submitted
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Completed Projects Yet</h3>
          <p className="text-gray-600 mb-6">
            {isFreelancer
              ? 'Start applying to projects to build your portfolio'
              : 'Post a project to find talented freelancers'}
          </p>
          <Link
            to={isFreelancer ? '/projects' : '/projects/create'}
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-medium"
          >
            {isFreelancer ? 'Browse Projects' : 'Post a Project'}
          </Link>
        </div>
      )}
    </div>
  );
}
