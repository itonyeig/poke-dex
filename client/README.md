# PokéDex - Full Stack Application

A modern, animated Pokédex application built with Next.js (React) frontend and Node.js backend. This application allows users to browse the first 150 Pokémon, view detailed information, and manage a favorites list.

## Overview

This project implements a full-stack Pokémon explorer with a focus on clean UI/UX, smooth animations, and robust error handling. The frontend communicates exclusively with a Node.js backend built with NestJS framework utilizes MongoDB for a database. The backend proxies requests to the PokéAPI, ensuring proper separation of concerns and data persistence.

## Features

### Core Features

- **Pokémon List**: Browse the first 150 Pokémon in a scrollable, searchable list
- **Detailed View**: Click any Pokémon to see:
  - Abilities
  - Types
  - Evolution chain (if available)
  - Sprite images
- **Favorites Management**: Add or remove Pokémon from your favorites list
- **Filtering**: Toggle to view only your favorite Pokémon
- **Search**: Real-time search to quickly find Pokémon by.
- **Search Behavior**: Respect Current List Context (All vs Favorites)

### Bonus Features

- **Smooth Animations**: List transitions, detail panel reveals, and micro-interactions powered by Framer Motion
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Loading States**: Skeleton loaders and spinners for all async operations
- **Error Handling**: Graceful error messages and fallback states
- **Custom Theme**: Gradient color scheme with consistent design language

## Tech Stack

### Frontend

- **Framework**: Next.js 16.0.3 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **HTTP Client**: Native Fetch API

### Backend

- **Runtime**: Node.js
- **Framework**: NestJS
- **Storage**: MongoDB

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend server running (see backend repository)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/itonyeig/poke-fe.git
   cd poke-fe
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and set your backend URL:

   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

## Code Quality

- **TypeScript**: Full type safety throughout the application
- **Modular Architecture**: Separated concerns (components, lib, types)
- **Error Handling**: Comprehensive try/catch blocks with user-friendly messages
- **Loading States**: All async operations show appropriate loading indicators
- **Accessibility**: Semantic HTML and proper ARIA attributes

## Key Implementation Details

### State Management

- Uses React hooks (`useState`, `useEffect`, `useMemo`)
- No external state management library required
- Efficient filtering with memoized computations

### Performance Optimizations

- Memoized filtered list calculations
- Efficient favorite lookup using `Set` data structure
- Optimized re-renders with proper React patterns

### Error Handling

- Network errors caught and displayed gracefully
- Backend error messages parsed and shown to users
- Fallback states for empty lists and failed loads

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
