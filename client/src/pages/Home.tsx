import { useState, useEffect } from "react";
import { BookOpen, Users, Lightbulb, Copy, Check } from "lucide-react";
import CharactersManager from "@/components/CharactersManager";
import IdeasManager from "@/components/IdeasManager";

interface Group {
  code: string;
  name: string;
  createdAt: string;
}

type ViewType = "dashboard" | "characters" | "ideas";

export default function Home() {
  const [groupCode, setGroupCode] = useState("");
  const [groupName, setGroupName] = useState("");
  const [enteredGroups, setEnteredGroups] = useState<Group[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"join" | "create">("join");
  const [currentView, setCurrentView] = useState<ViewType>("dashboard");
  const [activeGroupCode, setActiveGroupCode] = useState<string | null>(null);

  // Carregar grupos do localStorage ao iniciar
  useEffect(() => {
    const savedGroups = localStorage.getItem("storyweaver-groups");
    if (savedGroups) {
      try {
        setEnteredGroups(JSON.parse(savedGroups));
      } catch (e) {
        console.error("Erro ao carregar grupos:", e);
      }
    }
  }, []);

  // Salvar grupos no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem("storyweaver-groups", JSON.stringify(enteredGroups));
  }, [enteredGroups]);

  // Gerar código único para o grupo
  const generateGroupCode = (): string => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      setError("Por favor, digite um nome para o grupo");
      return;
    }

    const newCode = generateGroupCode();
    const newGroup: Group = {
      code: newCode,
      name: groupName.trim(),
      createdAt: new Date().toISOString(),
    };

    setEnteredGroups([...enteredGroups, newGroup]);
    setGroupName("");
    setError(null);
    setActiveTab("join");
  };

  const handleJoinGroup = () => {
    if (!groupCode.trim()) {
      setError("Por favor, digite um código de grupo");
      return;
    }

    const codeExists = enteredGroups.some(g => g.code === groupCode.trim());
    if (codeExists) {
      setError("Você já está neste grupo");
      return;
    }

    if (groupCode.trim().length < 3) {
      setError("Código de grupo inválido");
      return;
    }

    const newGroup: Group = {
      code: groupCode.trim(),
      name: `Grupo ${groupCode.trim()}`,
      createdAt: new Date().toISOString(),
    };

    setEnteredGroups([...enteredGroups, newGroup]);
    setGroupCode("");
    setError(null);
  };

  const handleLeaveGroup = (code: string) => {
    setEnteredGroups(enteredGroups.filter(g => g.code !== code));
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (activeTab === "join") {
        handleJoinGroup();
      } else {
        handleCreateGroup();
      }
    }
  };

  // Se está visualizando Personagens
  if (currentView === "characters" && activeGroupCode) {
    return (
      <CharactersManager
        groupCode={activeGroupCode}
        onBack={() => setCurrentView("dashboard")}
      />
    );
  }

  // Se está visualizando Ideias
  if (currentView === "ideas" && activeGroupCode) {
    return (
      <IdeasManager
        groupCode={activeGroupCode}
        onBack={() => setCurrentView("dashboard")}
      />
    );
  }

  // Se o usuário entrou em algum grupo, mostrar o dashboard
  if (enteredGroups.length > 0 && currentView === "dashboard") {
    return (
      <div style={{ backgroundColor: "#F5F1E8", color: "#2B2B2B", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <header style={{ borderBottom: "1px solid #E8E0D0", backgroundColor: "#FFFFFF" }}>
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <BookOpen style={{ color: "#7A4E2D" }} className="w-6 h-6" />
              <h1 style={{ color: "#2B2B2B" }} className="text-xl font-bold tracking-tight">StoryWeaver</h1>
            </div>
            <div className="flex items-center gap-4">
              <span style={{ color: "#5C5C5C" }} className="text-sm hidden sm:inline">
                {enteredGroups.length} grupo(s) ativo(s)
              </span>
            </div>
          </div>
        </header>
        
        <main style={{ flex: 1 }} className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <h2 style={{ color: "#2B2B2B" }} className="text-3xl font-bold mb-2">Bem-vindo ao StoryWeaver</h2>
              <p style={{ color: "#5C5C5C" }}>Você está em {enteredGroups.length} grupo(s). Comece a criar sua história!</p>
            </div>

            {/* Grupos Ativos */}
            <div className="mb-12">
              <h3 style={{ color: "#2B2B2B" }} className="text-2xl font-bold mb-6">Seus Grupos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enteredGroups.map((group) => (
                  <div key={group.code} style={{ backgroundColor: "#FFFFFF", borderColor: "#E8E0D0", border: "1px solid #E8E0D0", borderRadius: "0.75rem", padding: "1.5rem" }}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 style={{ color: "#2B2B2B" }} className="text-lg font-semibold">{group.name}</h4>
                        <p style={{ color: "#5C5C5C", fontSize: "0.875rem", marginTop: "0.25rem" }}>
                          Código: <strong>{group.code}</strong>
                        </p>
                      </div>
                      <button
                        onClick={() => handleLeaveGroup(group.code)}
                        style={{ color: "#E74C3C", background: "none", border: "none", cursor: "pointer", fontSize: "0.875rem", fontWeight: "600" }}
                      >
                        Sair
                      </button>
                    </div>
                    <button
                      onClick={() => handleCopyCode(group.code)}
                      style={{
                        backgroundColor: "#7A4E2D",
                        color: "#F5F1E8",
                        padding: "0.5rem 1rem",
                        borderRadius: "0.5rem",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        width: "100%",
                        justifyContent: "center"
                      }}
                    >
                      {copiedCode === group.code ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copiar Código
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Funcionalidades Principais */}
            <div className="mb-12">
              <h3 style={{ color: "#2B2B2B" }} className="text-2xl font-bold mb-6">Ferramentas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <button
                  onClick={() => {
                    setActiveGroupCode(enteredGroups[0].code);
                    setCurrentView("characters");
                  }}
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderColor: "#E8E0D0",
                    border: "1px solid #E8E0D0",
                    borderRadius: "0.75rem",
                    padding: "1.5rem",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(122, 78, 45, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{ backgroundColor: "#F5F1E8", borderRadius: "0.5rem", width: "3rem", height: "3rem", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                    <Users style={{ color: "#7A4E2D" }} className="w-6 h-6" />
                  </div>
                  <h4 style={{ color: "#2B2B2B" }} className="text-lg font-semibold mb-2">Personagens</h4>
                  <p style={{ color: "#5C5C5C", fontSize: "0.875rem" }}>Gerencie e desenvolva os protagonistas da sua história.</p>
                </button>
                
                <button
                  onClick={() => {
                    setActiveGroupCode(enteredGroups[0].code);
                    setCurrentView("ideas");
                  }}
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderColor: "#E8E0D0",
                    border: "1px solid #E8E0D0",
                    borderRadius: "0.75rem",
                    padding: "1.5rem",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(122, 78, 45, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{ backgroundColor: "#F5F1E8", borderRadius: "0.5rem", width: "3rem", height: "3rem", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                    <Lightbulb style={{ color: "#7A4E2D" }} className="w-6 h-6" />
                  </div>
                  <h4 style={{ color: "#2B2B2B" }} className="text-lg font-semibold mb-2">Ideias</h4>
                  <p style={{ color: "#5C5C5C", fontSize: "0.875rem" }}>Capture inspirações e rascunhos rápidos para sua trama.</p>
                </button>
                
                <div style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "#E8E0D0",
                  border: "1px solid #E8E0D0",
                  borderRadius: "0.75rem",
                  padding: "1.5rem",
                }}>
                  <div style={{ backgroundColor: "#F5F1E8", borderRadius: "0.5rem", width: "3rem", height: "3rem", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                    <BookOpen style={{ color: "#7A4E2D" }} className="w-6 h-6" />
                  </div>
                  <h4 style={{ color: "#2B2B2B" }} className="text-lg font-semibold mb-2">Capítulos</h4>
                  <p style={{ color: "#5C5C5C", fontSize: "0.875rem" }}>Organize a estrutura e o fluxo narrativo do seu livro. (Em breve)</p>
                </div>
              </div>
            </div>

            {/* Entrar em Novo Grupo */}
            <div style={{ backgroundColor: "#FFFFFF", borderColor: "#E8E0D0", border: "1px solid #E8E0D0", borderRadius: "0.75rem", padding: "2rem" }}>
              <h3 style={{ color: "#2B2B2B" }} className="text-xl font-bold mb-4">Gerenciar Grupos</h3>
              <div style={{ display: "flex", gap: "1rem", flexDirection: "column", maxWidth: "400px" }}>
                <input
                  type="text"
                  placeholder="Digite o código do grupo"
                  value={groupCode}
                  onChange={(e) => setGroupCode(e.target.value)}
                  onKeyPress={handleKeyPress}
                  style={{
                    backgroundColor: "#F5F1E8",
                    color: "#2B2B2B",
                    padding: "0.75rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #E8E0D0",
                    fontSize: "1rem",
                  }}
                />
                <button
                  onClick={handleJoinGroup}
                  style={{
                    backgroundColor: "#7A4E2D",
                    color: "#F5F1E8",
                    padding: "0.75rem",
                    borderRadius: "0.5rem",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "1rem",
                  }}
                >
                  Entrar em Outro Grupo
                </button>
                {error && (
                  <p style={{ color: "#E74C3C", fontSize: "0.875rem" }}>{error}</p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Landing Page - Antes de entrar em um grupo
  return (
    <div style={{ backgroundColor: "#F5F1E8", color: "#2B2B2B", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header style={{ borderBottom: "1px solid #E8E0D0", backgroundColor: "#FFFFFF", position: "sticky", top: 0, zIndex: 50 }}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen style={{ color: "#7A4E2D" }} className="w-6 h-6" />
            <span style={{ color: "#2B2B2B" }} className="text-xl font-bold tracking-tight">Emergent</span>
          </div>
        </div>
      </header>

      <main style={{ flex: 1 }}>
        {/* Hero Section */}
        <section className="container mx-auto px-4 pt-24 pb-16 text-center">
          <h1 style={{ color: "#2B2B2B" }} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            StoryWeaver
          </h1>
          <p style={{ color: "#5C5C5C" }} className="text-xl md:text-2xl max-w-2xl mx-auto mb-12 leading-relaxed">
            Crie, organize e desenvolva personagens incríveis para suas histórias. Colabore com sua equipe e dê vida às suas ideias.
          </p>
          
          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-20">
            <div className="flex flex-col items-center p-6">
              <div style={{ borderColor: "#7A4E2D", color: "#7A4E2D", border: "2px solid #7A4E2D", borderRadius: "9999px", width: "3rem", height: "3rem", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "1.25rem", marginBottom: "1.5rem" }}>
                1
              </div>
              <h3 style={{ color: "#2B2B2B" }} className="text-lg font-semibold mb-3">Cadastre personagens com detalhes completos</h3>
              <p style={{ color: "#5C5C5C", fontSize: "0.875rem" }} className="leading-relaxed">
                Estruture personalidades, motivações e arcos dramáticos em um só lugar.
              </p>
            </div>
            
            <div className="flex flex-col items-center p-6">
              <div style={{ borderColor: "#7A4E2D", color: "#7A4E2D", border: "2px solid #7A4E2D", borderRadius: "9999px", width: "3rem", height: "3rem", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "1.25rem", marginBottom: "1.5rem" }}>
                2
              </div>
              <h3 style={{ color: "#2B2B2B" }} className="text-lg font-semibold mb-3">Organize suas ideias e anotações</h3>
              <p style={{ color: "#5C5C5C", fontSize: "0.875rem" }} className="leading-relaxed">
                Mantenha o fluxo criativo com ferramentas de organização intuitivas.
              </p>
            </div>
            
            <div className="flex flex-col items-center p-6">
              <div style={{ borderColor: "#7A4E2D", color: "#7A4E2D", border: "2px solid #7A4E2D", borderRadius: "9999px", width: "3rem", height: "3rem", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "1.25rem", marginBottom: "1.5rem" }}>
                3
              </div>
              <h3 style={{ color: "#2B2B2B" }} className="text-lg font-semibold mb-3">Colabore em tempo real com sua equipe</h3>
              <p style={{ color: "#5C5C5C", fontSize: "0.875rem" }} className="leading-relaxed">
                Compartilhe seu universo e construa histórias memoráveis coletivamente.
              </p>
            </div>
          </div>
        </section>

        {/* Join/Create Group Section */}
        <section style={{ backgroundColor: "#F5F1E8", padding: "6rem 0" }}>
          <div className="container mx-auto px-4">
            <div style={{ backgroundColor: "#FFFFFF", borderColor: "#E8E0D0", border: "1px solid #E8E0D0", borderRadius: "1.5rem", padding: "2rem", maxWidth: "28rem", margin: "0 auto", boxShadow: "0 10px 25px rgba(43, 43, 43, 0.08)" }}>
              <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                <h2 style={{ color: "#2B2B2B" }} className="text-3xl font-bold mb-2">StoryWeaver</h2>
                <h3 style={{ color: "#2B2B2B" }} className="text-xl font-medium">Bem-vindo</h3>
                <p style={{ color: "#5C5C5C", marginTop: "0.5rem" }}>Crie um novo grupo ou entre em um existente</p>
              </div>

              {/* Tabs */}
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", borderBottom: "1px solid #E8E0D0", paddingBottom: "1rem" }}>
                <button
                  onClick={() => setActiveTab("create")}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    borderBottom: activeTab === "create" ? "3px solid #7A4E2D" : "none",
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: activeTab === "create" ? "#7A4E2D" : "#5C5C5C",
                    fontWeight: activeTab === "create" ? "600" : "500",
                  }}
                >
                  Criar Grupo
                </button>
                <button
                  onClick={() => setActiveTab("join")}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    borderBottom: activeTab === "join" ? "3px solid #7A4E2D" : "none",
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: activeTab === "join" ? "#7A4E2D" : "#5C5C5C",
                    fontWeight: activeTab === "join" ? "600" : "500",
                  }}
                >
                  Entrar em Grupo
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {activeTab === "create" ? (
                  <>
                    <input
                      type="text"
                      placeholder="Nome do seu grupo/história"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      onKeyPress={handleKeyPress}
                      style={{
                        backgroundColor: "#F5F1E8",
                        color: "#2B2B2B",
                        padding: "1rem",
                        borderRadius: "0.75rem",
                        border: "1px solid #E8E0D0",
                        fontSize: "1rem",
                        fontWeight: "500",
                      }}
                    />
                    <button 
                      onClick={handleCreateGroup}
                      style={{ 
                        backgroundColor: "#7A4E2D", 
                        color: "#F5F1E8", 
                        padding: "1.5rem", 
                        fontSize: "1.125rem", 
                        fontWeight: "600", 
                        borderRadius: "0.75rem", 
                        border: "none", 
                        cursor: "pointer",
                        width: "100%",
                        transition: "all 0.3s ease"
                      }}
                    >
                      Criar Novo Grupo
                    </button>
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      placeholder="Código do grupo"
                      value={groupCode}
                      onChange={(e) => setGroupCode(e.target.value)}
                      onKeyPress={handleKeyPress}
                      style={{
                        backgroundColor: "#F5F1E8",
                        color: "#2B2B2B",
                        padding: "1rem",
                        borderRadius: "0.75rem",
                        border: "1px solid #E8E0D0",
                        fontSize: "1rem",
                        fontWeight: "500",
                      }}
                    />
                    <button 
                      onClick={handleJoinGroup}
                      style={{ 
                        backgroundColor: "#7A4E2D", 
                        color: "#F5F1E8", 
                        padding: "1.5rem", 
                        fontSize: "1.125rem", 
                        fontWeight: "600", 
                        borderRadius: "0.75rem", 
                        border: "none", 
                        cursor: "pointer",
                        width: "100%",
                        transition: "all 0.3s ease"
                      }}
                    >
                      Entrar no Grupo
                    </button>
                  </>
                )}
                
                {error && (
                  <p style={{ color: "#E74C3C", fontSize: "0.875rem", textAlign: "center" }}>
                    {error}
                  </p>
                )}
                
                <p style={{ color: "#5C5C5C", fontSize: "0.75rem", textAlign: "center", paddingLeft: "1rem", paddingRight: "1rem" }}>
                  Ao continuar, você concorda com nossos{" "}
                  <a href="#" style={{ color: "#7A4E2D", textDecoration: "underline" }}>termos de uso</a>{" "}
                  e{" "}
                  <a href="#" style={{ color: "#7A4E2D", textDecoration: "underline" }}>política de privacidade</a>.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer style={{ borderTop: "1px solid #E8E0D0", backgroundColor: "#FFFFFF", padding: "3rem 0" }}>
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4" style={{ color: "#7A4E2D" }}>
            <BookOpen className="w-4 h-4" />
            <span style={{ fontSize: "0.875rem", fontWeight: "600", letterSpacing: "0.1em", textTransform: "uppercase" }}>StoryWeaver</span>
          </div>
          <p style={{ color: "#5C5C5C", fontSize: "0.875rem" }}>&copy; 2026 StoryWeaver. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
