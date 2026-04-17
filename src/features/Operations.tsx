import * as React from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  TrendingUp, 
  TrendingDown, 
  Image as ImageIcon,
  MoreVertical,
  Calendar as CalendarIcon,
  Clock,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Activity,
  FileText,
  ChevronRight,
  X,
  ArrowRight,
  Target,
  BarChart3,
  Sparkles,
  Upload,
  Calculator,
  Info,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Trash2,
  Edit2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Badge } from '@/src/components/ui/Badge';
import { Label } from '@/src/components/ui/Label';
import { formatCurrency, formatPoints, cn } from '@/src/lib/utils';
import { Operation, Instrument, CalculationSnapshot, OperationStatus } from '@/src/types/calculations';
import { useOperations } from '@/src/hooks/useOperations';
import { instrumentService } from '@/src/lib/services/instrumentService';
import { calculateOperationResult, calculateValuePerPoint } from '@/src/lib/calculations/calculateOperationResult';
import { calculateSuggestedLot } from '@/src/lib/calculations/calculateSuggestedLot';
import { getInstrumentSnapshot } from '@/src/lib/calculations/getInstrumentConfig';
import { motion, AnimatePresence } from 'framer-motion';

interface OperationsProps {
  onNavigate?: (tab: string) => void;
}

export const Operations = ({ onNavigate }: OperationsProps) => {
  const { operations, addOperation, updateOperation, deleteOperation, closeOperation, isLoading } = useOperations();
  const [instruments, setInstruments] = React.useState<Instrument[]>([]);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [editingOp, setEditingOp] = React.useState<Operation | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filter, setFilter] = React.useState('all');
  
  const [newOp, setNewOp] = React.useState<Partial<Operation>>({
    symbol: 'XAUUSD',
    type: 'Buy',
    points: 0,
    targetPoints: 0,
    stopPoints: 0,
    loteSugerido: 0.01,
    loteUsado: 0.01,
    isManualLotOverride: false,
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    setup: '',
    observation: '',
    status: 'PROFIT',
    currency: 'USD',
    moneyResult: 0
  });

  React.useEffect(() => {
    const unsubscribe = instrumentService.subscribeToInstruments(setInstruments);
    return () => unsubscribe();
  }, []);

  // Update suggested lot when operations count changes
  React.useEffect(() => {
    if (!editingOp) {
      const suggested = calculateSuggestedLot(operations.length);
      setNewOp(prev => ({ 
        ...prev, 
        loteSugerido: suggested,
        loteUsado: prev.isManualLotOverride ? prev.loteUsado : suggested 
      }));
    }
  }, [operations.length, editingOp]);

  const selectedInstrument = React.useMemo(() => {
    return instruments.find(i => i.symbol === newOp.symbol);
  }, [instruments, newOp.symbol]);

  const calculationPreview = React.useMemo(() => {
    if (!selectedInstrument) return null;
    const snapshot = getInstrumentSnapshot(selectedInstrument);
    const result = calculateOperationResult(newOp.points || 0, newOp.loteUsado || 0, snapshot);
    const valuePerPoint = calculateValuePerPoint(newOp.loteUsado || 0, snapshot);
    
    return {
      result,
      valuePerPoint,
      mode: selectedInstrument.calculationMode,
      snapshot
    };
  }, [selectedInstrument, newOp.points, newOp.loteUsado]);

  const handleSave = async () => {
    if (!selectedInstrument || !calculationPreview) return;

    const opData = {
      ...newOp,
      instrumentId: selectedInstrument.id,
      category: selectedInstrument.category,
      calculationMode: selectedInstrument.calculationMode,
      calculationSnapshot: calculationPreview.snapshot,
      moneyResult: calculationPreview.result,
      currency: selectedInstrument.accountCurrency
    } as Omit<Operation, 'id' | 'createdAt' | 'userId' | 'updatedAt'>;

    if (editingOp) {
      await updateOperation(editingOp.id, opData);
    } else {
      await addOperation(opData);
    }
    setShowAddModal(false);
    setEditingOp(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Deseja realmente excluir esta operação?')) {
      await deleteOperation(id);
    }
  };

  const handleStatusChange = async (op: Operation, newStatus: OperationStatus) => {
    if (newStatus === 'PROFIT') {
      await updateOperation(op.id, { status: 'PROFIT' });
    } else {
      // For GAIN/LOSS, we might want to allow setting exit price or just confirm the money result
      await closeOperation(op.id, newStatus as 'GAIN' | 'LOSS', op.moneyResult);
    }
  };

  const filteredOperations = operations.filter(op => {
    const matchesSearch = op.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (op.setup && op.setup.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'active') return matchesSearch && op.status === 'PROFIT';
    if (filter === 'closed') return matchesSearch && (op.status === 'GAIN' || op.status === 'LOSS');
    return matchesSearch;
  });

  const stats = React.useMemo(() => {
    const closedOps = operations.filter(op => op.status !== 'PROFIT');
    const gains = closedOps.filter(op => op.status === 'GAIN').reduce((acc, op) => acc + op.moneyResult, 0);
    const losses = closedOps.filter(op => op.status === 'LOSS').reduce((acc, op) => acc + Math.abs(op.moneyResult), 0);
    const net = gains - losses;

    return { gains, losses, net };
  }, [operations]);

  const handleExport = () => {
    if (operations.length === 0) return;
    
    const headers = ['Data', 'Hora', 'Símbolo', 'Tipo', 'Lote', 'Pontos', 'Resultado', 'Status', 'Setup'];
    const csvContent = [
      headers.join(','),
      ...operations.map(op => [
        op.date,
        op.time,
        op.symbol,
        op.type,
        op.loteUsado,
        op.points,
        op.moneyResult,
        op.status,
        `"${op.setup || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `life-trade-operations-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 md:mb-16">
        <div className="space-y-3">
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 w-fit px-4 py-1.5 rounded-full backdrop-blur-xl">
            <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_12px_rgba(226,176,94,0.6)]"></div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">Journaling & Institutional Analytics</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter premium-text font-display">Operações</h1>
          <p className="text-muted-foreground font-medium text-base md:text-lg max-w-2xl">Gerencie e registre seus trades com precisão institucional e auditoria completa.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <Button 
            variant="outline" 
            className="h-14 px-6 bg-white/5 border-white/10 hover:bg-white/10 transition-all rounded-2xl shadow-xl w-full sm:w-auto"
            onClick={handleExport}
          >
            <Download className="w-5 h-5 mr-3" />
            Exportar Dados
          </Button>
          <Button variant="premium" className="h-14 px-8 shadow-2xl shadow-primary/20 rounded-2xl text-base font-bold w-full sm:w-auto" onClick={() => {
            setEditingOp(null);
            setNewOp({
              symbol: instruments[0]?.symbol || 'XAUUSD',
              type: 'Buy',
              points: 0,
              targetPoints: 0,
              stopPoints: 0,
              loteSugerido: calculateSuggestedLot(operations.length),
              loteUsado: calculateSuggestedLot(operations.length),
              isManualLotOverride: false,
              date: new Date().toISOString().split('T')[0],
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              setup: '',
              observation: '',
              status: 'PROFIT',
              currency: 'USD',
              moneyResult: 0
            });
            setShowAddModal(true);
          }}>
            <Plus className="w-5 h-5 mr-3" />
            Nova Operação
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8">
        {[
          { label: 'Total Lucro (Mês)', value: stats.gains, icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20' },
          { label: 'Total Perda (Mês)', value: stats.losses, icon: TrendingDown, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' },
          { label: 'Net Profit', value: stats.net, icon: BarChart3, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20', premium: true },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Card className={cn("glass-card-hover group relative overflow-hidden border-white/5", stat.border)}>
              <div className={cn("absolute top-0 right-0 w-24 h-24 rounded-full -mr-12 -mt-12 blur-2xl group-hover:opacity-100 opacity-50 transition-all duration-500", stat.bg)}></div>
              <CardContent className="p-6 md:p-8 flex items-center gap-4 md:gap-6">
                <div className={cn("p-3 md:p-4 rounded-xl md:rounded-2xl border group-hover:scale-110 transition-transform duration-500 shadow-lg", stat.bg, stat.border)}>
                  <stat.icon className={cn("w-6 h-6 md:w-7 md:h-7", stat.color)} />
                </div>
                <div>
                  <p className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1 md:mb-2">{stat.label}</p>
                  <h3 className={cn("text-2xl md:text-3xl font-bold font-display tracking-tight", stat.premium ? "premium-text" : stat.color)}>
                    {formatCurrency(stat.value)}
                  </h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="glass-card border-white/5 overflow-hidden shadow-2xl rounded-[1.5rem] md:rounded-[2.5rem]">
        <CardHeader className="pb-6 md:pb-10 p-6 md:p-8 border-b border-white/5 bg-white/5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8">
            <div>
              <CardTitle className="text-2xl md:text-3xl font-display tracking-tight premium-text">Histórico de Trades</CardTitle>
              <CardDescription className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground">Lista completa de operações realizadas e auditadas</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="flex items-center bg-white/5 p-1 rounded-2xl border border-white/10 overflow-x-auto no-scrollbar">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn("flex-1 sm:flex-none rounded-xl px-4 font-bold text-[9px] md:text-[10px] uppercase tracking-widest whitespace-nowrap h-10", filter === 'all' && "bg-primary/10 text-primary")}
                  onClick={() => setFilter('all')}
                >
                  Todos
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn("flex-1 sm:flex-none rounded-xl px-4 font-bold text-[9px] md:text-[10px] uppercase tracking-widest whitespace-nowrap h-10", filter === 'active' && "bg-primary/10 text-primary")}
                  onClick={() => setFilter('active')}
                >
                  Ativos
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn("flex-1 sm:flex-none rounded-xl px-4 font-bold text-[9px] md:text-[10px] uppercase tracking-widest whitespace-nowrap h-10", filter === 'closed' && "bg-primary/10 text-primary")}
                  onClick={() => setFilter('closed')}
                >
                  Fechados
                </Button>
              </div>
              <div className="relative group flex-1 sm:flex-none">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  placeholder="Pesquisar..." 
                  className="pl-12 w-full sm:w-64 h-12 bg-background/50 border-white/10 focus:border-primary/50 transition-all rounded-2xl shadow-inner text-sm" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-muted-foreground text-[10px] uppercase tracking-[0.3em] font-bold">
                  <th className="py-8 px-10">Data / Hora</th>
                  <th className="py-8 px-8">Ativo</th>
                  <th className="py-8 px-8">Tipo</th>
                  <th className="py-8 px-8">Lote</th>
                  <th className="py-8 px-8">Pontos</th>
                  <th className="py-8 px-8">Resultado</th>
                  <th className="py-8 px-8">Status</th>
                  <th className="py-8 px-10 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <AnimatePresence>
                  {filteredOperations.map((op, idx) => (
                    <motion.tr 
                      key={op.id} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.05 }}
                      className="group hover:bg-white/[0.04] transition-all duration-300 cursor-pointer"
                    >
                      <td className="py-8 px-10">
                        <div className="flex items-center gap-4">
                          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-foreground tracking-tight">{op.date}</span>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{op.time}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-8 px-8">
                        <Badge variant="outline" className="bg-primary/5 border-primary/30 text-primary font-bold px-4 py-1.5 rounded-xl text-[10px] tracking-widest shadow-lg">
                          {op.symbol}
                        </Badge>
                      </td>
                      <td className="py-8 px-8">
                        <div className={cn(
                          "flex items-center gap-3 text-[10px] font-bold tracking-[0.2em] uppercase",
                          op.type === 'Buy' ? "text-blue-400" : "text-orange-400"
                        )}>
                          <div className={cn("p-2 rounded-xl shadow-lg", op.type === 'Buy' ? "bg-blue-400/10 border border-blue-400/20" : "bg-orange-400/10 border border-orange-400/20")}>
                            {op.type === 'Buy' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                          </div>
                          {op.type === 'Buy' ? 'COMPRA' : 'VENDA'}
                        </div>
                      </td>
                      <td className="py-8 px-8 text-sm font-bold font-mono tracking-tighter">{op.loteUsado.toFixed(2)}</td>
                      <td className="py-8 px-8">
                        <span className={cn(
                          "text-base font-bold font-mono tracking-tighter",
                          op.points > 0 ? "text-green-500" : "text-red-500"
                        )}>
                          {op.points > 0 ? '+' : ''}{op.points}
                        </span>
                      </td>
                      <td className="py-8 px-8">
                        <div className="flex flex-col">
                          <span className={cn(
                            "text-base font-bold font-display tracking-tight",
                            op.status === 'GAIN' ? "text-green-500" : op.status === 'LOSS' ? "text-red-500" : "text-muted-foreground"
                          )}>
                            {op.status === 'PROFIT' ? '---' : formatCurrency(op.moneyResult)}
                          </span>
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">{op.setup}</span>
                        </div>
                      </td>
                      <td className="py-8 px-8">
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={op.status === 'GAIN' ? 'success' : op.status === 'LOSS' ? 'destructive' : 'outline'} 
                            className="text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-xl"
                          >
                            {op.status}
                          </Badge>
                          {op.status === 'PROFIT' && (
                            <div className="flex gap-1">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 rounded-lg text-green-500 hover:bg-green-500/10"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusChange(op, 'GAIN');
                                }}
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 rounded-lg text-red-500 hover:bg-red-500/10"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusChange(op, 'LOSS');
                                }}
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-8 px-10 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-11 w-11 rounded-2xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingOp(op);
                              setNewOp(op);
                              setShowAddModal(true);
                            }}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-11 w-11 rounded-2xl text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(op.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden p-4 space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredOperations.map((op, idx) => (
                <motion.div
                  key={op.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="glass-card-hover border border-white/5 rounded-[1.5rem] p-5 space-y-5 relative overflow-hidden active:scale-[0.98] transition-transform"
                  onClick={() => {
                    setEditingOp(op);
                    setNewOp(op);
                    setShowAddModal(true);
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shadow-2xl",
                        op.type === 'Buy' ? "bg-blue-500/10 border border-blue-500/20" : "bg-orange-500/10 border border-orange-500/20"
                      )}>
                        {op.type === 'Buy' ? <ArrowUpRight className="w-5 h-5 text-blue-500" /> : <ArrowDownRight className="w-5 h-5 text-orange-500" />}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-lg font-black premium-text font-display tracking-tight">{op.symbol}</span>
                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">{op.date} • {op.time}</span>
                      </div>
                    </div>
                    <Badge 
                      variant={op.status === 'GAIN' ? 'success' : op.status === 'LOSS' ? 'destructive' : 'outline'} 
                      className="text-[8px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-xl"
                    >
                      {op.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Tipo / Lote</p>
                      <div className="flex items-center gap-2">
                        <span className={cn("text-xs font-bold", op.type === 'Buy' ? "text-blue-400" : "text-orange-400")}>{op.type === 'Buy' ? 'COMPRA' : 'VENDA'}</span>
                        <span className="text-xs font-bold text-foreground">{op.loteUsado.toFixed(2)} LOT</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Resultado</p>
                      <p className={cn(
                        "text-base font-black font-display tracking-tight",
                        op.status === 'GAIN' ? "text-green-500" : op.status === 'LOSS' ? "text-red-500" : "text-muted-foreground"
                      )}>
                        {op.status === 'PROFIT' ? '---' : formatCurrency(op.moneyResult)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Pontos</p>
                      <p className={cn(
                        "text-xs font-bold",
                        op.points > 0 ? "text-green-500" : "text-red-500"
                      )}>
                        {op.points > 0 ? '+' : ''}{op.points} PTS
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Alvo</p>
                      <p className="text-xs font-bold text-primary">{formatPoints(op.targetPoints)} PTS</p>
                    </div>
                  </div>

                  {op.status === 'PROFIT' && (
                    <div className="flex gap-3 pt-1">
                      <Button 
                        className="flex-1 h-11 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 font-bold uppercase text-[9px] tracking-widest hover:bg-green-500/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(op, 'GAIN');
                        }}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Ganho
                      </Button>
                      <Button 
                        className="flex-1 h-11 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 font-bold uppercase text-[9px] tracking-widest hover:bg-red-500/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(op, 'LOSS');
                        }}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Perda
                      </Button>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{op.setup || 'Sem Setup'}</span>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-9 w-9 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingOp(op);
                          setNewOp(op);
                          setShowAddModal(true);
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-9 w-9 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(op.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {filteredOperations.length === 0 && !isLoading && (
            <div className="py-32 flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-24 h-24 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center mb-4 shadow-2xl">
                <FileText className="w-12 h-12 text-muted-foreground/20" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold premium-text font-display tracking-tight">Nenhuma operação encontrada</h3>
                <p className="text-muted-foreground max-w-sm mx-auto font-medium">Ajuste seus filtros ou registre um novo trade institucional.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2.5rem]"
            >
              <Card className="glass-card border-primary/30 shadow-[0_0_100px_rgba(226,176,94,0.15)] overflow-hidden rounded-[2.5rem]">
                <CardHeader className="border-b border-white/5 p-6 md:p-10 bg-white/5 relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                        <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">Institutional Entry</span>
                      </div>
                      <CardTitle className="text-2xl md:text-3xl font-display tracking-tighter">
                        {editingOp ? 'Editar Operação' : 'Registrar Operação'}
                      </CardTitle>
                      <CardDescription className="text-xs md:text-sm font-medium">Insira os detalhes do seu trade para análise institucional.</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-2xl h-12 w-12 hover:bg-white/10 transition-all" onClick={() => setShowAddModal(false)}>
                      <X className="w-6 h-6" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6 md:p-10 space-y-10 bg-background/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pl-1">
                        <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Ativo Financeiro</Label>
                        <button 
                          type="button"
                          onClick={() => {
                            setShowAddModal(false);
                            if (onNavigate) onNavigate('instruments');
                          }}
                          className="text-[8px] font-bold text-primary hover:underline uppercase tracking-widest"
                        >
                          Configurar Parâmetros
                        </button>
                      </div>
                      <div className="relative group">
                        <select 
                          value={newOp.symbol}
                          onChange={(e) => setNewOp({ ...newOp, symbol: e.target.value })}
                          className="w-full h-14 rounded-2xl border border-white/10 bg-white/5 px-5 py-2 text-base outline-none focus:border-primary/50 transition-all appearance-none font-bold tracking-tight shadow-inner"
                        >
                          {instruments.map(inst => (
                            <option key={inst.id} value={inst.symbol}>{inst.symbol} ({inst.category})</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none group-focus-within:text-primary transition-colors" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground pl-1">Direção do Trade</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <Button 
                          variant="outline" 
                          className={cn(
                            "h-14 rounded-2xl border-white/10 text-muted-foreground bg-white/5 hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/30 transition-all font-bold tracking-widest text-xs", 
                            newOp.type === 'Buy' && "bg-blue-500/20 text-blue-400 border-blue-500/50 shadow-lg shadow-blue-500/10"
                          )}
                          onClick={() => setNewOp({ ...newOp, type: 'Buy' })}
                        >
                          COMPRA
                        </Button>
                        <Button 
                          variant="outline" 
                          className={cn(
                            "h-14 rounded-2xl border-white/10 text-muted-foreground bg-white/5 hover:bg-orange-500/10 hover:text-orange-400 hover:border-orange-500/30 transition-all font-bold tracking-widest text-xs", 
                            newOp.type === 'Sell' && "bg-orange-500/20 text-orange-400 border-orange-500/50 shadow-lg shadow-orange-500/10"
                          )}
                          onClick={() => setNewOp({ ...newOp, type: 'Sell' })}
                        >
                          VENDA
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground pl-1">Pontos / Pips</Label>
                      <Input 
                        type="number" 
                        placeholder="Ex: 150" 
                        className="h-14 bg-white/5 border-white/10 rounded-2xl font-bold text-lg focus:border-primary/50 transition-all shadow-inner"
                        value={newOp.points}
                        onChange={(e) => setNewOp({ ...newOp, points: Number(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pl-1">
                        <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Lote Utilizado</Label>
                        <Badge variant="outline" className="text-[8px] font-black tracking-widest border-primary/30 text-primary">
                          SUGERIDO: {newOp.loteSugerido}
                        </Badge>
                      </div>
                      <div className="relative group">
                        <Input 
                          type="number" 
                          step="0.01"
                          value={newOp.loteUsado} 
                          onChange={(e) => setNewOp({ 
                            ...newOp, 
                            loteUsado: Number(e.target.value),
                            isManualLotOverride: Number(e.target.value) !== newOp.loteSugerido
                          })}
                          className={cn(
                            "h-14 bg-white/5 border-white/10 text-foreground font-bold text-lg rounded-2xl pl-12 shadow-inner",
                            !newOp.isManualLotOverride && "bg-primary/5 border-primary/30 text-primary"
                          )} 
                        />
                        <Zap className={cn("absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground", !newOp.isManualLotOverride && "text-primary animate-pulse")} />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground pl-1">Target (Pontos)</Label>
                      <Input 
                        type="number" 
                        className="h-14 bg-white/5 border-white/10 rounded-2xl font-bold focus:border-green-500/50 transition-all shadow-inner"
                        value={newOp.targetPoints}
                        onChange={(e) => setNewOp({ ...newOp, targetPoints: Number(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-4">
                      <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground pl-1">Stop (Pontos)</Label>
                      <Input 
                        type="number" 
                        className="h-14 bg-white/5 border-white/10 rounded-2xl font-bold focus:border-red-500/50 transition-all shadow-inner"
                        value={newOp.stopPoints}
                        onChange={(e) => setNewOp({ ...newOp, stopPoints: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  {/* Calculation Preview */}
                  {calculationPreview && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-8 rounded-[2rem] bg-primary/5 border border-primary/20 space-y-6"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-black tracking-widest uppercase text-primary flex items-center gap-2">
                          <Calculator className="w-4 h-4" />
                          Preview do Cálculo
                        </h3>
                        <Badge variant="outline" className="text-[9px] font-bold border-primary/20 text-primary/60">
                          MODE: {calculationPreview.mode}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Resultado Estimado</p>
                          <p className={cn(
                            "text-xl md:text-2xl font-black font-display tracking-tight",
                            calculationPreview.result >= 0 ? "text-green-500" : "text-red-500"
                          )}>
                            {formatCurrency(calculationPreview.result)}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Valor por Ponto</p>
                          <p className="text-lg md:text-xl font-black text-foreground">
                            {formatCurrency(calculationPreview.valuePerPoint)}
                          </p>
                        </div>
                        <div className="hidden md:block space-y-1">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Ativo Selecionado</p>
                          <p className="text-xl font-black text-primary">
                            {selectedInstrument?.symbol}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <p className="text-[10px] font-medium text-muted-foreground leading-relaxed italic">
                          Cálculo baseado no contrato de {selectedInstrument?.contractSize.toLocaleString()} unidades. 
                          Referência: {selectedInstrument?.referencePoints} pts / {selectedInstrument?.referenceLot} lote = {formatCurrency(selectedInstrument?.referenceMoneyValue || 0)}.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground pl-1">Data da Operação</Label>
                      <div className="relative group">
                        <Input 
                          type="date" 
                          className="h-14 bg-white/5 border-white/10 rounded-2xl pl-12 font-bold focus:border-primary/50 transition-all shadow-inner"
                          value={newOp.date}
                          onChange={(e) => setNewOp({ ...newOp, date: e.target.value })}
                        />
                        <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground pl-1">Horário de Entrada</Label>
                      <div className="relative group">
                        <Input 
                          type="time" 
                          className="h-14 bg-white/5 border-white/10 rounded-2xl pl-12 font-bold focus:border-primary/50 transition-all shadow-inner"
                          value={newOp.time}
                          onChange={(e) => setNewOp({ ...newOp, time: e.target.value })}
                        />
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground pl-1">Estratégia / Setup Utilizado</Label>
                    <div className="relative group">
                      <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input 
                        placeholder="Ex: Price Action, Fibonacci, Order Block..." 
                        className="h-14 bg-white/5 border-white/10 rounded-2xl pl-12 font-bold focus:border-primary/50 transition-all shadow-inner"
                        value={newOp.setup}
                        onChange={(e) => setNewOp({ ...newOp, setup: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground pl-1">Notas e Contexto Emocional</Label>
                    <textarea 
                      className="w-full min-h-[140px] rounded-[2rem] border border-white/10 bg-white/5 px-6 py-5 text-base font-medium outline-none focus:border-primary/50 transition-all custom-scrollbar shadow-inner" 
                      placeholder="Descreva o contexto emocional e técnico da operação..."
                      value={newOp.observation}
                      onChange={(e) => setNewOp({ ...newOp, observation: e.target.value })}
                    ></textarea>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-white/5 p-6 md:p-10 flex flex-col sm:flex-row justify-end gap-4 md:gap-6 bg-white/5">
                  <Button variant="ghost" className="h-14 px-10 rounded-2xl font-bold text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all w-full sm:w-auto" onClick={() => setShowAddModal(false)}>Descartar</Button>
                  <Button variant="premium" className="h-14 px-12 rounded-2xl shadow-2xl shadow-primary/20 text-base font-bold w-full sm:w-auto" onClick={handleSave}>
                    {editingOp ? 'Salvar Alterações' : 'Confirmar Registro'}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
