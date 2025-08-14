import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Plus, User } from "lucide-react";

const Agendamentos = () => {
  const agendamentos = [
    {
      id: 1,
      cliente: "João Silva",
      servico: "Corte + Barba",
      data: "2024-08-15",
      hora: "14:00",
      status: "confirmado"
    },
    {
      id: 2,
      cliente: "Pedro Santos",
      servico: "Corte Masculino",
      data: "2024-08-15",
      hora: "15:30",
      status: "pendente"
    },
    {
      id: 3,
      cliente: "Carlos Lima",
      servico: "Barba + Bigode",
      data: "2024-08-16",
      hora: "10:00",
      status: "confirmado"
    }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-background">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Agendamentos
                </h1>
                <p className="text-muted-foreground mt-2">
                  Gerencie todos os agendamentos da barbearia
                </p>
              </div>
              <Button className="bg-gradient-primary hover:opacity-90 transition-opacity">
                <Plus className="h-4 w-4 mr-2" />
                Novo Agendamento
              </Button>
            </div>

            <div className="grid gap-6">
              {agendamentos.map((agendamento) => (
                <Card key={agendamento.id} className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" />
                        {agendamento.cliente}
                      </CardTitle>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        agendamento.status === 'confirmado' 
                          ? 'bg-emerald-500/20 text-emerald-400' 
                          : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {agendamento.status}
                      </span>
                    </div>
                    <CardDescription>{agendamento.servico}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(agendamento.data).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {agendamento.hora}
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

export default Agendamentos;