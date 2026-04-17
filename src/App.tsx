import * as React from 'react';
import { Layout } from './components/Layout';
import { Login } from './features/Login';
import { useAuth } from './hooks/useAuth';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/src/lib/utils';

// Lazy load all features for optimal bootstrap performance
const Dashboard = React.lazy(() => import('./features/Dashboard').then(m => ({ default: m.Dashboard })));
const Operations = React.lazy(() => import('./features/Operations').then(m => ({ default: m.Operations })));
const Goals = React.lazy(() => import('./features/Goals').then(m => ({ default: m.Goals })));
const Progression = React.lazy(() => import('./features/Progression').then(m => ({ default: m.Progression })));
const Invoices = React.lazy(() => import('./features/Invoices').then(m => ({ default: m.Invoices })));
const Calendar = React.lazy(() => import('./features/Calendar').then(m => ({ default: m.Calendar })));
const Analytics = React.lazy(() => import('./features/Analytics').then(m => ({ default: m.Analytics })));
const Instruments = React.lazy(() => import('./features/Instruments').then(m => ({ default: m.Instruments })));
const AIAgent = React.lazy(() => import('./features/AIAgent').then(m => ({ default: m.AIAgent })));
const Settings = React.lazy(() => import('./features/Settings').then(m => ({ default: m.Settings })));

const LoadingFallback = () => (
  <div className="w-full h-[60vh] flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] animate-pulse">Carregando Módulo...</p>
    </div>
  </div>
);

export default function App() {
  const { user, isLoading, loginWithGoogle, logout } = useAuth();
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [isPending, startTransition] = React.useTransition();

  const handleTabChange = React.useCallback((tab: string) => {
    startTransition(() => {
      setActiveTab(tab);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={loginWithGoogle} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard onNavigate={handleTabChange} />;
      case 'operations': return <Operations onNavigate={handleTabChange} />;
      case 'goals': return <Goals />;
      case 'progression': return <Progression />;
      case 'invoices': return <Invoices />;
      case 'calendar': return <Calendar />;
      case 'instruments': return <Instruments />;
      case 'history': return <Operations />; // Reusing Operations for now
      case 'analytics': return <Analytics />;
      case 'ai': return <AIAgent onNavigate={handleTabChange} />;
      case 'settings': return <Settings user={user} onLogout={logout} onNavigate={handleTabChange} />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={handleTabChange} 
      user={user} 
      onLogout={logout}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isPending ? 0.7 : 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={cn("w-full transition-opacity duration-200", isPending && "pointer-events-none")}
        >
          <React.Suspense fallback={<LoadingFallback />}>
            {renderContent()}
          </React.Suspense>
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}
