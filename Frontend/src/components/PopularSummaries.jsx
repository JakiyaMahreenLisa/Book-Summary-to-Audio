import { useState } from 'react';
import { books, categories } from '../data/content.js';

function BookCard({ book, saved, onListen, onToggleSave, onOpenPdf }) {
  return (
    <div className="book-card bg-white rounded-2xl p-4 border border-slate-100 shadow-lg shadow-slate-200/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="relative overflow-hidden rounded-xl mb-3 group">
          <img src={book.img} alt={book.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
          <span className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
            <i className="fa-solid fa-headphones text-brand-gold"></i> {book.duration}
          </span>
        </div>
        <span className="text-[10px] font-extrabold uppercase text-brand-500 tracking-wider">{book.tag}</span>
        <h3 className="text-base font-bold text-slate-900 line-clamp-1 mt-0.5">{book.title}</h3>
        <p className="text-xs text-slate-500">{book.author}</p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          onClick={() => onListen(book)}
          className="flex-1 py-2 px-3 rounded-xl bg-brand-50 hover:bg-brand-500 text-brand-700 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
        >
          <i className="fa-solid fa-play text-[10px]"></i> Listen
        </button>
        <button
          onClick={() => onToggleSave(book.id)}
          className="p-2 rounded-xl border border-slate-200 hover:border-brand-300 transition-all"
          title="Save to library"
        >
          <i className={saved ? 'fa-solid fa-bookmark text-brand-gold' : 'fa-regular fa-bookmark text-slate-600'}></i>
        </button>
        <button
          onClick={() => onOpenPdf(book.title)}
          className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-brand-500 hover:border-brand-300 text-xs font-medium transition-all"
          title="Read Summary PDF"
        >
          <i className="fa-solid fa-file-lines"></i>
        </button>
      </div>
    </div>
  );
}

export default function PopularSummaries({ savedIds, onListen, onToggleSave, onOpenPdf }) {
  const [category, setCategory] = useState('all');
  const visible = books.filter((b) => category === 'all' || b.category === category);

  return (
    <section id="popular-library" className="mt-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Popular Audio Summaries</h2>
          <p className="text-sm text-slate-500 mt-1">Trending book breakdowns curated by Sapio AI algorithms.</p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 custom-scrollbar">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={
                category === c.id
                  ? 'bg-brand-500 text-white px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-brand-300 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all'
              }
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {visible.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            saved={savedIds.includes(book.id)}
            onListen={onListen}
            onToggleSave={onToggleSave}
            onOpenPdf={onOpenPdf}
          />
        ))}
      </div>
    </section>
  );
}
