require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');
const Note = require('./models/Note');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/collaborative-notes')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


app.post('/notes', async (req, res) => {
  try {
    const note = new Note({ title: req.body.title });
    await note.save();
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/notes/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/notes/:id', async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { content: req.body.content, updatedAt: new Date() },
      { new: true }
    );
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


const activeUsers = new Map();

io.on('connection', (socket) => {
  socket.on('join_note', (noteId) => {
    socket.join(noteId);
    
    if (!activeUsers.has(noteId)) {
      activeUsers.set(noteId, new Set());
    }
    activeUsers.get(noteId).add(socket.id);
    
    io.to(noteId).emit('active_users', activeUsers.get(noteId).size);
  });

  socket.on('note_update', async (data) => {
    try {
      await Note.findByIdAndUpdate(data.noteId, {
        content: data.content,
        updatedAt: new Date()
      });
      
      socket.to(data.noteId).emit('note_update', {
        content: data.content,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating note:', error);
    }
  });

  socket.on('disconnect', () => {
    activeUsers.forEach((users, noteId) => {
      if (users.has(socket.id)) {
        users.delete(socket.id);
        io.to(noteId).emit('active_users', users.size);
      }
    });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});