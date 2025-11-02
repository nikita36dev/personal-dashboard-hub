import { Icons } from '../../assets/icons';
import dateHelpers from '../../utils/dateHelpers';

const NoteCard = ({ note, onEdit, onDelete, onView }) => {
  return (
    <div className="note-card animate-fade-in" onClick={() => onView(note)}>
      <div className="note-card-header">
        <h3 className="note-title">{note.title}</h3>
        <div className="note-actions" onClick={(e) => e.stopPropagation()}>
          <button 
            className="note-action-btn"
            onClick={() => onEdit(note)}
          >
            <Icons.Edit />
          </button>
          <button 
            className="note-action-btn delete"
            onClick={() => onDelete(note.id)}
          >
            <Icons.Delete />
          </button>
        </div>
      </div>

      <div className="note-content">
        {note.content}
      </div>

      <div className="note-footer">
        <span className="note-category">{note.category}</span>
        <span className="note-date">
          {dateHelpers.getRelativeTime(note.updatedAt)}
        </span>
      </div>
    </div>
  );
};

export default NoteCard;
