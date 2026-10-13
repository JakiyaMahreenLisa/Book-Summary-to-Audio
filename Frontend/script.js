// State variables
        let isPlaying = false;
        let currentSpeedIndex = 0;
        const speeds = [1.0, 1.25, 1.5, 2.0];
        let currentProgress = 28;
        let autoScroll = true;
        let playInterval = null;

        // Interactive Audio Controls
        function togglePlay() {
            isPlaying = !isPlaying;
            const playIcon = document.getElementById('play-icon');
            const mainPlayBtn = document.getElementById('main-play-btn');
            const waveBars = document.querySelectorAll('.waveform-bar');

            if (isPlaying) {
                playIcon.className = 'fa-solid fa-pause';
                mainPlayBtn.classList.add('bg-brand-600', 'ring-4', 'ring-brand-500/30');
                
                // Start Simulated Audio Loop
                playInterval = setInterval(() => {
                    if (currentProgress < 100) {
                        currentProgress += 0.5;
                        document.getElementById('seek-bar').value = currentProgress;
                        updateSeek(currentProgress);
                    } else {
                        togglePlay();
                        currentProgress = 0;
                    }
                }, 500);

                // Animate visualizer
                waveBars.forEach((bar, i) => {
                    bar.style.height = `${Math.floor(Math.random() * 20) + 6}px`;
                });
            } else {
                playIcon.className = 'fa-solid fa-play ml-1';
                mainPlayBtn.classList.remove('bg-brand-600', 'ring-4', 'ring-brand-500/30');
                clearInterval(playInterval);
            }
        }

        function toggleSpeed() {
            currentSpeedIndex = (currentSpeedIndex + 1) % speeds.length;
            const newSpeed = speeds[currentSpeedIndex];
            document.getElementById('speed-btn').innerText = `${newSpeed.toFixed(1)}x`;
        }

        function updateSeek(val) {
            currentProgress = parseFloat(val);
            const totalSeconds = 720; // 12 mins
            const currentSeconds = Math.floor((val / 100) * totalSeconds);
            
            const mins = Math.floor(currentSeconds / 60);
            const secs = currentSeconds % 60;
            document.getElementById('current-time').innerText = 
                `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

            // Highlight transcript lines based on progress
            const tBox = document.getElementById('transcript-box');
            if (val > 0 && val <= 25) {
                setActiveTranscriptLine('t-line-1');
            } else if (val > 25 && val <= 50) {
                setActiveTranscriptLine('t-line-2');
            } else if (val > 50 && val <= 75) {
                setActiveTranscriptLine('t-line-3');
            } else {
                setActiveTranscriptLine('t-line-4');
            }
        }

        function setActiveTranscriptLine(id) {
            for (let i = 1; i <= 4; i++) {
                const el = document.getElementById(`t-line-${i}`);
                if (`t-line-${i}` === id) {
                    el.className = 'bg-brand-100 text-brand-700 font-semibold p-1.5 rounded-lg border-l-4 border-brand-500 my-1';
                    if (autoScroll) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                } else {
                    el.className = 'transition-colors duration-200 p-1.5 rounded-lg text-slate-600';
                }
            }
        }

        function skipTime(seconds) {
            currentProgress = Math.max(0, Math.min(100, currentProgress + (seconds / 720) * 100));
            document.getElementById('seek-bar').value = currentProgress;
            updateSeek(currentProgress);
        }

        function toggleAutoScroll() {
            autoScroll = !autoScroll;
            document.getElementById('autoscroll-state').innerText = autoScroll ? 'ON' : 'OFF';
        }

        function changeChapter(val) {
            currentProgress = (val - 1) * 33;
            document.getElementById('seek-bar').value = currentProgress;
            updateSeek(currentProgress);
            if (!isPlaying) togglePlay();
        }

        // Summary Type Selection
        function selectSummaryType(type) {
            document.querySelectorAll('.summary-btn').forEach(btn => {
                btn.className = 'summary-btn text-left p-3 rounded-xl border border-slate-200 hover:border-brand-300 transition-all';
                btn.querySelector('span').className = 'block text-xs font-bold text-slate-800';
            });

            const activeBtn = document.getElementById(`btn-${type}`);
            activeBtn.className = 'summary-btn active text-left p-3 rounded-xl border-2 border-brand-500 bg-brand-50/50 transition-all';
            activeBtn.querySelector('span').className = 'block text-xs font-bold text-brand-700';
        }

        // Document File Handler
        function handleFileSelect(e) {
            const file = e.target.files[0];
            if (file) {
                document.getElementById('file-label-main').innerText = `Selected: ${file.name}`;
                document.getElementById('file-sub-label').innerText = `${(file.size / (1024*1024)).toFixed(2)} MB • Ready to Process`;
            }
        }

        // Generate Custom Story Click Handler
        function generateAudioStory() {
            const btn = document.getElementById('generate-btn');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = `<i class="fa-solid fa-spinner animate-spin"></i> Synthesizing Audio...`;
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = `<i class="fa-solid fa-circle-check"></i> Audio Story Ready!`;
                btn.classList.replace('bg-brand-500', 'bg-emerald-600');

                // Load custom item into player
                loadBookToPlayer('Uploaded Custom Document', 'Sapio AI Engine', 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=300&auto=format&fit=crop&q=80', '10 min');

                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.classList.replace('bg-emerald-600', 'bg-brand-500');
                    btn.disabled = false;
                }, 3000);
            }, 1800);
        }

        // Load Book to Player
        function loadBookToPlayer(title, author, imgUrl, duration) {
            document.getElementById('player-title').innerText = title;
            document.getElementById('player-author-name').innerText = author;
            document.getElementById('player-cover').src = imgUrl;
            document.getElementById('duration-time').innerText = duration;
            document.getElementById('modal-book-title').innerText = `${title} - Source Summary PDF`;

            currentProgress = 0;
            document.getElementById('seek-bar').value = 0;
            updateSeek(0);
            if (!isPlaying) togglePlay();

            // Scroll smoothly to player
            document.getElementById('hero-section').scrollIntoView({ behavior: 'smooth' });
        }

        // Category Filter
        function filterCategory(cat, btnElement) {
            document.querySelectorAll('.category-btn').forEach(btn => {
                btn.className = 'category-btn bg-white border border-slate-200 text-slate-600 hover:border-brand-300 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all';
            });
            btnElement.className = 'category-btn active bg-brand-500 text-white px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap shadow-sm';

            const cards = document.querySelectorAll('.book-card');
            cards.forEach(card => {
                if (cat === 'all' || card.dataset.category === cat) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        }

        // Modals Logic
        function openPdfModal(bookName) {
            if (bookName) {
                document.getElementById('modal-book-title').innerText = `${bookName} - Source Summary PDF`;
            }
            document.getElementById('pdf-modal').classList.remove('hidden');
        }

        function closePdfModal() {
            document.getElementById('pdf-modal').classList.add('hidden');
        }

        function openSearchModal() {
            document.getElementById('search-modal').classList.remove('hidden');
            document.getElementById('search-input').focus();
        }

        function closeSearchModal() {
            document.getElementById('search-modal').classList.add('hidden');
        }

        function handleSearch(query) {
            const resultsBox = document.getElementById('search-results');
            if (!query.trim()) {
                resultsBox.innerHTML = '<p class="text-xs text-slate-400 p-2">Type above to search across 10,000+ AI audio summaries...</p>';
                return;
            }
            const items = ['Atomic Habits', 'Deep Work', 'Thinking, Fast and Slow', 'Dune', 'The Psychology of Money', 'Zero to One', 'Sapiens'];
            const filtered = items.filter(item => item.toLowerCase().includes(query.toLowerCase()));
            
            if (filtered.length > 0) {
                resultsBox.innerHTML = filtered.map(item => `
                    <div onclick="loadBookToPlayer('${item}', 'Featured Author', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&auto=format&fit=crop&q=80', '15 min'); closeSearchModal();" class="p-2.5 hover:bg-brand-50 rounded-lg cursor-pointer flex items-center justify-between font-medium text-slate-800">
                        <span><i class="fa-solid fa-book-open text-brand-500 mr-2"></i> ${item}</span>
                        <span class="text-xs text-slate-400">Audio Story →</span>
                    </div>
                `).join('');
            } else {
                resultsBox.innerHTML = '<p class="text-xs text-slate-400 p-2">No matching audio summaries found.</p>';
            }
        }

        function toggleLibraryDrawer() {
            alert('Your Saved Library contains 2 items: Atomic Habits and Deep Work.');
        }
// ---------- Auth (frontend demo, no real backend yet) ----------
let authMode = 'login';

function openAuthModal(mode = 'login') {
    setAuthMode(mode);
    document.getElementById('auth-modal').classList.remove('hidden');
    document.getElementById('auth-email').focus();
}

function closeAuthModal() {
    document.getElementById('auth-modal').classList.add('hidden');
    document.getElementById('auth-form').reset();
    showAuthError('');
}

function setAuthMode(mode) {
    authMode = mode;
    const isSignup = mode === 'signup';
    document.getElementById('auth-title').innerText = isSignup ? 'Create your free account' : 'Welcome back';
    document.getElementById('auth-name-wrap').classList.toggle('hidden', !isSignup);
    document.getElementById('auth-submit').innerText = isSignup ? 'Sign up' : 'Log in';
    document.getElementById('auth-switch-text').innerText = isSignup ? 'Already have an account?' : "Don't have an account?";
    document.getElementById('auth-switch-btn').innerText = isSignup ? 'Log in' : 'Sign up';
    showAuthError('');
}

function showAuthError(msg) {
    const el = document.getElementById('auth-error');
    el.innerText = msg;
    el.classList.toggle('hidden', !msg);
}

function handleAuthSubmit(e) {
    e.preventDefault();
    const isSignup = authMode === 'signup';
    const name = document.getElementById('auth-name').value.trim();
    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value;

    if (isSignup && !name) return showAuthError('Please enter your name.');
    if (!email) return showAuthError('Please enter your email.');
    if (password.length < 6) return showAuthError('Password must be at least 6 characters.');

    // TODO: replace this with a real backend / auth service call
    const user = { name: isSignup ? name : email.split('@')[0], email };
    localStorage.setItem('sapio_user', JSON.stringify(user));

    closeAuthModal();
    renderAuthState();
}

function logout() {
    localStorage.removeItem('sapio_user');
    renderAuthState();
}

function renderAuthState() {
    const user = JSON.parse(localStorage.getItem('sapio_user') || 'null');
    const menu = document.getElementById('user-menu');
    document.getElementById('login-btn').classList.toggle('hidden', !!user);
    document.getElementById('signup-btn').classList.toggle('hidden', !!user);
    menu.classList.toggle('hidden', !user);
    menu.classList.toggle('flex', !!user);
    if (user) document.getElementById('user-name').innerText = `Hi, ${user.name}`;
}

document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAuthModal(); });
document.addEventListener('DOMContentLoaded', renderAuthState);