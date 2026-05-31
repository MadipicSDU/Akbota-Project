import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Users, Briefcase, Flag, CheckCircle, XCircle, Shield, Star, MessageSquare, Mail } from 'lucide-react';
import { mockUsers, mockProjects, mockPlatformReviews } from '../data/mockData';
import { Button } from '../components/ui/button';

type Tab = 'users' | 'projects' | 'reports' | 'reviews';

export default function AdminPanel() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('users');

  if (user?.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
        <p className="text-gray-600 mt-2">Only administrators can access this page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
        </div>
        <p className="text-gray-600">Manage users, projects, and platform content</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{mockUsers.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Projects</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{mockProjects.length}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Briefcase className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Reviews</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{mockPlatformReviews.length}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending Reports</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">2</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Flag className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Verified Users</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {mockUsers.filter((u) => u.verified).length}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <div className="flex gap-4 px-6">
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-2 border-b-2 font-medium transition ${
                activeTab === 'users'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              User Management
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`py-4 px-2 border-b-2 font-medium transition ${
                activeTab === 'projects'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Project Moderation
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-4 px-2 border-b-2 font-medium transition ${
                activeTab === 'reports'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Reports
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-4 px-2 border-b-2 font-medium transition ${
                activeTab === 'reviews'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Reviews
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'projects' && <ProjectModeration />}
          {activeTab === 'reports' && <ReportsManagement />}
          {activeTab === 'reviews' && <ReviewsManagement />}
        </div>
      </div>
    </div>
  );
}

function UserManagement() {
  const handleVerifyUser = (userId: string) => {
    alert(`User verified! (This is a demo)`);
  };

  const handleSuspendUser = (userId: string) => {
    alert(`User suspended! (This is a demo)`);
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">All Users</h2>
        <input
          type="text"
          placeholder="Search users..."
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                User
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                Role
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                Projects
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                Rating
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {user.avatar && (
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="capitalize text-gray-700">{user.role}</span>
                </td>
                <td className="px-4 py-3">
                  {user.verified ? (
                    <span className="flex items-center gap-1 text-green-700 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      Verified
                    </span>
                  ) : (
                    <span className="text-gray-600 text-sm">Not Verified</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-700">{user.completedProjects || 0}</td>
                <td className="px-4 py-3">
                  {user.rating ? (
                    <div className="flex items-center gap-1">
                      <span className="text-gray-900 font-medium">{user.rating.toFixed(1)}</span>
                      <span className="text-yellow-500">★</span>
                    </div>
                  ) : (
                    <span className="text-gray-500">N/A</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {!user.verified && (
                      <button
                        onClick={() => handleVerifyUser(user.id)}
                        className="text-green-600 hover:text-green-700 text-sm font-medium"
                      >
                        Verify
                      </button>
                    )}
                    <button
                      onClick={() => handleSuspendUser(user.id)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Suspend
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProjectModeration() {
  const handleApproveProject = (projectId: string) => {
    alert(`Project approved! (This is a demo)`);
  };

  const handleRejectProject = (projectId: string) => {
    alert(`Project rejected! (This is a demo)`);
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">All Projects</h2>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none">
          <option>All Status</option>
          <option>Open</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
      </div>

      <div className="space-y-4">
        {mockProjects.map((project) => (
          <div key={project.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{project.title}</h3>
                <p className="text-sm text-gray-600">Posted by {project.customerName}</p>
              </div>
              <span
                className={`px-3 py-1 text-sm rounded-full ${
                  project.status === 'open'
                    ? 'bg-green-100 text-green-700'
                    : project.status === 'in_progress'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {project.status.replace('_', ' ')}
              </span>
            </div>

            <p className="text-gray-700 text-sm mb-3 line-clamp-2">{project.description}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="font-medium">${project.budget}</span>
                <span>{project.category}</span>
                <span>{project.applicationsCount} applications</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleApproveProject(project.id)}
                  className="flex items-center gap-1 text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
                <button
                  onClick={() => handleRejectProject(project.id)}
                  className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReportsManagement() {
  const mockReports = [
    {
      id: 'r1',
      type: 'Inappropriate Content',
      reportedBy: 'John Smith',
      reportedItem: 'Project: "Build a website"',
      reason: 'Contains offensive language',
      status: 'pending',
      createdAt: '2026-04-06T14:00:00Z',
    },
    {
      id: 'r2',
      type: 'Spam',
      reportedBy: 'Emma Wilson',
      reportedItem: 'User: Mike Brown',
      reason: 'Sending spam messages',
      status: 'pending',
      createdAt: '2026-04-05T10:00:00Z',
    },
  ];

  const handleResolveReport = (reportId: string) => {
    alert(`Report resolved! (This is a demo)`);
  };

  const handleDismissReport = (reportId: string) => {
    alert(`Report dismissed! (This is a demo)`);
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Pending Reports</h2>
      </div>

      {mockReports.length > 0 ? (
        <div className="space-y-4">
          {mockReports.map((report) => (
            <div key={report.id} className="border border-orange-200 bg-orange-50 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Flag className="w-5 h-5 text-orange-600" />
                    <h3 className="font-semibold text-gray-900">{report.type}</h3>
                  </div>
                  <p className="text-sm text-gray-700 mb-1">
                    <span className="font-medium">Reported Item:</span> {report.reportedItem}
                  </p>
                  <p className="text-sm text-gray-700 mb-1">
                    <span className="font-medium">Reported By:</span> {report.reportedBy}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Reason:</span> {report.reason}
                  </p>
                </div>
                <span className="text-xs text-gray-600">
                  {new Date(report.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleResolveReport(report.id)}
                  className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  Resolve
                </button>
                <button
                  onClick={() => handleDismissReport(report.id)}
                  className="flex items-center gap-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition text-sm"
                >
                  <XCircle className="w-4 h-4" />
                  Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-600">
          <Flag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p>No pending reports</p>
        </div>
      )}
    </div>
  );
}

function ReviewsManagement() {
  const [filterType, setFilterType] = useState<string>('all');

  const handleContactUser = (reviewerEmail: string, reviewerName: string) => {
    window.location.href = `mailto:${reviewerEmail}?subject=Regarding your review on StudentFreelance`;
  };

  const filteredReviews = filterType === 'all'
    ? mockPlatformReviews
    : mockPlatformReviews.filter(r => r.reviewType === filterType);

  const getReviewTypeLabel = (type: string) => {
    switch (type) {
      case 'project': return 'Project Review';
      case 'company': return 'Company Review';
      case 'freelancer': return 'Freelancer Review';
      case 'platform': return 'Platform Review';
      default: return type;
    }
  };

  const getReviewTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'project': return 'bg-blue-100 text-blue-700';
      case 'company': return 'bg-purple-100 text-purple-700';
      case 'freelancer': return 'bg-green-100 text-green-700';
      case 'platform': return 'bg-indigo-100 text-indigo-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">All Reviews ({filteredReviews.length})</h2>
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All Reviews</option>
          <option value="platform">Platform Reviews</option>
          <option value="project">Project Reviews</option>
          <option value="company">Company Reviews</option>
          <option value="freelancer">Freelancer Reviews</option>
        </select>
      </div>

      {filteredReviews.length > 0 ? (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div key={review.id} className="border border-gray-200 rounded-lg p-5 bg-white hover:shadow-md transition">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  {review.reviewerAvatar && (
                    <img
                      src={review.reviewerAvatar}
                      alt={review.reviewerName}
                      className="w-12 h-12 rounded-full border-2 border-gray-100"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{review.reviewerName}</h3>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm text-gray-600 capitalize">{review.reviewerRole}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getReviewTypeBadgeColor(review.reviewType)}`}>
                        {getReviewTypeLabel(review.reviewType)}
                      </span>
                      {review.projectTitle && (
                        <span className="text-xs text-gray-600">Project: {review.projectTitle}</span>
                      )}
                      {review.companyName && (
                        <span className="text-xs text-gray-600">Company: {review.companyName}</span>
                      )}
                      {review.freelancerName && (
                        <span className="text-xs text-gray-600">Freelancer: {review.freelancerName}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
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
                    <span className="ml-1 font-semibold text-gray-900">{review.rating}.0</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {review.comment && (
                <div className="mb-3 pl-15">
                  <div className="flex items-start gap-2 bg-gray-50 rounded-lg p-3">
                    <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
                  </div>
                </div>
              )}

              <div className="pl-15">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleContactUser(review.reviewerEmail, review.reviewerName)}
                  className="gap-2"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Contact User
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-600">
          <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p>No reviews found</p>
        </div>
      )}
    </div>
  );
}
