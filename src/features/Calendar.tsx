import * as React from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  MapPin, 
  MoreVertical,
  AlertCircle,
  TrendingUp,
  User,
  Coffee,
  Zap,
  Globe,
  Bell,
  Sparkles,
  CalendarDays,
  Search,
  Filter,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Badge } from '@/src/components/ui/Badge';
import { Input } from '@/src/components/ui/Input';
import { Label } from '@/src/components/ui/Label';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useEvents } from '@/src/hooks/useEvents';
import { CalendarEvent } from '@/src/types';

const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const months = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export const Calendar = () => {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const { events, addEvent, deleteEvent, isLoading } = useEvents();
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [newEvent, setNewEvent] = React.useState<Partial<CalendarEvent>>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '08:00',
    type: 'Market Opening'
  });

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleSaveEvent = async () => {
    if (!newEvent.title || !newEvent.date) return;
    await addEvent(newEvent as Omit<CalendarEvent, 'id' | 'userId'>);
    setShowAddModal(false);
    setNewEvent({
      title: '',
      date: new Date().toISOString().split('T')[0],
      time: '08:00',
      type: 'Market Opening'
    });
  };

  const todaysEvents = React.useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return events.filter(e => e.date === todayStr);
  }, [events]);

  const getEventsForDay = (day: number) => {
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
    return events.filter(e => e.date === dateStr);
  };

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_12px_rgba(226,176,94,0.6)]"></div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">Operational Schedule Audit</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tighter premium-text font-display">Agenda Operacional</h1>
          <p className="text-muted-foreground font-medium text-lg">Organize sua rotina e não perca eventos importantes do mercado institucional.</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="h-14 w-14 bg-white/5 border-white/10 hover:bg-white/10 transition-all rounded-2xl shadow-xl">
            <Search className="w-5 h-5 text-muted-foreground" />
          </Button>
          <Button variant="premium" className="h-14 px-8 shadow-2xl shadow-primary/20 rounded-2xl text-base font-bold transition-all hover:scale-105" onClick={() => setShowAddModal(true)}>
            <Plus className="w-5 h-5 mr-3" />
            Novo Evento
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <Card className="lg:col-span-2 glass-card border-white/5 overflow-hidden shadow-2xl rounded-[2.5rem]">
          <CardHeader className="flex flex-row items-center justify-between pb-10 p-10 border-b border-white/5 bg-white/5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CalendarDays className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">Institutional Calendar View</span>
              </div>
              <CardTitle className="text-3xl font-bold premium-text font-display tracking-tighter">
                {months[currentDate.getMonth()]} {currentDate.getFullYear()}
              </CardTitle>
              <CardDescription className="text-sm font-medium">Visualização mensal de compromissos e eventos macro auditados</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-12 w-12 bg-white/5 border-white/10 hover:bg-white/10 transition-all rounded-xl shadow-inner"
                onClick={handlePrevMonth}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-12 w-12 bg-white/5 border-white/10 hover:bg-white/10 transition-all rounded-xl shadow-inner"
                onClick={handleNextMonth}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-7 gap-px bg-white/5">
              {days.map((day) => (
                <div key={day} className="bg-card/50 p-6 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] border-b border-white/5">
                  {day}
                </div>
              ))}
              {Array.from({ length: 42 }).map((_, i) => {
                const dayNum = i - firstDayOfMonth + 1;
                const isToday = dayNum === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();
                const dayEvents = dayNum > 0 && dayNum <= daysInMonth ? getEventsForDay(dayNum) : [];
                
                return (
                  <motion.div 
                    key={i} 
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                    className={cn(
                      "bg-card min-h-[140px] p-5 border-r border-b border-white/5 transition-all cursor-pointer group relative",
                      dayNum <= 0 || dayNum > daysInMonth ? "opacity-20" : ""
                    )}
                    onClick={() => {
                      if (dayNum > 0 && dayNum <= daysInMonth) {
                        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNum);
                        setNewEvent({ ...newEvent, date: date.toISOString().split('T')[0] });
                        setShowAddModal(true);
                      }
                    }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className={cn(
                        "text-base font-bold w-10 h-10 flex items-center justify-center rounded-2xl transition-all duration-500",
                        isToday 
                          ? "bg-primary text-black shadow-2xl shadow-primary/40 scale-110" 
                          : "text-muted-foreground group-hover:text-foreground group-hover:bg-white/10"
                      )}>
                        {dayNum > 0 && dayNum <= daysInMonth ? dayNum : ''}
                      </span>
                      {dayEvents.length > 0 && (
                        <div className="flex gap-1.5 pt-2">
                          <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(212,175,55,0.9)]"></div>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      {dayEvents.slice(0, 2).map(e => (
                        <div key={e.id} className={cn(
                          "text-[10px] font-bold p-2 rounded-xl border truncate backdrop-blur-md shadow-inner group-hover:scale-105 transition-transform",
                          e.type === 'Economic Event' ? "bg-red-500/10 text-red-400 border-red-500/20" :
                          e.type === 'Market Opening' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                          "bg-primary/10 text-primary border-primary/20"
                        )}>
                          {e.time} {e.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-[8px] font-bold text-muted-foreground pl-1">
                          + {dayEvents.length - 2} mais
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-10">
          <Card className="glass-card border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden">
            <CardHeader className="pb-8 p-8 border-b border-white/5 bg-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">Today's Protocol</span>
                  </div>
                  <CardTitle className="text-2xl font-bold tracking-tighter">Eventos de Hoje</CardTitle>
                  <CardDescription className="text-sm font-medium">
                    {new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px] font-bold px-4 py-1.5 rounded-full shadow-lg">
                  {todaysEvents.length} EVENTOS
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <AnimatePresence>
                {todaysEvents.map((event, i) => (
                  <motion.div 
                    key={event.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="flex items-start gap-5 p-6 rounded-[2rem] bg-white/5 border border-white/5 group hover:border-primary/30 hover:bg-white/10 transition-all duration-500 relative overflow-hidden shadow-inner"
                  >
                    <div className={cn(
                      "absolute left-0 top-0 bottom-0 w-1.5 group-hover:w-2 transition-all duration-500",
                      event.type === 'Economic Event' ? "bg-red-500" : event.type === 'Market Opening' ? "bg-blue-500" : "bg-primary"
                    )}></div>
                    <div className={cn(
                      "p-3.5 rounded-2xl bg-white/5 border border-white/10 shrink-0 group-hover:scale-110 transition-transform duration-500 shadow-xl",
                      event.type === 'Economic Event' ? "text-red-500" : event.type === 'Market Opening' ? "text-blue-500" : "text-primary"
                    )}>
                      {event.type === 'Economic Event' ? <AlertCircle className="w-6 h-6" /> : 
                       event.type === 'Market Opening' ? <Globe className="w-6 h-6" /> : 
                       <TrendingUp className="w-6 h-6" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="text-base font-bold truncate group-hover:text-primary transition-colors font-display tracking-tight">{event.title}</h4>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground bg-white/5 px-2 py-1 rounded-lg border border-white/10">
                          <Clock className="w-3.5 h-3.5" />
                          {event.time}
                        </div>
                      </div>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] mb-4">{event.type}</p>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-[9px] font-bold bg-white/5 border-white/10 px-3 py-1 rounded-xl uppercase tracking-widest">ALERTA</Badge>
                        <Badge variant="outline" className="text-[9px] font-bold bg-white/5 border-white/10 px-3 py-1 rounded-xl uppercase tracking-widest">IMPORTANTE</Badge>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-10 w-10 opacity-0 group-hover:opacity-100 transition-all rounded-xl hover:bg-white/10"
                      onClick={() => deleteEvent(event.id)}
                    >
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
              {todaysEvents.length === 0 && (
                <div className="py-10 text-center space-y-4">
                  <p className="text-sm text-muted-foreground">Nenhum evento para hoje.</p>
                </div>
              )}
              <Button variant="outline" className="w-full h-14 border-white/10 hover:bg-white/10 text-xs font-bold uppercase tracking-[0.3em] rounded-2xl mt-6 shadow-xl transition-all">
                Ver Agenda Completa
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card border-primary/20 relative overflow-hidden group shadow-2xl rounded-[2.5rem]">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full -mr-24 -mt-24 blur-[100px] group-hover:bg-primary/20 transition-all duration-700"></div>
            <CardHeader className="pb-6 p-8">
              <CardTitle className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.3em] text-primary">
                <Zap className="w-5 h-5 animate-pulse" />
                Dica de Rotina Auditada
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <p className="text-base text-muted-foreground leading-relaxed font-medium italic">
                "Sua maior taxa de acerto ocorre entre <span className="text-primary font-bold">09:00 e 11:00</span>. Tente concentrar suas operações mais pesadas neste horário e use le período da tarde para revisão e estudos."
              </p>
              <div className="mt-8 flex items-center gap-4 p-5 rounded-[1.5rem] bg-primary/10 border border-primary/20 shadow-inner group-hover:bg-primary/20 transition-all duration-500">
                <div className="p-2.5 rounded-xl bg-primary/20 border border-primary/30">
                  <Bell className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary block mb-0.5">Lembrete Ativo</span>
                  <span className="text-xs font-bold text-primary/80">Protocolo de execução ativado</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

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
                      <CardTitle className="text-2xl font-display tracking-tighter">Novo Evento</CardTitle>
                      <CardDescription>Agende um novo compromisso ou evento.</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setShowAddModal(false)}>
                      <X className="w-6 h-6" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-4">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Título</Label>
                    <Input 
                      placeholder="Ex: Abertura Londres"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      className="h-12 bg-white/5 border-white/10 rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Data</Label>
                      <Input 
                        type="date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                        className="h-12 bg-white/5 border-white/10 rounded-xl"
                      />
                    </div>
                    <div className="space-y-4">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Hora</Label>
                      <Input 
                        type="time"
                        value={newEvent.time}
                        onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                        className="h-12 bg-white/5 border-white/10 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tipo</Label>
                    <select 
                      value={newEvent.type}
                      onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as any })}
                      className="w-full h-12 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-bold outline-none"
                    >
                      <option value="Market Opening">Abertura de Mercado</option>
                      <option value="Economic Event">Evento Econômico</option>
                      <option value="Review">Revisão</option>
                      <option value="Personal">Pessoal</option>
                    </select>
                  </div>
                </CardContent>
                <CardFooter className="p-8 border-t border-white/5 bg-white/5 flex justify-end gap-4">
                  <Button variant="ghost" onClick={() => setShowAddModal(false)}>Cancelar</Button>
                  <Button variant="premium" onClick={handleSaveEvent}>Salvar Evento</Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
