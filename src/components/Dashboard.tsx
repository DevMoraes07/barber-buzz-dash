import { Calendar, Clock, Star, TrendingUp, Scissors, Award } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import heroImage from "@/assets/barbershop-hero.jpg";
import { MonthlyChart } from "./MonthlyChart";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Agendamento {
  id: string;
  cliente: string;
  servico: string;
  data: string;
  hora: string;
  status: string;
}

interface Atendimento {
  id: string;
  cliente: string;
  servicos: string[];
  data: string;
  valor: number;
}

export function Dashboard() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [pontos, setPontos] = useState(0);
  const [proximos, setProximos] = useState<Agendamento[]>([]);
  const [recentes, setRecentes] = useState<Atendimento[]>([]);
  const [totalMes, setTotalMes] = useState(0);
  const [faturamentoMes, setFaturamentoMes] = useState(0);

  const carregar = useCallback(async () => {
    const hoje = new Date().toISOString().split("T")[0];
    const inicioMes = hoje.slice(0, 8) + "01";

    const [{ data: perfil }, { data: ags }, { data: ats }, { data: mes }] = await Promise.all([
      supabase.from("profiles").select("nome, pontos").maybeSingle(),
      supabase.from("agendamentos").select("id, cliente, servico, data, hora, status").gte("data", hoje).order("data").order("hora").limit(3),
      supabase.from("atendimentos").select("id, cliente, servicos, data, valor").order("data", { ascending: false }).limit(3),
      supabase.from("atendimentos").select("valor").gte("data", inicioMes),
    ]);

    setNome(perfil?.nome ?? "");
    setPontos(perfil?.pontos ?? 0);
    setProximos(ags ?? []);
    setRecentes((ats ?? []).map(a => ({ ...a, valor: Number(a.valor) })));
    setTotalMes(mes?.length ?? 0);
    setFaturamentoMes((mes ?? []).reduce((s, a) => s + Number(a.valor), 0));
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  const proximo = proximos[0];
  const meta = 300;

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gradient-dark">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl h-64 bg-gradient-card shadow-elegant">
        <img
          src={heroImage}
          alt="Interior de barbearia"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative z-10 p-8 h-full flex flex-col justify-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              {nome ? `Bem-vindo, ${nome.split(" ")[0]}!` : "Bem-vindo de volta!"}
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Gerencie os agendamentos e o histórico da sua barbearia
            </p>
            <Button
              onClick={() => navigate("/agendamentos")}
              variant="default"
              size="lg"
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Agendar Agora
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-card border-border hover:shadow-glow transition-all duration-300 animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximo Agendamento</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {proximo ? `${new Date(proximo.data + "T00:00:00").toLocaleDateString("pt-BR")} ${proximo.hora}` : "—"}
            </div>
            <p className="text-xs text-muted-foreground">
              {proximo ? `${proximo.servico} · ${proximo.cliente}` : "Nenhum agendamento futuro"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border hover:shadow-glow transition-all duration-300 animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atendimentos Este Mês</CardTitle>
            <Scissors className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalMes}</div>
            <p className="text-xs text-muted-foreground">registrados no histórico</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border hover:shadow-glow transition-all duration-300 animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pontos Fidelidade</CardTitle>
            <Star className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{pontos}</div>
            <p className="text-xs text-muted-foreground">{Math.max(0, meta - pontos)} pontos até o próximo prêmio</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border hover:shadow-glow transition-all duration-300 animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento do Mês</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">R$ {faturamentoMes.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">soma dos atendimentos do mês</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-card border-border shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Próximos Agendamentos
            </CardTitle>
            <CardDescription>Seus compromissos nos próximos dias</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {proximos.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum agendamento futuro.</p>
            ) : proximos.map((a) => (
              <div key={a.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                <div className="flex-1">
                  <div className="font-medium text-foreground">{a.servico}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(a.data + "T00:00:00").toLocaleDateString("pt-BR")} às {a.hora} · {a.cliente}
                  </div>
                </div>
                <Badge variant="outline" className="border-primary text-primary">{a.status}</Badge>
              </div>
            ))}
            <Button
              onClick={() => navigate("/agendamentos")}
              variant="outline"
              className="w-full mt-4 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Ver Todos os Agendamentos
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Histórico Recente
            </CardTitle>
            <CardDescription>Seus últimos serviços realizados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentes.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum atendimento registrado ainda.</p>
            ) : recentes.map((s) => (
              <div key={s.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                <div className="flex-1">
                  <div className="font-medium text-foreground">{s.servicos.join(", ") || "Atendimento"}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(s.data + "T00:00:00").toLocaleDateString("pt-BR")} · {s.cliente}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-primary">R$ {s.valor.toFixed(2)}</div>
                </div>
              </div>
            ))}
            <Button
              onClick={() => navigate("/historico")}
              variant="outline"
              className="w-full mt-4 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Ver Histórico Completo
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Programa de Fidelidade */}
      <Card className="bg-gradient-card border-border shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Programa de Fidelidade
          </CardTitle>
          <CardDescription>Acumule pontos e ganhe descontos exclusivos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progresso até o próximo prêmio</span>
              <span className="text-sm text-muted-foreground">{pontos}/{meta} pontos</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-3">
              <div
                className="bg-gradient-primary h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (pontos / meta) * 100)}%` }}
              ></div>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className={`text-center p-3 rounded-lg ${pontos < 100 ? "bg-primary/20 border border-primary" : "bg-secondary/50"}`}>
                <div className="text-lg font-bold text-primary">Novato</div>
                <div className="text-xs text-muted-foreground">0-99 pontos</div>
              </div>
              <div className={`text-center p-3 rounded-lg ${pontos >= 100 && pontos < 300 ? "bg-primary/20 border border-primary" : "bg-secondary/50"}`}>
                <div className="text-lg font-bold text-primary">Regular</div>
                <div className="text-xs text-muted-foreground">100-299 pontos</div>
              </div>
              <div className={`text-center p-3 rounded-lg ${pontos >= 300 ? "bg-primary/20 border border-primary" : "bg-secondary/50"}`}>
                <div className="text-lg font-bold text-primary">VIP</div>
                <div className="text-xs text-muted-foreground">300+ pontos</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráficos de Estatísticas Mensais */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Estatísticas Mensais
          </h2>
          <p className="text-muted-foreground">
            Acompanhe o desempenho mensal da barbearia
          </p>
        </div>
        <MonthlyChart />
      </div>
    </div>
  );
}
