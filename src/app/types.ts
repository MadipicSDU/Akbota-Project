export type UserRole = 'freelancer' | 'customer' | 'admin';

export interface PortfolioItem {
  id: string;
  type: 'project' | 'paper';
  title: string;
  description: string;
  url?: string;
  imageUrl?: string;
  date: string;
  tags?: string[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  skills?: string[];
  hourlyRate?: number;
  completedProjects?: number;
  rating?: number;
  createdAt: string;
  verified?: boolean;
  portfolio?: PortfolioItem[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  budgetType: 'fixed' | 'hourly';
  duration: string;
  skillsRequired: string[];
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  freelancerId?: string;
  freelancerName?: string;
  postedAt: string;
  deadline?: string;
  applicationsCount: number;
  completedAt?: string;
  deliverables?: ProjectDeliverable[];
  freelancerReview?: ProjectReviewData;
  customerReview?: ProjectReviewData;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  isBeginnerFriendly?: boolean;
}

export interface ProjectDeliverable {
  id: string;
  name: string;
  type: 'file' | 'link' | 'document';
  url: string;
  uploadedAt: string;
  size?: string;
}

export interface ProjectReviewData {
  projectRating?: number;
  projectComment?: string;
  otherPartyRating?: number;
  otherPartyComment?: string;
  platformRating?: number;
  platformComment?: string;
  submittedAt?: string;
}

export interface Application {
  id: string;
  projectId: string;
  freelancerId: string;
  freelancerName: string;
  freelancerAvatar?: string;
  freelancerRating?: number;
  coverLetter: string;
  proposedRate: number;
  estimatedDuration: string;
  status: 'pending' | 'accepted' | 'rejected';
  submittedAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface Review {
  id: string;
  projectId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar?: string;
  revieweeId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export type PlatformReviewType = 'project' | 'company' | 'platform' | 'freelancer';

export interface PlatformReview {
  id: string;
  reviewType: PlatformReviewType;
  reviewerId: string;
  reviewerName: string;
  reviewerEmail: string;
  reviewerRole: UserRole;
  reviewerAvatar?: string;
  projectId?: string;
  projectTitle?: string;
  companyId?: string;
  companyName?: string;
  freelancerId?: string;
  freelancerName?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'application' | 'message' | 'project_status' | 'review' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}
