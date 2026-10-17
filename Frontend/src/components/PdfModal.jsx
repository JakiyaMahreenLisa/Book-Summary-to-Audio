export default function PdfModal({ title, onClose }) {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-3xl h-[80vh] shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
              <i className="fa-solid fa-file-pdf text-base"></i>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">{title} - Source Summary PDF</h3>
              <p className="text-xs text-slate-500">Sapio AI Formatted Reader • Chapter Breakdown</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 sm:p-8 overflow-y-auto custom-scrollbar bg-white text-slate-800 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold text-brand-gold uppercase tracking-wider">EXECUTIVE SUMMARY</span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-1">Atomic Habits: Key Takeaways</h2>
            <p className="text-xs text-slate-500 mt-1">Author: James Clear • Topic: Self Improvement &amp; Behavioral Psychology</p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-2">1. The Power of Small Habits (1% Rule)</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              It is so easy to overestimate the importance of one defining moment and underestimate the value of making small improvements on a daily basis. Too often, we convince ourselves that massive success requires massive action. Meanwhile, improving by 1 percent isn't particularly notable— sometimes it isn't even noticeable—but it can be far more meaningful, especially in the long run.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-2">2. Focus on Systems, Not Goals</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Goals are about the results you want to achieve. Systems are about the processes that lead to those results. If you want better results, then forget about setting goals. Focus on your system instead. You do not rise to the level of your goals; you fall to the level of your systems.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-2">3. The Four Laws of Behavior Change</h4>
            <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
              <li><strong>1st Law (Cue):</strong> Make it obvious.</li>
              <li><strong>2nd Law (Craving):</strong> Make it attractive.</li>
              <li><strong>3rd Law (Response):</strong> Make it easy.</li>
              <li><strong>4th Law (Reward):</strong> Make it satisfying.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">Page 1 of 4 • Verified by Sapio Engine</span>
          <button onClick={onClose} className="px-5 py-2 bg-brand-500 text-white font-bold text-xs rounded-xl hover:bg-brand-600 transition-colors">
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
}
