import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Users, 
  Gamepad2, 
  Medal, 
  User as UserIcon, 
  Flame, 
  Zap, 
  MessageSquare, 
  TrendingUp, 
  ChevronRight,
  Target,
  Sword,
  Search,
  Settings,
  Bell,
  Star
} from 'lucide-react';
import { FirebaseProvider, useAuth } from './lib/firebase';
import { cn } from './lib/utils';
import { MatchArena, Clubs, Leaderboard, Profile, ChatView } from './components/ArenaSections';

// --- Components ---

import { Background } from './components/Common';
import { fetchAIPersonalization, fetchAITrivia } from './lib/aiService';

// --- Nav Component ---

const Nav = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => {
  const tabs = [
    { id: 'dashboard', icon: TrendingUp, label: 'Arena' },
    { id: 'matches', icon: Gamepad2, label: 'Live' },
    { id: 'chat', icon: MessageSquare, label: 'Chat' },
    { id: 'community', icon: Users, label: 'Clubs' },
    { id: 'leaderboard', icon: Trophy, label: 'Ranks' },
    { id: 'profile', icon: UserIcon, label: 'Fan ID' },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full px-2 py-2 flex items-center gap-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          id={`nav-tab-${tab.id}`}
          onClick={() => setActiveTab(tab.id)}
          className={cn(
            "relative flex items-center gap-1 md:gap-2 px-4 md:px-6 py-3 rounded-full transition-all duration-300",
            activeTab === tab.id ? "text-[#00ff00] bg-[#00ff00]/10" : "text-white/60 hover:text-white hover:bg-white/5"
          )}
        >
          <tab.icon className="w-5 h-5" />
          <span className="font-medium text-xs md:text-sm hidden sm:inline">{tab.label}</span>
          {activeTab === tab.id && (
            <motion.div
              layoutId="nav-active"
              className="absolute inset-0 rounded-full border border-[#00ff00]/30 shadow-[0_0_15px_rgba(0,255,0,0.2)]"
            />
          )}
        </button>
      ))}
    </nav>
  );
};

const Header = () => {
  const { user, signIn } = useAuth();

  return (
    <header className="fixed top-0 left-0 w-full h-20 px-8 z-40 flex items-center justify-between border-b border-white/5 bg-black/20 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#00ff00]/30 shadow-[0_0_20px_rgba(0,255,0,0.2)]">
          <img src="/image.png" className="w-full h-full object-cover" alt="FanPulse Logo" />
        </div>
        <h1 className="text-2xl font-bold tracking-tighter text-white italic">
          FAN<span className="text-[#00ff00]">PULSE</span>
        </h1>
      </div>

      <div className="flex items-center gap-6">
        {user ? (
          <>
            <div className="hidden md:flex items-center gap-4 bg-white/5 border border-white/10 rounded-full px-4 py-1.5">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500 fill-current" />
                <span className="text-sm font-bold text-white">{user.streakCount}</span>
              </div>
              <div className="w-[1px] h-4 bg-white/10" />
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-[#00ff00] fill-current" />
                <span className="text-sm font-bold text-white">Lvl {user.level}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-white">{user.displayName}</p>
                <p className="text-[10px] text-[#00ff00] font-mono tracking-widest">{user.rank.toUpperCase()}</p>
              </div>
              <img src={user.photoURL} className="w-10 h-10 rounded-full border-2 border-[#00ff00]/50" alt="Profile" />
            </div>
          </>
        ) : (
          <button 
            id="sign-in-btn"
            onClick={signIn}
            className="px-6 py-2 bg-[#00ff00] text-black font-bold rounded-full hover:scale-105 transition-transform"
          >
            Enter Arena
          </button>
        )}
      </div>
    </header>
  );
};

// --- Dashboard Component (The "Arena" home) ---

const DashboardView = ({ setActiveTab }: { setActiveTab: (t: string) => void }) => {
  const { user } = useAuth();
  const [aiInsight, setAiInsight] = useState<string>("Initializing tactical cortex...");
  const [trivia, setTrivia] = useState<any>(null);

  useEffect(() => {
    const loadAI = async () => {
      try {
        const [pers, triv] = await Promise.all([
          fetchAIPersonalization(user, [{ id: 'clásico', teams: 'Real vs Barca' }]),
          fetchAITrivia()
        ]);
        // Handle array response from server
        if (pers && pers.length > 0) {
          setAiInsight(pers[0].reason);
        }
        if (triv && triv.length > 0) {
          setTrivia(triv[0]);
        }
      } catch (e) {
        setAiInsight("Tactical link standby. Based on recent trends, suggest high intensity engagement for late goal momentum.");
      }
    };
    if (user) loadAI();
  }, [user]);

  const missions = [
    { title: "First Goal Prophet", reward: "250 XP", icon: Target, complete: true },
    { title: "Weekly Watcher", reward: "1.2k XP", icon: Gamepad2, complete: false },
    { title: "Tactical Debater", reward: "500 XP", icon: MessageSquare, complete: false },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto pt-24 pb-32 px-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Hype Feed */}
        <div className="md:col-span-2 space-y-6">
          <div className="relative h-96 rounded-[2.5rem] overflow-hidden group border border-white/10">
            <img 
              src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1200" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              alt="Hype"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 p-8 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <p className="text-[#00ff00] text-xs font-mono mb-2 uppercase tracking-widest">Live Hype: 94% Expected Late Winner</p>
                <h2 className="text-4xl font-black text-white italic tracking-tighter">The Bernabéu Pulse is Peak</h2>
              </div>
              <button 
                onClick={() => setActiveTab('matches')}
                className="px-8 py-3 bg-[#00ff00] text-black font-black italic rounded-xl flex items-center gap-2 group whitespace-nowrap"
              >
                ENTER CROWD <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-black/40 border border-white/10 rounded-3xl p-6 backdrop-blur-sm group hover:border-[#00ff00]/50 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-[#00ff00]/10 rounded-lg">
                    <Sword className="text-[#00ff00] w-5 h-5" />
                  </div>
                  <span className="text-[10px] text-white/40 font-mono">PREDICTION OPEN</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">El Clásico Tournament</h3>
                <p className="text-white/40 text-sm mb-6">Predict first card, goal & MVP to win 5,000 Seasonal XP.</p>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(j => (
                      <img key={j} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${j * 10}`} className="w-8 h-8 rounded-full border-2 border-black" alt="" />
                    ))}
                  </div>
                  <span className="text-[10px] text-[#00ff00] font-mono">+12.4k ENTERED</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar stats/missions */}
        <div className="space-y-6">
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 space-y-6">
            <h3 className="text-white text-lg font-black italic flex items-center gap-2 uppercase tracking-tighter">
              <Medal className="text-[#00ff00] w-6 h-6" /> Daily Missions
            </h3>
            <div className="space-y-5">
              {missions.map((m, i) => (
                <div key={i} className="flex items-center gap-4 group cursor-pointer">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300",
                    m.complete ? "bg-[#00ff00]/20 text-[#00ff00] border border-[#00ff00]/30" : "bg-white/5 text-white/40 group-hover:bg-white/10 border border-white/5"
                  )}>
                    <m.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className={cn("text-sm font-bold", m.complete ? "text-white/60 line-through" : "text-white")}>{m.title}</p>
                    <p className="text-[10px] text-[#00ff00] font-mono">{m.reward}</p>
                  </div>
                  {m.complete && <div className="w-2 h-2 rounded-full bg-[#00ff00] shadow-[0_0_10px_rgba(0,255,0,0.8)]" />}
                </div>
              ))}
            </div>
            <button className="w-full py-4 border border-[#00ff00]/20 rounded-2xl text-[#00ff00] text-xs font-black italic hover:bg-[#00ff00]/10 transition-all uppercase tracking-widest">
              VIEW BATTLE PASS
            </button>
          </div>

          <div className="relative overflow-hidden bg-gradient-to-br from-[#00ff00]/20 via-black to-black backdrop-blur-xl border border-[#00ff00]/30 rounded-[2rem] p-8 shadow-[0_0_40px_rgba(0,255,0,0.1)]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ff00]/10 blur-3xl rounded-full" />
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-black italic text-lg tracking-tighter">AI CORTEX</h3>
              <div className="px-2 py-1 bg-[#00ff00] text-black text-[10px] font-black rounded flex items-center gap-1 uppercase">
                <Zap className="w-3 h-3 fill-current" /> Neural Link
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                <p className="text-white/80 text-sm leading-relaxed italic">
                  "{aiInsight}"
                </p>
              </div>
              {trivia && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 bg-[#00ff00]/5 border border-[#00ff00]/20 rounded-2xl"
                >
                  <p className="text-[10px] font-mono text-[#00ff00] mb-2">NEURAL TRIVIA CHALLENGE</p>
                  <p className="text-xs text-white/90">{trivia.question}</p>
                </motion.div>
              )}
              <div className="flex items-center gap-3">
                <div className="flex h-3 gap-1">
                  <motion.div animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1 bg-[#00ff00]" />
                  <motion.div animate={{ height: [8, 4, 8] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1 bg-[#00ff00]" />
                  <motion.div animate={{ height: [4, 10, 4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1 bg-[#00ff00]" />
                </div>
                <span className="text-[10px] text-[#00ff00] font-mono uppercase tracking-[0.2em] animate-pulse">Syncing Tactical Data...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView setActiveTab={setActiveTab} />;
      case 'matches': return <MatchArena />;
      case 'chat': return <ChatView />;
      case 'community': return <Clubs />;
      case 'leaderboard': return <Leaderboard />;
      case 'profile': return <Profile />;
      default: return <DashboardView setActiveTab={setActiveTab} />;
    }
  };

  return (
    <FirebaseProvider>
      <div className="min-h-screen bg-black text-white font-sans selection:bg-[#00ff00] selection:text-black">
        <Background />
        
        <AnimatePresence>
          {showSplash && (
            <motion.div 
              key="splash"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-8"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 12 }}
                className="w-32 h-32 rounded-[2.5rem] bg-[#00ff00] flex items-center justify-center shadow-[0_0_80px_rgba(0,255,0,0.4)] mb-8"
              >
                <Zap className="text-black w-16 h-16 fill-current" />
              </motion.div>
              <div className="text-center">
                <motion.h1 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-6xl font-black tracking-tighter italic"
                >
                  FAN<span className="text-[#00ff00]">PULSE</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  transition={{ delay: 0.4 }}
                  className="text-xs font-mono tracking-[0.5em] mt-4 uppercase"
                >
                  Neural Football Ecosystem
                </motion.p>
              </div>
              <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="w-48 h-0.5 bg-[#00ff00] mt-12 rounded-full shadow-[0_0_10px_#00ff00]"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <Header />
        
        <main className="relative z-10 transition-all duration-500 overflow-hidden min-h-screen">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -10 }}
              transition={{ duration: 0.4, ease: "circOut" }}
              className="w-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>

        <Nav activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Global FX Overlay */}
        <div className="fixed inset-0 pointer-events-none z-20">
          <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-[#00ff00]/5 to-transparent" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
        </div>
      </div>
    </FirebaseProvider>
  );
}

