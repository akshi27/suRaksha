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
import Fuse from 'fuse.js';

type CustomerDataForDisplay = {
  [field: string]: string | number | null | undefined;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
  useCase: UseCaseType; // Use the imported UseCaseType
  // customers: DecryptedCustomerType[]; // No longer passed as prop, generated internally
  // encryptedCustomers: EncryptedCustomer[]; // No longer passed as prop, generated internally
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
  'Account holder name': 'decryptedName', // 'Account holder name' also maps to decryptedName
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
    case 'Email IDs (linked)': // Corrected field name
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

// --- Start of Data Transformation Functions (from generated_json_data) ---
function generateRandomString(length: number): string {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function generateRandomNumberString(length: number): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10);
  }
  return result;
}

function generateRandomEmail(name: string): string {
  const domain = ['example.com', 'test.org', 'mail.net'][Math.floor(Math.random() * 3)];
  return `${name.toLowerCase().replace(/\s/g, '')}${generateRandomNumberString(3)}@${domain}`;
}

function generateRandomPhoneNumber(originalPhone: string): string {
    if (originalPhone && originalPhone.startsWith('+')) {
        return originalPhone.substring(0, 4) + 'x'.repeat(originalPhone.length - 4);
    }
    return 'x'.repeat(10);
}

function generateRandomAccountNumber(): string {
    return 'x'.repeat(12) + generateRandomNumberString(4);
}

function generateRandomPan(): string {
    return generateRandomString(2).toUpperCase() + 'x'.repeat(5) + generateRandomString(1).toUpperCase();
}

function generateRandomAadhaar(): string {
    return 'xxxx xxxx ' + generateRandomNumberString(4);
}

function generateRandomIfscCode(): string {
    return generateRandomString(4).toUpperCase() + '0' + generateRandomString(6).toUpperCase();
}

function generateRandomTransactionRefNo(): string {
    return 'TRN' + generateRandomNumberString(8);
}

function generateRandomCif(): string {
    return 'CIF' + generateRandomNumberString(5);
}

function generateRandomWalletId(): string {
    return 'WLT' + generateRandomNumberString(5);
}

function generateRandomUpiId(name: string): string {
    return `${name.toLowerCase().replace(/\s/g, '')}${generateRandomNumberString(2)}@upi`;
}

function generateRandomAddress(): string {
    const streetNum = generateRandomNumberString(3);
    const streetName = generateRandomString(5);
    const city = generateRandomString(6);
    const state = generateRandomString(4);
    const pincode = generateRandomNumberString(6);
    return `${streetNum}, ${streetName} Street, ${city}, ${state} - ${pincode}`;
}

// Original approvedServices data (now internal to the component for transformation)
const originalApprovedServices = [
  {
    service: 'Google Pay',
    useCase: 'UPI Payment App',
    status: 'Accepted',
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
// --- End of Data Transformation Functions (from generated_json_data) ---


export function NonCapsulizedPanel({
  isOpen,
  onClose,
  serviceName,
  useCase,
  requestedFields
}: Props) {
  const [faceVerified, setFaceVerified] = useState(false);
  const [status, setStatus] = useState('Initializing...');
  const [simulateResult, setSimulateResult] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [generatedPassword] = useState('1234'); // Static for now

  // Internal states for customers (decrypted) and encryptedCustomers
  const [internalCustomers, setInternalCustomers] = useState<DecryptedCustomerType[]>([]);
  const [internalEncryptedCustomers, setInternalEncryptedCustomers] = useState<EncryptedCustomer[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const idleTimer = useRef<NodeJS.Timeout | null>(null);

  // Effect to transform data on component mount
  useEffect(() => {
    const transformedServicesData = originalApprovedServices.map(serviceItem => {
      const transformedCustomers = serviceItem.customers.map(customer => {
        const newCustomer: any = {}; // Use any for dynamic property assignment
        for (const key in customer) {
          if (customer.hasOwnProperty(key)) {
            const originalValue = (customer as any)[key]; // Cast to any to access dynamically

            // Add decrypted field
            newCustomer[`decrypted${key.charAt(0).toUpperCase() + key.slice(1)}`] = originalValue;

            // Add encrypted field with random data
            let encryptedValue;
            switch (key) {
              case 'name':
                encryptedValue = generateRandomString(6);
                break;
              case 'email':
                encryptedValue = generateRandomEmail(customer.name);
                break;
              case 'phone':
              case 'mobileNumberLinked':
                encryptedValue = generateRandomPhoneNumber(originalValue);
                break;
              case 'accountNumber':
              case 'bankAccountNumber':
              case 'linkedBankAccountNumber':
                encryptedValue = generateRandomAccountNumber();
                break;
              case 'pan':
                encryptedValue = generateRandomPan();
                break;
              case 'aadhaar':
                encryptedValue = generateRandomAadhaar();
                break;
              case 'ifscCode':
                encryptedValue = generateRandomIfscCode();
                break;
              case 'transactionReferenceNo':
                encryptedValue = generateRandomTransactionRefNo();
                break;
              case 'cif':
                encryptedValue = generateRandomCif();
                break;
              case 'walletId':
                encryptedValue = generateRandomWalletId();
                break;
              case 'upiId':
                encryptedValue = generateRandomUpiId(customer.name);
                break;
              case 'address':
                encryptedValue = generateRandomAddress();
                break;
              case 'balance':
              case 'monthlyAverageBalance':
              case 'availableWalletBalance':
              case 'income':
              case 'investments':
              case 'loans':
              case 'creditScore':
              case 'investmentPortfolioValue':
              case 'capitalGainsLosses':
                encryptedValue = '₹' + generateRandomNumberString(Math.floor(Math.random() * 3) + 3) + ',' + generateRandomNumberString(3); // Simulate currency
                break;
              case 'age':
                encryptedValue = generateRandomNumberString(2);
                break;
              case 'dateOfBirth':
                encryptedValue = `xxxx-xx-${generateRandomNumberString(2)}`;
                break;
              case 'gender':
                encryptedValue = generateRandomString(1); // M/F/O
                break;
              case 'employmentStatus':
                encryptedValue = generateRandomString(8);
                break;
              case 'accountType':
              case 'accountTypeLinked':
                encryptedValue = generateRandomString(5);
                break;
              case 'bankName':
                encryptedValue = generateRandomString(7);
                break;
              case 'linkedAccounts':
                encryptedValue = (originalValue as string[]).map(() => generateRandomAccountNumber());
                break;
              case 'transactionTimestamp':
                encryptedValue = `xxxx-xx-xx ${generateRandomNumberString(2)}:${generateRandomNumberString(2)}:${generateRandomNumberString(2)}`;
                break;
              case 'walletTransactionHistory':
              case 'portfolioHoldings':
              case 'riskProfile':
              case 'investmentAccountId':
              case 'transactionHistoryInvestment':
              case 'incomeSourceDetails':
              case 'assessmentYear':
              case 'salarySlips':
              case 'tdsDetails':
              case 'loanInterestCertificates':
              case 'propertyAddress':
              case 'employmentDetails':
              case 'existingLoanDetails':
              case 'bankStatements':
              case 'incomeTaxReturns':
              case 'existingLiabilities':
              case 'propertyValuationReports':
              case 'demographics':
              case 'financialHistory':
              case 'creditReportSummary':
              case 'policyTypeRequested':
              case 'nomineeDetails':
              case 'healthRecordsSummary':
              case 'existingInsurancePolicies':
                encryptedValue = 'x'.repeat(originalValue.toString().length > 10 ? 10 : originalValue.toString().length); // Generic masking
                break;
              default:
                encryptedValue = 'x'.repeat(String(originalValue).length);
            }
            newCustomer[`encrypted${key.charAt(0).toUpperCase() + key.slice(1)}`] = encryptedValue;
          }
        }
        return newCustomer as EncryptedCustomer; // Cast to EncryptedCustomer
      });
      return { ...serviceItem, customers: transformedCustomers };
    });

    // Find the current service and its customers
    const currentServiceData = transformedServicesData.find(svc => svc.service === serviceName);

    if (currentServiceData) {
      // Separate decrypted and encrypted customers for internal use
      const decryptedCustomersForFilter: DecryptedCustomerType[] = currentServiceData.customers.map(encCust => {
        const decCust: any = {};
        for (const key in encCust) {
          if (key.startsWith('decrypted')) {
            const originalKey = key.replace('decrypted', '');
            decCust[originalKey.charAt(0).toLowerCase() + originalKey.slice(1)] = (encCust as any)[key];
          }
        }
        return decCust as DecryptedCustomerType;
      });

      setInternalCustomers(decryptedCustomersForFilter);
      setInternalEncryptedCustomers(currentServiceData.customers);
    }

  }, [serviceName]); // Re-run if serviceName changes

  // Determine headers for the table based on requested fields and common fields
  const getTableHeaders = () => {
    // Ensure the first four columns are 'Full name', 'Email IDs (linked)', 'Mobile numbers (linked)', and 'Account holder name'
    let headers: string[] = ['Full name', 'Email IDs (linked)', 'Mobile numbers (linked)', 'Account holder name'];
    // Add requested fields that are not already in the base headers, ensuring uniqueness
    requestedFields.forEach(field => {
      if (!headers.includes(field)) {
        headers.push(field);
      }
    });
    // Add 'Age' if 'Date of birth' is present and not already added
    if (headers.includes('Date of birth') && !headers.includes('Age')) {
      headers.push('Age');
    }
    return Array.from(new Set(headers)); // Use Set to ensure uniqueness
  };

  const uniqueHeaders = getTableHeaders();

  // Function to prepare data for the table, applying masking to relevant fields
  const prepareTableDataForDisplay = (dataToProcess: EncryptedCustomer[], currentUseCase: UseCaseType): CustomerDataForDisplay[] => {
    return dataToProcess.map(encryptedCustomer => {
      const row: CustomerDataForDisplay = {};
      uniqueHeaders.forEach((header, headerIndex) => { // Use headerIndex to determine column position
        let value: any;
        let isMasked = false;

        // Determine the key in the decrypted customer object based on the header
        let decryptedKeyName = fieldKeyMap[header];
        let encryptedKeyName = `encrypted${decryptedKeyName ? decryptedKeyName.replace('decrypted', '') : ''}`; // Construct encrypted key name

        // If the header is 'Age', calculate it from 'decryptedDateOfBirth'
        if (header === 'Age' && encryptedCustomer.decryptedDateOfBirth) {
          value = calculateAge(encryptedCustomer.decryptedDateOfBirth);
        } else if (decryptedKeyName && (encryptedCustomer as any).hasOwnProperty(decryptedKeyName)) {
            // Access the decrypted value directly if available
            value = (encryptedCustomer as any)[decryptedKeyName];
        } else {
            // Fallback to 'N/A' if no matching decrypted field is found
            value = 'N/A';
        }

        // Determine if masking is needed:
        // Columns 0-3 (the first four) should NEVER be masked.
        // For columns 4 and beyond, apply masking based on the access matrix AND if an encrypted value exists.
        if (headerIndex >= 4) { // For the 5th column and beyond (index 4, 5, ...)
            const access = fieldAccessMatrix[currentUseCase];
            // If the access matrix says to mask, AND we have an encrypted version of this field
            if (access && access.maskShare.includes(header) && (encryptedCustomer as any).hasOwnProperty(encryptedKeyName)) {
              isMasked = true;
              value = (encryptedCustomer as any)[encryptedKeyName]; // Use the pre-generated encrypted value
            }
        }
        // If headerIndex is less than 4, isMasked remains false, and we use the decrypted value, as intended.

        row[header] = value ?? '-'; // Use the determined value (decrypted or encrypted)
      });
      return row;
    });
  };

  // Initial table data is based on the internalEncryptedCustomers, processed for display
  // This needs to be called after internalEncryptedCustomers is populated
  const [filteredTableData, setFilteredTableData] = useState<CustomerDataForDisplay[]>([]);

  useEffect(() => {
    if (internalEncryptedCustomers.length > 0) {
      setFilteredTableData(prepareTableDataForDisplay(internalEncryptedCustomers, useCase));
    }
  }, [internalEncryptedCustomers, useCase]);


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
      customers: internalEncryptedCustomers, // Use internal encrypted customers
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

  // Filtering logic now uses the internal 'internalCustomers' (decrypted)
  const handleFilterData = () => {
    const lowerCaseQuery = query.trim().toLowerCase();
    if (!lowerCaseQuery) {
      // Reset to initial masked data based on internalEncryptedCustomers
      setFilteredTableData(prepareTableDataForDisplay(internalEncryptedCustomers, useCase));
      return;
    }

    const fuse = new Fuse(internalCustomers, { // Use internalCustomers (decrypted) for Fuse search
      keys: [
        'name', // Use original field names for Fuse search on decrypted data
        'email',
        'phone',
        'accountNumber',
        'pan',
        'aadhaar',
        // Add more decrypted fields if needed
      ],
      threshold: 0.3, // How fuzzy you want the match to be (0 = exact, 1 = loose)
    });

    const results = fuse.search(lowerCaseQuery);
    results.forEach(r => {
      console.log("Match:", r.item.name, "Score:", r.score); // Log original name
    });
    const filteredDecryptedCustomers = results.map(result => result.item);

    // Now, map these filtered decrypted customers back to their encrypted counterparts
    const filteredEncryptedCustomersForDisplay = filteredDecryptedCustomers.map(decryptedCustomer => {
      // Find the corresponding encrypted customer from the original internalEncryptedCustomers
      const matchingEncrypted = internalEncryptedCustomers.find(encCust =>
        // Assuming decryptedEmail is a reliable unique identifier for matching
        (encCust.decryptedEmail && decryptedCustomer.email === encCust.decryptedEmail) ||
        (encCust.decryptedName && decryptedCustomer.name === encCust.decryptedName)
      );
      // Return the encrypted version or a basic fallback if not found.
      return matchingEncrypted || {
        decryptedName: decryptedCustomer.name,
        decryptedEmail: decryptedCustomer.email,
        decryptedPhone: decryptedCustomer.phone,
        decryptedDateOfBirth: (decryptedCustomer as any).dateOfBirth, // Ensure DOB is carried over
        encryptedName: '', encryptedEmail: '', encryptedPhone: '' // Placeholder encrypted fields
      } as EncryptedCustomer;
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

