import React, { useState, useEffect } from 'react';
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
  Star,
  Activity,
  UserPlus
} from 'lucide-react';
import { FirebaseProvider, useAuth, db, handleFirestoreError, OperationType, ChatRoom, ChatMessage } from '../lib/firebase';

// ... (skipping to the end of the file to restore Profile and fix the ChatView imports indirectly)

import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp, where, doc, updateDoc } from 'firebase/firestore';
import { cn } from '../lib/utils';
import { Background } from './Common';
import { fetchAITrivia, fetchTacticalAnalysis } from '../lib/aiService';

// --- Sub-components ---

const TacticalPopup = ({ analysis, onClose }: { analysis: any, onClose: () => void }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    className="fixed bottom-32 left-1/2 -translate-x-1/2 lg:left-auto lg:right-8 z-[70] w-80 bg-black/80 backdrop-blur-2xl border border-[#00ff00]/40 rounded-3xl p-6 shadow-[0_0_50px_rgba(0,255,0,0.2)]"
  >
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Zap className="text-[#00ff00] w-5 h-5 fill-current" />
        <span className="font-black italic text-sm text-[#00ff00]">NEURAL TACTICAL LINK</span>
      </div>
      <button onClick={onClose} className="text-white/40 hover:text-white">✕</button>
    </div>
    <div className="space-y-4">
      <p className="text-sm text-white/90 leading-relaxed italic">"{analysis.summary}"</p>
      <div className="p-3 bg-[#00ff00]/10 rounded-xl border border-[#00ff00]/20">
        <p className="text-[10px] font-mono text-[#00ff00] uppercase mb-1">AI Recommendation</p>
        <p className="text-xs text-white/80">{analysis.tacticalChange}</p>
      </div>
    </div>
  </motion.div>
);

const StatCard = ({ label, value, icon: Icon, color }: any) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
    <div className={cn("p-3 rounded-xl", color)}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-white/40 text-[10px] font-mono uppercase tracking-widest">{label}</p>
      <p className="text-xl font-black text-white">{value}</p>
    </div>
  </div>
);

export const WatchParty = ({ match, onClose }: { match: any, onClose: () => void }) => {
  const [messages, setMessages] = useState([
    { user: 'Theo_G', text: 'LETS GOOOO!', xp: 120 },
    { user: 'Sarah_Fan', text: 'Barca defense sleeping group', xp: 450 },
    { user: 'AI_BOT', text: 'Momentum shift: +12% towards Real Madrid', xp: null }
  ]);
  const [analysis, setAnalysis] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const runAnalysis = async () => {
    setAnalyzing(true);
    try {
      const data = await fetchTacticalAnalysis(match);
      setAnalysis(data);
    } catch (e) {
      setAnalysis({
        summary: "The defending line has dropped 15% deeper. Exploiting the channels with a pace-based sub is the optimal move.",
        tacticalChange: "Increase long-ball frequency to exploit the high defensive line.",
        hypeRating: 9.2
      });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 md:p-12"
    >
      <AnimatePresence>
        {analysis && <TacticalPopup analysis={analysis} onClose={() => setAnalysis(null)} />}
      </AnimatePresence>

      <div className="w-full h-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-hidden">
        {/* Live Stream / Visualizer */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] flex-1 flex flex-col items-center justify-center relative overflow-hidden">
            <Background />
            <div className="relative z-10 text-center space-y-6">
              <div className="flex items-center gap-12">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full bg-[#00ff00]/20 flex items-center justify-center border border-[#00ff00]/40 mb-4">
                    <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${match.home}`} className="w-16 h-16" alt="" />
                  </div>
                  <p className="font-black italic text-xl">{match.home}</p>
                </div>
                <div className="text-center">
                  <h2 className="text-6xl font-black italic tracking-tighter">{match.score}</h2>
                  <p className="text-[#00ff00] font-mono text-xs mt-2 uppercase">{match.time}</p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center border border-white/10 mb-4">
                    <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${match.away}`} className="w-16 h-16" alt="" />
                  </div>
                  <p className="font-black italic text-xl">{match.away}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="px-4 py-2 bg-black/60 rounded-full text-xs font-bold border border-white/10 lowercase"><span className="uppercase">102k</span> viewing</span>
                <span className="px-4 py-2 bg-[#00ff00]/20 text-[#00ff00] rounded-full text-xs font-bold border border-[#00ff00]/30 animate-pulse">CROWD WAVE ACTIVATED</span>
              </div>
            </div>
          </div>

          <div className="h-32 flex gap-4">
            <button 
              onClick={runAnalysis}
              disabled={analyzing}
              className="flex-1 bg-white/5 border border-[#00ff00]/20 rounded-3xl flex flex-col items-center justify-center hover:bg-[#00ff00]/5 transition-all overflow-hidden relative"
            >
              <div className={cn("flex flex-col items-center justify-center transition-transform", analyzing ? "translate-y-12" : "")}>
                <Zap className="text-[#00ff00] mb-2 fill-current" />
                <span className="text-[10px] font-black italic">NEURAL SYNC</span>
              </div>
              {analyzing && (
                <div className="absolute inset-0 flex items-center justify-center pt-2">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-6 h-6 border-2 border-[#00ff00] border-t-transparent rounded-full" />
                </div>
              )}
            </button>
            <button className="flex-1 bg-white/5 border border-white/10 rounded-3xl flex flex-col items-center justify-center hover:bg-white/10 transition-colors">
              <Trophy className="text-yellow-500 mb-2" />
              <span className="text-[10px] font-black italic">VOTE MVP</span>
            </button>
          </div>
        </div>

        {/* Chat / Social */}
        <div className="bg-black/40 border border-white/10 rounded-[2.5rem] flex flex-col p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black italic tracking-tighter uppercase">Match Chatter</h3>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/40 hover:text-white">
              <Search className="rotate-45" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2">
            {messages.map((m, i) => (
              <div key={i} className="flex gap-3 animate-in slide-in-from-bottom-2 duration-300">
                <img src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${m.user}`} className="w-8 h-8 rounded-full" alt="" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-white/60">{m.user}</span>
                    {m.xp && <span className="text-[8px] bg-white/10 px-1 rounded text-[#00ff00]">Lvl {Math.floor(m.xp/100)}</span>}
                  </div>
                  <p className="text-sm text-white/90 leading-relaxed bg-white/5 rounded-2xl p-3 inline-block">
                    {m.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="relative">
            <input 
              type="text" 
              placeholder="React to the match..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-[#00ff00]/50 transition-colors"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[#00ff00] hover:scale-110 transition-transform">
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const MatchArena = () => {
  const { user, updateXP } = useAuth();
  const [matches, setMatches] = useState<any[]>([]);
  const [activeWatchParty, setActiveWatchParty] = useState<any>(null);

  useEffect(() => {
    // Mocking real-time subscription
    const mockMatches = [
      { id: '1', home: 'Barcelona', away: 'Real Madrid', score: '2-1', time: "78'", hype: 94, energy: 88 },
      { id: '2', home: 'Man City', away: 'Arsenal', score: '0-0', time: "12'", hype: 72, energy: 65 },
    ];
    setMatches(mockMatches);
  }, []);

  const handlePredict = async (matchId: string) => {
    if (!user) return;
    await updateXP(150);
    alert("Prediction Locked! +150 XP Earned.");
  };

  return (
    <div className="w-full max-w-7xl mx-auto pt-24 pb-32 px-8 space-y-8">
      <AnimatePresence>
        {activeWatchParty && (
          <WatchParty match={activeWatchParty} onClose={() => setActiveWatchParty(null)} />
        )}
      </AnimatePresence>
      
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black italic text-white flex items-center gap-3">
          <Activity className="text-[#00ff00] w-8 h-8" /> LIVE MATCH ARENA
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map(i => (
              <img key={i} src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${i * 123}`} className="w-8 h-8 rounded-full border-2 border-black" alt="" />
            ))}
          </div>
          <p className="text-xs text-white/60 font-mono italic">342k FANS ACTIVE</p>
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {matches.map((match) => (
          <motion.div 
            key={match.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden"
          >
            <div className="p-8 space-y-8">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono text-white/60 tracking-widest">
                  UEFA CHAMPIONS LEAGUE
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-bold text-red-500">{match.time}</span>
                </div>
              </div>

              <div className="flex items-center justify-between px-4">
                <div className="text-center space-y-3">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                    <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${match.home}`} className="w-12 h-12" alt="" />
                  </div>
                  <h3 className="font-bold text-lg">{match.home}</h3>
                </div>
                <div className="text-center">
                  <h2 className="text-5xl font-black italic tracking-tighter mb-2">{match.score}</h2>
                  <div className="px-3 py-1 bg-[#00ff00]/20 rounded-full text-[10px] font-bold text-[#00ff00]">PEAK MOMENTUM</div>
                </div>
                <div className="text-center space-y-3">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                    <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${match.away}`} className="w-12 h-12" alt="" />
                  </div>
                  <h3 className="font-bold text-lg">{match.away}</h3>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-white/40 font-mono uppercase tracking-widest">Hype Meter</span>
                    <span className="text-[#00ff00] text-xs font-bold">{match.hype}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${match.hype}%` }}
                      className="h-full bg-[#00ff00] shadow-[0_0_10px_rgba(0,255,0,0.5)]"
                    />
                  </div>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-white/40 font-mono uppercase tracking-widest">Crowd Energy</span>
                    <span className="text-orange-500 text-xs font-bold">{match.energy}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${match.energy}%` }}
                      className="h-full bg-orange-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => handlePredict(match.id)}
                  className="flex-1 py-4 bg-[#00ff00] text-black font-black italic rounded-2xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                >
                  <Target className="w-5 h-5" /> PREDICT NEXT GOAL
                </button>
                <button 
                  onClick={() => setActiveWatchParty(match)}
                  className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <Users className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};


export const Clubs = () => {
  return (
    <div className="w-full max-w-7xl mx-auto pt-24 pb-32 px-8 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black italic text-white flex items-center gap-3">
          <Users className="text-[#00ff00] w-8 h-8" /> FAN CLUBS
        </h2>
        <button className="px-6 py-2 border border-[#00ff00] text-[#00ff00] font-bold rounded-full hover:bg-[#00ff00]/10 transition-colors">
          CREATE CLUB
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {['LA MASIA ULTRAS', 'CITIZENS HUB', 'MERENGUE ARENA'].map((club, i) => (
          <div key={i} className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 group cursor-pointer hover:border-[#00ff00]/50 transition-colors">
            <div className="w-20 h-20 bg-gradient-to-br from-[#00ff00] to-green-800 rounded-2xl mb-6 flex items-center justify-center text-3xl font-black text-black">
              {club[0]}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{club}</h3>
            <div className="flex items-center gap-4 text-xs font-mono text-white/40 mb-6">
              <span className="flex items-center gap-1"><Users className="w-3 h-3" /> 12.4k</span>
              <span className="flex items-center gap-1"><Star className="w-3 h-3 text-[#00ff00]" /> LVL 42</span>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-white/40">CLUB MISSION</span>
                <span className="text-[#00ff00]">74%</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-[#00ff00] w-[74%]" />
              </div>
            </div>
            <button className="w-full mt-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold transition-colors">
              ENTER CLUBHOUSE
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Leaderboard = () => {
  const ranks = [
    { name: 'Bronze', color: 'bg-orange-900', text: 'text-orange-400' },
    { name: 'Silver', color: 'bg-gray-700', text: 'text-gray-300' },
    { name: 'Gold', color: 'bg-yellow-600', text: 'text-yellow-400' },
    { name: 'Platinum', color: 'bg-blue-600', text: 'text-blue-200' },
    { name: 'Elite', color: 'bg-[#00ff00] shadow-[0_0_15px_rgba(0,255,0,0.5)]', text: 'text-black font-bold' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto pt-24 pb-32 px-8 space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-black italic tracking-tighter">THE ULTIMATE FAN RANKING</h2>
        <p className="text-white/60 max-w-xl mx-auto">Compete globally. Prove your tactical mastery. Ascend to Legendary status.</p>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {ranks.map((r, i) => (
          <div key={i} className="flex flex-col items-center gap-4">
            <div className={cn("w-full h-2 rounded-full", r.color)} />
            <span className={cn("text-xs font-mono tracking-widest", r.text)}>{r.name.toUpperCase()}</span>
          </div>
        ))}
      </div>

      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
        {[1, 2, 3, 4, 5, 6, 7].map((j) => (
          <div key={j} className="flex items-center gap-6 px-8 py-6 border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer">
            <span className="text-2xl font-black italic text-white/20 group-hover:text-[#00ff00] transition-colors w-10">#{j}</span>
            <img src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${j * 999}`} className="w-12 h-12 rounded-full border border-white/10" alt="" />
            <div className="flex-1">
              <h4 className="font-bold text-white">FanPro_Alpha_{j}</h4>
              <p className="text-[10px] font-mono text-white/40 uppercase">Platinum League</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-black text-white italic">4,520 XP</p>
              <p className="text-[10px] font-mono text-[#00ff00]">89% ACCURACY</p>
            </div>
            <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const ChatView = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [activeRoom, setActiveRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'chatRooms'),
      where('participants', 'array-contains', user.uid),
      orderBy('updatedAt', 'desc')
    );

    // Also get public rooms
    const publicQ = query(
      collection(db, 'chatRooms'),
      where('type', '==', 'public'),
      limit(10)
    );

    const unsubRooms = onSnapshot(q, (snapshot) => {
      const roomList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatRoom));
      setRooms(prev => {
        const combined = [...roomList, ...prev.filter(p => p.type === 'public')];
        const unique = Array.from(new Map(combined.map(r => [r.id, r])).values());
        return unique;
      });
    });

    const unsubPublic = onSnapshot(publicQ, (snapshot) => {
      const publicList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatRoom));
      setRooms(prev => {
        const combined = [...prev, ...publicList];
        const unique = Array.from(new Map(combined.map(r => [r.id, r])).values());
        return unique;
      });
    });

    return () => {
      unsubRooms();
      unsubPublic();
    };
  }, [user]);

  useEffect(() => {
    if (!activeRoom) {
      setMessages([]);
      return;
    }

    const q = query(
      collection(db, 'chatRooms', activeRoom.id, 'messages'),
      orderBy('timestamp', 'asc'),
      limit(50)
    );

    return onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatMessage)));
    });
  }, [activeRoom]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !activeRoom || !newMessage.trim()) return;

    try {
      const msgData = {
        authorId: user.uid,
        authorName: user.displayName,
        authorPhoto: user.photoURL,
        text: newMessage,
        timestamp: serverTimestamp(),
        roomId: activeRoom.id
      };
      
      await addDoc(collection(db, 'chatRooms', activeRoom.id, 'messages'), msgData);
      await updateDoc(doc(db, 'chatRooms', activeRoom.id), {
        lastMessage: newMessage,
        updatedAt: serverTimestamp()
      });
      setNewMessage('');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `chatRooms/${activeRoom.id}/messages`);
    }
  };

  const createPrivateRoom = async (friendId: string, friendName: string) => {
    if (!user) return;
    try {
      const roomData = {
        type: 'private',
        name: `Chat with ${friendName}`,
        participants: [user.uid, friendId],
        updatedAt: serverTimestamp()
      };
      const docRef = await addDoc(collection(db, 'chatRooms'), roomData);
      setActiveRoom({ id: docRef.id, ...roomData } as ChatRoom);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'chatRooms');
    }
  };

  if (!user) {
    return (
      <div className="w-full max-w-7xl mx-auto pt-32 pb-32 px-8 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[3rem] p-12 text-center max-w-lg w-full space-y-8">
          <MessageSquare className="w-12 h-12 text-[#00ff00] mx-auto" />
          <h2 className="text-3xl font-black italic">CHATS ENCRYPTED</h2>
          <p className="text-white/40">Sign in to join communities and chat with other fans.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto pt-24 pb-32 px-8 h-[calc(100vh-140px)] flex gap-8">
      {/* Sidebar - Rooms */}
      <div className="w-80 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h3 className="font-black italic tracking-tighter text-xl uppercase">Fan Channels</h3>
          <button className="p-2 hover:bg-white/5 rounded-lg text-[#00ff00]">
            <Search className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          {rooms.map(room => (
            <button
              key={room.id}
              onClick={() => setActiveRoom(room)}
              className={cn(
                "w-full p-4 rounded-2xl flex items-center gap-4 transition-all border",
                activeRoom?.id === room.id 
                  ? "bg-[#00ff00]/10 border-[#00ff00]/30 shadow-[0_0_20px_rgba(0,255,0,0.1)]" 
                  : "bg-white/5 border-white/5 hover:bg-white/10"
              )}
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                {room.type === 'public' ? <Users className="w-6 h-6 text-[#00ff00]" /> : <Medal className="w-6 h-6 text-orange-500" />}
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-bold text-white truncate">{room.name}</p>
                <p className="text-[10px] text-white/40 truncate font-mono uppercase">
                  {room.type === 'public' ? 'OPEN WORLD' : 'NEURAL LINK'}
                </p>
              </div>
            </button>
          ))}
          
          {/* Example Friend shortcut */}
          <div className="pt-6 border-t border-white/10 space-y-4">
            <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest px-4">Direct Links</p>
            <button 
              onClick={() => createPrivateRoom('guest-001', 'Theo_G')}
              className="w-full p-3 rounded-xl flex items-center gap-3 hover:bg-white/5 text-white/60 hover:text-white transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-orange-500/20" />
              <span className="text-sm font-medium">Theo_G</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 bg-black/40 border border-white/10 rounded-[2.5rem] backdrop-blur-xl flex flex-col overflow-hidden relative">
        {!activeRoom ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-6 opacity-40">
            <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#00ff00] animate-[spin_10s_linear_infinite] flex items-center justify-center">
              <Zap className="w-10 h-10 text-[#00ff00]" />
            </div>
            <p className="font-mono text-xs tracking-[0.3em] uppercase">Select a neural frequency to begin</p>
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div className="px-8 py-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <h4 className="text-xl font-black italic tracking-tighter uppercase">{activeRoom.name}</h4>
                <p className="text-[10px] font-mono text-[#00ff00] uppercase tracking-widest">
                  {activeRoom.participants?.length || 0} FANS CONNECTED
                </p>
              </div>
              <button className="p-3 hover:bg-white/5 rounded-xl transition-colors">
                <Settings className="w-5 h-5 text-white/40" />
              </button>
            </div>

            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
              {messages.map((msg, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id || i} 
                  className={cn(
                    "flex gap-4 max-w-[80%]",
                    msg.authorId === user.uid ? "ml-auto flex-row-reverse" : ""
                  )}
                >
                  <img src={msg.authorPhoto} className="w-10 h-10 rounded-xl border border-white/10 shrink-0" alt="" />
                  <div className={cn(
                    "space-y-1",
                    msg.authorId === user.uid ? "items-end" : "items-start"
                  )}>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-white/40">{msg.authorName}</span>
                      <span className="text-[8px] font-mono text-white/20">
                        {msg.timestamp?.toDate() ? new Date(msg.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'NOW'}
                      </span>
                    </div>
                    <div className={cn(
                      "px-4 py-3 rounded-2xl text-sm leading-relaxed",
                      msg.authorId === user.uid 
                        ? "bg-[#00ff00]/10 border border-[#00ff00]/20 text-white selection:bg-[#00ff00] selection:text-black" 
                        : "bg-white/5 border border-white/5 text-white/80"
                    )}>
                      {msg.text}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Chat input */}
            <form onSubmit={sendMessage} className="p-8 pt-0">
              <div className="relative group">
                <input 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  type="text" 
                  placeholder="Broadcast your thoughts..." 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 pr-16 text-sm focus:outline-none focus:border-[#00ff00]/50 transition-all focus:bg-white/10"
                />
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#00ff00] text-black rounded-xl flex items-center justify-center hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_15px_rgba(0,255,0,0.3)]"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export const Profile = () => {
  const { user, signIn, signOut } = useAuth();
  
  if (!user) {
    return (
      <div className="w-full max-w-7xl mx-auto pt-32 pb-32 px-8 flex flex-col items-center justify-center min-h-[70vh]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[3rem] p-12 text-center max-w-lg w-full space-y-8"
        >
          <div className="w-24 h-24 bg-[#00ff00]/10 rounded-3xl flex items-center justify-center mx-auto border border-[#00ff00]/30 shadow-[0_0_50px_rgba(0,255,0,0.1)]">
            <UserIcon className="w-12 h-12 text-[#00ff00]" />
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl font-black italic tracking-tighter">FAN ID LOCKED</h2>
            <p className="text-white/40 text-sm">Join the ecosystem to track your streaks, earn XP, and unlock legendary fan ranks.</p>
          </div>
          <button 
            onClick={signIn}
            className="w-full py-4 bg-[#00ff00] text-black font-black italic rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform shadow-[0_0_30px_rgba(0,255,0,0.3)]"
          >
            <Zap className="w-5 h-5 fill-current" /> INITIALIZE FAN ID
          </button>
          <div className="pt-4 flex items-center justify-center gap-4 text-[10px] font-mono text-white/20 uppercase tracking-widest">
            <span>Secure Neural Link</span>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <span>AI Verified</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto pt-24 pb-32 px-8 grid grid-cols-1 md:grid-cols-3 gap-12">
      <div className="md:col-span-1 space-y-8">
        <div className="relative group">
          <div className="absolute inset-0 bg-[#00ff00] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full" />
          <img src={user.photoURL} className="relative w-full aspect-square rounded-[3rem] object-cover border-2 border-[#00ff00]/30" alt="" />
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-8 py-3 bg-[#00ff00] text-black font-black italic rounded-full shadow-[0_10px_30px_rgba(0,255,0,0.4)] whitespace-nowrap">
            LEVEL {user.level} {user.rank.toUpperCase()}
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-white/40">XP PROGRESS</span>
              <span className="text-xs font-mono text-white">{user.xp % 1000} / 1000</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-[#00ff00]" style={{ width: `${(user.xp % 1000) / 10}%` }} />
            </div>
          </div>
          <button onClick={signOut} className="w-full py-4 border border-red-500/30 text-red-500 font-bold rounded-2xl hover:bg-red-500/10 transition-colors">
            LOGOUT
          </button>
        </div>
      </div>

      <div className="md:col-span-2 space-y-8">
        <div className="grid grid-cols-2 gap-4">
          <StatCard label="Prediction Streak" value={user.streakCount} icon={Flame} color="bg-orange-500/20" />
          <StatCard label="Fan Credits" value={user.credits} icon={Zap} color="bg-[#00ff00]/20" />
          <StatCard label="Matches Tracked" value="142" icon={Activity} color="bg-blue-500/20" />
          <StatCard label="Community Rep" value="Gold" icon={Star} color="bg-yellow-500/20" />
        </div>

        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
          <h3 className="text-xl font-bold italic mb-6 flex items-center gap-2">
            <Trophy className="text-[#00ff00] w-6 h-6" /> RECENT ACHIEVEMENTS
          </h3>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10 group cursor-pointer hover:border-[#00ff00]/50 transition-colors">
                <div className="w-12 h-12 bg-[#00ff00]/10 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-[#00ff00]" />
                </div>
                <span className="text-[10px] font-mono text-white/40 group-hover:text-white transition-colors">BULLSEYE</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

