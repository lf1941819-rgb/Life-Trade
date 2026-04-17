import * as React from 'react';
import { 
  TrendingUp, 
  Mail, 
  Lock, 
  ArrowRight, 
  ShieldCheck, 
  Zap,
  ChevronRight,
  User
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { cn } from '../lib/utils';
// TODO: Uncomment and use the logo below when logo.svg is available in src/assets/brand/
// import logo from '../assets/brand/logo.svg';

interface LoginProps {
  onLogin: () => void;
}

export const Login = ({ onLogin }: LoginProps) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await onLogin();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]"></div>
      
      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center space-y-4">
          {/* LOGO PLACEHOLDER: Replace TrendingUp icon with actual logo when available */}
          {/* To use logo: import logo from '../assets/brand/logo.svg' and replace this div */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl premium-gradient shadow-2xl shadow-primary/30 mb-4 animate-bounce">
            <TrendingUp className="w-10 h-10 text-black" />
          </div>
          {/* LOGO PLACEHOLDER: Replace div above with: <img src={logo} alt="LIFE Trade Logo" className="w-16 h-16 object-contain" /> */}
          <h1 className="text-4xl font-bold tracking-tighter premium-text">LIFE TRADE</h1>
          <p className="text-muted-foreground text-sm uppercase tracking-[0.3em] font-bold">Premium Operational Suite</p>
        </div>

        <Card className="border-white/10 bg-card/50 backdrop-blur-2xl shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Acesso Premium</CardTitle>
            <CardDescription className="text-center">Entre com sua conta Google para gerenciar suas operações</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleGoogleLogin}
              variant="premium" 
              className="w-full h-14 text-base font-bold group"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  Autenticando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Entrar com Google
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 border-t border-white/5 p-6">
            <div className="flex items-center justify-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Secure SSL</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-widest">High Speed</span>
              </div>
            </div>
          </CardFooter>
        </Card>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Acesso restrito a traders autorizados.
          </p>
        </div>
      </div>
    </div>
  );
};
