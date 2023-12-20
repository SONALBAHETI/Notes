import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const NoteForm = ({ note, setNote, onSave, onCancel }) => {
  return (
    <div className="form-container">
      <div className="input-group">
        <label className="left-label">Title</label>
        <Input
          type="text"
          placeholder="Enter note title"
          value={note.title}
          onChange={(e) => setNote({ ...note, title: e.target.value })}
        />
      </div>
      <div className="input-group description-group">
        <label className="left-label">Description</label>
        <textarea
          className="description-input"
          placeholder="Enter note description"
          value={note.description}
          onChange={(e) => setNote({ ...note, description: e.target.value })}
        ></textarea>
      </div>
      <Button className="save-button" onClick={onSave}>Save</Button>
      <Button className="cancel-button" onClick={onCancel}>Cancel</Button>
    </div>
  );
};

export default NoteForm;