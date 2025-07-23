import { buildCapsulePrompt } from './buildCapsulePrompt';
import { readJsonFile } from '../fileUtils';
import path from 'path';

type CapsuleQueryParams = {
  query: string;
  useCase: string;
  requestedFields: string[];
  serviceName: string;
  groqApiKey: string;
};

const rangeAnswerableFields = [
  'credit score', 'salary', 'balance', 'bank balance', 'income', 'transaction amount'
];

function isFieldAllowed(query: string, allowedFields: string[]): boolean {
  const lowered = query.toLowerCase();
  return allowedFields.some(f => lowered.includes(f.toLowerCase()));
}

function isRangeBasedField(query: string): boolean {
  const lowered = query.toLowerCase();
  return rangeAnswerableFields.some(f => lowered.includes(f));
}

export async function handleCapsuleLLMQuery({
  query,
  useCase,
  requestedFields,
  serviceName,
  groqApiKey
}: CapsuleQueryParams): Promise<string> {
  if (!isFieldAllowed(query, requestedFields)) {
    return `❌ Access Denied: You can only ask about the approved fields.\n\nApproved fields: ${requestedFields.join(', ')}`;
  }

  // ✅ Load bank data
  const allData = await readJsonFile<any[]>('data/user_bank_data.json');

  // ✅ Load approved services
  const { approvedServices } = await import('../../data/approvedServices');
  const service = approvedServices.find(s => s.service === serviceName);
  if (!service) return '❌ Error: Service not recognized.';

  const targetEmails = service.customers.map((c) => c.email);
  const relevantData = allData.filter((row) => targetEmails.includes(row.email));

  const displayData = relevantData.map((row) => {
    const filtered: Record<string, any> = {};
    requestedFields.forEach(field => {
      if (row[field] !== undefined) filtered[field] = row[field];
    });
    filtered.name = row.name; // always include name for context
    return filtered;
  });

  const prompt = `You are Nexon — a secure AI assistant for Nexavault.

Your job is to answer questions using the following customer dataset:

${displayData.map(d => JSON.stringify(d)).join('\n')}

User query: ${query}`;

console.log('📦 Prompt sent to Groq:\n', prompt);

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${groqApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3-3b-8192',
      temperature: isRangeBasedField(query) ? 0.3 : 0.1,
      messages: [
        { role: 'system', content: 'You are a secure LLM designed for privacy-preserving query answering.' },
        { role: 'user', content: prompt }
      ]
    })
  });

  const data = await res.json();

  if (!res.ok || !data.choices?.[0]?.message?.content) {
    console.error('Groq error:', data);
    throw new Error('LLM response error');
  }

  return data.choices[0].message.content.trim();
}

