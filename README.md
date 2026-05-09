# Moxiz Gateway

Moxiz Gateway is a developer-focused payment infrastructure simulation platform. It is designed to model realistic fintech transaction workflows, API systems, webhook delivery pipelines, and backend operational tooling. 

Moxiz provides a high-fidelity environment for backend engineers to test integration logic, idempotency, and asynchronous event handling without the compliance overhead of a production financial environment.

## 🚀 Engineering Goals

The project exists to solve the "sandbox gap" in fintech development, providing:
- **Operational Visibility**: Real-time monitoring of transaction states and infrastructure health.
- **Infrastructure Simulation**: Modeling of latency, failure modes, and asynchronous event queues.
- **Scalable Architecture**: A clean separation between the presentation layer and the service-driven business logic, ensuring a path to production-grade databases.

## 🛠 Key Features

- **Transaction Lifecycle Engine**: Full state-machine support for transaction transitions (Pending, Processing, Success, Failed, Refunded).
- **API Infrastructure**: Self-service API key management with support for `pk_test` and `sk_test` credential rotation.
- **Asynchronous Webhook System**: Realistic event logging with simulated delivery status, response codes, and retry history.
- **Developer Sandbox**: A dedicated simulation panel to trigger edge cases (Insufficient Funds, Timeout, etc.) and observe system behavior.
- **Real-Time Analytics**: Dashboard metrics powered by live stream listeners, providing instant feedback on volume and success rates.
- **Service-Oriented Architecture**: Business logic isolated in dedicated services (`MerchantService`, `TransactionService`, `WebhookService`).

## 🏗 Architecture Overview

Moxiz is built with a backend-ready architecture, abstracting data persistence to allow for future migrations.

- **Frontend**: Next.js 15 (App Router) with Shadcn UI components for a professional terminal-inspired aesthetic.
- **Service Layer**: A centralized logic layer that handles Firestore interactions and mock infrastructure simulation.
- **Data Layer**: Powered by Firebase Firestore for real-time synchronization across client instances.
- **Resilience Layer**: Implements non-blocking mutations and optimistic UI updates for high responsiveness.

### Project Structure
```text
src/
├── app/          # Next.js routes, layouts, and page components
├── components/   # Reusable UI primitives and dashboard elements
├── services/     # Business logic, data access, and infrastructure simulation
├── lib/          # Global types, environment config, and utility functions
├── firebase/     # Firestore hooks, provider logic, and error handling
└── hooks/        # UI-specific React hooks (toasts, mobile detection)
```

## 💻 Tech Stack

- **Framework**: Next.js 15 (Turbopack)
- **Language**: TypeScript
- **Database**: Firebase Firestore
- **Styling**: Tailwind CSS / Shadcn UI
- **Icons**: Lucide React
- **Logic**: Service Layer Architecture

## 🛠 Local Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_APP_URL=http://localhost:9002
NEXT_PUBLIC_API_URL=http://localhost:9002/api

# Future Infrastructure (Placeholders)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
DATABASE_URL=postgresql://user:password@localhost:5432/moxiz
JWT_SECRET=test_jwt_secret_key
WEBHOOK_SIGNING_SECRET=test_webhook_secret

NEXT_PUBLIC_APP_ENV=development
```

### 3. Run Development Server
```bash
npm run dev
```

## 🧪 Demo Credentials

Use the following development credentials to explore the gateway sandbox without a real merchant account:

- **Email**: `demo@moxiz.dev`
- **Password**: `password123`

*Note: You can also use the **"Continue as Guest"** option on the login page for instant authentication.*

## 📡 API Simulation Examples

### Create a Payment
```bash
# Request
POST /v1/payments
{
  "amount": 2500,
  "currency": "USD",
  "customerEmail": "jane.doe@example.com"
}

# Response (201 Created)
{
  "id": "tx_8812x",
  "reference": "MOX-992101",
  "status": "PENDING",
  "createdAt": "2024-05-20T10:00:00Z"
}
```

### Webhook Event Replay
The system simulates asynchronous webhook deliveries. You can replay failed events through the **Webhooks** dashboard to test your receiver endpoint.

## 🔭 Future Roadmap

- [ ] **Prisma Integration**: Migrate Firestore logic to PostgreSQL for relational data integrity.
- [ ] **Idempotency Enforcement**: Strict implementation of `Idempotency-Key` headers.
- [ ] **Advanced Observability**: Integration of Prometheus-style metrics and trace logging.
- [ ] **Queue Systems**: Implementation of RabbitMQ or Redis for realistic webhook backpressure.
- [ ] **Production Auth**: Migration to JWT-based session management and OAuth2 support.

---

Built for engineers, by engineers. © 2024 Moxiz Infrastructure Ltd.