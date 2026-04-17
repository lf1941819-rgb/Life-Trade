import * as React from 'react';
import { 
  Target, 
  TrendingUp, 
  BarChart3, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight,
  DollarSign,
  Zap,
  Activity,
  ChevronRight,
  Sparkles,
  Trophy,
  Flag,
  Timer,
  ShieldCheck,
  Info,
  X,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Badge } from '@/src/components/ui/Badge';
import { Input } from '@/src/components/ui/Input';
import { Label } from '@/src/components/ui/Label';
import { formatCurrency, formatPoints, cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useOperations } from '@/src/hooks/useOperations';
import { useGoals } from '@/src/hooks/useGoals';
import { Goal } from '@/src/types';

interface GoalProgressProps {
  title: string;
  current: number;
  target: number;
  unit: 'points' | 'currency';
  currency?: string;
  period: string;
  delay?: number;
}

const GoalProgress = ({ title, current, target, unit, currency, period, delay = 0 }: GoalProgressProps) => {
  const percentage = Math.min(Math.round((current / target) * 100), 100);
  const remaining = Math.max(target - current, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="glass-card-hover group relative overflow-hidden border-white/5 shadow-2xl rounded-[2.5rem]">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-all duration-700"></div>
        <CardHeader className="pb-6 p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/20 group-hover:scale-110 transition-transform duration-500 shadow-xl">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold premium-text font-display tracking-tight">{title}</CardTitle>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">{period}</p>
              </div>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover:rotate-12 transition-transform duration-500">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-10 p-8 pt-0">
          <div className="flex items-end justify-between">
            <div className="space-y-2">
              <p className="text-5xl font-bold tracking-tighter premium-text font-display">
                {unit === 'currency' ? formatCurrency(current, currency) : formatPoints(current)}
              </p>
              <div className="flex items-center gap-2">
                <Flag className="w-3 h-3 text-muted-foreground" />
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                  Meta: {unit === 'currency' ? formatCurrency(target, currency) : formatPoints(target)} {unit === 'points' ? 'PTS' : ''}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end gap-2 mb-1">
                <Trophy className="w-4 h-4 text-primary" />
                <p className="text-4xl font-bold text-primary font-display tracking-tight">{percentage}%</p>
              </div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Concluído</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="h-4 w-full bg-background/50 rounded-full overflow-hidden border border-white/10 p-1 shadow-inner">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 2, ease: "circOut", delay: delay + 0.3 }}
                className="h-full premium-gradient rounded-full shadow-[0_0_20px_rgba(226,176,94,0.5)] relative"
              >
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] animate-[shimmer_2.5s_infinite]"></div>
              </motion.div>
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground uppercase font-bold tracking-[0.3em] px-1">
              <span>Início</span>
              <span className="text-primary">Alvo: {unit === 'currency' ? formatCurrency(target, currency) : formatPoints(target)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-2">
            <div className="p-5 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 transition-all duration-500 group/item shadow-inner">
              <div className="flex items-center gap-2 mb-2">
                <Timer className="w-3 h-3 text-muted-foreground" />
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Faltam</p>
              </div>
              <p className="text-lg font-bold text-primary font-display tracking-tight">
                {unit === 'currency' ? formatCurrency(remaining, currency) : formatPoints(remaining)} {unit === 'points' ? 'PTS' : ''}
              </p>
            </div>
            <div className="p-5 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 transition-all duration-500 group/item shadow-inner">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Projeção</p>
              </div>
              <p className="text-lg font-bold text-green-500 font-display tracking-tight">
                {percentage > 0 ? (unit === 'currency' ? formatCurrency(target * 1.1, currency) : formatPoints(target * 1.1)) : '-'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const Goals = () => {
  const { operations } = useOperations();
  const { goals, addGoal, updateGoal, isLoading } = useGoals();
  const [showConfigModal, setShowConfigModal] = React.useState(false);
  const [editingGoal, setEditingGoal] = React.useState<Partial<Goal> | null>(null);

  const stats = React.useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    
    // Start of week (Sunday)
    const d = new Date(now);
    const day = d.getDay();
    const diff = d.getDate() - day;
    const startOfWeek = new Date(d.setDate(diff));
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const dailyOps = operations.filter(op => op.date === todayStr);
    const weeklyOps = operations.filter(op => new Date(op.date) >= startOfWeek);
    const monthlyOps = operations.filter(op => new Date(op.date) >= startOfMonth);

    const dailyPoints = dailyOps.reduce((acc, op) => acc + op.points, 0);
    const weeklyPoints = weeklyOps.reduce((acc, op) => acc + op.points, 0);
    const monthlyPoints = monthlyOps.reduce((acc, op) => acc + op.points, 0);

    const dailyMoney = dailyOps.reduce((acc, op) => acc + op.moneyResult, 0);
    const weeklyMoney = weeklyOps.reduce((acc, op) => acc + op.moneyResult, 0);
    const monthlyMoney = monthlyOps.reduce((acc, op) => acc + op.moneyResult, 0);

    return {
      dailyPoints,
      weeklyPoints,
      monthlyPoints,
      dailyMoney,
      weeklyMoney,
      monthlyMoney,
      avgPointsPerTrade: operations.length > 0 ? Math.round(operations.reduce((acc, op) => acc + op.points, 0) / operations.length) : 0,
      winRate: operations.length > 0 ? Math.round((operations.filter(op => op.status === 'GAIN').length / operations.length) * 100) : 0
    };
  }, [operations]);

  // Get targets from real goals or use defaults
  const targets = React.useMemo(() => {
    const daily = goals.find(g => g.period === 'Daily')?.pointsGoal || 2000;
    const weekly = goals.find(g => g.period === 'Weekly')?.pointsGoal || 8000;
    const monthly = goals.find(g => g.period === 'Monthly')?.pointsGoal || 30000;
    return { daily, weekly, monthly };
  }, [goals]);

  const handleSaveGoal = async () => {
    if (!editingGoal || !editingGoal.period) return;
    
    const existing = goals.find(g => g.period === editingGoal.period);
    if (existing) {
      await updateGoal(existing.id, editingGoal);
    } else {
      await addGoal(editingGoal as Omit<Goal, 'id' | 'userId'>);
    }
    setShowConfigModal(false);
  };

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_12px_rgba(226,176,94,0.6)]"></div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">Strategic Objectives Audit</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tighter premium-text font-display">Metas Operacionais</h1>
          <p className="text-muted-foreground font-medium text-lg">Acompanhe seu progresso e mantenha o foco nos seus objetivos institucionais.</p>
        </div>
        <Button 
          variant="premium" 
          className="h-14 px-8 shadow-2xl shadow-primary/20 rounded-2xl text-base font-bold transition-all hover:scale-105"
          onClick={() => {
            setEditingGoal({ period: 'Daily', pointsGoal: targets.daily, valueGoal: 0, currency: 'USD', pointsPerOperation: 100 });
            setShowConfigModal(true);
          }}
        >
          <TrendingUp className="w-5 h-5 mr-3" />
          Configurar Metas
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <GoalProgress 
          title="Meta Diária" 
          current={stats.dailyPoints} 
          target={targets.daily} 
          unit="points" 
          period="Hoje"
          delay={0.1}
        />
        <GoalProgress 
          title="Meta Semanal" 
          current={stats.weeklyPoints} 
          target={targets.weekly} 
          unit="points" 
          period="Esta Semana"
          delay={0.2}
        />
        <GoalProgress 
          title="Meta Mensal" 
          current={stats.monthlyPoints} 
          target={targets.monthly} 
          unit="points" 
          period="Este Mês"
          delay={0.3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <Card className="glass-card border-white/5 overflow-hidden shadow-2xl rounded-[2.5rem]">
          <CardHeader className="pb-10 p-10 border-b border-white/5 bg-white/5">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">Financial Equivalence Audit</span>
            </div>
            <CardTitle className="text-3xl font-display tracking-tighter">Equivalência Financeira</CardTitle>
            <CardDescription className="text-sm font-medium">Conversão de metas de pontos para valor monetário institucional</CardDescription>
          </CardHeader>
          <CardContent className="p-10 space-y-8">
            {[
              { label: 'Meta Diária', points: targets.daily, value: stats.dailyMoney, color: 'text-primary', bg: 'bg-primary' },
              { label: 'Meta Semanal', points: targets.weekly, value: stats.weeklyMoney, color: 'text-blue-400', bg: 'bg-blue-400' },
              { label: 'Meta Mensal', points: targets.monthly, value: stats.monthlyMoney, color: 'text-green-500', bg: 'bg-green-500' },
            ].map((item, i) => (
              <motion.div 
                key={i} 
                whileHover={{ x: 10, backgroundColor: 'rgba(255,255,255,0.05)' }}
                className="flex items-center justify-between p-6 rounded-[2rem] bg-white/5 border border-white/5 group hover:border-primary/30 transition-all duration-500 cursor-pointer shadow-inner"
              >
                <div className="flex items-center gap-6">
                  <div className={cn("w-2 h-14 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.6)]", item.bg)}></div>
                  <div>
                    <p className="text-lg font-bold premium-text font-display tracking-tight mb-0.5">{item.label}</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">{formatPoints(item.points)} pontos alvo</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-6">
                  <div>
                    <p className={cn("text-2xl font-bold font-display tracking-tight", item.color)}>{formatCurrency(item.value)}</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">USD Realizado</p>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-all" />
                  </div>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-card border-primary/20 relative overflow-hidden group shadow-2xl rounded-[2.5rem]">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full -mr-24 -mt-24 blur-[100px] group-hover:opacity-100 opacity-50 transition-opacity duration-700"></div>
          <CardHeader className="pb-10 p-10 border-b border-white/5 bg-white/5">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">Predictive Effort Audit</span>
            </div>
            <CardTitle className="flex items-center gap-3 text-3xl font-display tracking-tighter">
              <Zap className="w-6 h-6 text-primary animate-pulse" />
              Projeção de Esforço
            </CardTitle>
            <CardDescription className="text-sm font-medium">Análise preditiva de desempenho operacional institucional</CardDescription>
          </CardHeader>
          <CardContent className="p-10 space-y-10">
            <div className="space-y-6">
              {[
                { label: 'Média de pontos por trade', value: `${stats.avgPointsPerTrade} pts`, icon: BarChart3 },
                { label: 'Taxa de acerto global', value: `${stats.winRate}%`, icon: ShieldCheck },
                { label: 'Trades para meta diária', value: `${Math.ceil(targets.daily / (stats.avgPointsPerTrade || 1))} trades`, icon: Target },
              ].map((stat, i) => (
                <div key={i} className="flex items-center justify-between p-6 rounded-[2rem] bg-background/50 border border-white/10 shadow-inner group/item hover:border-primary/30 transition-all duration-500">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 group-hover/item:text-primary transition-colors">
                      {stat.icon && <stat.icon className="w-4 h-4" />}
                    </div>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-[0.1em]">{stat.label}</span>
                  </div>
                  <span className="text-2xl font-bold text-primary font-display tracking-tight">{stat.value}</span>
                </div>
              ))}
            </div>
            <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 text-base leading-relaxed relative group-hover:bg-white/10 transition-all duration-500 shadow-inner">
              <div className="absolute -top-3 -left-3 p-2 rounded-xl bg-primary/20 border border-primary/30 shadow-xl">
                <Info className="w-4 h-4 text-primary" />
              </div>
              <p className="text-muted-foreground font-medium italic">
                "Para atingir sua meta mensal no ritmo atual, você precisará de aproximadamente <span className="text-primary font-bold">{Math.ceil(targets.monthly / (stats.avgPointsPerTrade || 1))} trades</span> com sua taxa de acerto atual."
              </p>
            </div>
            <Button variant="outline" className="w-full h-16 border-primary/30 text-primary font-bold hover:bg-primary/10 rounded-[1.5rem] transition-all text-base tracking-tight shadow-xl">
              Ajustar Estratégia de Risco Institucional
            </Button>
          </CardContent>
        </Card>
      </div>

      <AnimatePresence>
        {showConfigModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfigModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem]"
            >
              <Card className="glass-card border-primary/30 shadow-2xl">
                <CardHeader className="border-b border-white/5 p-8 bg-white/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl font-display tracking-tighter">Configurar Metas</CardTitle>
                      <CardDescription>Defina seus objetivos operacionais por período.</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setShowConfigModal(false)}>
                      <X className="w-6 h-6" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-4">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Período</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Daily', 'Weekly', 'Monthly'].map(p => (
                        <Button 
                          key={p}
                          variant={editingGoal?.period === p ? 'premium' : 'outline'}
                          className="h-10 rounded-xl text-[10px] font-bold uppercase tracking-widest"
                          onClick={() => {
                            const existing = goals.find(g => g.period === p);
                            setEditingGoal({
                              period: p as any,
                              pointsGoal: existing?.pointsGoal || (p === 'Daily' ? 2000 : p === 'Weekly' ? 8000 : 30000),
                              valueGoal: 0,
                              currency: 'USD',
                              pointsPerOperation: 100
                            });
                          }}
                        >
                          {p === 'Daily' ? 'Diário' : p === 'Weekly' ? 'Semanal' : 'Mensal'}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Meta de Pontos</Label>
                    <Input 
                      type="number"
                      value={editingGoal?.pointsGoal}
                      onChange={(e) => setEditingGoal({ ...editingGoal, pointsGoal: Number(e.target.value) })}
                      className="h-14 bg-white/5 border-white/10 rounded-2xl font-bold text-lg"
                    />
                  </div>
                </CardContent>
                <CardFooter className="p-8 border-t border-white/5 bg-white/5 flex justify-end gap-4">
                  <Button variant="ghost" onClick={() => setShowConfigModal(false)}>Cancelar</Button>
                  <Button variant="premium" onClick={handleSaveGoal}>Salvar Meta</Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
