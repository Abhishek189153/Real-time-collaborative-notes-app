# Real-Time Collaborative Notes App

**Author**: Abhishek Pant

A MERN stack application that allows multiple users to collaborate on notes in real-time using WebSockets.

## Features

- Create new notes with titles
- Real-time collaborative editing
- Live user count display
- Auto-save functionality
- MongoDB persistence
- Socket.IO for real-time updates

## Tech Stack

- **Backend**: Node.js, Express, MongoDB, Socket.IO
- **Frontend**: React, Socket.IO Client, React Router

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB URI:
```
MONGODB_URI=mongodb://localhost:27017/collaborative-notes
PORT=5000
```

5. Start the backend server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies (already done during setup):
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

## Usage

1. Open http://localhost:3000 in your browser
2. Enter a note title and click "Create Note"
3. Start typing in the note editor
4. Open the same note URL in multiple tabs/browsers to see real-time collaboration
5. Changes appear instantly across all connected clients

## API Endpoints

- `POST /notes` - Create a new note
- `GET /notes/:id` - Fetch note by ID
- `PUT /notes/:id` - Update note content

## WebSocket Events

- `join_note` - Join a note room
- `note_update` - Broadcast live content changes
- `active_users` - Show number of active collaborators

## Project Structure

```
├── backend/
│   ├── models/
│   │   └── Note.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Home.js
│   │   │   └── NoteEditor.js
│   │   ├── App.js
│   │   └── App.css
│   └── package.json
└── README.md
```