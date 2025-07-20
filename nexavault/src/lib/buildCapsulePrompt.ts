import { fieldAccessMatrix2 } from './fieldAccessMatrix';

export function buildCapsulePrompt(query: string, customerData: any[]): string {
  const matchedField = fieldAccessMatrix2.find(field =>
    query.toLowerCase().includes(field.key.toLowerCase())
  );

  if (!matchedField) {
    return `❌ The field you're trying to access is not recognized.`;
  }

  if (matchedField.requiresOtp) {
    return `🔐 Access to "${matchedField.name}" requires OTP verification. Please check your registered email for the OTP.`;
  }

  if (matchedField.rangeSafe) {
    const fieldKey = matchedField.key;
    const tableRows = customerData.map(customer => {
      const rawValue = customer[fieldKey];
      let displayValue = '';

      if (typeof rawValue === 'number') {
        // Example: Credit Score -> 720–740
        const floor = Math.floor(rawValue / 20) * 20;
        const ceiling = floor + 20;
        displayValue = `${floor}–${ceiling}`;
      } else if (typeof rawValue === 'string' && rawValue.includes('₹')) {
        // Parse INR balance fields like ₹50,000 available
        const match = rawValue.match(/₹([\d,]+)/);
        if (match) {
          const num = parseInt(match[1].replace(/,/g, ''));
          const floor = Math.floor(num / 20000) * 20000;
          const ceiling = floor + 20000;
          displayValue = `₹${floor.toLocaleString()}–₹${ceiling.toLocaleString()}`;
        }
      } else {
        displayValue = '—';
      }

      return `| ${customer.name} | ${customer.email || '—'} | ${customer.phone || '—'} | ${displayValue} |`;
    });

    return `
🔍 Capsule Secure Response
Field: ${matchedField.name}
Query: ${query}

| Name | Email | Phone | ${matchedField.name} |
|------|-------|-------|----------------------|
${tableRows.join('\n')}
    `.trim();
  }

  return `⚠️ The field "${matchedField.name}" cannot be answered without consent.`;
}
