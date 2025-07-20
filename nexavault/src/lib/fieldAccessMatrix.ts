// export const fieldAccessMatrix = {
//   'UPI Payment App': {
//     explicitlyShare: [
//       'Account holder name',
//       'IFSC code',
//       'Bank name',
//       'Account type',
//       'Transaction reference no.'
//     ],
//     maskShare: [
//       'Account number',
//       'Mobile number (linked)'
//     ],
//     withConsent: [
//       'Balance inquiry',
//       'Email ID' // Added Email ID as it's a common field for consent
//     ]
//   },
//   'Lending App': {
//     explicitlyShare: [
//       'Full name',
//       'Date of birth' // Added DOB as it's crucial for lending
//     ],
//     maskShare: [
//       'PAN',
//       'Aadhaar number',
//       'Address',
//       'Phone number',
//       'Bank account number'
//     ],
//     withConsent: [
//       'Credit score',
//       'Monthly average balance',
//       'Loan repayment history',
//       'EMI transaction history',
//       'Employment status', // Added for lending
//       'Income details' // Added for lending
//     ]
//   },
//   'Bill Payment App': {
//     explicitlyShare: [
//       'Transaction amount',
//       'Merchant/biller name',
//       'Bill due date',
//       'Biller ID' // Added for bill payments
//     ],
//     maskShare: [
//       'Linked account numbers',
//       'Phone number',
//       'Customer ID (biller)' // Added for bill payments
//     ],
//     withConsent: [
//       'Email ID',
//       'Payment history (for specific biller)' // Added for bill payments
//     ]
//   },
//   'Personal Finance Management': {
//     explicitlyShare: [
//       'Category',
//       'Bank name',
//       'Transaction date' // Added for PFM
//     ],
//     maskShare: [
//       'Account number',
//       'Transaction description' // Added for PFM
//     ],
//     withConsent: [
//       'Transaction history',
//       'Available balance',
//       'Investment holdings',
//       'Credit card usage',
//       'Spending patterns', // Added for PFM
//       'Budget analysis' // Added for PFM
//     ]
//   },
//   'Account Aggregator': {
//     explicitlyShare: [
//       'Consent timestamp/status',
//       'FIU ID' // Financial Information User ID
//     ],
//     maskShare: [
//       'CIF / Customer ID',
//       'All linked account numbers',
//       'Account type (linked)' // Added for AA
//     ],
//     withConsent: [
//       'Demographics (name, DOB, gender, address)', // Expanded demographics
//       'Financial history (income, investments, loans, insurance)', // Expanded financial history
//       'Tax details', // Added for AA
//       'Credit report summary' // Added for AA
//     ]
//   },
//   // --- New Bank-Related Use Cases ---

//   'Insurance App': {
//     explicitlyShare: [
//       'Full name',
//       'Date of birth'
//     ],
//     maskShare: [
//       'Address',
//       'Phone number',
//       'Email ID'
//     ],
//     withConsent: [
//       'Existing insurance policies',
//       'Income details',
//       'Investment portfolio value'
//     ]
//   },
//   'Investment Platform': {
//     explicitlyShare: [
//       'Full name',
//       'PAN',
//       'Bank account number'
//     ],
//     maskShare: [
//       'Address',
//       'Phone number',
//       'Email ID',
//       'Investment account ID'
//     ],
//     withConsent: [
//       'Transaction history (investment)',
//       'Portfolio holdings',
//       'Capital gains/losses',
//       'Risk profile assessment',
//       'Income source details'
//     ]
//   },
//   'Tax Filing Software': {
//     explicitlyShare: [
//       'Full name',
//       'PAN',
//       'Assessment Year'
//     ],
//     maskShare: [
//       'Aadhaar number',
//       'Bank account number',
//       'Address'
//     ],
//     withConsent: [
//       'Salary slips/Form 16',
//       'Transaction history (income/expenses)',
//       'Investment proofs (80C, etc.)',
//       'Loan interest certificates',
//       'TDS details'
//     ]
//   },
//   'Mortgage Application': {
//     explicitlyShare: [
//       'Full name',
//       'Date of birth',
//       'Property address'
//     ],
//     maskShare: [
//       'PAN',
//       'Aadhaar number',
//       'Current residential address',
//       'Employment details',
//       'Existing loan details'
//     ],
//     withConsent: [
//       'Credit score',
//       'Bank statements (last 12 months)',
//       'Income tax returns (last 3 years)',
//       'Existing liabilities (loans, credit cards)',
//       'Property valuation reports'
//     ]
//   },
//   'Digital Wallet Service': {
//     explicitlyShare: [
//       'Mobile number',
//       'Wallet ID',
//       'Transaction timestamp'
//     ],
//     maskShare: [
//       'Linked bank account number (masked)',
//       'UPI ID'
//     ],
//     withConsent: [
//       'Wallet transaction history',
//       'Frequent contacts (for payments)',
//       'Merchant payment history',
//       'Available wallet balance'
//     ]
//   }
// };

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
      'Mobile number (linked)'
    ],
    withConsent: [
      'Balance inquiry',
      'Email ID'
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
      'Phone number',
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
      'Phone number',
      'Customer ID (biller)'
    ],
    withConsent: [
      'Email ID',
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
      'Phone number',
      'Email ID',
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
      'Phone number',
      'Email ID',
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
      'Mobile number',
      'Wallet ID',
      'Transaction timestamp'
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

export const fieldAccessMatrix2 = [
  // ─── Google Pay ─────────────────────────────
  { key: 'balanceInquiry', name: 'Balance (₹)', rangeSafe: true, requiresOtp: false },  // Will be bucketed (e.g., ₹50K–₹70K)
  { key: 'linkedEmailIds', name: 'Linked Email IDs', rangeSafe: false, requiresOtp: true },

  // ─── QuickLoan ──────────────────────────────
  { key: 'creditScore', name: 'Credit Score', rangeSafe: true, requiresOtp: false },
  { key: 'monthlyAverageBalance', name: 'Monthly Avg Balance (₹)', rangeSafe: true, requiresOtp: false },
  { key: 'employmentStatus', name: 'Employment Status', rangeSafe: false, requiresOtp: true },

  // ─── DataBridge AA ──────────────────────────
  { key: 'Financialhistory', name: 'Financial history', rangeSafe: false, requiresOtp: true },
  { key: 'creditReportSummary', name: 'Credit Report Summary', rangeSafe: false, requiresOtp: true },
  { key: 'cif', name: 'CIF Number', rangeSafe: false, requiresOtp: true },
  { key: 'linkedAccounts', name: 'Linked Account Numbers', rangeSafe: false, requiresOtp: true },

  // ─── InvestSmart ────────────────────────────
  { key: 'portfolioHoldings', name: 'Portfolio Holdings', rangeSafe: false, requiresOtp: true },
  { key: 'riskProfile', name: 'Risk Profile', rangeSafe: false, requiresOtp: true },
  { key: 'mobilenumberslinked', name: 'Mobile numbers (linked)', rangeSafe: false, requiresOtp: true },

  // ─── PaySwift Wallet ────────────────────────
  { key: 'walletTransactionHistory', name: 'Wallet Transaction History', rangeSafe: false, requiresOtp: true },
  { key: 'availableWalletBalance', name: 'Available Wallet Balance (₹)', rangeSafe: true, requiresOtp: false },
];
