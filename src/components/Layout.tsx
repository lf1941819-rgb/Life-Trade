import * as React from 'react';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { cn } from '@/src/lib/utils';
import { Bell, User, Search, Menu, X, ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: any;
  onLogout: () => void;
}

export const Layout = ({ children, activeTab, setActiveTab, user, onLogout }: LayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);

  // Mock notifications since a real system isn't implemented
  const notifications = [
    { id: 1, title: 'Meta Diária Atingida', description: 'Parabéns! Você alcançou sua meta de 2000 pontos hoje.', time: '1h atrás', type: 'success' },
    { id: 2, title: 'Novo Instrumento Disponível', description: 'O par BTCUSD agora está disponível para operações.', time: '3h atrás', type: 'info' },
    { id: 3, title: 'Relatório Semanal Pronto', description: 'Seu resumo de performance institucional foi gerado.', time: '1 dia atrás', type: 'info' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row overflow-x-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-[#080a0f] z-[70] md:hidden border-r border-white/5"
            >
              <Sidebar 
                activeTab={activeTab} 
                setActiveTab={(tab) => {
                  setActiveTab(tab);
                  setIsSidebarOpen(false);
                }} 
                onLogout={onLogout}
                isMobile
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      <main className={cn(
        "flex-1 transition-all duration-500 min-h-screen flex flex-col pb-20 md:pb-0",
        "md:ml-72"
      )}>
        {/* Header */}
        <header className="h-16 md:h-20 border-b border-white/5 flex items-center justify-between px-4 md:px-10 sticky top-0 bg-background/40 backdrop-blur-2xl z-40">
          <div className="flex items-center gap-3 md:gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-xl bg-white/5 border border-white/10 md:hidden"
            >
              <Menu className="w-5 h-5 text-primary" />
            </button>
            <div className="hidden md:flex items-center gap-4 bg-white/5 px-5 py-2.5 rounded-2xl border border-white/5 w-[400px] focus-within:border-primary/30 transition-all duration-300">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Pesquisar ativos, trades ou análises..." 
                className="bg-transparent border-none outline-none text-sm w-full text-foreground placeholder:text-muted-foreground font-medium"
              />
            </div>
            <div className="md:hidden">
              <h2 className="text-lg font-bold premium-text font-display uppercase tracking-tight">
                {activeTab === 'dashboard' ? 'Dashboard' : 
                 activeTab === 'operations' ? 'Operações' :
                 activeTab === 'analytics' ? 'Analytics' :
                 activeTab === 'ai' ? 'Agente IA' : 'LIFE Trade'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-8 relative">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={cn(
                  "relative p-2 md:p-2.5 rounded-xl transition-all duration-300 group hover:bg-white/5",
                  showNotifications && "bg-white/10"
                )}
              >
                <Bell className={cn("w-5 h-5 transition-colors", showNotifications ? "text-primary" : "text-muted-foreground group-hover:text-primary")} />
                {!showNotifications && <span className="absolute top-2 md:top-2.5 right-2 md:right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-background shadow-[0_0_8px_rgba(226,176,94,0.5)]"></span>}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <>
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowNotifications(false)}
                      className="fixed inset-0 z-40"
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-4 w-80 md:w-96 bg-[#0c0f16] border border-white/10 rounded-3xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl"
                    >
                      <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
                        <h4 className="text-sm font-bold premium-text uppercase tracking-widest">Notificações</h4>
                        <button onClick={() => setShowNotifications(false)} className="text-muted-foreground hover:text-white transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="max-h-[400px] overflow-y-auto">
                        {notifications.map((notif) => (
                          <div key={notif.id} className="p-5 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
                            <div className="flex gap-4">
                              <div className={cn(
                                "w-2 h-2 rounded-full mt-1.5 shrink-0",
                                notif.type === 'success' ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-primary shadow-[0_0_8px_rgba(226,176,94,0.5)]"
                              )} />
                              <div className="space-y-1">
                                <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">{notif.title}</p>
                                <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">{notif.description}</p>
                                <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest pt-1">{notif.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-4 bg-white/5 flex justify-center">
                        <button className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] hover:opacity-80 transition-opacity">Ver todas as notificações</button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            
            <div className="flex items-center gap-3 md:gap-4 md:pl-8 md:border-l md:border-white/10">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold premium-text font-display">{user?.name || 'Trader'}</p>
                <p className="text-[10px] font-bold text-primary tracking-widest uppercase">Premium</p>
              </div>
              <button 
                onClick={() => setActiveTab('settings')}
                className="w-9 h-9 md:w-11 md:h-11 rounded-xl md:rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-lg shadow-primary/5 hover:scale-105 transition-transform duration-300 cursor-pointer overflow-hidden p-0"
              >
                {user?.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt="Perfil" 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = ''; // Clear source to show fallback
                    }}
                  />
                ) : (
                  <User className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                )}
              </button>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-10 flex-1 max-w-[1600px] mx-auto w-full">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};
