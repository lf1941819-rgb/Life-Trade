import * as React from 'react';
import { 
  User, 
  Shield, 
  Bell, 
  Globe, 
  CreditCard, 
  Database, 
  Smartphone,
  ChevronRight,
  Moon,
  Sun,
  DollarSign,
  Coins,
  TrendingUp,
  Zap,
  ShieldCheck,
  Key,
  LogOut,
  Mail,
  Clock,
  Activity,
  Download,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Label } from '@/src/components/ui/Label';
import { Badge } from '@/src/components/ui/Badge';
import { cn } from '@/src/lib/utils';
import { motion } from 'framer-motion';

import { UserProfile } from '@/src/types';

export const Settings = ({ user, onLogout, onNavigate }: { user: UserProfile | null, onLogout?: () => void, onNavigate?: (tab: string) => void }) => {
  const [activeSection, setActiveSection] = React.useState('profile');
  const [isSaving, setIsSaving] = React.useState(false);
  const [avatar, setAvatar] = React.useState<string | null>(user?.photoURL || null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [formData, setFormData] = React.useState({
    name: user?.name || 'Master Trader',
    email: user?.email || 'trader@lifetrade.com',
    currency: 'USD - Dólar Americano',
    timezone: '(GMT-03:00) São Paulo',
    pointsPerOp: '100',
    password: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [toggles, setToggles] = React.useState({
    autoLot: true,
    drawdownAlert: false,
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    twoFactor: false
  });

  // Load from user prop and localStorage on mount
  React.useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name,
        email: user.email,
      }));
      if (user.photoURL) setAvatar(user.photoURL);
    }

    const savedData = localStorage.getItem('life_trade_settings');
    const savedToggles = localStorage.getItem('life_trade_toggles');
    
    if (savedData) setFormData(prev => ({ ...prev, ...JSON.parse(savedData) }));
    if (savedToggles) setToggles(prev => ({ ...prev, ...JSON.parse(savedToggles) }));
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
            <Card className="glass-card border-white/5 overflow-hidden">
              <CardHeader className="pb-8 border-b border-white/5 bg-white/5">
                <CardTitle className="text-xl">Perfil do Trader</CardTitle>
                <CardDescription className="text-xs font-medium">Informações públicas e de identificação institucional.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-10">
                <div className="flex items-center gap-8">
                  <div 
                    className="w-28 h-28 rounded-3xl premium-gradient p-1 shadow-2xl shadow-primary/20 relative group cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="w-full h-full rounded-[20px] bg-background flex items-center justify-center overflow-hidden">
                      {avatar ? (
                        <img src={avatar} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <User className="w-14 h-14 text-primary group-hover:scale-110 transition-transform duration-500" />
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black/60 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                      <span className="text-[10px] font-bold text-white uppercase tracking-widest">Alterar Foto</span>
                    </div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleAvatarChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-2xl font-bold premium-text font-display tracking-tight">{formData.name}</h4>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <p className="text-sm font-medium">{formData.email}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px] font-bold px-3 py-1 rounded-full">PLANO INSTITUCIONAL PRO</Badge>
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 text-[10px] font-bold px-3 py-1 rounded-full">VERIFICADO</Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Nome Completo</Label>
                    <Input 
                      value={formData.name} 
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="h-12 bg-white/5 border-white/10 focus:border-primary/50 rounded-xl transition-all" 
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Email Institucional</Label>
                    <Input 
                      value={formData.email} 
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="h-12 bg-white/5 border-white/10 focus:border-primary/50 rounded-xl transition-all" 
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Moeda Principal</Label>
                    <div className="relative group">
                      <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <select 
                        value={formData.currency}
                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                        className="w-full h-12 rounded-xl border border-white/10 bg-white/5 pl-11 pr-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/50 appearance-none transition-all"
                      >
                        <option>USD - Dólar Americano</option>
                        <option>EUR - Euro</option>
                        <option>BRL - Real Brasileiro</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Timezone Operacional</Label>
                    <div className="relative group">
                      <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <select 
                        value={formData.timezone}
                        onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                        className="w-full h-12 rounded-xl border border-white/10 bg-white/5 pl-11 pr-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/50 appearance-none transition-all"
                      >
                        <option>(GMT-03:00) São Paulo</option>
                        <option>(GMT+00:00) London</option>
                        <option>(GMT-05:00) New York</option>
                      </select>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-white/5 p-8 bg-white/5 flex justify-end">
                <Button 
                  variant="premium" 
                  className="h-12 px-10 shadow-xl shadow-primary/20"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        );
      case 'security':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
            <Card className="glass-card border-white/5 overflow-hidden">
              <CardHeader className="pb-8 border-b border-white/5 bg-white/5">
                <CardTitle className="text-xl">Segurança & Chaves</CardTitle>
                <CardDescription className="text-xs font-medium">Gerencie suas chaves de API e configurações de segurança.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                          <Key className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-bold">Gemini API Key</p>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Configurada via Secrets</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">ATIVA</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Sua chave de API do Gemini é gerenciada de forma segura pelo servidor. Você pode configurar ou atualizar sua chave no painel de segredos do AI Studio.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                          <Shield className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-bold">Autenticação de Dois Fatores (2FA)</p>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Proteção Adicional</p>
                        </div>
                      </div>
                      <div 
                        onClick={() => setToggles({ ...toggles, twoFactor: !toggles.twoFactor })}
                        className={cn(
                          "w-14 h-7 rounded-full relative cursor-pointer shadow-lg transition-all hover:scale-105",
                          toggles.twoFactor ? "bg-primary shadow-primary/20" : "bg-white/10 border border-white/10"
                        )}
                      >
                        <motion.div 
                          animate={{ x: toggles.twoFactor ? 28 : 4 }}
                          className="absolute top-1 w-5 h-5 bg-black rounded-full shadow-md"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-primary">Alterar Senha</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input 
                        type="password" 
                        placeholder="Senha Atual" 
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="h-12 bg-white/5 border-white/10 rounded-xl"
                      />
                      <Input 
                        type="password" 
                        placeholder="Nova Senha" 
                        value={formData.newPassword}
                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                        className="h-12 bg-white/5 border-white/10 rounded-xl"
                      />
                      <Input 
                        type="password" 
                        placeholder="Confirmar Senha" 
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="h-12 bg-white/5 border-white/10 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-white/5 p-8 bg-white/5 flex justify-end">
                <Button 
                  variant="premium" 
                  className="h-12 px-10 shadow-xl shadow-primary/20"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? 'Salvando...' : 'Atualizar Segurança'}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        );
      case 'notifications':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
            <Card className="glass-card border-white/5 overflow-hidden">
              <CardHeader className="pb-8 border-b border-white/5 bg-white/5">
                <CardTitle className="text-xl">Notificações</CardTitle>
                <CardDescription className="text-xs font-medium">Controle como e quando você recebe alertas institucionais.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                {[
                  { id: 'emailNotifications', label: 'Alertas por Email', desc: 'Receba resumos diários e alertas críticos no seu email.', icon: Mail },
                  { id: 'pushNotifications', label: 'Notificações Push', desc: 'Alertas em tempo real no navegador sobre execuções e metas.', icon: Zap },
                  { id: 'weeklyReports', label: 'Relatórios Semanais', desc: 'Análise detalhada de performance enviada todo domingo.', icon: Activity },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
                    <div className="flex items-center gap-5">
                      <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 group-hover:scale-110 transition-transform">
                        <item.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">{item.label}</p>
                        <p className="text-xs text-muted-foreground font-medium">{item.desc}</p>
                      </div>
                    </div>
                    <div 
                      onClick={() => setToggles({ ...toggles, [item.id]: !toggles[item.id as keyof typeof toggles] })}
                      className={cn(
                        "w-14 h-7 rounded-full relative cursor-pointer shadow-lg transition-all hover:scale-105",
                        toggles[item.id as keyof typeof toggles] ? "bg-primary shadow-primary/20" : "bg-white/10 border border-white/10"
                      )}
                    >
                      <motion.div 
                        animate={{ x: toggles[item.id as keyof typeof toggles] ? 28 : 4 }}
                        className="absolute top-1 w-5 h-5 bg-black rounded-full shadow-md"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="border-t border-white/5 p-8 bg-white/5 flex justify-end">
                <Button 
                  variant="premium" 
                  className="h-12 px-10 shadow-xl shadow-primary/20"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? 'Salvando...' : 'Salvar Preferências'}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        );
      case 'preferences':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
            <Card className="glass-card border-white/5 overflow-hidden">
              <CardHeader className="pb-8 border-b border-white/5 bg-white/5">
                <CardTitle className="text-xl">Preferências Operacionais</CardTitle>
                <CardDescription className="text-xs font-medium">Configure os padrões do sistema para cálculos institucionais.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
                  <div className="flex items-center gap-5">
                    <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 group-hover:scale-110 transition-transform">
                      <Coins className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Pontos por Operação (Padrão)</p>
                      <p className="text-xs text-muted-foreground font-medium">Usado para cálculos de meta e projeção de lote.</p>
                    </div>
                  </div>
                  <div className="w-32">
                    <Input 
                      type="number" 
                      value={formData.pointsPerOp} 
                      onChange={(e) => setFormData({ ...formData, pointsPerOp: e.target.value })}
                      className="h-12 bg-background border-white/10 text-center font-bold text-lg rounded-xl focus:border-primary/50 transition-all" 
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
                  <div className="flex items-center gap-5">
                    <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 group-hover:scale-110 transition-transform">
                      <TrendingUp className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Progressão Automática de Lote</p>
                      <p className="text-xs text-muted-foreground font-medium">Sugerir novo lote com base na regra institucional de 10 operações.</p>
                    </div>
                  </div>
                  <div 
                    onClick={() => setToggles({ ...toggles, autoLot: !toggles.autoLot })}
                    className={cn(
                      "w-14 h-7 rounded-full relative cursor-pointer shadow-lg transition-all hover:scale-105",
                      toggles.autoLot ? "bg-primary shadow-primary/20" : "bg-white/10 border border-white/10"
                    )}
                  >
                    <motion.div 
                      animate={{ x: toggles.autoLot ? 28 : 4 }}
                      className="absolute top-1 w-5 h-5 bg-black rounded-full shadow-md"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
                  <div className="flex items-center gap-5">
                    <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 group-hover:scale-110 transition-transform">
                      <Activity className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Alertas de Drawdown</p>
                      <p className="text-xs text-muted-foreground font-medium">Notificar quando o drawdown atingir 4% do capital.</p>
                    </div>
                  </div>
                  <div 
                    onClick={() => setToggles({ ...toggles, drawdownAlert: !toggles.drawdownAlert })}
                    className={cn(
                      "w-14 h-7 rounded-full relative cursor-pointer shadow-lg transition-all hover:scale-105",
                      toggles.drawdownAlert ? "bg-primary shadow-primary/20" : "bg-white/10 border border-white/10"
                    )}
                  >
                    <motion.div 
                      animate={{ x: toggles.drawdownAlert ? 28 : 4 }}
                      className="absolute top-1 w-5 h-5 bg-black rounded-full shadow-md"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-white/5 p-8 bg-white/5 flex justify-end">
                <Button 
                  variant="premium" 
                  className="h-12 px-10 shadow-xl shadow-primary/20"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? 'Salvando...' : 'Salvar Preferências'}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        );
      case 'billing':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
            <Card className="glass-card border-white/5 overflow-hidden">
              <CardHeader className="pb-8 border-b border-white/5 bg-white/5">
                <CardTitle className="text-xl">Faturamento</CardTitle>
                <CardDescription className="text-xs font-medium">Gerencie seu plano e métodos de pagamento.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="p-6 rounded-3xl bg-primary/5 border border-primary/20 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Zap className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold premium-text">Plano Institucional Pro</h4>
                      <p className="text-xs text-muted-foreground">Próxima renovação: 15 de Maio, 2026</p>
                    </div>
                  </div>
                  <Badge className="bg-primary text-black font-bold">ATIVO</Badge>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Método de Pagamento</h4>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group hover:border-primary/30 transition-all">
                    <div className="flex items-center gap-4">
                      <CreditCard className="w-6 h-6 text-primary" />
                      <div>
                        <p className="text-sm font-bold">•••• •••• •••• 4242</p>
                        <p className="text-xs text-muted-foreground">Expira em 12/28</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-primary text-[10px] font-bold uppercase tracking-widest">ALTERAR</Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-white/5 p-8 bg-white/5 flex justify-between items-center">
                <p className="text-xs text-muted-foreground font-medium italic">Faturas anteriores podem ser acessadas no histórico de pagamentos.</p>
                <Button variant="outline" className="h-10 rounded-xl text-[10px] font-bold uppercase tracking-widest">VER HISTÓRICO</Button>
              </CardFooter>
            </Card>
          </motion.div>
        );
      case 'data':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
            <Card className="glass-card border-white/5 overflow-hidden">
              <CardHeader className="pb-8 border-b border-white/5 bg-white/5">
                <CardTitle className="text-xl">Dados & Exportação</CardTitle>
                <CardDescription className="text-xs font-medium">Gerencie seu banco de dados operacional e exportações.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4 group hover:border-primary/30 transition-all">
                    <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 w-fit">
                      <Download className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="text-sm font-bold">Exportar CSV</h4>
                    <p className="text-xs text-muted-foreground">Baixe todas as suas operações em formato CSV para análise externa.</p>
                    <Button variant="outline" className="w-full h-10 rounded-xl text-[10px] font-bold uppercase tracking-widest">EXPORTAR AGORA</Button>
                  </div>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4 group hover:border-red-500/30 transition-all">
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 w-fit">
                      <Trash2 className="w-6 h-6 text-red-500" />
                    </div>
                    <h4 className="text-sm font-bold">Limpar Dados</h4>
                    <p className="text-xs text-muted-foreground">Apague permanentemente todo o seu histórico operacional (Irreversível).</p>
                    <Button 
                      variant="outline" 
                      className="w-full h-10 rounded-xl text-[10px] font-bold uppercase tracking-widest border-red-500/20 text-red-500 hover:bg-red-500/10"
                      onClick={() => {
                        if (confirm('Tem certeza que deseja apagar todos os dados? Esta ação é irreversível.')) {
                          localStorage.removeItem('life_trade_settings');
                          localStorage.removeItem('life_trade_toggles');
                          localStorage.removeItem('life_trade_avatar');
                          window.location.reload();
                        }
                      }}
                    >
                      APAGAR TUDO
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      case 'pwa':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
            <Card className="glass-card border-white/5 overflow-hidden">
              <CardHeader className="pb-8 border-b border-white/5 bg-white/5">
                <CardTitle className="text-xl">LIFE Mobile PWA</CardTitle>
                <CardDescription className="text-xs font-medium">Instale o app no seu dispositivo móvel para acesso instantâneo.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="flex flex-col md:flex-row gap-10 items-center">
                  <div className="w-48 h-48 bg-white p-4 rounded-3xl shadow-2xl">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://lifetrade.app" alt="QR Code" className="w-full h-full" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-lg font-bold premium-text">Instruções de Instalação</h4>
                      <ul className="space-y-3">
                        {[
                          { step: 1, text: 'Escaneie o QR Code ou acesse lifetrade.app no seu celular.' },
                          { step: 2, text: 'No iOS, toque em "Compartilhar" e "Adicionar à Tela de Início".' },
                          { step: 3, text: 'No Android, toque nos três pontos e "Instalar Aplicativo".' },
                        ].map((item) => (
                          <li key={item.step} className="flex gap-4 items-start">
                            <span className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">{item.step}</span>
                            <p className="text-sm text-muted-foreground font-medium">{item.text}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4 rounded-2xl bg-green-500/5 border border-green-500/10 flex items-center gap-4">
                      <ShieldCheck className="w-5 h-5 text-green-500" />
                      <p className="text-xs text-green-500 font-bold uppercase tracking-widest">Suporte a Modo Offline Ativo</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      default:
        return null;
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem('life_trade_settings', JSON.stringify(formData));
      localStorage.setItem('life_trade_toggles', JSON.stringify(toggles));
      if (avatar) localStorage.setItem('life_trade_avatar', avatar);
      
      setIsSaving(false);
      alert('Configurações salvas com sucesso localmente!');
    }, 800);
  };

  const sections = [
    { id: 'profile', icon: User, label: 'Perfil do Trader' },
    { id: 'security', icon: ShieldCheck, label: 'Segurança & Chaves' },
    { id: 'notifications', icon: Bell, label: 'Notificações' },
    { id: 'preferences', icon: Globe, label: 'Preferências' },
    { id: 'billing', icon: CreditCard, label: 'Faturamento' },
    { id: 'data', icon: Database, label: 'Dados & Exportação' },
    { id: 'pwa', icon: Smartphone, label: 'LIFE Mobile PWA' },
  ];

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(226,176,94,0.5)]"></div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">System Configuration</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tighter premium-text font-display">Configurações</h1>
          <p className="text-muted-foreground font-medium">Gerencie suas preferências, conta e segurança institucional.</p>
        </div>
        <Button 
          variant="outline" 
          className="h-12 px-6 border-red-500/20 text-red-500 hover:bg-red-500/10 transition-all rounded-xl"
          onClick={onLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sair da Conta
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <aside className="space-y-3">
          {sections.map((item, i) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              onClick={() => setActiveSection(item.id)}
              className={cn(
                "flex items-center w-full p-4 rounded-2xl transition-all text-sm font-bold uppercase tracking-widest group relative overflow-hidden",
                activeSection === item.id 
                  ? "bg-primary text-black shadow-xl shadow-primary/20" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground border border-transparent hover:border-white/10"
              )}
            >
              <item.icon className={cn("w-4 h-4 mr-4 transition-transform group-hover:scale-110", activeSection === item.id ? "text-black" : "text-primary")} />
              {item.label}
              {activeSection === item.id && <ChevronRight className="ml-auto w-4 h-4" />}
            </motion.button>
          ))}
        </aside>

        <div className="lg:col-span-3 space-y-10">
          {renderSectionContent()}
        </div>
      </div>
    </div>
  );
};
