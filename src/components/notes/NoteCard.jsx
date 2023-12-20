import React from 'react';
import './NoteCard.css';

const NoteCard = ({ note, onEdit }) => {
  return (
    <div className="note-card" onClick={() => onEdit(note)}>
      <h3 className="note-title">{note.title}</h3>
      <p className="note-content">{note.content}</p>
    </div>
  );
};

export default NoteCard;
