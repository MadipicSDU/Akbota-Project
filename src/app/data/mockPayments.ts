import type { Project } from '../types';

export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'disputed';
export type TransactionType = 'payment' | 'withdrawal' | 'escrow_hold' | 'escrow_release' | 'refund';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  projectId?: string;
  projectTitle?: string;
  description: string;
  createdAt: string;
  completedAt?: string;
  escrowReleaseDate?: string;
  disputeReason?: string;
}

export interface Wallet {
  userId: string;
  balance: number;
  availableBalance: number;
  pendingBalance: number;
  totalEarnings: number;
  totalSpent: number;
  currency: string;
}

export const mockWallets: Wallet[] = [
  {
    userId: '1',
    balance: 2450.00,
    availableBalance: 1950.00,
    pendingBalance: 500.00,
    totalEarnings: 6200.00,
    totalSpent: 150.00,
    currency: 'USD',
  },
  {
    userId: '2',
    balance: 1200.00,
    availableBalance: 1200.00,
    pendingBalance: 0,
    totalEarnings: 0,
    totalSpent: 2800.00,
    currency: 'USD',
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: 't1',
    type: 'escrow_hold',
    amount: 800.00,
    status: 'pending',
    fromUserId: '2',
    fromUserName: 'Sarah Johnson',
    toUserId: '1',
    toUserName: 'John Smith',
    projectId: 'p1',
    projectTitle: 'E-commerce Website Development',
    description: 'Payment held in escrow for project completion',
    createdAt: '2026-04-05T12:00:00Z',
    escrowReleaseDate: '2026-04-28T12:00:00Z',
  },
  {
    id: 't2',
    type: 'escrow_release',
    amount: 600.00,
    status: 'completed',
    fromUserId: '2',
    fromUserName: 'Sarah Johnson',
    toUserId: '1',
    toUserName: 'John Smith',
    projectId: 'p3',
    projectTitle: 'Mobile App UI/UX Design',
    description: 'Payment released after project completion',
    createdAt: '2026-03-25T09:00:00Z',
    completedAt: '2026-04-02T14:00:00Z',
  },
  {
    id: 't3',
    type: 'withdrawal',
    amount: 500.00,
    status: 'completed',
    fromUserId: '1',
    fromUserName: 'John Smith',
    toUserId: '1',
    toUserName: 'John Smith',
    description: 'Withdrawal to bank account ending in 4532',
    createdAt: '2026-03-28T10:30:00Z',
    completedAt: '2026-03-30T08:15:00Z',
  },
  {
    id: 't4',
    type: 'payment',
    amount: 200.00,
    status: 'completed',
    fromUserId: '2',
    fromUserName: 'Sarah Johnson',
    toUserId: '4',
    toUserName: 'Emma Wilson',
    projectId: 'p2',
    projectTitle: 'Logo Design for Startup',
    description: 'Payment for logo design services',
    createdAt: '2026-04-01T16:00:00Z',
    completedAt: '2026-04-01T16:05:00Z',
  },
  {
    id: 't5',
    type: 'payment',
    amount: 450.00,
    status: 'failed',
    fromUserId: '2',
    fromUserName: 'Sarah Johnson',
    toUserId: '5',
    toUserName: 'Mike Brown',
    projectId: 'p4',
    projectTitle: 'Data Analysis and Visualization',
    description: 'Payment processing failed - insufficient funds',
    createdAt: '2026-04-06T11:20:00Z',
  },
  {
    id: 't6',
    type: 'escrow_hold',
    amount: 300.00,
    status: 'disputed',
    fromUserId: '2',
    fromUserName: 'Sarah Johnson',
    toUserId: '5',
    toUserName: 'Mike Brown',
    projectId: 'p5',
    projectTitle: 'Content Writing for Blog',
    description: 'Payment disputed - quality concerns',
    createdAt: '2026-04-03T14:00:00Z',
    disputeReason: 'Work delivered does not meet specified requirements',
  },
  {
    id: 't7',
    type: 'payment',
    amount: 1200.00,
    status: 'completed',
    fromUserId: '2',
    fromUserName: 'Sarah Johnson',
    toUserId: '1',
    toUserName: 'John Smith',
    projectId: 'p3',
    projectTitle: 'Mobile App UI/UX Design',
    description: 'Milestone payment 1 of 2',
    createdAt: '2026-03-20T10:00:00Z',
    completedAt: '2026-03-20T10:05:00Z',
  },
  {
    id: 't8',
    type: 'withdrawal',
    amount: 800.00,
    status: 'pending',
    fromUserId: '4',
    fromUserName: 'Emma Wilson',
    toUserId: '4',
    toUserName: 'Emma Wilson',
    description: 'Withdrawal to PayPal account',
    createdAt: '2026-04-07T09:00:00Z',
  },
];
