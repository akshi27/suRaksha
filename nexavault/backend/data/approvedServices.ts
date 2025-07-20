// Helper function to generate random addresses
const generateRandomAddress = () => {
  const streetNumbers = ['123', '45', '987', '101', '55'];
  const streetNames = ['Main St', 'Oak Ave', 'Pine Ln', 'Maple Rd', 'Cedar Ct'];
  const cities = ['Chennai', 'Coimbatore', 'Bangalore', 'Mumbai', 'Hyderabad'];
  const zipCodes = ['10001', '90210', '75001', '33101', '60601'];

  const randomStreetNum = streetNumbers[Math.floor(Math.random() * streetNumbers.length)];
  const randomStreetName = streetNames[Math.floor(Math.random() * streetNames.length)];
  const randomCity = cities[Math.floor(Math.random() * cities.length)];
  const randomZip = zipCodes[Math.floor(Math.random() * zipCodes.length)];

  return `${randomStreetNum}, ${randomStreetName}, ${randomCity} ${randomZip}`;
};

// Helper function to generate a random phone number different from an existing one
const generateRandomPhoneNumber = (existingPhone: string) => {
  let newPhone = '';
  do {
    newPhone = '+91 ' + Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join('');
  } while (newPhone === existingPhone);
  return newPhone;
};

export const approvedServices = [
  {
    service: 'Google Pay',
    useCase: 'UPI Payment App',
    status: 'Accepted', // Changed to Accepted for ApprovedPage
    website: 'https://pay.google.com',
    thirdPartyName: 'Google LLC',
    webAccess: true,
    customers: [
      { name: 'Ravi Kumar', email: 'ravi.kumar@example.com', phone: '+91 9876543210', accountNumber: '1234567890123456', ifscCode: 'HDFC0001234', bankName: 'HDFC Bank', accountType: 'Savings', transactionReferenceNo: 'TRN12345', balance: 50000, age: 35, dateOfBirth: '1989-01-15' },
      { name: 'Priya Singh', email: 'priya.singh@example.com', phone: '+91 8765432109', accountNumber: '6543210987654321', ifscCode: 'ICIC0005678', bankName: 'ICICI Bank', accountType: 'Current', transactionReferenceNo: 'TRN67890', balance: 120000, age: 28, dateOfBirth: '1996-03-20' },
      { name: 'Mohit Sharma', email: 'mohit.shampoo@example.com', phone: '+91 7654321098', accountNumber: '9876543210123456', ifscCode: 'AXIS0009012', bankName: 'Axis Bank', accountType: 'Savings', transactionReferenceNo: 'TRN11223', balance: 75000, age: 42, dateOfBirth: '1982-07-01' },
      { name: 'Anjali Gupta', email: 'anjali.gupta@example.com', phone: '+91 9123456789', accountNumber: '1029384756102938', ifscCode: 'PNB0001001', bankName: 'PNB Bank', accountType: 'Savings', transactionReferenceNo: 'TRN44556', balance: 90000, age: 30, dateOfBirth: '1994-09-10' },
      { name: 'Deepak Verma', email: 'deepak.verma@example.com', phone: '+91 9012345678', accountNumber: '2938475610293847', ifscCode: 'SBI0002002', bankName: 'SBI Bank', accountType: 'Current', transactionReferenceNo: 'TRN77889', balance: 150000, age: 50, dateOfBirth: '1974-11-25' }
    ],
    requestedFields: [
      'Account holder name', 'IFSC code', 'Bank name', 'Account type', 'Transaction reference no.',
      'Account number', 'Mobile numbers (linked)', 'Balance inquiry', 'Email IDs (linked)'
    ],
    confidentialFields: []
  },
  {
    service: 'QuickLoan',
    useCase: 'Lending App',
    status: 'Accepted',
    website: 'https://quickloan.com',
    webAccess: true,
    thirdPartyName: 'FinServe Solutions',
    customers: [
      { name: 'Suresh Rao', email: 'suresh.rao@example.com', phone: '+91 9988776655', pan: 'ABCDE1234F', aadhaar: '123456789012', creditScore: 780, monthlyAverageBalance: 25000, employmentStatus: 'Employed', dateOfBirth: '1985-05-10', address: generateRandomAddress(), bankAccountNumber: '9876543210987654' },
      { name: 'Neha Joshi', email: 'neha.joshi@example.com', phone: '+91 9876543210', pan: 'FGHIJ5678K', aadhaar: '234567890123', creditScore: 650, monthlyAverageBalance: 15000, employmentStatus: 'Self-Employed', dateOfBirth: '1992-11-20', address: generateRandomAddress(), bankAccountNumber: '1234567890123456' },
      { name: 'Vijay Kumar', email: 'vijay.kumar@example.com', phone: '+91 8765432109', pan: 'KLMNO9012L', aadhaar: '345678901234', creditScore: 720, monthlyAverageBalance: 30000, employmentStatus: 'Employed', dateOfBirth: '1978-03-15', address: generateRandomAddress(), bankAccountNumber: '2345678901234567' },
      { name: 'Kavita Devi', email: 'kavita.devi@example.com', phone: '+91 7654321098', pan: 'PQRST3456M', aadhaar: '456789012345', creditScore: 590, monthlyAverageBalance: 10000, employmentStatus: 'Unemployed', dateOfBirth: '1995-09-01', address: generateRandomAddress(), bankAccountNumber: '3456789012345678' },
      { name: 'Rajesh Khanna', email: 'rajesh.khanna@example.com', phone: '+91 9123456789', pan: 'UVWXY7890N', aadhaar: '567890123456', creditScore: 700, monthlyAverageBalance: 20000, employmentStatus: 'Employed', dateOfBirth: '1980-01-25', address: generateRandomAddress(), bankAccountNumber: '4567890123456789' }
    ],
    requestedFields: [
      'Full name', 'Date of birth', 'PAN', 'Aadhaar number', 'Credit score',
      'Monthly average balance', 'Employment status', 'Address', 'Mobile numbers (linked)', 'Bank account number'
    ],
    confidentialFields: []
  },
  {
    service: 'DataBridge AA',
    useCase: 'Account Aggregator',
    status: 'Accepted',
    website: 'https://databridge.co',
    webAccess: true,
    thirdPartyName: 'Aggregator Services Ltd.',
    customers: [
      { name: 'Anil Kumar', email: 'anil.kumar@example.com', phone: '+91 7654321098', cif: 'CIF001', linkedAccounts: ['ACC123', 'ACC456'], accountTypeLinked: 'Savings', dateOfBirth: '1970-01-01', gender: 'Male', address: generateRandomAddress(), income: 120000, investments: 'Mutual Funds', loans: 'Home Loan', insurance: 'Life Insurance', taxDetails: 'Filed', creditReportSummary: 'Excellent' },
      { name: 'Geeta Devi', email: 'geeta.devi@example.com', phone: '+91 9123456789', cif: 'CIF002', linkedAccounts: ['ACC789', 'ACC012'], accountTypeLinked: 'Current', dateOfBirth: '1980-02-02', gender: 'Female', address: generateRandomAddress(), income: 90000, investments: 'Stocks', loans: 'Personal Loan', insurance: 'Health Insurance', taxDetails: 'Filed', creditReportSummary: 'Good' },
      { name: 'Sanjay Gupta', email: 'sanjay.gupta@example.com', phone: '+91 9012345678', cif: 'CIF003', linkedAccounts: ['ACC345', 'ACC678'], accountTypeLinked: 'Savings', dateOfBirth: '1975-03-03', gender: 'Male', address: generateRandomAddress(), income: 150000, investments: 'Real Estate', loans: 'Car Loan', insurance: 'Travel Insurance', taxDetails: 'Filed', creditReportSummary: 'Very Good' },
      { name: 'Priyanka Singh', email: 'priyanka.singh@example.com', phone: '+91 9876543210', cif: 'CIF004', linkedAccounts: ['ACC901', 'ACC234'], accountTypeLinked: 'Current', dateOfBirth: '1988-04-04', gender: 'Female', address: generateRandomAddress(), income: 70000, investments: 'FD', loans: 'Education Loan', insurance: 'Term Insurance', taxDetails: 'Filed', creditReportSummary: 'Fair' }
    ],
    requestedFields: [
      'Consent timestamp/status', 'CIF / Customer ID', 'All linked account numbers',
      'Demographics (name, DOB, gender, address)', 'Financial history (income, investments, loans)',
      'Credit report summary'
    ],
    confidentialFields: []
  },
  {
    service: 'InvestSmart',
    useCase: 'Investment Platform',
    status: 'Accepted',
    website: 'https://investsmart.net',
    webAccess: true,
    thirdPartyName: 'SmartInvestments',
    customers: [
      { name: 'Sunil Das', email: 'sunil.das@example.com', phone: '+91 9870123456', pan: 'ABCDE1234F', bankAccountNumber: '1122334455667788', portfolioHoldings: 'AAPL, GOOG', riskProfile: 'Moderate', investmentAccountId: 'INV001', transactionHistoryInvestment: 'Buy AAPL, Sell GOOG', capitalGainsLosses: 'Gains', incomeSourceDetails: 'Salary', address: generateRandomAddress(), dateOfBirth: '1975-06-20' },
      { name: 'Preeti Singh', email: 'preeti.singh@example.com', phone: '+91 9988776655', pan: 'FGHIJ5678K', bankAccountNumber: '2233445566778899', portfolioHoldings: 'TSLA, MSFT', riskProfile: 'Aggressive', investmentAccountId: 'INV002', transactionHistoryInvestment: 'Buy TSLA', capitalGainsLosses: 'Losses', incomeSourceDetails: 'Business', address: generateRandomAddress(), dateOfBirth: '1990-02-10' },
      { name: 'Gopal Reddy', email: 'gopal.reddy@example.com', phone: '+91 8765432109', pan: 'KLMNO9012L', bankAccountNumber: '3344556677889900', portfolioHoldings: 'AMZN, FB', riskProfile: 'Conservative', investmentAccountId: 'INV003', transactionHistoryInvestment: 'Buy AMZN', capitalGainsLosses: 'Gains', incomeSourceDetails: 'Pension', address: generateRandomAddress(), dateOfBirth: '1968-11-05' },
      { name: 'Ankita Sharma', email: 'ankita.sharma@example.com', phone: '+91 7654321098', pan: 'PQRST3456M', bankAccountNumber: '4455667788990011', portfolioHoldings: 'NFLX, NVDA', riskProfile: 'Moderate', investmentAccountId: 'INV004', transactionHistoryInvestment: 'Buy NFLX', capitalGainsLosses: 'Losses', incomeSourceDetails: 'Freelance', address: generateRandomAddress(), dateOfBirth: '1983-09-30' }
    ],
    requestedFields: [
      'Full name', 'PAN', 'Bank account number', 'Portfolio holdings',
      'Risk profile assessment', 'Mobile numbers (linked)', 'Email IDs linked', 'Address'
    ],
    confidentialFields: []
  },
  {
    service: 'PaySwift Wallet',
    useCase: 'Digital Wallet Service',
    status: 'Accepted',
    website: 'https://payswift.app',
    webAccess: true,
    thirdPartyName: 'SwiftPay Solutions',
    customers: [
      { name: 'Varun Sharma', email: 'varun.sharma@example.com', phone: '+91 9876501234', mobileNumberLinked: generateRandomPhoneNumber('+91 9876501234'), walletId: 'WLT001', transactionTimestamp: '2025-07-01 10:00:00', walletTransactionHistory: 'Sent 500, Rec 200', availableWalletBalance: 1500, linkedBankAccountNumber: '1111222233334444', upiId: 'varun@payswift', dateOfBirth: '1991-04-22' },
      { name: 'Disha Patel', email: 'disha.patel@example.com', phone: '+91 9765401234', mobileNumberLinked: generateRandomPhoneNumber('+91 9765401234'), walletId: 'WLT002', transactionTimestamp: '2025-07-01 11:00:00', walletTransactionHistory: 'Sent 1000, Rec 500', availableWalletBalance: 2000, linkedBankAccountNumber: '5555666677778888', upiId: 'disha@payswift', dateOfBirth: '1993-07-11' },
      { name: 'Karan Singh', email: 'karan.singh@example.com', phone: '+91 9654301234', mobileNumberLinked: generateRandomPhoneNumber('+91 9654301234'), walletId: 'WLT003', transactionTimestamp: '2025-07-01 12:00:00', walletTransactionHistory: 'Sent 200, Rec 100', availableWalletBalance: 800, linkedBankAccountNumber: '9999000011112222', upiId: 'karan@payswift', dateOfBirth: '1987-12-01' },
      { name: 'Ritika Gupta', email: 'ritika.gupta@example.com', phone: '+91 9543201234', mobileNumberLinked: generateRandomPhoneNumber('+91 9543201234'), walletId: 'WLT004', transactionTimestamp: '2025-07-01 13:00:00', walletTransactionHistory: 'Sent 700, Rec 300', availableWalletBalance: 1200, linkedBankAccountNumber: '3333444455556666', upiId: 'ritika@payswift', dateOfBirth: '1996-08-25' },
      { name: 'Arjun Kumar', email: 'arjun.kumar@example.com', phone: '+91 9432101234', mobileNumberLinked: generateRandomPhoneNumber('+91 9432101234'), walletId: 'WLT005', transactionTimestamp: '2025-07-01 14:00:00', walletTransactionHistory: 'Sent 300, Rec 150', availableWalletBalance: 900, linkedBankAccountNumber: '7777888899990000', upiId: 'arjun@payswift', dateOfBirth: '1985-03-14' }
    ],
    requestedFields: [
      'Mobile numbers (linked)', 'Wallet ID', 'Transaction timestamp',
      'Wallet transaction history', 'Available wallet balance', 'Linked bank account number (masked)'
    ],
    confidentialFields: []
  },
];