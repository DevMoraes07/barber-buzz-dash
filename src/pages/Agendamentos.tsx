import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Calendar as CalendarIcon, Clock, Plus, User, Check, X } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Agendamentos = () => {
  const { toast } = useToast();
  const [agendamentos, setAgendamentos] = useState([
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
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [novoCliente, setNovoCliente] = useState("");
  const [novoServico, setNovoServico] = useState("");
  const [novaData, setNovaData] = useState("");
  const [novaHora, setNovaHora] = useState("");

  const handleNovoAgendamento = () => {
    if (!novoCliente || !novoServico || !novaData || !novaHora) {
      toast({ title: "Preencha todos os campos", variant: "destructive" });
      return;
    }
    const novo = {
      id: Date.now(),
      cliente: novoCliente,
      servico: novoServico,
      data: novaData,
      hora: novaHora,
      status: "pendente" as const,
    };
    setAgendamentos(prev => [...prev, novo]);
    setDialogOpen(false);
    setNovoCliente("");
    setNovoServico("");
    setNovaData("");
    setNovaHora("");
    toast({ title: "Agendamento criado!", description: `${novoCliente} - ${novoServico}` });
  };

  const handleConfirmarAgendamento = (id: number) => {
    setAgendamentos(prev => 
      prev.map(ag => 
        ag.id === id ? { ...ag, status: "confirmado" } : ag
      )
    );
    toast({
      title: "Agendamento Confirmado",
      description: "O agendamento foi confirmado com sucesso",
    });
  };

  const handleCancelarAgendamento = (id: number) => {
    setAgendamentos(prev => prev.filter(ag => ag.id !== id));
    toast({
      title: "Agendamento Cancelado",
      description: "O agendamento foi cancelado",
      variant: "destructive",
    });
  };

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
              <Button 
                onClick={() => setDialogOpen(true)}
                className="bg-gradient-primary hover:opacity-90 transition-opacity"
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Agendamento
              </Button>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogContent className="bg-card border-border">
                <DialogHeader>
                  <DialogTitle>Novo Agendamento</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Cliente</Label>
                    <Input value={novoCliente} onChange={e => setNovoCliente(e.target.value)} placeholder="Nome do cliente" />
                  </div>
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
                    <div>
                      <Label>Data</Label>
                      <Input type="date" value={novaData} onChange={e => setNovaData(e.target.value)} />
                    </div>
                    <div>
                      <Label>Hora</Label>
                      <Input type="time" value={novaHora} onChange={e => setNovaHora(e.target.value)} />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                  <Button onClick={handleNovoAgendamento} className="bg-gradient-primary">Criar Agendamento</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

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
                        <CalendarIcon className="h-4 w-4" />
                        {new Date(agendamento.data).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {agendamento.hora}
                      </div>
                    </div>
                    <div className="flex gap-2 pt-4">
                      {agendamento.status === 'pendente' && (
                        <Button
                          size="sm"
                          onClick={() => handleConfirmarAgendamento(agendamento.id)}
                          className="flex-1"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Confirmar
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancelarAgendamento(agendamento.id)}
                        className="flex-1"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancelar
                      </Button>
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