import React, { useState } from 'react';

// --- Data: sampleRequests (included directly for self-containment) ---
export const sampleRequests = [
  {
    service: 'Google Pay',
    useCase: 'UPI Payment App',
    status: 'Pending',
    website: 'https://pay.google.com',
    thirdPartyName: 'Google LLC',
    customers: [
      { name: 'Ravi Kumar', email: 'ravi.kumar@example.com', phone: '+91 9876543210' },
      { name: 'Priya Singh', email: 'priya.singh@example.com', phone: '+91 8765432109' },
      { name: 'Mohit Sharma', email: 'mohit.shampoo@example.com', phone: '+91 7654321098' },
      { name: 'Anjali Gupta', email: 'anjali.gupta@example.com', phone: '+91 9123456789' },
      { name: 'Deepak Verma', email: 'deepak.verma@example.com', phone: '+91 9012345678' }
    ],
    requestedFields: [
      'Account holder name',
      'IFSC code',
      'Account type',
      'Transaction reference no.',
      'Account number',
      'Mobile numbers (linked)', // Changed from 'Mobile number (linked)'
      'Balance inquiry',
      'Email IDs (linked)' // Changed from 'Email ID'
    ],
    confidentialFields: []
  },
  {
    service: 'QuickLoan',
    useCase: 'Lending App',
    status: 'Accepted',
    website: 'https://quickloan.com',
    thirdPartyName: 'FinServe Solutions',
    customers: [
      { name: 'Suresh Rao', email: 'suresh.rao@example.com', phone: '+91 9988776655' },
      { name: 'Neha Joshi', email: 'neha. Joshi@example.com', phone: '+91 9876543210' },
      { name: 'Vijay Kumar', email: 'vijay.kumar@example.com', phone: '+91 8765432109' },
      { name: 'Kavita Devi', email: 'kavita.devi@example.com', phone: '+91 7654321098' },
      { name: 'Rajesh Khanna', email: 'rajesh.khanna@example.com', phone: '+91 9123456789' }
    ],
    requestedFields: [
      'Full name',
      'Date of birth',
      'PAN',
      'Aadhaar number',
      'Mobile numbers (linked)', // Changed from 'Phone number' (if it was there)
      'Bank account number',
      'Credit score',
      'Monthly average balance',
      'Employment status'
    ],
    confidentialFields: []
  },
  {
    service: 'BillEase',
    useCase: 'Bill Payment App',
    status: 'Rejected',
    website: 'https://billease.in',
    thirdPartyName: 'EasePay Technologies',
    customers: [
      { name: 'Pooja Malik', email: 'pooja.malik@example.com', phone: '+91 9123456789' },
      { name: 'Gaurav Singh', email: 'gaurav.singpoo@example.com', phone: '+91 9012345678' },
      { name: 'Swati Sharma', email: 'swati.sharma@example.com', phone: '+91 9876543210' },
      { name: 'Rahul Jain', email: 'rahul.jain@example.com', phone: '+91 8765432109' }
    ],
    requestedFields: [
      'Transaction amount',
      'Merchant/biller name',
      'Bill due date',
      'Linked account numbers',
      'Email IDs (linked)', // Changed from 'Email ID'
      'Payment history (for specific biller)'
    ],
    confidentialFields: ['User IP Address', 'Biometric Data', 'Residential Address'] // Updated confidential fields
  },
  {
    service: 'MyWealth Manager',
    useCase: 'Personal Finance Management',
    status: 'Pending',
    website: 'https://mywealth.com',
    thirdPartyName: 'Wealthify Inc.',
    customers: [
      { name: 'Kiran Rao', email: 'kiran.rao@example.com', phone: '+91 8765432109' },
      { name: 'Arjun Reddy', email: 'arjun.reddy@example.com', phone: '+91 7654321098' },
      { name: 'Smita Patel', email: 'smita.patel@example.com', phone: '+91 9123456789' },
      { name: 'Vivek Sharma', email: 'vivek.sharma@example.com', phone: '+91 9012345678' },
      { name: 'Divya Singh', email: 'divya.singh@example.com', phone: '+91 9876543210' },
      { name: 'Rohit Kumar', email: 'rohit.kumar@example.com', phone: '+91 8765432109' }
    ],
    requestedFields: [
      'Category',
      'Transaction history',
      'Available balance',
      'Investment holdings',
      'Spending patterns'
    ],
    confidentialFields: ['Last Withdrawn Amount']
  },
  {
    service: 'DataBridge AA',
    useCase: 'Account Aggregator',
    status: 'Accepted',
    website: 'https://databridge.co',
    thirdPartyName: 'Aggregator Services Ltd.',
    customers: [
      { name: 'Anil Kumar', email: 'anil.kumar@example.com', phone: '+91 7654321098' },
      { name: 'Geeta Devi', email: 'geeta.devi@example.com', phone: '+91 9123456789' },
      { name: 'Sanjay Gupta', email: 'sanjay.gupta@example.com', phone: '+91 9012345678' },
      { name: 'Priyanka Singh', email: 'priyanka.singh@example.com', phone: '+91 9876543210' }
    ],
    requestedFields: [
      'Consent timestamp/status',
      'CIF / Customer ID',
      'All linked account numbers',
      'Demographics (name, DOB, gender, address)',
      'Financial history (income, investments, loans, insurance)',
      'Credit report summary'
    ],
    confidentialFields: []
  },
  {
    service: 'SecureLife Insurance',
    useCase: 'Insurance App',
    status: 'Pending',
    website: 'https://securelife.com',
    thirdPartyName: 'SecureLife Corp.',
    customers: [
      { name: 'Rina Shah', email: 'rina.shah@example.com', phone: '+91 9012345678' },
      { name: 'Alok Verma', email: 'alok.verma@example.com', phone: '+91 8765432109' },
      { name: 'Meena Devi', email: 'meena.devi@example.com', phone: '+91 7654321098' },
      { name: 'Kapil Sharma', email: 'kapil.sharma@example.com', phone: '+91 9123456789' }
    ],
    requestedFields: [
      'Full name',
      'Date of birth',
      'Policy type requested',
      'Income details'
    ],
    confidentialFields: ['Past Insurances']
  },
  {
    service: 'InvestSmart',
    useCase: 'Investment Platform',
    status: 'Accepted',
    website: 'https://investsmart.net',
    thirdPartyName: 'SmartInvestments',
    customers: [
      { name: 'Sunil Das', email: 'sunil.das@example.com', phone: '+91 9870123456' },
      { name: 'Preeti Singh', email: 'preeti.singh@example.com', phone: '+91 9988776655' },
      { name: 'Gopal Reddy', email: 'gopal.reddy@example.com', phone: '+91 8765432109' },
      { name: 'Ankita Sharma', email: 'ankita.sharma@example.com', phone: '+91 7654321098' }
    ],
    requestedFields: [
      'Full name',
      'PAN',
      'Bank account number',
      'Portfolio holdings',
      'Risk profile assessment',
      'Mobile numbers (linked)', // Changed from 'Phone number'
      'Email IDs linked' // Changed from 'Email ID'
    ],
    confidentialFields: []
  },
  {
    service: 'TaxBuddy',
    useCase: 'Tax Filing Software',
    status: 'Pending',
    website: 'https://taxbuddy.in',
    thirdPartyName: 'TaxGenius Pvt. Ltd.',
    customers: [
      { name: 'Rakesh Verma', email: 'rakesh.verma@example.com', phone: '+91 9998887770' },
      { name: 'Shalini Gupta', email: 'shalini.gupta@example.com', phone: '+91 9876543210' },
      { name: 'Dinesh Singh', email: 'dinesh.singh@example.com', phone: '+91 8765432109' },
      { name: 'Priyanka Sharma', email: 'priyanka.sharma@example.com', phone: '+91 7654321098' }
    ],
    requestedFields: [
      'Full name',
      'PAN',
      'Assessment Year',
      'Salary slips/Form 16',
      'TDS details'
    ],
    confidentialFields: []
  },
  {
    service: 'HomeLoan Pro',
    useCase: 'Mortgage Application',
    status: 'Rejected',
    website: 'https://homeloanpro.com',
    thirdPartyName: 'Mortgage Masters',
    customers: [
      { name: 'Sanjay Kumar', email: 'sanjay.kumar@example.com', phone: '+91 9765432100' },
      { name: 'Arti Devi', email: 'arti.devi@example.com', phone: '+91 9654321000' },
      { name: 'Manoj Singh', email: 'manoj.singh@example.com', phone: '+91 9543210000' },
      { name: 'Poonam Gupta', email: 'poonam.gupta@example.com', phone: '+91 9432100000' }
    ],
    requestedFields: [
      'Full name',
      'Date of birth',
      'Property address',
      'Credit score',
      'Bank statements (last 12 months)'
    ],
    confidentialFields: ['Tax Evasion History', 'Bank Balance'] // Updated confidential fields
  },
  {
    service: 'PaySwift Wallet',
    useCase: 'Digital Wallet Service',
    status: 'Accepted',
    website: 'https://payswift.app',
    thirdPartyName: 'SwiftPay Solutions',
    customers: [
      { name: 'Varun Sharma', email: 'varun.sharma@example.com', phone: '+91 9876501234' },
      { name: 'Disha Patel', email: 'disha.patel@example.com', phone: '+91 9765401234' },
      { name: 'Karan Singh', email: 'karan.singh@example.com', phone: '+91 9654301234' },
      { name: 'Ritika Gupta', email: 'ritika.gupta@example.com', phone: '+91 9543201234' },
      { name: 'Arjun Kumar', email: 'arjun.kumar@example.com', phone: '+91 9432101234' }
    ],
    requestedFields: [
      'Mobile numbers (linked)', // Changed from 'Mobile number (linked)'
      'Wallet ID',
      'Linked Bank Account Number',
      'Transaction timestamp',
      'Wallet transaction history',
      'Available wallet balance'
    ],
    confidentialFields: []
  },
];

// fieldAccessMatrix (from your provided src/lib/fieldAccessMatrix.ts)
export const fieldAccessMatrix = {
  'UPI Payment App': {
    explicitlyShare: [
      'Account holder name',
      'IFSC code',
      'Bank name',
      'Account type',
      'Transaction reference no.'
    ],
    maskShare: [
      'Account number',
      'Mobile numbers (linked)'
    ],
    withConsent: [
      'Balance inquiry',
      'Email IDs (linked)'
    ]
  },
  'Lending App': {
    explicitlyShare: [
      'Full name',
      'Date of birth'
    ],
    maskShare: [
      'PAN',
      'Aadhaar number',
      'Address',
      'Mobile numbers (linked)',
      'Bank account number'
    ],
    withConsent: [
      'Credit score',
      'Monthly average balance',
      'Loan repayment history',
      'EMI transaction history',
      'Employment status',
      'Income details'
    ]
  },
  'Bill Payment App': {
    explicitlyShare: [
      'Transaction amount',
      'Merchant/biller name',
      'Bill due date',
      'Biller ID'
    ],
    maskShare: [
      'Linked account numbers',
      'Mobile numbers (linked)',
      'Customer ID (biller)'
    ],
    withConsent: [
      'Email IDs (linked)',
      'Payment history (for specific biller)'
    ]
  },
  'Personal Finance Management': {
    explicitlyShare: [
      'Category',
      'Bank name',
      'Transaction date'
    ],
    maskShare: [
      'Account number',
      'Transaction description'
    ],
    withConsent: [
      'Transaction history',
      'Available balance',
      'Investment holdings',
      'Credit card usage',
      'Spending patterns',
      'Budget analysis'
    ]
  },
  'Account Aggregator': {
    explicitlyShare: [
      'Consent timestamp/status',
      'FIU ID'
    ],
    maskShare: [
      'CIF / Customer ID',
      'All linked account numbers',
      'Account type (linked)'
    ],
    withConsent: [
      'Demographics (name, DOB, gender, address)',
      'Financial history (income, investments, loans, insurance)',
      'Tax details',
      'Credit report summary'
    ]
  },
  'Insurance App': {
    explicitlyShare: [
      'Full name',
      'Date of birth',
      'Policy type requested'
    ],
    maskShare: [
      'Address',
      'Mobile numbers (linked)',
      'Email IDs linked',
      'Nominee details'
    ],
    withConsent: [
      'Health records summary',
      'Existing insurance policies',
      'Income details',
      'Investment portfolio value'
    ]
  },
  'Investment Platform': {
    explicitlyShare: [
      'Full name',
      'PAN',
      'Bank account number'
    ],
    maskShare: [
      'Address',
      'Mobile numbers (linked)r', // Keeping 'r' as per your provided matrix
      'Email IDs linked',
      'Investment account ID'
    ],
    withConsent: [
      'Transaction history (investment)',
      'Portfolio holdings',
      'Capital gains/losses',
      'Risk profile assessment',
      'Income source details'
    ]
  },
  'Tax Filing Software': {
    explicitlyShare: [
      'Full name',
      'PAN',
      'Assessment Year'
    ],
    maskShare: [
      'Aadhaar number',
      'Bank account number',
      'Address'
    ],
    withConsent: [
      'Salary slips/Form 16',
      'Transaction history (income/expenses)',
      'Investment proofs (80C, etc.)',
      'Loan interest certificates',
      'TDS details'
    ]
  },
  'Mortgage Application': {
    explicitlyShare: [
      'Full name',
      'Date of birth',
      'Property address'
    ],
    maskShare: [
      'PAN',
      'Aadhaar number',
      'Current residential address',
      'Employment details',
      'Existing loan details'
    ],
    withConsent: [
      'Credit score',
      'Bank statements (last 12 months)',
      'Income tax returns (last 3 years)',
      'Existing liabilities (loans, credit cards)',
      'Property valuation reports'
    ]
  },
  'Digital Wallet Service': {
    explicitlyShare: [
      'Mobile numbers (linked)',
      'Wallet ID',
      'Transaction timestamp',
      'Linked Bank Account Number'
    ],
    maskShare: [
      'Linked bank account number (masked)',
      'UPI ID'
    ],
    withConsent: [
      'Wallet transaction history',
      'Frequent contacts (for payments)',
      'Merchant payment history',
      'Available wallet balance'
    ]
  }
};


type UseCaseType = keyof typeof fieldAccessMatrix;

// Interface for customer data
interface Customer {
  name: string;
  email: string;
  phone: string;
}

interface RequestedFieldsPanelProps {
  request: {
    useCase: UseCaseType;
    requestedFields: string[];
    service: string;
    website: string;
    thirdPartyName: string;
    customers: Customer[];
    status: string;
    confidentialFields: string[];
  };
  onClose: () => void;
  onViewAllCustomers: (customers: Customer[]) => void; // New prop for viewing all customers
}

// New component for displaying all customers with a query box
interface AllCustomersModalProps {
  customers: Customer[];
  onClose: () => void; // This close will now explicitly close the modal
  onBack: () => void; // New prop for the "Back" functionality
}

function AllCustomersModal({ customers, onClose, onBack }: AllCustomersModalProps) {
  const [query, setQuery] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>(customers);

  const handleQueryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(e.target.value);
  };

  const handleRunQuery = () => {
    if (!query.trim()) {
      setFilteredCustomers(customers); // If query is empty, show all customers
      return;
    }

    const lowerCaseQuery = query.toLowerCase();
    const results = customers.filter(customer => {
      // Simple "SQL-like" querying: checks if any field contains the query string
      return Object.values(customer).some(value =>
        String(value).toLowerCase().includes(lowerCaseQuery)
      );
    });
    setFilteredCustomers(results);
  };

  const handleBack = () => {
    setQuery(''); // Clear the query
    setFilteredCustomers(customers); // Reset filtered customers to all customers
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50 font-inter">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl transform transition-all duration-300 scale-100 opacity-100">
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
                    <td colSpan={3} className="py-4 text-center text-gray-500">No customers found matching your query.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4">
            <label htmlFor="customerQuery" className="block text-sm font-medium text-gray-700 mb-1">Query Customers (e.g., "name:Ravi" or "example.com"):</label>
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
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 ease-in-out shadow-md"
                onClick={handleRunQuery}
              >
                Run Query
              </button>
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-200 ease-in-out shadow-md"
                onClick={handleBack}
              >
                Back
              </button>
            </div>
          </div>
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


function RequestedFieldsPanel({ request, onClose, onViewAllCustomers }: RequestedFieldsPanelProps) {
  const { useCase, requestedFields, service, website, thirdPartyName, customers, status, confidentialFields } = request;
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
      return { label: 'Capsulized', color: 'yellow' }; // Changed color to 'yellow' for Capsulized
    } else {
      return { label: 'Confidential', color: 'red' };
    }
  };

  // Always display only the first 5 customers in this panel
  const displayedCustomers = customers.slice(0, 5);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50 font-inter">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 opacity-100"> {/* Adjusted max-w and added max-h and overflow-y-auto */}
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
                  {displayedCustomers.map((c, i) => (
                    <tr key={i} className="border-b last:border-b-0">
                      <td className="py-2 px-4 text-sm text-gray-800">{c.name}</td>
                      <td className="py-2 px-4 text-sm text-gray-800">{c.email}</td>
                      <td className="py-2 px-4 text-sm text-gray-800">{c.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Always show "View all" */}
            <button
              className="mt-2 text-blue-600 hover:underline text-sm font-medium"
              onClick={() => onViewAllCustomers(customers)}
            >
              View all ({customers.length})
            </button>
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

          {/* Display confidentialFields only for Rejected status */}
          {status === 'Rejected' && confidentialFields && confidentialFields.length > 0 && (
            <div>
              <div className="flex flex-wrap gap-3 mt-4"> {/* Added mt-4 for spacing */}
                {confidentialFields.map((field, idx) => (
                  <div
                    key={idx}
                    className="border-2 px-4 py-2 rounded-lg border-red-500 text-red-700 bg-white shadow-sm flex items-center justify-between gap-2"
                  >
                    <span className="text-sm font-medium">{field}</span>
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                      Confidential
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
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

export default function App() {
  const [requests, setRequests] = useState(sampleRequests);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showAllCustomersModal, setShowAllCustomersModal] = useState(false);
  const [allCustomersData, setAllCustomersData] = useState<Customer[]>([]);

  const handleDetailsClick = (request: any) => {
    setSelectedRequest(request);
    setShowDetails(true);
  };

  const updateStatus = (index: number, status: string) => {
    const updated = [...requests];
    updated[index].status = status;
    setRequests(updated);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedRequest(null);
  };

  const handleViewAllCustomers = (customers: Customer[]) => {
    setAllCustomersData(customers);
    setShowAllCustomersModal(true);
  };

  const handleCloseAllCustomersModal = () => {
    setShowAllCustomersModal(false);
    setAllCustomersData([]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-inter">
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      {/* Font Awesome for icons */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"></link>


      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 pb-4 border-b border-gray-200">
          <h2 className="text-xl font-medium text-gray-700 mb-6">Third-Party Data Requests</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wide">Service</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wide">Use Case</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wide">Status</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wide">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((request, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="py-3 px-4 text-gray-800 text-sm">{request.service}</td>
                  <td className="py-3 px-4 text-gray-800 text-sm">{request.useCase}</td>
                  <td className="py-3 px-4">
                    {/* STATUS Column - Detailed Specifications */}
                    {/* 1. Pending Status Badge */}
                    {request.status === 'Pending' && (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full shadow-none
                                     bg-[#FEF3C7] border border-[#F59E0B20] text-[#D97706] gap-1">
                        <i className="far fa-clock text-xs"></i> Pending
                      </span>
                    )}
                    {/* 2. Approved Status Badge */}
                    {request.status === 'Accepted' && (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full shadow-none
                                     bg-[#DCFCE7] border border-[#10B98120] text-[#166534] gap-1">
                        <i className="fas fa-check text-xs"></i> Approved
                      </span>
                    )}
                    {/* 3. Rejected Status Badge */}
                    {request.status === 'Rejected' && (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full shadow-none
                                     bg-[#FEE2E2] border border-[#EF444420] text-[#991B1B] gap-1">
                        <i className="fas fa-times text-xs"></i> Rejected
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 flex items-center gap-3 flex-nowrap"> {/* ACTION Column - Increased gap to 3 */}
                    {/* Conditional rendering for Accept/Reject buttons with new styling */}
                    {request.status === 'Pending' && (
                      <>
                        {/* 1. Approve Button (Primary Action) */}
                        <button
                          className="inline-flex items-center justify-center px-4 py-1 text-xs font-medium text-white rounded-md shadow-sm
                                     bg-[#2563EB] hover:bg-[#1E40AF] transition-colors duration-200 ease-in-out
                                     focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-opacity-50"
                          onClick={() => updateStatus(index, 'Accepted')}
                        >
                          Accept
                        </button>
                        {/* 2. Reject Button (Destructive Action) */}
                        <button
                          className="inline-flex items-center justify-center px-4 py-1 text-xs font-medium text-white rounded-md shadow-sm
                                     bg-[#DC2626] hover:bg-[#991B1B] transition-colors duration-200 ease-in-out
                                     focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:ring-opacity-50"
                          onClick={() => updateStatus(index, 'Rejected')}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {request.status === 'Accepted' && (
                      // 2. Reject Button (Destructive Action) for accepted status
                      <button
                        className="inline-flex items-center justify-center px-4 py-1 text-xs font-medium text-white rounded-md shadow-sm
                                     bg-[#DC2626] hover:bg-[#991B1B] transition-colors duration-200 ease-in-out
                                     focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:ring-opacity-50"
                        onClick={() => updateStatus(index, 'Rejected')}
                      >
                        Reject
                      </button>
                    )}
                    {request.status === 'Rejected' && (
                      // 1. Approve Button (Primary Action) for rejected status
                      <button
                        className="inline-flex items-center justify-center px-4 py-1 text-xs font-medium text-white rounded-md shadow-sm
                                     bg-[#2563EB] hover:bg-[#1E40AF] transition-colors duration-200 ease-in-out
                                     focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-opacity-50"
                        onClick={() => updateStatus(index, 'Accepted')}
                      >
                        Accept
                      </button>
                    )}
                    {/* 3. Details Link (Secondary Action) */}
                    <button
                      className="inline-flex items-center justify-center px-4 py-1 text-xs font-medium rounded-md shadow-sm
                                 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200 ease-in-out
                                 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
                      onClick={() => handleDetailsClick(request)}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showDetails && selectedRequest && (
        <RequestedFieldsPanel
          request={selectedRequest}
          onClose={handleCloseDetails}
          onViewAllCustomers={handleViewAllCustomers}
        />
      )}

      {showAllCustomersModal && (
        <AllCustomersModal
          customers={allCustomersData}
          onClose={handleCloseAllCustomersModal}
          onBack={handleCloseAllCustomersModal}
        />
      )}
    </div>
  );
}

