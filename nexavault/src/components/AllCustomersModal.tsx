// src/components/AllCustomersModal.tsx

import React, { useState } from 'react';

interface Customer {
  name: string;
  email: string;
  phone: string;
}

interface AllCustomersModalProps {
  customers: Customer[];
  onClose: () => void;
  onBack: () => void;
}

export default function AllCustomersModal({ customers, onClose, onBack }: AllCustomersModalProps) {
  const [query, setQuery] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>(customers);

  const handleQueryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(e.target.value);
  };

  const handleRunQuery = () => {
    if (!query.trim()) {
      setFilteredCustomers(customers);
      return;
    }

    const lower = query.toLowerCase();
    const filtered = customers.filter(customer =>
      Object.values(customer).some(value =>
        String(value).toLowerCase().includes(lower)
      )
    );
    setFilteredCustomers(filtered);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50 font-inter">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">All Target Customers</h3>
        <div className="space-y-4 text-gray-700">
          <div className="overflow-x-auto max-h-80 overflow-y-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Name</th>
                  <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Email</th>
                  <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Phone</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((c, i) => (
                    <tr key={i} className="border-b last:border-b-0">
                      <td className="py-2 px-4 text-sm text-gray-800">{c.name}</td>
                      <td className="py-2 px-4 text-sm text-gray-800">{c.email}</td>
                      <td className="py-2 px-4 text-sm text-gray-800">{c.phone}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-4 text-center text-gray-500">
                      No customers found matching your query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4">
            <label htmlFor="customerQuery" className="block text-sm font-medium text-gray-700 mb-1">
              Query Customers (e.g., "name:Ravi" or "example.com"):
            </label>
            <textarea
              id="customerQuery"
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 bg-gray-50"
              value={query}
              onChange={handleQueryChange}
              placeholder="Enter your query here..."
            ></textarea>
            <div className="mt-3 flex space-x-2 justify-end">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 shadow-md"
                onClick={handleRunQuery}
              >
                Run Query
              </button>
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-200 shadow-md"
                onClick={onBack}
              >
                Back
              </button>
            </div>
          </div>
        </div>
        <div className="mt-6 text-right">
          <button
            className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition duration-200 shadow-md"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
