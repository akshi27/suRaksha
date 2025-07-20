import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export interface User {
  id: string;
  email: string;
  name: string;
  bankData: any;
}

export interface LoginResponse {
  message: string;
  email: string;
}

export interface VerifyOTPResponse {
  token: string;
  user: User;
}

// Login with email and password
export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
  return response.data;
};

// Verify OTP
export const verifyOTP = async (email: string, otp: string): Promise<VerifyOTPResponse> => {
  const response = await axios.post(`${API_BASE_URL}/auth/verify-otp`, { email, otp });

  // Save token to localStorage
  localStorage.setItem('nexavault_token', response.data.token);

  return response.data;
};

// Resend OTP
export const resendOTP = async (email: string): Promise<{ message: string }> => {
  const response = await axios.post(`${API_BASE_URL}/auth/resend-otp`, { email });
  return response.data;
};

// Logout (clears token)
export const logout = (): void => {
  localStorage.removeItem('nexavault_token');
};

// Optional: Future refresh token logic (if needed)
export const refreshToken = async (): Promise<{ token: string }> => {
  const token = localStorage.getItem('nexavault_token');
  const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {}, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  localStorage.setItem('nexavault_token', response.data.token);
  return response.data;
};
