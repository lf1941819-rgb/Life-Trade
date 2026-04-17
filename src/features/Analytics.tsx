import * as React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  PieChart as PieChartIcon, 
  Activity, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  Info,
  Download,
  Filter,
  ChevronRight,
  Zap,
  Sparkles,
  Layers,
  ShieldCheck,
  MousePointer2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Badge } from '@/src/components/ui/Badge';
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
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts';
import { formatCurrency, formatPoints, cn } from '@/src/lib/utils';
import { motion } from 'framer-motion';
import { useOperations } from '@/src/hooks/useOperations';
import { useMediaQuery } from '@/src/hooks/useMediaQuery';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card border-white/10 p-5 shadow-2xl backdrop-blur-xl rounded-2xl">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-3">{label}</p>
        <div className="space-y-2">
          <p className="text-2xl font-bold premium-text font-display tracking-tight">
            {formatPoints(payload[0].value)} <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">PTS</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export const Analytics = () => {
  const { operations } = useOperations();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const stats = React.useMemo(() => {
    const closedOps = operations.filter(op => op.status !== 'PROFIT');
    const totalGains = closedOps.filter(op => op.status === 'GAIN').reduce((acc, op) => acc + op.moneyResult, 0);
    const totalLosses = closedOps.filter(op => op.status === 'LOSS').reduce((acc, op) => acc + Math.abs(op.moneyResult), 0);
    
    const profitFactor = totalLosses > 0 ? (totalGains / totalLosses).toFixed(2) : totalGains > 0 ? '∞' : '0.00';
    const avgPoints = closedOps.length > 0 ? Math.round(closedOps.reduce((acc, op) => acc + op.points, 0) / closedOps.length) : 0;
    const winRate = closedOps.length > 0 ? Math.round((closedOps.filter(op => op.status === 'GAIN').length / closedOps.length) * 100) : 0;
    
    // Monthly data
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const monthlyGroups = closedOps.reduce((acc: any, op) => {
      const date = new Date(op.date);
      const month = months[date.getMonth()];
      if (!acc[month]) acc[month] = { name: month, points: 0, value: 0 };
      acc[month].points += op.points;
      acc[month].value += op.moneyResult;
      return acc;
    }, {});

    const monthlyData = months
      .filter(m => monthlyGroups[m])
      .map(m => monthlyGroups[m]);

    // Asset performance
    const assetGroups = closedOps.reduce((acc: any, op) => {
      if (!acc[op.symbol]) acc[op.symbol] = { name: op.symbol, value: 0, count: 0, wins: 0 };
      acc[op.symbol].count++;
      if (op.status === 'GAIN') acc[op.symbol].wins++;
      acc[op.symbol].value += op.moneyResult;
      return acc;
    }, {});

    const assetPerformance = Object.values(assetGroups)
      .map((asset: any) => ({
        name: asset.name,
        value: Math.round((asset.wins / asset.count) * 100),
        totalValue: asset.value,
        color: asset.name.includes('USD') ? '#3b82f6' : asset.name.includes('XAU') ? '#d4af37' : '#10b981'
      }))
      .sort((a, b) => b.value - a.value);

    const winLossData = [
      { name: 'Ganhos', value: closedOps.filter(op => op.status === 'GAIN').length, color: '#10b981' },
      { name: 'Perdas', value: closedOps.filter(op => op.status === 'LOSS').length, color: '#ef4444' },
    ];

    return { 
      profitFactor, 
      avgPoints, 
      winRate, 
      monthlyData, 
      assetPerformance, 
      winLossData,
      totalGainsCount: winLossData[0].value,
      totalLossesCount: winLossData[1].value,
      expectancy: closedOps.length > 0 ? (totalGains - totalLosses) / closedOps.length : 0
    };
  }, [operations]);

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_12px_rgba(226,176,94,0.6)]"></div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">Institutional Performance Audit</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter premium-text font-display">Analytics</h1>
          <p className="text-muted-foreground font-medium text-base md:text-lg">Análise profunda e estatística do seu desempenho operacional consolidado.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <Button variant="outline" className="h-14 px-6 bg-white/5 border-white/10 hover:bg-white/10 transition-all rounded-2xl shadow-xl w-full sm:w-auto">
            <Calendar className="w-5 h-5 mr-3" />
            Histórico Completo
          </Button>
          <Button variant="premium" className="h-14 px-8 shadow-2xl shadow-primary/20 rounded-2xl text-base font-bold w-full sm:w-auto">
            <Download className="w-5 h-5 mr-3" />
            Gerar Relatório PDF
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {[
          { label: 'Profit Factor', value: stats.profitFactor, icon: Activity, trend: 'Auditado', trendColor: 'text-green-500', sub: 'Global', bg: 'bg-green-500/5' },
          { label: 'Média Pontos/Trade', value: `${stats.avgPoints} pts`, icon: Target, trend: 'Live', trendColor: 'text-green-500', sub: 'Média real', bg: 'bg-blue-500/5' },
          { label: 'Expectativa Matemática', value: formatCurrency(stats.expectancy), icon: TrendingUp, trend: 'Por trade', trendColor: 'text-muted-foreground', sub: 'Realizado', bg: 'bg-primary/5' },
          { label: 'Total Trades', value: operations.length, icon: Layers, trend: 'Volume', trendColor: 'text-muted-foreground', sub: 'Registrados', bg: 'bg-indigo-500/5' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Card className="glass-card-hover group relative overflow-hidden border-white/5">
              <div className={cn("absolute top-0 right-0 w-24 h-24 rounded-full -mr-12 -mt-12 blur-3xl opacity-30 group-hover:opacity-60 transition-opacity duration-500", stat.bg)}></div>
              <CardContent className="p-6 md:p-8 space-y-4 md:space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em]">{stat.label}</p>
                  <div className="p-2.5 md:p-3.5 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-500 shadow-xl">
                    <stat.icon className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl md:text-4xl font-bold font-display tracking-tight premium-text">{stat.value}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <div className={cn("px-2 py-0.5 rounded-full text-[8px] md:text-[9px] font-bold uppercase tracking-widest bg-white/5 border border-white/10", stat.trendColor)}>
                      {stat.trend}
                    </div>
                    <p className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.sub}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <Card className="lg:col-span-2 glass-card border-white/5 overflow-hidden shadow-2xl">
          <CardHeader className="pb-8 md:pb-12 p-6 md:p-10 border-b border-white/5 bg-white/5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Layers className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">Capital Growth Audit</span>
                </div>
                <CardTitle className="text-2xl md:text-3xl font-display tracking-tighter">Crescimento de Capital</CardTitle>
                <CardDescription className="text-xs md:text-sm font-medium">Evolução financeira mensal consolidada institucional</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 md:p-10 min-w-0">
            <div className="h-[300px] md:h-[450px] w-full mt-4 md:mt-6 min-h-[300px] min-w-0">
              {isMounted && (
                <ResponsiveContainer width="100%" height="100%" debounce={100}>
                  <AreaChart data={stats.monthlyData.length > 0 ? stats.monthlyData : [{ name: 'N/A', points: 0 }]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#d4af37" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#d4af37" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" strokeOpacity={0.4} />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#71717a', fontSize: 10, fontWeight: 700 }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#71717a', fontSize: 10, fontWeight: 700 }} 
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#d4af37', strokeWidth: 1, strokeDasharray: '4 4' }} />
                    <Area 
                      type="monotone" 
                      dataKey="points" 
                      stroke="#d4af37" 
                      strokeWidth={4}
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                      animationDuration={2500}
                      activeDot={{ r: 6, fill: '#d4af37', stroke: '#000', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/5 shadow-2xl overflow-hidden">
          <CardHeader className="pb-8 md:pb-10 p-6 md:p-10 border-b border-white/5 bg-white/5">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              <span className="text-[10px] font-bold text-green-500 uppercase tracking-[0.3em]">Win Rate Distribution</span>
            </div>
            <CardTitle className="text-2xl md:text-3xl font-display tracking-tighter">Taxa de Acerto</CardTitle>
            <CardDescription className="text-xs md:text-sm font-medium">Distribuição estatística de ganhos e perdas reais</CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-10 space-y-8 md:space-y-12 min-w-0">
            <div className="h-[250px] md:h-[350px] w-full flex items-center justify-center relative min-h-[250px] min-w-0">
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="flex flex-col items-center"
                >
                  <span className="text-4xl md:text-6xl font-bold premium-text font-display tracking-tighter">{stats.winRate}%</span>
                  <span className="text-[8px] md:text-[10px] text-muted-foreground uppercase font-bold tracking-[0.4em] mt-1 md:mt-2">Win Rate</span>
                </motion.div>
              </div>
              {isMounted && (
                <ResponsiveContainer width="100%" height="100%" debounce={100}>
                  <PieChart>
                    <Pie
                      data={stats.winLossData}
                      cx="50%"
                      cy="50%"
                      innerRadius={isMobile ? 70 : 100}
                      outerRadius={isMobile ? 100 : 140}
                      paddingAngle={8}
                      dataKey="value"
                      animationBegin={0}
                      animationDuration={2000}
                      stroke="none"
                    >
                      {stats.winLossData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color} 
                          className="hover:opacity-80 transition-opacity cursor-pointer outline-none"
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#141417', border: '1px solid #27272a', borderRadius: '20px', boxShadow: '0 25px 60px rgba(0,0,0,0.6)', padding: '15px' }}
                      itemStyle={{ fontWeight: 'bold', fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 md:gap-8">
              <div className="p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-green-500/5 border border-green-500/10 text-center group hover:bg-green-500/10 transition-all duration-500 shadow-inner">
                <p className="text-2xl md:text-4xl font-bold text-green-500 font-display tracking-tight">{stats.totalGainsCount}</p>
                <p className="text-[8px] md:text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em] mt-1 md:mt-2">Ganhos Auditados</p>
              </div>
              <div className="p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-red-500/5 border border-red-500/10 text-center group hover:bg-red-500/10 transition-all duration-500 shadow-inner">
                <p className="text-2xl md:text-4xl font-bold text-red-500 font-display tracking-tight">{stats.totalLossesCount}</p>
                <p className="text-[8px] md:text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em] mt-1 md:mt-2">Perdas Auditadas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/5 shadow-2xl overflow-hidden">
          <CardHeader className="pb-8 md:pb-10 p-6 md:p-10 border-b border-white/5 bg-white/5">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">Asset Performance Audit</span>
            </div>
            <CardTitle className="text-2xl md:text-3xl font-display tracking-tighter">Desempenho por Ativo</CardTitle>
            <CardDescription className="text-xs md:text-sm font-medium">Rentabilidade institucional por instrumento financeiro</CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-10 space-y-8 md:space-y-12 min-w-0">
            <div className="h-[250px] md:h-[350px] w-full min-h-[250px] min-w-0">
              {isMounted && (
                <ResponsiveContainer width="100%" height="100%" debounce={100}>
                  <BarChart data={stats.assetPerformance.length > 0 ? stats.assetPerformance : [{ name: 'N/A', value: 0, totalValue: 0, color: '#3b82f6' }]} layout="vertical" margin={{ left: -10, right: 30, top: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={false} />
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#ffffff', fontSize: 11, fontWeight: 800 }}
                      width={90}
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(255,255,255,0.03)', radius: 12 }}
                      contentStyle={{ backgroundColor: '#141417', border: '1px solid #27272a', borderRadius: '20px', padding: '15px' }}
                    />
                    <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={24} animationDuration={2000}>
                      {stats.assetPerformance.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] bg-primary/5 border border-primary/20 flex items-start gap-4 md:gap-6 relative group overflow-hidden shadow-inner">
              <div className="absolute top-0 right-0 p-4 md:p-6 opacity-10 group-hover:scale-125 group-hover:rotate-12 transition-all duration-700">
                <Sparkles className="w-12 h-12 md:w-16 md:h-16 text-primary" />
              </div>
              <div className="p-2.5 md:p-3.5 rounded-2xl bg-primary/10 border border-primary/20 shrink-0 shadow-xl">
                <Zap className="w-5 h-5 md:w-6 md:h-6 text-primary animate-pulse" />
              </div>
              <div className="space-y-1 md:space-y-2">
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-medium">
                  Seu desempenho no <span className="text-primary font-bold">{stats.assetPerformance[0]?.name || 'N/A'}</span> é o mais eficiente da sua carteira institucional.
                </p>
                <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-primary uppercase tracking-widest">
                  <MousePointer2 className="w-3 h-3" />
                  Aproveite sua vantagem estatística neste ativo
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
