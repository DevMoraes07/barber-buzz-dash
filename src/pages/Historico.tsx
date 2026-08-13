import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Clock, DollarSign, Scissors, Search, CalendarDays, Plus, Loader2 } from "lucide-react";
import { useState, useMemo, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Atendimento {
  id: string;
  cliente: string;
  servicos: string[];
  data: string;
  hora: string;
  valor: number;
  barbeiro: string | null;
}

const Historico = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [historico, setHistorico] = useState<Atendimento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  const [filtroData, setFiltroData] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [cliente, setCliente] = useState("");
  const [servicos, setServicos] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [valor, setValor] = useState("");
  const [barbeiro, setBarbeiro] = useState("");

  const carregar = useCallback(async () => {
    const { data: rows, error } = await supabase
      .from("atendimentos")
      .select("id, cliente, servicos, data, hora, valor, barbeiro")
      .order("data", { ascending: false });
    if (error) {
      toast({ title: "Erro ao carregar histórico", description: error.message, variant: "destructive" });
    } else {
      setHistorico((rows ?? []).map(r => ({ ...r, valor: Number(r.valor) })));
    }
    setCarregando(false);
  }, [toast]);

  useEffect(() => { carregar(); }, [carregar]);

  const filtrado = useMemo(() => {
    return historico.filter(h => {
      const matchBusca = !busca || h.cliente.toLowerCase().includes(busca.toLowerCase()) || h.servicos.some(s => s.toLowerCase().includes(busca.toLowerCase()));
      const matchData = !filtroData || h.data === filtroData;
      return matchBusca && matchData;
    });
  }, [historico, busca, filtroData]);

  const totalFiltrado = filtrado.reduce((sum, h) => sum + h.valor, 0);

  const handleRegistrar = async () => {
    if (!user || !cliente || !data || !hora) {
      toast({ title: "Preencha cliente, data e hora", variant: "destructive" });
      return;
    }
    const { error } = await supabase.from("atendimentos").insert({
      user_id: user.id,
      cliente,
      servicos: servicos.split(",").map(s => s.trim()).filter(Boolean),
      data,
      hora,
      valor: Number(valor) || 0,
      barbeiro: barbeiro || null,
    });
    if (error) {
      toast({ title: "Erro ao registrar", description: error.message, variant: "destructive" });
      return;
    }
    setDialogOpen(false);
    setCliente(""); setServicos(""); setData(""); setHora(""); setValor(""); setBarbeiro("");
    toast({ title: "Atendimento registrado!" });
    carregar();
  };

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
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="border-primary text-primary text-sm px-4 py-2">
                  Total: R$ {totalFiltrado.toFixed(2)}
                </Badge>
                <Button onClick={() => setDialogOpen(true)} className="bg-gradient-primary hover:opacity-90">
                  <Plus className="h-4 w-4 mr-2" /> Registrar
                </Button>
              </div>
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

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogContent className="bg-card border-border">
                <DialogHeader><DialogTitle>Registrar Atendimento</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div><Label>Cliente</Label><Input value={cliente} onChange={e => setCliente(e.target.value)} /></div>
                  <div><Label>Serviços (separados por vírgula)</Label><Input value={servicos} onChange={e => setServicos(e.target.value)} placeholder="Corte, Barba" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Data</Label><Input type="date" value={data} onChange={e => setData(e.target.value)} /></div>
                    <div><Label>Hora</Label><Input type="time" value={hora} onChange={e => setHora(e.target.value)} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Valor (R$)</Label><Input type="number" step="0.01" value={valor} onChange={e => setValor(e.target.value)} /></div>
                    <div><Label>Barbeiro</Label><Input value={barbeiro} onChange={e => setBarbeiro(e.target.value)} /></div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                  <Button onClick={handleRegistrar} className="bg-gradient-primary">Salvar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <div className="grid gap-4">
              {carregando ? (
                <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
              ) : filtrado.length === 0 ? (
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <Scissors className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground">Nenhum atendimento encontrado</h3>
                    <p className="text-sm text-muted-foreground/70 mt-1">Registre um atendimento ou ajuste os filtros</p>
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
                      {atendimento.barbeiro && <CardDescription>Barbeiro: {atendimento.barbeiro}</CardDescription>}
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {atendimento.servicos.map((servico, i) => (
                          <Badge key={i} variant="secondary" className="bg-primary/20 text-primary">{servico}</Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1"><Calendar className="h-4 w-4" />{new Date(atendimento.data + "T00:00:00").toLocaleDateString('pt-BR')}</div>
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
