import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export interface ServiceRequest {
  id: string;
  serviceName: string;
  website: string;
  useCase: string;
  requestedFields: string[];
  suggestedFields: string[];
  customer: {
    name: string;
    dob: string;
    phone: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  deliveryMethod: string;
}

export interface DashboardResponse {
  userId: string;
  requests: ServiceRequest[];
}

export const getDashboardData = async (
  token: string
): Promise<DashboardResponse> => {
  const response = await axios.get(`${API_BASE_URL}/dashboard`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const approveRequest = async (
  token: string,
  serviceName: string,
  approvedFields: string[],
  accessLimit: number
): Promise<{ message: string }> => {
  const response = await axios.post(
    `${API_BASE_URL}/dashboard/approve`,
    { serviceName, approvedFields, accessLimit },
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  return response.data;
};

export const rejectRequest = async (
  token: string,
  serviceName: string
): Promise<{ message: string }> => {
  const response = await axios.post(
    `${API_BASE_URL}/dashboard/reject`,
    { serviceName },
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  return response.data;
};

export interface ThirdPartyRequest {
  id: string;
  serviceName: string;
  useCase: string;
  requestedFields: string[];
  suggestedFields?: string[];
  website: string;
  customer: {
    name: string;
    dob: string;
    phone: string;
  };
  deliveryMethod: string;
  status: 'pending' | 'approved' | 'rejected';
  description?: string;
}
