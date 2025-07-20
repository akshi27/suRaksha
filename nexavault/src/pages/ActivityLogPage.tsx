// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { Search, Filter, Download, AlertTriangle, Shield, Clock, MapPin, ChevronDown, ChevronUp, MoreHorizontal, ArrowUpDown, Columns } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';
// import { getDashboardData, type DashboardData } from '../api/dashboard';
// import { Link } from 'react-router-dom';
// import { formatDistanceToNow } from 'date-fns';

// const ActivityLogPage = () => {
//   const { token } = useAuth();
//   const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [loading, setLoading] = useState(true);
//   const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
//   const [showAlert, setShowAlert] = useState(true);

//   useEffect(() => {
//     loadDashboardData();
//   }, []);

//   const loadDashboardData = async () => {
//     try {
//       const data = await getDashboardData(token!);
//       setDashboardData(data);
//     } catch (error) {
//       console.error('Failed to load dashboard data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleRowExpansion = (capsuleId: string) => {
//     const newExpanded = new Set(expandedRows);
//     if (newExpanded.has(capsuleId)) {
//       newExpanded.delete(capsuleId);
//     } else {
//       newExpanded.add(capsuleId);
//     }
//     setExpandedRows(newExpanded);
//   };

//   const handleBlock = (capsuleId: string) => {
//     console.log(`Block capsule: ${capsuleId}`);
//     // TODO: call block API here
//   };

//   const handleSuspend = (capsuleId: string) => {
//     console.log(`Suspend capsule: ${capsuleId}`);
//     // TODO: call suspend API here
//   };

//   const handleRevoke = (capsuleId: string) => {
//     console.log(`Revoke capsule: ${capsuleId}`);
//     // TODO: call revoke API here
//   };

//   const getStatusColor = (status: string) => {
//     switch (status.toLowerCase()) {
//       case 'active': return 'text-green-600 bg-green-100';
//       case 'suspended': return 'text-red-600 bg-red-100';
//       case 'blocked': return 'text-gray-600 bg-gray-100';
//       case 'revoked': return 'text-gray-600 bg-gray-100';
//       default: return 'text-gray-600 bg-gray-100';
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status.toLowerCase()) {
//       case 'active': return Shield;
//       case 'suspended': return AlertTriangle;
//       case 'blocked': return AlertTriangle;
//       default: return Shield;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   const mockLogs = dashboardData?.logs || [];

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       {showAlert && (
//         <motion.div
//           initial={{ opacity: 0, x: 300 }}
//           animate={{ opacity: 1, x: 0 }}
//           className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between"
//         >
//           <div className="flex items-center space-x-3">
//             <AlertTriangle className="h-5 w-5 text-red-600" />
//             <span className="text-red-800">LendEase data capsule access has been terminated.</span>
//             <Link to="/activity-log" className="text-red-600 hover:text-red-700 underline text-sm">
//               Live Activity Log
//             </Link>
//           </div>
//           <button
//             onClick={() => setShowAlert(false)}
//             className="text-red-600 hover:text-red-700"
//             aria-label="Dismiss alert"
//           >
//             {'×'}
//           </button>
//         </motion.div>
//       )}

//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="mb-8"
//       >
//         <h1 className="text-2xl font-bold text-gray-900 mb-2">Live Activity Log</h1>
//       </motion.div>

//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.1 }}
//         className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6"
//       >
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-4">
//             <button className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
//               <ArrowUpDown className="h-4 w-4" />
//               <span>Sort</span>
//             </button>
//             <button className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
//               <Columns className="h-4 w-4" />
//               <span>Columns</span>
//             </button>
//             <button className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
//               <Filter className="h-4 w-4" />
//               <span>Filter</span>
//             </button>
//             <button className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
//               <Download className="h-4 w-4" />
//               <span>Download</span>
//             </button>
//           </div>
//         </div>
//       </motion.div>

//       {/* Render table... unchanged layout */}
//       {/* Replace buttons in Actions column like this: */}
//       {/* <button onClick={() => handleBlock(log.capsuleId)} ...>Block</button> */}
//       {/* etc. */}
//     </div>
//   );
// };

// export default ActivityLogPage;
