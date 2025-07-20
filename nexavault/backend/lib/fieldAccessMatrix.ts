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
      'Balance inquiry'
    ]
  },
  'Lending App': {
    explicitlyShare: [
      'Full name'
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
      'EMI transaction history'
    ]
  },
  'Bill Payment App': {
    explicitlyShare: [
      'Transaction amount',
      'Merchant/biller name',
      'Bill due date'
    ],
    maskShare: [
      'Linked account numbers',
      'Phone number'
    ],
    withConsent: [
      'Email ID'
    ]
  },
  'Personal Finance Management': {
    explicitlyShare: [
      'Category',
      'Bank name'
    ],
    maskShare: [
      'Account number'
    ],
    withConsent: [
      'Transaction history',
      'Available balance',
      'Investment holdings',
      'Credit card usage'
    ]
  },
  'Account Aggregator': {
    explicitlyShare: [
      'Consent timestamp/status'
    ],
    maskShare: [
      'CIF / Customer ID',
      'All linked account numbers'
    ],
    withConsent: [
      'Demographics (name, DOB)',
      'Financial history (income, investments, loans)'
    ]
  }
};
