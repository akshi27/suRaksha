"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCapsulePrompt = buildCapsulePrompt;
var approvedServices_1 = require("../../data/approvedServices");
function buildCapsulePrompt(_a) {
    var query = _a.query, useCase = _a.useCase, requestedFields = _a.requestedFields, serviceName = _a.serviceName;
    var matched = approvedServices_1.approvedServices.find(function (s) { return s.service === serviceName; });
    if (!matched || !matched.customers)
        return 'No customer data available.';
    var rows = matched.customers.map(function (c) {
        return "Name: ".concat(c.name, ", Email: ").concat(c.email, ", Phone: ").concat(c.phone, ", ").concat(requestedFields
            .map(function (f) { var _a; return "".concat(f, ": ").concat((_a = c[f]) !== null && _a !== void 0 ? _a : 'N/A'); })
            .join(', '));
    });
    return "\nYou are Nexon \u2014 an LLM embedded within Nexavault, a cybersecurity system built to enable *privacy-preserving data sharing* between banks and third-party financial services.\n\n---\n\n\uD83D\uDD10 SECURITY CONTEXT:\n\n- You are answering on behalf of the bank to a request by a third-party service: \"".concat(serviceName, "\".\n- The service\u2019s use case is: \"").concat(useCase, "\".\n- You may ONLY respond using the following fields approved for this service:\n  - ").concat(requestedFields.map(function (f) { return "\u2022 ".concat(f); }).join('\n  - '), "\n\n\u26A0\uFE0F Any fields not in the list above are to be treated as Confidential and should never be inferred or guessed.\n\nIf the query involves fields outside the allowed list (like PAN, Aadhaar, CVV, account number, etc.), you must respond:\n\n> \u274C \"The requested information is confidential or requires user consent. Please raise a visibility request.\"\n\n---\n\n\uD83D\uDCA1 YOUR OBJECTIVE:\n\nAnswer the third-party\u2019s query using only:\n- \u2705 Bank Approved fields\n- \uD83D\uDFE6 Mask Share fields (you must **obscure** these values appropriately)\n- \uD83D\uDFE7 With Consent fields\n\nDO NOT:\n- Leak or reference Confidential data\n- Invent unauthorized fields\n- Include any disclaimers unless absolutely necessary\n\n---\n\n\uD83D\uDD0D USER QUERY:\n").concat(query, "\n\n---\n\n\uD83D\uDCD8 FORMAT:\nYour response should be factual, clear, and in plain English \u2014 no legal disclaimers or notes unless the query involves a masked or consent-based field. You may list anonymized sample values if applicable.\n\n---\n\n\uD83D\uDD12 IMPORTANT:\nYour response will be encrypted by the Nexavault backend before being sent to the third-party. Do not attempt to encrypt or obfuscate the data yourself \u2014 just provide the clean plaintext answer within your field boundaries.\n\n---\n\nProceed to answer based on your restricted access. If unsure, err on the side of denying access.\n").trim();
}
;
