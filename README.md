# 🏠 PropertyHub

A modern, full-featured real estate platform built with React, TypeScript, and Vite – now backed by a Node/Express + PostgreSQL API. PropertyHub provides a comprehensive solution for buying, selling, and renting properties with AI-powered recommendations and advanced search capabilities.

## ✨ Features

### 🏘️ Property Management
- **Property Listings**: Browse properties for buy, rent, and lease
- **Advanced Search**: Filter by location, price, property type, and more
- **Property Details**: Comprehensive property information with images, maps, and reviews
- **Property Comparison**: Compare multiple properties side-by-side
- **Favorites**: Save your favorite properties for later
- **Recently Viewed**: Track your browsing history

### 🤖 AI-Powered Features
- **AI Chat Assistant**: Get instant help and answers about properties
- **AI Recommendations**: Personalized property recommendations based on your preferences

### 👥 User Roles
- **Buyer Dashboard**: Manage saved properties, comparisons, and inquiries
- **Seller Dashboard**: List and manage your properties
- **Admin Dashboard**: Approve properties, manage users, and view analytics

### 🗺️ Interactive Maps
- **Location Picker**: Visual location selection
- **Property Map View**: View all properties on an interactive map
- **Leaflet Integration**: Powered by React Leaflet

### 📊 Analytics
- **Admin Analytics**: Comprehensive dashboard with property statistics
- **User Insights**: Track property views and engagement

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark Mode Support**: Beautiful dark and light themes
- **Component Library**: Built with shadcn/ui and Radix UI
- **Smooth Animations**: Enhanced user experience with Tailwind CSS animations

## 🚀 Getting Started (Local)

### Prerequisites

- **Node.js** (v18 or higher)
- **npm**
- A **PostgreSQL** database (e.g. Neon, Supabase, Railway)

### 1. Clone and install (root – frontend)

```bash
git clone https://github.com/yourusername/PropertyHub.git
cd PropertyHub
npm install
```

### 2. Backend setup (`server/`)

```bash
cd server
npm install
```

Create `server/.env` (see `.env.example`) with:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
JWT_SECRET=some-long-random-secret
```

Then run migrations and (optionally) seed mock data:

```bash
npx prisma migrate dev --name init
npx prisma generate
npm run prisma:seed   # optional, loads sample properties & reviews
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend env and dev server (root)

From the project root:

```bash
cd ..
echo "VITE_API_URL=http://localhost:4000" > .env
npm run dev
```

Open your browser at `http://localhost:5173`.

## 📜 Available Scripts

### Frontend (root)

- `npm run dev` - Start Vite dev server
- `npm run build` - Build frontend for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend (`server/`)

- `npm run dev` - Start Express API with ts-node-dev
- `npm run build` - Compile TypeScript to `dist`
- `npm start` - Run compiled API (`dist/index.js`)
- `npm run prisma:migrate` - Run Prisma migrations
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:seed` - Seed database with sample data

## 🛠️ Tech Stack

### Core
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Routing

### UI Components
- **shadcn/ui** - Component library
- **Radix UI** - Accessible component primitives
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

### Maps
- **Leaflet** - Interactive maps
- **React Leaflet** - React bindings for Leaflet

### Forms & Validation
- **React Hook Form** - Form management
- **Zod** - Schema validation

### State Management
- **React Context API** - State management
- **TanStack Query** - Data fetching and caching

### Charts & Visualization
- **Recharts** - Chart library

### Other Libraries
- **date-fns** - Date utilities
- **Sonner** - Toast notifications

## 📁 Project Structure

```
PropertyHub/
├── public/                # Frontend static assets
├── src/                   # Frontend source
│   ├── components/        # React components
│   │   ├── ui/            # shadcn/ui components
│   │   └── maps/          # Map-related components
│   ├── contexts/          # React Context providers
│   ├── data/              # Mock data
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities (api client, localDb, etc.)
│   ├── pages/             # Page components
│   ├── services/          # API/AI services
│   └── assets/            # Images and media
├── server/                # Backend API (Express + Prisma)
│   ├── src/               # API source
│   ├── prisma/            # Prisma schema & migrations
│   ├── package.json       # Backend dependencies
│   └── .env.example       # Backend env vars (sample)
├── PROJECT_WORKFLOW.md    # Detailed architecture & workflows (may describe local mode)
├── README.md              # This file
└── package.json           # Frontend/root dependencies
```

## 🔐 Authentication

The application includes authentication with role-based access control:
- **Buyers**: Can browse, save, and compare properties
- **Sellers**: Can list and manage their properties
- **Admins**: Can approve properties and manage the platform

## 🌐 Environment Variables

### Frontend (`.env` at repo root)

```env
VITE_API_URL=http://localhost:4000        # or your deployed backend URL
VITE_MAP_API_KEY=your_map_api_key_here    # if you add a map provider key
```

### Backend (`server/.env`)

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
JWT_SECRET=some-long-random-secret
```

> **Note**: Never commit `server/.env`. It is ignored via `.gitignore`.

## 📝 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. Contributions are welcome from authorized contributors only.

## 📧 Contact

For questions or support, please contact the project maintainer.

---

**Built with ❤️ using React, TypeScript, and modern web technologies**
