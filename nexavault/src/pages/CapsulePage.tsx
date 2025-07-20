import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader, Shield, Clock, MapPin, MessageSquare, Copy } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getCapsuleDetails, queryCapsule, type CapsuleDetails } from '../api/capsule';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

const CapsulePage = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const [capsule, setCapsule] = useState<CapsuleDetails | null>(null);
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const lastResponseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) loadCapsuleDetails();
  }, [id]);

  useEffect(() => {
    if (lastResponseRef.current) {
      lastResponseRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [capsule?.logs.length]);

  useEffect(() => {
    const interval = setInterval(() => loadCapsuleDetails(), 60000);
    return () => clearInterval(interval);
  }, []);

  const loadCapsuleDetails = async () => {
    try {
      const details = await getCapsuleDetails(token!, id!);
      console.log('🧪 Capsule Details:', details);
      setCapsule(details);
    } catch (error) {
      console.error('❌ Failed to load capsule:', error);
      toast.error('Failed to load capsule details');
    }
  };

  const handleQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    setResponse(null);
    setConfidence(null);

    try {
      const result = await queryCapsule(token!, id!, question);
      console.log('📩 Query Result:', result);
      setResponse(result.answer);
      setConfidence(result.confidence);
      setCapsule(prev =>
        prev ? { ...prev, queriesLeft: result.queriesLeft } : null
      );
      setQuestion('');
    } catch (error: any) {
      console.error('❌ Query failed:', error);
      toast.error(error.response?.data?.error || 'Query failed');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Response copied!');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'suspended': return 'text-orange-600 bg-orange-100';
      case 'blocked': return 'text-red-600 bg-red-100';
      case 'revoked': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!capsule) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">
            {capsule.serviceName} Capsule
          </h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(capsule.status)}`}>
            {capsule.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border">
            <div className="text-2xl font-bold text-blue-600">{capsule.queriesLeft}</div>
            <div className="text-sm text-gray-600">Queries Left</div>
          </div>
          <div className="bg-white rounded-lg p-4 border">
            <div className="text-2xl font-bold text-green-600">{capsule.daysToExpiry}</div>
            <div className="text-sm text-gray-600">Days to Expiry</div>
          </div>
          <div className="bg-white rounded-lg p-4 border">
            <div className="text-2xl font-bold text-indigo-600">{capsule.approvedFields.length}</div>
            <div className="text-sm text-gray-600">Approved Fields</div>
          </div>
          <div className="bg-white rounded-lg p-4 border">
            <div className="text-2xl font-bold text-purple-600">{capsule.logs.length}</div>
            <div className="text-sm text-gray-600">Total Queries</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {capsule.approvedFields.map((field) => (
            <span key={field} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
              {field}
            </span>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl border p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <MessageSquare className="h-5 w-5 mr-2" />
          Ask a Question
        </h2>
        <form onSubmit={handleQuery} className="space-y-4">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about your approved financial data..."
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
            disabled={capsule.status !== 'active' || capsule.queriesLeft <= 0}
          />

          <button
            type="submit"
            disabled={!question.trim() || isLoading || capsule.status !== 'active' || capsule.queriesLeft <= 0}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Send className="h-5 w-5" />
                <span>Send Query</span>
              </>
            )}
          </button>
        </form>

        <AnimatePresence>
          {response && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-gray-50 rounded-lg"
              ref={lastResponseRef}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Response</span>
                <div className="flex items-center space-x-3">
                  {confidence && (
                    <span className="text-xs text-gray-500">
                      Confidence: {Math.round(confidence * 100)}%
                    </span>
                  )}
                  <button
                    onClick={() => copyToClipboard(response)}
                    className="text-gray-400 hover:text-gray-600"
                    title="Copy to clipboard"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="text-gray-900 whitespace-pre-line">{response}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Query History</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {capsule.logs.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No queries yet. Ask your first question above!
            </div>
          ) : (
            capsule.logs.map((log, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-6"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>{formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}</span>
                    {log.location && (
                      <>
                        <MapPin className="h-4 w-4 ml-4" />
                        <span>{log.location}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Question:</div>
                    <div className="text-gray-900">{log.question}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Response:</div>
                    <div className="text-gray-900 bg-gray-50 p-3 rounded-lg whitespace-pre-line">{log.response}</div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CapsulePage;
