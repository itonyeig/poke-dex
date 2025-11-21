# PokéDex - Full Stack Application

A modern, animated Pokédex application built with Next.js (React) frontend and NestJS (Node.js) backend. This application allows users to browse the first 150 Pokémon, view detailed information, and manage a favorites list with persistent storage.

## Overview

This project implements a full-stack Pokémon explorer with a focus on clean UI/UX, smooth animations, and robust error handling. The frontend communicates exclusively with a Node.js backend built with NestJS framework that utilizes MongoDB for persistent data storage. The backend proxies requests to the PokéAPI, ensuring proper separation of concerns and data persistence.

### Architecture Approach

- **Frontend**: Next.js 16 with App Router, TypeScript, and Tailwind CSS
- **Backend**: NestJS framework with MongoDB for persistent favorites storage
- **API Proxy Pattern**: All PokéAPI requests are routed through the backend to maintain separation of concerns
- **State Management**: React hooks (`useState`, `useEffect`, `useMemo`) for efficient local state management
- **Error Handling**: Comprehensive error handling at both frontend and backend levels with user-friendly messages

## Features

### Core Features

- **Pokémon List**: Browse the first 150 Pokémon in a scrollable, searchable list
- **Detailed View**: Click any Pokémon to see:
  - Abilities
  - Types
  - Evolution chain (if available)
  - Sprite images
- **Favorites Management**: Add or remove Pokémon from your favorites list with persistent storage
- **Filtering**: Toggle to view only your favorite Pokémon
- **Search**: Real-time search to quickly find Pokémon by name (respects current list context - All vs Favorites)

### Bonus Features

- **Smooth Animations**: List transitions, detail panel reveals, and micro-interactions powered by Framer Motion
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Loading States**: Skeleton loaders and spinners for all async operations
- **Error Handling**: Graceful error messages and fallback states
- **Custom Theme**: Gradient color scheme with consistent design language
- **API Caching**: Backend implements intelligent caching with different TTLs for list (1 day) and detail (15 min) endpoints
- **Swagger Documentation**: API documentation available at `/docs` endpoint
- **Database Persistence**: MongoDB storage for favorites

## Tech Stack

### Frontend

- **Framework**: Next.js(App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **HTTP Client**: Native Fetch API
- **Notifications**: React Hot Toast

### Backend

- **Runtime**: Node.js
- **Framework**: NestJS
- **Database**: MongoDB (via Mongoose)
- **Validation**: class-validator, class-transformer
- **API Documentation**: Swagger/OpenAPI
- **Caching**: NestJS Cache Manager
- **Logging**: Morgan

## Prerequisites

Before running the application, ensure you have the following installed:

- **Node.js** 18+ and npm
- **MongoDB** (local installation or MongoDB Atlas connection string)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/itonyeig/poke-dex.git
cd pokedex
```

### 2. Backend Setup

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

#### Environment Configuration

Create a `.env` file in the `server` directory:

```env
MONGO_URI=mongodb://localhost:27017/pokedex
PORT=4000
```

**Note**: If using MongoDB Atlas, replace the `MONGO_URI` with your Atlas connection string.

#### Run the Backend

```bash
# Development mode (with hot reload)
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The backend server will start on `http://localhost:4000` by default.

**API Documentation**: Once the server is running, visit `http://localhost:4000/docs` to view the Swagger API documentation.

### 3. Frontend Setup

Open a new terminal window and navigate to the client directory:

```bash
cd client
npm install
```

#### Environment Configuration

Create a `.env.local` file in the `client` directory:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

**Note**: If your backend is running on a different port or URL, update this accordingly.

#### Run the Frontend

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

The frontend will start on `http://localhost:3000` by default.

### 4. Access the Application

Open your browser and navigate to [http://localhost:3000](http://localhost:3000)


### Backend Health Check

- `GET /` - Basic health check endpoint

All endpoints, excluding heath check, return responses in the following format:

```json
{
  "success": true,
  "data": { ... },
  "message": "message"
}
```

## Additional Features & Assumptions

### Features Implemented

1. **Search Functionality**: Real-time search that filters Pokémon by name, respecting the current view context (All vs Favorites only)

2. **Animations**: Smooth transitions and micro-interactions using Framer Motion for enhanced UX

3. **Database Storage**: MongoDB is used for persistent favorites storage (bonus requirement) instead of in-memory storage

4. **API Caching**: Backend implements caching for PokéAPI responses to reduce external API calls and improve performance

5. **Error Handling**:

   - Frontend: User-friendly error messages with toast notifications
   - Backend: Comprehensive exception filters with proper HTTP status codes

6. **Loading States**: Skeleton loaders and spinners throughout the application for better UX

7. **Responsive Design**: Mobile-first approach with breakpoints for tablet and desktop

8. **Type Safety**: Full TypeScript implementation on both frontend and backend

9. **API Documentation**: Swagger/OpenAPI documentation available at `/docs`

10. **CORS Configuration**: Backend configured to accept requests from any origin (configurable for production)

## Code Quality

- **TypeScript**: Full type safety throughout both frontend and backend
- **Modular Architecture**: Separated concerns with clear module boundaries
- **Error Handling**: Comprehensive try/catch blocks with user-friendly messages
- **Validation**: Input validation using DTOs and class-validator on the backend
- **Documentation**: Inline code comments and Swagger API documentation



## Deployment

### Frontend Deployment (Vercel)

The frontend is configured for easy deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Set the environment variable `NEXT_PUBLIC_API_BASE_URL` to your backend URL
3. Deploy

### Backend Deployment (Render)
