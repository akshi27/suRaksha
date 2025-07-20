// utils/extractFieldsFromQuery.ts

export const fieldSynonyms: Record<string, string[]> = {
  name: ['name', 'customer'],
  email: ['email', 'mail', 'gmail', 'contact'],
  phone: ['phone', 'mobile', 'contact number'],
  accountNumber: ['account', 'accno', 'account number'],
  ifscCode: ['ifsc', 'branch code'],
  bankName: ['bank'],
  accountType: ['account type', 'savings', 'current'],
  balanceInquiry: ['balance', 'available balance', 'funds', 'total balance'],
  transactionReferenceNo: ['transaction', 'txn', 'reference', 'ref number'],
  pan: ['pan', 'permanent account'],
  aadhaar: ['aadhaar', 'uid', 'aadhar'],
  creditScore: ['credit score', 'cibil', 'score', 'credit', 'cred score'],
  income: ['income', 'salary', 'earnings'],
  address: ['address', 'location', 'residence'],
  gender: ['gender', 'sex'],
  dateOfBirth: ['dob', 'birth', 'birthday'],
  employmentStatus: ['employment', 'job', 'occupation', 'employment status'],
  portfolioHoldings: ['portfolio', 'stocks', 'investments', 'portfolio holdings', 'Portfolio holdings'],
  mobilenumberslinked: ['mobile numbers', 'linked mobile', 'mobile linked', 'mobile numbers linked', 'mobile numbers (linked)', 'Mobile numbers (linked)'],
  availableWalletBalance: ['wallet balance', 'wallet funds', 'wallet', 'available balance', 'available wallet balance'],
  walletTransactionHistory: ['wallet transaction', 'wallet history', 'wallet activity', 'transcation', 'transaction history'],
  riskProfile: ['risk', 'risk profile', 'risk assessment', 'risk profile assessment'],
  bankAccountNumber: ['bank account', 'account'],
  consentStatus: ['consent', 'permission'],
  cif: ['cif', 'customer id'],
  linkedAccounts: ['linked account', 'linked acc'],
  transactionTimestamp: ['timestamp', 'transaction time'],
  linkedEmailIds: ['linked email', 'secondary email', 'email', 'email id', 'email ids', 'gmail', 'emails', 'emailids', 'email ids linked', 'linked emails', 'linked email ids'],
  monthlyAverageBalance: ['month balance', 'month avg balance', 'monthly avg balance'],
  Financialhistory: ['financial history', 'financial data', 'financial records', 'Financial History', 'Financial history'],
  creditReportSummary: ['credit report summary', 'credit summary', 'credit card report'],
};

export function extractRelevantFieldsFromQuery(
  query: string,
  sampleCustomer: Record<string, any>
): string[] {
  const lowerQuery = query.toLowerCase();
  const matchedFields: string[] = [];

  for (const [field, synonyms] of Object.entries(fieldSynonyms)) {
    if (field in sampleCustomer) {
      const matched = synonyms.some((syn) => lowerQuery.includes(syn));
      if (matched) matchedFields.push(field);
    }
  }

  // fallback to first 3-4 fields if no matches (prevent empty capsule)
  return matchedFields.length > 0 ? matchedFields : Object.keys(sampleCustomer).slice(0, 4);
}
