import { cn } from '../lib/utils';

export const Background = () => (
  <div className="fixed inset-0 z-0 pointer-events-none">
    <div 
      className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
      style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&q=80&w=2000")' }}
    />
    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
    <div className="absolute bottom-0 left-0 w-full h-[50vh] bg-gradient-to-t from-[#00ff00]/10 to-transparent" />
  </div>
);

export const GlassCard = ({ children, className }: any) => (
  <div className={cn("bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6", className)}>
    {children}
  </div>
);

export const NeonButton = ({ children, onClick, className }: any) => (
  <button 
    onClick={onClick}
    className={cn(
      "px-6 py-2 bg-[#00ff00] text-black font-black italic rounded-xl hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,255,0,0.3)]",
      className
    )}
  >
    {children}
  </button>
);
