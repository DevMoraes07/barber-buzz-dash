import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Gift, Star, Trophy, Crown } from "lucide-react";

const Fidelidade = () => {
  const pontosFidelidade = {
    atual: 850,
    proximo: 1000,
    nivel: "Ouro",
    cortes: 12,
    proximaRecompensa: "Corte Grátis"
  };

  const historicoPontos = [
    { data: "2024-08-10", acao: "Corte + Barba", pontos: +50 },
    { data: "2024-08-05", acao: "Indicação de amigo", pontos: +100 },
    { data: "2024-08-01", acao: "Corte Masculino", pontos: +25 },
    { data: "2024-07-28", acao: "Resgate: Desconto 20%", pontos: -200 },
  ];

  const recompensas = [
    { nome: "Desconto 10%", pontos: 200, disponivel: true },
    { nome: "Desconto 20%", pontos: 400, disponivel: true },
    { nome: "Corte Grátis", pontos: 1000, disponivel: false },
    { nome: "Tratamento Premium", pontos: 1500, disponivel: false },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-background">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Programa Fidelidade
              </h1>
              <p className="text-muted-foreground mt-2">
                Acumule pontos e ganhe recompensas exclusivas
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <Crown className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle>Nível {pontosFidelidade.nivel}</CardTitle>
                  <CardDescription>Status atual</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {pontosFidelidade.atual}
                  </div>
                  <p className="text-sm text-muted-foreground">pontos acumulados</p>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle>{pontosFidelidade.cortes} Cortes</CardTitle>
                  <CardDescription>Este mês</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-2xl font-bold text-primary mb-2">
                    Próxima meta
                  </div>
                  <p className="text-sm text-muted-foreground">{pontosFidelidade.proximaRecompensa}</p>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <Star className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle>Progresso</CardTitle>
                  <CardDescription>Para próximo nível</CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress 
                    value={(pontosFidelidade.atual / pontosFidelidade.proximo) * 100} 
                    className="mb-2"
                  />
                  <p className="text-sm text-center text-muted-foreground">
                    {pontosFidelidade.proximo - pontosFidelidade.atual} pontos restantes
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="h-5 w-5 text-primary" />
                    Recompensas Disponíveis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recompensas.map((recompensa, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border/30">
                      <div>
                        <h4 className="font-medium">{recompensa.nome}</h4>
                        <p className="text-sm text-muted-foreground">{recompensa.pontos} pontos</p>
                      </div>
                      <Badge variant={recompensa.disponivel ? "default" : "secondary"}>
                        {recompensa.disponivel ? "Disponível" : "Bloqueado"}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Histórico de Pontos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {historicoPontos.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border/30">
                      <div>
                        <h4 className="font-medium">{item.acao}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(item.data).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className={`font-bold ${item.pontos > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {item.pontos > 0 ? '+' : ''}{item.pontos}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Fidelidade;