import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

const NoteEditor = () => {
  const { id } = useParams();
  const [note, setNote] = useState({ title: '', content: '', updatedAt: '' });
  const [activeUsers, setActiveUsers] = useState(0);
  const socketRef = useRef();
  const saveTimeoutRef = useRef();

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io('http://localhost:5000');
    
    // Join note room
    socketRef.current.emit('join_note', id);

    // Load initial note data
    fetchNote();

    // Listen for real-time updates
    socketRef.current.on('note_update', (data) => {
      setNote(prev => ({
        ...prev,
        content: data.content,
        updatedAt: data.updatedAt
      }));
    });

    socketRef.current.on('active_users', (count) => {
      setActiveUsers(count);
    });

    return () => {
      socketRef.current.disconnect();
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [id]);

  const fetchNote = async () => {
    try {
      const response = await fetch(`http://localhost:5000/notes/${id}`);
      const noteData = await response.json();
      setNote(noteData);
    } catch (error) {
      console.error('Error fetching note:', error);
    }
  };

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setNote(prev => ({ ...prev, content: newContent }));

    // Emit real-time update
    socketRef.current.emit('note_update', {
      noteId: id,
      content: newContent
    });

    // Auto-save after 5 seconds of inactivity
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      saveNote(newContent);
    }, 5000);
  };

  const saveNote = async (content) => {
    try {
      await fetch(`http://localhost:5000/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  return (
    <div style={{ padding: '1rem', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1rem',
        padding: '1rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px'
      }}>
        <h1 style={{ margin: 0 }}>{note.title}</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ color: '#666' }}>
            Active users: {activeUsers}
          </span>
          {note.updatedAt && (
            <span style={{ color: '#666', fontSize: '0.9rem' }}>
              Last updated: {new Date(note.updatedAt).toLocaleString()}
            </span>
          )}
        </div>
      </div>
      
      <textarea
        value={note.content}
        onChange={handleContentChange}
        placeholder="Start typing your note..."
        style={{
          flex: 1,
          width: '100%',
          padding: '1rem',
          fontSize: '1rem',
          border: '1px solid #ddd',
          borderRadius: '4px',
          resize: 'none',
          outline: 'none',
          fontFamily: 'inherit'
        }}
      />
    </div>
  );
};

export default NoteEditor;