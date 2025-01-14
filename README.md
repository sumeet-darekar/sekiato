# Sekiato - A Vulnerability Sentinel

A web-based application for scanning and identifying security vulnerabilities in code.

## Features

- Upload and scan code files for security vulnerabilities
- Real-time vulnerability detection
- Severity-based classification (Low, Medium, High, Critical)
- Project management dashboard
- Detailed vulnerability reports

## Tech Stack

- Next.js 14 (React Framework)
- PostgreSQL (Database)
- Drizzle ORM
- TailwindCSS
- Shadcn/ui Components
- PHP Code Analysis API

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/sekiato.git

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Configure database
DATABASE_URL="postgresql://username:password@localhost:5432/sekiato"

# Run database migrations
npx drizzle-kit push:pg

# Start development server
npm run dev
```

## Demo

Watch the demo video to see Sekiato in action:
- Code upload and scanning
- Real-time vulnerability detection
- Severity classification
- Project management

[Demo Preview](https://youtu.be/HOISjf4AFT8)
