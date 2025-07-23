import express, { Request, Response } from 'express';
const router = express.Router();

// Define the shape of the request body for better type checking
interface GenerateSecureHtmlRequestBody {
  serviceName: string; // Changed from 'keyof typeof serviceCustomerData'
  customers: any[];    // This is the new property for the customer data
  password: string;
}

// Define the customer data based on the service name
// const serviceCustomerData = {
//   'Google Pay': [
//     {
//       "name": "Ravi Kumar",
//       "email": "ravi.kumar@example.com",
//       "phone": "+91 9876543210",
//       "accountHolderName": "Ravi Kumar",
//       "ifscCode": "HDFC0001234",
//       "bankName": "HDFC Bank",
//       "accountType": "Savings",
//       "transactionReferenceNo": "TRN12345",
//       "accountNumber": "XXXXXXXXXXXX3456",
//       "mobileNumbers(linked)": "+91 XXXXX43210"
//     },
//     {
//       "name": "Priya Singh",
//       "email": "priya.singh@example.com",
//       "phone": "+91 8765432109",
//       "accountHolderName": "Priya Singh",
//       "ifscCode": "ICIC0005678",
//       "bankName": "ICICI Bank",
//       "accountType": "Current",
//       "transactionReferenceNo": "TRN67890",
//       "accountNumber": "XXXXXXXXXXXX4321",
//       "mobileNumbers(linked)": "+91 XXXXX32109"
//     },
//     {
//       "name": "Mohit Sharma",
//       "email": "mohit.shampoo@example.com",
//       "phone": "+91 7654321098",
//       "accountHolderName": "Mohit Sharma",
//       "ifscCode": "AXIS0009012",
//       "bankName": "Axis Bank",
//       "accountType": "Savings",
//       "transactionReferenceNo": "TRN11223",
//       "accountNumber": "XXXXXXXXXXXX3456",
//       "mobileNumbers(linked)": "+91 XXXXX21098"
//     },
//     {
//       "name": "Anjali Gupta",
//       "email": "anjali.gupta@example.com",
//       "phone": "+91 9123456789",
//       "accountHolderName": "Anjali Gupta",
//       "ifscCode": "PNB0001001",
//       "bankName": "PNB Bank",
//       "accountType": "Savings",
//       "transactionReferenceNo": "TRN44556",
//       "accountNumber": "XXXXXXXXXXXX2938",
//       "mobileNumbers(linked)": "+91 XXXXX56789"
//     },
//     {
//       "name": "Deepak Verma",
//       "email": "deepak.verma@example.com",
//       "phone": "+91 9012345678",
//       "accountHolderName": "Deepak Verma",
//       "ifscCode": "SBI0002002",
//       "bankName": "SBI Bank",
//       "accountType": "Current",
//       "transactionReferenceNo": "TRN77889",
//       "accountNumber": "XXXXXXXXXXXX3847",
//       "mobileNumbers(linked)": "+91 XXXXX45678"
//     }
//   ],
//   'QuickLoan': [
//     {
//       "name": "Suresh Rao",
//       "email": "suresh.rao@example.com",
//       "phone": "+91 9988776655",
//       "fullName": "Suresh Rao",
//       "dateOfBirth": "1985-05-10",
//       "pan": "XXXXXX1234F",
//       "aadhaarNumber": "XXXXXXXX9012",
//       "address": "xxx",
//       "mobileNumbers(linked)": "+91 XXXXX76655",
//       "bankAccountNumber": "XXXXXXXXXXXX7654"
//     },
//     {
//       "name": "Neha Joshi",
//       "email": "neha.joshi@example.com",
//       "phone": "+91 9876543210",
//       "fullName": "Neha Joshi",
//       "dateOfBirth": "1992-11-20",
//       "pan": "XXXXXX5678K",
//       "aadhaarNumber": "XXXXXXXX0123",
//       "address": "xxx",
//       "mobileNumbers(linked)": "+91 XXXXX43210",
//       "bankAccountNumber": "XXXXXXXXXXXX3456"
//     },
//     {
//       "name": "Vijay Kumar",
//       "email": "vijay.kumar@example.com",
//       "phone": "+91 8765432109",
//       "fullName": "Vijay Kumar",
//       "dateOfBirth": "1978-03-15",
//       "pan": "XXXXXX9012L",
//       "aadhaarNumber": "XXXXXXXX1234",
//       "address": "xxx",
//       "mobileNumbers(linked)": "+91 XXXXX32109",
//       "bankAccountNumber": "XXXXXXXXXXXX4567"
//     },
//     {
//       "name": "Kavita Devi",
//       "email": "kavita.devi@example.com",
//       "phone": "+91 7654321098",
//       "fullName": "Kavita Devi",
//       "dateOfBirth": "1995-09-01",
//       "pan": "XXXXXX3456M",
//       "aadhaarNumber": "XXXXXXXX2345",
//       "address": "xxx",
//       "mobileNumbers(linked)": "+91 XXXXX21098",
//       "bankAccountNumber": "XXXXXXXXXXXX5678"
//     },
//     {
//       "name": "Rajesh Khanna",
//       "email": "rajesh.khanna@example.com",
//       "phone": "+91 9123456789",
//       "fullName": "Rajesh Khanna",
//       "dateOfBirth": "1980-01-25",
//       "pan": "XXXXXX7890N",
//       "aadhaarNumber": "XXXXXXXX3456",
//       "address": "xxx",
//       "mobileNumbers(linked)": "+91 XXXXX56789",
//       "bankAccountNumber": "XXXXXXXXXXXX6789"
//     }
//   ],
//   'DataBridge AA': [
//     {
//       "name": "Anil Kumar",
//       "email": "anil.kumar@example.com",
//       "phone": "+91 7654321098",
//       "consentTimestamp/status": "Accepted",
//       "fiuId": "Not provided in sample",
//       "cif/CustomerId": "CIFXXX",
//       "allLinkedAccountNumbers": "XXX123, XXX456",
//       "accountType(linked)": "Savings"
//     },
//     {
//       "name": "Geeta Devi",
//       "email": "geeta.devi@example.com",
//       "phone": "+91 9123456789",
//       "consentTimestamp/status": "Accepted",
//       "fiuId": "Not provided in sample",
//       "cif/CustomerId": "CIFXXX",
//       "allLinkedAccountNumbers": "XXX789, XXX012",
//       "accountType(linked)": "Current"
//     },
//     {
//       "name": "Sanjay Gupta",
//       "email": "sanjay.gupta@example.com",
//       "phone": "+91 9012345678",
//       "consentTimestamp/status": "Accepted",
//       "fiuId": "Not provided in sample",
//       "cif/CustomerId": "CIFXXX",
//       "allLinkedAccountNumbers": "XXX345, XXX678",
//       "accountType(linked)": "Savings"
//     },
//     {
//       "name": "Priyanka Singh",
//       "email": "priyanka.singh@example.com",
//       "phone": "+91 9876543210",
//       "consentTimestamp/status": "Accepted",
//       "fiuId": "Not provided in sample",
//       "cif/CustomerId": "CIFXXX",
//       "allLinkedAccountNumbers": "XXX901, XXX234",
//       "accountType(linked)": "Current"
//     }
//   ],
//   'InvestSmart': [
//     {
//       "name": "Sunil Das",
//       "email": "sunil.das@example.com",
//       "phone": "+91 9870123456",
//       "fullName": "Sunil Das",
//       "pan": "ABCDE1234F",
//       "bankAccountNumber": "1122334455667788",
//       "portfolioHoldings": "AAPL, GOOG",
//       "riskProfileAssessment": "Moderate",
//       "address": "xxx",
//       "mobileNumbers(linked)": "+91 XXXXX23456",
//       "emailIDsLinked": "xxx"
//     },
//     {
//       "name": "Preeti Singh",
//       "email": "preeti.singh@example.com",
//       "phone": "+91 9988776655",
//       "fullName": "Preeti Singh",
//       "pan": "FGHIJ5678K",
//       "bankAccountNumber": "2233445566778899",
//       "portfolioHoldings": "TSLA, MSFT",
//       "riskProfileAssessment": "Aggressive",
//       "address": "xxx",
//       "mobileNumbers(linked)": "+91 XXXXX76655",
//       "emailIDsLinked": "xxx"
//     },
//     {
//       "name": "Gopal Reddy",
//       "email": "gopal.reddy@example.com",
//       "phone": "+91 8765432109",
//       "fullName": "Gopal Reddy",
//       "pan": "KLMNO9012L",
//       "bankAccountNumber": "3344556677889900",
//       "portfolioHoldings": "AMZN, FB",
//       "riskProfileAssessment": "Conservative",
//       "address": "xxx",
//       "mobileNumbers(linked)": "+91 XXXXX32109",
//       "emailIDsLinked": "xxx"
//     },
//     {
//       "name": "Ankita Sharma",
//       "email": "ankita.sharma@example.com",
//       "phone": "+91 7654321098",
//       "fullName": "Ankita Sharma",
//       "pan": "PQRST3456M",
//       "bankAccountNumber": "4455667788990011",
//       "portfolioHoldings": "NFLX, NVDA",
//       "riskProfileAssessment": "Moderate",
//       "address": "xxx",
//       "mobileNumbers(linked)": "+91 XXXXX21098",
//       "emailIDsLinked": "xxx"
//     }
//   ],
//   'PaySwift Wallet': [
//     {
//       "name": "Varun Sharma",
//       "email": "varun.sharma@example.com",
//       "phone": "+91 9876501234",
//       "mobileNumbers(linked)": "+91 XXXXX01234",
//       "walletId": "WLT001",
//       "transactionTimestamp": "2025-07-01 10:00:00",
//       "linkedBankAccountNumber(masked)": "XXXXXXXXXXXX4444",
//       "upiId": "xxx"
//     },
//     {
//       "name": "Disha Patel",
//       "email": "disha.patel@example.com",
//       "phone": "+91 9765401234",
//       "mobileNumbers(linked)": "+91 XXXXX01234",
//       "walletId": "WLT002",
//       "transactionTimestamp": "2025-07-01 11:00:00",
//       "linkedBankAccountNumber(masked)": "XXXXXXXXXXXX8888",
//       "upiId": "xxx"
//     },
//     {
//       "name": "Karan Singh",
//       "email": "karan.singh@example.com",
//       "phone": "+91 9654301234",
//       "mobileNumbers(linked)": "+91 XXXXX01234",
//       "walletId": "WLT003",
//       "transactionTimestamp": "2025-07-01 12:00:00",
//       "linkedBankAccountNumber(masked)": "XXXXXXXXXXXX2222",
//       "upiId": "xxx"
//     },
//     {
//       "name": "Ritika Gupta",
//       "email": "ritika.gupta@example.com",
//       "phone": "+91 9543201234",
//       "mobileNumbers(linked)": "+91 XXXXX01234",
//       "walletId": "WLT004",
//       "transactionTimestamp": "2025-07-01 13:00:00",
//       "linkedBankAccountNumber(masked)": "XXXXXXXXXXXX6666",
//       "upiId": "xxx"
//     },
//     {
//       "name": "Arjun Kumar",
//       "email": "arjun.kumar@example.com",
//       "phone": "+91 9432101234",
//       "mobileNumbers(linked)": "+91 XXXXX01234",
//       "walletId": "WLT005",
//       "transactionTimestamp": "2025-07-01 14:00:00",
//       "linkedBankAccountNumber(masked)": "XXXXXXXXXXXX0000",
//       "upiId": "xxx"
//     }
//   ]
// };

router.post('/generate-secure-html', (req: Request<{}, {}, GenerateSecureHtmlRequestBody>, res: Response) => {
  const { serviceName, customers, password } = req.body;

  const dataToDisplay = JSON.stringify(customers, null, 2); // Pretty print

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${serviceName} — Secure Data</title>
      <style>
        body {
          font-family: 'Segoe UI', sans-serif;
          background: #f4f4f4;
          padding: 2rem;
          color: #333;
        }
        #form, #countdown, #error {
          margin-top: 1rem;
        }
        #content {
          display: none;
          white-space: pre-wrap;
          background: #fff;
          padding: 1rem;
          border: 1px solid #ccc;
          border-radius: 8px;
          max-height: 70vh;
          overflow-y: auto;
        }
        #copyBtn {
          margin-top: 10px;
          padding: 8px 12px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
      </style>
    </head>
    <body>
      <h2>${serviceName} — 🔐 Secure View</h2>
      <p>This file is password protected. Please enter your password to unlock.</p>

      <div id="form">
        <input type="password" id="password" placeholder="Enter password..." />
        <button onclick="unlock()">Unlock</button>
        <div id="error" style="color: red;"></div>
      </div>

      <div id="countdown" style="color: red; font-weight: bold;"></div>

      <div id="content">
        <pre id="secureData">${dataToDisplay}</pre>
        <button id="copyBtn" onclick="copyToClipboard()">📋 Copy to Clipboard</button>
      </div>

      <script>
        const correctPassword = "${password}";
        let expireTimer;
        let countdownTimer;

        function unlock() {
          const input = document.getElementById('password').value;
          if (input === correctPassword) {
            document.getElementById('form').style.display = 'none';
            document.getElementById('content').style.display = 'block';
            startCountdown();
            setAutoExpire();
          } else {
            document.getElementById('error').textContent = '❌ Incorrect password.';
          }
        }

        function startCountdown() {
          let secondsLeft = 60;
          const countdownEl = document.getElementById('countdown');
          countdownEl.innerText = '⚠️ File will auto-lock in 60 seconds';
          countdownTimer = setInterval(() => {
            secondsLeft--;
            countdownEl.innerText = '⚠️ File will auto-lock in ' + secondsLeft + ' seconds';
            if (secondsLeft <= 0) {
              clearInterval(countdownTimer);
              countdownEl.innerText = '';
            }
          }, 1000);
        }

        function setAutoExpire() {
          expireTimer = setTimeout(() => {
            alert('⏳ Session expired. File is locked again.');
            document.getElementById('content').style.display = 'none';
            document.getElementById('form').style.display = 'block';
            document.getElementById('password').value = '';
          }, 60000);
        }

        function copyToClipboard() {
          const text = document.getElementById('secureData').innerText;
          navigator.clipboard.writeText(text).then(() => {
            alert('✅ Copied to clipboard!');
          }).catch(err => {
            alert('❌ Failed to copy.');
          });
        }

        window.onbeforeunload = () => {
          clearTimeout(expireTimer);
          clearInterval(countdownTimer);
        };
      </script>
    </body>
    </html>
  `;

  res.setHeader('Content-Disposition', `attachment; filename="${serviceName}_secure.html"`);
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

export default router;
