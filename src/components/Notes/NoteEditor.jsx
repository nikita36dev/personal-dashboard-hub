import { useState, useEffect } from 'react';
import { Icons } from '../../assets/icons';

const NoteEditor = ({ note, categories, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Personal'
  });

  useEffect(() => {
    if (note) {
      setFormData({
        title: note.title,
        content: note.content,
        category: note.category
      });
    }
  }, [note]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title.trim() && formData.content.trim()) {
      onSave(note ? { ...note, ...formData } : formData);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal note-editor-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2>{note ? 'Edit Note' : 'New Note'}</h2>
          <button onClick={onClose} style={{ width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icons.Close />
          </button>
        </div>

        <form className="note-editor" onSubmit={handleSubmit}>
          <input
            type="text"
            className="editor-title-input"
            placeholder="Note title..."
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <textarea
            className="editor-content"
            placeholder="Start writing..."
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            required
          />

          <div className="editor-footer">
            <select
              className="editor-category-select"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <div className="editor-actions">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <Icons.Save />
                Save Note
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteEditor;
//teju be with me i just want you