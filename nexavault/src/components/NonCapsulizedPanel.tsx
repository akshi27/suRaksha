// 'use client';

// import { useEffect, useRef, useState } from 'react';
// import * as faceapi from '@vladmandic/face-api';
// import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
// import { Button } from './ui/button';
// import { X } from 'lucide-react';
// import { motion } from 'framer-motion';
// import { Input } from './ui/input';
// import { ScrollArea } from './ui/scroll-area';
// import { shouldAllowNonCapAccess, setSimulateAccessKeyword } from '../utils/simulations/simulateNonCap';
// // Removed: import { encryptedapprovedServices } from '../pages/ApprovedPage'; // This import caused the error

// // Define a type for the customer data, including both encrypted and decrypted fields
// interface CustomerData {
//   name: string;
//   email: string;
//   phone: string;
//   dateOfBirth?: string;
//   [key: string]: any; // Allow for arbitrary properties
// }

// interface EncryptedCustomerData {
//   encryptedName: string;
//   encryptedEmail: string;
//   encryptedPhone: string;
//   [key: string]: any; // Allow for arbitrary encrypted properties
// }

// interface Props {
//   isOpen: boolean;
//   onClose: () => void;
//   serviceName: string;
//   useCase: string;
//   customers: CustomerData[]; // Decrypted customer data for filtering
//   encryptedCustomers: EncryptedCustomerData[]; // Encrypted customer data for display/download
//   requestedFields: string[];
// }

// // Helper to map display field names to actual customer object keys (camelCase)
// const fieldKeyMap: { [key: string]: string } = {
//   'Full name': 'name',
//   'Date of birth': 'dateOfBirth',
//   'PAN': 'pan',
//   'Aadhaar number': 'aadhaar',
//   'Credit score': 'creditScore',
//   'Monthly average balance': 'monthlyAverageBalance',
//   'Employment status': 'employmentStatus',
//   'Income details': 'incomeDetails',
//   'Account holder name': 'name',
//   'IFSC code': 'ifscCode',
//   'Bank name': 'bankName',
//   'Account type': 'accountType',
//   'Transaction reference no.': 'transactionReferenceNo',
//   'Account number': 'accountNumber',
//   'Mobile numbers (linked)': 'phone',
//   'Balance inquiry': 'balance',
//   'Email IDs (linked)': 'email',
//   'CIF / Customer ID': 'cif',
//   'All linked account numbers': 'linkedAccounts',
//   'Account type (linked)': 'accountTypeLinked',
//   'Demographics (name, DOB, gender, address)': 'demographics',
//   'Financial history (income, investments, loans)': 'financialHistory',
//   'Credit report summary': 'creditReportSummary',
//   'Policy type requested': 'policyTypeRequested',
//   'Address': 'address',
//   'Nominee details': 'nomineeDetails',
//   'Health records summary': 'healthRecordsSummary',
//   'Existing insurance policies': 'existingInsurancePolicies',
//   'Investment portfolio value': 'investmentPortfolioValue',
//   'Bank account number': 'bankAccountNumber',
//   'Investment account ID': 'investmentAccountId',
//   'Transaction history (investment)': 'transactionHistoryInvestment',
//   'Portfolio holdings': 'portfolioHoldings',
//   'Capital gains/losses': 'capitalGainsLosses',
//   'Risk profile assessment': 'riskProfile',
//   'Income source details': 'incomeSourceDetails',
//   'Assessment Year': 'assessmentYear',
//   'Salary slips/Form 16': 'salarySlips',
//   'TDS details': 'tdsDetails',
//   'Loan interest certificates': 'loanInterestCertificates',
//   'Property address': 'propertyAddress',
//   'Current residential address': 'address',
//   'Employment details': 'employmentDetails',
//   'Existing loan details': 'existingLoanDetails',
//   'Bank statements (last 12 months)': 'bankStatements',
//   'Income tax returns (last 3 years)': 'incomeTaxReturns',
//   'Existing liabilities (loans, credit cards)': 'existingLiabilities',
//   'Property valuation reports': 'propertyValuationReports',
//   'Wallet ID': 'walletId',
//   'Transaction timestamp': 'transactionTimestamp',
//   'Wallet transaction history': 'walletTransactionHistory',
//   'Available wallet balance': 'availableWalletBalance',
//   'Linked bank account number (masked)': 'linkedBankAccountNumber',
//   'Linked bank account number': 'linkedBankAccountNumber',
//   'UPI ID': 'upiId',
// };


// // Helper function to mask sensitive data (copied from ApprovedPage to keep logic consistent)
// const maskData = (field: string, value: any): string => {
//   if (value === undefined || value === null || value === '') return 'N/A';
//   const strValue = String(value);

//   switch (field) {
//     case 'Account number':
//     case 'Bank account number':
//     case 'Linked bank account number (masked)':
//     case 'Linked bank account number':
//       if (strValue.length > 8) {
//         const visibleStart = strValue.substring(0, 2);
//         const visibleEnd = strValue.substring(strValue.length - 4);
//         const maskedPart = 'x'.repeat(strValue.length - 6);
//         return `${visibleStart}${maskedPart}${visibleEnd}`;
//       }
//       return 'xxxx';
//     case 'Mobile numbers (linked)':
//       if (strValue.length > 7) {
//         const countryCode = strValue.substring(0, 4);
//         const visibleEnd = strValue.substring(strValue.length - 4);
//         const maskedPartLength = strValue.length - countryCode.length - visibleEnd.length;
//         const maskedPart = 'x'.repeat(maskedPartLength);
//         return `${countryCode}${maskedPart}${visibleEnd}`;
//       }
//       return 'xxxxxxxxx';
//     case 'PAN':
//       if (strValue.length >= 6) {
//         const visibleStart = strValue.substring(0, 2);
//         const visibleEnd = strValue.substring(strValue.length - 1);
//         const maskedPart = 'x'.repeat(strValue.length - 3);
//         return `${visibleStart}${maskedPart}${visibleEnd}`;
//       }
//       return 'xxxxxx';
//     case 'Aadhaar number':
//       if (strValue.length === 12) {
//         return `xxxx xxxx ${strValue.substring(8)}`;
//       }
//       return 'xxxx xxxx xxxx';
//     case 'Email IDs linked':
//     case 'email':
//       const atIndex = strValue.indexOf('@');
//       if (atIndex > 1) {
//         const username = strValue.substring(0, atIndex);
//         const domain = strValue.substring(atIndex);
//         const maskedUsername = username[0] + 'x'.repeat(username.length - 1);
//         return `${maskedUsername}${domain}`;
//       }
//       return 'x@x.com';
//     case 'Address':
//       const addressParts = strValue.split(', ');
//       if (addressParts.length >= 3) {
//         const maskedStreetNum = 'x'.repeat(addressParts[0].length);
//         const maskedCity = 'x'.repeat(addressParts[1].length);
//         return `${maskedStreetNum}, ${addressParts[0].split(' ')[1]} ${addressParts[0].split(' ')[2]}, ${maskedCity}, ${addressParts[2]}`;
//       }
//       return 'xxxxxxx';
//     case 'CIF / Customer ID':
//       if (strValue.length > 3) {
//         const prefix = strValue.substring(0, 3);
//         const maskedPart = 'x'.repeat(strValue.length - 3);
//         return `${prefix}${maskedPart}`;
//       }
//       return 'xxxx';
//     case 'All linked account numbers':
//     case 'linkedAccounts':
//       if (Array.isArray(value)) {
//         return value.map(acc => {
//           const accStr = String(acc);
//           if (accStr.length > 4) {
//             return 'x'.repeat(accStr.length - 4) + accStr.slice(-4);
//           }
//           return 'xxxx';
//         }).join(', ');
//       }
//       return 'xxxx';
//     case 'UPI ID':
//       const upiParts = strValue.split('@');
//       if (upiParts.length === 2 && upiParts[0].length > 1) {
//         const maskedUsername = upiParts[0][0] + 'x'.repeat(upiParts[0].length - 1);
//         return `${maskedUsername}@${upiParts[1]}`;
//       }
//       return 'x@x';
//     default:
//       return strValue;
//   }
// };

// // Helper function to decrypt a Base64 encrypted value (assuming the same encryption logic as in ApprovedPage)
// const decryptValue = (encryptedValue: string): string => {
//   try {
//     const decoded = atob(encryptedValue);
//     // Remove the salt if present
//     const saltPrefix = '__SALT__1234__';
//     const saltSuffix = '__SALT_END__';
//     if (decoded.startsWith(saltPrefix) && decoded.endsWith(saltSuffix)) {
//       return decoded.substring(saltPrefix.length, decoded.length - saltSuffix.length);
//     }
//     return decoded; // Return as is if salt not found
//   } catch (e) {
//     console.error("Decryption failed:", e);
//     return encryptedValue; // Return original if decryption fails
//   }
// };


// export default function NonCapsulizedPanel({
//   isOpen,
//   onClose,
//   serviceName,
//   useCase,
//   customers, // Decrypted customers for filtering
//   encryptedCustomers, // Encrypted customers for initial display/download
//   requestedFields
// }: Props) {
//   const [faceVerified, setFaceVerified] = useState(false);
//   const [status, setStatus] = useState('Initializing...');
//   const [simulateResult, setSimulateResult] = useState<string | null>(null);
//   const [query, setQuery] = useState('');
//   const [generatedPassword] = useState('1234'); // Static for now

//   const videoRef = useRef<HTMLVideoElement>(null);
//   const idleTimer = useRef<NodeJS.Timeout | null>(null);

//   // Determine headers for the table based on requested fields and common fields
//   const getTableHeaders = () => {
//     let headers: string[] = ['Name', 'Email', 'Phone']; // Base columns for all services

//     // Add service-specific columns based on the use case
//     switch (useCase) {
//       case 'Lending App':
//         headers = [...headers, 'Full name', 'Date of birth', 'PAN', 'Aadhaar number', 'Mobile numbers (linked)', 'Bank account number'];
//         break;
//       case 'Account Aggregator':
//         headers = [...headers, 'Consent timestamp/status', 'CIF / Customer ID', 'All linked account numbers', 'Date of birth'];
//         break;
//       case 'Investment Platform':
//         headers = [...headers, 'Full name', 'PAN', 'Mobile numbers (linked)', 'Email IDs linked', 'Bank account number', 'Date of birth'];
//         break;
//       case 'Digital Wallet Service':
//         headers = [...headers, 'Mobile numbers (linked)', 'Wallet ID', 'Transaction timestamp', 'Linked bank account number', 'Date of birth'];
//         break;
//       case 'UPI Payment App':
//         headers = [...headers, 'Account holder name', 'IFSC code', 'Account type', 'Transaction reference no.', 'Account number', 'Mobile numbers (linked)', 'Date of birth'];
//         break;
//       default:
//         break;
//     }
//     return Array.from(new Set(headers)); // Remove duplicates
//   };

//   const uniqueHeaders = getTableHeaders();

//   // Function to prepare data for the table, applying masking to relevant fields
//   const prepareTableData = (dataToProcess: CustomerData[]) => {
//     return dataToProcess.map(customer => {
//       const row: { [key: string]: any } = {};
//       uniqueHeaders.forEach(header => {
//         let value: any;
//         let isMasked = false;

//         // Determine the actual key in the customer object (decrypted customer)
//         let customerKey: string = fieldKeyMap[header] || header.replace(/ /g, '').toLowerCase();
//         value = customer[customerKey];

//         // Special handling for composite fields
//         if (header === 'Demographics (name, DOB, gender, address)') {
//           value = `${customer.name || 'N/A'}, ${customer.dateOfBirth || 'N/A'}, ${customer.gender || 'N/A'}, ${customer.address || 'N/A'}`;
//         } else if (header === 'Financial history (income, investments, loans)') {
//           value = `Income: ${customer.income || 'N/A'}, Inv: ${customer.investments || 'N/A'}, Loans: ${customer.loans || 'N/A'}`;
//         }

//         // Apply masking based on service type and header
//         // This logic should ideally match the masking rules in ApprovedPage
//         if (serviceName === 'QuickLoan' && ['PAN', 'Aadhaar number', 'Mobile numbers (linked)', 'Bank account number'].includes(header)) {
//           isMasked = true;
//         } else if (serviceName === 'DataBridge AA' && ['CIF / Customer ID', 'All linked account numbers'].includes(header)) {
//           isMasked = true;
//         } else if (serviceName === 'InvestSmart' && ['Mobile numbers (linked)', 'Email IDs linked'].includes(header)) {
//           isMasked = true;
//         } else if (serviceName === 'PaySwift Wallet' && ['Mobile numbers (linked)', 'Linked bank account number'].includes(header)) {
//           isMasked = true;
//         } else if (serviceName === 'Google Pay' && ['Account number', 'Mobile numbers (linked)'].includes(header)) {
//           isMasked = true;
//         }

//         row[header] = isMasked ? maskData(header, value) : value;
//       });
//       return row;
//     });
//   };

//   // Initial table data is based on the encryptedCustomers, but decrypted for display
//   const initialTableData = prepareTableData(
//     encryptedCustomers.map(encCust => {
//       const decCust: CustomerData = { name: '', email: '', phone: '' };
//       for (const key in encCust) {
//         if (key.startsWith('encrypted')) {
//           const decryptedKey = key.replace('encrypted', 'decrypted');
//           decCust[decryptedKey.charAt(0).toLowerCase() + decryptedKey.slice(1)] = decryptValue(encCust[key]);
//         } else {
//           // Handle cases where some fields might not be explicitly 'encrypted'
//           decCust[key] = decryptValue(encCust[key]);
//         }
//       }
//       return decCust;
//     })
//   );

//   const [filteredTableData, setFilteredTableData] = useState(initialTableData);


//   useEffect(() => {
//     setSimulateAccessKeyword('give');
//   }, []);

//   useEffect(() => {
//     const loadModels = async () => {
//       try {
//         await faceapi.nets.tinyFaceDetector.load('/models/tiny_face_detector_model-weights_manifest.json');
//         await faceapi.nets.faceLandmark68Net.load('/models/face_landmark_68_model-weights_manifest.json');
//         await faceapi.nets.faceRecognitionNet.load('/models/face_recognition_model-weights_manifest.json');

//         const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//         }

//         setStatus('📸 Align your face in the frame...');
//       } catch (err) {
//         console.error('Face API error:', err);
//         setStatus('❌ Webcam/model load failed.');
//       }
//     };

//     loadModels();

//     return () => {
//       if (videoRef.current?.srcObject) {
//         (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
//       }
//       if (idleTimer.current) clearTimeout(idleTimer.current);
//     };
//   }, []);

//   useEffect(() => {
//     if (faceVerified) {
//       idleTimer.current = setTimeout(() => {
//         setSimulateResult('🔍 Simulation complete: No anomalies found.');
//       }, 20000);
//     }
//     return () => {
//       if (idleTimer.current) clearTimeout(idleTimer.current);
//     };
//   }, [faceVerified]);

//   const handleVerify = () => {
//     if (shouldAllowNonCapAccess()) {
//       setFaceVerified(true);
//       setStatus('✅ Face verified & access granted!');
//     } else {
//       setStatus('❌ Face verified, but access is denied by simulation policy.');
//     }
//   };

//   const downloadEncryptedJSON = (svcName: string) => {
//     // We now have encryptedCustomers directly from props
//     const serviceData = {
//       service: svcName,
//       customers: encryptedCustomers, // Use the encrypted customers passed via props
//       // Add other service details if needed for the download JSON, e.g., useCase, requestedFields
//     };

//     const blob = new Blob([JSON.stringify(serviceData, null, 2)], { type: 'application/json' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = `${svcName.replace(/\s+/g, '_')}_encrypted.json`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   // Filtering logic now uses the decrypted 'customers' prop, then re-prepares for display
//   const handleFilterData = () => {
//     if (!query.trim()) {
//       setFilteredTableData(initialTableData); // Reset to initial masked data
//       return;
//     }

//     const lowerCaseQuery = query.toLowerCase();
//     const results = customers.filter(customer => { // Filter on decrypted customers
//       return Object.values(customer).some(value =>
//         String(value).toLowerCase().includes(lowerCaseQuery)
//       );
//     });
//     setFilteredTableData(prepareTableData(results)); // Re-mask filtered decrypted data for display
//   };

//   if (!isOpen) return null;

//   return (
//     <motion.div
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//     >
//       <Card className="w-[95vw] h-[85vh] bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden relative flex">
//         <Button className="absolute top-4 right-4 z-10" variant="ghost" onClick={onClose}>
//           <X />
//         </Button>

//         {/* LEFT SIDE: DATA */}
//         <div className="w-2/3 border-r border-gray-300 dark:border-gray-700 p-4">
//           {!faceVerified ? (
//             <div className="flex flex-col items-center justify-center h-full">
//               <video ref={videoRef} autoPlay muted playsInline className="rounded border mb-4" />
//               <p>{status}</p>
//               <Button onClick={handleVerify} className="mt-2">🔍 Scan Face</Button>
//             </div>
//           ) : (
//             <>
//               <CardHeader>
//                 <CardTitle>{serviceName} — {useCase}</CardTitle>
//                 <p className="text-sm text-green-600">{status}</p>
//                 {simulateResult && <p className="text-xs text-indigo-500 mt-2">{simulateResult}</p>}
//               </CardHeader>
//               <ScrollArea className="h-[65vh] overflow-auto mt-2">
//                 <table className="min-w-full text-sm text-left border-collapse border border-gray-300 dark:border-gray-600">
//                   <thead className="sticky top-0 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
//                     <tr>
//                       {uniqueHeaders.map((header) => (
//                         <th key={header} className="border px-3 py-2">{header}</th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredTableData.map((customerRow, index) => ( // Use customerRow here as it's already processed
//                       <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
//                         {uniqueHeaders.map((header) => (
//                           <td key={header} className="border px-3 py-2">
//                             {customerRow[header] ?? '-'}
//                           </td>
//                         ))}
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </ScrollArea>
//             </>
//           )}
//         </div>

//         {/* RIGHT SIDE: ACTIONS */}
//         <div className="w-1/3 p-4 flex flex-col gap-4">
//           <CardHeader>
//             <CardTitle>Actions</CardTitle>
//           </CardHeader>

//           <CardContent>
//             <p className="text-sm mb-1">Filter (e.g., Income {'>'} 50000):</p>
//             <Input
//               placeholder="Type query..."
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               className="mb-2"
//             />

//             <div className="mt-4 flex justify-end">
//               <button
//                 className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-md"
//                 onClick={() => downloadEncryptedJSON(serviceName)}
//               >
//               📥 Download Encrypted File
//               </button>
//             </div>

//             {/* <Button
//               variant="outline"
//               onClick={() => {
//                 const script = generateDecryptScript(generatedPassword);
//                 const blob = new Blob([script], { type: 'text/javascript' });
//                 const link = document.createElement('a');
//                 link.href = URL.createObjectURL(blob);
//                 link.download = `decrypt_script.js`;
//                 localStorage.setItem('capsuleDecryptFileUrl', link.href); // 👈 store it
//                 link.click();
//               }}
//             >
//               📜 Download Decrypt Script
//             </Button> */}

//             <p className="text-xs text-gray-500 dark:text-gray-400 italic mt-1">
//               🔐 Decryption password sent to your email. <br />(For now: <span className="font-mono text-green-600">1234</span>)
//             </p>
//           </CardContent>
//         </div>
//       </Card>
//     </motion.div>
//   );
// }

'use client';

import { useEffect, useRef, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { shouldAllowNonCapAccess, setSimulateAccessKeyword } from '../utils/simulations/simulateNonCap';
// IMPORTANT: Import types and fieldAccessMatrix from ApprovedPage.types
import { UseCaseType, fieldAccessMatrix, Customer as DecryptedCustomerType, EncryptedCustomer } from '../pages/ApprovedPage.types.ts';

type CustomerDataForDisplay = {
  [field: string]: string | number | null | undefined;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
  useCase: UseCaseType; // Use the imported UseCaseType
  customers: DecryptedCustomerType[]; // Decrypted customer data for filtering
  encryptedCustomers: EncryptedCustomer[]; // Encrypted customer data for display/download
  requestedFields: string[];
}

// Helper to map display field names to actual customer object keys (camelCase)
const fieldKeyMap: { [key: string]: string } = {
  'Full name': 'decryptedName', // Use decrypted prefix for mapping
  'Date of birth': 'decryptedDateOfBirth',
  'PAN': 'decryptedPan',
  'Aadhaar number': 'decryptedAadhaar',
  'Credit score': 'decryptedCreditScore',
  'Monthly average balance': 'decryptedMonthlyAverageBalance',
  'Employment status': 'decryptedEmploymentStatus',
  'Income details': 'decryptedIncome',
  'Account holder name': 'decryptedName',
  'IFSC code': 'decryptedIfscCode',
  'Bank name': 'decryptedBankName',
  'Account type': 'decryptedAccountType',
  'Transaction reference no.': 'decryptedTransactionReferenceNo',
  'Account number': 'decryptedAccountNumber',
  'Mobile numbers (linked)': 'decryptedPhone',
  'Balance inquiry': 'decryptedBalance',
  'Email IDs (linked)': 'decryptedEmail',
  'CIF / Customer ID': 'decryptedCif',
  'All linked account numbers': 'decryptedLinkedAccounts',
  'Account type (linked)': 'decryptedAccountTypeLinked',
  'Demographics (name, DOB, gender, address)': 'decryptedDemographics', // Composite field
  'Financial history (income, investments, loans)': 'decryptedFinancialHistory', // Composite field
  'Credit report summary': 'decryptedCreditReportSummary',
  'Policy type requested': 'decryptedPolicyTypeRequested',
  'Address': 'decryptedAddress',
  'Nominee details': 'decryptedNomineeDetails',
  'Health records summary': 'decryptedHealthRecordsSummary',
  'Existing insurance policies': 'decryptedExistingInsurancePolicies',
  'Investment portfolio value': 'decryptedInvestmentPortfolioValue',
  'Bank account number': 'decryptedBankAccountNumber',
  'Investment account ID': 'decryptedInvestmentAccountId',
  'Transaction history (investment)': 'decryptedTransactionHistoryInvestment',
  'Portfolio holdings': 'decryptedPortfolioHoldings',
  'Capital gains/losses': 'decryptedCapitalGainsLosses',
  'Risk profile assessment': 'decryptedRiskProfile',
  'Income source details': 'decryptedIncomeSourceDetails',
  'Assessment Year': 'decryptedAssessmentYear',
  'Salary slips/Form 16': 'decryptedSalarySlips',
  'TDS details': 'decryptedTdsDetails',
  'Loan interest certificates': 'decryptedLoanInterestCertificates',
  'Property address': 'decryptedPropertyAddress',
  'Current residential address': 'decryptedAddress', // Re-use address for current residential
  'Employment details': 'decryptedEmploymentDetails',
  'Existing loan details': 'decryptedExistingLoanDetails',
  'Bank statements (last 12 months)': 'decryptedBankStatements',
  'Income tax returns (last 3 years)': 'decryptedIncomeTaxReturns',
  'Existing liabilities (loans, credit cards)': 'decryptedExistingLiabilities',
  'Property valuation reports': 'decryptedPropertyValuationReports',
  'Wallet ID': 'decryptedWalletId',
  'Transaction timestamp': 'decryptedTransactionTimestamp',
  'Wallet transaction history': 'decryptedWalletTransactionHistory',
  'Available wallet balance': 'decryptedAvailableWalletBalance',
  'Linked bank account number (masked)': 'decryptedLinkedBankAccountNumber',
  'Linked bank account number': 'decryptedLinkedBankAccountNumber',
  'UPI ID': 'decryptedUpiId',
};


// Helper function to mask sensitive data (copied from ApprovedPage to keep logic consistent)
const maskData = (field: string, value: any): string => {
  if (value === undefined || value === null || value === '') return 'N/A';
  const strValue = String(value);

  switch (field) {
    case 'Account number':
    case 'Bank account number':
    case 'Linked bank account number (masked)':
    case 'Linked bank account number':
      if (strValue.length > 8) {
        const visibleStart = strValue.substring(0, 2);
        const visibleEnd = strValue.substring(strValue.length - 4);
        const maskedPart = 'x'.repeat(strValue.length - 6);
        return `${visibleStart}${maskedPart}${visibleEnd}`;
      }
      return 'xxxx';
    case 'Mobile numbers (linked)':
      if (strValue.length > 7) {
        const countryCode = strValue.substring(0, 4);
        const visibleEnd = strValue.substring(strValue.length - 4);
        const maskedPartLength = strValue.length - countryCode.length - visibleEnd.length;
        const maskedPart = 'x'.repeat(maskedPartLength);
        return `${countryCode}${maskedPart}${visibleEnd}`;
      }
      return 'xxxxxxxxx';
    case 'PAN':
      if (strValue.length >= 6) {
        const visibleStart = strValue.substring(0, 2);
        const visibleEnd = strValue.substring(strValue.length - 1);
        const maskedPart = 'x'.repeat(strValue.length - 3);
        return `${visibleStart}${maskedPart}${visibleEnd}`;
      }
      return 'xxxxxx';
    case 'Aadhaar number':
      if (strValue.length === 12) {
        return `xxxx xxxx ${strValue.substring(8)}`;
      }
      return 'xxxx xxxx xxxx';
    case 'Email IDs linked':
    case 'email':
      const atIndex = strValue.indexOf('@');
      if (atIndex > 1) {
        const username = strValue.substring(0, atIndex);
        const domain = strValue.substring(atIndex);
        const maskedUsername = username[0] + 'x'.repeat(username.length - 1);
        return `${maskedUsername}${domain}`;
      }
      return 'x@x.com';
    case 'Address':
      const addressParts = strValue.split(', ');
      if (addressParts.length >= 3) {
        const maskedStreetNum = 'x'.repeat(addressParts[0].length);
        const maskedCity = 'x'.repeat(addressParts[1].length);
        return `${maskedStreetNum}, ${addressParts[0].split(' ')[1]} ${addressParts[0].split(' ')[2]}, ${maskedCity}, ${addressParts[2]}`;
      }
      return 'xxxxxxx';
    case 'CIF / Customer ID':
      if (strValue.length > 3) {
        const prefix = strValue.substring(0, 3);
        const maskedPart = 'x'.repeat(strValue.length - 3);
        return `${prefix}${maskedPart}`;
      }
      return 'xxxx';
    case 'All linked account numbers':
    case 'linkedAccounts':
      if (Array.isArray(value)) {
        return value.map(acc => {
          const accStr = String(acc);
          if (accStr.length > 4) {
            return 'x'.repeat(accStr.length - 4) + accStr.slice(-4);
          }
          return 'xxxx';
        }).join(', ');
      }
      return 'xxxx';
    case 'UPI ID':
      const upiParts = strValue.split('@');
      if (upiParts.length === 2 && upiParts[0].length > 1) {
        const maskedUsername = upiParts[0][0] + 'x'.repeat(upiParts[0].length - 1);
        return `${maskedUsername}@${upiParts[1]}`;
      }
      return 'x@x';
    default:
      return strValue;
  }
};

// Helper function to decrypt a Base64 encrypted value (assuming the same encryption logic as in ApprovedPage)
const decryptValue = (encryptedValue: string): string => {
  try {
    const decoded = atob(encryptedValue);
    const saltPrefix = '__SALT__1234__';
    const saltSuffix = '__SALT_END__';
    if (decoded.startsWith(saltPrefix) && decoded.endsWith(saltSuffix)) {
      return decoded.substring(saltPrefix.length, decoded.length - saltSuffix.length);
    }
    return decoded;
  } catch (e) {
    console.error("Decryption failed:", e);
    return encryptedValue;
  }
};

// Helper function to calculate age
const calculateAge = (dateOfBirth: string): number => {
  const dob = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
  }
  return age;
};


export function NonCapsulizedPanel({
  isOpen,
  onClose,
  serviceName,
  useCase,
  customers, // Decrypted customer data for filtering
  encryptedCustomers, // Encrypted customer data for display/download
  requestedFields
}: Props) {
  const [faceVerified, setFaceVerified] = useState(false);
  const [status, setStatus] = useState('Initializing...');
  const [simulateResult, setSimulateResult] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [generatedPassword] = useState('1234'); // Static for now

  const videoRef = useRef<HTMLVideoElement>(null);
  const idleTimer = useRef<NodeJS.Timeout | null>(null);

  // Determine headers for the table based on requested fields and common fields
  const getTableHeaders = () => {
    let headers: string[] = ['Name', 'Email', 'Phone'];
    // Add requested fields that are not already in the base headers
    requestedFields.forEach(field => {
      if (!headers.includes(field)) {
        headers.push(field);
      }
    });
    // Add 'Age' if 'Date of birth' is present and not already added
    if (headers.includes('Date of birth') && !headers.includes('Age')) {
      headers.push('Age');
    }
    return Array.from(new Set(headers));
  };

  const uniqueHeaders = getTableHeaders();

  // Function to prepare data for the table, applying masking to relevant fields
  // This function now takes EncryptedCustomer[] as input and processes them for display
  const prepareTableDataForDisplay = (dataToProcess: EncryptedCustomer[], currentUseCase: UseCaseType): CustomerDataForDisplay[] => {
    return dataToProcess.map(encryptedCustomer => {
      const row: CustomerDataForDisplay = {};
      uniqueHeaders.forEach(header => {
        let value: any;
        let isMasked = false;

        // Determine the key in the decrypted customer object based on the header
        let decryptedKeyName = fieldKeyMap[header];

        // If the header is 'Age', calculate it from 'decryptedDateOfBirth'
        if (header === 'Age' && encryptedCustomer.decryptedDateOfBirth) {
          value = calculateAge(encryptedCustomer.decryptedDateOfBirth);
        } else if (decryptedKeyName && encryptedCustomer.hasOwnProperty(decryptedKeyName)) {
            // Access the decrypted value directly if available
            value = encryptedCustomer[decryptedKeyName];
        } else {
            // Fallback to encrypted value if decrypted not explicitly mapped or missing, then decrypt it
            const potentialEncryptedKey = `encrypted${header.replace(/ /g, '')}`;
            const camelCaseEncryptedKey = potentialEncryptedKey.charAt(0).toLowerCase() + potentialEncryptedKey.slice(1);

            if (encryptedCustomer.hasOwnProperty(camelCaseEncryptedKey)) {
                value = decryptValue(encryptedCustomer[camelCaseEncryptedKey]);
            } else {
                // Try to find a decrypted version by converting the header to camelCase
                const headerAsCamelCase = header.replace(/[^a-zA-Z0-9]+(.)?/g, (match, chr) => chr ? chr.toUpperCase() : '').replace(/^./, (match) => match.toLowerCase());
                if (encryptedCustomer.hasOwnProperty(`decrypted${headerAsCamelCase.charAt(0).toUpperCase() + headerAsCamelCase.slice(1)}`)) {
                  value = encryptedCustomer[`decrypted${headerAsCamelCase.charAt(0).toUpperCase() + headerAsCamelCase.slice(1)}`];
                } else {
                  value = 'N/A'; // Default if no matching decrypted or encrypted field is found
                }
            }
        }


        // Determine if masking is needed based on the access matrix for the current useCase
        const access = fieldAccessMatrix[currentUseCase];
        if (access && access.maskShare.includes(header)) {
          isMasked = true;
        }

        row[header] = isMasked ? maskData(header, value) : value;
      });
      return row;
    });
  };

  // Initial table data is based on the encryptedCustomers, processed for display
  const initialTableData = prepareTableDataForDisplay(encryptedCustomers, useCase);
  const [filteredTableData, setFilteredTableData] = useState(initialTableData);


  useEffect(() => {
    setSimulateAccessKeyword('give');
  }, []);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.load('/models/tiny_face_detector_model-weights_manifest.json');
        await faceapi.nets.faceLandmark68Net.load('/models/face_landmark_68_model-weights_manifest.json');
        await faceapi.nets.faceRecognitionNet.load('/models/face_recognition_model-weights_manifest.json');

        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        setStatus('📸 Align your face in the frame...');
      } catch (err) {
        console.error('Face API error:', err);
        setStatus('❌ Webcam/model load failed.');
      }
    };

    loadModels();

    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, []);

  useEffect(() => {
    if (faceVerified) {
      idleTimer.current = setTimeout(() => {
        setSimulateResult('🔍 Simulation complete: No anomalies found.');
      }, 20000);
    }
    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [faceVerified]);

  const handleVerify = () => {
    if (shouldAllowNonCapAccess()) {
      setFaceVerified(true);
      setStatus('✅ Face verified & access granted!');
    } else {
      setStatus('❌ Face verified, but access is denied by simulation policy.');
    }
  };

  const downloadEncryptedJSON = (svcName: string) => {
    const serviceData = {
      service: svcName,
      customers: encryptedCustomers,
    };

    const blob = new Blob([JSON.stringify(serviceData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${svcName.replace(/\s+/g, '_')}_encrypted.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtering logic now uses the decrypted 'customers' prop, then re-prepares for display
  const handleFilterData = () => {
    if (!query.trim()) {
      setFilteredTableData(initialTableData); // Reset to initial masked data
      return;
    }

    const lowerCaseQuery = query.toLowerCase();
    // Filter on the decrypted 'customers' prop
    const filteredDecryptedCustomers = customers.filter(customer => {
      // Check all relevant decrypted fields for the query
      return (
        (customer.decryptedName && customer.decryptedName.toLowerCase().includes(lowerCaseQuery)) ||
        (customer.decryptedEmail && customer.decryptedEmail.toLowerCase().includes(lowerCaseQuery)) ||
        (customer.decryptedPhone && customer.decryptedPhone.toLowerCase().includes(lowerCaseQuery)) ||
        (customer.decryptedAccountNumber && customer.decryptedAccountNumber.toLowerCase().includes(lowerCaseQuery)) ||
        (customer.decryptedPan && customer.decryptedPan.toLowerCase().includes(lowerCaseQuery)) ||
        (customer.decryptedAadhaar && customer.decryptedAadhaar.toLowerCase().includes(lowerCaseQuery))
        // Add more decrypted fields to search through as needed
      );
    });

    // Now, map these filtered decrypted customers back to their encrypted counterparts
    const filteredEncryptedCustomersForDisplay = filteredDecryptedCustomers.map(decryptedCustomer => {
      // Find the corresponding encrypted customer from the original encryptedCustomers prop
      const matchingEncrypted = encryptedCustomers.find(encCust =>
        // Assuming decryptedEmail is a reliable unique identifier for matching
        (encCust.decryptedEmail && decryptedCustomer.decryptedEmail === encCust.decryptedEmail) ||
        (encCust.decryptedName && decryptedCustomer.decryptedName === encCust.decryptedName)
      );
      // Return the encrypted version or a default EncryptedCustomer if not found
      return matchingEncrypted || { encryptedName: '', encryptedEmail: '', encryptedPhone: '' };
    });

    // Prepare the filtered encrypted data for display in the table
    setFilteredTableData(prepareTableDataForDisplay(filteredEncryptedCustomersForDisplay, useCase));
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Card className="w-[95vw] h-[85vh] bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden relative flex">
        <Button className="absolute top-4 right-4 z-10" variant="ghost" onClick={onClose}>
          <X />
        </Button>

        {/* LEFT SIDE: DATA */}
        <div className="w-2/3 border-r border-gray-300 dark:border-gray-700 p-4">
          {!faceVerified ? (
            <div className="flex flex-col items-center justify-center h-full">
              <video ref={videoRef} autoPlay muted playsInline className="rounded border mb-4" />
              <p>{status}</p>
              <Button onClick={handleVerify} className="mt-2">🔍 Scan Face</Button>
            </div>
          ) : (
            <>
              <CardHeader>
                <CardTitle>{serviceName} — {useCase}</CardTitle>
                <p className="text-sm text-green-600">{status}</p>
                {simulateResult && <p className="text-xs text-indigo-500 mt-2">{simulateResult}</p>}
              </CardHeader>
              <div className="filter-section mb-4">
                <Input
                  placeholder="Search by name, email, phone, etc."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="mb-2"
                />
                <Button onClick={handleFilterData}>Apply Filter</Button>
              </div>
              <ScrollArea className="h-[65vh] overflow-auto mt-2">
                <table className="min-w-full text-sm text-left border-collapse border border-gray-300 dark:border-gray-600">
                  <thead className="sticky top-0 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                    <tr>
                      {uniqueHeaders.map((header) => (
                        <th key={header} className="border px-3 py-2">{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTableData.map((customerRow, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        {uniqueHeaders.map((header) => (
                          <td key={header} className="border px-3 py-2">
                            {customerRow[header] ?? '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollArea>
            </>
          )}
        </div>

        {/* RIGHT SIDE: ACTIONS */}
        <div className="w-1/3 p-4 flex flex-col gap-4">
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="mt-4 flex justify-end">
              <button
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-md"
                onClick={() => downloadEncryptedJSON(serviceName)}
              >
              📥 Download Encrypted File
              </button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 italic mt-1">
              🔐 Decryption password sent to your email. <br />(For now: <span className="font-mono text-green-600">1234</span>)
            </p>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
}
