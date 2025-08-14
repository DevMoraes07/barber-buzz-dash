import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Phone, Mail, MapPin, Calendar, Edit } from "lucide-react";

const Perfil = () => {
  const usuario = {
    nome: "João Silva",
    email: "joao.silva@email.com",
    telefone: "(11) 99999-9999",
    endereco: "Rua das Flores, 123 - Centro",
    dataNascimento: "1985-03-15",
    clienteDesde: "2022-01-10",
    nivel: "Ouro",
    totalCortes: 45,
    preferences: ["Corte Tradicional", "Barba Completa", "Tratamento Premium"]
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-background">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Meu Perfil
              </h1>
              <p className="text-muted-foreground mt-2">
                Gerencie suas informações pessoais e preferências
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src="/placeholder-avatar.jpg" />
                    <AvatarFallback className="text-2xl bg-primary/20 text-primary">
                      {usuario.nome.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle>{usuario.nome}</CardTitle>
                  <CardDescription>Cliente {usuario.nivel}</CardDescription>
                  <Badge className="bg-primary/20 text-primary">
                    {usuario.totalCortes} cortes realizados
                  </Badge>
                </CardHeader>
                <CardContent className="text-center">
                  <Button variant="outline" className="w-full">
                    <Edit className="h-4 w-4 mr-2" />
                    Editar Foto
                  </Button>
                </CardContent>
              </Card>

              <div className="lg:col-span-2 space-y-6">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Informações Pessoais
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nome">Nome Completo</Label>
                        <Input id="nome" value={usuario.nome} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input id="email" type="email" value={usuario.email} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="telefone">Telefone</Label>
                        <Input id="telefone" value={usuario.telefone} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nascimento">Data de Nascimento</Label>
                        <Input id="nascimento" type="date" value={usuario.dataNascimento} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endereco">Endereço</Label>
                      <Input id="endereco" value={usuario.endereco} />
                    </div>
                    <Button className="bg-gradient-primary hover:opacity-90 transition-opacity">
                      Salvar Alterações
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
                      {usuario.preferences.map((pref, index) => (
                        <Badge key={index} variant="secondary" className="bg-primary/20 text-primary">
                          {pref}
                        </Badge>
                      ))}
                    </div>
                    <Button variant="outline">
                      Editar Preferências
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Informações da Conta</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Cliente desde</span>
                      </div>
                      <span className="text-sm font-medium">
                        {new Date(usuario.clienteDesde).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Nível de fidelidade</span>
                      </div>
                      <Badge className="bg-primary/20 text-primary">{usuario.nivel}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Perfil;