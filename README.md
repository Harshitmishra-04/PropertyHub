# 🏠 PropertyHub

A modern, full-featured real estate platform built with React, TypeScript, and Vite. PropertyHub provides a comprehensive solution for buying, selling, and renting properties with AI-powered recommendations and advanced search capabilities.

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

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/PropertyHub.git
cd PropertyHub
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

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
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── ui/         # shadcn/ui components
│   │   └── maps/       # Map-related components
│   ├── contexts/       # React Context providers
│   ├── data/          # Mock data
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions
│   ├── pages/         # Page components
│   ├── services/      # API services
│   └── assets/        # Images and media
├── .gitignore         # Git ignore rules
└── package.json       # Dependencies
```

## 🔐 Authentication

The application includes authentication with role-based access control:
- **Buyers**: Can browse, save, and compare properties
- **Sellers**: Can list and manage their properties
- **Admins**: Can approve properties and manage the platform

## 🌐 Environment Variables

Create a `.env` file in the root directory (if needed):

```env
VITE_API_URL=your_api_url_here
VITE_MAP_API_KEY=your_map_api_key_here
```

## 📝 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. Contributions are welcome from authorized contributors only.

## 📧 Contact

For questions or support, please contact the project maintainer.

---

**Built with ❤️ using React, TypeScript, and modern web technologies**
