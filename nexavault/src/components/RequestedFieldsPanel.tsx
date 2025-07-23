// import React from 'react';
// import { fieldAccessMatrix } from '../lib/fieldAccessMatrix'; // Import the actual fieldAccessMatrix

// // Define the type for UseCaseType based on the keys of fieldAccessMatrix
// type UseCaseType = keyof typeof fieldAccessMatrix;

// // Define the props interface for the RequestedFieldsPanel component
// interface RequestedFieldsPanelProps {
//   request: {
//     useCase: UseCaseType; // The specific use case (e.g., 'Lending App')
//     requestedFields: string[]; // List of fields requested by the service
//     service: string; // Name of the service (e.g., 'Google Pay')
//     website: string; // Website URL of the service
//     thirdPartyName: string; // Name of the third-party provider
//     customers: { // Array of customer objects, with basic details
//       name: string;
//       email: string;
//       phone: string;
//       // Note: Other customer fields (like accountNumber, pan, etc.) are not
//       // directly used for display in this simplified panel, but they exist
//       // in the original 'approvedServices' data if needed elsewhere.
//     }[];
//     status: string; // Status of the request (e.g., 'Accepted')
//   };
//   onClose: () => void; // Function to call when the panel should be closed
//   panelType: string; // Type of panel (e.g., 'approved', 'pending') - currently not used in rendering
//   onFilterData: (filteredData: any[]) => void; // Callback for filtering data - currently not used in this simplified panel
//   onViewAllCustomers: (customers: any[]) => void; // Callback to view all customers - currently not used in this simplified panel
// }

// /**
//  * RequestedFieldsPanel component displays details about a service request,
//  * including the service information, a list of target customers, and
//  * the access status for each requested field based on the fieldAccessMatrix.
//  * It functions as a modal/overlay panel.
//  */
// export function RequestedFieldsPanel({
//   request,
//   onClose,
//   panelType, // panelType is not used in the current JSX, but kept in props
//   onFilterData, // onFilterData is not used in the current JSX, but kept in props
//   onViewAllCustomers, // onViewAllCustomers is not used in the current JSX, but kept in props
// }: RequestedFieldsPanelProps): JSX.Element { // Explicitly declare return type as JSX.Element

//   // Destructure properties from the 'request' object
//   // 'suggestedFields' and other data-related fields (encryptedCustomers, confidentialFields)
//   // have been removed from the request object as per the new component's scope.
//   const { useCase, requestedFields, service, website, thirdPartyName, customers, status } = request;

//   // Determine field access configuration based on the useCase
//   // If useCase is not found, default to empty arrays for safety
//   const access = fieldAccessMatrix[useCase] || {
//     explicitlyShare: [],
//     maskShare: [],
//     withConsent: []
//   };

//   /**
//    * Determines the access status and corresponding color for a given field.
//    * @param field The name of the field to check.
//    * @returns An object containing a label (e.g., 'Bank Approved') and a color.
//    */
//   const getFieldStatus = (field: string) => {
//     if (access.explicitlyShare.includes(field)) {
//       return { label: 'Bank Approved', color: 'green' };
//     } else if (access.maskShare.includes(field)) {
//       return { label: 'Mask Share', color: 'blue' };
//     } else if (access.withConsent.includes(field)) {
//       return { label: 'Capsulized', color: 'orange' };
//     } else {
//       // If a field is requested but not in any defined category, it's considered confidential
//       return { label: 'Confidential', color: 'red' };
//     }
//   };

//   // The component renders a fixed overlay with details about the request.
//   return (
//     <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50 font-inter">
//       <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl transform transition-all duration-300 scale-100 opacity-100">
//         <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Request Details</h3>
//         <div className="space-y-4 text-gray-700">
//           {/* Service and Use Case Details */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <p className="font-semibold text-lg">Service:</p>
//               <p className="ml-2">{service}</p>
//             </div>
//             <div>
//               <p className="font-semibold text-lg">Use Case:</p>
//               <p className="ml-2">{useCase}</p>
//             </div>
//             <div>
//               <p className="font-semibold text-lg">Third Party:</p>
//               <p className="ml-2">{thirdPartyName}</p>
//             </div>
//             <div>
//               <p className="font-semibold text-lg">Website:</p>
//               <p className="ml-2">
//                 <a href={website} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
//                   {website}
//                 </a>
//               </p>
//             </div>
//             <div>
//               <p className="font-semibold text-lg">Status:</p>
//               <p className="ml-2">
//                 <span className={`px-3 py-1 rounded-full text-sm font-medium ${
//                   status === 'Accepted' ? 'bg-green-100 text-green-800' :
//                   status === 'Rejected' ? 'bg-red-100 text-red-800' :
//                   'bg-yellow-100 text-yellow-800'
//                 }`}>
//                   {status}
//                 </span>
//               </p>
//             </div>
//           </div>

//           {/* Target Customers Table */}
//           <div>
//             <h4 className="text-xl font-semibold mt-4 mb-2">Target Customers</h4>
//             <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
//               <table className="min-w-full bg-white">
//                 <thead>
//                   <tr className="bg-gray-100 border-b">
//                     <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Name</th>
//                     <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Email</th>
//                     <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Phone</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {/* Map over the customers array to display each customer's details */}
//                   {customers.map((c, i) => (
//                     <tr key={i} className="border-b last:border-b-0 hover:bg-gray-50">
//                       <td className="py-2 px-4 text-sm text-gray-800">{c.name}</td>
//                       <td className="py-2 px-4 text-sm text-gray-800">{c.email}</td>
//                       <td className="py-2 px-4 text-sm text-gray-800">{c.phone}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Requested Fields & Access Status */}
//           <div>
//             <h4 className="text-xl font-semibold mt-4 mb-2">Requested Fields & Access Status</h4>
//             <div className="flex flex-wrap gap-3">
//               {/* Map over the requestedFields array to display each field's status */}
//               {requestedFields.map((field, idx) => {
//                 const statusInfo = getFieldStatus(field);
//                 return (
//                   <div
//                     key={idx}
//                     className={`border-2 px-4 py-2 rounded-lg border-${statusInfo.color}-500 text-${statusInfo.color}-700 bg-white shadow-sm flex items-center justify-between gap-2`}
//                   >
//                     <span className="text-sm font-medium">{field}</span>
//                     <span className={`text-xs bg-${statusInfo.color}-100 text-${statusInfo.color}-700 px-2 py-0.5 rounded-full`}>
//                       {statusInfo.label}
//                     </span>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//         {/* Close Button */}
//         <div className="mt-6 text-right">
//           <button
//             className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition duration-200 ease-in-out shadow-md"
//             onClick={onClose}
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from 'react';
import { fieldAccessMatrix } from '../lib/fieldAccessMatrix';
import { totalapprovedServices } from '../../backend/data/approvedServices';

type UseCaseType = keyof typeof fieldAccessMatrix;

interface RequestedFieldsPanelProps {
  request: {
    useCase: UseCaseType;
    requestedFields: string[];
    service: string;
    website: string;
    thirdPartyName: string;
    customers: any[]; // Expanded to accept any field shape
    status: string;
  };
  onClose: () => void;
  panelType: string;
  onFilterData: (filteredData: any[]) => void;
  onViewAllCustomers: (customers: any[]) => void;
}

export function RequestedFieldsPanel({
  request,
  onClose,
  panelType,
  onFilterData,
  onViewAllCustomers
}: RequestedFieldsPanelProps): JSX.Element {
  const { useCase, requestedFields, service, website, thirdPartyName, customers, status } = request;

  const [query, setQuery] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState(customers);
  const [filterError, setFilterError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const access = fieldAccessMatrix[useCase] || {
    explicitlyShare: [],
    maskShare: [],
    withConsent: []
  };

  const getFieldStatus = (field: string) => {
    if (access.explicitlyShare.includes(field)) {
      return { label: 'Bank Approved', color: 'green' };
    } else if (access.maskShare.includes(field)) {
      return { label: 'Mask Share', color: 'blue' };
    } else if (access.withConsent.includes(field)) {
      return { label: 'Capsulized', color: 'orange' };
    } else {
      return { label: 'Confidential', color: 'red' };
    }
  };

  const calculateAge = (dob: string): number => {
    const date = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    const m = today.getMonth() - date.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < date.getDate())) age--;
    return age;
  };

  const applyFilterToCustomers = (customers: any[], filter: any) => {
    const { type, field, operator, value, startDate, endDate, minAge, maxAge } = filter;

    return customers.filter((customer) => {
      if (type === 'text') {
        const val = String(value).toLowerCase();
        const fieldVal = (customer[field] || '').toString().toLowerCase();
        if (operator === 'includes') return fieldVal.includes(val);
        if (operator === 'startsWith') return fieldVal.startsWith(val);
        if (operator === 'endsWith') return fieldVal.endsWith(val);
        if (operator === '=') return fieldVal === val;
      }

      if (type === 'numeric') {
        const num = Number(customer[field]);
        if (isNaN(num)) return false;
        if (operator === '>') return num > value;
        if (operator === '<') return num < value;
        if (operator === '>=') return num >= value;
        if (operator === '<=') return num <= value;
        if (operator === '=') return num === value;
      }

      if (type === 'dateRange') {
        if (minAge !== undefined || maxAge !== undefined) {
          const age = calculateAge(customer.dateOfBirth);
          if (minAge !== undefined && age < minAge) return false;
          if (maxAge !== undefined && age > maxAge) return false;
          return true;
        }

        if (startDate && endDate) {
          const dob = new Date(customer.dateOfBirth);
          return dob >= new Date(startDate) && dob <= new Date(endDate);
        }
      }

      return false;
    });
  };

  const handleRunQuery = async () => {
    setLoading(true);
    setFilterError(null);

    try {
      const response = await fetch('/api/filter/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });

      const result = await response.json();

      if (result.error) {
        setFilterError(result.error);
        setFilteredCustomers(customers);
      } else {
        const filtered = applyFilterToCustomers(customers, result.filter);
        setFilteredCustomers(filtered);
      }
    } catch (err) {
      console.error('Filter parsing failed:', err);
      setFilterError('An error occurred while processing your query.');
    }

    setLoading(false);
  };

  useEffect(() => {
    setFilteredCustomers(customers);
  }, [request]);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50 font-inter">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Request Details</h3>

        <div className="space-y-4 text-gray-700">
          {/* Query Box */}
          <div>
            <label className="block font-semibold text-gray-800 mb-1">Run a Filter Query:</label>
            <textarea
              className="w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='E.g., "age > 30", "name includes Ravi", "dob between 1980-1990"'
            />
            <button
              onClick={handleRunQuery}
              disabled={loading}
              className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              {loading ? 'Running...' : 'Run Query'}
            </button>
            {filterError && <p className="text-red-600 mt-1 text-sm">{filterError}</p>}
          </div>

          {/* Secure Download Button for This Service Only */}
          <div className="mt-4">
            <button
              onClick={() => {
                const serviceData = totalapprovedServices.find(s => s.service === service);
                if (!serviceData) return alert("Service data not found.");
                
                const password = prompt(`🔐 Enter password to encrypt ${service} data:`);
                if (!password || password.length < 4) return alert("Password must be at least 4 characters.");

                fetch('/api/secure/generate-token', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ serviceName: service, password })
                })
                .then(res => res.json())
                .then(data => {
                  if (data.token) {
                    window.open(`/api/secure/download-html?token=${data.token}`, '_blank');
                  } else {
                    alert("❌ Failed to generate secure token.");
                  }
                });
              }}
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <i className="fas fa-download mr-2"></i> Download Secure Data for {service}
            </button>
          </div>

          {/* Target Customers */}
          <div>
            <h4 className="text-xl font-semibold mt-4 mb-2">Filtered Customers</h4>
            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Name</th>
                    <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Email</th>
                    <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((c, i) => (
                    <tr key={i} className="border-b last:border-b-0 hover:bg-gray-50">
                      <td className="py-2 px-4 text-sm text-gray-800">{c.name}</td>
                      <td className="py-2 px-4 text-sm text-gray-800">{c.email}</td>
                      <td className="py-2 px-4 text-sm text-gray-800">{c.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Field Access Panel */}
          <div>
            <h4 className="text-xl font-semibold mt-4 mb-2">Requested Fields & Access Status</h4>
            <div className="flex flex-wrap gap-3">
              {requestedFields.map((field, idx) => {
                const statusInfo = getFieldStatus(field);
                return (
                  <div
                    key={idx}
                    className={`border-2 px-4 py-2 rounded-lg border-${statusInfo.color}-500 text-${statusInfo.color}-700 bg-white shadow-sm flex items-center justify-between gap-2`}
                  >
                    <span className="text-sm font-medium">{field}</span>
                    <span className={`text-xs bg-${statusInfo.color}-100 text-${statusInfo.color}-700 px-2 py-0.5 rounded-full`}>
                      {statusInfo.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Close */}
        <div className="mt-6 text-right">
          <button
            className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
