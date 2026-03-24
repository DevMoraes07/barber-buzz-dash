import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, DollarSign, Scissors, Search, CalendarDays } from "lucide-react";
import { useState, useMemo } from "react";

const Historico = () => {
  const historico = [
    { id: 1, cliente: "João Silva", servicos: ["Corte", "Barba"], data: "2024-08-10", hora: "14:00", valor: 45.00, barbeiro: "Carlos" },
    { id: 2, cliente: "Pedro Santos", servicos: ["Corte Masculino"], data: "2024-08-08", hora: "16:30", valor: 25.00, barbeiro: "Miguel" },
    { id: 3, cliente: "Carlos Lima", servicos: ["Barba", "Bigode", "Sobrancelha"], data: "2024-08-05", hora: "10:15", valor: 35.00, barbeiro: "Carlos" },
    { id: 4, cliente: "Roberto Oliveira", servicos: ["Corte", "Barba", "Lavagem"], data: "2024-08-03", hora: "15:00", valor: 55.00, barbeiro: "Miguel" },
  ];

  const [busca, setBusca] = useState("");
  const [filtroData, setFiltroData] = useState("");

  const filtrado = useMemo(() => {
    return historico.filter(h => {
      const matchBusca = !busca || h.cliente.toLowerCase().includes(busca.toLowerCase()) || h.servicos.some(s => s.toLowerCase().includes(busca.toLowerCase()));
      const matchData = !filtroData || h.data === filtroData;
      return matchBusca && matchData;
    });
  }, [busca, filtroData]);

  const totalFiltrado = filtrado.reduce((sum, h) => sum + h.valor, 0);

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-background">
        <AppSidebar />
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">Histórico de Atendimentos</h1>
                <p className="text-muted-foreground mt-1 text-sm">Visualize o histórico completo de atendimentos realizados</p>
              </div>
              <Badge variant="outline" className="border-primary text-primary text-sm px-4 py-2">
                Total: R$ {totalFiltrado.toFixed(2)}
              </Badge>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar por cliente ou serviço..." value={busca} onChange={e => setBusca(e.target.value)} className="pl-9" />
              </div>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="date" value={filtroData} onChange={e => setFiltroData(e.target.value)} className="pl-9 w-full sm:w-auto" />
              </div>
              {(busca || filtroData) && (
                <Button variant="ghost" size="sm" onClick={() => { setBusca(""); setFiltroData(""); }}>Limpar</Button>
              )}
            </div>

            <div className="grid gap-4">
              {filtrado.length === 0 ? (
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <Scissors className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground">Nenhum atendimento encontrado</h3>
                    <p className="text-sm text-muted-foreground/70 mt-1">Tente ajustar os filtros de busca</p>
                  </CardContent>
                </Card>
              ) : (
                filtrado.map((atendimento) => (
                  <Card key={atendimento.id} className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-base">
                          <Scissors className="h-4 w-4 text-primary" /> {atendimento.cliente}
                        </CardTitle>
                        <div className="flex items-center gap-1 text-lg font-semibold text-primary">
                          <DollarSign className="h-4 w-4" /> R$ {atendimento.valor.toFixed(2)}
                        </div>
                      </div>
                      <CardDescription>Barbeiro: {atendimento.barbeiro}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {atendimento.servicos.map((servico, i) => (
                          <Badge key={i} variant="secondary" className="bg-primary/20 text-primary">{servico}</Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1"><Calendar className="h-4 w-4" />{new Date(atendimento.data).toLocaleDateString('pt-BR')}</div>
                        <div className="flex items-center gap-1"><Clock className="h-4 w-4" />{atendimento.hora}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Historico;
