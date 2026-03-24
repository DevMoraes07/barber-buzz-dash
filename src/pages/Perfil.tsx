import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Calendar, Edit, Save, Camera } from "lucide-react";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

const todosServicos = ["Corte Tradicional", "Corte Moderno", "Barba Completa", "Barba Simples", "Tratamento Premium", "Lavagem", "Sobrancelha", "Bigode"];

const Perfil = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [nome, setNome] = useState("João Silva");
  const [email, setEmail] = useState("joao.silva@email.com");
  const [telefone, setTelefone] = useState("(11) 99999-9999");
  const [endereco, setEndereco] = useState("Rua das Flores, 123 - Centro");
  const [nascimento, setNascimento] = useState("1985-03-15");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [preferences, setPreferences] = useState(["Corte Tradicional", "Barba Completa", "Tratamento Premium"]);
  const [prefDialogOpen, setPrefDialogOpen] = useState(false);
  const [tempPrefs, setTempPrefs] = useState<string[]>([]);

  const usuario = { clienteDesde: "2022-01-10", nivel: "Ouro", totalCortes: 45 };

  const handleSalvar = () => {
    toast({ title: "Perfil salvo!", description: "Suas informações foram atualizadas com sucesso." });
  };

  const handleEditarFoto = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
      toast({ title: "Foto atualizada!" });
    }
  };

  const handleOpenPrefDialog = () => { setTempPrefs([...preferences]); setPrefDialogOpen(true); };

  const togglePref = (pref: string) => {
    setTempPrefs(prev => prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]);
  };

  const handleSalvarPrefs = () => {
    setPreferences(tempPrefs);
    setPrefDialogOpen(false);
    toast({ title: "Preferências atualizadas!" });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-background">
        <AppSidebar />
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">Meu Perfil</h1>
              <p className="text-muted-foreground mt-1 text-sm">Gerencie suas informações pessoais e preferências</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback className="text-2xl bg-primary/20 text-primary">
                      {nome.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle>{nome}</CardTitle>
                  <CardDescription>Cliente {usuario.nivel}</CardDescription>
                  <Badge className="bg-primary/20 text-primary">{usuario.totalCortes} cortes realizados</Badge>
                </CardHeader>
                <CardContent className="text-center">
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  <Button variant="outline" className="w-full" onClick={handleEditarFoto}>
                    <Camera className="h-4 w-4 mr-2" /> Editar Foto
                  </Button>
                </CardContent>
              </Card>

              <div className="lg:col-span-2 space-y-6">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><User className="h-5 w-5 text-primary" /> Informações Pessoais</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Nome Completo</Label><Input value={nome} onChange={e => setNome(e.target.value)} /></div>
                      <div className="space-y-2"><Label>E-mail</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
                      <div className="space-y-2"><Label>Telefone</Label><Input value={telefone} onChange={e => setTelefone(e.target.value)} /></div>
                      <div className="space-y-2"><Label>Data de Nascimento</Label><Input type="date" value={nascimento} onChange={e => setNascimento(e.target.value)} /></div>
                    </div>
                    <div className="space-y-2"><Label>Endereço</Label><Input value={endereco} onChange={e => setEndereco(e.target.value)} /></div>
                    <Button onClick={handleSalvar} className="bg-gradient-primary hover:opacity-90 transition-opacity">
                      <Save className="h-4 w-4 mr-2" /> Salvar Alterações
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Preferências de Serviços</CardTitle>
                    <CardDescription>Seus serviços favoritos na barbearia</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {preferences.map((pref, i) => (
                        <Badge key={i} variant="secondary" className="bg-primary/20 text-primary">{pref}</Badge>
                      ))}
                    </div>
                    <Button variant="outline" onClick={handleOpenPrefDialog}>
                      <Edit className="h-4 w-4 mr-2" /> Editar Preferências
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader><CardTitle>Informações da Conta</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /><span className="text-sm">Cliente desde</span></div>
                      <span className="text-sm font-medium">{new Date(usuario.clienteDesde).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" /><span className="text-sm">Nível de fidelidade</span></div>
                      <Badge className="bg-primary/20 text-primary">{usuario.nivel}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Preferences dialog */}
            <Dialog open={prefDialogOpen} onOpenChange={setPrefDialogOpen}>
              <DialogContent className="bg-card border-border">
                <DialogHeader><DialogTitle>Editar Preferências</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  {todosServicos.map(s => (
                    <label key={s} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 cursor-pointer">
                      <Checkbox checked={tempPrefs.includes(s)} onCheckedChange={() => togglePref(s)} />
                      <span className="text-sm">{s}</span>
                    </label>
                  ))}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setPrefDialogOpen(false)}>Cancelar</Button>
                  <Button onClick={handleSalvarPrefs} className="bg-gradient-primary">Salvar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Perfil;
