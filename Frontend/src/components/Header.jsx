export default function Header({ user, savedCount, onOpenSearch, onOpenAuth, onLogout, onOpenLibrary }) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-brand-500 group-hover:scale-105 transition-transform duration-200">
            <img src="/images/my_logo.png" alt="Sapio AI logo" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
              Sapio<span className="text-brand-500 font-extrabold">AI</span>
            </span>
          </div>
        </a>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#hero-section" className="text-sm font-semibold text-brand-500 border-b-2 border-brand-500 pb-1">Explore Engine</a>
          <a href="#popular-library" className="text-sm font-medium text-slate-600 hover:text-brand-500 transition-colors">Popular Summaries</a>
          <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-brand-500 transition-colors">How It Works</a>
          <a
            href="#my-library"
            onClick={(e) => { e.preventDefault(); onOpenLibrary(); }}
            className="text-sm font-medium text-slate-600 hover:text-brand-500 transition-colors flex items-center gap-1.5"
          >
            <i className="fa-solid fa-bookmark text-xs text-brand-gold"></i> Saved Library
            <span className={`${savedCount > 0 ? '' : 'hidden'} bg-brand-100 text-brand-700 text-xs px-2 py-0.5 rounded-full font-bold`}>
              {savedCount}
            </span>
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button onClick={onOpenSearch} className="p-2 text-slate-500 hover:text-brand-500 hover:bg-slate-50 rounded-lg transition-all" title="Search Books">
            <i className="fa-solid fa-magnifying-glass text-lg"></i>
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-700">Hi, {user.name}</span>
              <button onClick={onLogout} className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-brand-500 border border-slate-200 rounded-xl hover:border-brand-200 transition-all">
                Log out
              </button>
            </div>
          ) : (
            <>
              <button onClick={() => onOpenAuth('login')} className="hidden sm:inline-flex px-4 py-2 text-sm font-semibold text-slate-700 hover:text-brand-500 border border-slate-200 rounded-xl hover:border-brand-200 transition-all">
                Log in
              </button>
              <button onClick={() => onOpenAuth('signup')} className="px-5 py-2.5 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-md shadow-brand-500/20 hover:shadow-lg hover:shadow-brand-500/30 transition-all active:scale-95">
                Sign up free
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
