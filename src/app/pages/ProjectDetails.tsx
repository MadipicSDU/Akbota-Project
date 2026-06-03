import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import {
  Clock,
  DollarSign,
  User,
  Calendar,
  CheckCircle,
  XCircle,
  Send,
  Star,
  Download,
  FileText,
  ExternalLink,
  MessageSquare,
  Briefcase,
  Upload,
} from 'lucide-react';
import { mockProjects, mockApplications } from '../data/mockData';
import { SuccessModal } from '../components/SuccessModal';

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    proposedRate: '',
    estimatedDuration: '',
    attachmentName: '',
  });
  const [showAppSuccess, setShowAppSuccess] = useState(false);
  const [showAcceptSuccess, setShowAcceptSuccess] = useState(false);
  const [showRejectSuccess, setShowRejectSuccess] = useState(false);
  const [showDownloadSuccess, setShowDownloadSuccess] = useState<string | null>(null);
  const [draggingAttachment, setDraggingAttachment] = useState(false);

  const project = mockProjects.find((p) => p.id === id);
  const projectApplications = mockApplications.filter((a) => a.projectId === id);
  const userApplication = projectApplications.find((a) => a.freelancerId === user?.id);

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Project not found</h1>
        <Link to="/projects" className="text-indigo-600 hover:text-indigo-700 mt-4 inline-block">
          Back to projects
        </Link>
      </div>
    );
  }

  const isOwner = user?.id === project.customerId;
  const isFreelancer = user?.role === 'freelancer';

  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowApplicationForm(false);
    setShowAppSuccess(true);
    setApplicationData({ coverLetter: '', proposedRate: '', estimatedDuration: '', attachmentName: '' });
  };

  const handleAcceptApplication = (_applicationId: string) => {
    setShowAcceptSuccess(true);
  };

  const handleRejectApplication = (_applicationId: string) => {
    setShowRejectSuccess(true);
  };

  const handleDownload = (name: string) => {
    setShowDownloadSuccess(name);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {showAppSuccess && (
        <SuccessModal
          title="Application Submitted!"
          message={`Your application for "${project?.title}" has been successfully sent to the client. You'll be notified once they review it.`}
          accentColor="indigo"
          onClose={() => setShowAppSuccess(false)}
          actions={[
            { label: 'Track Application Status', onClick: () => { setShowAppSuccess(false); navigate('/dashboard'); } },
            { label: 'Back to Projects', onClick: () => { setShowAppSuccess(false); navigate('/projects'); }, variant: 'secondary' },
            { label: 'Stay on This Page', onClick: () => setShowAppSuccess(false), variant: 'ghost' },
          ]}
        />
      )}
      {showAcceptSuccess && (
        <SuccessModal
          title="Application Accepted"
          message="The freelancer has been notified. A contract will be initiated and funds will be held in escrow."
          accentColor="green"
          onClose={() => setShowAcceptSuccess(false)}
          actions={[
            { label: 'Go to Dashboard', onClick: () => { setShowAcceptSuccess(false); navigate('/dashboard'); } },
            { label: 'Stay Here', onClick: () => setShowAcceptSuccess(false), variant: 'secondary' },
          ]}
        />
      )}
      {showRejectSuccess && (
        <SuccessModal
          title="Application Declined"
          message="The applicant has been notified. You can continue reviewing other applications."
          accentColor="blue"
          onClose={() => setShowRejectSuccess(false)}
          actions={[
            { label: 'Continue Reviewing', onClick: () => setShowRejectSuccess(false) },
          ]}
        />
      )}
      {showDownloadSuccess && (
        <SuccessModal
          title="Download Successful"
          message={`"${showDownloadSuccess}" has been downloaded to your device.`}
          accentColor="green"
          onClose={() => setShowDownloadSuccess(null)}
          actions={[
            { label: 'Done', onClick: () => setShowDownloadSuccess(null) },
          ]}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
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

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{project.customerName}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>Posted {new Date(project.postedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium">{project.applicationsCount}</span> applications
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{project.description}</p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Skills Required</h2>
              <div className="flex flex-wrap gap-2">
                {project.skillsRequired.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {isFreelancer && project.status === 'open' && !userApplication && (
              <div>
                {!showApplicationForm ? (
                  <button
                    onClick={() => setShowApplicationForm(true)}
                    className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition font-medium"
                  >
                    Apply for This Project
                  </button>
                ) : (
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Submit Your Application</h3>
                    <form onSubmit={handleApplicationSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cover Letter
                        </label>
                        <textarea
                          value={applicationData.coverLetter}
                          onChange={(e) =>
                            setApplicationData({ ...applicationData, coverLetter: e.target.value })
                          }
                          rows={6}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none resize-none"
                          placeholder="Explain why you're a great fit for this project..."
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Proposed Rate ($)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={applicationData.proposedRate}
                          onChange={(e) =>
                            setApplicationData({ ...applicationData, proposedRate: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Estimated Duration
                        </label>
                        <input
                          type="text"
                          value={applicationData.estimatedDuration}
                          onChange={(e) =>
                            setApplicationData({
                              ...applicationData,
                              estimatedDuration: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
                          placeholder="e.g., 2 weeks"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Supporting File <span className="text-gray-400 text-xs">(optional)</span>
                        </label>
                        <div
                          onDragOver={(e) => { e.preventDefault(); setDraggingAttachment(true); }}
                          onDragLeave={() => setDraggingAttachment(false)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setDraggingAttachment(false);
                            const f = e.dataTransfer.files?.[0];
                            if (f) setApplicationData((prev) => ({ ...prev, attachmentName: f.name }));
                          }}
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = '.pdf,.doc,.docx,.zip,.png,.jpg';
                            input.onchange = (ev) => {
                              const f = (ev.target as HTMLInputElement).files?.[0];
                              if (f) setApplicationData((prev) => ({ ...prev, attachmentName: f.name }));
                            };
                            input.click();
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition text-sm ${
                            draggingAttachment
                              ? 'border-indigo-500 bg-indigo-50'
                              : applicationData.attachmentName
                              ? 'border-green-400 bg-green-50'
                              : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
                          }`}
                        >
                          <Upload className={`w-4 h-4 shrink-0 ${applicationData.attachmentName ? 'text-green-500' : 'text-gray-400'}`} />
                          <span className={applicationData.attachmentName ? 'text-gray-900 truncate' : 'text-gray-400'}>
                            {applicationData.attachmentName || (draggingAttachment ? 'Drop file here' : 'Click or drag to attach a file')}
                          </span>
                          {applicationData.attachmentName && <CheckCircle className="w-4 h-4 text-green-500 ml-auto shrink-0" />}
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button
                          type="submit"
                          className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
                        >
                          <Send className="w-4 h-4" />
                          Submit Application
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowApplicationForm(false)}
                          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}

            {userApplication && (
              <div className="border border-indigo-200 bg-indigo-50 rounded-lg p-4">
                <p className="text-indigo-900 font-medium">
                  You've already applied for this project
                </p>
                <p className="text-indigo-700 text-sm mt-1">
                  Status:{' '}
                  <span className="font-medium capitalize">{userApplication.status}</span>
                </p>
              </div>
            )}
          </div>

          {/* Applications (visible to project owner) */}
          {isOwner && projectApplications.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Applications ({projectApplications.length})
              </h2>
              <div className="space-y-4">
                {projectApplications.map((application) => (
                  <div
                    key={application.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {application.freelancerAvatar && (
                          <img
                            src={application.freelancerAvatar}
                            alt={application.freelancerName}
                            className="w-12 h-12 rounded-full"
                          />
                        )}
                        <div>
                          <p className="font-semibold text-gray-900">
                            {application.freelancerName}
                          </p>
                          {application.freelancerRating && (
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              <span className="text-sm text-gray-600">
                                {application.freelancerRating}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          application.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : application.status === 'accepted'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {application.status}
                      </span>
                    </div>

                    <p className="text-gray-700 text-sm mb-3">{application.coverLetter}</p>

                    <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                      <div>
                        <span className="font-medium">Rate:</span> ${application.proposedRate}
                      </div>
                      <div>
                        <span className="font-medium">Duration:</span>{' '}
                        {application.estimatedDuration}
                      </div>
                    </div>

                    {application.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAcceptApplication(application.id)}
                          className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Accept
                        </button>
                        <button
                          onClick={() => handleRejectApplication(application.id)}
                          className="flex items-center gap-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Deliverables (for completed projects) */}
          {project.status === 'completed' && project.deliverables && project.deliverables.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Project Deliverables ({project.deliverables.length})
              </h2>
              <div className="space-y-3">
                {project.deliverables.map((deliverable) => (
                  <div
                    key={deliverable.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="bg-indigo-100 p-2 rounded-lg">
                          {deliverable.type === 'link' ? (
                            <ExternalLink className="w-5 h-5 text-indigo-600" />
                          ) : (
                            <FileText className="w-5 h-5 text-indigo-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {deliverable.name}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <span className="capitalize">{deliverable.type}</span>
                            {deliverable.size && (
                              <>
                                <span>•</span>
                                <span>{deliverable.size}</span>
                              </>
                            )}
                            <span>•</span>
                            <span>
                              {new Date(deliverable.uploadedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDownload(deliverable.name)}
                        className="flex items-center gap-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-sm"
                      >
                        <Download className="w-4 h-4" />
                        {deliverable.type === 'link' ? 'Open' : 'Download'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews Section (for completed projects) */}
          {project.status === 'completed' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5" />
                Reviews & Ratings
              </h2>

              {/* Customer Review */}
              {project.customerReview?.submittedAt && (
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-start gap-3 mb-3">
                    {project.customerAvatar && (
                      <img
                        src={project.customerAvatar}
                        alt={project.customerName}
                        className="w-12 h-12 rounded-full border-2 border-gray-100"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{project.customerName}</p>
                          <p className="text-sm text-gray-600">Customer Review</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i < (project.customerReview?.otherPartyRating || 0)
                                  ? 'text-yellow-500 fill-yellow-500'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {project.customerReview.otherPartyComment && (
                        <div className="bg-gray-50 rounded-lg p-3 mt-2">
                          <MessageSquare className="w-4 h-4 text-gray-400 inline mr-2" />
                          <p className="text-sm text-gray-700 inline">
                            {project.customerReview.otherPartyComment}
                          </p>
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(project.customerReview.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Freelancer Review */}
              {project.freelancerReview?.submittedAt && (
                <div className="mb-6">
                  <div className="flex items-start gap-3 mb-3">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${project.freelancerName}`}
                      alt={project.freelancerName || ''}
                      className="w-12 h-12 rounded-full border-2 border-gray-100"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{project.freelancerName}</p>
                          <p className="text-sm text-gray-600">Freelancer Review</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i < (project.freelancerReview?.otherPartyRating || 0)
                                  ? 'text-yellow-500 fill-yellow-500'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {project.freelancerReview.otherPartyComment && (
                        <div className="bg-gray-50 rounded-lg p-3 mt-2">
                          <MessageSquare className="w-4 h-4 text-gray-400 inline mr-2" />
                          <p className="text-sm text-gray-700 inline">
                            {project.freelancerReview.otherPartyComment}
                          </p>
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(project.freelancerReview.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Leave Review CTA */}
              {(!project.customerReview?.submittedAt && isOwner) ||
              (!project.freelancerReview?.submittedAt && project.freelancerId === user?.id) ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-900 mb-3">
                    <strong>Project Complete!</strong> Share your experience by leaving a review.
                  </p>
                  <Link
                    to={`/submit-review?projectId=${project.id}&projectTitle=${encodeURIComponent(
                      project.title
                    )}&${
                      isOwner
                        ? `freelancerId=${project.freelancerId}&freelancerName=${encodeURIComponent(
                            project.freelancerName || ''
                          )}`
                        : `companyId=${project.customerId}&companyName=${encodeURIComponent(
                            project.customerName
                          )}`
                    }`}
                    className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm font-medium"
                  >
                    <Star className="w-4 h-4" />
                    Leave Review
                  </Link>
                </div>
              ) : null}

              {!project.customerReview?.submittedAt && !project.freelancerReview?.submittedAt && (
                <div className="text-center py-8 text-gray-600">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p>No reviews yet</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Project Details</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-700">
                <DollarSign className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Budget</p>
                  <p className="font-semibold">
                    ${project.budget} {project.budgetType === 'hourly' ? '/hr' : 'fixed'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-semibold">{project.duration}</p>
                </div>
              </div>
              {project.deadline && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Deadline</p>
                    <p className="font-semibold">
                      {new Date(project.deadline).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-gray-900 mb-4">About Client</h3>
            <div className="flex items-center gap-3 mb-3">
              {project.customerAvatar && (
                <img
                  src={project.customerAvatar}
                  alt={project.customerName}
                  className="w-12 h-12 rounded-full"
                />
              )}
              <div>
                <p className="font-semibold text-gray-900">{project.customerName}</p>
                <p className="text-sm text-gray-600">Customer</p>
              </div>
            </div>
            <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition text-sm">
              View Profile
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Safety Tip:</strong> Always communicate through the platform and never share personal financial information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
