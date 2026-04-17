
import * as React from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  XCircle,
  Calculator,
  Info,
  Settings2,
  TrendingUp,
  Coins,
  Flame,
  Gem,
  RotateCcw,
  Zap,
  ShieldCheck,
  Cpu,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Badge } from '@/src/components/ui/Badge';
import { instrumentService } from '../lib/services/instrumentService';
import { Instrument, CalculationMode, InstrumentCategory } from '../types/calculations';
import { calculateOperationResult, calculateValuePerPoint } from '../lib/calculations/calculateOperationResult';
import { getInstrumentSnapshot } from '../lib/calculations/getInstrumentConfig';
import { cn } from '@/src/lib/utils';

export const Instruments = () => {
  const [instruments, setInstruments] = React.useState<Instrument[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [editingInstrument, setEditingInstrument] = React.useState<Instrument | null>(null);
  const [testMode, setTestMode] = React.useState(false);
  const [isResetting, setIsResetting] = React.useState(false);
  
  // Test calculation state
  const [testParams, setTestParams] = React.useState({
    symbol: '',
    lot: 0.01,
    points: 100,
  });

  React.useEffect(() => {
    const unsubscribe = instrumentService.subscribeToInstruments(setInstruments);
    instrumentService.initializePresets();
    return () => unsubscribe();
  }, []);

  const filteredInstruments = instruments.filter(inst => 
    inst.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inst.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (window.confirm('Deseja realmente excluir este instrumento?')) {
      await instrumentService.deleteInstrument(id);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Isso irá apagar todas as customizações e restaurar os padrões da XM. Continuar?')) {
      setIsResetting(true);
      await instrumentService.resetToPresets();
      setIsResetting(false);
    }
  };

  const getCategoryIcon = (category: InstrumentCategory) => {
    switch (category) {
      case 'forex': return <TrendingUp className="w-6 h-6" />;
      case 'crypto': return <Coins className="w-6 h-6" />;
      case 'energies': return <Flame className="w-6 h-6" />;
      case 'precious-metals': return <Gem className="w-6 h-6" />;
      default: return <TrendingUp className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 md:mb-16">
        <div className="space-y-3">
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 w-fit px-4 py-1.5 rounded-full backdrop-blur-xl">
            <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_12px_rgba(226,176,94,0.6)]"></div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">Institutional Asset Control</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter premium-text font-display uppercase">Ativos</h1>
          <p className="text-muted-foreground font-medium text-base md:text-lg max-w-2xl">Central de configuração de parâmetros de cálculo e auditoria de símbolos.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <Button 
            variant="outline" 
            className="h-14 px-6 bg-white/5 border-white/10 hover:bg-white/10 transition-all rounded-2xl shadow-xl font-bold w-full sm:w-auto"
            onClick={handleReset}
            disabled={isResetting}
          >
            <RotateCcw className={cn("w-5 h-5 mr-3", isResetting && "animate-spin")} />
            Resetar Padrões XM
          </Button>
          <Button 
            variant="outline" 
            className={cn(
              "h-14 px-6 bg-white/5 border-white/10 hover:bg-white/10 transition-all rounded-2xl shadow-xl font-bold w-full sm:w-auto",
              testMode && "bg-primary/10 border-primary/30 text-primary"
            )}
            onClick={() => setTestMode(!testMode)}
          >
            <Calculator className="w-5 h-5 mr-3" />
            Simulador de Cálculo
          </Button>
          <Button 
            variant="premium" 
            className="h-14 px-8 shadow-2xl shadow-primary/20 rounded-2xl text-base font-bold w-full sm:w-auto"
            onClick={() => {
              setEditingInstrument(null);
              setShowAddModal(true);
            }}
          >
            <Plus className="w-5 h-5 mr-3" />
            Novo Ativo
          </Button>
        </div>
      </header>

      {testMode && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="p-6 md:p-10 rounded-[2.5rem] bg-primary/5 border border-primary/20 backdrop-blur-3xl shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] ml-1">Ativo para Simulação</label>
              <div className="relative group">
                <select 
                  className="w-full h-14 bg-white/5 border-white/10 rounded-2xl px-5 text-base font-bold focus:border-primary/50 outline-none transition-all appearance-none"
                  value={testParams.symbol}
                  onChange={(e) => setTestParams({ ...testParams, symbol: e.target.value })}
                >
                  <option value="">Selecione um ativo...</option>
                  {instruments.map(inst => (
                    <option key={inst.id} value={inst.symbol}>{inst.symbol} ({inst.name})</option>
                  ))}
                </select>
                <TrendingUp className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] ml-1">Lote Operacional</label>
              <Input 
                type="number" 
                step="0.01"
                value={testParams.lot}
                onChange={(e) => setTestParams({ ...testParams, lot: parseFloat(e.target.value) })}
                className="h-14 bg-white/5 border-white/10 rounded-2xl font-bold text-lg focus:border-primary/50 shadow-inner"
              />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] ml-1">Pontos / Pips</label>
              <Input 
                type="number" 
                value={testParams.points}
                onChange={(e) => setTestParams({ ...testParams, points: parseFloat(e.target.value) })}
                className="h-14 bg-white/5 border-white/10 rounded-2xl font-bold text-lg focus:border-primary/50 shadow-inner"
              />
            </div>
            <div className="flex flex-col justify-end">
              <div className="p-6 rounded-2xl bg-primary/10 border border-primary/20 shadow-xl">
                <p className="text-[10px] font-bold text-primary/60 uppercase tracking-widest mb-2">Resultado Financeiro Estimado</p>
                <p className="text-2xl md:text-4xl font-black premium-text font-display tracking-tighter">
                  {(() => {
                    const inst = instruments.find(i => i.symbol === testParams.symbol);
                    if (!inst) return '---';
                    const snapshot = getInstrumentSnapshot(inst);
                    const result = calculateOperationResult(testParams.points, testParams.lot, snapshot);
                    return new Intl.NumberFormat('en-US', { style: 'currency', currency: inst.accountCurrency }).format(result);
                  })()}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input 
          placeholder="Pesquisar por símbolo, nome ou categoria de ativo..." 
          className="h-16 md:h-20 pl-14 md:pl-16 pr-8 bg-white/5 border-white/10 rounded-2xl md:rounded-[2rem] text-lg md:text-xl font-medium focus:ring-8 ring-primary/5 transition-all shadow-2xl"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
        <AnimatePresence mode="popLayout">
          {filteredInstruments.map((inst, idx) => (
            <motion.div
              key={inst.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
            >
              <Card className="group relative overflow-hidden border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500 rounded-[2.5rem] h-full flex flex-col shadow-xl hover:shadow-primary/5">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <CardHeader className="p-6 md:p-8 pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4 md:gap-5">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-[1.5rem] bg-primary/10 border border-primary/20 flex items-center justify-center shadow-2xl shadow-primary/10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                        {getCategoryIcon(inst.category)}
                      </div>
                      <div>
                        <CardTitle className="text-2xl md:text-3xl font-black tracking-tighter font-display">{inst.symbol}</CardTitle>
                        <CardDescription className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60 mt-1">{inst.name}</CardDescription>
                      </div>
                    </div>
                    <Badge variant={inst.isActive ? "success" : "outline"} className="rounded-xl px-3 md:px-4 py-1 md:py-1.5 font-bold text-[8px] md:text-[9px] uppercase tracking-widest shadow-lg">
                      {inst.isActive ? 'OPERACIONAL' : 'SUSPENSO'}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-6 md:p-8 flex-1 space-y-6 md:space-y-8">
                  <div className="grid grid-cols-2 gap-4 md:gap-6">
                    <div className="p-4 md:p-5 rounded-2xl bg-white/5 border border-white/5 group-hover:border-primary/20 transition-colors">
                      <p className="text-[8px] md:text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1 md:mb-2 flex items-center gap-2">
                        <Cpu className="w-3 h-3 text-primary" />
                        Motor
                      </p>
                      <p className="text-[10px] md:text-xs font-black truncate uppercase tracking-tight">{inst.calculationMode.replace(/_/g, ' ')}</p>
                    </div>
                    <div className="p-4 md:p-5 rounded-2xl bg-white/5 border border-white/5 group-hover:border-primary/20 transition-colors">
                      <p className="text-[8px] md:text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1 md:mb-2 flex items-center gap-2">
                        <ShieldCheck className="w-3 h-3 text-primary" />
                        Contrato
                      </p>
                      <p className="text-[10px] md:text-xs font-black">{inst.contractSize.toLocaleString()} UN</p>
                    </div>
                  </div>

                  <div className="space-y-3 md:space-y-4 bg-white/5 p-5 md:p-6 rounded-[1.5rem] border border-white/5">
                    <div className="flex items-center justify-between text-[10px] md:text-xs">
                      <span className="text-muted-foreground font-bold uppercase tracking-widest text-[8px] md:text-[10px]">Ref. Lote / Pontos</span>
                      <span className="font-black font-mono">{inst.referenceLot} / {inst.referencePoints} pts</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] md:text-xs">
                      <span className="text-muted-foreground font-bold uppercase tracking-widest text-[8px] md:text-[10px]">Valor Ref.</span>
                      <span className="font-black text-primary text-xs md:text-sm">{new Intl.NumberFormat('en-US', { style: 'currency', currency: inst.accountCurrency }).format(inst.referenceMoneyValue)}</span>
                    </div>
                    <div className="h-px bg-white/5" />
                    <div className="flex items-center justify-between text-[10px] md:text-xs">
                      <span className="text-muted-foreground font-bold uppercase tracking-widest text-[8px] md:text-[10px]">Ponto (0.01)</span>
                      <span className="font-black text-foreground text-xs md:text-sm">{new Intl.NumberFormat('en-US', { style: 'currency', currency: inst.accountCurrency }).format(calculateValuePerPoint(0.01, getInstrumentSnapshot(inst)))}</span>
                    </div>
                  </div>

                  {inst.notes && (
                    <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10 flex gap-4">
                      <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <p className="text-[11px] font-medium leading-relaxed text-muted-foreground italic">
                        {inst.notes}
                      </p>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="p-8 pt-0 border-t border-white/5 flex gap-4 bg-white/5">
                  <Button 
                    variant="ghost" 
                    className="flex-1 h-14 rounded-2xl font-bold hover:bg-primary/10 hover:text-primary transition-all"
                    onClick={() => {
                      setEditingInstrument(inst);
                      setShowAddModal(true);
                    }}
                  >
                    <Edit2 className="w-4 h-4 mr-3" />
                    Ajustar Parâmetros
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="h-14 w-14 rounded-2xl font-bold hover:bg-red-500/10 hover:text-red-500 transition-all"
                    onClick={() => handleDelete(inst.id)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modal Add/Edit */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
              onClick={() => setShowAddModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[3rem]"
            >
              <Card className="glass-card border-primary/30 shadow-[0_0_100px_rgba(226,176,94,0.15)] overflow-hidden rounded-[3rem]">
                <CardHeader className="p-6 md:p-12 pb-8 border-b border-white/5 bg-white/5 relative">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full -mr-24 -mt-24 blur-3xl"></div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-1">
                        <Settings2 className="w-5 h-5 text-primary animate-pulse" />
                        <span className="text-[10px] font-bold text-primary uppercase tracking-[0.4em]">Institutional Config</span>
                      </div>
                      <CardTitle className="text-2xl md:text-4xl font-display tracking-tighter">
                        {editingInstrument ? `Ajustar ${editingInstrument.symbol}` : 'Novo Ativo Institucional'}
                      </CardTitle>
                      <CardDescription className="text-sm md:text-base font-medium">Configure os parâmetros técnicos para o motor de cálculo operacional.</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-2xl h-12 w-12 md:h-14 md:w-14 hover:bg-white/10 transition-all" onClick={() => setShowAddModal(false)}>
                      <XCircle className="w-6 h-6 md:w-8 md:h-8" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6 md:p-12 pt-10 space-y-10 bg-background/50">
                  <InstrumentForm 
                    initialData={editingInstrument} 
                    onSave={async (data) => {
                      if (editingInstrument) {
                        await instrumentService.updateInstrument(editingInstrument.id, data);
                      } else {
                        await instrumentService.createInstrument(data as Instrument);
                      }
                      setShowAddModal(false);
                    }}
                    onCancel={() => setShowAddModal(false)}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const InstrumentForm = ({ initialData, onSave, onCancel }: { 
  initialData: Instrument | null, 
  onSave: (data: Partial<Instrument>) => void,
  onCancel: () => void
}) => {
  const [formData, setFormData] = React.useState<Partial<Instrument>>(initialData || {
    symbol: '',
    name: '',
    category: 'forex',
    broker: 'XM',
    isActive: true,
    calculationMode: 'direct_points_money',
    contractSize: 100000,
    referenceLot: 0.01,
    referencePoints: 100,
    referenceMoneyValue: 1,
    pointSize: 0.00001,
    quoteCurrency: 'USD',
    accountCurrency: 'USD',
    pricePrecision: 5,
    notes: ''
  });

  const previewValuePerPoint = React.useMemo(() => {
    return calculateValuePerPoint(0.01, {
      contractSize: formData.contractSize || 0,
      pointSize: formData.pointSize || 0,
      referenceLot: formData.referenceLot || 0,
      referencePoints: formData.referencePoints || 0,
      referenceMoneyValue: formData.referenceMoneyValue || 0,
      calculationMode: formData.calculationMode || 'direct_points_money',
      symbol: formData.symbol || '',
      category: formData.category || 'forex'
    });
  }, [formData]);

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">Símbolo de Mercado</label>
          <Input 
            value={formData.symbol}
            onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
            placeholder="Ex: XAUUSD"
            className="h-14 bg-white/5 border-white/10 rounded-2xl font-bold text-lg focus:border-primary/50 shadow-inner"
          />
        </div>
        <div className="space-y-4">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">Nome Descritivo</label>
          <Input 
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ex: Gold vs US Dollar"
            className="h-14 bg-white/5 border-white/10 rounded-2xl font-bold text-lg focus:border-primary/50 shadow-inner"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">Categoria de Ativo</label>
          <div className="relative group">
            <select 
              className="w-full h-14 bg-white/5 border-white/10 rounded-2xl px-5 font-bold outline-none focus:border-primary/50 transition-all appearance-none shadow-inner"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as InstrumentCategory })}
            >
              <option value="forex">Forex</option>
              <option value="precious-metals">Precious Metals</option>
              <option value="energies">Energies</option>
              <option value="crypto">Crypto</option>
            </select>
            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
          </div>
        </div>
        <div className="space-y-4">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">Modo de Cálculo Operacional</label>
          <div className="relative group">
            <select 
              className="w-full h-14 bg-white/5 border-white/10 rounded-2xl px-5 font-bold outline-none focus:border-primary/50 transition-all appearance-none shadow-inner"
              value={formData.calculationMode}
              onChange={(e) => setFormData({ ...formData, calculationMode: e.target.value as CalculationMode })}
            >
              <option value="direct_points_money">Direct Points/Money (Operational)</option>
              <option value="price_difference_contract">Price Difference * Contract</option>
              <option value="custom_symbol_formula">Custom Formula</option>
            </select>
            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 space-y-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <h3 className="text-sm font-black tracking-widest uppercase text-primary flex items-center gap-3 relative z-10">
          <Zap className="w-5 h-5" />
          Parâmetros Técnicos (XM Standard)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">Contract Size (Unidades)</label>
            <Input 
              type="number"
              value={formData.contractSize}
              onChange={(e) => setFormData({ ...formData, contractSize: parseFloat(e.target.value) })}
              className="h-14 bg-white/5 border-white/10 rounded-2xl font-bold text-lg shadow-inner"
            />
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">Point Size (Valor do Tick)</label>
            <Input 
              type="number"
              step="0.000001"
              value={formData.pointSize}
              onChange={(e) => setFormData({ ...formData, pointSize: parseFloat(e.target.value) })}
              className="h-14 bg-white/5 border-white/10 rounded-2xl font-bold text-lg shadow-inner"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">Lote de Referência</label>
            <Input 
              type="number"
              step="0.01"
              value={formData.referenceLot}
              onChange={(e) => setFormData({ ...formData, referenceLot: parseFloat(e.target.value) })}
              className="h-14 bg-white/5 border-white/10 rounded-2xl font-bold text-lg shadow-inner"
            />
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">Pontos de Referência</label>
            <Input 
              type="number"
              value={formData.referencePoints}
              onChange={(e) => setFormData({ ...formData, referencePoints: parseFloat(e.target.value) })}
              className="h-14 bg-white/5 border-white/10 rounded-2xl font-bold text-lg shadow-inner"
            />
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">Valor Financeiro ($)</label>
            <Input 
              type="number"
              value={formData.referenceMoneyValue}
              onChange={(e) => setFormData({ ...formData, referenceMoneyValue: parseFloat(e.target.value) })}
              className="h-14 bg-white/5 border-white/10 rounded-2xl font-bold text-lg shadow-inner"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <Calculator className="w-5 h-5 text-primary" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Preview do Valor por Ponto (0.01 lot):</span>
          </div>
          <span className="text-2xl font-black text-primary font-display tracking-tight">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: formData.accountCurrency || 'USD' }).format(previewValuePerPoint)}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">Notas de Auditoria</label>
        <textarea 
          className="w-full min-h-[120px] rounded-[2rem] border border-white/10 bg-white/5 px-6 py-5 text-base font-medium outline-none focus:border-primary/50 transition-all custom-scrollbar shadow-inner" 
          placeholder="Ex: 100 pontos com 0.01 lot = 1 USD (XM Standard)..."
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        ></textarea>
      </div>

      <div className="flex items-center justify-end gap-6 pt-6 border-t border-white/5">
        <Button variant="ghost" className="h-14 px-10 rounded-2xl font-bold text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all" onClick={onCancel}>Descartar</Button>
        <Button variant="premium" className="h-14 px-12 rounded-2xl shadow-2xl shadow-primary/20 text-base font-bold" onClick={() => onSave(formData)}>Salvar Parâmetros</Button>
      </div>
    </div>
  );
};
