import * as React from 'react';
import { 
  LayoutDashboard, 
  History, 
  BarChart3, 
  MessageSquare, 
  PlusCircle 
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion } from 'framer-motion';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav = ({ activeTab, setActiveTab }: BottomNavProps) => {
  const items = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'operations', label: 'Trades', icon: History },
    { id: 'add', label: 'Novo', icon: PlusCircle, isAction: true },
    { id: 'analytics', label: 'Stats', icon: BarChart3 },
    { id: 'ai', label: 'LIFE IA', icon: MessageSquare },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#080a0f]/90 backdrop-blur-3xl border-t border-white/5 px-4 py-3 flex items-center justify-around z-50 md:hidden pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        if (item.isAction) {
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab('operations')} // For now, navigate to operations where the add button is
              className="relative -top-6 flex flex-col items-center group"
            >
              <div className="w-14 h-14 rounded-2xl premium-gradient flex items-center justify-center shadow-[0_10px_30px_rgba(226,176,94,0.4)] border-4 border-[#080a0f] group-active:scale-90 transition-all duration-300 rotate-45 group-hover:rotate-0">
                <Icon className="w-7 h-7 text-black -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
              </div>
              <span className="text-[9px] font-bold text-primary mt-2 uppercase tracking-[0.2em]">
                {item.label}
              </span>
            </button>
          );
        }

        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "flex flex-col items-center gap-1.5 transition-all duration-300 relative py-1",
              isActive ? "text-primary" : "text-muted-foreground/60 hover:text-foreground"
            )}
          >
            <div className={cn(
              "p-2 rounded-xl transition-all duration-500",
              isActive ? "bg-primary/10 shadow-[0_0_15px_rgba(226,176,94,0.1)]" : "bg-transparent"
            )}>
              <Icon className={cn("w-5 h-5 transition-all duration-300", isActive ? "scale-110" : "group-hover:scale-110")} />
            </div>
            <span className={cn(
              "text-[9px] font-bold uppercase tracking-[0.15em] transition-all duration-300",
              isActive ? "opacity-100" : "opacity-60"
            )}>
              {item.label}
            </span>
            {isActive && (
              <motion.div 
                layoutId="bottomNavDot"
                className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_rgba(226,176,94,0.8)]" 
              />
            )}
          </button>
        );
      })}
    </nav>
  );
};
