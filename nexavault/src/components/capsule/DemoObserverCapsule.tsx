// src/components/capsule/DemoObserverCapsule.tsx

import { useEffect, useRef, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';
// Assuming these paths are correct relative to your project structure
import { fieldAccessMatrix2 } from '../../lib/fieldAccessMatrix'; // Correctly imported
import { extractRelevantFieldsFromQuery, fieldSynonyms } from '../../utils/capsule/extractFieldsFromQuery';
import { generateDecryptScript } from '../../utils/decryption/generateDecryptScript';


// --- Type Declarations Moved to Top Level ---
export type TableRow = {
  name: string;
  email: string;
  phone: string;
  value: string;
};

export type CapsuleResponse =
  | string // For direct text responses (errors, general info)
  | {
      type: 'table'; // This MUST be the string literal 'table'
      query: string;
      service: string;
      fieldName: string;
      rows: TableRow[];
      disclaimer?: string; // Optional disclaimer for range-based filtering
    }
  | {
      type: 'otp_required'; // New type for OTP flow
      fieldKey: string;
      fieldName: string;
      message: string;
    };

interface Props {
  request: {
    service: string;
    requestedFields: string[];
  };
  onClose: () => void;
}

interface CustomerRecord {
  name: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  creditScore?: number;
  [key: string]: any; // Allow for flexible properties
}

// Helper to log queries for history/debugging
const logToCapsuleHistory = (query: string, response: string, service: string) => {
  const existingLog = JSON.parse(localStorage.getItem('capsuleQueryLog') || '[]');
  const timestamp = new Date().toISOString();

  const newEntry = {
    timestamp,
    service,
    query,
    response
  };

  localStorage.setItem('capsuleQueryLog', JSON.stringify([...existingLog, newEntry]));
};

// Simple hash function for consistent obfuscation (not cryptographic)
// This will generate the same short string for the same input value
const simpleHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36).substring(0, 8); // Short alphanumeric hash
};

const obfuscateDisplayValue = (value: string | undefined | null, type: 'name' | 'email' | 'phone' | 'general'): string => {
  if (!value || value === '—') return '—';

  const hashed = simpleHash(value);

  if (type === 'email') {
      // Create a dummy email format with the hash
      return `${hashed}@xyz.com`;
  }
  if (type === 'phone') {
      // Create a numeric-like string from the hash
      // Replace non-digits, pad with 0s, and take first 8 chars
      return hashed.replace(/\D/g, '').padStart(8, '0').substring(0, 8);
  }
  // For name and general types, just return the hash
  return hashed;
};


// --- DEMO DATA (UNCHANGED) ---
export const demoCapsuleCustomerData: Record<string, CustomerRecord[]> = {
  'Google Pay': [
    { name: 'Ravi Kumar', email: 'ravi.kumar@example.com', phone: '+91 9876543210', accountNumber: '1234567890123456', ifscCode: 'HDFC0001234', bankName: 'HDFC Bank', accountType: 'Savings', transactionReferenceNo: 'TRN12345', balanceInquiry: '₹50,000 available', linkedEmailIds: ['ravi.kumar@gmail.com'] },
    { name: 'Priya Singh', email: 'priya.singh@example.com', phone: '+91 8765432109', accountNumber: '6543210987654321', ifscCode: 'ICIC0005678', bankName: 'ICICI Bank', accountType: 'Current', transactionReferenceNo: 'TRN67890', balanceInquiry: '₹1,20,000 available', linkedEmailIds: ['priya.singh@gmail.com'] },
    { name: 'Mohit Sharma', email: 'mohit.shampoo@example.com', phone: '+91 7654321098', accountNumber: '9876543210123456', ifscCode: 'AXIS0009012', bankName: 'Axis Bank', accountType: 'Savings', transactionReferenceNo: 'TRN11223', balanceInquiry: '₹75,000 available', linkedEmailIds: ['mohit.sharma@gmail.com'] },
    { name: 'Anjali Gupta', email: 'anjali.gupta@example.com', phone: '+91 9123456789', accountNumber: '1029384756102938', ifscCode: 'PNB0001001', bankName: 'PNB Bank', accountType: 'Savings', transactionReferenceNo: 'TRN44556', balanceInquiry: '₹90,000 available', linkedEmailIds: ['anjali.gupta@gmail.com'] },
    { name: 'Deepak Verma', email: 'deepak.verma@example.com', phone: '+91 9012345678', accountNumber: '2938475610293847', ifscCode: 'SBI0002002', bankName: 'SBI Bank', accountType: 'Current', transactionReferenceNo: 'TRN77889', balanceInquiry: '₹1,50,000 available', linkedEmailIds: ['deepak.verma@gmail.com'] }
  ],
  'QuickLoan': [
    { name: 'Suresh Rao', email: 'suresh.rao@example.com', dateOfBirth: '1985-05-10', pan: 'ABCDE1234F', aadhaar: '123456789012', phone: '+91 9988776655', bankAccountNumber: '9876543210987654', creditScore: 780, monthlyAverageBalance: 25000, employmentStatus: 'Employed' },
    { name: 'Neha Joshi', email: 'neha.joshi@example.com', dateOfBirth: '1992-11-20', pan: 'FGHIJ5678K', aadhaar: '234567890123', phone: '+91 9876543210', bankAccountNumber: '1234567890123456', creditScore: 650, monthlyAverageBalance: 15000, employmentStatus: 'Self-Employed' },
    { name: 'Vijay Kumar', email: 'vijay.kumar@example.com', dateOfBirth: '1978-03-15', pan: 'KLMNO9012L', aadhaar: '345678901234', phone: '+91 8765432109', bankAccountNumber: '2345678901234567', creditScore: 720, monthlyAverageBalance: 30000, employmentStatus: 'Employed' },
    { name: 'Kavita Devi', email: 'kavita.devi@example.com', dateOfBirth: '1995-09-01', pan: 'PQRST3456M', aadhaar: '456789012345', phone: '+91 7654321098', bankAccountNumber: '3456789012345678', creditScore: 590, monthlyAverageBalance: 10000, employmentStatus: 'Unemployed' },
    { name: 'Rajesh Khanna', email: 'rajesh.khanna@example.com', dateOfBirth: '1980-01-25', pan: 'UVWXY7890N', aadhaar: '567890123456', phone: '+91 9123456789', bankAccountNumber: '4567890123456789', creditScore: 700, monthlyAverageBalance: 20000, employmentStatus: 'Employed' }
  ],
  'DataBridge AA': [
    { name: 'Anil Kumar', email: 'anil.kumar@example.com', dateOfBirth: '1970-01-01', gender: 'Male', address: '123 Lakeview Street, Bangalore', income: 120000, investments: 'Mutual Funds', loans: 'Home Loan', insurance: 'Life Insurance', creditReportSummary: 'Excellent', consentStatus: 'Granted', cif: 'CIF001', linkedAccounts: ['ACC123', 'ACC456'] },
    { name: 'Geeta Devi', email: 'geeta.devi@example.com', dateOfBirth: '1980-02-02', gender: 'Female', address: '456 Hilltop Road, Delhi', income: 90000, investments: 'Stocks', loans: 'Personal Loan', insurance: 'Health Insurance', creditReportSummary: 'Good', consentStatus: 'Granted', cif: 'CIF002', linkedAccounts: ['ACC789', 'ACC012'] },
    { name: 'Sanjay Gupta', email: 'sanjay.gupta@example.com', dateOfBirth: '1975-03-03', gender: 'Male', address: '789 Garden View, Mumbai', income: 150000, investments: 'Real Estate', loans: 'Car Loan', insurance: 'Travel Insurance', creditReportSummary: 'Very Good', consentStatus: 'Granted', cif: 'CIF003', linkedAccounts: ['ACC345', 'ACC678'] },
    { name: 'Priyanka Singh', email: 'priyanka.singh@example.com', dateOfBirth: '1988-04-04', gender: 'Female', address: '321 Lake Front, Pune', income: 70000, investments: 'Education Loan', insurance: 'Term Insurance', creditReportSummary: 'Fair', consentStatus: 'Granted', cif: 'CIF004', linkedAccounts: ['ACC901', 'ACC234'] }
  ],
  'InvestSmart': [
    { name: 'Sunil Das', email: 'sunil.das@example.com', phone: '+91 9870123456', pan: 'ABCDE1234F', bankAccountNumber: '1122334455667788', portfolioHoldings: 'AAPL, GOOG', riskProfile: 'Moderate' },
    { name: 'Preeti Singh', email: 'preeti.singh@example.com', phone: '+91 9988776655', pan: 'FGHIJ5678K', bankAccountNumber: '2233445566778899', portfolioHoldings: 'TSLA, MSFT', riskProfile: 'Aggressive' },
    { name: 'Gopal Reddy', email: 'gopal.reddy@example.com', phone: '+91 8765432109', pan: 'KLMNO9012L', bankAccountNumber: '3344556677889900', portfolioHoldings: 'AMZN, FB', riskProfile: 'Conservative' },
    { name: 'Ankita Sharma', email: 'ankita.sharma@example.com', phone: '+91 7654321098', pan: 'PQRST3456M', bankAccountNumber: '4455667788990011', portfolioHoldings: 'NFLX, NVDA', riskProfile: 'Moderate' }
  ],
  'PaySwift Wallet': [
    { name: 'Varun Sharma', email: 'varun.sharma@example.com', phone: '+91 9876501234', walletId: 'WLT001', transactionTimestamp: '2025-07-01 10:00:00', walletTransactionHistory: 'Sent ₹500, Rec ₹200', availableWalletBalance: 1500, linkedBankAccountNumber: '1111222233334444' },
    { name: 'Disha Patel', email: 'disha.patel@example.com', phone: '+91 9765401234', walletId: 'WLT002', transactionTimestamp: '2025-07-01 11:00:00', walletTransactionHistory: 'Sent ₹1000, Rec ₹500', availableWalletBalance: 2000, linkedBankAccountNumber: '5555666677778888' },
    { name: 'Karan Singh', email: 'karan.singh@example.com', phone: '+91 9654301234', walletId: 'WLT003', transactionTimestamp: '2025-07-01 12:00:00', walletTransactionHistory: 'Sent ₹200, Rec ₹100', availableWalletBalance: 800, linkedBankAccountNumber: '9999000011112222' },
    { name: 'Ritika Gupta', email: 'ritika.gupta@example.com', phone: '+91 9543201234', walletId: 'WLT004', transactionTimestamp: '2025-07-01 13:00:00', walletTransactionHistory: 'Sent ₹700, Rec ₹300', availableWalletBalance: 1200, linkedBankAccountNumber: '3333444455556666' },
    { name: 'Arjun Kumar', email: 'arjun.kumar@example.com', phone: '+91 9432101234', walletId: 'WLT005', transactionTimestamp: '2025-07-01 14:00:00', walletTransactionHistory: 'Sent ₹300, Rec ₹150', availableWalletBalance: 900, linkedBankAccountNumber: '7777888899990000' }
  ]
};

// --- NEW HELPER FUNCTION FOR NLP-LIKE FILTERING ---
interface FilterCondition {
  field: string;
  operator: string;
  value: string | number;
}

function calculateAge(dateOfBirth: string): number | null {
  if (!dateOfBirth) return null;
  const dob = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

// ✅ NEW HELPER: Parse range strings into numeric tuples
function parseRangeString(range: string): [number, number] | null {
    if (!range) return null;
    const cleaned = range.replace(/[^0-9–\-]/g, ''); // Remove currency symbols, etc.
    const parts = cleaned.split(/[–-]/); // Split by en-dash or hyphen
    if (parts.length !== 2) return null; // Ensure we have two parts for a range

    const low = parseInt(parts[0], 10);
    const high = parseInt(parts[1], 10);
    if (isNaN(low) || isNaN(high)) return null;
    return [low, high];
}


function parseQueryForFiltersAndConditions(query: string, availableFields: string[]): { nameFilters: string[] | null; conditions: FilterCondition[] } {
  const lowerQuery = query.toLowerCase();
  let nameFilters: string[] | null = null;
  const conditions: FilterCondition[] = [];

  // 1. Extract Multiple Names (e.g., "Ravi, Mohit and Anjali", "Ravi and Mohit")
  const namePattern = /(?:of|for|about)\s+((?:[a-z\s]+)(?:,\s*[a-z\s]+)*(?:\s+and\s+[a-z\s]+)?)/;
  let nameMatch = lowerQuery.match(namePattern);

  if (nameMatch && nameMatch[1]) {
    const namesString = nameMatch[1];
    nameFilters = namesString
      .split(/\s*,\s*|\s+and\s+/) // Split by commas or " and "
      .map(name => name.trim())
      .filter(name => name.length > 0)
      .map(name => name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')); // Capitalize
  } else {
    // Fallback: Try to find capitalized names that aren't keywords if no explicit pattern
    // This regex looks for capitalized words that are typically names (at least two words or one significant word)
    const potentialNames = query.match(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/g);
    if (potentialNames) {
        const allSynonyms: string[] = (Object.values(fieldSynonyms).flat() as string[]);
        // Filter out names that are actually field synonyms or common keywords
        const extractedNames = potentialNames.filter(pName =>
            !allSynonyms.some(syn => syn.toLowerCase() === pName.toLowerCase()) &&
            !['Ravi', 'Mohit', 'Anjali', 'Deepak', 'Suresh', 'Neha', 'Vijay', 'Kavita', 'Rajesh', 'Anil', 'Geeta', 'Sanjay', 'Priyanka', 'Sunil', 'Preeti', 'Gopal', 'Ankita', 'Varun', 'Disha', 'Karan', 'Ritika', 'Arjun', 'Priya'].every(n => pName.toLowerCase() !== n.toLowerCase()) // Basic check for known names not just capitalized words
        );
        if (extractedNames.length > 0) {
            nameFilters = extractedNames;
        }
    }
  }


  // 2. Extract Conditions (e.g., "credit score > 750", "age > 30", "balance > 50000")
  const conditionRegex = /(credit\s*score|age|balance|income|wallet\s*balance)\s*(>|<|>=|<=|=)\s*(\d+)/g;
  let match;
  while ((match = conditionRegex.exec(lowerQuery)) !== null) {
    let field = match[1].replace(/\s/g, '');
    if (field === 'creditscore') field = 'creditScore';
    if (field === 'age') field = 'dateOfBirth';
    if (field === 'balance' || field === 'walletbalance') {
      // Map to the specific balance field based on service context if known.
      // This will be resolved more definitively in processQuery.
      field = (lowerQuery.includes('payswift') || lowerQuery.includes('wallet')) ? 'availableWalletBalance' : 'balanceInquiry';
    }
    if (field === 'income') field = 'income';

    conditions.push({
      field: field,
      operator: match[2],
      value: parseFloat(match[3])
    });
  }

  return { nameFilters, conditions };
}


const processQuery = (query: string, service: string, customerData: CustomerRecord[], otpOverrideVerified: boolean = false): CapsuleResponse => {
  if (!customerData || customerData.length === 0) {
      return `Aww, shucks! Looks like I don't have any customer data for ${service} right now.`;
  }

  const queryLower = query.toLowerCase();

  const allCustomerKeys = customerData.length > 0 ? Object.keys(customerData[0]) : [];
  let { nameFilters, conditions } = parseQueryForFiltersAndConditions(query, allCustomerKeys);

  // --- NEW LOGIC: OTP-gated Confidential Fields based on ALL relevant fields ---
  const allExtractedFieldKeys = extractRelevantFieldsFromQuery(query, customerData[0]);

  let confidentialFieldRequiringOtp: { key: string; name: string } | null = null;
  for (const extractedKey of allExtractedFieldKeys) {
      const fieldDef = fieldAccessMatrix2.find(f => f.key === extractedKey);
      if (fieldDef && fieldDef.requiresOtp) {
          confidentialFieldRequiringOtp = { key: fieldDef.key, name: fieldDef.name };
          break; // Found one, no need to check others for OTP trigger
      }
  }

  if (confidentialFieldRequiringOtp && !otpOverrideVerified) {
      return {
          type: 'otp_required',
          fieldKey: confidentialFieldRequiringOtp.key,
          fieldName: confidentialFieldRequiringOtp.name,
          message: `🔐 Access to "${confidentialFieldRequiringOtp.name}" is super secure! It requires an OTP verification. An OTP has been sent to admin@nexavault.com. Please enter it below.`
      };
  }
  // --- END NEW OTP LOGIC ---


  // Determine the primary field to display based on keywords and extracted fields
  let primaryFieldKey: string | null = null;
  if (allExtractedFieldKeys.length > 0) {
      primaryFieldKey = allExtractedFieldKeys[0]; // Take the first relevant field as primary for display
  } else {
      // If no specific field was extracted, try to infer from common keywords
      if (queryLower.includes('balance')) {
          if (service === 'PaySwift Wallet' && allCustomerKeys.includes('availableWalletBalance')) {
              primaryFieldKey = 'availableWalletBalance';
          } else if (allCustomerKeys.includes('balanceInquiry')) {
              primaryFieldKey = 'balanceInquiry';
          }
      } else if (queryLower.includes('email') || queryLower.includes('mail')) {
          primaryFieldKey = (allCustomerKeys.includes('linkedEmailIds')) ? 'linkedEmailIds' : 'email';
      } else if (queryLower.includes('phone') || queryLower.includes('contact')) {
          primaryFieldKey = 'phone';
      } else if (queryLower.includes('credit score') || queryLower.includes('cibil')) {
          primaryFieldKey = 'creditScore';
      } else if (queryLower.includes('income') || queryLower.includes('salary')) {
          primaryFieldKey = 'income';
      } else if (queryLower.includes('history') && service === 'PaySwift Wallet') {
          primaryFieldKey = 'walletTransactionHistory';
      }
      // If still no primaryFieldKey, default to 'name' or first available field
      if (!primaryFieldKey && allCustomerKeys.length > 0) {
          primaryFieldKey = 'name'; // Default to showing names
          if (!allCustomerKeys.includes('name') && allCustomerKeys.length > 0) {
              primaryFieldKey = allCustomerKeys[0]; // Fallback to first available field if 'name' isn't there
          }
      }
  }

  // If after all inference, we still don't have a primary field to display
  if (!primaryFieldKey || !allCustomerKeys.includes(primaryFieldKey)) {
      if (nameFilters && nameFilters.length > 0) {
          return `I found "${nameFilters.join(' and ')}", but I need to know which information you'd like about them! Try asking for their "balance", "email", or "phone number".`;
      }
      return `Hmm, I'm not quite sure what information you're looking for. Can you specify a field like "balance," "credit score," or "linked email IDs"?`;
  }

  // Find the field definition from our fieldAccessMatrix
  const matchedFieldDefinition = fieldAccessMatrix2.find(f => f.key === primaryFieldKey);

  // Define properties for pseudo-fields like 'name', 'email', 'phone', 'linkedEmailIds', 'availableWalletBalance', 'walletTransactionHistory'
  const isPseudoField = ['name', 'email', 'phone', 'linkedEmailIds', 'availableWalletBalance', 'walletTransactionHistory'].includes(primaryFieldKey);

  const finalFieldDefinition = matchedFieldDefinition || (isPseudoField ? {
      key: primaryFieldKey,
      name: primaryFieldKey.split(/(?=[A-Z])/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      requiresOtp: false, // These specific pseudo-fields don't require OTP themselves, handled by obfuscation
      rangeSafe: ['balanceInquiry', 'availableWalletBalance', 'creditScore', 'income'].includes(primaryFieldKey),
      encrypted: false
  } : null);

  if (!finalFieldDefinition) {
      return `Oops! "${primaryFieldKey.split(/(?=[A-Z])/).join(' ')}" isn't a field I can directly retrieve for you. It might be confidential or simply not available.`;
  }

  // --- NEW LOGIC: Exact Value Request Alert ---
  const isExactRequest = queryLower.includes('exact') || queryLower.includes('precise') || queryLower.includes('actual');
  if (isExactRequest && finalFieldDefinition.rangeSafe) {
      return `Sorry! We can't reveal the exact value for security reasons. I can only provide range-based information for "${finalFieldDefinition.name}".`;
  }


  // 3. Filter the customer data
  // Fix: Initialize filteredCustomers at the beginning
  let filteredCustomers = customerData;
  let hasRangeBasedFilter = false; // Flag to indicate if range-based filtering occurred

  // Check for "all customers" AFTER name filters are parsed
  const queryAsksForAll = queryLower.includes('all customers') || queryLower.includes('everyone') || queryLower.includes('all of them');

  if (nameFilters && nameFilters.length > 0) {
      filteredCustomers = filteredCustomers.filter(customer =>
          nameFilters!.some(filterName => customer.name.toLowerCase().includes(filterName.toLowerCase()))
      );
      if (filteredCustomers.length === 0) {
          return `Aha! I searched for "${nameFilters.join(' or ')}", but couldn't find anyone matching those names. Double-check the spelling?`;
      }
  } else if (queryAsksForAll && conditions.length === 0) {
      // If "all customers" is requested and no other specific names/conditions, include all
      filteredCustomers = customerData;
  }
  // If neither names nor "all customers" were specified, `filteredCustomers` remains the full list initially,
  // and will only be filtered by `conditions`.

  // Apply conditions if any
  if (conditions.length > 0) {
      conditions.forEach(condition => {
          filteredCustomers = filteredCustomers.filter(customer => {
              const customerValue = customer[condition.field];
              const compareValue = condition.value as number;

              // Special handling for 'age' (which maps to dateOfBirth)
              if (condition.field === 'dateOfBirth') {
                  const age = calculateAge(customer.dateOfBirth!);
                  if (age === null) return false;
                  switch (condition.operator) {
                      case '>': return age > compareValue;
                      case '<': return age < compareValue;
                      case '>=': return age >= compareValue;
                      case '<=': return age <= compareValue;
                      case '=': return age === compareValue;
                      default: return false;
                  }
              }

              // --- MODIFIED LOGIC: Filtering based on OVERLAP for Range-Safe Fields ---
              if (finalFieldDefinition.rangeSafe && (condition.field === 'balanceInquiry' || condition.field === 'availableWalletBalance' || condition.field === 'creditScore' || condition.field === 'income')) {
                  let floor: number | null = null;
                  let ceiling: number | null = null;
                  let customerRangeString: string | null = null; // Store string representation for parsing

                  if (condition.field === 'balanceInquiry' && typeof customerValue === 'string') {
                    // Extract numeric part for display, but for filtering, we need the raw range
                    const numMatch = customerValue.match(/₹([\d,]+)/);
                    if (numMatch) {
                        const num = parseInt(numMatch[1].replace(/,/g, ''));
                        floor = Math.floor(num / 20000) * 20000;
                        ceiling = floor + 20000;
                        customerRangeString = `₹${floor.toLocaleString()}–₹${ceiling.toLocaleString()}`;
                    }
                  } else if (typeof customerValue === 'number') {
                      // These are already numbers in data, convert to conceptual range
                      if (condition.field === 'availableWalletBalance' || condition.field === 'income') {
                          floor = Math.floor(customerValue / 20000) * 20000;
                          ceiling = floor + 20000;
                          customerRangeString = `₹${floor.toLocaleString()}–₹${ceiling.toLocaleString()}`;
                      } else if (condition.field === 'creditScore') {
                          floor = Math.floor(customerValue / 20) * 20;
                          ceiling = floor + 20;
                          customerRangeString = `${floor}–${ceiling}`;
                      }
                  }

                  if (customerRangeString) {
                      const parsedRange = parseRangeString(customerRangeString);
                      if (parsedRange) {
                          const [min, max] = parsedRange;
                          hasRangeBasedFilter = true; // Mark that filtering on a ranged field occurred

                          switch (condition.operator) {
                              case '>':  return max > compareValue; // If max of range is above threshold
                              case '<':  return min < compareValue; // If min of range is below threshold
                              case '>=': return max >= compareValue; // If max of range is at or above threshold
                              case '<=': return min <= compareValue; // If min of range is at or below threshold
                              case '=':  return compareValue >= min && compareValue <= max; // If value is within the range
                              default: return false;
                          }
                      }
                  }
                  return false; // If we couldn't derive/parse range, exclude
              }
              // --- END MODIFIED LOGIC ---

              // Generic numeric comparison for other number type fields (e.g., if there were any that are exact)
              if (typeof customerValue === 'number') {
                  switch (condition.operator) {
                      case '>': return customerValue > compareValue;
                      case '<': return customerValue < compareValue;
                      case '>=': return customerValue >= compareValue;
                      case '<=': return customerValue <= compareValue;
                      case '=': return customerValue === compareValue;
                      default: return false;
                  }
              }
              return false;
          });
      });

      if (filteredCustomers.length === 0) {
          return `Wow, I looked everywhere, but no customers match those specific criteria! Try different numbers?`;
      }
  }


  // 4. Format for display
  const fieldName = finalFieldDefinition.name;
  const fieldKey = finalFieldDefinition.key;

  const tableRows: TableRow[] = filteredCustomers.map(customer => {
    let rawValue = customer[fieldKey]; // Get the raw value

    // Fix: Declare displayValue within the map function scope
    let displayValue: string = '—'; 

    // Handle OTP-gated fields which are now verified
    // This check should happen here, as `finalFieldDefinition.requiresOtp` implies it.
    // The `otpOverrideVerified` ensures we only obfuscate AFTER verification.
    if (finalFieldDefinition.requiresOtp && otpOverrideVerified) {
        displayValue = obfuscateDisplayValue(String(rawValue), 'general');
    }
    // Specific display logic based on the fieldKey and its type
    else if (fieldKey === 'name') {
        displayValue = obfuscateDisplayValue(customer.name, 'name'); // Encrypted
    } else if (fieldKey === 'email') {
        displayValue = obfuscateDisplayValue(customer.email, 'email'); // Encrypted
    } else if (fieldKey === 'phone') {
        displayValue = obfuscateDisplayValue(customer.phone, 'phone'); // Encrypted
    } else if (fieldKey === 'linkedEmailIds' && Array.isArray(rawValue)) {
        displayValue = rawValue.map((email: string) => obfuscateDisplayValue(email, 'email')).join(', ');
    } else if (fieldKey === 'walletTransactionHistory' && typeof rawValue === 'string') {
        displayValue = rawValue;
    } else if (fieldKey === 'balanceInquiry' && typeof rawValue === 'string') {
        const match = rawValue.match(/₹([\d,]+)/);
        if (match) {
          const num = parseInt(match[1].replace(/,/g, ''));
          const floor = Math.floor(num / 20000) * 20000;
          const ceiling = floor + 20000;
          displayValue = `₹${floor.toLocaleString()}–₹${ceiling.toLocaleString()}`;
        }
    } else if (typeof rawValue === 'number') {
      if (fieldKey === 'availableWalletBalance' || fieldKey === 'income') {
          const floor = Math.floor(rawValue / 20000) * 20000;
          const ceiling = floor + 20000;
          displayValue = `₹${floor.toLocaleString()}–₹${ceiling.toLocaleString()}`;
      } else if (fieldKey === 'creditScore') {
          const floor = Math.floor(rawValue / 20) * 20;
          const ceiling = floor + 20;
          displayValue = `${floor}–${ceiling}`;
      }
      else {
          displayValue = String(rawValue);
      }
    } else if (Array.isArray(rawValue)) {
        displayValue = rawValue.join(', ');
    } else if (rawValue !== undefined && rawValue !== null) {
        displayValue = String(rawValue);
    }

    return {
      name: obfuscateDisplayValue(customer.name, 'name'),
      email: obfuscateDisplayValue(customer.email, 'email'),
      phone: obfuscateDisplayValue(customer.phone, 'phone'),
      value: displayValue
    };
  });

  if (tableRows.length === 0) {
      return `Aww, no results for "${fieldName}" with those filters! Maybe try broadening your search?`;
  }

  const disclaimerMessage = hasRangeBasedFilter
    ? 'Note : Filtering for ranges based value happens by checking if the target value (input) in the given range of the field requested. Kindly note that the filtering is not based on the actual raw value.'
    : undefined;

  return {
    type: 'table',
    query,
    service,
    fieldName: fieldName,
    rows: tableRows,
    disclaimer: disclaimerMessage
  };
};


export default function DemoObserverCapsule({ request, onClose }: Props): JSX.Element {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [faceVerified, setFaceVerified] = useState(false);
  const [status, setStatus] = useState('Initializing...');
  const [query, setQuery] = useState('');

  const [responseLog, setResponseLog] = useState<CapsuleResponse[]>([]);
  const [queryCount, setQueryCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // --- OTP States ---
  const [otpRequiredForField, setOtpRequiredForField] = useState<string | null>(null);
  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [isOtpVerified, setIsOtpVerified] = useState<boolean>(false); // Session-wide OTP verification status
  const [otpResponseMessage, setOtpResponseMessage] = useState<string | null>(null);
  const [originalQuery, setOriginalQuery] = useState<string>(''); // Store the query that triggered OTP


  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [responseLog]);


  useEffect(() => {
    const loadModels = async () => {
      try {
        // Ensure models path is correct
        await faceapi.nets.tinyFaceDetector.load('/models/tiny_face_detector_model-weights_manifest.json');
        await faceapi.nets.faceLandmark68Net.load('/models/face_landmark_68_model-weights_manifest.json');
        await faceapi.nets.faceRecognitionNet.load('/models/face_recognition_model-weights_manifest.json');

        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        setStatus('📸 Position your face in the frame...');
      } catch (err) {
        console.error('Model/Webcam error:', err);
        setStatus('❌ Failed to access webcam or load models. Make sure you have a webcam and allow access!');
      }
    };

    loadModels();
  }, []);

// Fix: Moved handleOtpVerification declaration above handleQuerySubmit
const handleOtpVerification = () => {
    // Dummy OTP for demonstration
    const correctOtp = '1234';
    const data: CustomerRecord[] | undefined = demoCapsuleCustomerData[request.service];

    if (enteredOtp === correctOtp) {
        setIsOtpVerified(true);
        setOtpRequiredForField(null);
        setOtpResponseMessage(null);
        setEnteredOtp('');
        // Re-process the original query with OTP verified
        const verifiedResponse = processQuery(originalQuery, request.service, data || [], true); // Pass true for otpOverrideVerified

        setResponseLog(prev => [...prev, `🤖 OTP Verified Successfully! Here is the requested information:`]);
        setResponseLog(prev => [...prev, verifiedResponse]);
        logToCapsuleHistory(
          originalQuery,
          typeof verifiedResponse === 'string' ? verifiedResponse : JSON.stringify(verifiedResponse),
          request.service
        );

        setOriginalQuery(''); // Clear original query after successful processing
        setQueryCount(prev => prev + 0.5); // Count as a full query upon successful OTP

        // Generate decrypt script after successful OTP verification if it's a table response
        if (typeof verifiedResponse === 'object' && verifiedResponse.type === 'table') {
            // Fix: Pass data || [] as the fourth argument
            const decryptScript = generateDecryptScript(originalQuery, verifiedResponse.rows, request.service, data || []);
            // ✅ Update: Store per-service decrypt scripts
            const blob = new Blob([decryptScript], { type: 'text/plain' });
            const fileUrl = URL.createObjectURL(blob);
            localStorage.setItem(`decryptFileUrl_${request.service}`, fileUrl);
        } else {
            // Remove decrypt file URL for this service if the response is not a table
            localStorage.removeItem(`decryptFileUrl_${request.service}`);
        }

    } else {
        setOtpResponseMessage('Invalid OTP. Please try again.');
        setEnteredOtp('');
    }
};


const handleQuerySubmit = async () => {
  if (!query.trim() && !otpRequiredForField) { // If no query and not waiting for OTP
    setResponseLog(prev => [...prev, "Hey there! 👋 You forgot to type your question! Give it a go!"]);
    return;
  }
  if (queryCount >= 15) {
    setResponseLog(prev => [...prev, '🔒 Wow, you\'ve been super busy! Query limit reached for this session. Time for a little break!']);
    return;
  }

  setLoading(true);

  const data: CustomerRecord[] | undefined = demoCapsuleCustomerData[request.service];

  // If OTP is required and the user has just submitted a query that matches the original OTP query
  if (otpRequiredForField && query === originalQuery) {
      handleOtpVerification();
      setLoading(false);
      return;
  } else if (otpRequiredForField && query !== originalQuery) {
      setResponseLog(prev => [...prev, `🤖 Please enter the OTP for the previous query: "${originalQuery}" first, or submit a new query unrelated to confidential fields.`]);
      setLoading(false);
      return;
  }


  setQueryCount(prev => prev + 0.5); // Increment by 0.5 for a "half query" before final processing or OTP
  setResponseLog(prev => [...prev, `👤 You: ${query}`]);

  const finalResponse = processQuery(query, request.service, data || [], isOtpVerified);

  if (typeof finalResponse === 'object' && finalResponse.type === 'otp_required') {
      setOtpRequiredForField(finalResponse.fieldKey);
      setOtpResponseMessage(finalResponse.message);
      setOriginalQuery(query); // Store the query that triggered OTP
      setResponseLog(prev => [...prev, `🤖 ${finalResponse.message}`]);
  } else {
      setResponseLog(prev => [...prev, finalResponse]);
      // Reset OTP status if a new query is successfully processed (not OTP related)
      // or if it was a non-confidential query
      if (typeof finalResponse !== 'string' || !finalResponse.includes('Access to')) {
        setOtpRequiredForField(null);
        setOtpResponseMessage(null);
        setOriginalQuery('');
      }
      setQueryCount(prev => prev + 0.5); // Increment by 0.5 for a "full query" only if processed

      // Only generate decrypt script if the response is of type 'table'
      if (typeof finalResponse === 'object' && finalResponse.type === 'table') {
          // Fix: Pass data || [] as the fourth argument
          const decryptScript = generateDecryptScript(query, finalResponse.rows, request.service, data || []);
          // ✅ Update: Store per-service decrypt scripts
          const blob = new Blob([decryptScript], { type: 'text/plain' });
          const fileUrl = URL.createObjectURL(blob);
          localStorage.setItem(`decryptFileUrl_${request.service}`, fileUrl);
      } else {
          // If the response is not a table, remove any existing decrypt file URL for this service
          localStorage.removeItem(`decryptFileUrl_${request.service}`);
      }
  }

  setQuery('');
  setLoading(false);
};


  // Field category mapping (unchanged, as per your original provided code)
  const fieldCategoryMap: Record<string, Record<string, string[]>> = {
    "Google Pay": {
      "Bank Approved": ["Account holder name", "IFSC code", "Account type", "Transaction reference no."],
      "Mask Share": ["Account number", "Mobile numbers (linked)"],
      "Capsulized": ["Balance inquiry", "Email IDs (linked)"],
      "Confidential": []
    },
    "QuickLoan": {
      "Bank Approved": ["Full name", "Date of birth"],
      "Mask Share": ["PAN", "Aadhaar number", "Mobile numbers (linked)", "Bank account number"],
      "Capsulized": ["Credit score", "Monthly average balance", "Employment status"],
      "Confidential": []
    },
    "DataBridge AA": {
      "Bank Approved": ["Consent timestamp/status"],
      "Mask Share": ["CIF / Customer ID", "All linked account numbers"],
      "Capsulized": [
        "Demographics (name, DOB, gender, address)",
        "Financial history (income, investments, loans)",
        "Credit report summary",
        "Financial history (income, investments, loans)", // Duplicated for demonstration
        "Insurance details" // This field is also here
      ],
      "Confidential": []
    },
    "InvestSmart": {
      "Bank Approved": ["Full name", "PAN", "Bank account number"],
      "Mask Share": ["Email IDs linked"],
      "Capsulized": ["Portfolio holdings", "Risk profile assessment"],
      "Confidential": ["Mobile numbers (linked)"]
    },
    "PaySwift Wallet": {
      "Bank Approved": ["Mobile numbers (linked)", "Wallet ID", "Linked Bank Account Number", "Transaction timestamp"],
      "Mask Share": [],
      "Capsulized": ["Wallet transaction history", "Available wallet balance"],
      "Confidential": []
    }
  };

  const getFieldCategory = (service: string, field: string) => {
    const categories = fieldCategoryMap[service];
    if (!categories) return null;

    for (const [label, fields] of Object.entries(categories)) {
      if ((fields as string[]).includes(field)) {
        const colorMap: Record<string, string> = {
          "Bank Approved": "green",
          "Mask Share": "blue",
          "Capsulized": "orange",
          "Confidential": "red"
        };
        return { label, color: colorMap[label] || "gray" };
      }
    }

    if (service === 'DataBridge AA' && field === 'Financial history (income, investments, loans)') {
      return { label: 'Capsulized', color: 'orange' };
    }

    return null;
  };

  const handleVerify = () => {
    setFaceVerified(true);
    setStatus('✅ Face verified! Get ready to explore your customer data with confidence! I\'m here to help! 😉');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-3xl w-full shadow-xl overflow-y-auto">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">🧪 Capsule Chat</h2>
        <p className="text-black text-sm mb-4">{status}</p>

        <h3 className="text-xxl font-semibold mb-2 text-gray-800">Requested Fields</h3>
        {request.requestedFields?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {request.requestedFields.map((field: string, idx: number) => {
              const result = getFieldCategory(request.service, field);
              if (!result) return null;

              const { label, color } = result;
              const bgColor = {
                green: 'bg-green-100 text-green-800',
                blue: 'bg-blue-100 text-blue-800',
                orange: 'bg-orange-100 text-orange-800',
                red: 'bg-red-100 text-red-800',
                gray: 'bg-gray-100 text-gray-800',
              }[color];

              return (
                <span key={idx} className={`px-3 py-1 rounded-full text-xs font-medium ${bgColor}`}>
                  {field}{label === 'Confidential' ? ` (${label})` : ''}
                </span>
              );
            })}
          </div>
        )}

        <h4 className="text-lg font-semibold mb-2 text-gray-800">Fields that can be queried in the Capsule</h4>
        {request.requestedFields?.some(field => getFieldCategory(request.service, field)?.color === 'orange') ? (
          <div className="flex flex-wrap gap-2 mb-4">
            {request.requestedFields
              .filter(field => getFieldCategory(request.service, field)?.color === 'orange')
              .map((field, idx) => (
                <span
                  key={`mask-${idx}`}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
                >
                  {field}
                </span>
              ))}
          </div>
        ) : (
          <p className="text-sm text-gray-600 mb-4">No fields marked as Mask Share.</p>
        )}


        {!faceVerified ? (
          <>
            <video ref={videoRef} autoPlay muted playsInline className="rounded border w-full max-w-md mx-auto" />
            <div className="mt-4 text-center">
              <button onClick={handleVerify} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 shadow">
                Scan Face
              </button>
              <button onClick={onClose} className="ml-3 text-sm text-gray-600 underline hover:text-gray-800">
                Cancel
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-4 flex flex-col h-full">

            {/* CHAT BUBBLE DISPLAY AREA */}
            <div className="bg-gray-100 border rounded p-4 max-h-[300px] overflow-y-auto flex flex-col items-start flex-grow">
              {responseLog.map((msg, i) => { // 'msg' is correctly scoped here
                if (typeof msg === 'string') {
                  const isUser = msg.startsWith('👤');
                  const alignmentClass = isUser ? 'justify-end' : 'justify-start';
                  const bubbleColorClass = isUser ? 'bg-blue-500' : 'bg-white';
                  const textColorClass = isUser ? 'text-white' : 'text-black';
                  // Added specific rounded classes for bubble tails
                  const borderRadiusClass = isUser ? 'rounded-lg rounded-br-none' : 'rounded-lg rounded-bl-none';

                  return (
                    <div key={i} className={`flex w-full ${alignmentClass} mb-2`}>
                      <div
                        className={`max-w-[75%] px-4 py-2 text-sm shadow whitespace-pre-wrap ${bubbleColorClass} ${textColorClass} ${borderRadiusClass}`}
                      >
                        {msg}
                      </div>
                    </div>
                  );
                }

                if (msg.type === 'table') { // Type guard ensures 'msg' is 'table' here
                  const dataForPrefixCheck: CustomerRecord[] | undefined = demoCapsuleCustomerData[request.service];
                  const { nameFilters: extractedNameFilters, conditions: extractedConditions } = parseQueryForFiltersAndConditions(msg.query, Object.keys(dataForPrefixCheck?.[0] || {}));
                  const isFiltered = (extractedNameFilters && extractedNameFilters.length > 0) || extractedConditions.length > 0;
                  const prefixMessage = isFiltered
                      ? `🥳 Awesome! Here's the data you requested, filtered just for you:`
                      : `✨ Ta-da! Here's the info you asked for!`;

                  return (
                    <div key={i} className="flex w-full justify-start mb-2">
                      <div className="max-w-[90%] bg-indigo-50 p-4 rounded shadow text-sm rounded-bl-none text-black opacity-100">
                        <p className="mb-2 font-semibold">{prefixMessage}</p>
                        <p className="mb-2 font-semibold">🔐 Capsule Secure Response</p>
                        {msg.disclaimer && ( // Display disclaimer if present
                          <p className="text-orange-700 text-xs mb-2 p-2 border border-orange-300 bg-orange-50 rounded">
                            {msg.disclaimer}
                          </p>
                        )}
                        <p><strong>Query:</strong> {msg.query}</p>
                        <p><strong>Service:</strong> {msg.service}</p>
                        <p><strong>Field:</strong> {msg.fieldName}</p>
                        <div className="overflow-x-auto mt-2">
                          <table className="min-w-full border border-gray-300 text-xs">
                            <thead className="bg-indigo-100">
                              <tr>
                                <th className="border px-2 py-1 text-left text-black">Name</th>
                                <th className="border px-2 py-1 text-left text-black">Email</th>
                                <th className="border px-2 py-1 text-left text-black">Phone</th>
                                <th className="border px-2 py-1 text-left text-black">{msg.fieldName}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {msg.rows.map((row: TableRow, idx: number) => (
                                <tr key={idx}>
                                  <td className="border px-2 py-1 text-black">{row.name}</td>
                                  <td className="border px-2 py-1 text-black">{row.email}</td>
                                  <td className="border px-2 py-1 text-black">{row.phone}</td>
                                  <td className="border px-2 py-1 text-black">{row.value}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  );
                }

                return null;
              })}

              <div ref={chatEndRef} />
            </div>

            {/* Download Decrypt Script button - needs to be outside the responseLog map loop */}
            {/* ✅ Update: Use per-service decrypt script URL from localStorage */}
            {localStorage.getItem(`decryptFileUrl_${request.service}`) && (
              <div className="w-full text-center mt-4">
                <a
                  href={localStorage.getItem(`decryptFileUrl_${request.service}`) || '#'}
                  download={`decrypt_${request.service}_${Date.now()}.js`}
                  className="inline-block bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-xs"
                >
                  ⬇️ Download Decrypt Script
                </a>
              </div>
            )}


            {/* OTP Input Section */}
            {otpRequiredForField && (
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded mt-4">
                    <p className="text-sm text-yellow-800 mb-2">{otpResponseMessage || `Enter OTP for "${fieldAccessMatrix2.find(f => f.key === otpRequiredForField)?.name || otpRequiredForField}"`}</p>
                    <input
                        type="text"
                        value={enteredOtp}
                        onChange={(e) => setEnteredOtp(e.target.value)}
                        placeholder="Enter OTP"
                        className="w-full p-2 border rounded mb-2"
                        maxLength={4}
                    />
                    <button
                        onClick={handleOtpVerification}
                        className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 disabled:opacity-50"
                        disabled={loading || enteredOtp.length < 4}
                    >
                        Verify OTP
                    </button>
                </div>
            )}


            {/* INPUT BOX */}
            <div className="bg-gray-50 border p-4 rounded mt-4">
              <textarea
                rows={2}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about your customers... e.g., 'balance for Ravi Kumar', 'credit score > 750', 'show balance of Ravi, Mohit and Anjali'"
                className="w-full p-2 border rounded"
              />
              <button
                onClick={handleQuerySubmit}
                className="mt-2 bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 disabled:opacity-50"
                disabled={loading || queryCount >= 15}
              >
                {loading ? 'Processing...' : 'Ask'}
              </button>
            </div>

            <div className="text-right mt-2">
              <button onClick={onClose} className="text-sm text-gray-600 hover:text-gray-800 underline">
                Close Capsule
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}