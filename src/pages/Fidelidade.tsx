import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Gift, Star, Trophy, Crown } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Fidelidade = () => {
  const { toast } = useToast();
  const [pontos, setPontos] = useState(850);
  const [resgateAlvo, setResgateAlvo] = useState<{ nome: string; pontos: number } | null>(null);

  const [historicoPontos, setHistoricoPontos] = useState([
    { data: "2024-08-10", acao: "Corte + Barba", pontos: 50 },
    { data: "2024-08-05", acao: "Indicação de amigo", pontos: 100 },
    { data: "2024-08-01", acao: "Corte Masculino", pontos: 25 },
    { data: "2024-07-28", acao: "Resgate: Desconto 20%", pontos: -200 },
  ]);

  const recompensas = [
    { nome: "Desconto 10%", pontos: 200 },
    { nome: "Desconto 20%", pontos: 400 },
    { nome: "Corte Grátis", pontos: 1000 },
    { nome: "Tratamento Premium", pontos: 1500 },
  ];

  const proximo = 1000;
  const nivel = pontos >= 1000 ? "Diamante" : pontos >= 500 ? "Ouro" : pontos >= 100 ? "Prata" : "Bronze";

  const handleResgate = () => {
    if (!resgateAlvo) return;
    setPontos(p => p - resgateAlvo.pontos);
    setHistoricoPontos(prev => [{ data: new Date().toISOString().split('T')[0], acao: `Resgate: ${resgateAlvo.nome}`, pontos: -resgateAlvo.pontos }, ...prev]);
    toast({ title: "Recompensa resgatada!", description: `${resgateAlvo.nome} aplicado com sucesso.` });
    setResgateAlvo(null);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-background">
        <AppSidebar />
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">Programa Fidelidade</h1>
              <p className="text-muted-foreground mt-1 text-sm">Acumule pontos e ganhe recompensas exclusivas</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="text-center pb-2">
                  <Crown className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle>Nível {nivel}</CardTitle>
                  <CardDescription>Status atual</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">{pontos}</div>
                  <p className="text-sm text-muted-foreground">pontos acumulados</p>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="text-center pb-2">
                  <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle>12 Cortes</CardTitle>
                  <CardDescription>Este mês</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-xl font-bold text-primary mb-1">Próxima meta</div>
                  <p className="text-sm text-muted-foreground">Corte Grátis</p>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="text-center pb-2">
                  <Star className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle>Progresso</CardTitle>
                  <CardDescription>Para próximo nível</CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress value={(pontos / proximo) * 100} className="mb-2" />
                  <p className="text-sm text-center text-muted-foreground">{Math.max(0, proximo - pontos)} pontos restantes</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Gift className="h-5 w-5 text-primary" /> Recompensas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recompensas.map((r, i) => {
                    const disponivel = pontos >= r.pontos;
                    return (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border/30">
                        <div>
                          <h4 className="font-medium">{r.nome}</h4>
                          <p className="text-sm text-muted-foreground">{r.pontos} pontos</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={disponivel ? "default" : "secondary"}>{disponivel ? "Disponível" : "Bloqueado"}</Badge>
                          {disponivel && (
                            <Button size="sm" onClick={() => setResgateAlvo(r)} className="bg-gradient-primary hover:opacity-90">Resgatar</Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader><CardTitle>Histórico de Pontos</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {historicoPontos.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border/30">
                      <div>
                        <h4 className="font-medium">{item.acao}</h4>
                        <p className="text-sm text-muted-foreground">{new Date(item.data).toLocaleDateString('pt-BR')}</p>
                      </div>
                      <div className={`font-bold ${item.pontos > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {item.pontos > 0 ? '+' : ''}{item.pontos}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Redeem confirmation */}
            <AlertDialog open={resgateAlvo !== null} onOpenChange={(open) => !open && setResgateAlvo(null)}>
              <AlertDialogContent className="bg-card border-border">
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar resgate</AlertDialogTitle>
                  <AlertDialogDescription>
                    Deseja resgatar "{resgateAlvo?.nome}" por {resgateAlvo?.pontos} pontos? Seu saldo ficará em {pontos - (resgateAlvo?.pontos || 0)} pontos.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleResgate} className="bg-gradient-primary">Confirmar Resgate</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Fidelidade;
