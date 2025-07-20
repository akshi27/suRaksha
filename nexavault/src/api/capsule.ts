import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export interface QueryResponse {
  answer: string;
  queriesLeft: number;
  confidence: number;
}

export interface CapsuleDetails {
  id: string;
  userId: string;
  serviceName: string;
  approvedFields: string[];
  queryLimit: number;
  queriesLeft: number;
  status: string;
  createdAt: string;
  expiryDate: string;
  logs: {
    question: string;
    response: string;
    timestamp: string;
    location?: string;
  }[];
  daysToExpiry: number;
}

export const queryCapsule = async (
  token: string,
  capsuleId: string,
  question: string
): Promise<QueryResponse> => {
  const response = await axios.post(
    `${API_BASE_URL}/capsule/query/${capsuleId}`,
    { question },
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  return response.data;
};

export const getCapsuleDetails = async (
  token: string,
  capsuleId: string
): Promise<CapsuleDetails> => {
  const response = await axios.get(`${API_BASE_URL}/capsule/${capsuleId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const blockCapsule = async (
  token: string,
  capsuleId: string
): Promise<{ message: string }> => {
  const response = await axios.post(
    `${API_BASE_URL}/capsule/block/${capsuleId}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  return response.data;
};

export const revokeCapsule = async (
  token: string,
  capsuleId: string
): Promise<{ message: string }> => {
  const response = await axios.post(
    `${API_BASE_URL}/capsule/revoke/${capsuleId}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  return response.data;
};
