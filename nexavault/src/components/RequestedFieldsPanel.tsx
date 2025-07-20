import React from 'react';
import { fieldAccessMatrix } from '../lib/fieldAccessMatrix'; // Import the actual fieldAccessMatrix

type UseCaseType = keyof typeof fieldAccessMatrix;

interface RequestedFieldsPanelProps {
  request: {
    useCase: UseCaseType;
    requestedFields: string[];
    service: string;
    website: string;
    thirdPartyName: string;
    customers: {
      name: string;
      email: string;
      phone: string;
    }[];
    status: string;
    // suggestedFields is removed from here
  };
  onClose: () => void;
  panelType: string;
  onFilterData: (filteredData: any[]) => void;
  onViewAllCustomers: (customers: any[]) => void;
}

export function RequestedFieldsPanel({ request, onClose, panelType, onFilterData, onViewAllCustomers, }: RequestedFieldsPanelProps) {
  // removed suggestedFields from destructuring
  const { useCase, requestedFields, service, website, thirdPartyName, customers, status } = request;
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

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50 font-inter">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl transform transition-all duration-300 scale-100 opacity-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Request Details</h3>
        <div className="space-y-4 text-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-semibold text-lg">Service:</p>
              <p className="ml-2">{service}</p>
            </div>
            <div>
              <p className="font-semibold text-lg">Use Case:</p>
              <p className="ml-2">{useCase}</p>
            </div>
            <div>
              <p className="font-semibold text-lg">Third Party:</p>
              <p className="ml-2">{thirdPartyName}</p>
            </div>
            <div>
              <p className="font-semibold text-lg">Website:</p>
              <p className="ml-2">
                <a href={website} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                  {website}
                </a>
              </p>
            </div>
            <div>
              <p className="font-semibold text-lg">Status:</p>
              <p className="ml-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  status === 'Accepted' ? 'bg-green-100 text-green-800' :
                  status === 'Rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {status}
                </span>
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-semibold mt-4 mb-2">Target Customers</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Name</th>
                    <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Email</th>
                    <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c, i) => (
                    <tr key={i} className="border-b last:border-b-0">
                      <td className="py-2 px-4 text-sm text-gray-800">{c.name}</td>
                      <td className="py-2 px-4 text-sm text-gray-800">{c.email}</td>
                      <td className="py-2 px-4 text-sm text-gray-800">{c.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

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

          {/* Suggested Fields section removed */}
        </div>
        <div className="mt-6 text-right">
          <button
            className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition duration-200 ease-in-out shadow-md"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

