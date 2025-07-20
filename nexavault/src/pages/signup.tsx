// src/pages/signup.tsx
'use client';

import React from 'react';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { HoverBorderGradient } from '../components/ui/hover-border-gradient';
import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc'; // Correct Google icon from react-icons/fc
import Background from '../components/ui/background';

const SignupPage = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative z-10">
      <Background />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-20"
      >
        <HoverBorderGradient containerClassName="w-full">
          <div className="bg-white/85 backdrop-blur-xl rounded-2xl shadow-[0_0_40px_rgba(91,68,249,0.2)] border border-white/30 p-8 w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Create your account</h2>
            <p className="text-gray-600 mb-6">Join Nexavault securely in seconds</p>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="flex gap-3">
                <LabelInputContainer>
                  <Label htmlFor="firstname">First name</Label>
                  <Input id="firstname" placeholder="John" type="text" />
                </LabelInputContainer>
                <LabelInputContainer>
                  <Label htmlFor="lastname">Last name</Label>
                  <Input id="lastname" placeholder="Doe" type="text" />
                </LabelInputContainer>
              </div>

              <LabelInputContainer>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" placeholder="john@nexavault.com" type="email" />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="password">Password</Label>
                <Input id="password" placeholder="••••••••" type="password" />
              </LabelInputContainer>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white"
              >
                Sign up →
                <BottomGradient />
              </motion.button>
            </form>

            <div className="my-6 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

            <button
              className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900"
              type="button"
            >
              <FcGoogle className="h-5 w-5" />
              <span className="text-sm text-neutral-700 dark:text-neutral-300">Google</span>
              <BottomGradient />
            </button>

            <p className="text-sm text-gray-500 text-center mt-6">
              Already have an account?{' '}
              <a href="/login" className="text-blue-600 hover:underline">Log in</a>
            </p>
          </div>
        </HoverBorderGradient>
      </motion.div>
    </div>
  );
};

export default SignupPage;

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`flex w-full flex-col space-y-2 ${className || ''}`}>
    {children}
  </div>
);

const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
  </>
);
