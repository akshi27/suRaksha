// utils/decryption/generateDecryptScript.ts

import { TableRow } from '../../components/capsule/DemoObserverCapsule';

// You must pass the raw customer data for accurate decryption
interface CustomerRecord {
  name: string;
  email?: string;
  phone?: string;
  [key: string]: any;
}

export function generateDecryptScript(
  originalQuery: string,
  table: TableRow[],
  service: string,
  rawCustomers: CustomerRecord[]
): string {
  // Helper to match obfuscated → original
  const findOriginal = (encryptedField: string, type: 'name' | 'email' | 'phone'): CustomerRecord | null => {
    const obfuscate = (str: string | undefined | null): string => {
      if (!str || str === '—') return '—';
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0;
      }
      const hashed = Math.abs(hash).toString(36).substring(0, 8);
      if (type === 'email') return `${hashed}@xyz.com`;
      if (type === 'phone') return hashed.replace(/\D/g, '').padStart(8, '0').substring(0, 8);
      return hashed;
    };

    return rawCustomers.find(c => {
      if (type === 'name') return obfuscate(c.name) === encryptedField;
      if (type === 'email') return obfuscate(c.email) === encryptedField;
      if (type === 'phone') return obfuscate(c.phone) === encryptedField;
      return false;
    }) || null;
  };

  const decryptMap = table.map((row) => {
    const match = findOriginal(row.name, 'name');

    return {
      encryptedName: row.name,
      encryptedEmail: row.email,
      encryptedPhone: row.phone,
      encryptedValue: row.value,
      decryptedName: match?.name || 'Unknown',
      decryptedEmail: match?.email || 'Unknown',
      decryptedPhone: match?.phone || 'Unknown',
      decryptedValue: '🔓 You must map encryptedValue manually if range-based.',
    };
  });

  return `/**
 * 🔐 Decryption Script for Capsule Query
 * Service: ${service}
 * Query: ${originalQuery}
 *
 * This script maps obfuscated capsule values to their original data.
 */

const decryptMap = ${JSON.stringify(decryptMap, null, 2)};

console.table(decryptMap);

// You can filter this further by query, names, etc.
`;
}
