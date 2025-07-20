// ApprovedPage.types.ts

// Base Customer fields (for decrypted data)
export interface BaseCustomer {
  decryptedName?: string;
  decryptedEmail?: string;
  decryptedPhone?: string;
  decryptedAccountNumber?: string;
  decryptedIfscCode?: string;
  decryptedBankName?: string;
  decryptedAccountType?: string;
  decryptedTransactionReferenceNo?: string;
  decryptedBalance?: number;
  decryptedAge?: number;
  decryptedDateOfBirth?: string;
  decryptedPan?: string;
  decryptedAadhaar?: string;
  decryptedCreditScore?: number;
  decryptedMonthlyAverageBalance?: number;
  decryptedEmploymentStatus?: string;
  decryptedAddress?: string;
  decryptedBankAccountNumber?: string;
  decryptedCif?: string;
  decryptedLinkedAccounts?: string[];
  decryptedAccountTypeLinked?: string;
  decryptedGender?: string;
  decryptedIncome?: number;
  decryptedInvestments?: string;
  decryptedLoans?: string;
  decryptedInsurance?: string;
  decryptedTaxDetails?: string;
  decryptedCreditReportSummary?: string;
  decryptedPortfolioHoldings?: string;
  decryptedRiskProfile?: string;
  decryptedInvestmentAccountId?: string;
  decryptedTransactionHistoryInvestment?: string;
  decryptedCapitalGainsLosses?: string;
  decryptedIncomeSourceDetails?: string;
  decryptedMobileNumberLinked?: string;
  decryptedWalletId?: string;
  decryptedTransactionTimestamp?: string;
  decryptedWalletTransactionHistory?: string;
  decryptedAvailableWalletBalance?: number;
  decryptedLinkedBankAccountNumber?: string;
  decryptedUpiId?: string;
  // Add any other decrypted fields here
  [key: string]: any; // Allow for arbitrary properties
}

// Encrypted Customer fields
export interface EncryptedCustomer {
  encryptedName: string;
  encryptedEmail: string;
  encryptedPhone: string;
  encryptedAccountNumber?: string;
  encryptedIfscCode?: string;
  encryptedBankName?: string;
  encryptedAccountType?: string;
  encryptedTransactionReferenceNo?: string;
  encryptedBalance?: string;
  encryptedAge?: string;
  encryptedDateOfBirth?: string;
  encryptedPan?: string;
  encryptedAadhaar?: string;
  encryptedCreditScore?: string;
  encryptedMonthlyAverageBalance?: string;
  encryptedEmploymentStatus?: string;
  encryptedAddress?: string;
  encryptedBankAccountNumber?: string;
  encryptedCif?: string;
  encryptedLinkedAccounts?: string[];
  encryptedAccountTypeLinked?: string;
  encryptedGender?: string;
  encryptedIncome?: string;
  encryptedInvestments?: string;
  encryptedLoans?: string;
  encryptedInsurance?: string;
  encryptedTaxDetails?: string;
  encryptedCreditReportSummary?: string;
  encryptedPortfolioHoldings?: string;
  encryptedRiskProfile?: string;
  encryptedInvestmentAccountId?: string;
  encryptedTransactionHistoryInvestment?: string;
  encryptedCapitalGainsLosses?: string;
  encryptedIncomeSourceDetails?: string;
  encryptedMobileNumberLinked?: string;
  encryptedWalletId?: string;
  encryptedTransactionTimestamp?: string;
  encryptedWalletTransactionHistory?: string;
  encryptedAvailableWalletBalance?: string;
  encryptedLinkedBankAccountNumber?: string;
  encryptedUpiId?: string;
  // Add any other encrypted fields here
  [key: string]: any; // Allow for arbitrary properties
  // Adding decrypted fields to EncryptedCustomer for easier matching in ApprovedPage.tsx
  decryptedName?: string;
  decryptedEmail?: string;
  decryptedPhone?: string;
}

// Combined Customer type for `approvedServices` (contains both decrypted and encrypted fields)
export interface Customer extends BaseCustomer, EncryptedCustomer {}

// Service definition
export interface ApprovedService {
  service: string;
  useCase: UseCaseType; // Use the UseCaseType here
  status: string;
  website: string;
  thirdPartyName: string;
  webAccess: boolean;
  customers: Customer[]; // This will hold the combined customer data
  encryptedCustomers?: EncryptedCustomer[];
  requestedFields: string[];
  confidentialFields: string[];
}

// Use Case Types (exported for use in other components)
export type UseCaseType =
  'Lending App' |
  'Account Aggregator' |
  'Investment Platform' |
  'Digital Wallet Service' |
  'UPI Payment App' |
  'Insurance Provider' |
  'Tax Filing Service' |
  'Loan Application' |
  'Property Management' |
  'Bill Payment App';

// Field Access Configuration (exported for use in other components)
export interface FieldAccessConfig {
  explicitlyShare: string[];
  maskShare: string[];
  withConsent: string[];
}

export const fieldAccessMatrix: Record<UseCaseType, FieldAccessConfig> = {
  'Lending App': {
    explicitlyShare: ['Full name', 'Date of birth'],
    maskShare: ['PAN', 'Aadhaar number', 'Address', 'Mobile numbers (linked)', 'Bank account number'],
    withConsent: ['Credit score', 'Monthly average balance', 'Loan repayment history', 'EMI transaction history', 'Employment status', 'Income details']
  },
  'Account Aggregator': {
    explicitlyShare: ['Consent timestamp/status', 'FIU ID'],
    maskShare: ['CIF / Customer ID', 'All linked account numbers', 'Account type (linked)'],
    withConsent: ['Demographics (name, DOB, gender, address)', 'Financial history (income, investments, loans, insurance)', 'Tax details', 'Credit report summary']
  },
  'Investment Platform': {
    explicitlyShare: ['Full name', 'PAN', 'Bank account number', 'Portfolio holdings', 'Risk profile assessment'],
    maskShare: ['Address', 'Mobile numbers (linked)', 'Email IDs linked', 'Investment account ID'],
    withConsent: ['Transaction history (investment)', 'Capital gains/losses', 'Income source details']
  },
  'Digital Wallet Service': {
    explicitlyShare: ['Mobile numbers (linked)', 'Wallet ID', 'Transaction timestamp'],
    maskShare: ['Linked bank account number (masked)', 'UPI ID'],
    withConsent: ['Wallet transaction history', 'Frequent contacts (for payments)', 'Merchant payment history', 'Available wallet balance']
  },
  'UPI Payment App': {
    explicitlyShare: ['Account holder name', 'IFSC code', 'Bank name', 'Account type', 'Transaction reference no.'],
    maskShare: ['Account number', 'Mobile numbers (linked)'],
    withConsent: ['Balance inquiry', 'Email IDs (linked)']
  },
  'Insurance Provider': {
    explicitlyShare: ['Full name', 'Date of birth', 'Policy type requested'],
    maskShare: ['Address', 'Mobile numbers (linked)', 'Email IDs linked', 'Nominee details'],
    withConsent: ['Health records summary', 'Existing insurance policies', 'Income details', 'Investment portfolio value']
  },
  'Tax Filing Service': {
    explicitlyShare: ['Full name', 'PAN', 'Assessment Year'],
    maskShare: ['Aadhaar number', 'Bank account number', 'Address'],
    withConsent: ['Salary slips/Form 16', 'Transaction history (income/expenses)', 'Investment proofs (80C, etc.)', 'Loan interest certificates', 'TDS details']
  },
  'Loan Application': {
    explicitlyShare: ['Full name', 'Date of birth', 'Property address'],
    maskShare: ['PAN', 'Aadhaar number', 'Current residential address', 'Employment details', 'Existing loan details'],
    withConsent: ['Credit score', 'Bank statements (last 12 months)', 'Income tax returns (last 3 years)', 'Existing liabilities (loans, credit cards)', 'Property valuation reports']
  },
  'Property Management': {
    explicitlyShare: ['Full name', 'Current residential address', 'Property address'],
    maskShare: ['Mobile numbers (linked)', 'Email IDs (linked)', 'PAN', 'Aadhaar number', 'Bank account number'],
    withConsent: ['Transaction history (investment)']
  },
  'Bill Payment App': {
    explicitlyShare: ['Transaction amount', 'Merchant/biller name', 'Bill due date', 'Biller ID'],
    maskShare: ['Linked account numbers', 'Mobile numbers (linked)', 'Customer ID (biller)'],
    withConsent: ['Email IDs (linked)', 'Payment history (for specific biller)']
  }
};
