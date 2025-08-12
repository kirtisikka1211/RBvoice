# RBvoice - AI Interview Platform

A React-based AI interview platform with proper routing and page management.

## Features

- **Multi-page routing** with React Router
- **Protected routes** requiring authentication
- **Interview workflow** with multiple stages
- **Transcript editing** capabilities
- **Responsive design** with Tailwind CSS

## Routes Structure

### Public Routes
- `/login` - User authentication page

### Protected Routes (require login)
- `/` - Landing page after login
- `/interview/idle` - Interview preparation page
- `/interview/preparing` - Interview setup page
- `/interview/active` - Active interview session
- `/interview/completed` - Interview results and transcript

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Login**: Enter any email and password to access the platform
2. **Start Interview**: Click "Start Interview" on the landing page
3. **Prepare**: Review the checklist and click "Begin Interview Now"
4. **Interview**: Answer questions using the voice interface
5. **Review**: View and edit your interview transcript
6. **Complete**: Save your results or start a new interview

## Technology Stack

- **React 18** with TypeScript
- **React Router DOM** for routing
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Vite** for build tooling

## Project Structure

```
src/
├── components/
│   ├── Layout.tsx          # Main layout with sidebar
│   ├── LandingPage.tsx     # Welcome page
│   ├── IdlePage.tsx        # Interview preparation
│   ├── PreparingPage.tsx   # Setup page
│   ├── InterviewPage.tsx   # Active interview
│   └── CompletedPage.tsx   # Results page
├── App.tsx                 # Main app with routing
├── Login.tsx              # Authentication
└── main.tsx               # Entry point
```

## Development

- **Build**: `npm run build`
- **Preview**: `npm run preview`
- **Lint**: `npm run lint`

## Notes

- This is a demo application with mock data
- Voice recording functionality is simulated
- Authentication is client-side only for demonstration
- In production, implement proper backend integration
