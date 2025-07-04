import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import NoteEditor from './components/NoteEditor';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/note/:id" element={<NoteEditor />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
