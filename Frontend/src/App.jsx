import { useState, useCallback } from 'react';
import Header from './components/Header.jsx';
import HeroTagline from './components/HeroTagline.jsx';
import UploadPanel from './components/UploadPanel.jsx';
import PlayerPanel from './components/PlayerPanel.jsx';
import PopularSummaries from './components/PopularSummaries.jsx';
import HowItWorks from './components/HowItWorks.jsx';
import PdfModal from './components/PdfModal.jsx';
import AuthModal from './components/AuthModal.jsx';
import SearchModal from './components/SearchModal.jsx';
import Footer from './components/Footer.jsx';
import { useAudioPlayer } from './hooks/useAudioPlayer.js';
import { books, DEFAULT_BOOK, CUSTOM_DOC_BOOK, DEFAULT_COVER } from './data/content.js';

const USER_KEY = 'sapio_user';

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  } catch {
    return null;
  }
}

export default function App() {
  const player = useAudioPlayer();

  const [currentBook, setCurrentBook] = useState(DEFAULT_BOOK);
  const [pdfTitle, setPdfTitle] = useState(null); // null = closed
  const [searchOpen, setSearchOpen] = useState(false);
  const [authMode, setAuthMode] = useState(null); // null | 'login' | 'signup'
  const [user, setUser] = useState(readStoredUser);
  const [savedIds, setSavedIds] = useState([]);

  const { seek, play } = player;

  // Same behaviour as the original loadBookToPlayer()
  const loadBookToPlayer = useCallback(
    (book) => {
      setCurrentBook(book);
      seek(0);
      play();
      document.getElementById('hero-section')?.scrollIntoView({ behavior: 'smooth' });
    },
    [seek, play],
  );

  const handleListen = (b) =>
    loadBookToPlayer({ title: b.title, author: b.author, img: b.img, duration: b.duration });

  const handleSearchSelect = (title) => {
    loadBookToPlayer({ title, author: 'Featured Author', img: DEFAULT_COVER, duration: '15 min' });
    setSearchOpen(false);
  };

  const toggleSave = (id) =>
    setSavedIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));

  const openLibrary = () => {
    const titles = books.filter((b) => savedIds.includes(b.id)).map((b) => b.title);
    window.alert(
      titles.length
        ? `Your Saved Library contains ${titles.length} item${titles.length > 1 ? 's' : ''}: ${titles.join(', ')}.`
        : 'Your Saved Library is empty. Tap the bookmark on a book to save it.',
    );
  };

  const handleAuthenticated = (u) => {
    try { localStorage.setItem(USER_KEY, JSON.stringify(u)); } catch { /* ignore */ }
    setUser(u);
    setAuthMode(null);
  };

  const handleLogout = () => {
    try { localStorage.removeItem(USER_KEY); } catch { /* ignore */ }
    setUser(null);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header
        user={user}
        savedCount={savedIds.length}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenAuth={setAuthMode}
        onLogout={handleLogout}
        onOpenLibrary={openLibrary}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 w-full">
        <HeroTagline />

        <div id="hero-section" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <UploadPanel onGenerated={() => loadBookToPlayer(CUSTOM_DOC_BOOK)} />
          <PlayerPanel
            book={currentBook}
            player={player}
            onOpenPdf={(name) => setPdfTitle(name || currentBook.title)}
          />
        </div>

        <PopularSummaries
          savedIds={savedIds}
          onListen={handleListen}
          onToggleSave={toggleSave}
          onOpenPdf={setPdfTitle}
        />
        <HowItWorks />
      </main>

      <Footer />

      {pdfTitle && <PdfModal title={pdfTitle} onClose={() => setPdfTitle(null)} />}
      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} onSelect={handleSearchSelect} />}
      {authMode && (
        <AuthModal
          initialMode={authMode}
          onClose={() => setAuthMode(null)}
          onAuthenticated={handleAuthenticated}
        />
      )}
    </div>
  );
}
