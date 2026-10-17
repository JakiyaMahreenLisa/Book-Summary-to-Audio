import { useState, useRef, useEffect } from 'react';
import { summaryTypes, voices } from '../data/content.js';

export default function UploadPanel({ onGenerated }) {
  const fileInputRef = useRef(null);
  const timers = useRef([]);

  const [fileLabel, setFileLabel] = useState('Drop your PDF or EPUB file here');
  const [fileSubLabel, setFileSubLabel] = useState('Supports PDFs up to 50MB • Fast 30s Audio Generation');
  const [summaryType, setSummaryType] = useState('10min');
  const [voice, setVoice] = useState('james');
  const [status, setStatus] = useState('idle'); // idle | loading | done

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileLabel(`Selected: ${file.name}`);
      setFileSubLabel(`${(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to Process`);
    }
  };

  const generateAudioStory = () => {
    setStatus('loading');
    timers.current.push(
      setTimeout(() => {
        setStatus('done');
        onGenerated();
        timers.current.push(setTimeout(() => setStatus('idle'), 3000));
      }, 1800),
    );
  };

  const btnColor = status === 'done' ? 'bg-emerald-600' : 'bg-brand-500';

  return (
    <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col gap-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <i className="fa-solid fa-wand-magic-sparkles text-brand-500"></i> AI Document Synthesizer
        </h2>
        <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-1 rounded-full border border-emerald-200/60">
          <i className="fa-solid fa-circle text-[8px] animate-pulse"></i> Ready
        </span>
      </div>

      {/* Upload Zone */}
      <div
        className="border-2 border-dashed border-brand-200 bg-brand-50/40 hover:bg-brand-50 rounded-2xl p-6 text-center transition-all cursor-pointer group flex flex-col items-center justify-center min-h-[140px]"
        onClick={() => fileInputRef.current?.click()}
      >
        <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.epub,.txt" onChange={handleFileSelect} />
        <div className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-brand-500 mb-3 group-hover:scale-110 transition-transform">
          <i className="fa-solid fa-cloud-arrow-up text-xl"></i>
        </div>
        <p className="text-sm font-semibold text-slate-800">{fileLabel}</p>
        <p className="text-xs text-slate-500 mt-1">{fileSubLabel}</p>
      </div>

      {/* Summary Depth Selector */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">1. Choose Audio Format</label>
        <div className="grid grid-cols-3 gap-2">
          {summaryTypes.map((t) => {
            const active = summaryType === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setSummaryType(t.id)}
                className={
                  active
                    ? 'text-left p-3 rounded-xl border-2 border-brand-500 bg-brand-50/50 transition-all'
                    : 'text-left p-3 rounded-xl border border-slate-200 hover:border-brand-300 transition-all'
                }
              >
                <span className={`block text-xs font-bold ${active ? 'text-brand-700' : 'text-slate-800'}`}>{t.title}</span>
                <span className="block text-[10px] text-slate-500 mt-0.5">{t.sub}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Voice Narrator */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">2. Voice Narrator</label>
        <div className="relative">
          <select
            value={voice}
            onChange={(e) => setVoice(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white appearance-none cursor-pointer"
          >
            {voices.map((v) => (
              <option key={v.id} value={v.id}>{v.label}</option>
            ))}
          </select>
          <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none"></i>
        </div>
      </div>

      {/* Process Button */}
      <button
        onClick={generateAudioStory}
        disabled={status !== 'idle'}
        className={`w-full py-3.5 px-6 rounded-xl ${btnColor} ${status === 'idle' ? 'hover:bg-brand-600' : ''} text-white font-bold text-sm shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition-all active:scale-98`}
      >
        {status === 'idle' && (
          <>
            <i className="fa-solid fa-bolt"></i>
            <span>Generate Sapio Audio Story</span>
          </>
        )}
        {status === 'loading' && (
          <>
            <i className="fa-solid fa-spinner animate-spin"></i> Synthesizing Audio...
          </>
        )}
        {status === 'done' && (
          <>
            <i className="fa-solid fa-circle-check"></i> Audio Story Ready!
          </>
        )}
      </button>
    </div>
  );
}
