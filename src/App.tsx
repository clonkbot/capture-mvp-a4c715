import { useState, useEffect } from 'react';
import './styles.css';

interface Note {
  id: string;
  content: string;
  timestamp: Date;
  pinned: boolean;
}

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const addNote = () => {
    if (!inputValue.trim()) return;
    const newNote: Note = {
      id: crypto.randomUUID(),
      content: inputValue,
      timestamp: new Date(),
      pinned: false,
    };
    setNotes([newNote, ...notes]);
    setInputValue('');
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const togglePin = (id: string) => {
    setNotes(notes.map(n =>
      n.id === id ? { ...n, pinned: !n.pinned } : n
    ));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addNote();
    }
  };

  const sortedNotes = [...notes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="app-container">
      <div className="noise-overlay" />
      <div className="grid-lines" />

      <header className={`header ${isLoaded ? 'loaded' : ''}`}>
        <div className="header-accent" />
        <div className="header-content">
          <div className="logo-section">
            <span className="logo-bracket">[</span>
            <h1 className="logo">CAPTURE</h1>
            <span className="logo-bracket">]</span>
          </div>
          <p className="tagline">Minimal Viable Product for your thoughts</p>
        </div>
        <div className="header-stats">
          <div className="stat">
            <span className="stat-value">{notes.length}</span>
            <span className="stat-label">NOTES</span>
          </div>
          <div className="stat">
            <span className="stat-value">{notes.filter(n => n.pinned).length}</span>
            <span className="stat-label">PINNED</span>
          </div>
        </div>
      </header>

      <main className={`main-content ${isLoaded ? 'loaded' : ''}`}>
        <section className="input-section">
          <div className="input-wrapper">
            <div className="input-label">
              <span className="label-icon">&gt;</span>
              <span>NEW ENTRY</span>
            </div>
            <textarea
              className="note-input"
              placeholder="What's on your mind?"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={3}
            />
            <div className="input-actions">
              <span className="hint">Press Enter to save</span>
              <button
                className="add-button"
                onClick={addNote}
                disabled={!inputValue.trim()}
              >
                <span className="button-text">CAPTURE</span>
                <span className="button-arrow">→</span>
              </button>
            </div>
          </div>
        </section>

        <section className="notes-section">
          <div className="section-header">
            <div className="section-line" />
            <h2 className="section-title">CAPTURED THOUGHTS</h2>
            <div className="section-line" />
          </div>

          {sortedNotes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <span className="empty-bracket">{`{`}</span>
                <span className="empty-dots">...</span>
                <span className="empty-bracket">{`}`}</span>
              </div>
              <p className="empty-text">No thoughts captured yet</p>
              <p className="empty-subtext">Start typing above to begin</p>
            </div>
          ) : (
            <div className="notes-grid">
              {sortedNotes.map((note, index) => (
                <article
                  key={note.id}
                  className={`note-card ${note.pinned ? 'pinned' : ''}`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="note-header">
                    <span className="note-time">{formatTime(note.timestamp)}</span>
                    <div className="note-actions">
                      <button
                        className={`pin-button ${note.pinned ? 'active' : ''}`}
                        onClick={() => togglePin(note.id)}
                        aria-label={note.pinned ? 'Unpin note' : 'Pin note'}
                      >
                        {note.pinned ? '◆' : '◇'}
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => deleteNote(note.id)}
                        aria-label="Delete note"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  <p className="note-content">{note.content}</p>
                  <div className="note-footer">
                    <span className="note-id">#{note.id.slice(0, 8)}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        <span>Requested by @huellermichael · Built by @clonkbot</span>
      </footer>
    </div>
  );
}

export default App;
