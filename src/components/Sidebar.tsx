import * as React from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Target, 
  BarChart3, 
  Receipt, 
  Calendar, 
  History, 
  MessageSquare, 
  Settings,
  LogOut,
  ChevronRight,
  Settings2,
  Zap,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
  collapsed?: boolean;
}

const SidebarItem = ({ icon: Icon, label, active, onClick, collapsed }: SidebarItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center w-full p-3.5 rounded-xl transition-all duration-300 group relative",
      active 
        ? "bg-primary/10 text-primary shadow-[inset_0_0_12px_rgba(226,176,94,0.05)]" 
        : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
    )}
  >
    {active && (
      <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full shadow-[0_0_12px_rgba(226,176,94,0.5)]" />
    )}
    <Icon className={cn("w-5 h-5 shrink-0 transition-transform duration-300", active ? "text-primary scale-110" : "group-hover:text-foreground group-hover:scale-110")} />
    {!collapsed && (
      <span className={cn(
        "ml-3 font-semibold text-sm tracking-tight transition-all duration-300",
        active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
      )}>
        {label}
      </span>
    )}
    {active && !collapsed && <ChevronRight className="ml-auto w-4 h-4 opacity-50" />}
  </button>
);

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  isMobile?: boolean;
}

export const Sidebar = ({ activeTab, setActiveTab, onLogout, isMobile }: SidebarProps) => {
  const [collapsed, setCollapsed] = React.useState(false);

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'operations', icon: TrendingUp, label: 'Operações' },
    { id: 'goals', icon: Target, label: 'Metas' },
    { id: 'progression', icon: BarChart3, label: 'Progressão' },
    { id: 'invoices', icon: Receipt, label: 'Notas' },
    { id: 'calendar', icon: Calendar, label: 'Agenda' },
    { id: 'instruments', icon: Settings2, label: 'Ativos' },
    { id: 'history', icon: History, label: 'Histórico' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'ai', icon: MessageSquare, label: 'Agente IA' },
  ];

  return (
    <aside 
      className={cn(
        "h-full bg-[#080a0f] border-r border-white/5 flex flex-col transition-all duration-500 relative z-50",
        isMobile ? "w-full border-none" : (collapsed ? "w-20" : "w-72 fixed left-0 top-0 bottom-0")
      )}
    >
      <div className={cn("p-8 flex items-center justify-between", isMobile && "pb-4")}>
        <div className="flex items-center gap-4">
          {/* LOGO PLACEHOLDER: Replace Zap icon with actual logo when available */}
          {/* To use logo: import logo from '../assets/brand/logo.svg' and replace the icon */}
          <div className="w-10 h-10 rounded-xl premium-gradient flex items-center justify-center shadow-2xl shadow-primary/30 rotate-3 hover:rotate-0 transition-transform duration-500 cursor-pointer" onClick={() => !isMobile && setCollapsed(!collapsed)}>
            <Zap className="w-6 h-6 text-black" />
          </div>
          {/* LOGO PLACEHOLDER: Replace div above with: <img src={logo} alt="LIFE Trade" className="w-10 h-10 rounded-xl hover:rotate-0 transition-transform duration-500 cursor-pointer" /> */}
          {(!collapsed || isMobile) && (
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tighter premium-text font-display">LIFE</span>
              <span className="text-[10px] font-bold text-primary tracking-[0.3em] -mt-1 uppercase">Trade</span>
            </div>
          )}
        </div>
        {!isMobile ? (
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-xl hover:bg-white/5 transition-colors text-muted-foreground"
          >
            <ChevronRight className={cn("w-5 h-5 transition-transform duration-500", collapsed ? "rotate-0" : "rotate-180")} />
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Premium</span>
            </div>
          </div>
        )}
      </div>

      <nav className="flex-1 px-4 space-y-1.5 mt-6 overflow-y-auto hide-scrollbar">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={activeTab === item.id}
            onClick={() => setActiveTab(item.id)}
            collapsed={collapsed}
          />
        ))}
      </nav>

      <div className={cn("p-4 mt-auto border-t border-white/5 space-y-2", isMobile && "pb-8")}>
        <SidebarItem
          icon={Settings}
          label="Configurações"
          active={activeTab === 'settings'}
          onClick={() => setActiveTab('settings')}
          collapsed={collapsed}
        />
        <SidebarItem
          icon={LogOut}
          label="Sair"
          onClick={onLogout}
          collapsed={collapsed}
        />
      </div>
    </aside>
  );
};
