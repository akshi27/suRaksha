// export const sampleRequests = [
//   {
//     service: 'Google Pay',
//     useCase: 'UPI Payment App',
//     status: 'Pending',
//     website: 'https://pay.google.com',
//     thirdPartyName: 'Google LLC',
//     customers: [
//       {
//         name: 'Ravi Kumar',
//         email: 'ravi.kumar@example.com',
//         phone: '+91 9876543210'
//       }
//     ],
//     requestedFields: [
//       'Account holder name',
//       'IFSC code',
//       'Bank name',
//       'Account type',
//       'Transaction reference no.',
//       'Account number',
//       'Mobile number (linked)',
//       'Balance inquiry',
//       'Email ID'
//     ]
//   }
// ];

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

export const approvedServices = sampleRequests.filter(
  (request) => request.status === 'Accepted'
);