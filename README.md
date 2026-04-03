# ⛳ Golf Charity Subscription Platform

A modern, emotionally engaging MERN stack application that combines golf performance tracking, charitable giving, and monthly prize draws. This platform is designed to move beyond traditional golf aesthetics, focusing on charitable impact and user engagement.

---

## 🌟 Core Features

- **Subscription Engine**: Robust monthly and yearly subscription plans with Stripe-ready integration.
- **Score Management**: Simple, engaging Stableford score entry (1-45 range) with a rolling 5-score history logic.
- **Custom Draw Engine**: Algorithm-powered or random monthly prize draws with 3, 4, and 5-number match tiers.
- **Charity Integration**: Users choose a charity at signup to receive a minimum of 10% of their subscription fee.
- **Winner Verification**: Snapshot-based proof upload system with administrative approval and payout tracking.
- **Premium UI/UX**: Clean, modern interface powered by Tailwind CSS and Framer Motion animations.
- **Admin Dashboard**: Comprehensive tools for managing users, running draws, verifying winners, and charity CRUD.

---

## 🛠️ Technology Stack

### Frontend
- **React.js**: Modern component-based architecture.
- **Tailwind CSS**: Utility-first styling for a custom, premium feel.
- **Framer Motion**: Smooth transitions and micro-interactions.
- **Context API**: Centralized state management for Auth and UI.

### Backend
- **Node.js & Express**: High-performance server-side logic.
- **MongoDB & Mongoose**: Flexible, schema-based data modeling.
- **JWT (JSON Web Tokens)**: Secure, stateless authentication.
- **Stripe API**: Production-ready payment processing (Integration configured).

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or MongoDB Atlas URI)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Golf_Charity
   ```

2. **Setup the Backend**
   ```bash
   cd server
   npm install
   # Create a .env file based on .env.example
   npm run dev
   ```

3. **Setup the Frontend**
   ```bash
   cd client
   npm install
   # Create a .env file based on .env.example
   npm run dev
   ```

### Environment Variables

**Backend (`server/.env`):**
- `PORT`: Server port (default 5000)
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Secret key for authentication
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `ADMIN_SEED_EMAILS`: Comma-separated list for auto-seeding admin accounts

**Frontend (`client/.env`):**
- `VITE_API_URL`: Your backend URL (e.g., http://localhost:5000/api)

---

## 📁 Project Structure

```text
├── client/              # Frontend (React + Vite)
│   ├── src/
│   │   ├── context/     # Auth, Toast, and UI contexts
│   │   ├── pages/       # Dashboard, Admin, Profile, Auth
│   │   ├── components/  # Shared UI components
│   │   └── api/         # Axios client configuration
├── server/              # Backend (Express)
│   ├── src/
│   │   ├── models/      # Mongoose Schemas (User, Draw, Score, etc.)
│   │   ├── routes/      # API Endpoints (Admin, User, Billing)
│   │   ├── middleware/  # Auth and role-based guards
│   │   └── services/    # Email and external integrations
```

---

## 🛡️ Security & Scalability

- **Secure Authentication**: JWT-based flow with role-based access control (RBAC).
- **PCI Compliance**: Payments handled via Stripe Checkout to minimize sensitive data handling.
- **Mobile-First Design**: Fully responsive layout designed for both mobile and desktop users.
- **Extensible Architecture**: Structured to support future "Independent Donation" and "Campaign" modules.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Developed with ❤️ for the Golf Community.**
