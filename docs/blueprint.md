# **App Name**: Moxiz Gateway

## Core Features:

- Merchant Authentication & Authorization: Secure merchant signup, login, and JWT-protected access to dashboard routes.
- Merchant Dashboard Overview: A dashboard displaying essential metrics such as total transactions, transaction volume, and recent transaction history in an accessible format.
- API Key Management: Allows merchants to generate, view, and manage their API keys securely from the dashboard for integration purposes.
- Simulated Payment Processing API: Backend API endpoints for merchants to initiate new payments and verify transaction statuses, with built-in simulation for success and failure states.
- Webhook Event Delivery Simulation: A system to simulate the dispatch of webhook notifications for critical transaction events to merchant-configured URLs, including configurable retry logic for failed deliveries.
- Comprehensive Transaction Ledger: Centralized system to store, display, and manage all simulated payment transactions with their respective statuses, and provide basic search and filtering capabilities.

## Style Guidelines:

- Primary color: A vibrant yet professional blue (#548EFA), conveying trustworthiness and technological prowess. This color will be used for interactive elements like buttons, active states, and key highlights.
- Background color: A very dark, subtly blue-tinted gray (#14181F), creating a sophisticated and developer-friendly dark theme that minimizes eye strain during extended use.
- Accent color: A clean, clear cyan (#1ED2F1) to provide visual contrast and draw attention to secondary actions, notifications, or specific data points on the dark background.
- Body and headline font: 'Inter' (sans-serif), chosen for its modern, clean, and highly readable design, suitable for data-rich interfaces and professional communication. Code font: 'Source Code Pro' (monospace), for clear and unambiguous display of API keys, code snippets, and technical information.
- Utilize a consistent set of minimal, outline-style vector icons that align with a modern fintech aesthetic. Icons should be clear and intuitive, supporting rapid comprehension of dashboard elements and actions.
- Implement a clean, spacious, and responsive dashboard layout featuring a persistent left-hand navigation sidebar for quick access to core functionalities. Content areas will use a card-based structure for clear data presentation and adaptive resizing across various devices.
- Incorporate subtle, functional animations for UI feedback, such as hover states, loading indicators, and route transitions. Animations should enhance user experience without being distracting, reinforcing a polished and professional feel.