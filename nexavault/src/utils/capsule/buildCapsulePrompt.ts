import { demoCapsuleCustomerData } from '../../components/capsule/DemoObserverCapsule';

function toBase64UnicodeSafe(input: string): string {
  return Buffer.from(input, 'utf-8').toString('base64');
}

export function buildCapsulePrompt(
  service: string,
  query: string,
  requestedFields: string[]
): string {
  const customers = demoCapsuleCustomerData[service];
  if (!customers) return '❌ No such service found.';

  const header = requestedFields.join(' | ');

  const rows = customers.map((cust: Record<string, any>) => {
    const row = requestedFields.map((field) => {
      const val = Object.entries(cust).find(([key]) =>
        key.toLowerCase().replace(/[^a-z]/g, '') === field.toLowerCase().replace(/[^a-z]/g, '')
      )?.[1];

      // IMPORTANT: Change this line. If you want an empty value, use an empty string.
      // Do NOT return '---' here, as that creates the markdown separator effect.
      if (!val) return ''; // Or return 'N/A' or 'BLANK' as per your display preference

      const raw = typeof val === 'string' ? val : JSON.stringify(val);
      // Ensure btoa and unescape/encodeURIComponent are available in your environment (e.g., browser or polyfilled in Node.js)
      const encoded = btoa(unescape(encodeURIComponent(raw)));
      return encoded.slice(0, 12).replace(/=/g, '').replace(/\+/g, 'x').replace(/\//g, 'y');
    });

    return row.join(' | ');
  });

  // ******* The key change is here *******
  // Remove the '--- | ---' line that creates the markdown table effect
  const dataRows = [header, ...rows]; // Just header and data rows

  const finalTable = dataRows.join('\n'); // Join them with newlines

  return `
🔐 Capsule Secure Response
Service: ${service}
Query: ${query}

${finalTable}
`.trim();
}

// Your buildLLMPrompt remains the same, as it consumes the output of buildCapsulePrompt
export function buildLLMPrompt(
  serviceName: string,
  useCase: string,
  requestedFields: string[],
  query: string
): string {
  return `
You are Nexon — an LLM embedded within Nexavault, a cybersecurity system built to enable *privacy-preserving data sharing* between banks and third-party financial services.

---

🔐 SECURITY CONTEXT:

- You are answering on behalf of the bank to a request by a third-party service: "${serviceName}".
- The service’s use case is: "${useCase}".
- You may ONLY respond using the following fields approved for this service:
  - ${requestedFields.map((f) => `• ${f}`).join('\n   - ')}

⚠️ Any fields not in the list above are to be treated as Confidential and should never be inferred or guessed.

If the query involves fields outside the allowed list (like PAN, Aadhaar, CVV, account number, etc.), you must respond:

> ❌ "The requested information is confidential or requires user consent. Please raise a visibility request."

---

💡 YOUR OBJECTIVE:

Answer the third-party’s query using only:
- ✅ Bank Approved fields
- 🟦 Mask Share fields (you must **obscure** these values appropriately)
- 🟧 With Consent fields

DO NOT:
- Leak or reference Confidential data
- Invent unauthorized fields
- Include any disclaimers unless absolutely necessary

---

🔍 USER QUERY:
${query}

---

📘 FORMAT:
Your response should be factual, clear, and in plain English — no legal disclaimers or notes unless the query involves a masked or consent-based field. You may list anonymized sample values if applicable.

---

🔒 IMPORTANT:
Your response will be encrypted by the Nexavault backend before being sent to the third-party. Do not attempt to encrypt or obfuscate the data yourself — just provide the clean plaintext answer within your field boundaries.

---

Proceed to answer based on your restricted access. If unsure, err on the side of denying access.
`.trim();
}