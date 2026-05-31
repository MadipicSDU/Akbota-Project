import { Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Briefcase, TrendingUp, DollarSign, Star, Plus, MessageSquare, Wallet } from 'lucide-react';
import { mockProjects, mockApplications } from '../data/mockData';

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  const isFreelancer = user.role === 'freelancer';
  const isCustomer = user.role === 'customer';
  const isAdmin = user.role === 'admin';

  const userProjects = isCustomer
    ? mockProjects.filter((p) => p.customerId === user.id)
    : mockProjects.filter((p) => p.freelancerId === user.id);

  const userApplications = isFreelancer
    ? mockApplications.filter((a) => a.freelancerId === user.id)
    : [];

  const openProjects = mockProjects.filter((p) => p.status === 'open');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user.name}!
        </h1>
        <p className="text-gray-600 mt-1">
          {isFreelancer && 'Find your next project and grow your skills'}
          {isCustomer && 'Manage your projects and find talented freelancers'}
          {isAdmin && 'Monitor platform activity and moderate content'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">
                {isFreelancer ? 'Active Projects' : 'Posted Projects'}
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {userProjects.length}
              </p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-lg">
              <Briefcase className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">
                {isFreelancer ? 'Applications' : 'Total Applicants'}
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {isFreelancer ? userApplications.length : userProjects.reduce((sum, p) => sum + p.applicationsCount, 0)}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">
                {isFreelancer ? 'Earnings' : 'Total Budget'}
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ${isFreelancer ? (user.completedProjects || 0) * 500 : userProjects.reduce((sum, p) => sum + p.budget, 0)}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Rating</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {user.rating ? user.rating.toFixed(1) : 'N/A'}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {isFreelancer && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Recommended Projects</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {openProjects.slice(0, 3).map((project) => (
                  <Link
                    key={project.id}
                    to={`/projects/${project.id}`}
                    className="block p-6 hover:bg-gray-50 transition"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.skillsRequired.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        ${project.budget} {project.budgetType === 'hourly' ? '/hr' : 'fixed'}
                      </span>
                      <span className="text-gray-500">{project.applicationsCount} applications</span>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="p-4 border-t border-gray-200">
                <Link
                  to="/projects"
                  className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                >
                  View all projects →
                </Link>
              </div>
            </div>
          )}

          {isCustomer && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Your Projects</h2>
                <Link
                  to="/projects/create"
                  className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-sm"
                >
                  <Plus className="w-4 h-4" />
                  New Project
                </Link>
              </div>
              {userProjects.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {userProjects.map((project) => (
                    <Link
                      key={project.id}
                      to={`/projects/${project.id}`}
                      className="block p-6 hover:bg-gray-50 transition"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {project.title}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs rounded ${
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
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          ${project.budget} {project.budgetType === 'hourly' ? '/hr' : 'fixed'}
                        </span>
                        <span className="text-gray-500">
                          {project.applicationsCount} applications
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <p className="text-gray-600 mb-4">You haven't posted any projects yet.</p>
                  <Link
                    to="/projects/create"
                    className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                  >
                    <Plus className="w-4 h-4" />
                    Post Your First Project
                  </Link>
                </div>
              )}
            </div>
          )}

          {isAdmin && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Platform Overview</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600">Total Users</p>
                    <p className="text-2xl font-bold text-blue-900">127</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-600">Active Projects</p>
                    <p className="text-2xl font-bold text-green-900">{mockProjects.length}</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-600">Pending Reviews</p>
                    <p className="text-2xl font-bold text-purple-900">5</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <p className="text-sm text-orange-600">Reports</p>
                    <p className="text-2xl font-bold text-orange-900">2</p>
                  </div>
                </div>
                <Link
                  to="/admin"
                  className="block w-full text-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  Go to Admin Panel
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="font-bold text-gray-900">Recent Activity</h2>
            </div>
            <div className="p-6 space-y-4">
              {isFreelancer && userApplications.length > 0 && (
                <>
                  {userApplications.slice(0, 3).map((app) => (
                    <div key={app.id} className="flex gap-3">
                      <div className="bg-indigo-100 p-2 rounded-lg h-fit">
                        <Briefcase className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Application {app.status}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {new Date(app.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </>
              )}
              {userApplications.length === 0 && userProjects.length === 0 && (
                <p className="text-sm text-gray-600">No recent activity</p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="font-bold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6 space-y-3">
              {isFreelancer && (
                <>
                  <Link
                    to="/projects"
                    className="flex items-center gap-3 text-gray-700 hover:text-indigo-600 transition"
                  >
                    <Briefcase className="w-5 h-5" />
                    <span>Browse Projects</span>
                  </Link>
                  <Link
                    to="/profile/edit"
                    className="flex items-center gap-3 text-gray-700 hover:text-indigo-600 transition"
                  >
                    <Star className="w-5 h-5" />
                    <span>Update Profile</span>
                  </Link>
                  <Link
                    to="/payments"
                    className="flex items-center gap-3 text-gray-700 hover:text-indigo-600 transition"
                  >
                    <Wallet className="w-5 h-5" />
                    <span>View Earnings</span>
                  </Link>
                </>
              )}
              {isCustomer && (
                <>
                  <Link
                    to="/projects/create"
                    className="flex items-center gap-3 text-gray-700 hover:text-indigo-600 transition"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Post a Project</span>
                  </Link>
                  <Link
                    to="/projects"
                    className="flex items-center gap-3 text-gray-700 hover:text-indigo-600 transition"
                  >
                    <Briefcase className="w-5 h-5" />
                    <span>Manage Projects</span>
                  </Link>
                  <Link
                    to="/payments"
                    className="flex items-center gap-3 text-gray-700 hover:text-indigo-600 transition"
                  >
                    <Wallet className="w-5 h-5" />
                    <span>Payment Center</span>
                  </Link>
                </>
              )}
              <Link
                to="/messages"
                className="flex items-center gap-3 text-gray-700 hover:text-indigo-600 transition"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Messages</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
