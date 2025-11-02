import { useState, useContext, useEffect } from 'react';
import { DataContext } from '../../contexts/DataContext';
import NoteCard from './NoteCard';
import NoteEditor from './NoteEditor';
import { Icons } from '../../assets/icons';
import '../../styles/Notes.css';

const Notes = () => {
  const { notes, saveNotes } = useContext(DataContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showEditor, setShowEditor] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [viewingNote, setViewingNote] = useState(null); // NEW: For full view
  const [sortBy, setSortBy] = useState('updated');

  const categories = ['Personal', 'Work', 'Ideas', 'Important', 'Archive'];

  const addNote = (noteData) => {
    const newNote = {
      ...noteData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    saveNotes([newNote, ...notes]);
    setShowEditor(false);
  };

  const updateNote = (noteData) => {
    const updatedNotes = notes.map(note =>
      note.id === noteData.id 
        ? { ...note, ...noteData, updatedAt: new Date().toISOString() }
        : note
    );
    saveNotes(updatedNotes);
    setEditingNote(null);
    setShowEditor(false);
  };

  const deleteNote = (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      saveNotes(notes.filter(note => note.id !== id));
      setViewingNote(null);
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setViewingNote(null);
    setShowEditor(true);
  };

  const handleView = (note) => {
    setViewingNote(note);
  };

  const filteredNotes = notes
    .filter(note => {
      const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          note.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || note.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'updated') {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      } else if (sortBy === 'created') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        return a.title.localeCompare(b.title);
      }
    });

  return (
    <div className="notes-container">
      <div className="notes-header">
        <div className="notes-search">
          <Icons.Search />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="notes-actions">
          <select 
            className="btn btn-secondary"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select 
            className="btn btn-secondary"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="updated">Last Updated</option>
            <option value="created">Date Created</option>
            <option value="title">Title</option>
          </select>

          <button 
            className="btn btn-primary"
            onClick={() => {
              setEditingNote(null);
              setShowEditor(true);
            }}
          >
            <Icons.Plus />
            New Note
          </button>
        </div>
      </div>

      {filteredNotes.length === 0 ? (
        <div className="empty-state">
          <Icons.Notes />
          <p>No notes found. Create your first note!</p>
        </div>
      ) : (
        <div className="notes-grid">
          {filteredNotes.map(note => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={handleEdit}
              onDelete={deleteNote}
              onView={handleView}
            />
          ))}
        </div>
      )}

      {/* Note Editor Modal */}
      {showEditor && (
        <NoteEditor
          note={editingNote}
          categories={categories}
          onSave={editingNote ? updateNote : addNote}
          onClose={() => {
            setShowEditor(false);
            setEditingNote(null);
          }}
        />
      )}

      {/* Full Note View Modal */}
      {viewingNote && (
        <div className="modal-overlay" onClick={() => setViewingNote(null)}>
          <div className="modal note-view-modal" onClick={(e) => e.stopPropagation()}>
            <div className="note-view-header">
              <h2>{viewingNote.title}</h2>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleEdit(viewingNote)}
                >
                  <Icons.Edit />
                  Edit
                </button>
                <button 
                  onClick={() => setViewingNote(null)}
                  style={{ 
                    width: '36px', 
                    height: '36px', 
                    borderRadius: '8px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    backgroundColor: 'var(--bg-tertiary)'
                  }}
                >
                  <Icons.Close />
                </button>
              </div>
            </div>
            
            <div className="note-view-meta">
              <span className="note-category">{viewingNote.category}</span>
              <span className="note-date">
                Updated: {new Date(viewingNote.updatedAt).toLocaleDateString()}
              </span>
            </div>
            
            <div className="note-view-content">
              {viewingNote.content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;
