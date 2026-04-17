import * as React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  BarChart3, 
  Calendar, 
  AlertCircle, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  Zap,
  Activity,
  ShieldCheck,
  ChevronRight,
  Globe,
  MessageSquare,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/Card';
import { Badge } from '@/src/components/ui/Badge';
import { Button } from '@/src/components/ui/Button';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { formatCurrency, formatPoints, cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useOperations } from '@/src/hooks/useOperations';
import { useMediaQuery } from '@/src/hooks/useMediaQuery';
import { useEvents } from '@/src/hooks/useEvents';
import { useGoals } from '@/src/hooks/useGoals';
import { calculateSuggestedLot } from '@/src/lib/calculations/calculateSuggestedLot';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: { value: string; positive: boolean };
  icon: React.ElementType;
  className?: string;
  delay?: number;
}

const StatCard = React.memo(({ title, value, description, trend, icon: Icon, className, delay = 0 }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <Card className={cn("glass-card-hover group relative overflow-hidden border-white/5", className)}>
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-primary/10 transition-all duration-500"></div>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-300 group-hover:scale-110">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          {trend && (
            <div className={cn(
              "flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-full tracking-wider uppercase shadow-lg",
              trend.positive ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
            )}>
              {trend.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {trend.value}
            </div>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">{title}</p>
          <h3 className="text-3xl font-bold tracking-tight premium-text font-display">{value}</h3>
          {description && (
            <div className="flex items-center gap-2 mt-4">
              <div className="w-1.5 h-1.5 rounded-full bg-primary/40 shadow-[0_0_8px_rgba(226,176,94,0.3)]"></div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{description}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  </motion.div>
));

StatCard.displayName = 'StatCard';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-4 border-white/10 shadow-2xl backdrop-blur-xl">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2">{label}</p>
        <p className="text-lg font-bold text-primary font-display tracking-tight">
          {payload[0].value} <span className="text-[10px] text-muted-foreground ml-1 uppercase tracking-widest">PONTOS</span>
        </p>
      </div>
    );
  }
  return null;
};

export const Dashboard = ({ onNavigate }: { onNavigate?: (tab: string) => void }) => {
  const { operations } = useOperations();
  const { events } = useEvents();
  const { goals } = useGoals();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const stats = React.useMemo(() => {
    const totalPoints = operations.reduce((acc, op) => acc + op.points, 0);
    const totalMoney = operations.reduce((acc, op) => acc + (op.status !== 'PROFIT' ? op.moneyResult : 0), 0);
    const winRate = operations.length > 0 
      ? (operations.filter(op => op.status === 'GAIN').length / operations.filter(op => op.status !== 'PROFIT').length || 0) * 100 
      : 0;
    const currentLot = calculateSuggestedLot(operations.length);
    
    // Group by asset for performance chart
    const assetGroups = operations.reduce((acc: any, op) => {
      if (!acc[op.symbol]) acc[op.symbol] = { name: op.symbol, value: 0, count: 0, wins: 0 };
      acc[op.symbol].count++;
      if (op.status === 'GAIN') acc[op.symbol].wins++;
      return acc;
    }, {});

    const assetPerformance = Object.values(assetGroups).map((asset: any) => ({
      name: asset.name,
      value: Math.round((asset.wins / asset.count) * 100),
      color: asset.name.includes('USD') ? '#3b82f6' : asset.name.includes('XAU') ? '#e2b05e' : '#10b981'
    })).sort((a, b) => b.value - a.value).slice(0, 4);

    // Points evolution for chart
    const evolutionData = operations
      .slice()
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .reduce((acc: any[], op) => {
        const lastPoints = acc.length > 0 ? acc[acc.length - 1].points : 0;
        acc.push({
          name: op.date.split('-').slice(1).join('/'),
          points: lastPoints + op.points
        });
        return acc;
      }, [])
      .slice(-7);

    const dailyGoal = goals.find(g => g.period === 'Daily')?.pointsGoal || 2000;

    return { totalPoints, totalMoney, winRate, currentLot, assetPerformance, evolutionData, dailyGoal };
  }, [operations, goals]);

  const upcomingEvents = React.useMemo(() => {
    const now = new Date();
    return events
      .filter(e => new Date(e.date) >= now)
      .slice(0, 4);
  }, [events]);

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 md:mb-16">
        <div className="space-y-3">
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 w-fit px-4 py-1.5 rounded-full backdrop-blur-xl">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_12px_rgba(34,197,94,0.6)]"></div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">Live Institutional Feed</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter premium-text font-display">Visão Geral</h1>
          <p className="text-muted-foreground font-medium text-base md:text-lg max-w-2xl">Bem-vindo de volta, Trader. Sua performance hoje está <span className="text-primary font-bold">otimizada</span> com o novo motor de cálculo.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl backdrop-blur-xl shadow-xl w-full sm:w-auto">
            <div className="p-2 rounded-lg bg-primary/10">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Sessão Atual</span>
              <span className="text-sm font-bold text-foreground tracking-tight">LONDRES: <span className="text-green-500">ABERTA</span></span>
            </div>
          </div>
          <Button 
            variant="premium" 
            className="h-14 px-8 shadow-2xl shadow-primary/20 text-base font-bold w-full sm:w-auto"
            onClick={() => onNavigate?.('operations')}
          >
            <Zap className="w-5 h-5 mr-3 fill-current" />
            Nova Operação
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          title="Pontos Acumulados" 
          value={formatPoints(stats.totalPoints)} 
          description={`Meta diária: ${formatPoints(stats.dailyGoal)} pts`}
          trend={{ value: "Live", positive: true }}
          icon={Activity}
          delay={0.1}
        />
        <StatCard 
          title="Resultado Financeiro" 
          value={formatCurrency(stats.totalMoney)} 
          description={`Lote atual: ${stats.currentLot}`}
          trend={{ value: "+12%", positive: true }}
          icon={BarChart3}
          delay={0.2}
        />
        <StatCard 
          title="Progresso de Lote" 
          value={stats.currentLot.toFixed(2)} 
          description={`${operations.length % 10}/10 operações para o próximo nível`}
          icon={TrendingUp}
          delay={0.3}
        />
        <StatCard 
          title="Taxa de Acerto" 
          value={`${Math.round(stats.winRate)}%`} 
          description={`Base: ${operations.length} trades`}
          trend={{ value: stats.winRate > 50 ? "Alta" : "Em ajuste", positive: stats.winRate > 50 }}
          icon={Target}
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <Card className="lg:col-span-2 glass-card border-white/5 overflow-hidden">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 md:pb-10 p-6 md:p-8 border-b border-white/5 bg-white/5">
            <div>
              <CardTitle className="text-xl md:text-2xl font-display tracking-tight">Evolução de Pontos</CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest mt-1">Desempenho acumulado das últimas operações</CardDescription>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_10px_rgba(226,176,94,0.5)]"></div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Pontos Acumulados</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 md:p-8 min-w-0">
            <div className="h-[250px] md:h-[380px] w-full min-h-[250px] min-w-0">
              {isMounted && (
                <ResponsiveContainer width="100%" height="100%" debounce={100}>
                  <AreaChart data={stats.evolutionData.length > 0 ? stats.evolutionData : [{ name: 'N/A', points: 0 }]}>
                    <defs>
                      <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#e2b05e" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#e2b05e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} 
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="points" 
                      stroke="#e2b05e" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorPoints)" 
                      animationDuration={2500}
                      strokeLinecap="round"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/5 overflow-hidden">
          <CardHeader className="pb-6 md:pb-10 p-6 md:p-8 border-b border-white/5 bg-white/5">
            <CardTitle className="text-xl md:text-2xl font-display tracking-tight">Performance por Ativo</CardTitle>
            <CardDescription className="text-[10px] md:text-xs font-bold uppercase tracking-widest">Volume de acerto por símbolo</CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8 min-w-0">
            <div className="h-[200px] md:h-[280px] w-full min-h-[200px] min-w-0">
              {isMounted && (
                <ResponsiveContainer width="100%" height="100%" debounce={100}>
                  <BarChart data={stats.assetPerformance.length > 0 ? stats.assetPerformance : [{ name: 'N/A', value: 0, color: '#3b82f6' }]} layout="vertical" margin={{ left: -20 }}>
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#f8fafc', fontSize: 10, fontWeight: 800 }}
                      width={70}
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                      contentStyle={{ backgroundColor: '#0c0f14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
                    />
                    <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={16}>
                      {stats.assetPerformance.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="mt-6 md:mt-10 space-y-3 md:space-y-4">
              {stats.assetPerformance.map((asset: any) => (
                <div key={asset.name} className="flex items-center justify-between p-3 md:p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all duration-300 group cursor-pointer">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-2.5 h-2.5 rounded-full shadow-[0_0_12px_rgba(0,0,0,0.5)]" style={{ backgroundColor: asset.color }}></div>
                    <span className="text-xs md:text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-[0.1em]">{asset.name}</span>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3">
                    <span className="text-base md:text-lg font-bold premium-text font-display">{asset.value}%</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <Card className="lg:col-span-2 glass-card border-white/5 overflow-hidden">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 md:pb-10 p-6 md:p-8 border-b border-white/5 bg-white/5">
            <div>
              <CardTitle className="text-xl md:text-2xl font-display tracking-tight">Agenda Operacional</CardTitle>
              <CardDescription className="text-[10px] md:text-xs font-bold uppercase tracking-widest mt-1">Próximos eventos e janelas de mercado</CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary font-bold hover:bg-primary/10 tracking-widest text-[10px] uppercase w-full sm:w-auto"
              onClick={() => onNavigate?.('calendar')}
            >
              VER AGENDA COMPLETA
            </Button>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {upcomingEvents.length > 0 ? upcomingEvents.map((event, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ scale: 1.02, y: -4 }}
                  onClick={() => onNavigate?.('calendar')}
                  className="flex items-center gap-4 md:gap-5 p-4 md:p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all duration-300 group cursor-pointer shadow-lg"
                >
                  <div className="flex flex-col items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-primary/20 group-hover:border-primary/30 transition-all duration-500">
                    <span className="text-xs md:text-sm font-bold text-foreground tracking-tighter">{event.time}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm md:text-base font-bold premium-text mb-1 tracking-tight">{event.title}</h4>
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full shadow-lg", 
                        event.type === 'Economic Event' ? 'bg-red-500' : event.type === 'Market Opening' ? 'bg-blue-500' : 'bg-primary'
                      )}></div>
                      <p className="text-[8px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{event.type}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 md:w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0" />
                </motion.div>
              )) : (
                <div className="col-span-2 py-10 text-center">
                  <p className="text-muted-foreground">Nenhum evento agendado.</p>
                  <Button variant="link" className="text-primary mt-2" onClick={() => onNavigate?.('calendar')}>Agendar Eventos</Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20 relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full -mr-24 -mt-24 blur-[100px] group-hover:bg-primary/20 transition-all duration-700"></div>
          <CardHeader className="pb-6 md:pb-10 p-6 md:p-8 border-b border-primary/10">
            <CardTitle className="flex items-center gap-3 text-xl md:text-2xl font-display tracking-tight">
              <Sparkles className="w-6 h-6 text-primary animate-pulse" />
              LIFE Intelligence
            </CardTitle>
            <CardDescription className="text-[10px] md:text-xs font-bold uppercase tracking-widest">Insights gerados por IA em tempo real</CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8 space-y-6 md:space-y-8">
            <div className="space-y-4 md:space-y-6">
              <div className="p-5 md:p-6 rounded-3xl bg-white/5 border border-white/10 text-sm leading-relaxed relative group-hover:bg-white/10 transition-all duration-500 shadow-xl">
                <p className="text-muted-foreground font-medium text-sm md:text-base">
                  "Você está a <span className="text-primary font-bold">{Math.max(0, stats.dailyGoal - stats.totalPoints)} pontos</span> da sua meta diária. Seu desempenho hoje está sendo monitorado."
                </p>
              </div>
              <div className="p-5 md:p-6 rounded-3xl bg-white/5 border border-white/10 text-sm leading-relaxed group-hover:bg-white/10 transition-all duration-500 shadow-xl">
                <p className="text-muted-foreground font-medium text-sm md:text-base">
                  "Faltam apenas <span className="text-primary font-bold">{10 - (operations.length % 10)} operações</span> para você progredir seu lote para <span className="text-primary font-bold">{(stats.currentLot + 0.01).toFixed(2)}</span>."
                </p>
              </div>
            </div>
            <Button 
              variant="premium" 
              className="w-full h-14 md:h-16 text-base md:text-lg font-bold shadow-2xl shadow-primary/30 rounded-2xl group transition-all"
              onClick={() => onNavigate?.('ai')}
            >
              <MessageSquare className="w-5 h-5 md:w-6 md:h-6 mr-3 group-hover:rotate-12 transition-transform" />
              Consultar LIFE IA
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
