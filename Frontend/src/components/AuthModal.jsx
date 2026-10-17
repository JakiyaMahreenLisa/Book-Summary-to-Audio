import { useState, useEffect } from 'react';

// Frontend demo only: swap handleSubmit's body for a real backend call later.
export default function AuthModal({ initialMode, onClose, onAuthenticated }) {
  const [mode, setMode] = useState(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const isSignup = mode === 'signup';

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const switchMode = () => {
    setMode(isSignup ? 'login' : 'signup');
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (isSignup && !trimmedName) return setError('Please enter your name.');
    if (!trimmedEmail) return setError('Please enter your email.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');

    // TODO: replace this with a real backend / auth service call
    const user = { name: isSignup ? trimmedName : trimmedEmail.split('@')[0], email: trimmedEmail };
    onAuthenticated(user);
  };

  const inputCls =
    'w-full px-3 py-2.5 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500';

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 border border-slate-200 relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600">
          <i className="fa-solid fa-xmark"></i>
        </button>

        <h3 className="text-xl font-bold text-slate-900 mb-5">{isSignup ? 'Create your free account' : 'Welcome back'}</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
            <input type="email" autoFocus value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} />
          </div>

          {error && <p className="text-xs font-medium text-red-600">{error}</p>}

          <button type="submit" className="w-full py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-bold rounded-xl transition-colors">
            {isSignup ? 'Sign up' : 'Log in'}
          </button>
        </form>

        <p className="text-xs text-slate-500 text-center mt-4">
          <span>{isSignup ? 'Already have an account?' : "Don't have an account?"}</span>{' '}
          <button type="button" onClick={switchMode} className="font-bold text-brand-500 hover:underline">
            {isSignup ? 'Log in' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  );
}
