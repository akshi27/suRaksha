import { Request, Response } from 'express';
import { handleCapsuleLLMQuery } from '../utils/capsule/groqCapsuleHandler';
import { logCapsuleQuery } from '../utils/capsule/logQuery';
import { encryptResponse, generateDecryptionScript } from '../utils/nexonEncryptor';
import fs from 'fs';
import path from 'path';
import { approvedServices } from '../data/approvedServices';

const capsuleQueryHandler = async (req: Request, res: Response) => {
  const { query, serviceName, capsuleType, otp } = req.body;

  console.log('📥 Incoming capsule query:', {
    query,
    serviceName,
    capsuleType,
    otp
  });

  if (!query || !serviceName || !capsuleType) {
    console.warn('⚠️ Missing required parameters');
    return res.status(400).json({ error: 'Missing parameters' });
  }

  const matchedService = approvedServices.find((s) => s.service === serviceName);
  if (!matchedService) {
    console.error('❌ Service not found:', serviceName);
    return res.status(404).json({ error: 'Service not found' });
  }

  console.log('🔍 Matched service:', matchedService.service);

  const requestedFields = matchedService.requestedFields;
  const useCase = matchedService.useCase;
  const lowerQuery = query.toLowerCase();

  const isSensitive =
    lowerQuery.includes('Mobile numbers (linked)') ||
    lowerQuery.includes('Mobile') ||
    lowerQuery.includes('Mobile numbers') ||
    lowerQuery.includes('Email IDs (linked)') ||
    lowerQuery.includes('Email IDs') ||
    lowerQuery.includes('Email ID') ||
    lowerQuery.includes('Email') ||
    lowerQuery.includes('Mail ID') ||
    lowerQuery.includes('Mail') ||
    lowerQuery.includes('Financial history (income, investments, loans)') ||
    lowerQuery.includes('Financial history') ||
    lowerQuery.includes('linked Email IDs') ||
    lowerQuery.includes('Linked Email IDs') ||
    lowerQuery.includes('Email IDs linked');

  if (capsuleType === 'real' && isSensitive) {
    const expectedOTP = process.env.SERVICE_ADMIN_OTP || '123456';
    if (otp !== expectedOTP) {
      console.warn('🔐 OTP required or incorrect. Provided:', otp);
      return res.status(403).json({ error: 'OTP required for this request' });
    } else {
      console.log('🔐 OTP validated successfully');
    }
  }

  try {
    if (!process.env.GROQ_API_KEY) {
      console.warn('⚠️ GROQ_API_KEY not found in environment!');
    }

    console.log('🧠 Sending query to Nexon LLM with fields:', requestedFields);

    const llmResponse = await handleCapsuleLLMQuery({
      query,
      useCase,
      requestedFields,
      serviceName,
      groqApiKey: process.env.GROQ_API_KEY || '',
    });

    console.log('✅ LLM raw response:', llmResponse);

    const { encryptedData, key, iv } = encryptResponse(llmResponse);
    const decryptScript = generateDecryptionScript(key, iv);

    const filePath = path.join(process.cwd(), 'public', 'scripts', `${serviceName}-decrypt.js`);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, decryptScript);
    console.log('💾 Decryption script saved at:', filePath);

    await logCapsuleQuery({ serviceName, capsuleType, query, response: encryptedData });

    console.log('🔐 Encrypted response ready to return');
    return res.status(200).json({ encryptedData });

  } catch (error: any) {
    console.error('💥 Capsule error:', error.message || error);
    return res.status(500).json({ error: 'Internal error' });
  }
};

export default capsuleQueryHandler;
