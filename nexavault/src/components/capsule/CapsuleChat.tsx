import { useEffect, useRef, useState } from 'react';
// utils/nexonEncryptor.ts must already be created
import { encryptResponse, generateDecryptionScript } from '../../../backend/utils/nexonEncryptor';
import fs from 'fs'; // if backend or local dev
import path from 'path';

interface Message {
  sender: 'user' | 'nexon';
  text: string;
}

interface CapsuleChatProps {
  serviceName: string;
  requestedFields: string[];
  onClose: () => void;
}

export default function CapsuleChat({ serviceName, requestedFields, onClose }: CapsuleChatProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [otp, setOtp] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/capsule/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: input,
          serviceName,
          capsuleType: 'real',
          otp,
        }),
      });

      const data = await res.json();

      if (data?.encryptedData) {
        const botMessage: Message = { sender: 'nexon', text: data.encryptedData };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: 'nexon', text: data?.error || '❌ Failed to process query.' },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'nexon', text: '❌ Nexon is temporarily unavailable.' },
      ]);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-4 flex flex-col max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-gray-800">💬 Chat with Nexon</h2>
          <button className="text-sm text-gray-500 hover:text-gray-800" onClick={onClose}>Close</button>
        </div>

        <div className="mb-2">
          <h4 className="text-sm text-gray-700 mb-1">Requested Fields</h4>
          <div className="flex flex-wrap gap-2">
            {requestedFields.map((field, idx) => (
              <span key={idx} className="px-2 py-1 text-xs bg-gray-100 border rounded-full text-gray-700">
                {field}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-2">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP if required"
            className="w-full p-2 text-sm border rounded mb-2"
          />
        </div>

        <div className="flex-1 overflow-y-auto mb-3 space-y-3 pr-1">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`px-4 py-2 rounded-lg text-sm max-w-[80%] whitespace-pre-wrap ${
                msg.sender === 'user'
                  ? 'bg-white border border-gray-300 text-gray-800'
                  : 'bg-blue-600 text-white'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="flex mt-2 gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-2 border rounded text-sm"
            placeholder="Ask something like 'Balance of Ravi'..."
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700 text-sm"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
