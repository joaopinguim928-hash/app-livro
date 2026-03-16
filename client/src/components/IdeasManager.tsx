import { useState, useEffect } from "react";
import { BookOpen, Plus, Trash2, ArrowLeft, Lightbulb } from "lucide-react";

interface Idea {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

interface IdeasManagerProps {
  groupCode: string;
  onBack: () => void;
}

export default function IdeasManager({ groupCode, onBack }: IdeasManagerProps) {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [error, setError] = useState<string | null>(null);

  // Carregar ideias do localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`storyweaver-ideas-${groupCode}`);
    if (saved) {
      try {
        setIdeas(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao carregar ideias:", e);
      }
    }
  }, [groupCode]);

  // Salvar ideias no localStorage
  useEffect(() => {
    localStorage.setItem(`storyweaver-ideas-${groupCode}`, JSON.stringify(ideas));
  }, [ideas, groupCode]);

  const handleAddIdea = () => {
    if (!formData.title.trim()) {
      setError("Digite um título para a ideia");
      return;
    }
    if (!formData.content.trim()) {
      setError("Digite o conteúdo da ideia");
      return;
    }

    const newIdea: Idea = {
      id: Date.now().toString(),
      title: formData.title,
      content: formData.content,
      createdAt: new Date().toISOString(),
    };

    setIdeas([newIdea, ...ideas]); // Mais recentes primeiro
    setFormData({ title: "", content: "" });
    setShowForm(false);
    setError(null);
  };

  const handleDeleteIdea = (id: string) => {
    setIdeas(ideas.filter(i => i.id !== id));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  return (
    <div style={{ backgroundColor: "#F5F1E8", color: "#2B2B2B", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header style={{ borderBottom: "1px solid #E8E0D0", backgroundColor: "#FFFFFF" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#7A4E2D" }}
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <Lightbulb style={{ color: "#7A4E2D" }} className="w-6 h-6" />
              <h1 style={{ color: "#2B2B2B" }} className="text-xl font-bold tracking-tight">Ideias</h1>
            </div>
          </div>
        </div>
      </header>

      <main style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "3rem 1rem" }}>
        <div style={{ maxWidth: "900px", width: "100%" }}>
          {/* Botão Adicionar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <h2 style={{ color: "#2B2B2B" }} className="text-2xl font-bold">
              {ideas.length} Ideia(s)
            </h2>
            <button
              onClick={() => setShowForm(!showForm)}
              style={{
                backgroundColor: "#7A4E2D",
                color: "#F5F1E8",
                padding: "0.75rem 1.5rem",
                borderRadius: "0.5rem",
                border: "none",
                cursor: "pointer",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <Plus className="w-5 h-5" />
              Nova Ideia
            </button>
          </div>

          {/* Formulário */}
          {showForm && (
            <div style={{
              backgroundColor: "#FFFFFF",
              borderColor: "#E8E0D0",
              border: "1px solid #E8E0D0",
              borderRadius: "0.75rem",
              padding: "2rem",
              marginBottom: "2rem",
            }}>
              <h3 style={{ color: "#2B2B2B" }} className="text-xl font-bold mb-4">Adicionar Nova Ideia</h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={{ color: "#2B2B2B", fontWeight: "600", display: "block", marginBottom: "0.5rem" }}>
                    Título
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Cena de confronto final"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    style={{
                      backgroundColor: "#F5F1E8",
                      color: "#2B2B2B",
                      padding: "0.75rem",
                      borderRadius: "0.5rem",
                      border: "1px solid #E8E0D0",
                      fontSize: "1rem",
                      width: "100%",
                    }}
                  />
                </div>

                <div>
                  <label style={{ color: "#2B2B2B", fontWeight: "600", display: "block", marginBottom: "0.5rem" }}>
                    Conteúdo
                  </label>
                  <textarea
                    placeholder="Descreva sua ideia, rascunho, inspiração..."
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    style={{
                      backgroundColor: "#F5F1E8",
                      color: "#2B2B2B",
                      padding: "0.75rem",
                      borderRadius: "0.5rem",
                      border: "1px solid #E8E0D0",
                      fontSize: "1rem",
                      width: "100%",
                      minHeight: "150px",
                      fontFamily: "inherit",
                    }}
                  />
                </div>

                {error && (
                  <p style={{ color: "#E74C3C", fontSize: "0.875rem" }}>{error}</p>
                )}

                <div style={{ display: "flex", gap: "1rem" }}>
                  <button
                    onClick={handleAddIdea}
                    style={{
                      backgroundColor: "#7A4E2D",
                      color: "#F5F1E8",
                      padding: "0.75rem 1.5rem",
                      borderRadius: "0.5rem",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: "600",
                      flex: 1,
                    }}
                  >
                    Salvar Ideia
                  </button>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setFormData({ title: "", content: "" });
                      setError(null);
                    }}
                    style={{
                      backgroundColor: "#E8E0D0",
                      color: "#2B2B2B",
                      padding: "0.75rem 1.5rem",
                      borderRadius: "0.5rem",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: "600",
                      flex: 1,
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Lista de Ideias */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {ideas.map((idea) => (
              <div
                key={idea.id}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "#E8E0D0",
                  border: "1px solid #E8E0D0",
                  borderRadius: "0.75rem",
                  padding: "1.5rem",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ color: "#2B2B2B" }} className="text-lg font-bold">
                      {idea.title}
                    </h4>
                    <p style={{ color: "#5C5C5C", fontSize: "0.75rem", marginTop: "0.25rem" }}>
                      {formatDate(idea.createdAt)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteIdea(idea.id)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#E74C3C",
                      marginLeft: "1rem",
                    }}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <p style={{ color: "#5C5C5C", fontSize: "0.875rem", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>
                  {idea.content}
                </p>
              </div>
            ))}
          </div>

          {ideas.length === 0 && !showForm && (
            <div style={{ textAlign: "center", padding: "3rem 0" }}>
              <p style={{ color: "#5C5C5C", fontSize: "1.125rem" }}>
                Nenhuma ideia registrada ainda. Clique em "Nova Ideia" para começar!
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
