'use client'
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '@/components/notes/NoteCard.css';

// Dynamic import for Editor
const Editor = typeof window === 'object' ? require('react-draft-wysiwyg').Editor : () => null;

const NotePage = () => {
  const [notes, setNotes] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentNote, setCurrentNote] = useState({ _id: null, title: '', rawContent: null });
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [notification, setNotification] = useState('');
  const [error, setError] = useState('');

  const fetchNotes = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/notes');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
      setError('Failed to fetch notes');
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
  };

  const handleNoteClick = (note) => {
    setCurrentNote({ _id: note._id, title: note.title, rawContent: note.content });
    if (note.content) {
      const contentState = convertFromRaw(JSON.parse(note.content));
      setEditorState(EditorState.createWithContent(contentState));
    } else {
      setEditorState(EditorState.createEmpty());
    }
    setShowPopup(true);
  };

  const handleSaveNote = async () => {
    if (!currentNote.title.trim()) {
      setError('Title cannot be empty');
      return;
    }

    const content = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
    const method = currentNote._id ? 'PATCH' : 'POST';
    const url = currentNote._id ? `http://localhost:8000/api/v1/notes/${currentNote._id}` : 'http://localhost:8000/api/v1/notes';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: currentNote.title, content }),
      });

      if (response.ok) {
        fetchNotes();
        setShowPopup(false);
        setNotification(currentNote._id ? 'Note updated successfully!' : 'Note created successfully!');
        setCurrentNote({ _id: null, title: '', rawContent: null });
        setEditorState(EditorState.createEmpty());
      } else {
        setError('Failed to save the note');
      }
    } catch (error) {
      console.error('Error saving note:', error);
      setError('An error occurred while saving the note');
    }
  };

  const handleDeleteNote = async () => {
    if (!currentNote._id) {
      setError('Cannot delete an unsaved note');
      return;
    }

    const confirmDelete = window.confirm('Are you sure you want to delete this note?');
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:8000/api/v1/notes/${currentNote._id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchNotes();
          setShowPopup(false);
          setNotification('Note deleted successfully!');
        } else {
          setError('Failed to delete the note');
        }
      } catch (error) {
        console.error('Error deleting note:', error);
        setError('An error occurred while deleting the note');
      }
    }
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
    if (!showPopup) {
      setCurrentNote({ _id: null, title: '', rawContent: null });
      setEditorState(EditorState.createEmpty());
    }
  };

  return (
    <div>
      <button onClick={togglePopup}>Create new note &#43;</button>

      <div className="notes-container">
        {notes.map((note) => (
          <div key={note._id} className="note-card" onClick={() => handleNoteClick(note)}>
            <h3 className="note-title">{note.title}</h3>
            <p className="note-content">{note.content && JSON.parse(note.content).blocks[0].text}</p>
          </div>
        ))}
      </div>

      {showPopup && (
        <div className="popup">
          <div className="popup-inner">
            <h2>{currentNote._id ? 'Edit Note' : 'Create New Note'}</h2>
            <Input
              type="text"
              placeholder="Enter note title"
              value={currentNote.title}
              onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
            />
            <Editor
              editorState={editorState}
              wrapperClassName="demo-wrapper"
              editorClassName="demo-editor"
              onEditorStateChange={onEditorStateChange}
            />
            <Button className="save-button" onClick={handleSaveNote}>
              {currentNote._id ? 'Save Changes' : 'Save'}
            </Button>
            {currentNote._id && (
              <Button className="delete-button" onClick={handleDeleteNote}>
                Delete
              </Button>
            )}
            <Button onClick={togglePopup}>Cancel</Button>
          </div>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
      {notification && <div className="notification-message">{notification}</div>}
    </div>
  );
};

export default NotePage;
