import { v4 as uuidv4 } from 'uuid';
import { readJsonFile, writeJsonFile } from '../utils/fileUtils';

// Define interfaces
interface RequestMetadata {
  serviceName: string;
  serviceId: string;
}

interface Capsule {
  id: string;
  userId: string;
  serviceName: string;
  serviceId: string;
  approvedFields: string[];
  tokenizedData: Record<string, string>;
  queryLimit: number;
  queriesLeft: number;
  status: 'active' | 'suspended' | 'revoked' | 'blocked';
  createdAt: string;
  expiryDate: string;
  lastQueryAt: string | null;
}

// Generate a new data capsule
export const generateCapsule = async (
  userId: string,
  approvedFields: string[],
  queryLimit: number,
  request: RequestMetadata
): Promise<Capsule> => {
  try {
    const bankData = await readJsonFile('backend/data/user_bank_data.json');
    const userBankData = bankData[userId] || {};

    const tokenizedData: Record<string, string> = {};
    approvedFields.forEach((field) => {
      if (userBankData[field]) {
        tokenizedData[field] = `tok_${field}_${Math.random().toString(36).substr(2, 9)}`;
      }
    });

    const capsule: Capsule = {
      id: uuidv4(),
      userId,
      serviceName: request.serviceName,
      serviceId: request.serviceId,
      approvedFields,
      tokenizedData,
      queryLimit,
      queriesLeft: queryLimit,
      status: 'active',
      createdAt: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      lastQueryAt: null,
    };

    const capsules: Capsule[] = await readJsonFile('backend/data/capsules.json');
    capsules.push(capsule);
    await writeJsonFile('backend/data/capsules.json', capsules);

    return capsule;
  } catch (error) {
    console.error('Capsule generation error:', error);
    throw error;
  }
};
