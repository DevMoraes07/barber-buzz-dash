import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Calendar as CalendarIcon, Clock, Plus, User, Check, X, Search, CalendarDays } from "lucide-react";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";

interface Agendamento {
  id: number;
  cliente: string;
  servico: string;
  data: string;
  hora: string;
  status: string;
}

const Agendamentos = () => {
  const { toast } = useToast();
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([
    { id: 1, cliente: "João Silva", servico: "Corte + Barba", data: "2024-08-15", hora: "14:00", status: "confirmado" },
    { id: 2, cliente: "Pedro Santos", servico: "Corte Masculino", data: "2024-08-15", hora: "15:30", status: "pendente" },
    { id: 3, cliente: "Carlos Lima", servico: "Barba + Bigode", data: "2024-08-16", hora: "10:00", status: "confirmado" },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [cancelId, setCancelId] = useState<number | null>(null);
  const [novoCliente, setNovoCliente] = useState("");
  const [novoServico, setNovoServico] = useState("");
  const [novaData, setNovaData] = useState("");
  const [novaHora, setNovaHora] = useState("");
  const [busca, setBusca] = useState("");
  const [filtroData, setFiltroData] = useState("");

  const agendamentosFiltrados = useMemo(() => {
    return agendamentos.filter(ag => {
      const matchBusca = !busca || ag.cliente.toLowerCase().includes(busca.toLowerCase()) || ag.servico.toLowerCase().includes(busca.toLowerCase());
      const matchData = !filtroData || ag.data === filtroData;
      return matchBusca && matchData;
    });
  }, [agendamentos, busca, filtroData]);

  const handleNovoAgendamento = () => {
    if (!novoCliente || !novoServico || !novaData || !novaHora) {
      toast({ title: "Preencha todos os campos", variant: "destructive" });
      return;
    }
    setAgendamentos(prev => [...prev, { id: Date.now(), cliente: novoCliente, servico: novoServico, data: novaData, hora: novaHora, status: "pendente" }]);
    setDialogOpen(false);
    setNovoCliente(""); setNovoServico(""); setNovaData(""); setNovaHora("");
    toast({ title: "Agendamento criado!", description: `${novoCliente} - ${novoServico}` });
  };

  const handleConfirmar = (id: number) => {
    setAgendamentos(prev => prev.map(ag => ag.id === id ? { ...ag, status: "confirmado" } : ag));
    toast({ title: "Agendamento Confirmado" });
  };

  const handleCancelar = () => {
    if (cancelId === null) return;
    setAgendamentos(prev => prev.filter(ag => ag.id !== cancelId));
    setCancelId(null);
    toast({ title: "Agendamento Cancelado", variant: "destructive" });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-background">
        <AppSidebar />
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">Agendamentos</h1>
                <p className="text-muted-foreground mt-1 text-sm">Gerencie todos os agendamentos da barbearia</p>
              </div>
              <Button onClick={() => setDialogOpen(true)} className="bg-gradient-primary hover:opacity-90 transition-opacity w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" /> Novo Agendamento
              </Button>
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

            {/* New appointment dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogContent className="bg-card border-border">
                <DialogHeader><DialogTitle>Novo Agendamento</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div><Label>Cliente</Label><Input value={novoCliente} onChange={e => setNovoCliente(e.target.value)} placeholder="Nome do cliente" /></div>
                  <div>
                    <Label>Serviço</Label>
                    <Select value={novoServico} onValueChange={setNovoServico}>
                      <SelectTrigger><SelectValue placeholder="Selecione o serviço" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Corte Masculino">Corte Masculino</SelectItem>
                        <SelectItem value="Corte + Barba">Corte + Barba</SelectItem>
                        <SelectItem value="Barba + Bigode">Barba + Bigode</SelectItem>
                        <SelectItem value="Corte Infantil">Corte Infantil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Data</Label><Input type="date" value={novaData} onChange={e => setNovaData(e.target.value)} /></div>
                    <div><Label>Hora</Label><Input type="time" value={novaHora} onChange={e => setNovaHora(e.target.value)} /></div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                  <Button onClick={handleNovoAgendamento} className="bg-gradient-primary">Criar Agendamento</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Cancel confirmation */}
            <AlertDialog open={cancelId !== null} onOpenChange={(open) => !open && setCancelId(null)}>
              <AlertDialogContent className="bg-card border-border">
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar cancelamento</AlertDialogTitle>
                  <AlertDialogDescription>Tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Voltar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleCancelar} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Cancelar Agendamento</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* List */}
            <div className="grid gap-4">
              {agendamentosFiltrados.length === 0 ? (
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <CalendarIcon className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground">Nenhum agendamento encontrado</h3>
                    <p className="text-sm text-muted-foreground/70 mt-1">
                      {busca || filtroData ? "Tente ajustar os filtros de busca" : "Clique em 'Novo Agendamento' para criar o primeiro"}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                agendamentosFiltrados.map((ag) => (
                  <Card key={ag.id} className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-base">
                          <User className="h-4 w-4 text-primary" /> {ag.cliente}
                        </CardTitle>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${ag.status === 'confirmado' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                          {ag.status}
                        </span>
                      </div>
                      <CardDescription>{ag.servico}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1"><CalendarIcon className="h-4 w-4" />{new Date(ag.data).toLocaleDateString('pt-BR')}</div>
                        <div className="flex items-center gap-1"><Clock className="h-4 w-4" />{ag.hora}</div>
                      </div>
                      <div className="flex gap-2 pt-3">
                        {ag.status === 'pendente' && (
                          <Button size="sm" onClick={() => handleConfirmar(ag.id)} className="flex-1">
                            <Check className="h-4 w-4 mr-1" /> Confirmar
                          </Button>
                        )}
                        <Button variant="destructive" size="sm" onClick={() => setCancelId(ag.id)} className="flex-1">
                          <X className="h-4 w-4 mr-1" /> Cancelar
                        </Button>
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

export default Agendamentos;
