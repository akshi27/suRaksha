// backend/routes/api/filterParse.ts
import express from 'express';

const router = express.Router();

router.post('/', async (req, res) => {
  const { query } = req.body;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid query' });
  }

  const prompt = `
You are an assistant for filtering customer data in a tabular system.

Your sole task is to extract valid **row-level filters** from the user's query.
You are NOT allowed to extract or change which columns are displayed (i.e., projection). 
If the query is not about **filtering rows**, return an error message.

---

1. ✅ **Fields Present**:
   Valid fields include common customer data like: name, email, phone, dateOfBirth, accountNumber, balance, pan, aadhaar, creditScore, address, etc.

2. ✅ **Short Form Handling**:
   Normalize common abbreviations:
   - "dob" → "dateOfBirth"
   - "acc no", "account no" → "accountNumber"
   - "txn ref" → "transactionReferenceNo"
   - "ifsc" → "ifscCode"
   - "pan" → "pan"
   - "aadhaar" → "aadhaar"
   - "balance" → "balance"
   - "age" → use "dateOfBirth" to calculate age
   - "phone", "mobile" → "phone"
   - "name" → "name"

3. ✅ **Supported Filter Types**:
   - **Text**: type = "text", operators: includes (default), startsWith, endsWith, =
   - **Numeric**: type = "numeric", operators: >, <, >=, <=, =
   - **DateRange**: type = "dateRange"
     - age filters convert to minAge/maxAge
     - "born between 1980 and 1990" converts to startDate/endDate

---

Output structure:
If filter valid:
\`\`\`json
{
  "filter": {
    "type": "text" | "numeric" | "dateRange",
    "field": "fieldName",
    "operator": "=" | ">" | "<" | ">=" | "<=" | "includes" | "startsWith" | "endsWith",
    "value": string | number,
    "startDate": "YYYY-MM-DD",
    "endDate": "YYYY-MM-DD",
    "minAge": number,
    "maxAge": number
  }
}
\`\`\`

If invalid:
\`\`\`json
{ "error": "Only row-based filters are supported. I cannot change which columns are displayed." }
\`\`\`

---

User query: "${query}"
`;

  // Dummy simulation for now (replace with OpenAI or Groq call)
  const fakeLLM = (query: string): any => {
    if (query.toLowerCase().includes('ravi')) {
      return {
        filter: {
          type: 'text',
          field: 'name',
          operator: 'includes',
          value: 'Ravi'
        }
      };
    }

    if (query.toLowerCase().includes('age > 30')) {
      return {
        filter: {
          type: 'dateRange',
          minAge: 30
        }
      };
    }

    return { error: 'Unable to understand your filter. Try "age > 30" or "name includes Ravi"' };
  };

  const result = fakeLLM(query);

  return res.json(result);
});

export default router;
