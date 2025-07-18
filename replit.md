# Geometry Dash Game

## Overview

This is a web-based Geometry Dash-inspired game built with a modern full-stack architecture. The project combines a React frontend with an Express backend, featuring a complete game engine built with vanilla JavaScript and Canvas API. The game includes core mechanics like jumping, collision detection, and obstacle navigation in a 2D side-scrolling environment.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for the main application shell
- **Vanilla JavaScript** game engine using Canvas API for high-performance rendering
- **TailwindCSS** for styling with shadcn/ui components
- **Zustand** for state management (game state and audio controls)
- **Vite** for development and build tooling

### Backend Architecture
- **Express.js** server with TypeScript
- **RESTful API** structure (though currently minimal)
- **Memory-based storage** with interface for future database integration
- **Drizzle ORM** configured for PostgreSQL (prepared for future use)

### Database Layer
- **Drizzle ORM** with PostgreSQL dialect configured
- **Neon Database** integration ready
- Currently using in-memory storage with prepared migration to PostgreSQL

## Key Components

### Game Engine (`client/src/game/`)
- **Game.js**: Main game loop and state management
- **Player.js**: Player character with physics and movement
- **Physics.js**: Gravity and motion calculations
- **CollisionDetector.js**: AABB collision detection system
- **Camera.js**: 2D camera with smooth following
- **GameRenderer.js**: Canvas-based rendering system
- **InputHandler.js**: Mouse, touch, and keyboard input processing
- **Block.js & Spike.js**: Obstacle classes with collision bounds

### State Management
- **useGame**: Game phase management (ready/playing/ended)
- **useAudio**: Sound system with mute controls
- **React Query**: Configured for future API integration

### UI Components
- **shadcn/ui**: Comprehensive component library
- **Interface.js**: Game overlay and control interface
- **Responsive design**: Mobile-friendly touch controls

## Data Flow

### Game Loop
1. **Input Processing**: Capture user input (mouse/touch/keyboard)
2. **Physics Update**: Apply gravity, movement, and collision detection
3. **Game State**: Update player position, check win/lose conditions
4. **Camera Update**: Follow player with smooth interpolation
5. **Rendering**: Draw all game objects to canvas
6. **Audio**: Play appropriate sound effects

### State Updates
- Game phase transitions managed through Zustand store
- Audio state persisted and controlled globally
- Component re-renders triggered by state changes

## External Dependencies

### Core Libraries
- **@neondatabase/serverless**: Database connectivity
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI primitives
- **class-variance-authority**: Component variant system

### Development Tools
- **Vite**: Fast build tool with HMR
- **TypeScript**: Type safety across the stack
- **ESLint/Prettier**: Code quality and formatting
- **PostCSS**: CSS processing with TailwindCSS

## Deployment Strategy

### Build Process
1. **Frontend**: Vite builds optimized React app to `dist/public`
2. **Backend**: esbuild bundles Express server to `dist/index.js`
3. **Assets**: Canvas game files and UI components included

### Production Setup
- **NODE_ENV=production** environment variable
- **Static file serving** from Express for built frontend
- **Database URL** configuration for PostgreSQL connection
- **Session management** with connect-pg-simple ready

### Development Workflow
- **Hot reload** with Vite middleware integration
- **TypeScript checking** across client/server/shared code
- **Database migrations** with Drizzle Kit
- **Modular architecture** for easy feature additions

The architecture supports future enhancements like user authentication, high scores, level editor, and multiplayer features while maintaining clean separation of concerns between game logic, UI, and server functionality.