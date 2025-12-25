# AI-Powered Legal Contract Review & Risk Analysis Assistant

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-green)

**An intelligent system that analyzes legal contracts, identifies key clauses, assesses risks, and explains complex legal terms in plain language.**

[Features](#features) • [Demo](#demo) • [Installation](#installation) • [Usage](#usage) • [Architecture](#architecture) • [Contributing](#contributing)

</div>

---

## 🎯 Overview

The AI-Powered Legal Contract Review & Risk Analysis Assistant is a comprehensive web application designed to help users understand legal contracts through automated AI analysis. Built with cutting-edge technologies, it combines natural language processing, structured AI prompting, and modern web development to deliver actionable insights from legal documents.

**⚠️ Important Notice:** This tool is designed for **informational and educational purposes only**. It does not constitute legal advice and should not replace consultation with a licensed attorney.

---

## 💡 Real-World Use Cases

### Who Is This For?

This tool helps **anyone dealing with contracts** understand what they're signing:

- **Job Seekers** reviewing employment contracts before accepting offers
- **Freelancers** analyzing client agreements and service contracts
- **Students** learning about contract law and legal document analysis
- **Small Business Owners** reviewing vendor agreements and partnership contracts
- **Professionals** understanding NDAs, non-compete clauses, and consulting agreements

### Simple Example: Employment Contract

**The Problem:**
You receive a 20-page employment contract full of legal terms like "indemnification," "consequential damages," and "termination for cause." You don't understand what you're agreeing to.

**The Solution:**
1. **Upload** your employment contract (PDF/DOCX/TXT)
2. **Get Instant Analysis** in 30 seconds:
   - ⚠️ **HIGH RISK**: Unlimited liability clause means you could be responsible for unlimited damages
   - ⚠️ **HIGH RISK**: At-will termination means you can be fired without notice
   - ✅ **LOW RISK**: Confidentiality clause is standard 2-year term with clear scope
   - ⚠️ **MEDIUM RISK**: Non-compete clause restricts work for 1 year after leaving

3. **Ask Questions** like:
   - "Can I work for a competitor after leaving?"
   - "What happens if I accidentally share confidential information?"
   - "How much notice do I get before termination?"

4. **Get Plain English Answers**:
   - "Based on the non-compete clause, you cannot work for direct competitors in the same industry for 12 months after your employment ends..."

**The Value:**
You now understand the risks BEFORE signing. You can negotiate better terms or consult a lawyer about specific high-risk clauses.

---

## ✨ Features

### 🔍 Intelligent Contract Analysis
- **Multi-Format Support**: Upload contracts in PDF, DOCX, or TXT format (up to 10MB)
- **Automated Clause Detection**: Identifies 4 critical clause types:
  - Liability Clauses
  - Termination Clauses
  - Confidentiality Clauses
  - Payment Terms Clauses
- **Risk Assessment**: Assigns LOW, MEDIUM, or HIGH risk levels based on predefined legal criteria
- **Plain-Language Explanations**: Translates complex legal jargon into accessible language

### 💬 Interactive Q&A System
- **Context-Aware Chat**: Ask questions about your contract and receive intelligent responses
- **Conversation History**: Maintains persistent chat history for each contract
- **Sensitive Topic Detection**: Identifies questions requiring extra legal caution
- **Suggested Questions**: Pre-loaded prompts to guide user inquiries

### 📊 Professional Reporting
- **PDF Export**: Generate comprehensive analysis reports
- **Visual Risk Indicators**: Color-coded badges (Red/Yellow/Green)
- **Detailed Breakdowns**: View original clause text, explanations, and risk rationale
- **Contract History**: Access previously analyzed documents

### 🛡️ Safety & Ethics
- **Multiple Disclaimers**: Clear warnings throughout the application
- **No Legal Advice**: Explicitly states informational purpose
- **Enhanced Warnings**: Special disclaimers for sensitive legal topics
- **Professional Consultation Encouraged**: Recommends attorney review for important decisions

---

## 🚀 Demo

### Sample Analysis Output

```json
{
  "overallRiskLevel": "high",
  "summary": "This contract contains several high-risk elements including unlimited liability...",
  "clauses": [
    {
      "type": "liability",
      "riskLevel": "high",
      "plainLanguageExplanation": "You are responsible for all possible damages with no upper limit.",
      "riskReasons": [
        "Unlimited liability exposure",
        "Includes consequential damages",
        "Broad indemnification requirements"
      ]
    }
  ]
}
```

---

## 🏗️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - Modern UI library
- **TypeScript 5** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **Lucide React** - Icon library
- **React Hot Toast** - Notification system

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma 5** - Type-safe ORM
- **SQLite** - Development database (PostgreSQL recommended for production)

### AI/ML
- **OpenAI GPT-4o** - Advanced language model
- **Custom Prompting System** - Structured analysis criteria
- **JSON Mode** - Reliable structured output

### Document Processing
- **pdf-parse** - PDF text extraction
- **mammoth** - DOCX to text conversion
- **Native Node.js** - TXT file handling

---

## 📦 Installation

### Prerequisites

- **Node.js** 18+ or **Bun**
- **Database**: SQLite (development) or PostgreSQL (production)
- **OpenAI API Key**: Get one from [OpenAI Platform](https://platform.openai.com/)

### Step 1: Clone the Repository

```bash
git clone https://github.com/mr-taha-saqib/ai-powered-legal-contract-review-risk-analysis-assistant.git
cd ai-powered-legal-contract-review-risk-analysis-assistant
```

### Step 2: Install Dependencies

```bash
npm install
# or
bun install
```

### Step 3: Environment Configuration

Create a `.env` file in the root directory:

```bash
# OpenAI API Configuration
OPENAI_API_KEY="your-openai-api-key-here"

# Database Configuration
DATABASE_URL="file:./dev.db"  # SQLite for development
# DATABASE_URL="postgresql://user:password@localhost:5432/contract_analyzer"  # PostgreSQL for production

# Optional Configuration
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE_MB=10
```

### Step 4: Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev
```

### Step 5: Start Development Server

```bash
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📖 Usage

### 1. Upload a Contract

- Drag and drop a contract file (PDF, DOCX, or TXT)
- Or click "Browse Files" to select a document
- Maximum file size: 10MB

### 2. View AI Analysis

- **Overall Risk Level**: HIGH, MEDIUM, or LOW
- **Executive Summary**: Brief overview of key risks
- **Clause Details**: Click to expand each detected clause
  - Original contract text
  - Plain-language explanation
  - Specific risk factors

### 3. Ask Questions

- Click the chat icon in the bottom-right corner
- Type your question or select a suggested prompt
- Receive AI-powered answers with context from your contract

### 4. Export Report

- Click "Export PDF" to generate a professional report
- Share with colleagues or legal advisors
- Includes all analysis details and disclaimers

---

## 🏛️ Architecture

### Database Schema

```prisma
model Contract {
  id            String   @id @default(cuid())
  filename      String
  originalName  String
  fileType      String   // "pdf" | "docx" | "txt"
  fileSize      Int
  filePath      String
  extractedText String
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  analysis      Analysis?
  chatMessages  ChatMessage[]
}

model Analysis {
  id               String   @id @default(cuid())
  contractId       String   @unique
  overallRiskLevel String   // "low" | "medium" | "high"
  summary          String
  rawResponse      String   // JSON stringified
  clauses          Clause[]
  createdAt        DateTime @default(now())
}

model Clause {
  id                       String   @id @default(cuid())
  analysisId               String
  type                     String   // "liability" | "termination" | "confidentiality" | "payment"
  originalText             String
  riskLevel                String   // "low" | "medium" | "high"
  plainLanguageExplanation String
  riskReasons              String   // JSON array
  isOverride               Boolean  @default(false)
  overrideJustification    String?
  createdAt                DateTime @default(now())
}

model ChatMessage {
  id            String   @id @default(cuid())
  contractId    String
  role          String   // "user" | "assistant"
  content       String
  clauseContext String?
  createdAt     DateTime @default(now())
}
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/contracts` | List all contracts |
| POST | `/api/contracts` | Upload and analyze contract |
| GET | `/api/contracts/[id]` | Get contract details |
| DELETE | `/api/contracts/[id]` | Delete contract |
| POST | `/api/contracts/[id]/chat` | Send chat message |

### Risk Assessment Criteria

#### Liability Clause
- **HIGH**: Unlimited liability, consequential damages, broad indemnification
- **MEDIUM**: Cap > 2x contract value, broad damage categories
- **LOW**: Cap at 1-2x contract value, direct damages only

#### Termination Clause
- **HIGH**: At-will termination, heavy penalties, no cure period
- **MEDIUM**: Short notice period (<30 days), termination for convenience
- **LOW**: 30+ day notice, termination for cause only, clear cure periods

#### Confidentiality Clause
- **HIGH**: Perpetual term, overly broad scope, heavy penalties
- **MEDIUM**: Duration >5 years, vague boundaries, asymmetric obligations
- **LOW**: 2-5 year term, clear scope with exceptions, mutual obligations

#### Payment Terms Clause
- **HIGH**: Net 60+ terms, late fees >5%, retention clauses
- **MEDIUM**: Net 45 terms, moderate fees (2-5%), significant upfront payment
- **LOW**: Net 30 or less, standard fees (<2%), clear milestone payments

---

## 🧪 Testing

The application has been thoroughly tested with real-world contracts:

✅ **Contract Upload**: Verified with PDF, DOCX, and TXT files
✅ **AI Analysis**: Tested with complex legal agreements
✅ **Clause Detection**: Accurately identifies all 4 clause types
✅ **Risk Assessment**: Properly categorizes risk levels
✅ **Q&A Chat**: Provides contextually relevant answers
✅ **PDF Export**: Generates professional reports
✅ **Error Handling**: Gracefully handles edge cases

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables:
   - `OPENAI_API_KEY`
   - `DATABASE_URL` (use Neon, Supabase, or Railway for PostgreSQL)
4. Deploy

### Railway

```bash
railway login
railway init
railway add
railway up
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build
CMD ["npm", "start"]
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Maintain test coverage
- Update documentation
- Follow commit message conventions

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **OpenAI** for providing GPT-4o API
- **Vercel** for Next.js framework
- **Prisma** for excellent ORM
- Open-source community for amazing tools

---

## 📧 Contact

**Taha Saqib**

- GitHub: [@mr-taha-saqib](https://github.com/mr-taha-saqib)
- Project Link: [https://github.com/mr-taha-saqib/ai-powered-legal-contract-review-risk-analysis-assistant](https://github.com/mr-taha-saqib/ai-powered-legal-contract-review-risk-analysis-assistant)

---

## ⚖️ Legal Disclaimer

This software is provided "as is" for informational and educational purposes only. It does not constitute legal advice, and should not be relied upon as a substitute for consultation with a qualified attorney. The creators and contributors of this project assume no liability for any decisions made based on the information provided by this tool.

Always consult with a licensed legal professional before making decisions based on contract analysis or legal matters.

---

<div align="center">

**Made with ❤️ for Legal Tech Innovation**

⭐ Star this repo if you find it helpful!

</div>
