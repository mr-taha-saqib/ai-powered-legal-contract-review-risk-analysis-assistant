# AI-Powered Legal Contract Review Assistant

An intelligent web application that analyzes legal contracts, detects key clauses, assigns risk levels, and provides plain-language explanations. Built with Next.js, OpenAI GPT-4o, and PostgreSQL.

## Features

- **Contract Upload**: Support for PDF, DOCX, and TXT files
- **AI-Powered Analysis**: Detects liability, termination, confidentiality, and payment clauses
- **Risk Assessment**: Assigns LOW/MEDIUM/HIGH risk levels based on predefined criteria
- **Plain Language Explanations**: Makes legal jargon accessible
- **Q&A Chat**: Context-aware chat about your contracts
- **PDF Export**: Generate professional analysis reports
- **Legal Disclaimers**: Clear reminders that this is informational, not legal advice

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **AI Provider**: OpenAI (GPT-4o)
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS 4
- **Document Parsing**: pdf-parse, mammoth
- **UI**: React 19, lucide-react, react-hot-toast

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- PostgreSQL database
- OpenAI API key

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
# or
bun install
```

2. Set up environment variables:

Copy `.env.example` to `.env` and fill in your values:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/contract_analyzer"

# OpenAI API Key
OPENAI_API_KEY="sk-proj-..."

# Optional
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE_MB=10
```

3. Initialize the database:

```bash
npx prisma generate
npx prisma migrate dev
```

4. Run the development server:

```bash
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
