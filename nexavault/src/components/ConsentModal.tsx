import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { type ThirdPartyRequest } from '../api/dashboard';

interface ConsentModalProps {
  request: ThirdPartyRequest;
  onApprove: (requestId: string, approvedFields: string[], queryLimit: number) => Promise<void>;
  onReject: (requestId: string, reason: string) => Promise<void>;
  onClose: () => void;
}

const ConsentModal = ({ request, onApprove, onReject, onClose }: ConsentModalProps) => {
  const [selectedFields, setSelectedFields] = useState<string[]>(request.suggestedFields ?? []);
  const [queryLimit, setQueryLimit] = useState(10);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFieldToggle = (field: string) => {
    setSelectedFields(prev =>
      prev.includes(field)
        ? prev.filter(f => f !== field)
        : [...prev, field]
    );
  };

  const handleApprove = async () => {
    if (selectedFields.length === 0) return;

    try {
      setLoading(true);
      setError(null);
      await onApprove(request.id, selectedFields, queryLimit);
    } catch (err) {
      console.error('Approve error:', err);
      setError('Failed to approve request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setLoading(true);
      setError(null);
      await onReject(request.id, rejectionReason);
    } catch (err) {
      console.error('Reject error:', err);
      setError('Failed to reject request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fieldDescriptions: { [key: string]: string } = {
    salary: 'Monthly salary information',
    creditScore: 'Credit score and rating',
    emiHistory: 'EMI payment history and current obligations',
    accountBalance: 'Current account balance',
    loanHistory: 'Past and current loan information',
    transactionHistory: 'Recent transaction patterns',
    investmentPortfolio: 'Investment holdings and portfolio'
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Data Access Request</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Service Info */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">{request.serviceName}</h3>
              <p className="text-blue-800 text-sm mb-3">{request.description}</p>
              <div className="flex items-center text-sm text-blue-700">
                <Clock className="h-4 w-4 mr-1" />
                Use case: {request.useCase}
              </div>
            </div>

            {/* Field Selection */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Select Data to Share</h4>
              <div className="space-y-3">
                {request.requestedFields.map((field) => (
                  <div
                    key={field}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedFields.includes(field)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleFieldToggle(field)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                            selectedFields.includes(field)
                              ? 'bg-blue-500 border-blue-500'
                              : 'border-gray-300'
                          }`}
                        >
                          {selectedFields.includes(field) && (
                            <CheckCircle className="h-3 w-3 text-white" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 capitalize">{field}</div>
                          <div className="text-sm text-gray-600">{fieldDescriptions[field]}</div>
                        </div>
                      </div>
                      {(request.suggestedFields?.includes(field)) && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          Suggested
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Query Limit */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Query Limit</h4>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={queryLimit}
                  onChange={(e) => setQueryLimit(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm font-medium text-gray-900 w-16">
                  {queryLimit} queries
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Maximum number of queries this service can make
              </p>
            </div>

            {/* Privacy Notice */}
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h5 className="font-medium text-yellow-900">Privacy Protection</h5>
                  <p className="text-sm text-yellow-800 mt-1">
                    Your data will be tokenized and abstracted. The service will receive general insights,
                    not your exact financial details.
                  </p>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-4">
                {error}
              </div>
            )}

            {/* Actions */}
            {!showRejectForm ? (
              <div className="flex space-x-3">
                <button
                  onClick={handleApprove}
                  disabled={loading || selectedFields.length === 0}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Approving...' : 'Approve Request'}
                </button>
                <button
                  onClick={() => setShowRejectForm(true)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Reject Request
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Reason for rejection (optional)"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
                <div className="flex space-x-3">
                  <button
                    onClick={handleReject}
                    disabled={loading}
                    className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Rejecting...' : 'Confirm Rejection'}
                  </button>
                  <button
                    onClick={() => setShowRejectForm(false)}
                    disabled={loading}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ConsentModal;
