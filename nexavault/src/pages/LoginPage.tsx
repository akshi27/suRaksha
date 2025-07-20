'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Mail, Lock, KeyRound, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';
import { Link } from "react-router-dom";
import { HoverBorderGradient } from '../components/ui/hover-border-gradient';
import Background from '../components/ui/background';

const LoginPage = () => {
  const [step, setStep] = useState<'login' | 'otp'>('login');
  const [email, setEmail] = useState('demo@nexavault.com');
  const [password, setPassword] = useState('password');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [maskedEmail, setMaskedEmail] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [rememberMe, setRememberMe] = useState(false);

  const { login, verifyOtp } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await login(email, password);
      setMaskedEmail(response.email);
      setStep('otp');
      setCountdown(300);
      toast.success('OTP sent to your email!');
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error('Please enter complete OTP');
      return;
    }
    setIsLoading(true);
    try {
      await verifyOtp(email, otpString);
      toast.success('Login successful!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative z-10">
      <Background />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-20"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4"
          >
            <Shield className="h-8 w-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Nexavault
          </h1>
          <p className="text-base text-gray-300 mt-2">
            The Secure Privacy-Preserving Data Platform
          </p>
        </div>

        <HoverBorderGradient containerClassName="w-full">
          <div className="bg-white/85 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30 p-8 w-full shadow-[0_0_40px_rgba(91,68,249,0.2)]">
            <AnimatePresence mode="wait">
              {step === 'login' ? (
                <motion.form
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleLogin}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h2>
                    <p className="text-gray-600">Enter your credentials to access your account</p>
                  </div>

                  <div className="space-y-4">
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email address"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>

                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <label className="inline-flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={() => setRememberMe(!rememberMe)}
                          className="appearance-none h-4 w-4 rounded border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
                        />
                        <span>Remember me</span>
                      </label>
                      <button
                        type="button"
                        className="text-blue-600 hover:underline focus:outline-none"
                      >
                        Forgot password?
                      </button>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <Loader className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <span>Send OTP</span>
                        <KeyRound className="h-5 w-5" />
                      </>
                    )}
                  </motion.button>

                  <div className="flex items-center justify-center my-4">
                    <div className="h-px bg-gray-300 w-full"></div>
                    <span className="px-3 text-gray-500 text-sm">or</span>
                    <div className="h-px bg-gray-300 w-full"></div>
                  </div>

                  <button
                    type="button"
                    className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-100 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <FcGoogle className="h-5 w-5" />
                    <span>Sign in with Google</span>
                  </button>

                  <div className="text-center text-sm text-gray-500 mt-4">
                    <p>Demo credentials: demo@nexavault.com / password</p>
                  </div>

                  <div className="text-center text-sm text-gray-600 mt-2">
                    Don&apos;t have an account?{' '}
                    <Link to="/signup" className="text-blue-600 hover:underline">
                      Sign up
                    </Link>
                  </div>
                </motion.form>
              ) : (
                <motion.form
                  key="otp"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleOtpSubmit}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter OTP</h2>
                    <p className="text-gray-600">We've sent a 6-digit code to {maskedEmail}</p>
                  </div>

                  <div className="flex justify-center space-x-3">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        className="w-12 h-12 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg font-medium"
                        maxLength={1}
                      />
                    ))}
                  </div>

                  {countdown > 0 && (
                    <div className="text-center text-sm text-gray-500">
                      Time remaining: {formatTime(countdown)}
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <Loader className="h-5 w-5 animate-spin" />
                    ) : (
                      <span>Verify & Login</span>
                    )}
                  </motion.button>

                  <button
                    type="button"
                    onClick={() => setStep('login')}
                    className="w-full text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                  >
                    ← Back to login
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </HoverBorderGradient>
      </motion.div>
    </div>
  );
};

export default LoginPage;

