import * as React from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  TrendingUp, 
  Target, 
  BarChart3, 
  Zap,
  MessageSquare,
  MoreVertical,
  Trash2,
  RefreshCw,
  Search,
  ChevronRight,
  ShieldCheck,
  Activity,
  BrainCircuit,
  Cpu,
  Fingerprint,
  Network,
  Info,
  History
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Badge } from '@/src/components/ui/Badge';
import { cn } from '@/src/lib/utils';
import { AIChatMessage } from '@/src/types';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";

const initialMessages: AIChatMessage[] = [
  {
    id: '1',
    userId: 'user1',
    role: 'assistant',
    content: 'Olá, Trader! Sou o LIFE Core, seu Agente Pessoal de IA. Estou conectado ao seu histórico operacional institucional. Como posso auxiliar na sua análise estratégica hoje?',
    timestamp: Date.now() - 10000,
  },
];

const suggestedQuestions = [
  "Auditoria de metas diárias",
  "Status da progressão de lote",
  "Análise de performance semanal",
  "Ativos com maior eficiência",
  "Projeção de capitalização"
];

export const AIAgent = ({ onNavigate }: { onNavigate?: (tab: string) => void }) => {
  const ai = React.useMemo(() => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }), []);
  const [messages, setMessages] = React.useState<AIChatMessage[]>(initialMessages);
  const [inputValue, setInputValue] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: AIChatMessage = {
      id: Date.now().toString(),
      userId: 'user1',
      role: 'user',
      content: inputValue,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const systemInstruction = "Você é o LIFE Core, a inteligência central do LIFE Trade. Sua voz é calma, profissional, altamente técnica e focada em resultados institucionais. Você ajuda traders a manterem a disciplina e a evoluírem seus lotes de forma matemática.";

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: 'user', parts: [{ text: systemInstruction }] },
          ...messages.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
          })),
          { role: 'user', parts: [{ text: inputValue }] }
        ]
      });

      const assistantMessage: AIChatMessage = {
        id: (Date.now() + 1).toString(),
        userId: 'user1',
        role: 'assistant',
        content: response.text || "Desculpe, tive um problema ao processar sua solicitação institucional.",
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("AI Error:", error);
      const errorMessage: AIChatMessage = {
        id: (Date.now() + 1).toString(),
        userId: 'user1',
        role: 'assistant',
        content: "Ocorreu uma interrupção no link neural. Por favor, tente novamente em instantes.",
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-14rem)] md:h-[calc(100vh-12rem)] flex flex-col gap-6 md:gap-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2 md:mb-3">
            <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-primary shadow-[0_0_12px_rgba(226,176,94,0.6)]"></div>
            <span className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] md:tracking-[0.3em]">LIFE Intelligence Core Audit</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter premium-text font-display flex flex-wrap items-center gap-3 md:gap-6">
            LIFE Core IA
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 animate-pulse text-[9px] md:text-[10px] font-bold px-3 py-1 md:px-4 md:py-1.5 rounded-full shadow-lg">NEURAL LINK ACTIVE</Badge>
          </h1>
          <p className="text-muted-foreground font-medium text-sm md:text-lg">Seu assistente pessoal para análise e disciplina operacional institucional.</p>
        </div>
        <div className="flex items-center gap-3 md:gap-4">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-12 w-12 md:h-14 md:w-14 bg-white/5 border-white/10 hover:bg-white/10 transition-all rounded-xl md:rounded-2xl shadow-xl"
            onClick={() => setMessages(initialMessages)}
          >
            <RefreshCw className="w-4 h-4 md:w-5 md:h-5" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-12 w-12 md:h-14 md:w-14 bg-white/5 border-white/10 hover:bg-white/10 transition-all rounded-xl md:rounded-2xl shadow-xl"
            onClick={() => setMessages([])}
          >
            <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
          </Button>
        </div>
      </header>

      <div className="flex-1 flex gap-6 md:gap-10 overflow-hidden">
        <Card className="flex-1 flex flex-col overflow-hidden glass-card border-primary/10 shadow-2xl rounded-3xl md:rounded-[2.5rem]">
          <CardHeader className="border-b border-white/5 bg-white/5 flex flex-row items-center justify-between p-5 md:py-8 md:px-10">
            <div className="flex items-center gap-4 md:gap-6">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-[1.5rem] premium-gradient flex items-center justify-center shadow-2xl shadow-primary/30 relative group">
                <BrainCircuit className="w-6 h-6 md:w-9 md:h-9 text-black group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 md:w-5 md:h-5 bg-green-500 border-2 md:border-4 border-background rounded-full animate-pulse shadow-lg"></div>
              </div>
              <div>
                <CardTitle className="text-lg md:text-2xl font-bold premium-text font-display tracking-tight">LIFE Intelligence</CardTitle>
                <div className="flex items-center gap-2 mt-0.5 md:mt-1">
                  <Fingerprint className="w-3 h-3 text-primary" />
                  <CardDescription className="text-[9px] md:text-[10px] uppercase font-bold text-primary tracking-[0.1em] md:tracking-[0.2em]">Biometric Link Verified</CardDescription>
                </div>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-3 md:gap-4 bg-background/50 px-4 py-2 md:px-6 md:py-3 rounded-xl md:rounded-2xl border border-white/10 shadow-inner">
              <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]"></div>
              <span className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-[0.1em] md:tracking-[0.2em]">Quantum Active</span>
            </div>
          </CardHeader>
          
          <CardContent 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-5 md:p-10 space-y-6 md:space-y-10 scrollbar-hide bg-[radial-gradient(circle_at_center,rgba(226,176,94,0.03)_0%,transparent_70%)]"
          >
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div 
                  key={msg.id} 
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className={cn(
                    "flex gap-3 md:gap-6 max-w-[90%] md:max-w-[85%]",
                    msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl shrink-0 flex items-center justify-center border shadow-2xl transition-all duration-500",
                    msg.role === 'user' 
                      ? "bg-white/10 border-white/10 hover:bg-white/20" 
                      : "bg-primary/10 border-primary/20 hover:bg-primary/20"
                  )}>
                    {msg.role === 'user' ? <User className="w-5 h-5 md:w-6 md:h-6" /> : <Cpu className="w-5 h-5 md:w-6 md:h-6 text-primary" />}
                  </div>
                  <div className={cn(
                    "p-4 md:p-6 rounded-2xl md:rounded-[2rem] text-sm md:text-base leading-relaxed shadow-2xl relative group",
                    msg.role === 'user' 
                      ? "bg-primary text-black font-bold rounded-tr-none shadow-primary/20" 
                      : "bg-white/5 border border-white/10 rounded-tl-none backdrop-blur-xl"
                  )}>
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                    <div className={cn(
                      "text-[9px] md:text-[10px] mt-3 md:mt-4 font-bold opacity-50 flex items-center gap-2",
                      msg.role === 'user' ? "text-black justify-end" : "text-muted-foreground"
                    )}>
                      {msg.role === 'assistant' && <ShieldCheck className="w-3 h-3 md:w-3.5 md:h-3.5" />}
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isTyping && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 md:gap-6 max-w-[90%] md:max-w-[85%]"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl shrink-0 flex items-center justify-center bg-primary/10 border border-primary/20 shadow-2xl">
                  <Cpu className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                </div>
                <div className="bg-white/5 border border-white/10 p-4 md:p-6 rounded-2xl md:rounded-[2rem] rounded-tl-none flex gap-2 items-center shadow-2xl backdrop-blur-xl">
                  <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-primary/50 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-primary/50 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-primary/50 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </motion.div>
            )}
          </CardContent>

          <CardFooter className="p-5 md:p-10 border-t border-white/5 bg-white/5">
            <div className="w-full space-y-6 md:space-y-8">
              <div className="flex flex-wrap gap-2 md:gap-4">
                {suggestedQuestions.map((q, i) => (
                  <motion.button 
                    key={i}
                    whileHover={{ scale: 1.05, y: -2, backgroundColor: 'rgba(226,176,94,0.1)', borderColor: 'rgba(226,176,94,0.3)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setInputValue(q)}
                    className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.1em] md:tracking-[0.2em] px-4 py-2 md:px-6 md:py-3 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 hover:text-primary transition-all duration-500 backdrop-blur-md shadow-lg"
                  >
                    {q}
                  </motion.button>
                ))}
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-primary/20 rounded-2xl md:rounded-[2rem] blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-700"></div>
                <Input 
                  placeholder="Pergunte qualquer coisa..." 
                  className="pr-16 md:pr-20 h-14 md:h-20 bg-background/50 border-white/10 focus:border-primary/50 text-sm md:text-lg rounded-2xl md:rounded-[2rem] relative z-10 backdrop-blur-2xl transition-all shadow-inner px-5 md:px-8"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button 
                  size="icon" 
                  variant="premium"
                  className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 h-10 w-10 md:h-14 md:w-14 rounded-xl md:rounded-2xl z-20 shadow-2xl shadow-primary/30 transition-all hover:scale-110"
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                >
                  <Send className="w-5 h-5 md:w-6 md:h-6" />
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>

        <div className="w-96 hidden xl:flex flex-col gap-10">
          <Card className="glass-card border-primary/20 relative overflow-hidden group shadow-2xl rounded-[2.5rem]">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full -mr-24 -mt-24 blur-[100px] group-hover:bg-primary/20 transition-all duration-700"></div>
            <CardHeader className="pb-8 p-8 border-b border-white/5 bg-white/5">
              <div className="flex items-center gap-2 mb-1">
                <Network className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">AI Capabilities Audit</span>
              </div>
              <CardTitle className="text-xl flex items-center gap-3 font-bold uppercase tracking-widest text-primary">
                <Sparkles className="w-5 h-5 animate-pulse" />
                Capacidades IA
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              {[
                { icon: TrendingUp, text: 'Análise de tendências e consistência operacional auditada.' },
                { icon: Target, text: 'Acompanhamento de metas em tempo real institucional.' },
                { icon: BarChart3, text: 'Interpretação de estatísticas complexas e correlações.' },
                { icon: Zap, text: 'Alertas de disciplina e gestão de risco neural.' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-5 group/item">
                  <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 group-hover/item:scale-110 transition-transform duration-500 shadow-lg">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed">{item.text}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="glass-card border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden">
            <CardHeader className="pb-8 p-8 border-b border-white/5 bg-white/5">
              <div className="flex items-center gap-2 mb-1">
                <History className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">Operational Context</span>
              </div>
              <CardTitle className="text-xl font-bold uppercase tracking-widest">Contexto Atual</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              {[
                { label: 'Ativo Principal', value: 'XAUUSD', icon: Activity },
                { label: 'Lote Atual', value: '0.03', icon: Target },
                { label: 'Win Rate', value: '78%', icon: TrendingUp, color: 'text-green-500' },
              ].map((item, i) => (
                <div key={i} className="space-y-3 p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:border-primary/30 transition-all duration-500 shadow-inner group/context">
                  <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em] flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 group-hover/context:text-primary transition-colors">
                      <item.icon className="w-3.5 h-3.5" />
                    </div>
                    {item.label}
                  </div>
                  <p className={cn("text-2xl font-bold font-display tracking-tight", item.color || "premium-text")}>{item.value}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
