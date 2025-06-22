# 🌍 Disaster Management Platform

A full-stack web application designed to help coordinate disaster response efforts. This platform allows users to report disasters, view real-time updates, and manage resources effectively.

## 🔗 Live Demo

- **Live URL**: https://disaster-management-8mpx.vercel.app/
- **YouTube Demo**: [https://youtu.be/CDYmweLQcxU](https://youtu.be/CDYmweLQcxU)
- **GitHub Repository**: [https://github.com/ABODHKUMAR/disaster_management](https://github.com/ABODHKUMAR/disaster_management)

---

## 🛠️ Tech Stack

- **Frontend**: React.js, TailwindCSS, Shadcn UI, Redux Toolkit
- **Backend**: Node.js, Express.js, Supabase (PostgreSQL), WebSockets (Socket.IO)
- **Others**:
  - Geolocation & Mapping: Mapbox
  - AI/ML Integration: Google Gemini API
  - Cursor.dev: Used for AI-enhanced development and debugging

---

## 📁 Project Structure

disaster_management/
├── backend/ # Node.js Express server
├── frontend/ # React.js frontend
├── README.md


---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

---

### 🖥️ Frontend Setup

```bash
cd frontend
npm install
npm run dev


cd backend
npm install
npm run dev
# In backend folder create file .env and this variables:
SUPABASE_URL = 
SUPABASE_KEY = 
MAPBOX_KEY = ""
GEMINI_API_KEY = 
PORT =
JWT_SECRET =
GROQ_API_KEY =


🌐 Features
🌐 Real-time disaster reporting and map visualization

📍 Location search using Mapbox and Nominatim

🔔 Live updates and notifications via WebSockets

📡 AI-generated insights with Google Gemini

🔑 Auth and role management (Supabase Auth)

🛠️ Admin panel for managing official updates and resource allocation

Developer Tools
Used Cursor.dev for AI-enhanced pair programming and code generation

During the development of the Disaster Response Coordination Platform project, I actively used Cursor, an AI-powered code editor, to streamline and enhance my coding workflow. Cursor helped me in the following ways:

AI Assistance: I used Cursor's integrated AI features to generate boilerplate code, debug complex logic, and improve code structure, saving significant development time.

Code Suggestions: Leveraged Cursor for real-time suggestions and auto-completions, particularly during backend development with Node.js and frontend components in React.

File Navigation: Utilized its intuitive UI and smart file navigation to manage large codebases efficiently.



Development is modular with clear separation of concerns between frontend and backend



