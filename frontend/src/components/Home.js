import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [title, setTitle] = useState('');
  const navigate = useNavigate();

  const createNote = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const response = await fetch('http://localhost:5000/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      });
      
      const note = await response.json();
      navigate(`/note/${note._id}`);
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
      <h1>Collaborative Notes</h1>
      <form onSubmit={createNote}>
        <input
          type="text"
          placeholder="Enter note title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: '100%',
            padding: '1rem',
            fontSize: '1rem',
            marginBottom: '1rem',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />
        <button
          type="submit"
          style={{
            padding: '1rem 2rem',
            fontSize: '1rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Create Note
        </button>
      </form>
    </div>
  );
};

export default Home;