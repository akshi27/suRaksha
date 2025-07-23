import React, { useState, useEffect } from 'react';
import DemoObserverCapsule from '../components/capsule/DemoObserverCapsule';
import TestObserverCapsule from '../components/capsule/TestObserverCapsule';
import CapsuleChat from '../components/capsule/CapsuleChat';
import { shouldAllowNonCapAccess} from '../utils/simulations/simulateNonCap';
import { NonCapsulizedPanel} from '../components/NonCapsulizedPanel';
// import { encryptedapprovedServices } from "../data/encryptedapprovedServices"; // This import is no longer needed as encryption is handled locally

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

// --- Data: approvedServices (augmented with more detailed customer data) ---
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

export const totalapprovedServices = [
  {
    service: 'Google Pay',
    useCase: 'UPI Payment App',
    status: 'Accepted', // Changed to Accepted for ApprovedPage
    website: 'https://pay.google.com',
    thirdPartyName: 'Google LLC',
    webAccess: true,
    customers: [
      {
        "name": "Ravi Kumar",
        "email": "ravi.kumar@example.com",
        "phone": "+91 9876543210",
        "accountHolderName": "Ravi Kumar",
        "ifscCode": "HDFC0001234",
        "bankName": "HDFC Bank",
        "accountType": "Savings",
        "transactionReferenceNo": "TRN12345",
        "accountNumber": "XXXXXXXXXXXX3456",
        "mobileNumbers(linked)": "+91 XXXXX43210"
      },
      {
        "name": "Priya Singh",
        "email": "priya.singh@example.com",
        "phone": "+91 8765432109",
        "accountHolderName": "Priya Singh",
        "ifscCode": "ICIC0005678",
        "bankName": "ICICI Bank",
        "accountType": "Current",
        "transactionReferenceNo": "TRN67890",
        "accountNumber": "XXXXXXXXXXXX4321",
        "mobileNumbers(linked)": "+91 XXXXX32109"
      },
      {
        "name": "Mohit Sharma",
        "email": "mohit.shampoo@example.com",
        "phone": "+91 7654321098",
        "accountHolderName": "Mohit Sharma",
        "ifscCode": "AXIS0009012",
        "bankName": "Axis Bank",
        "accountType": "Savings",
        "transactionReferenceNo": "TRN11223",
        "accountNumber": "XXXXXXXXXXXX3456",
        "mobileNumbers(linked)": "+91 XXXXX21098"
      },
      {
        "name": "Anjali Gupta",
        "email": "anjali.gupta@example.com",
        "phone": "+91 9123456789",
        "accountHolderName": "Anjali Gupta",
        "ifscCode": "PNB0001001",
        "bankName": "PNB Bank",
        "accountType": "Savings",
        "transactionReferenceNo": "TRN44556",
        "accountNumber": "XXXXXXXXXXXX2938",
        "mobileNumbers(linked)": "+91 XXXXX56789"
      },
      {
        "name": "Deepak Verma",
        "email": "deepak.verma@example.com",
        "phone": "+91 9012345678",
        "accountHolderName": "Deepak Verma",
        "ifscCode": "SBI0002002",
        "bankName": "SBI Bank",
        "accountType": "Current",
        "transactionReferenceNo": "TRN77889",
        "accountNumber": "XXXXXXXXXXXX3847",
        "mobileNumbers(linked)": "+91 XXXXX45678"
      }
    ]
  },
  {
    service: 'QuickLoan',
    useCase: 'Lending App',
    status: 'Accepted',
    website: 'https://quickloan.com',
    webAccess: true,
    thirdPartyName: 'FinServe Solutions',
    customers: [
      {
        "name": "Suresh Rao",
        "email": "suresh.rao@example.com",
        "phone": "+91 9988776655",
        "fullName": "Suresh Rao",
        "dateOfBirth": "1985-05-10",
        "pan": "XXXXXX1234F",
        "aadhaarNumber": "XXXXXXXX9012",
        "address": "xxx",
        "mobileNumbers(linked)": "+91 XXXXX76655",
        "bankAccountNumber": "XXXXXXXXXXXX7654"
      },
      {
        "name": "Neha Joshi",
        "email": "neha.joshi@example.com",
        "phone": "+91 9876543210",
        "fullName": "Neha Joshi",
        "dateOfBirth": "1992-11-20",
        "pan": "XXXXXX5678K",
        "aadhaarNumber": "XXXXXXXX0123",
        "address": "xxx",
        "mobileNumbers(linked)": "+91 XXXXX43210",
        "bankAccountNumber": "XXXXXXXXXXXX3456"
      },
      {
        "name": "Vijay Kumar",
        "email": "vijay.kumar@example.com",
        "phone": "+91 8765432109",
        "fullName": "Vijay Kumar",
        "dateOfBirth": "1978-03-15",
        "pan": "XXXXXX9012L",
        "aadhaarNumber": "XXXXXXXX1234",
        "address": "xxx",
        "mobileNumbers(linked)": "+91 XXXXX32109",
        "bankAccountNumber": "XXXXXXXXXXXX4567"
      },
      {
        "name": "Kavita Devi",
        "email": "kavita.devi@example.com",
        "phone": "+91 7654321098",
        "fullName": "Kavita Devi",
        "dateOfBirth": "1995-09-01",
        "pan": "XXXXXX3456M",
        "aadhaarNumber": "XXXXXXXX2345",
        "address": "xxx",
        "mobileNumbers(linked)": "+91 XXXXX21098",
        "bankAccountNumber": "XXXXXXXXXXXX5678"
      },
      {
        "name": "Rajesh Khanna",
        "email": "rajesh.khanna@example.com",
        "phone": "+91 9123456789",
        "fullName": "Rajesh Khanna",
        "dateOfBirth": "1980-01-25",
        "pan": "XXXXXX7890N",
        "aadhaarNumber": "XXXXXXXX3456",
        "address": "xxx",
        "mobileNumbers(linked)": "+91 XXXXX56789",
        "bankAccountNumber": "XXXXXXXXXXXX6789"
      }
    ]
  },
  {
    service: 'DataBridge AA',
    useCase: 'Account Aggregator',
    status: 'Accepted',
    website: 'https://databridge.co',
    webAccess: true,
    thirdPartyName: 'Aggregator Services Ltd.',
    customers: [
      {
        "name": "Anil Kumar",
        "email": "anil.kumar@example.com",
        "phone": "+91 7654321098",
        "consentTimestamp/status": "Accepted",
        "fiuId": "Not provided in sample",
        "cif/CustomerId": "CIFXXX",
        "allLinkedAccountNumbers": "XXX123, XXX456",
        "accountType(linked)": "Savings"
      },
      {
        "name": "Geeta Devi",
        "email": "geeta.devi@example.com",
        "phone": "+91 9123456789",
        "consentTimestamp/status": "Accepted",
        "fiuId": "Not provided in sample",
        "cif/CustomerId": "CIFXXX",
        "allLinkedAccountNumbers": "XXX789, XXX012",
        "accountType(linked)": "Current"
      },
      {
        "name": "Sanjay Gupta",
        "email": "sanjay.gupta@example.com",
        "phone": "+91 9012345678",
        "consentTimestamp/status": "Accepted",
        "fiuId": "Not provided in sample",
        "cif/CustomerId": "CIFXXX",
        "allLinkedAccountNumbers": "XXX345, XXX678",
        "accountType(linked)": "Savings"
      },
      {
        "name": "Priyanka Singh",
        "email": "priyanka.singh@example.com",
        "phone": "+91 9876543210",
        "consentTimestamp/status": "Accepted",
        "fiuId": "Not provided in sample",
        "cif/CustomerId": "CIFXXX",
        "allLinkedAccountNumbers": "XXX901, XXX234",
        "accountType(linked)": "Current"
      }
    ]
  },
  {
    service: 'InvestSmart',
    useCase: 'Investment Platform',
    status: 'Accepted',
    website: 'https://investsmart.net',
    webAccess: true,
    thirdPartyName: 'SmartInvestments',
    customers: [
      {
        "name": "Sunil Das",
        "email": "sunil.das@example.com",
        "phone": "+91 9870123456",
        "fullName": "Sunil Das",
        "pan": "ABCDE1234F",
        "bankAccountNumber": "1122334455667788",
        "portfolioHoldings": "AAPL, GOOG",
        "riskProfileAssessment": "Moderate",
        "address": "xxx",
        "mobileNumbers(linked)": "+91 XXXXX23456",
        "emailIDsLinked": "xxx"
      },
      {
        "name": "Preeti Singh",
        "email": "preeti.singh@example.com",
        "phone": "+91 9988776655",
        "fullName": "Preeti Singh",
        "pan": "FGHIJ5678K",
        "bankAccountNumber": "2233445566778899",
        "portfolioHoldings": "TSLA, MSFT",
        "riskProfileAssessment": "Aggressive",
        "address": "xxx",
        "mobileNumbers(linked)": "+91 XXXXX76655",
        "emailIDsLinked": "xxx"
      },
      {
        "name": "Gopal Reddy",
        "email": "gopal.reddy@example.com",
        "phone": "+91 8765432109",
        "fullName": "Gopal Reddy",
        "pan": "KLMNO9012L",
        "bankAccountNumber": "3344556677889900",
        "portfolioHoldings": "AMZN, FB",
        "riskProfileAssessment": "Conservative",
        "address": "xxx",
        "mobileNumbers(linked)": "+91 XXXXX32109",
        "emailIDsLinked": "xxx"
      },
      {
        "name": "Ankita Sharma",
        "email": "ankita.sharma@example.com",
        "phone": "+91 7654321098",
        "fullName": "Ankita Sharma",
        "pan": "PQRST3456M",
        "bankAccountNumber": "4455667788990011",
        "portfolioHoldings": "NFLX, NVDA",
        "riskProfileAssessment": "Moderate",
        "address": "xxx",
        "mobileNumbers(linked)": "+91 XXXXX21098",
        "emailIDsLinked": "xxx"
      }
    ]
  },
  {
    service: 'PaySwift Wallet',
    useCase: 'Digital Wallet Service',
    status: 'Accepted',
    website: 'https://payswift.app',
    webAccess: true,
    thirdPartyName: 'SwiftPay Solutions',
    customers: [
      {
        "name": "Varun Sharma",
        "email": "varun.sharma@example.com",
        "phone": "+91 9876501234",
        "mobileNumbers(linked)": "+91 XXXXX01234",
        "walletId": "WLT001",
        "transactionTimestamp": "2025-07-01 10:00:00",
        "linkedBankAccountNumber(masked)": "XXXXXXXXXXXX4444",
        "upiId": "xxx"
      },
      {
        "name": "Disha Patel",
        "email": "disha.patel@example.com",
        "phone": "+91 9765401234",
        "mobileNumbers(linked)": "+91 XXXXX01234",
        "walletId": "WLT002",
        "transactionTimestamp": "2025-07-01 11:00:00",
        "linkedBankAccountNumber(masked)": "XXXXXXXXXXXX8888",
        "upiId": "xxx"
      },
      {
        "name": "Karan Singh",
        "email": "karan.singh@example.com",
        "phone": "+91 9654301234",
        "mobileNumbers(linked)": "+91 XXXXX01234",
        "walletId": "WLT003",
        "transactionTimestamp": "2025-07-01 12:00:00",
        "linkedBankAccountNumber(masked)": "XXXXXXXXXXXX2222",
        "upiId": "xxx"
      },
      {
        "name": "Ritika Gupta",
        "email": "ritika.gupta@example.com",
        "phone": "+91 9543201234",
        "mobileNumbers(linked)": "+91 XXXXX01234",
        "walletId": "WLT004",
        "transactionTimestamp": "2025-07-01 13:00:00",
        "linkedBankAccountNumber(masked)": "XXXXXXXXXXXX6666",
        "upiId": "xxx"
      },
      {
        "name": "Arjun Kumar",
        "email": "arjun.kumar@example.com",
        "phone": "+91 9432101234",
        "mobileNumbers(linked)": "+91 XXXXX01234",
        "walletId": "WLT005",
        "transactionTimestamp": "2025-07-01 14:00:00",
        "linkedBankAccountNumber(masked)": "XXXXXXXXXXXX0000",
        "upiId": "xxx"
      }
    ]
  }
]

const encryptValue = (value: any) => {
  if (typeof value !== 'string') value = String(value);
  return btoa('__SALT__1234__' + value + '__SALT_END__');
};

const approvedServicesEncrypted = approvedServices.map(service => ({
  ...service,
  customers: service.customers.map(customer => {
    const encryptedCustomer: any = {};
    Object.entries(customer).forEach(([key, value]) => {
      encryptedCustomer[key] = encryptValue(value);
    });
    return encryptedCustomer;
  })
}));

// --- fieldAccessMatrix (from your provided src/lib/fieldAccessMatrix.ts) ---
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
      'Mobile numbers (linked)', // Changed from 'Phone number'
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
      'Mobile numbers (linked)', // Changed from 'Phone number'
      'Customer ID (biller)'
    ],
    withConsent: [
      'Email IDs (linked)', // Changed from 'Email ID'
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
      'Mobile numbers (linked)', // Changed from 'Phone number'
      'Email IDs linked', // Changed from 'Email ID'
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
      'Mobile numbers (linked)', // Corrected typo 'Mobile numbers (linked)r'
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
      'Mobile numbers (linked)', // Changed from 'Mobile number'
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


export type UseCaseType = keyof typeof fieldAccessMatrix;

// Interface for customer data
interface Customer {
  name: string;
  email: string;
  phone: string;
  dateOfBirth?: string; // Added dateOfBirth for age calculation
  [key: string]: any; // Allow for arbitrary properties
}

interface DetailsPanelProps {
  request: {
    useCase: UseCaseType;
    requestedFields: string[];
    service: string;
    website: string;
    thirdPartyName: string;
    customers: Customer[]; // This will be the original, decrypted customers
    encryptedCustomers: Customer[]; // This will be the encrypted customers for the table
    status: string;
    confidentialFields: string[];
  };
  onClose: () => void;
  onViewAllCustomers: (customers: Customer[]) => void;
  panelType: 'dashboard' | 'approved'; // New prop to differentiate panel behavior
  onFilterData: (query: string, allData: any[]) => Promise<void>; // New prop for filtering
}

interface AllCustomersModalProps {
  customers: Customer[];
  onClose: () => void;
  onBack: () => void;
}

// Helper to map display field names to actual customer object keys (camelCase)
const fieldKeyMap: { [key: string]: string } = {
  'Full name': 'name',
  'Date of birth': 'dateOfBirth',
  'PAN': 'pan',
  'Aadhaar number': 'aadhaar',
  'Credit score': 'creditScore',
  'Monthly average balance': 'monthlyAverageBalance',
  'Employment status': 'employmentStatus',
  'Income details': 'incomeDetails',
  'Account holder name': 'name',
  'IFSC code': 'ifscCode',
  'Bank name': 'bankName',
  'Account type': 'accountType',
  'Transaction reference no.': 'transactionReferenceNo',
  'Account number': 'accountNumber',
  'Mobile numbers (linked)': 'phone', // Updated for UPI Payment App, Lending App, Insurance App, InvestSmart
  'Balance inquiry': 'balance',
  'Email IDs (linked)': 'email', // Updated for UPI Payment App, Bill Payment App, Insurance App, InvestSmart
  'CIF / Customer ID': 'cif',
  'All linked account numbers': 'linkedAccounts',
  'Account type (linked)': 'accountTypeLinked',
  'Demographics (name, DOB, gender, address)': 'demographics',
  'Financial history (income, investments, loans)': 'financialHistory',
  'Credit report summary': 'creditReportSummary',
  'Policy type requested': 'policyTypeRequested',
  'Address': 'address', // For Lending App, InvestSmart
  'Nominee details': 'nomineeDetails',
  'Health records summary': 'healthRecordsSummary',
  'Existing insurance policies': 'existingInsurancePolicies',
  'Investment portfolio value': 'investmentPortfolioValue',
  'Bank account number': 'bankAccountNumber', // For Lending App, InvestSmart
  'Investment account ID': 'investmentAccountId',
  'Transaction history (investment)': 'transactionHistoryInvestment',
  'Portfolio holdings': 'portfolioHoldings',
  'Capital gains/losses': 'capitalGainsLosses',
  'Risk profile assessment': 'riskProfile',
  'Income source details': 'incomeSourceDetails',
  'Assessment Year': 'assessmentYear',
  'Salary slips/Form 16': 'salarySlips',
  'TDS details': 'tdsDetails',
  'Loan interest certificates': 'loanInterestCertificates',
  'Property address': 'propertyAddress',
  'Current residential address': 'address',
  'Employment details': 'employmentDetails',
  'Existing loan details': 'existingLoanDetails',
  'Bank statements (last 12 months)': 'bankStatements',
  'Income tax returns (last 3 years)': 'incomeTaxReturns',
  'Existing liabilities (loans, credit cards)': 'existingLiabilities',
  'Property valuation reports': 'propertyValuationReports',
  'Wallet ID': 'walletId',
  'Transaction timestamp': 'transactionTimestamp',
  'Wallet transaction history': 'walletTransactionHistory',
  'Available wallet balance': 'availableWalletBalance',
  'Linked bank account number (masked)': 'linkedBankAccountNumber', // For PaySwift Wallet
  'Linked bank account number': 'linkedBankAccountNumber', // New mapping for renamed column
  'UPI ID': 'upiId',
};


// Helper function to mask sensitive data
const maskData = (field: string, value: any): string => {
  if (value === undefined || value === null || value === '') return 'N/A';
  const strValue = String(value);

  switch (field) {
    case 'Account number':
    case 'Bank account number':
    case 'Linked bank account number (masked)': // Keep this case for original masking logic
    case 'Linked bank account number': // Add new case for renamed column
      // Example: 1234567890123456 -> 12xxxxxx3456
      if (strValue.length > 8) {
        const visibleStart = strValue.substring(0, 2);
        const visibleEnd = strValue.substring(strValue.length - 4);
        const maskedPart = 'x'.repeat(strValue.length - 6); // Total length - 2 (start) - 4 (end)
        return `${visibleStart}${maskedPart}${visibleEnd}`;
      }
      return 'xxxx'; // Fallback for short numbers
    case 'Mobile numbers (linked)':
      // Example: +91 9876543210 -> +91 xxxxx643210
      if (strValue.length > 7) { // Assuming '+91 ' is 4 chars, need at least 4 more for masking
        const countryCode = strValue.substring(0, 4); // "+91 "
        const visibleEnd = strValue.substring(strValue.length - 4);
        const maskedPartLength = strValue.length - countryCode.length - visibleEnd.length;
        const maskedPart = 'x'.repeat(maskedPartLength);
        return `${countryCode}${maskedPart}${visibleEnd}`;
      }
      return 'xxxxxxxxx'; // Fallback for very short numbers
    case 'PAN':
      // Example: ABCDE1234F -> ABxxxxxF
      if (strValue.length >= 6) {
        const visibleStart = strValue.substring(0, 2);
        const visibleEnd = strValue.substring(strValue.length - 1);
        const maskedPart = 'x'.repeat(strValue.length - 3);
        return `${visibleStart}${maskedPart}${visibleEnd}`;
      }
      return 'xxxxxx';
    case 'Aadhaar number':
      // Example: 123456789012 -> xxxx xxxx 9012
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
      // Masking for address: "123 Main St, City, State Zip" -> "xxx Main St, xxxx, State Zip"
      const addressParts = strValue.split(', ');
      if (addressParts.length >= 3) {
        const maskedStreetNum = 'x'.repeat(addressParts[0].length);
        const maskedCity = 'x'.repeat(addressParts[1].length);
        return `${maskedStreetNum}, ${addressParts[0].split(' ')[1]} ${addressParts[0].split(' ')[2]}, ${maskedCity}, ${addressParts[2]}`;
      }
      return 'xxxxxxx'; // Generic mask for unparsed addresses
    case 'CIF / Customer ID':
      // Example: CIF0012345 -> CIFxxxx345
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
      // Example: varun@payswift -> vxxxx@payswift
      const upiParts = strValue.split('@');
      if (upiParts.length === 2 && upiParts[0].length > 1) {
        const maskedUsername = upiParts[0][0] + 'x'.repeat(upiParts[0].length - 1);
        return `${maskedUsername}@${upiParts[1]}`;
      }
      return 'x@x';
    default:
      return strValue; // Return raw for explicitly shared or if no specific mask rule
  }
};

// Helper function to generate filtered and masked customer data for the "Non-Capsulized" table
const getNonCapsulizedCustomerTableData = (service: any, customersToProcess: Customer[]) => {
  let headers: string[] = ['Name', 'Email', 'Phone']; // Base columns for all services

  // Add service-specific columns based on user's request
  switch (service.service) {
    case 'QuickLoan':
      headers = [...headers, 'Full name', 'Date of birth', 'PAN', 'Aadhaar number', 'Mobile numbers (linked)', 'Bank account number'];
      break;
    case 'DataBridge AA':
      headers = [...headers, 'Consent timestamp/status', 'CIF / Customer ID', 'All linked account numbers', 'Date of birth']; // Added DOB here for filtering
      break;
    case 'InvestSmart':
      headers = [...headers, 'Full name', 'PAN', 'Mobile numbers (linked)', 'Email IDs linked', 'Bank account number', 'Date of birth']; // Added DOB
      break;
    case 'PaySwift Wallet':
      headers = [...headers, 'Mobile numbers (linked)', 'Wallet ID', 'Transaction timestamp', 'Linked bank account number', 'Date of birth']; // Added DOB
      break;
    case 'Google Pay':
      headers = [...headers, 'Account holder name', 'IFSC code', 'Account type', 'Transaction reference no.', 'Account number', 'Mobile numbers (linked)', 'Date of birth']; // Added DOB
      break;
    default:
      break;
  }

  // Remove duplicates and maintain order (if a field is added multiple times, keep first occurrence)
  headers = Array.from(new Set(headers));

  return customersToProcess.map((customer: Customer) => {
    const row: { [key: string]: any } = {};

    headers.forEach(header => {
      let value: any;
      let isMasked = false;

      // Determine the actual key in the customer object
      let customerKey: string = '';
      if (header === 'Name' || header === 'Full name' || header === 'Account holder name') {
        customerKey = 'name';
      } else if (header === 'Email' || header === 'Email IDs linked') {
        customerKey = 'email';
      } else if (header === 'Phone' || header === 'Mobile numbers (linked)') {
        customerKey = 'phone';
      } else if (header === 'Linked bank account number') { // Use the new header name for mapping
        customerKey = 'linkedBankAccountNumber';
      } else if (header === 'Date of birth') { // Special handling for Date of birth
        customerKey = 'dateOfBirth';
      }
      else {
        // Use fieldKeyMap for other specific mappings, or default to camelCase
        customerKey = fieldKeyMap[header] || header.replace(/ /g, '').toLowerCase();
      }

      value = customer[customerKey];

      // Special handling for composite fields (if they are requested as columns)
      if (header === 'Demographics (name, DOB, gender, address)') {
          value = `${customer.name || 'N/A'}, ${customer.dateOfBirth || 'N/A'}, ${customer.gender || 'N/A'}, ${customer.address || 'N/A'}`;
      } else if (header === 'Financial history (income, investments, loans)') {
          value = `Income: ${customer.income || 'N/A'}, Inv: ${customer.investments || 'N/A'}, Loans: ${customer.loans || 'N/A'}`;
      }

      // Generate mock data if value is undefined or null (important for fields not directly in customer mock data)
      if (value === undefined || value === null) {
          switch(customerKey) {
              case 'ifscCode': value = 'BANK0000001'; break;
              case 'bankName': value = 'Mock Bank'; break;
              case 'accountType': value = 'Savings'; break;
              case 'transactionReferenceNo': value = 'TRX' + Math.floor(Math.random() * 100000); break;
              case 'accountNumber': value = '1234567890123456'; break;
              case 'balance': value = (Math.random() * 100000).toFixed(2); break;
              case 'pan': value = 'ABCDE1234F'; break;
              case 'aadhaar': value = '123456789012'; break;
              case 'creditScore': value = Math.floor(Math.random() * (850 - 300 + 1)) + 300; break;
              case 'monthlyAverageBalance': value = (Math.random() * 50000).toFixed(2); break;
              case 'employmentStatus': value = 'Employed'; break;
              case 'incomeDetails': value = (Math.random() * 100000).toFixed(2); break;
              case 'cif': value = 'CIF00' + Math.floor(Math.random() * 10); break;
              case 'linkedAccounts': value = ['ACC' + Math.floor(Math.random() * 100), 'ACC' + Math.floor(Math.random() * 100)]; break;
              case 'walletId': value = 'WLT' + Math.floor(Math.random() * 100); break;
              case 'transactionTimestamp': value = '2025-07-01 12:00:00'; break;
              case 'availableWalletBalance': value = (Math.random() * 5000).toFixed(2); break;
              case 'upiId': value = 'user' + Math.floor(Math.random() * 100) + '@upi'; break;
              case 'mobileNumberLinked': value = generateRandomPhoneNumber(customer.phone); break; // For PaySwift
              case 'portfolioHoldings': value = 'Stocks, Bonds'; break;
              case 'riskProfile': value = 'Moderate'; break;
              case 'dateOfBirth':
                  // Generate a random date of birth between 1970 and 2000
                  const startYear = 1970;
                  const endYear = 2000;
                  const year = Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
                  const month = Math.floor(Math.random() * 12) + 1;
                  const day = Math.floor(Math.random() * 28) + 1; // Max 28 to avoid issues with Feb
                  value = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  break;
              default: value = 'N/A';
          }
      }


      // Determine if masking is needed based on the user's specific masking requests for each service
      if (service.service === 'QuickLoan' && ['PAN', 'Aadhaar number', 'Mobile numbers (linked)', 'Bank account number'].includes(header)) {
        isMasked = true;
      } else if (service.service === 'DataBridge AA' && ['CIF / Customer ID', 'All linked account numbers'].includes(header)) {
        isMasked = true;
      } else if (service.service === 'InvestSmart' && ['Mobile numbers (linked)', 'Email IDs linked'].includes(header)) {
        isMasked = true;
      } else if (service.service === 'PaySwift Wallet' && ['Mobile numbers (linked)', 'Linked bank account number'].includes(header)) {
        isMasked = true;
      } else if (service.service === 'Google Pay' && ['Account number', 'Mobile numbers (linked)'].includes(header)) {
        isMasked = true;
      }


      row[header] = isMasked ? maskData(header, value) : value;
    });
    return row;
  });
};

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
              placeholder="Hey there! I'm your AI assistant who can smartly filter data based on your query. Enter your query here..."
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


function RequestedFieldsPanel({ request, onClose, onViewAllCustomers, panelType, onFilterData }: DetailsPanelProps) {
  const { useCase, requestedFields, service, website, thirdPartyName, customers, encryptedCustomers, status, confidentialFields } = request;
  const [query, setQuery] = useState('');
  const [loadingFilter, setLoadingFilter] = useState(false);
  const [filterError, setFilterError] = useState<string | null>(null);

  // Placeholder for Groq API Key - REPLACE THIS WITH YOUR ACTUAL GROQ API KEY
  const groqApiKey = ''; // <--- IMPORTANT: Replace this placeholder!

  // Initial non-capsulized data for the current service, always based on the encryptedCustomers
  // This ensures the table initially shows the masked/encrypted view.
  const initialNonCapsulizedData = getNonCapsulizedCustomerTableData(request, encryptedCustomers);

  const [filteredTableData, setFilteredTableData] = useState(initialNonCapsulizedData);

  // Reset filtered data when service changes
  useEffect(() => {
    setFilteredTableData(initialNonCapsulizedData);
    setQuery('');
    setFilterError(null);
  }, [request]); // Depend on request object to reset when a new service is selected

  const access: {
    explicitlyShare: string[];
    maskShare: string[];
    withConsent: string[];
  } = fieldAccessMatrix[useCase] || { explicitlyShare: [], maskShare: [], withConsent: [] };

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

  const handleQueryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(e.target.value);
    setFilterError(null); // Clear error on new input
  };

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

let queryOtpVerified = false;
let remainingQueryAttempts = 0;

const handleRunQuery = async () => {
  if (!query.trim()) {
    setFilteredTableData(initialNonCapsulizedData);
    setFilterError(null);
    return;
  }

  const userEnteredOtp = prompt("🔐 Enter the password:");
  if (userEnteredOtp !== '123456') {
    alert("❌ Invalid password. Query execution cancelled.");
    return;
  }

  setLoadingFilter(true);
  setFilterError(null);

  try {
    const originalCustomers = customers;

    const fieldKeyMap: Record<string, string> = {
      "dob": "dateOfBirth",
      "dateofbirth": "dateOfBirth",
      "age": "age",
      "name": "name",
      "email": "email",
      "mobile": "phone",
      "phone": "phone",
      "ifsc": "ifscCode",
      "ifsc code": "ifscCode",
      "pan": "pan",
      "aadhaar": "aadhaar",
      "aadhar": "aadhaar",
      "account no": "accountNumber",
      "acc no": "accountNumber",
      "balance": "balance",
      "txn ref": "transactionReferenceNo",
      "ref no": "transactionReferenceNo"
    };

    const prompt = `You are an assistant for filtering customer data in a tabular system.

Your sole task is to extract valid **row-level filters** from the user's query.
You are NOT allowed to extract or change which columns are displayed.

--- 
1. ✅ Valid Fields:
${Object.keys(originalCustomers[0] || {}).join(', ')}

2. ✅ Synonym Handling:
${Object.entries(fieldKeyMap).map(([k, v]) => `- "${k}" → "${v}"`).join('\n')}

3. ✅ Filter Types:

- Text:
  Use these operators: includes (default), startsWith, endsWith, equals (=)
  You can also support multiple values, such as:
    - "Ravi and Mohit"
    - "Ravi, Mohit"
    - "Mohit | Ravi"
  In such cases, return:
    {
      "type": "text",
      "field": "name",
      "operator": "includes",
      "value": ["Ravi", "Mohit"]
    }

- Numeric:
  Supported operators: >, <, >=, <=, =

- Age:
  Convert statements like "age > 30" to:
    {
      "type": "dateRange",
      "field": "dateOfBirth",
      "minAge": 30
    }

- Date of Birth (or birth range):
  If user says "born between 1980 and 1990", convert to:
    {
      "type": "dateRange",
      "field": "dateOfBirth",
      "startDate": "1980-01-01",
      "endDate": "1990-12-31"
    }

4. ✅ Output Format:
\`\`\`json
{
  "filter": {
    "type": "text" | "numeric" | "dateRange",
    "field": "fieldName",
    "operator": "=" | ">" | "<" | ">=" | "<=" | "includes" | "startsWith",
    "value": string | number | string[]
    "startDate": "YYYY-MM-DD",
    "endDate": "YYYY-MM-DD",
    "minAge": number,
    "maxAge": number
  }
}
\`\`\`

If it’s not a row-level filter query, return:
\`\`\`json
{ "error": "Only filtering queries like 'age > 30' or 'name includes Ravi' are supported." }
\`\`\`

---  
User query: "${query}"`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${groqApiKey}`
  },
  body: JSON.stringify({
    model: "llama3-8b-8192",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" }
  })
});

const result = await response.json();

if (!result.choices || !result.choices[0].message?.content) {
  throw new Error("No valid response from Groq.");
}

const jsonResponse = JSON.parse(result.choices[0].message.content);

if (jsonResponse.error) {
  setFilterError(jsonResponse.error);
  setFilteredTableData(initialNonCapsulizedData);
  return;
}

const filter = jsonResponse.filter;
let filtered = [...originalCustomers];

if (filter.type === 'dateRange') {
  const { startDate, endDate, minAge, maxAge } = filter;

  filtered = filtered.filter(c => {
    if (!c.dateOfBirth) return false;
    const dob = new Date(c.dateOfBirth);

    if (startDate && endDate) {
      const s = new Date(startDate);
      const e = new Date(endDate);
      e.setHours(23, 59, 59, 999);
      return dob >= s && dob <= e;
    }

    if (minAge !== undefined || maxAge !== undefined) {
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }

      if (minAge && age < minAge) return false;
      if (maxAge && age > maxAge) return false;
      return true;
    }

    return false;
  });

} else if (filter.type === 'numeric') {
  const { field, operator, value } = filter;
  const actualKey = fieldKeyMap[field.toLowerCase()] || field;

  filtered = filtered.filter(row => {
    let rowVal: any = row[actualKey];

    if (field.toLowerCase() === 'age' && row.dateOfBirth) {
      const dob = new Date(row.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      rowVal = age;
    }

    if (rowVal === undefined || rowVal === null) return false;

    switch (operator) {
      case '=': return Number(rowVal) === Number(value);
      case '>': return Number(rowVal) > Number(value);
      case '<': return Number(rowVal) < Number(value);
      case '>=': return Number(rowVal) >= Number(value);
      case '<=': return Number(rowVal) <= Number(value);
      default: return false;
    }
  });

} else if (filter.type === 'text') {
  const { field, operator, value } = filter;
  const actualKey = fieldKeyMap[field.toLowerCase()] || field;

  filtered = filtered.filter(row => {
    const rowValue = row[actualKey];
    if (!rowValue) return false;

    if (Array.isArray(value)) {
      return value.some((v: string) =>
        String(rowValue).toLowerCase().includes(v.toLowerCase())
      );
    } else {
      return String(rowValue).toLowerCase().includes(String(value).toLowerCase());
    }
  });
} else {
  setFilterError("❌ Unsupported filter type returned by LLM.");
  setFilteredTableData(initialNonCapsulizedData);
  return;
}

const finalDisplayedData = getNonCapsulizedCustomerTableData(request, filtered);
setFilteredTableData(finalDisplayedData);


    const finalMasked = getNonCapsulizedCustomerTableData(request, filtered);
    setFilteredTableData(finalMasked);
  } catch (error: any) {
    console.error(error);
    setFilterError(error.message || 'Unexpected error. Please try again.');
    setFilteredTableData(initialNonCapsulizedData);
  } finally {
    setLoadingFilter(false);
  }
};

  const handleClearQuery = () => {
    setQuery('');
    setFilteredTableData(initialNonCapsulizedData); // Reset to initial masked data
    setFilterError(null);
  };


  const displayedCustomers = customers.slice(0, 5);
  const hasMoreCustomers = customers.length > 5;

let otpAttempts = 0;
let otpLocked = false;

const handleSecureDownload = async () => {
  const service = totalapprovedServices[0]; // Or use selectedService logic

  if (!service) {
    alert('❌ No service selected or available.');
    return;
  }

  const encryptedData = service.customers;

  // OTP Lock Logic
  if (otpLocked) {
    alert('🔒 OTP verification locked. You cannot try again.');
    return;
  }

  while (otpAttempts < 3) {
    const otp = prompt('🔐 Enter the 6-digit OTP sent to your email:');

    if (otp === '123456') {
      break; // Valid OTP, exit loop
    } else {
      otpAttempts++;
      alert(`❌ Incorrect OTP! (${otpAttempts}/3)`);
    }

    if (otpAttempts >= 3) {
      otpLocked = true;
      alert('🔒 Too many failed attempts. OTP prompt is now locked permanently.');
      return;
    }
  }

  try {
    const response = await fetch('http://localhost:3000/api/secure/generate-secure-html', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        serviceName: service.service,
        encryptedData,
        password: '123456', // Hardcoded password same as OTP if needed
      }),
    });

    if (!response.ok) throw new Error(`Server Error: ${response.status}`);

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${service.service.replace(/\s+/g, '_')}_secure.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    alert(`✅ Downloaded secured HTML for ${service.service}`);
  } catch (err) {
    console.error(err);
    alert('❌ Failed to generate secure file');
  }
};

const fetchApprovedServices = async () => {
  const otp = prompt('🔐 Enter OTP to fetch approved services:');

  try {
    const res = await fetch('/api/secure/get-approved-services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ otp }),
    });

    if (!res.ok) {
      const { error } = await res.json();
      alert(error || 'Unknown error');
      return;
    }

    const data = await res.json();
    console.log('✅ Services:', data.services);
    alert('✅ Approved services fetched successfully. Check console for data.');
  } catch (err) {
    alert('❌ Failed to fetch approved services');
    console.error(err);
  }
};



  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50 font-inter">
      <div className={`bg-white p-6 rounded-lg shadow-xl w-full ${panelType === 'approved' ? 'max-w-6xl' : 'max-w-xl'} max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 opacity-100`}>
        <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
          {panelType === 'dashboard' ? 'Request Details' : 'Non-Capsulized Customer Details'}
        </h3>
        <div className="space-y-4 text-gray-700">
          {panelType === 'dashboard' && (
            <>
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
                {hasMoreCustomers && (
                  <button
                    className="mt-2 text-blue-600 hover:underline text-sm font-medium"
                    onClick={() => onViewAllCustomers(customers)}
                  >
                    View all ({customers.length})
                  </button>
                )}
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

              {status === 'Rejected' && confidentialFields && confidentialFields.length > 0 && (
                <div>
                  <div className="flex flex-wrap gap-3 mt-4">
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
            </>
          )}

          {panelType === 'approved' && (
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left Side: Non-Capsulized Customer Table */}
              <div className="flex-1 lg:w-2/3">
                <h4 className="text-xl font-semibold mb-2">Customer Data Access</h4>
                <div className="overflow-x-auto overflow-y-auto max-h-[60vh] border border-gray-200 rounded-lg shadow-sm">
                  <table className="min-w-full bg-white divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        {Object.keys(filteredTableData[0] || {}).map((header, idx) => (
                          <th key={idx} className="py-2 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {loadingFilter ? (
                        <tr>
                          <td colSpan={Object.keys(filteredTableData[0] || {}).length} className="py-4 text-center text-gray-500">
                            Loading...
                          </td>
                        </tr>
                      ) : filterError ? (
                        <tr>
                          <td colSpan={Object.keys(filteredTableData[0] || {}).length} className="py-4 text-center text-red-500">
                            Error: {filterError}
                          </td>
                        </tr>
                      ) : filteredTableData.length > 0 ? (
                        filteredTableData.map((row: any, rowIndex: number) => (
                          <tr key={rowIndex} className="hover:bg-gray-50">
                            {Object.keys(row).map((header, colIndex) => (
                              <td key={colIndex} className="py-2 px-4 text-sm text-gray-800">
                                {row[header]}
                              </td>
                            ))}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={Object.keys(initialNonCapsulizedData[0] || {}).length} className="py-4 text-center text-gray-500">
                            No customers found matching your query.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {/* Query section for this table */}
                <div className="mt-4">
                  <label htmlFor="approvedCustomerQuery" className="block text-sm font-medium text-gray-700 mb-1">Hey there! I'm your AI assistant who can smartly filter data based on your query. Enter your query here...</label>
                  <textarea
                    id="approvedCustomerQuery"
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 bg-gray-50"
                    value={query}
                    onChange={handleQueryChange}
                    placeholder="e.g., 'show customers whose age > 35' or 'name contains Ravi', 'born in 1990-1996', 'balance > 100000'"
                  ></textarea>
                  <div className="mt-3 flex space-x-2 justify-end">
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 ease-in-out shadow-md"
                      onClick={handleRunQuery}
                      disabled={loadingFilter}
                    >
                      {loadingFilter ? 'Processing...' : 'Run Query'}
                    </button>
                    <button
                      className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-200 ease-in-out shadow-md"
                      onClick={handleClearQuery}
                      disabled={loadingFilter}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Side: Options (Share) */}
              <div className="lg:w-1/3 space-y-6">

                {/* Share Section */}
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                  <h5 className="text-lg font-semibold mb-3 text-gray-800">Share Data</h5>
                  <div className="space-y-2">
                    <button
                      className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                      onClick={fetchApprovedServices}
                    >
                      <span className="mr-2">🔌</span> API Access
                    </button>

                    <button
                      onClick={() => handleSecureDownload()}
                      className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      <span className="mr-2">📥</span> Download Secure Data
                    </button>
                  </div>
                </div>
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

const ApprovedPage = () => {
  const [selectedService, setSelectedService] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showAllCustomersModal, setShowAllCustomersModal] = useState(false);
  const [allCustomersData, setAllCustomersData] = useState<Customer[]>([]);
  const [activeCapsuleType, setActiveCapsuleType] = useState<'demo' | 'real' | null>(null);
  const [activeRequest, setActiveRequest] = useState<any>(null);
  const [nexonRequest, setNexonRequest] = useState<any>(null);
  const [showFaceGate, setShowFaceGate] = useState(false);
  const [pendingService, setPendingService] = useState<any | null>(null);


  const openCapsule = (type: 'demo' | 'real', requestData: any) => {
    setActiveCapsuleType(type);
    setActiveRequest(requestData);
  };

  const closeCapsule = () => {
    setActiveCapsuleType(null);
    setActiveRequest(null);
  };

  const handleRowClick = (service: any) => {
    // Find the corresponding encrypted version of the service's customers
    const encryptedServiceEntry = approvedServicesEncrypted.find(
      (s) => s.service === service.service
    );

    // Prepare the service object to be passed, including both decrypted and encrypted customers
    const serviceWithData = {
      ...service,
      customers: service.customers, // Original, decrypted customers
      encryptedCustomers: encryptedServiceEntry?.customers || [], // Encrypted customers
    };

    if (shouldAllowNonCapAccess()) {
      setSelectedService(serviceWithData);
      setShowDetails(true);
    } else {
      setPendingService(serviceWithData); // Pass the service with both customer types
      setShowFaceGate(true); // trigger face verification panel
    }
  };


  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedService(null);
  };

  const handleViewAllCustomers = (customers: Customer[]) => {
    setAllCustomersData(customers);
    setShowAllCustomersModal(true);
  };

  const handleCloseAllCustomersModal = () => {
    setShowAllCustomersModal(false);
    setAllCustomersData([]);
  };

  const handleFilterCustomerData = async (query: string, allData: any[]) => {
    console.log("Filtering data with query:", query, "on data:", allData);
    // This function is passed down but the actual filtering logic is now within RequestedFieldsPanel
  };

  const getFieldStatus = (field: string, useCase: UseCaseType) => {
  const access = fieldAccessMatrix[useCase];
  if (!access) return { label: 'Unknown', color: 'gray' };
  if (access.explicitlyShare.includes(field)) {
    return { label: 'Bank Approved', color: 'green' };
  } else if (access.maskShare.includes(field)) {
    return { label: 'Mask Share', color: 'blue' };
  } else {
    return access.withConsent.includes(field)
      ? { label: 'With Consent', color: 'orange' }
      : { label: 'Confidential', color: 'red' };
  }
};

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-inter">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Approved Service Requests</h2>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Service</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Use Case</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Status</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Website</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Third Party</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Non Capsule</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Capsule</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Actions with Nexon</th>
              </tr>
            </thead>
            <tbody>
              {approvedServices.map((service, index) => {
                const isCapsulized = ['DataBridge AA', 'InvestSmart', 'PaySwift Wallet'].includes(service.service);

                return (
                  <tr key={index} className="border-b last:border-b-0 hover:bg-gray-50 transition-colors duration-150">
                    <td className="py-3 px-4 text-sm font-medium text-gray-800">{service.service}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{service.useCase}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${service.status === 'Accepted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {service.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-blue-600 hover:underline">
                      <a
                        href={service.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          if (service.webAccess === true) {
                            e.preventDefault();
                            setNexonRequest(service);
                          }
                        }}
                      >
                        {service.website}
                      </a>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">{service.thirdPartyName}</td>
                    <td className="py-3 px-4 text-sm">
                      <button
                        onClick={() => handleRowClick(service)} // Pass the original service object
                        className="text-indigo-600 hover:text-indigo-900 px-4 py-1 text-xs font-medium rounded-md shadow-sm bg-gray-100 text-gray-600 hover:bg-gray-200"
                      >
                        View Data & Query
                      </button>
                    </td>
                    
                    <td className="py-3 px-4 text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openCapsule('demo', service)}
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-purple-600 hover:bg-purple-700"
                        >
                          Demo Capsule
                        </button>
                        <button
                          onClick={() => openCapsule('real', service)}
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-purple-700 bg-purple-100 hover:bg-purple-200"
                        >
                          Real Capsule
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <button
                        onClick={() => setNexonRequest(service)}
                        className="inline-flex items-center justify-center px-4 py-1 text-xs font-medium rounded-md shadow-sm bg-gray-100 text-gray-600 hover:bg-gray-200"
                      >
                        Chat with Nexon
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Close the conditional check */}

      {/* Modals */}
      {showDetails && selectedService && (
        <RequestedFieldsPanel
          request={{
            ...selectedService,
            customers: selectedService.customers || [], // Pass decrypted customers
            encryptedCustomers: selectedService.encryptedCustomers || [], // Pass encrypted customers
          }}
          onClose={handleCloseDetails}
          onViewAllCustomers={handleViewAllCustomers}
          panelType="approved"
          onFilterData={handleFilterCustomerData}
        />
      )}

      {showAllCustomersModal && (
        <AllCustomersModal
          customers={allCustomersData}
          onClose={handleCloseAllCustomersModal}
          onBack={handleCloseAllCustomersModal}
        />
      )}

      {showFaceGate && pendingService && (
        <NonCapsulizedPanel
          isOpen={true}
          onClose={() => {
            setShowFaceGate(false);
            setPendingService(null);
          }}
          serviceName={pendingService.service}
          useCase={pendingService.useCase}
          // customers={pendingService.customers}
          requestedFields={pendingService.requestedFields}
          // encryptedCustomers={pendingService.encryptedCustomers} 
        />
      )}

      {activeCapsuleType === 'demo' && activeRequest && (
        <DemoObserverCapsule request={activeRequest} onClose={closeCapsule} />
      )}

      {activeCapsuleType === 'real' && activeRequest && (
        <TestObserverCapsule request={activeRequest} onClose={closeCapsule} />
      )}

      {nexonRequest && (
        <CapsuleChat
          serviceName={nexonRequest.service}
          requestedFields={nexonRequest.requestedFields}
          onClose={() => setNexonRequest(null)}
        />
      )}
    </div>
  );
};

export default ApprovedPage;



