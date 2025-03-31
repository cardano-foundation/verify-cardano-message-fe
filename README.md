# Cardano Message Verification Tool

## Introduction

The Cardano Message Verification Tool is a web application that allows users to verify the authenticity of messages signed on the Cardano. It supports two main verification standards:

- **CIP-0008**: A standard for signing and verifying arbitrary message data
- **CIP-0030**: A standard for dApp-wallet web bridge that includes message signing capabilities

## Project Architecture

- **Frontend**: React components for user interaction
- **API Routes**: Server-side verification logic
- **Utility Functions**: Shared helper functions for verification across different standards
- **Data Examples**: Sample verification data for testing and demonstration

### High-Level Architecture Diagram

```
┌─────────────────────────────┐
│         Next.js App         │
│                             │
│  ┌─────────────────────┐    │
│  │     Frontend UI     │    │
│  │  (Form, Results)    │    │
│  └──────────┬──────────┘    │
│             │               │
│  ┌──────────▼──────────┐    │
│  │   API Route Layer   │    │
│  │  (Verification API) │    │
│  └──────────┬──────────┘    │
│             │               │
│  ┌──────────▼──────────┐    │
│  │  Verification Logic │    │
│  │ (CIP-0008, CIP-0030)│    │
│  └─────────────────────┘    │
└─────────────────────────────┘
```

## Project Structure

```
├── app/                      # Next.js App Router structure
│   ├── api/                  # Backend API routes
│   │   └── verify/           # Verification endpoint
│   │       └── route.ts      # API handler for verification
│   ├── components/           # Reusable React components
│   └── page.js               # Main application page
├── data/                     # Sample data for examples
│   ├── cip0008example.json   # Example of CIP-0008 format
│   └── cip0030example.json   # Example of CIP-0030 format
├── lib/                      # Utility functions
├── public/                   # Static assets
└── styles/                   # CSS and styling files
```

## Key Files and Their Responsibilities

### Frontend

- **`app/page.js`**: The main page component that renders the verification form and results. It handles user input, form submission, and displaying verification results.

- **`app/components/*`**: Reusable UI components such as form elements, result displays, and layout components.

### Backend API

- **`app/api/verify/route.ts`**: API endpoint that receives verification requests, processes them based on the specified standard (CIP-0008 or CIP-0030), and returns verification results.

### Verification Logic

- **lib/utils.js**: Contains utility functions for both verification standards, including core cryptographic operations.

### Example Data

- **`data/cip0008example.json`**: Contains example data for CIP-0008 verification, showing the expected format for message, signature, and address.

- **`data/cip0030example.json`**: Contains example data for CIP-0030 verification, demonstrating the format used when verifying messages signed via wallet interfaces.

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

## Setting Up and Running the Project

### Prerequisites

- Node.js (version 16.x or later)
- npm or yarn

### Installation Steps

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/cardano-message-verification.git
   cd cardano-message-verification
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Run the development server:

   ```
   npm run dev
   ```

4. Access the application at `http://localhost:3000`

### Building for Production

To build the application for production:

```
npm run build
npm start
```

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
