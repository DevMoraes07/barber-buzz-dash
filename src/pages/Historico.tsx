import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, DollarSign, Scissors } from "lucide-react";

const Historico = () => {
  const historico = [
    {
      id: 1,
      cliente: "João Silva",
      servicos: ["Corte", "Barba"],
      data: "2024-08-10",
      hora: "14:00",
      valor: 45.00,
      barbeiro: "Carlos"
    },
    {
      id: 2,
      cliente: "Pedro Santos",
      servicos: ["Corte Masculino"],
      data: "2024-08-08",
      hora: "16:30",
      valor: 25.00,
      barbeiro: "Miguel"
    },
    {
      id: 3,
      cliente: "Carlos Lima",
      servicos: ["Barba", "Bigode", "Sobrancelha"],
      data: "2024-08-05",
      hora: "10:15",
      valor: 35.00,
      barbeiro: "Carlos"
    },
    {
      id: 4,
      cliente: "Roberto Oliveira",
      servicos: ["Corte", "Barba", "Lavagem"],
      data: "2024-08-03",
      hora: "15:00",
      valor: 55.00,
      barbeiro: "Miguel"
    }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-background">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Histórico de Atendimentos
              </h1>
              <p className="text-muted-foreground mt-2">
                Visualize o histórico completo de atendimentos realizados
              </p>
            </div>

            <div className="grid gap-6">
              {historico.map((atendimento) => (
                <Card key={atendimento.id} className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Scissors className="h-5 w-5 text-primary" />
                        {atendimento.cliente}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                        <DollarSign className="h-5 w-5" />
                        R$ {atendimento.valor.toFixed(2)}
                      </div>
                    </div>
                    <CardDescription>
                      Barbeiro: {atendimento.barbeiro}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {atendimento.servicos.map((servico, index) => (
                          <Badge key={index} variant="secondary" className="bg-primary/20 text-primary">
                            {servico}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(atendimento.data).toLocaleDateString('pt-BR')}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {atendimento.hora}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Historico;