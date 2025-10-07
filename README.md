# Cardano Message Verification Tool

## Introduction

The Cardano Message Verification Tool is a web application that allows users to verify the authenticity of messages signed on Cardano. It supports multiple verification standards:

- **CIP-0008**: A standard for signing and verifying arbitrary message data
- **CIP-0030**: A standard for dApp-wallet web bridge that includes message signing capabilities
- **CIP-0100**: A standard for governance metadata with comprehensive author verification
- **Example Data**: Load pre-configured examples to understand expected formats

## Roadmap & Backlog

- **Result Sharing**: Ability to share verification results via URLs (planned for future release)
- **Enhanced Rate Limiting**: Consider distributed rate limiting for multi-instance deployments

## Project Architecture

- **Frontend**: React components for user interaction with gradient backgrounds and responsive design
- **API Routes**: Server-side verification logic endpoints
- **Utility Functions**: Shared helper functions for verification across different standards
- **Data Examples**: Sample verification data for testing and demonstration

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js App                          │
│                                                         │
│  ┌─────────────────────────────────────────────┐        │
│  │              Frontend UI                    │        │
│  │       (Forms, Results Display)              │        │
│  └────────────────────┬────────────────────────┘        │
│                       │                                 │
│  ┌────────────────────▼────────────────────────┐        │
│  │           API Route Layer                   │        │
│  │    ┌──────────────────────────────┐         │        │
│  │    │    Security Middleware        │        │        │
│  │    │  • Rate Limiting              │        │        │
│  │    │  • SSRF Protection            │        │        │
│  │    │  • Input Validation           │        │        │
│  │    └──────────┬───────────────────┘         │        │
│  │               │                             │        │
│  │    ┌──────────▼───────────────────┐         │        │
│  │    │   Verification Logic          │        │        │
│  │    │ (CIP-8, CIP-30, CIP-100)      │        │        │
│  │    └───────────────────────────────┘        │        │
│  └─────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────┘
```

## Project Structure

```
├── app/                      # Next.js App Router structure
│   ├── api/                  # Backend API routes with security
│   │   ├── verify/           # CIP-8/30 verification endpoint
│   │   │   └── route.ts      # API handler for CIP-8/30 verification
│   │   └── verify-cip100/    # CIP-100 verification endpoint
│   │       └── route.js      # Secured API handler with SSRF protection
│   ├── cip100/               # CIP-100 verification page
│   ├── method=cip100/        # Alternative CIP-100 route
│   │   └── page.js           # CIP-100 verification UI
│   ├── disclaimer/           # Legal disclaimer page
│   │   └── page.js           # Disclaimer content
│   ├── components/           # Reusable React components
│   │   ├── Navigation.js     # Site navigation
│   │   └── ...               # Other UI components
│   ├── not-found.js          # Custom 404 page
│   └── page.js               # Main CIP-8/30 verification page
├── data/                     # Sample data for examples
│   ├── cip0008example.json   # Example of CIP-0008 format
│   ├── cip0030example.json   # Example of CIP-0030 format
│   └── cip0100example.js     # Example of CIP-0100 format (JS export)
├── components/               # Shared components
├── lib/                      # Utility functions and security
│   ├── cip100-verification.js # CIP-100 specific verification logic
│   ├── rate-limiter.js       # In-memory rate limiting
│   └── security.js           # IP validation and complexity checks
├── public/                   # Static assets
└── styles/                   # CSS and styling files
```

## Key Files and Their Responsibilities

### Frontend

- **`app/page.js`**: The main CIP-8/30 verification page with form and results display. Features gradient background and example loading.

- **`app/method=cip100/page.js`**: Dedicated CIP-100 governance metadata verification page with specialized form fields and validation.

- **`app/disclaimer/page.js`**: Legal disclaimer page with navigation and consistent styling.

- **`app/not-found.js`**: Custom 404 error page with navigation and branding.

- **`components/Navigation.js`**: Site navigation component used across all pages.

### Backend API

- **`app/api/verify/route.ts`**: API endpoint for CIP-8/30 verification that processes requests and returns verification results.

- **`app/api/verify-cip100/route.js`**: Secured API endpoint for CIP-100 governance metadata verification with:
  - URL-based metadata fetching (GET `?url=<metadata-url>`)
  - Direct JSON submission (POST with `{ metadata: {...} }`)
  - Complete SSRF protection and rate limiting
  - Author witness validation

### Security Modules

- **`lib/rate-limiter.js`**: In-memory rate limiting (20 requests/minute per IP) with automatic cleanup.

- **`lib/security.js`**: Security utilities including:
  - `isPrivateIp()`: IPv4/IPv6 validation against private/loopback/link-local ranges
  - `checkJsonComplexity()`: Prevents compute bombs via depth and key count limits

### Verification Logic

- **`lib/utils.js`**: Contains utility functions for CIP-8/30 verification standards, including core cryptographic operations.

- **`lib/cip100-verification.js`**: Specialized verification logic for CIP-100 governance metadata with JSON-LD context validation and witness verification.

### Example Data

- **`data/cip0008example.json`**: Contains example data for CIP-0008 verification, showing the expected format for message, signature, and address.

- **`data/cip0030example.json`**: Contains example data for CIP-0030 verification, demonstrating the format used when verifying messages signed via wallet interfaces.

- **`data/cip0100example.js`**: Contains comprehensive example data for CIP-0100 governance metadata as a JavaScript export, including full treasury withdrawal proposal with multiple author witnesses.

## Verification Process

### CIP-0008 Verification

The CIP-0008 verification process follows these steps:

1. The frontend collects:

   - The message that was signed
   - The signature
   - The address that allegedly signed the message

2. This data is sent to the API endpoint (`/api/verify`)

3. The API route:

   - Validates input
   - Executes cryptographic verification using Cardano-specific algorithms
   - Returns the verification result (valid/invalid)

4. The result is displayed to the user

The CIP-0008 standard is specifically designed for signing and verifying arbitrary message data on Cardano, with a standardized format for representing signatures.

### CIP-0030 Verification

CIP-0030 verification handles messages signed directly via wallet interfaces:

1. The frontend collects:

   - The address
   - The message payload
   - The signature
   - Optional metadata from the wallet

2. The API processes this data differently from CIP-0008:

   - It handles additional wallet-specific formats
   - Utilizes wallet-specific verification methods
   - Accounts for different signature encodings

3. The verification result is returned to the user

CIP-0030 is part of the broader dApp-wallet web bridge specification, enabling web applications to interact with Cardano wallets.

### CIP-0100 Verification

CIP-0100 verification handles governance metadata with comprehensive validation and security:

#### Two Methods of Verification

**1. URL-based (GET)** - Recommended for public metadata:

```bash
GET /api/verify-cip100?url=<metadata-url>
```

- Fetches metadata from GitHub, IPFS, or any public URL
- Validates URL and performs DNS lookup to prevent SSRF
- 10-second timeout for fetching
- 5MB size limit
- Content-type validation

**2. Direct JSON (POST)** - For local or private metadata:

```bash
POST /api/verify-cip100
Content-Type: application/json

{
  "metadata": { ... }
}
```

- Direct submission of governance metadata
- 5MB request body limit
- JSON complexity validation

#### Security Layers

1. **Rate Limiting**: 20 requests/minute per IP
2. **URL Validation**:
   - HTTPS-only in production
   - DNS rebinding protection
   - Blocks private IPs (10.x, 192.168.x, 172.16-31.x)
   - Blocks IPv6 private ranges (fe80::/10, fc00::/7)
   - Blocks cloud metadata endpoints
3. **Content Protection**:
   - 5MB size limit
   - 10-second timeout
   - Redirect blocking
   - JSON complexity validation (max depth: 20, max keys: 1000)

#### Verification Process

1. The API performs security validation:

   - Rate limit check
   - URL/IP validation (for GET requests)
   - Size and complexity checks

2. Multi-layer verification:

   - JSON-LD context validation
   - Schema compliance checking
   - Author witness cryptographic verification
   - Hash algorithm validation (Blake2b-256, SHA-256)

3. Detailed results show:
   - Overall verification status
   - Individual author verification results
   - Schema validation results
   - Hash verification status

CIP-0100 is designed for Cardano governance proposals, treasury withdrawals, and other governance-related metadata with strong authentication requirements.

## Setting Up and Running the Project

### Prerequisites

- Node.js (version 20.x or later recommended)
- npm or yarn

### Installation Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/cardano-foundation/verify-cardano-message-fe.git
   cd cardano-signer-verification
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Access the application at `http://localhost:3000`

### Available Pages

- **Main Verification**: `http://localhost:3000` - CIP-8/30 verification
- **CIP-100 Verification**: `http://localhost:3000/method=cip100` - Governance metadata verification
- **Disclaimer**: `http://localhost:3000/disclaimer` - Legal information

### API Endpoints

#### CIP-8/30 Verification

```bash
GET /api/verify?publicKey=<hex>&message=<text>&signature=<hex>
```

#### CIP-100 URL Verification

```bash
GET /api/verify-cip100?url=<metadata-url>

# Example
curl "http://localhost:3000/api/verify-cip100?url=https://ipfs.io/ipfs/bafkreihk5qt5tgbojnno7eymbm2urm6y6jkt4yqfxdzh3agnj47zuv7lpe"
```

#### CIP-100 Direct Verification

```bash
POST /api/verify-cip100
Content-Type: application/json

{
  "metadata": {
    "@context": { ... },
    "hashAlgorithm": "blake2b-256",
    "body": { ... },
    "authors": [ ... ]
  }
}
```

**Rate Limits**: All endpoints are rate-limited to 20 requests per minute per IP address.

### Building for Production

To build the application for production:

```bash
npm run build
npm start
```

## Features Overview

### Core Verification

- **Multi-Standard Support**: CIP-8, CIP-30, and CIP-100 verification
- **Real-time Validation**: Instant feedback on form inputs
- **Example Loading**: Pre-configured examples for each standard
- **Detailed Results**: Comprehensive verification status and error reporting

### User Experience

- **Responsive Design**: Works on desktop and mobile devices
- **Gradient Backgrounds**: Modern, consistent visual design
- **Navigation**: Easy switching between verification types
- **Error Handling**: Clear error messages and guidance

### Advanced Features

- **Clipboard Integration**: Copy verification results for easy sharing
- **URL-based Verification**: Fetch and verify metadata from any public URL
- **Multi-format Support**: Handles various content types and encodings

## Contributing to the Project

We welcome contributions to improve the Cardano Message Verification Tool. Here's how you can contribute:

### Code Contributions

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests to ensure security features still work
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
