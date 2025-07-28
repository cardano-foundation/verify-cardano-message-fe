# Cardano Message Verification Tool

## Introduction

The Cardano Message Verification Tool is a web application that allows users to verify the authenticity of messages signed on Cardano. It supports multiple verification standards and includes advanced features for sharing and collaboration:

- **CIP-0008**: A standard for signing and verifying arbitrary message data
- **CIP-0030**: A standard for dApp-wallet web bridge that includes message signing capabilities
- **CIP-0100**: A standard for governance metadata with comprehensive author verification
- **Result Sharing**: Share verification results with others via secure short URLs
- **Example Data**: Load pre-configured examples to understand expected formats

## Project Architecture

- **Frontend**: React components for user interaction with gradient backgrounds and responsive design
- **API Routes**: Server-side verification logic and result sharing endpoints
- **Utility Functions**: Shared helper functions for verification across different standards
- **Data Examples**: Sample verification data for testing and demonstration
- **Sharing System**: Server-side storage for sharing verification results

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│                 Next.js App                     │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │            Frontend UI                  │    │
│  │  (Forms, Results, Share Buttons)        │    │
│  └──────────────────┬──────────────────────┘    │
│                     │                           │
│  ┌──────────────────▼──────────────────────┐    │
│  │          API Route Layer                │    │
│  │  (Verification, Sharing, Storage)       │    │
│  └──────────────────┬──────────────────────┘    │
│                     │                           │
│  ┌──────────────────▼──────────────────────┐    │
│  │         Verification Logic              │    │
│  │ (CIP-0008, CIP-0030, CIP-0100)          │    │
│  └─────────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘
```

## Project Structure

```
├── app/                      # Next.js App Router structure
│   ├── api/                  # Backend API routes
│   │   ├── verify/           # CIP-8/30 verification endpoint
│   │   │   └── route.ts      # API handler for CIP-8/30 verification
│   │   ├── verify-cip100/    # CIP-100 verification endpoint
│   │   │   └── route.js      # API handler for CIP-100 verification
│   │   └── share/            # Result sharing endpoint
│   │       └── route.js      # API handler for sharing/retrieving results
│   ├── cip100/               # CIP-100 verification page
│   ├── method=cip100/        # Alternative CIP-100 route
│   │   └── page.js           # CIP-100 verification UI
│   ├── shared/               # Shared results display
│   │   └── [shareId]/        # Dynamic route for shared results
│   │       └── page.js       # Shared result viewer
│   ├── disclaimer/           # Legal disclaimer page
│   │   └── page.js           # Disclaimer content
│   ├── components/           # Reusable React components
│   │   ├── ShareButton.js    # Share functionality component
│   │   ├── Navigation.js     # Site navigation
│   │   └── ...               # Other UI components
│   ├── not-found.js          # Custom 404 page
│   └── page.js               # Main CIP-8/30 verification page
├── data/                     # Sample data for examples
│   ├── cip0008example.json   # Example of CIP-0008 format
│   ├── cip0030example.json   # Example of CIP-0030 format
│   └── cip0100example.js     # Example of CIP-0100 format (JS export)
├── components/               # Shared components
├── lib/                      # Utility functions
│   └── cip100-verification.js # CIP-100 specific verification logic
├── public/                   # Static assets
└── styles/                   # CSS and styling files
```

## Key Files and Their Responsibilities

### Frontend

- **`app/page.js`**: The main CIP-8/30 verification page with form, results display, and sharing functionality. Features gradient background and example loading.

- **`app/method=cip100/page.js`**: Dedicated CIP-100 governance metadata verification page with specialized form fields and validation.

- **`app/shared/[shareId]/page.js`**: Dynamic page for displaying shared verification results from short URLs.

- **`app/disclaimer/page.js`**: Legal disclaimer page with navigation and consistent styling.

- **`app/not-found.js`**: Custom 404 error page with navigation and branding.

- **`components/ShareButton.js`**: Reusable component for sharing verification results with clipboard integration.

- **`components/Navigation.js`**: Site navigation component used across all pages.

### Backend API

- **`app/api/verify/route.ts`**: API endpoint for CIP-8/30 verification that processes requests and returns verification results.

- **`app/api/verify-cip100/route.js`**: Specialized API endpoint for CIP-100 governance metadata verification with author witness validation.

- **`app/api/share/route.js`**: API endpoint for storing and retrieving shared verification results with 24-hour expiration.

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

4. The result is displayed to the user with option to share

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

3. The verification result is returned to the user with sharing capability

CIP-0030 is part of the broader dApp-wallet web bridge specification, enabling web applications to interact with Cardano wallets.

### CIP-0100 Verification

CIP-0100 verification handles governance metadata with comprehensive validation:

1. The frontend collects:

   - JSON-LD governance metadata
   - Hash algorithm specification
   - Author information with witnesses

2. The API performs multi-layer verification:

   - JSON-LD context validation
   - Schema compliance checking
   - Author witness cryptographic verification
   - Hash algorithm validation

3. Detailed results show:

   - Overall verification status
   - Individual author verification results
   - Schema validation results
   - Hash verification status

4. Results can be shared via secure URLs

CIP-0100 is designed for Cardano governance proposals, treasury withdrawals, and other governance-related metadata with strong authentication requirements.

## Sharing System

The application includes a robust sharing system for verification results:

### Features

- **Short URLs**: Generate short, shareable URLs for verification results
- **Security**: Results stored server-side with unique IDs, not in URLs
- **Expiration**: Shared results automatically expire after 24 hours
- **Cross-Standard**: Works with all verification types (CIP-8, CIP-30, CIP-100)
- **Clipboard Integration**: One-click copying of share URLs

### Usage

1. Complete any verification process
2. Click the "Share Result" button
3. URL is automatically copied to clipboard
4. Share the URL with others to view the verification result

### Technical Implementation

- Server-side storage using in-memory Map (production should use Redis/Database)
- Automatic cleanup of expired entries
- RESTful API with POST (create) and GET (retrieve) endpoints

## Setting Up and Running the Project

### Prerequisites

- Node.js (version 16.x or later)
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

- **Result Sharing**: Share verification outcomes via secure short URLs
- **Clipboard Integration**: One-click copying of share links
- **Automatic Cleanup**: Shared results expire after 24 hours
- **Cross-Platform**: Works across different devices and browsers

## Contributing to the Project

We welcome contributions to improve the Cardano Message Verification Tool. Here's how you can contribute:

### Code Contributions

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
