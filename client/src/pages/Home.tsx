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

// Chaves do localStorage
const MASTER_REGISTRY_KEY = "storyweaver-master-registry";
const USER_GROUPS_KEY = "storyweaver-user-groups";

export default function Home() {
  const [groupCode, setGroupCode] = useState("");
  const [groupName, setGroupName] = useState("");
  const [enteredGroups, setEnteredGroups] = useState<Group[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"join" | "create">("create");
  const [currentView, setCurrentView] = useState<ViewType>("dashboard");
  const [activeGroupCode, setActiveGroupCode] = useState<string | null>(null);

  // Carregar grupos do localStorage ao iniciar
  useEffect(() => {
    // Carregar grupos do usuário (grupos que ele entrou)
    const savedUserGroups = localStorage.getItem(USER_GROUPS_KEY);
    if (savedUserGroups) {
      try {
        setEnteredGroups(JSON.parse(savedUserGroups));
      } catch (e) {
        console.error("Erro ao carregar grupos do usuário:", e);
      }
    }
  }, []);

  // Salvar grupos do usuário no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem(USER_GROUPS_KEY, JSON.stringify(enteredGroups));
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

  // Obter o registro master (todos os grupos criados)
  const getMasterRegistry = (): Group[] => {
    const registry = localStorage.getItem(MASTER_REGISTRY_KEY);
    if (registry) {
      try {
        return JSON.parse(registry);
      } catch (e) {
        console.error("Erro ao carregar registro master:", e);
        return [];
      }
    }
    return [];
  };

  // Salvar no registro master
  const saveMasterRegistry = (groups: Group[]) => {
    localStorage.setItem(MASTER_REGISTRY_KEY, JSON.stringify(groups));
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

    // Adicionar ao registro master (todos os grupos criados)
    const masterRegistry = getMasterRegistry();
    masterRegistry.push(newGroup);
    saveMasterRegistry(masterRegistry);

    // Adicionar aos grupos do usuário
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

    // Procurar o grupo no registro master
    const masterRegistry = getMasterRegistry();
    const foundGroup = masterRegistry.find(g => g.code === groupCode.trim());
    
    if (!foundGroup) {
      setError("Código de grupo não encontrado. Verifique se o código está correto.");
      return;
    }

    // Se o grupo foi encontrado, adicionar à lista de grupos do usuário
    setEnteredGroups([...enteredGroups, foundGroup]);
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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (activeTab === "create") {
        handleCreateGroup();
      } else {
        handleJoinGroup();
      }
    }
  };

  // Se o usuário está em um grupo, mostrar o dashboard
  if (enteredGroups.length > 0 && activeGroupCode) {
    const activeGroup = enteredGroups.find(g => g.code === activeGroupCode);
    if (!activeGroup) return null;

    if (currentView === "characters") {
      return (
        <CharactersManager
          groupCode={activeGroupCode}
          onBack={() => setCurrentView("dashboard")}
        />
      );
    }

    if (currentView === "ideas") {
      return (
        <IdeasManager
          groupCode={activeGroupCode}
          onBack={() => setCurrentView("dashboard")}
        />
      );
    }

    return (
      <div style={{ backgroundColor: "#F5F1E8", color: "#2B2B2B", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <header style={{ borderBottom: "1px solid #E8E0D0", backgroundColor: "#FFFFFF", position: "sticky", top: 0, zIndex: 50 }}>
          <div style={{ maxWidth: "900px", margin: "0 auto", padding: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <BookOpen style={{ color: "#7A4E2D" }} className="w-6 h-6" />
              <span style={{ color: "#2B2B2B" }} className="text-xl font-bold">StoryWeaver</span>
            </div>
            <span style={{ fontSize: "0.875rem", color: "#5C5C5C" }}>{enteredGroups.length} grupo(s)</span>
          </div>
        </header>

        <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "2rem 1rem" }}>
          <div style={{ maxWidth: "900px", width: "100%" }}>
            <h1 style={{ color: "#2B2B2B", fontSize: "2rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
              Bem-vindo ao StoryWeaver
            </h1>
            <p style={{ color: "#5C5C5C", marginBottom: "2rem" }}>
              Você está em {enteredGroups.length} grupo(s). Comece a criar sua história!
            </p>

            {/* Seus Grupos */}
            <section style={{ marginBottom: "3rem" }}>
              <h2 style={{ color: "#2B2B2B", fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem" }}>
                Seus Grupos
              </h2>
              <div style={{ display: "grid", gap: "1.5rem" }}>
                {enteredGroups.map((group) => (
                  <div
                    key={group.code}
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#E8E0D0",
                      border: "1px solid #E8E0D0",
                      borderRadius: "1rem",
                      padding: "1.5rem",
                      boxShadow: "0 4px 6px rgba(43, 43, 43, 0.05)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1rem" }}>
                      <div>
                        <h3 style={{ color: "#2B2B2B", fontSize: "1.25rem", fontWeight: "bold" }}>
                          {group.name}
                        </h3>
                        <p style={{ color: "#5C5C5C", fontSize: "0.875rem", marginTop: "0.25rem" }}>
                          Código: {group.code}
                        </p>
                      </div>
                      <button
                        onClick={() => handleLeaveGroup(group.code)}
                        style={{
                          backgroundColor: "#E8E0D0",
                          color: "#2B2B2B",
                          padding: "0.5rem 1rem",
                          borderRadius: "0.5rem",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "0.875rem",
                          fontWeight: "600",
                        }}
                      >
                        Sair
                      </button>
                    </div>
                    <button
                      onClick={() => handleCopyCode(group.code)}
                      style={{
                        backgroundColor: "#7A4E2D",
                        color: "#FFFFFF",
                        padding: "0.75rem 1rem",
                        borderRadius: "0.5rem",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: "600",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        width: "100%",
                        justifyContent: "center",
                        marginBottom: "1rem",
                      }}
                    >
                      {copiedCode === group.code ? (
                        <>
                          <Check className="w-4 h-4" />
                          Código Copiado!
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
            </section>

            {/* Ferramentas */}
            <section style={{ marginBottom: "3rem" }}>
              <h2 style={{ color: "#2B2B2B", fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem" }}>
                Ferramentas
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
                <button
                  onClick={() => {
                    setActiveGroupCode(enteredGroups[0].code);
                    setCurrentView("characters");
                  }}
                  style={{
                    backgroundColor: "#7A4E2D",
                    color: "#FFFFFF",
                    padding: "2rem",
                    borderRadius: "1rem",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "1rem",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#6A3E1F";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#7A4E2D";
                  }}
                >
                  <Users style={{ color: "#F5F1E8" }} className="w-8 h-8" />
                  <div>
                    <h3 style={{ fontWeight: "bold", fontSize: "1.125rem" }}>Personagens</h3>
                    <p style={{ fontSize: "0.875rem", opacity: 0.9 }}>Crie e desenvolva os protagonistas da sua história.</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setActiveGroupCode(enteredGroups[0].code);
                    setCurrentView("ideas");
                  }}
                  style={{
                    backgroundColor: "#7A4E2D",
                    color: "#FFFFFF",
                    padding: "2rem",
                    borderRadius: "1rem",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "1rem",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#6A3E1F";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#7A4E2D";
                  }}
                >
                  <Lightbulb style={{ color: "#F5F1E8" }} className="w-8 h-8" />
                  <div>
                    <h3 style={{ fontWeight: "bold", fontSize: "1.125rem" }}>Ideias</h3>
                    <p style={{ fontSize: "0.875rem", opacity: 0.9 }}>Capture inspirações e rascunhos para sua trama.</p>
                  </div>
                </button>
              </div>
            </section>

            {/* Entrar em Outro Grupo */}
            <section>
              <h2 style={{ color: "#2B2B2B", fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem" }}>
                Entrar em Outro Grupo
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <input
                  type="text"
                  placeholder="Digite o código do grupo"
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
                    backgroundColor: "#F5F1E8",
                    color: "#2B2B2B",
                    padding: "0.75rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #E8E0D0",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "1rem",
                  }}
                >
                  Entrar no Grupo
                </button>
                {error && (
                  <p style={{ color: "#E74C3C", fontSize: "0.875rem" }}>{error}</p>
                )}
              </div>
            </section>
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
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="flex items-center gap-2">
            <BookOpen style={{ color: "#7A4E2D" }} className="w-6 h-6" />
            <span style={{ color: "#2B2B2B" }} className="text-xl font-bold tracking-tight">Emergent</span>
          </div>
        </div>
      </header>

      <main style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "2rem 1rem" }}>
        {/* Hero Section */}
        <section style={{ maxWidth: "900px", width: "100%", textAlign: "center", marginBottom: "4rem" }}>
          <h1 style={{ color: "#2B2B2B" }} className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            StoryWeaver
          </h1>
          <p style={{ color: "#5C5C5C" }} className="text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            Crie, organize e desenvolva personagens incríveis para suas histórias. Colabore com sua equipe e dê vida às suas ideias.
          </p>
          
          {/* Features */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem", marginTop: "3rem" }}>
            <div style={{ padding: "1.5rem" }}>
              <div style={{ borderColor: "#7A4E2D", color: "#7A4E2D", border: "2px solid #7A4E2D", borderRadius: "9999px", width: "3rem", height: "3rem", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "1.25rem", marginBottom: "1.5rem", margin: "0 auto 1.5rem" }}>
                1
              </div>
              <h3 style={{ color: "#2B2B2B" }} className="text-lg font-semibold mb-3">Cadastre personagens</h3>
              <p style={{ color: "#5C5C5C", fontSize: "0.875rem" }} className="leading-relaxed">
                Estruture personalidades, motivações e arcos dramáticos em um só lugar.
              </p>
            </div>
            
            <div style={{ padding: "1.5rem" }}>
              <div style={{ borderColor: "#7A4E2D", color: "#7A4E2D", border: "2px solid #7A4E2D", borderRadius: "9999px", width: "3rem", height: "3rem", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "1.25rem", marginBottom: "1.5rem", margin: "0 auto 1.5rem" }}>
                2
              </div>
              <h3 style={{ color: "#2B2B2B" }} className="text-lg font-semibold mb-3">Organize suas ideias</h3>
              <p style={{ color: "#5C5C5C", fontSize: "0.875rem" }} className="leading-relaxed">
                Mantenha o fluxo criativo com ferramentas de organização intuitivas.
              </p>
            </div>
            
            <div style={{ padding: "1.5rem" }}>
              <div style={{ borderColor: "#7A4E2D", color: "#7A4E2D", border: "2px solid #7A4E2D", borderRadius: "9999px", width: "3rem", height: "3rem", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "1.25rem", marginBottom: "1.5rem", margin: "0 auto 1.5rem" }}>
                3
              </div>
              <h3 style={{ color: "#2B2B2B" }} className="text-lg font-semibold mb-3">Colabore com sua equipe</h3>
              <p style={{ color: "#5C5C5C", fontSize: "0.875rem" }} className="leading-relaxed">
                Compartilhe seu universo e construa histórias memoráveis coletivamente.
              </p>
            </div>
          </div>
        </section>

        {/* Join/Create Group Section */}
        <section style={{ width: "100%", maxWidth: "900px" }}>
          <div style={{ backgroundColor: "#FFFFFF", borderColor: "#E8E0D0", border: "1px solid #E8E0D0", borderRadius: "1.5rem", padding: "2rem", boxShadow: "0 10px 25px rgba(43, 43, 43, 0.08)", maxWidth: "400px", margin: "0 auto" }}>
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
                      backgroundColor: "#F5F1E8", 
                      color: "#2B2B2B", 
                      padding: "1.5rem", 
                      fontSize: "1.125rem", 
                      fontWeight: "600", 
                      borderRadius: "0.75rem", 
                      border: "1px solid #E8E0D0", 
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
                      backgroundColor: "#F5F1E8", 
                      color: "#2B2B2B", 
                      padding: "1.5rem", 
                      fontSize: "1.125rem", 
                      fontWeight: "600", 
                      borderRadius: "0.75rem", 
                      border: "1px solid #E8E0D0", 
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
        </section>
      </main>

      <footer style={{ borderTop: "1px solid #E8E0D0", backgroundColor: "#FFFFFF", padding: "2rem 0", marginTop: "auto" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
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
