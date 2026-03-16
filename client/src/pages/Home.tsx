import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { BookOpen, Users, Lightbulb, LogOut } from "lucide-react";

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();

  // Layout para usuário logado
  if (isAuthenticated && user) {
    return (
      <div style={{ backgroundColor: "#F5F1E8", color: "#2B2B2B", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <header style={{ borderBottom: "1px solid #E8E0D0", backgroundColor: "#FFFFFF" }}>
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <BookOpen style={{ color: "#7A4E2D" }} className="w-6 h-6" />
              <h1 style={{ color: "#2B2B2B" }} className="text-xl font-bold tracking-tight">StoryWeaver</h1>
            </div>
            <div className="flex items-center gap-4">
              <span style={{ color: "#5C5C5C" }} className="text-sm hidden sm:inline">{user.email}</span>
              <button 
                onClick={() => logout()}
                style={{ color: "#7A4E2D", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "600" }}
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </div>
          </div>
        </header>
        
        <main style={{ flex: 1 }} className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <h2 style={{ color: "#2B2B2B" }} className="text-3xl font-bold mb-2">Bem-vindo de volta, {user.name || "Escritor"}!</h2>
              <p style={{ color: "#5C5C5C" }}>O que vamos criar hoje?</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div style={{ backgroundColor: "#FFFFFF", borderColor: "#E8E0D0", border: "1px solid #E8E0D0", borderRadius: "0.75rem", padding: "1.5rem" }}>
                <div style={{ backgroundColor: "#F5F1E8", borderRadius: "0.5rem", width: "3rem", height: "3rem", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                  <Users style={{ color: "#7A4E2D" }} className="w-6 h-6" />
                </div>
                <h3 style={{ color: "#2B2B2B" }} className="text-lg font-semibold mb-2">Personagens</h3>
                <p style={{ color: "#5C5C5C", fontSize: "0.875rem" }}>Gerencie e desenvolva os protagonistas da sua história.</p>
              </div>
              
              <div style={{ backgroundColor: "#FFFFFF", borderColor: "#E8E0D0", border: "1px solid #E8E0D0", borderRadius: "0.75rem", padding: "1.5rem" }}>
                <div style={{ backgroundColor: "#F5F1E8", borderRadius: "0.5rem", width: "3rem", height: "3rem", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                  <Lightbulb style={{ color: "#7A4E2D" }} className="w-6 h-6" />
                </div>
                <h3 style={{ color: "#2B2B2B" }} className="text-lg font-semibold mb-2">Ideias</h3>
                <p style={{ color: "#5C5C5C", fontSize: "0.875rem" }}>Capture inspirações e rascunhos rápidos para sua trama.</p>
              </div>
              
              <div style={{ backgroundColor: "#FFFFFF", borderColor: "#E8E0D0", border: "1px solid #E8E0D0", borderRadius: "0.75rem", padding: "1.5rem" }}>
                <div style={{ backgroundColor: "#F5F1E8", borderRadius: "0.5rem", width: "3rem", height: "3rem", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                  <BookOpen style={{ color: "#7A4E2D" }} className="w-6 h-6" />
                </div>
                <h3 style={{ color: "#2B2B2B" }} className="text-lg font-semibold mb-2">Capítulos</h3>
                <p style={{ color: "#5C5C5C", fontSize: "0.875rem" }}>Organize a estrutura e o fluxo narrativo do seu livro.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Layout Landing Page
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

        {/* Login Card Section */}
        <section style={{ backgroundColor: "#F5F1E8", padding: "6rem 0" }}>
          <div className="container mx-auto px-4">
            <div style={{ backgroundColor: "#FFFFFF", borderColor: "#E8E0D0", border: "1px solid #E8E0D0", borderRadius: "1.5rem", padding: "2rem", maxWidth: "28rem", margin: "0 auto", boxShadow: "0 10px 25px rgba(43, 43, 43, 0.08)" }}>
              <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                <h2 style={{ color: "#2B2B2B" }} className="text-3xl font-bold mb-2">StoryWeaver</h2>
                <h3 style={{ color: "#2B2B2B" }} className="text-xl font-medium">Bem-vindo de volta</h3>
                <p style={{ color: "#5C5C5C", marginTop: "0.5rem" }}>Entre para continuar sua história</p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <button 
                  onClick={() => {
                    try {
                      const url = getLoginUrl();
                      window.location.href = url;
                    } catch (error) {
                      console.error("Erro ao gerar URL de login:", error);
                      alert("Erro ao conectar. Por favor, tente novamente.");
                    }
                  }}
                  style={{ backgroundColor: "#7A4E2D", color: "#F5F1E8", padding: "1.5rem", fontSize: "1.125rem", fontWeight: "600", borderRadius: "0.75rem", border: "none", cursor: "pointer", width: "100%" }}
                >
                  Entrar com Google
                </button>
                
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
