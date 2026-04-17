import * as React from 'react';
import { 
  Receipt, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  MoreVertical, 
  CheckCircle2, 
  Clock, 
  XCircle,
  FileText,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Badge } from '@/src/components/ui/Badge';
import { Label } from '@/src/components/ui/Label';
import { formatCurrency, cn } from '@/src/lib/utils';
import { Invoice } from '@/src/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useInvoices } from '@/src/hooks/useInvoices';

export const Invoices = () => {
  const { invoices, addInvoice, deleteInvoice, isLoading } = useInvoices();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [newInvoice, setNewInvoice] = React.useState<Partial<Invoice>>({
    date: new Date().toISOString().split('T')[0],
    number: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    value: 0,
    currency: 'USD',
    description: '',
    status: 'Pending'
  });

  const filteredInvoices = React.useMemo(() => {
    return invoices.filter(inv => 
      inv.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [invoices, searchTerm]);

  const stats = React.useMemo(() => {
    const total = invoices.reduce((acc, inv) => acc + inv.value, 0);
    const paid = invoices.filter(inv => inv.status === 'Paid').reduce((acc, inv) => acc + inv.value, 0);
    const pending = invoices.filter(inv => inv.status === 'Pending').reduce((acc, inv) => acc + inv.value, 0);
    
    return {
      total,
      paid,
      pending,
      paidPercentage: total > 0 ? Math.round((paid / total) * 100) : 0,
      pendingPercentage: total > 0 ? Math.round((pending / total) * 100) : 0
    };
  }, [invoices]);

  const handleSaveInvoice = async () => {
    if (!newInvoice.description || !newInvoice.value) return;
    await addInvoice(newInvoice as Omit<Invoice, 'id' | 'userId'>);
    setShowAddModal(false);
    setNewInvoice({
      date: new Date().toISOString().split('T')[0],
      number: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      value: 0,
      currency: 'USD',
      description: '',
      status: 'Pending'
    });
  };

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(226,176,94,0.5)]"></div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Financial Documentation</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tighter premium-text font-display">Notas Emitidas</h1>
          <p className="text-muted-foreground font-medium">Gestão financeira de notas e faturas operacionais institucionais.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-12 px-5 bg-white/5 border-white/10 hover:bg-white/10 transition-all">
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
          <Button variant="premium" className="h-12 px-6 shadow-xl shadow-primary/10" onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Nota
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Emitido (Mês)', value: stats.total, icon: Receipt, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20', trend: '100%' },
          { label: 'Total Pago', value: stats.paid, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20', trend: `${stats.paidPercentage}%` },
          { label: 'Pendente', value: stats.pending, icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', trend: `${stats.pendingPercentage}%` },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <Card className="glass-card-hover group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-primary/10 transition-all duration-500"></div>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{stat.label}</p>
                  <div className={cn("p-2 rounded-lg border group-hover:scale-110 transition-transform duration-300", stat.bg, stat.border)}>
                    <stat.icon className={cn("w-4 h-4", stat.color)} />
                  </div>
                </div>
                <div>
                  <h3 className={cn("text-3xl font-bold font-display tracking-tight", stat.color === 'text-primary' ? 'premium-text' : stat.color)}>
                    {formatCurrency(stat.value)}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.trend} do volume total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="glass-card border-white/5 overflow-hidden">
        <CardHeader className="pb-8 border-b border-white/5 bg-white/5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <CardTitle className="text-xl">Lista de Notas</CardTitle>
              <CardDescription className="text-xs font-medium">Histórico financeiro detalhado e auditável</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  placeholder="Buscar nota por número ou ativo..." 
                  className="pl-11 h-11 w-72 bg-background/50 border-white/10 focus:border-primary/50 rounded-xl transition-all" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" className="h-11 w-11 bg-white/5 border-white/10 hover:bg-white/10 transition-all rounded-xl">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-muted-foreground text-[10px] uppercase font-bold tracking-[0.2em]">
                  <th className="py-6 px-8">Data</th>
                  <th className="py-6 px-8">Número</th>
                  <th className="py-6 px-8">Descrição</th>
                  <th className="py-6 px-8">Valor</th>
                  <th className="py-6 px-8">Status</th>
                  <th className="py-6 px-8 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <AnimatePresence>
                  {filteredInvoices.map((inv, i) => (
                    <motion.tr 
                      key={inv.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className="group hover:bg-white/5 transition-all duration-300 cursor-pointer"
                    >
                      <td className="py-6 px-8">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-medium">{inv.date}</span>
                        </div>
                      </td>
                      <td className="py-6 px-8">
                        <span className="text-sm font-bold premium-text font-display tracking-tight">{inv.number}</span>
                      </td>
                      <td className="py-6 px-8">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-white/5 border-white/10 text-[9px] font-bold uppercase tracking-widest">OPERACIONAL</Badge>
                          <span className="text-sm text-muted-foreground font-medium">{inv.description}</span>
                        </div>
                      </td>
                      <td className="py-6 px-8">
                        <span className="text-sm font-bold font-display">{formatCurrency(inv.value, inv.currency)}</span>
                      </td>
                      <td className="py-6 px-8">
                        <Badge 
                          variant={inv.status === 'Paid' ? 'success' : inv.status === 'Pending' ? 'secondary' : 'destructive'}
                          className="text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg"
                        >
                          {inv.status === 'Paid' ? 'Liquidado' : inv.status === 'Pending' ? 'Pendente' : 'Cancelado'}
                        </Badge>
                      </td>
                      <td className="py-6 px-8 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-10 w-10 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                          >
                            <FileText className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-10 w-10 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                            onClick={() => deleteInvoice(inv.id)}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          {filteredInvoices.length === 0 && !isLoading && (
            <div className="py-20 text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
                <Receipt className="w-10 h-10 text-muted-foreground opacity-20" />
              </div>
              <h3 className="text-xl font-bold premium-text font-display">Nenhuma nota encontrada</h3>
              <p className="text-muted-foreground max-w-xs mx-auto">Você ainda não possui notas fiscais ou faturas emitidas no sistema.</p>
              <Button variant="premium" className="mt-6 h-12 px-8" onClick={() => setShowAddModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Emitir Primeira Nota
              </Button>
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
              className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem]"
            >
              <Card className="glass-card border-primary/30 shadow-2xl">
                <CardHeader className="border-b border-white/5 p-8 bg-white/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl font-display tracking-tighter">Emitir Nota</CardTitle>
                      <CardDescription>Registre uma nova fatura operacional.</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setShowAddModal(false)}>
                      <X className="w-6 h-6" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-4">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Descrição</Label>
                    <Input 
                      placeholder="Ex: Nota operacional - XAUUSD"
                      value={newInvoice.description}
                      onChange={(e) => setNewInvoice({ ...newInvoice, description: e.target.value })}
                      className="h-12 bg-white/5 border-white/10 rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Valor</Label>
                      <Input 
                        type="number"
                        value={newInvoice.value}
                        onChange={(e) => setNewInvoice({ ...newInvoice, value: Number(e.target.value) })}
                        className="h-12 bg-white/5 border-white/10 rounded-xl font-bold"
                      />
                    </div>
                    <div className="space-y-4">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status</Label>
                      <select 
                        value={newInvoice.status}
                        onChange={(e) => setNewInvoice({ ...newInvoice, status: e.target.value as any })}
                        className="w-full h-12 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-bold outline-none"
                      >
                        <option value="Pending">Pendente</option>
                        <option value="Paid">Liquidado</option>
                        <option value="Cancelled">Cancelado</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-8 border-t border-white/5 bg-white/5 flex justify-end gap-4">
                  <Button variant="ghost" onClick={() => setShowAddModal(false)}>Cancelar</Button>
                  <Button variant="premium" onClick={handleSaveInvoice}>Emitir Nota</Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
