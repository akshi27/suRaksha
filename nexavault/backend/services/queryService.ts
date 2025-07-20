import { readJsonFile } from '../utils/fileUtils';

type Capsule = {
  userId: string;
  approvedFields: string[];
};

type BankData = Record<string, any>;

type ResponseResult = {
  answer: string;
  confidence: number;
};

/**
 * Main entry to process a capsule-based query.
 */
export const processQuery = async (
  question: string,
  capsule: Capsule
): Promise<ResponseResult> => {
  try {
    const bankData: Record<string, BankData> = await readJsonFile('data/user_bank_data.json');
    const userBankData = bankData[capsule.userId] || {};

    const answer = generateMaskedResponse(question, userBankData, capsule.approvedFields);

    return {
      answer,
      confidence: 0.85 + Math.random() * 0.15 // Mock confidence
    };
  } catch (error) {
    console.error('Query processing error:', error);
    throw error;
  }
};

/**
 * Generates a privacy-preserving response based on approved fields and user data.
 */
const generateMaskedResponse = (
  question: string,
  bankData: BankData,
  approvedFields: string[]
): string => {
  const lowerQuestion = question.toLowerCase();

  const relevantFields = approvedFields.filter(field =>
    lowerQuestion.includes(field.toLowerCase()) ||
    lowerQuestion.includes(field.replace(/([A-Z])/g, ' $1').toLowerCase())
  );

  if (relevantFields.length === 0) {
    return "I can't provide information about that field as it's not in your approved data scope.";
  }

  const responses = relevantFields.map(field => {
    const value = bankData[field];
    if (!value) return null;

    switch (field) {
      case 'salary': {
        const salaryRange = getSalaryRange(value);
        return `The salary range is approximately ₹${salaryRange.min}k - ₹${salaryRange.max}k per month.`;
      }

      case 'creditScore': {
        const scoreRange = getCreditScoreRange(value);
        return `The credit score falls in the ${scoreRange} category.`;
      }

      case 'emiHistory': {
        return `EMI payment history shows ${value.length} active EMIs with consistent payment patterns.`;
      }

      case 'accountBalance': {
        const balanceRange = getBalanceRange(value);
        return `Account balance is in the ${balanceRange} range.`;
      }

      default: {
        return `Information about ${field} is available but abstracted for privacy.`;
      }
    }
  }).filter(Boolean);

  return responses.length > 0
    ? responses.join(' ')
    : "I can provide information about your approved fields, but the specific data you're asking about isn't available.";
};

/**
 * Approximates salary into a descriptive range.
 */
const getSalaryRange = (
  salary: number
): { min: number; max: number } => {
  const ranges = [
    { min: 20, max: 35, actual: [20000, 35000] },
    { min: 35, max: 50, actual: [35000, 50000] },
    { min: 50, max: 75, actual: [50000, 75000] },
    { min: 75, max: 100, actual: [75000, 100000] },
    { min: 100, max: 150, actual: [100000, 150000] }
  ];

  return (
    ranges.find(range => salary >= range.actual[0] && salary <= range.actual[1]) ||
    ranges[ranges.length - 1]
  );
};

/**
 * Converts a raw credit score into a descriptive label.
 */
const getCreditScoreRange = (score: number): string => {
  if (score >= 750) return 'Excellent (750+)';
  if (score >= 700) return 'Good (700-749)';
  if (score >= 650) return 'Fair (650-699)';
  return 'Needs Improvement (below 650)';
};

/**
 * Maps bank balance to a privacy-safe label.
 */
const getBalanceRange = (balance: number): string => {
  if (balance >= 100000) return 'High (₹1L+)';
  if (balance >= 50000) return 'Medium-High (₹50k–₹1L)';
  if (balance >= 20000) return 'Medium (₹20k–₹50k)';
  return 'Low (below ₹20k)';
};
