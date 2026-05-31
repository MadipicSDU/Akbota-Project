import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Shield,
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
} from 'lucide-react';
import { mockWallets, mockTransactions, type Transaction, type TransactionStatus } from '../data/mockPayments';

export default function Payments() {
  const { user } = useAuth();
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<TransactionStatus | 'all'>('all');

  if (!user) return null;

  const userWallet = mockWallets.find((w) => w.userId === user.id) || {
    userId: user.id,
    balance: 0,
    availableBalance: 0,
    pendingBalance: 0,
    totalEarnings: 0,
    totalSpent: 0,
    currency: 'USD',
  };

  const userTransactions = mockTransactions
    .filter((t) => t.fromUserId === user.id || t.toUserId === user.id)
    .filter((t) => filterStatus === 'all' || t.status === filterStatus)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const isFreelancer = user.role === 'freelancer';
  const isCustomer = user.role === 'customer';
  const isAdmin = user.role === 'admin';

  if (isAdmin) {
    return <AdminPaymentPanel />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Center</h1>
        <p className="text-gray-600">
          {isFreelancer
            ? 'Manage your earnings and withdrawals'
            : 'Manage your payments and transactions'}
        </p>
      </div>

      {/* Wallet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-indigo-100 text-sm">Total Balance</p>
            <DollarSign className="w-5 h-5 text-indigo-200" />
          </div>
          <p className="text-3xl font-bold">
            ${userWallet.balance.toFixed(2)}
          </p>
          <p className="text-indigo-100 text-xs mt-1">{userWallet.currency}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 text-sm">Available</p>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ${userWallet.availableBalance.toFixed(2)}
          </p>
          <p className="text-green-600 text-xs mt-1">Ready to withdraw</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 text-sm">Pending</p>
            <Clock className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ${userWallet.pendingBalance.toFixed(2)}
          </p>
          <p className="text-yellow-600 text-xs mt-1">In escrow</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 text-sm">
              {isFreelancer ? 'Total Earned' : 'Total Spent'}
            </p>
            {isFreelancer ? (
              <TrendingUp className="w-5 h-5 text-blue-500" />
            ) : (
              <TrendingDown className="w-5 h-5 text-purple-500" />
            )}
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ${isFreelancer ? userWallet.totalEarnings.toFixed(2) : userWallet.totalSpent.toFixed(2)}
          </p>
          <p className="text-gray-500 text-xs mt-1">All time</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {isFreelancer && (
            <button
              onClick={() => setShowWithdrawModal(true)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
            >
              <ArrowUpRight className="w-5 h-5" />
              Withdraw Funds
            </button>
          )}
          {isCustomer && (
            <button
              onClick={() => setShowPaymentModal(true)}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
            >
              <CreditCard className="w-5 h-5" />
              Make Payment
            </button>
          )}
          <button className="flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition">
            <Download className="w-5 h-5" />
            Download Statement
          </button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Transaction History</h2>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as TransactionStatus | 'all')}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="disputed">Disputed</option>
            </select>
          </div>
        </div>

        {userTransactions.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {userTransactions.map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} userId={user.id} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-gray-600">
            <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p>No transactions found</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showWithdrawModal && (
        <WithdrawModal
          availableBalance={userWallet.availableBalance}
          onClose={() => setShowWithdrawModal(false)}
        />
      )}
      {showPaymentModal && (
        <PaymentModal onClose={() => setShowPaymentModal(false)} />
      )}
    </div>
  );
}

function TransactionRow({ transaction, userId }: { transaction: Transaction; userId: string }) {
  const isIncoming = transaction.toUserId === userId;
  const isOutgoing = transaction.fromUserId === userId;

  const getStatusIcon = (status: TransactionStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'disputed':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="p-6 hover:bg-gray-50 transition">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          <div className={`p-3 rounded-lg ${isIncoming ? 'bg-green-50' : 'bg-blue-50'}`}>
            {isIncoming ? (
              <ArrowDownLeft className="w-5 h-5 text-green-600" />
            ) : (
              <ArrowUpRight className="w-5 h-5 text-blue-600" />
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900">{transaction.description}</h3>
              {getStatusIcon(transaction.status)}
            </div>

            {transaction.projectTitle && (
              <p className="text-sm text-gray-600 mb-1">
                Project: {transaction.projectTitle}
              </p>
            )}

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>{getTypeLabel(transaction.type)}</span>
              <span>•</span>
              <span>
                {isIncoming ? 'From' : 'To'}: {isIncoming ? transaction.fromUserName : transaction.toUserName}
              </span>
              <span>•</span>
              <span>{new Date(transaction.createdAt).toLocaleDateString()}</span>
            </div>

            {transaction.status === 'disputed' && transaction.disputeReason && (
              <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded text-sm text-orange-800">
                <strong>Dispute:</strong> {transaction.disputeReason}
              </div>
            )}

            {transaction.escrowReleaseDate && transaction.status === 'pending' && (
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
                <strong>Escrow Release:</strong> {new Date(transaction.escrowReleaseDate).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>

        <div className="text-right">
          <p
            className={`text-xl font-bold ${
              isIncoming ? 'text-green-600' : 'text-gray-900'
            }`}
          >
            {isIncoming ? '+' : '-'}${transaction.amount.toFixed(2)}
          </p>
          <span
            className={`inline-block mt-1 px-2 py-1 text-xs rounded ${
              transaction.status === 'completed'
                ? 'bg-green-100 text-green-700'
                : transaction.status === 'pending'
                ? 'bg-yellow-100 text-yellow-700'
                : transaction.status === 'disputed'
                ? 'bg-orange-100 text-orange-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {transaction.status}
          </span>
        </div>
      </div>
    </div>
  );
}

function WithdrawModal({
  availableBalance,
  onClose,
}: {
  availableBalance: number;
  onClose: () => void;
}) {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('bank');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Withdrawal of $${amount} initiated! (This is a demo)`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Withdraw Funds</h2>

        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>Available Balance:</strong> ${availableBalance.toFixed(2)}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Amount (USD)
            </label>
            <input
              id="amount"
              type="number"
              min="10"
              max={availableBalance}
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
              placeholder="0.00"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Minimum withdrawal: $10.00</p>
          </div>

          <div>
            <label htmlFor="method" className="block text-sm font-medium text-gray-700 mb-2">
              Withdrawal Method
            </label>
            <select
              id="method"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
            >
              <option value="bank">Bank Transfer (2-3 business days)</option>
              <option value="paypal">PayPal (Instant)</option>
              <option value="stripe">Stripe (1-2 business days)</option>
            </select>
          </div>

          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800">
              <strong>Note:</strong> Withdrawals may take 1-3 business days depending on the method
              selected. A small processing fee may apply.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
            >
              Confirm Withdrawal
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PaymentModal({ onClose }: { onClose: () => void }) {
  const [amount, setAmount] = useState('');
  const [projectId, setProjectId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Payment of $${amount} initiated! Funds held in escrow. (This is a demo)`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Make Payment</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 mb-2">
              Project / Order ID
            </label>
            <input
              id="projectId"
              type="text"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
              placeholder="e.g., p1"
              required
            />
          </div>

          <div>
            <label htmlFor="paymentAmount" className="block text-sm font-medium text-gray-700 mb-2">
              Amount (USD)
            </label>
            <input
              id="paymentAmount"
              type="number"
              min="1"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            <select
              id="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
            >
              <option value="card">Credit/Debit Card</option>
              <option value="paypal">PayPal</option>
              <option value="bank">Bank Transfer</option>
            </select>
          </div>

          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-900 mb-1">Secure Escrow Protection</p>
                <p className="text-xs text-green-800">
                  Your payment will be held securely in escrow until you confirm the work is
                  completed to your satisfaction.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
            >
              Pay Securely
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AdminPaymentPanel() {
  const [filterStatus, setFilterStatus] = useState<TransactionStatus | 'all'>('all');

  const filteredTransactions = mockTransactions
    .filter((t) => filterStatus === 'all' || t.status === filterStatus)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const totalVolume = mockTransactions
    .filter((t) => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const disputedTransactions = mockTransactions.filter((t) => t.status === 'disputed');
  const pendingTransactions = mockTransactions.filter((t) => t.status === 'pending');

  const handleResolveDispute = (transactionId: string) => {
    alert(`Dispute resolved for transaction ${transactionId} (This is a demo)`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-900">Payment Administration</h1>
        </div>
        <p className="text-gray-600">Monitor and manage all platform transactions</p>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 text-sm">Total Volume</p>
            <DollarSign className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">${totalVolume.toFixed(2)}</p>
          <p className="text-green-600 text-xs mt-1">All completed</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 text-sm">Total Transactions</p>
            <CreditCard className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{mockTransactions.length}</p>
          <p className="text-blue-600 text-xs mt-1">All time</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 text-sm">Pending</p>
            <Clock className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{pendingTransactions.length}</p>
          <p className="text-yellow-600 text-xs mt-1">Awaiting completion</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 text-sm">Disputes</p>
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{disputedTransactions.length}</p>
          <p className="text-red-600 text-xs mt-1">Requires attention</p>
        </div>
      </div>

      {/* Disputed Transactions */}
      {disputedTransactions.length > 0 && (
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Disputed Transactions
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {disputedTransactions.map((transaction) => (
              <div key={transaction.id} className="p-6 bg-red-50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {transaction.description}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Project: {transaction.projectTitle}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>From:</strong> {transaction.fromUserName} → <strong>To:</strong>{' '}
                      {transaction.toUserName}
                    </p>
                    {transaction.disputeReason && (
                      <div className="mt-2 p-3 bg-white border border-red-200 rounded">
                        <p className="text-sm text-red-900">
                          <strong>Reason:</strong> {transaction.disputeReason}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">
                      ${transaction.amount.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleResolveDispute(transaction.id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm"
                  >
                    Resolve in Favor of Freelancer
                  </button>
                  <button
                    onClick={() => handleResolveDispute(transaction.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
                  >
                    Refund Customer
                  </button>
                  <button
                    onClick={() => handleResolveDispute(transaction.id)}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition text-sm"
                  >
                    Request More Info
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Transactions */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">All Transactions</h2>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as TransactionStatus | 'all')}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="disputed">Disputed</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  From / To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    {transaction.projectTitle && (
                      <p className="text-sm text-gray-600">{transaction.projectTitle}</p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <p>{transaction.fromUserName}</p>
                    <p className="text-gray-500">→ {transaction.toUserName}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">
                      ${transaction.amount.toFixed(2)}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded ${
                        transaction.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : transaction.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : transaction.status === 'disputed'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
