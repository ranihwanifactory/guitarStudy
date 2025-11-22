import React, { useState, useCallback } from 'react';
import { Search, Guitar, Info, Sparkles, AlertCircle } from 'lucide-react';
import { generateChord } from './services/geminiService';
import { SearchState, ChordData } from './types';
import Fretboard from './components/Fretboard';
import LoadingState from './components/LoadingState';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [state, setState] = useState<SearchState>({
    isLoading: false,
    error: null,
    data: null,
  });

  const handleSearch = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const data: ChordData = await generateChord(query);
      setState({ isLoading: false, error: null, data });
    } catch (err: any) {
      setState({ 
        isLoading: false, 
        error: "코드를 불러오는 데 실패했습니다. 다시 시도해주세요.", 
        data: null 
      });
    }
  }, [query]);

  const suggestions = ["C Major", "G7", "F#m", "Dsus4", "Bm7b5"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 pb-20">
      
      {/* Navbar */}
      <nav className="bg-slate-900/50 backdrop-blur-md border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-wood-400">
            <Guitar className="w-6 h-6" />
            <span className="font-bold text-xl tracking-tight text-white">GitaMaster</span>
          </div>
          <div className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded-full border border-white/5">
            Powered by Gemini 2.5
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 pt-8">
        
        {/* Header Text */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-wood-200 to-wood-500">
            어떤 코드를 배우고 싶으신가요?
          </h1>
          <p className="text-slate-400">
            원하는 코드 이름을 입력하면 AI가 정확한 운지법과 팁을 알려드립니다.
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-12">
          <form onSubmit={handleSearch} className="relative max-w-lg mx-auto group">
            <div className="absolute inset-0 bg-wood-600 rounded-full blur opacity-20 group-hover:opacity-30 transition duration-200"></div>
            <div className="relative flex items-center">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="예: C Major, F#m7, Asus4..."
                className="w-full bg-slate-800/80 border border-white/10 rounded-full py-4 pl-6 pr-14 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-wood-500/50 shadow-xl transition-all"
              />
              <button
                type="submit"
                disabled={state.isLoading || !query}
                className="absolute right-2 p-2 bg-wood-600 hover:bg-wood-500 disabled:bg-slate-700 rounded-full text-white transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Suggestions */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setQuery(s);
                  // To allow state update to propagate before triggering search, we could use useEffect or just manual trigger wrapper
                  // Simple approach: set query then user clicks or we handle it via ref. 
                  // For better UX in this strict pattern, let's just set query.
                }}
                className="px-3 py-1 text-sm bg-slate-800/50 border border-white/5 rounded-full text-slate-400 hover:text-wood-300 hover:border-wood-500/30 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="min-h-[400px]">
          {state.isLoading && <LoadingState />}

          {state.error && (
            <div className="flex items-center justify-center p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {state.error}
            </div>
          )}

          {!state.isLoading && !state.error && !state.data && (
            <div className="flex flex-col items-center justify-center text-slate-600 h-full py-20">
              <Sparkles className="w-12 h-12 mb-4 opacity-20" />
              <p>검색을 시작하여 기타 마스터가 되어보세요.</p>
            </div>
          )}

          {state.data && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid md:grid-cols-2 gap-8 bg-slate-800/50 backdrop-blur border border-white/5 rounded-2xl p-6 md:p-8 shadow-2xl">
                
                {/* Left Column: Diagram */}
                <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/5 pb-6 md:pb-0 md:pr-6">
                  <div className="mb-4 flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                      ${state.data.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-300' : 
                        state.data.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-300' : 
                        'bg-red-500/20 text-red-300'}`}>
                      {state.data.difficulty}
                    </span>
                  </div>
                  <Fretboard data={state.data} />
                </div>

                {/* Right Column: Info */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                      <Info className="w-5 h-5 text-wood-400" />
                      연주 팁
                    </h2>
                    <div className="p-4 bg-slate-900/50 rounded-xl border border-white/5 text-slate-300 leading-relaxed">
                      {state.data.description}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-wood-200 mb-3">빠른 요약</h3>
                    <ul className="space-y-3 text-sm text-slate-400">
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center shrink-0 text-white text-xs">1</div>
                        <span>
                           {state.data.barre 
                             ? `${state.data.barre.fret}번 프렛에서 바레(Barre)를 잡으세요.` 
                             : "개방현(Open Strings)을 깨끗하게 울리세요."}
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center shrink-0 text-white text-xs">2</div>
                        <span>손가락 끝을 세워서 인접한 줄을 건드리지 않도록 주의하세요.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center shrink-0 text-white text-xs">3</div>
                        <span>엄지손가락 위치: {state.data.fingers.includes(5) ? "넥 위로 넘어와 줄을 뮤트하세요." : "넥 뒤 중앙에 위치시키세요."}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-slate-600 py-8 text-sm">
        &copy; {new Date().getFullYear()} GitaMaster. Designed for guitarists.
      </footer>
    </div>
  );
};

export default App;