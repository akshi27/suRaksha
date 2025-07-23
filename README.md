# suRaksha

# 🔐 Nexavault

> **A Privacy-Preserving, Consent-Driven Data Sharing System for the Future of Fintech**

Nexavault is a cybersecurity-first middleware platform that mediates data sharing between banks and third-party services like Google Pay, CRED, etc. It enforces field-level access control, query-bound permissions, and user consent via capsules powered by LLMs and differential privacy.

---

## 📦 Tech Stack

### Frontend
- `React.js` + `Vite` + `Tailwind CSS`
- `ShadCN/UI` for clean, modular components
- `Framer Motion` for UI animations

### Backend
- `Node.js` + `Express.js` (TypeScript)
- `LLM (Nexon)` for field classification and capsule queries
- `AES-256 Encryption` for secure data packaging
- `Differential Privacy` for protecting confidential responses

---

## 🚀 Core Features

- ✅ **Field-Level Consent Approval** (`Bank Approved`, `Mask Share`, `With Consent`, `Confidential`)
- 🔐 **Capsule-Based Sharing** (LLM answers third-party queries with encrypted output)
- 📡 **Real-Time Alerts** (On face/IP mismatch with plausible decoy replies)
- 🧠 **LLM-powered Classification** (via Retrieval Augmented Generation)
- ✉️ **OTP Gating** for sensitive access or downloads
- 📁 **Encrypted Downloads + Rotating Keys** for shared datasets
- 🔄 **Revocable Capsule Deletion**
- 🧑‍💬 **Admin ↔ Third-Party Chat with File & Voice Support**

---

## 🛠️ Local Development Setup

> These instructions assume you're using **VSCode**. We recommend using a **split terminal view** for easy parallel execution.

### ✅ Step 1: Clone the Repository

```bash
git clone https://github.com/akshi27/suRaksha.git
```
---

### ✅ Step 2: Install Dependencies and run
1. Open VScode and open `nexavault` as a folder
2. Split terminal

####
3. In the left terminal, run `cd backend`. (The final path after running this command should ideally look like `C:\Users\<user's name>\suRaksha\nexavault\backend`)
4. In the same split terminal, run `npx tsx index.ts`

####
5. In the right terminal, run `cd ..` (The final path after running this command should ideally look like `C:\Users\<user's name>\suRaksha\nexavault`)
6. In the same split terminal, run `npx vite` 

---

## 🛠️ Login Page Credentials
####
Email : `arunakshi27@gmail.com`
Password : `password`

---

## 📝 An Important Note 
####
Kindly get your own `Groq api key` (https://console.groq.com/keys) and put in as `groqApiKey` in `C:\Users\<user's name>\suRaksha\nexavault\src\pages\ApprovedPage.tsx` before running the commands
