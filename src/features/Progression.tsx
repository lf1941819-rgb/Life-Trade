import * as React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  Zap, 
  ChevronRight,
  Info,
  Settings2,
  Activity,
  ShieldCheck,
  Target,
  Sparkles,
  Layers,
  ArrowUpRight,
  Trophy
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Badge } from '@/src/components/ui/Badge';
import { cn } from '@/src/lib/utils';
import { motion } from 'framer-motion';
import { useOperations } from '@/src/hooks/useOperations';
import { calculateSuggestedLot } from '@/src/lib/calculations/calculateSuggestedLot';

export const Progression = () => {
  const { operations } = useOperations();
  
  const totalOperations = operations.length;
  const operationsPerCycle = 10;
  const initialLot = 0.01;
  const increment = 0.01;
  
  const completedCycles = Math.floor(totalOperations / operationsPerCycle);
  const currentLot = calculateSuggestedLot(totalOperations);
  const nextLot = calculateSuggestedLot(totalOperations + operationsPerCycle);
  const operationsInCurrentCycle = totalOperations % operationsPerCycle;
  const remainingForNext = operationsPerCycle - operationsInCurrentCycle;
  const progressPercentage = (operationsInCurrentCycle / operationsPerCycle) * 100;

  const futureCycles = React.useMemo(() => {
    return [
      { cycle: completedCycles + 2, lot: calculateSuggestedLot((completedCycles + 1) * operationsPerCycle), status: 'next' },
      { cycle: completedCycles + 3, lot: calculateSuggestedLot((completedCycles + 2) * operationsPerCycle), status: 'locked' },
      { cycle: completedCycles + 4, lot: calculateSuggestedLot((completedCycles + 3) * operationsPerCycle), status: 'locked' },
    ];
  }, [completedCycles]);

  const pastCycles = React.useMemo(() => {
    const cycles = [];
    for (let i = 0; i < completedCycles; i++) {
      cycles.push({
        cycle: i + 1,
        lot: calculateSuggestedLot(i * operationsPerCycle),
        ops: `${i * operationsPerCycle + 1}-${(i + 1) * operationsPerCycle}`,
        status: 'completed'
      });
    }
    return cycles.slice(-2); // Show only last 2 completed cycles
  }, [completedCycles]);

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_12px_rgba(226,176,94,0.6)]"></div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">Lot Progression Protocol</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter premium-text font-display">Progressão de Lote</h1>
          <p className="text-muted-foreground font-medium text-base md:text-lg">Evolução matemática e consistente do seu capital operacional institucional.</p>
        </div>
        <Button variant="outline" className="h-14 px-8 bg-white/5 border-white/10 hover:bg-white/10 transition-all rounded-2xl shadow-xl w-full md:w-auto">
          <Settings2 className="w-5 h-5 mr-3" />
          Configurar Regras
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2"
        >
          <Card className="glass-card border-primary/20 overflow-hidden relative group h-full shadow-2xl rounded-[2rem] md:rounded-[2.5rem]">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full -mr-40 -mt-40 blur-[100px] group-hover:bg-primary/10 transition-all duration-1000"></div>
            <CardHeader className="pb-6 md:pb-10 p-6 md:p-10 border-b border-white/5 bg-white/5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 md:gap-5">
                  <div className="p-3 md:p-4 rounded-[1.2rem] md:rounded-[1.5rem] bg-primary/10 border border-primary/20 shadow-xl group-hover:scale-110 transition-transform duration-500">
                    <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl md:text-3xl font-bold premium-text font-display tracking-tight">Lote Atual: {currentLot.toFixed(2)}</CardTitle>
                    <CardDescription className="text-xs md:text-sm font-medium">Ciclo {completedCycles + 1} em execução estratégica institucional</CardDescription>
                  </div>
                </div>
                <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 hidden sm:block">
                  <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8 md:space-y-12 p-6 md:p-10">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-10">
                <div className="p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] bg-white/5 border border-white/5 hover:border-white/10 transition-all duration-500 shadow-inner group/item">
                  <div className="flex items-center gap-2 mb-2 md:mb-3">
                    <Layers className="w-3 h-3 text-muted-foreground" />
                    <p className="text-[9px] md:text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Total Operações</p>
                  </div>
                  <p className="text-4xl md:text-5xl font-bold font-display premium-text tracking-tighter">{totalOperations}</p>
                </div>
                <div className="p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] bg-white/5 border border-white/5 hover:border-white/10 transition-all duration-500 shadow-inner group/item">
                  <div className="flex items-center gap-2 mb-2 md:mb-3">
                    <Activity className="w-3 h-3 text-primary" />
                    <p className="text-[9px] md:text-[10px] text-muted-foreground uppercase font-bold tracking-widest">No Ciclo Atual</p>
                  </div>
                  <p className="text-4xl md:text-5xl font-bold font-display text-primary tracking-tighter">
                    {operationsInCurrentCycle} 
                    <span className="text-xl md:text-2xl text-muted-foreground ml-2">/ {operationsPerCycle}</span>
                  </p>
                </div>
                <div className="p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] bg-white/5 border border-white/5 hover:border-white/10 transition-all duration-500 shadow-inner group/item">
                  <div className="flex items-center gap-2 mb-2 md:mb-3">
                    <ArrowUpRight className="w-3 h-3 text-green-500" />
                    <p className="text-[9px] md:text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Próximo Lote</p>
                  </div>
                  <p className="text-4xl md:text-5xl font-bold font-display text-green-500 tracking-tighter">{nextLot.toFixed(2)}</p>
                </div>
              </div>

              <div className="space-y-4 md:space-y-5">
                <div className="flex items-center justify-between text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] px-1">
                  <span className="text-muted-foreground">Progresso para o próximo nível</span>
                  <span className="text-primary">{remainingForNext} operações restantes</span>
                </div>
                <div className="h-4 md:h-5 w-full bg-background/50 rounded-full overflow-hidden border border-white/10 p-1 shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 2, ease: "circOut" }}
                    className="h-full premium-gradient rounded-full shadow-[0_0_25px_rgba(226,176,94,0.5)] relative"
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] animate-[shimmer_2.5s_infinite]"></div>
                  </motion.div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-white/5 border-t border-white/5 p-6 md:p-8">
              <div className="flex items-center gap-4 text-xs md:text-sm text-muted-foreground font-medium">
                <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 shrink-0">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                </div>
                <span>Sua progressão institucional é baseada em 10 operações concluídas por ciclo de capitalização auditado.</span>
              </div>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="glass-card border-white/5 h-full shadow-2xl rounded-[2rem] md:rounded-[2.5rem] overflow-hidden">
            <CardHeader className="pb-6 md:pb-10 p-6 md:p-10 border-b border-white/5 bg-white/5">
              <div className="flex items-center gap-2 mb-1">
                <Settings2 className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">Strategy Parameters</span>
              </div>
              <CardTitle className="text-2xl md:text-3xl font-display tracking-tighter">Configurações Ativas</CardTitle>
              <CardDescription className="text-xs md:text-sm font-medium">Parâmetros da sua estratégia de crescimento institucional</CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-10 space-y-6 md:space-y-10">
              <div className="space-y-4 md:space-y-6">
                {[
                  { label: 'Lote Inicial', value: initialLot.toFixed(2), icon: Target },
                  { label: 'Incremento', value: `+${increment.toFixed(2)}`, icon: Activity, color: 'text-primary' },
                  { label: 'Ops/Ciclo', value: operationsPerCycle, icon: BarChart3 },
                ].map((param, i) => (
                  <div key={i} className="flex items-center justify-between p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] bg-background/50 border border-white/10 hover:border-primary/30 transition-all duration-500 shadow-inner group/param">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover/param:text-primary transition-colors">
                        <param.icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-[0.1em]">{param.label}</span>
                    </div>
                    <span className={cn("text-xl md:text-2xl font-bold font-display tracking-tight", param.color || "text-white")}>{param.value}</span>
                  </div>
                ))}
              </div>
              <div className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] bg-white/5 border border-white/10 relative group overflow-hidden shadow-inner">
                <div className="absolute top-0 right-0 p-4 md:p-6 opacity-10 group-hover:scale-125 transition-transform duration-700">
                  <Zap className="w-12 h-12 md:w-16 md:h-16 text-primary" />
                </div>
                <p className="text-[9px] md:text-[10px] text-primary font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] mb-3 md:mb-4">LIFE Intelligence Audit</p>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-medium italic">
                  "Manter a disciplina na progressão de lote é o que separa traders institucionais de amadores. Não pule etapas do seu plano de capitalização."
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="space-y-6 md:space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tighter premium-text font-display">Timeline de Evolução</h2>
            <p className="text-muted-foreground text-xs md:text-sm font-medium">Mapeamento estratégico de crescimento de capital</p>
          </div>
          <Badge variant="outline" className="bg-white/5 border-white/10 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] px-4 md:px-6 py-2 md:py-2.5 rounded-xl md:rounded-2xl shadow-xl w-fit">
            Institutional Projection Map
          </Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-8">
          {/* Ciclos Passados */}
          {pastCycles.map((c, i) => (
            <motion.div
              key={c.cycle}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Card className="border-green-500/20 bg-green-500/5 relative overflow-hidden group hover:border-green-500/40 transition-all duration-500 rounded-[2rem] shadow-xl">
                <div className="absolute top-4 right-4">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </div>
                <CardContent className="p-8 space-y-4">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.3em]">Ciclo {c.cycle}</p>
                  <h4 className="text-4xl font-bold text-green-500 font-display tracking-tighter">{c.lot.toFixed(2)}</h4>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                    <Activity className="w-3.5 h-3.5" />
                    Ops: {c.ops}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {/* Ciclo Atual */}
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="border-primary bg-primary/10 relative overflow-hidden shadow-[0_0_40px_rgba(226,176,94,0.3)] group hover:scale-105 transition-all duration-500 rounded-[2rem]">
              <div className="absolute top-4 right-4">
                <Zap className="w-6 h-6 text-primary animate-pulse" />
              </div>
              <CardContent className="p-8 space-y-4">
                <p className="text-[10px] text-primary uppercase font-bold tracking-[0.3em]">Ciclo {completedCycles + 1}</p>
                <h4 className="text-4xl font-bold text-primary font-display tracking-tighter">{currentLot.toFixed(2)}</h4>
                <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                  <Activity className="w-3.5 h-3.5 text-primary" />
                  Ops: {completedCycles * operationsPerCycle + 1}-{(completedCycles + 1) * operationsPerCycle}
                </div>
              </CardContent>
              <div className="absolute bottom-0 left-0 h-1.5 bg-primary shadow-[0_0_15px_rgba(226,176,94,0.9)]" style={{ width: `${progressPercentage}%` }}></div>
            </Card>
          </motion.div>

          {/* Ciclos Futuros */}
          {futureCycles.map((c, i) => (
            <motion.div
              key={c.cycle}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: (i + 4) * 0.1 }}
            >
              <Card className="border-white/5 bg-white/5 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-not-allowed group rounded-[2rem] shadow-xl">
                <div className="absolute top-4 right-4">
                  <Lock className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <CardContent className="p-8 space-y-4">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.3em]">Ciclo {c.cycle}</p>
                  <h4 className="text-4xl font-bold text-muted-foreground font-display tracking-tighter group-hover:text-white transition-colors">{c.lot.toFixed(2)}</h4>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-3.5 h-3.5 text-muted-foreground" />
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Bloqueado</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
