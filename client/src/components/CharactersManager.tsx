import { useState, useEffect } from "react";
import { BookOpen, Plus, Trash2, ArrowLeft } from "lucide-react";

interface Character {
  id: string;
  name: string;
  role: string;
  description: string;
  createdAt: string;
}

interface CharactersManagerProps {
  groupCode: string;
  onBack: () => void;
}

export default function CharactersManager({ groupCode, onBack }: CharactersManagerProps) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", role: "", description: "" });
  const [error, setError] = useState<string | null>(null);

  // Carregar personagens do localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`storyweaver-characters-${groupCode}`);
    if (saved) {
      try {
        setCharacters(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao carregar personagens:", e);
      }
    }
  }, [groupCode]);

  // Salvar personagens no localStorage
  useEffect(() => {
    localStorage.setItem(`storyweaver-characters-${groupCode}`, JSON.stringify(characters));
  }, [characters, groupCode]);

  const handleAddCharacter = () => {
    if (!formData.name.trim()) {
      setError("Digite o nome do personagem");
      return;
    }
    if (!formData.role.trim()) {
      setError("Digite o papel/função do personagem");
      return;
    }

    const newCharacter: Character = {
      id: Date.now().toString(),
      name: formData.name,
      role: formData.role,
      description: formData.description,
      createdAt: new Date().toISOString(),
    };

    setCharacters([...characters, newCharacter]);
    setFormData({ name: "", role: "", description: "" });
    setShowForm(false);
    setError(null);
  };

  const handleDeleteCharacter = (id: string) => {
    setCharacters(characters.filter(c => c.id !== id));
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
              <BookOpen style={{ color: "#7A4E2D" }} className="w-6 h-6" />
              <h1 style={{ color: "#2B2B2B" }} className="text-xl font-bold tracking-tight">Personagens</h1>
            </div>
          </div>
        </div>
      </header>

      <main style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "3rem 1rem" }}>
        <div style={{ maxWidth: "900px", width: "100%" }}>
          {/* Botão Adicionar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <h2 style={{ color: "#2B2B2B" }} className="text-2xl font-bold">
              {characters.length} Personagem(ns)
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
              Novo Personagem
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
              <h3 style={{ color: "#2B2B2B" }} className="text-xl font-bold mb-4">Adicionar Novo Personagem</h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={{ color: "#2B2B2B", fontWeight: "600", display: "block", marginBottom: "0.5rem" }}>
                    Nome do Personagem
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: João Silva"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                    Papel/Função
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Protagonista, Antagonista, Coadjuvante"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
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
                    Descrição
                  </label>
                  <textarea
                    placeholder="Descreva a personalidade, história de fundo, motivações..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    style={{
                      backgroundColor: "#F5F1E8",
                      color: "#2B2B2B",
                      padding: "0.75rem",
                      borderRadius: "0.5rem",
                      border: "1px solid #E8E0D0",
                      fontSize: "1rem",
                      width: "100%",
                      minHeight: "120px",
                      fontFamily: "inherit",
                    }}
                  />
                </div>

                {error && (
                  <p style={{ color: "#E74C3C", fontSize: "0.875rem" }}>{error}</p>
                )}

                <div style={{ display: "flex", gap: "1rem" }}>
                  <button
                    onClick={handleAddCharacter}
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
                    Salvar Personagem
                  </button>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setFormData({ name: "", role: "", description: "" });
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

          {/* Lista de Personagens */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
            {characters.map((character) => (
              <div
                key={character.id}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "#E8E0D0",
                  border: "1px solid #E8E0D0",
                  borderRadius: "0.75rem",
                  padding: "1.5rem",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                  <div>
                    <h4 style={{ color: "#2B2B2B" }} className="text-lg font-bold">
                      {character.name}
                    </h4>
                    <p style={{ color: "#7A4E2D", fontSize: "0.875rem", fontWeight: "600" }}>
                      {character.role}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteCharacter(character.id)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#E74C3C",
                    }}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <p style={{ color: "#5C5C5C", fontSize: "0.875rem", lineHeight: "1.6" }}>
                  {character.description || "Sem descrição"}
                </p>
              </div>
            ))}
          </div>

          {characters.length === 0 && !showForm && (
            <div style={{ textAlign: "center", padding: "3rem 0" }}>
              <p style={{ color: "#5C5C5C", fontSize: "1.125rem" }}>
                Nenhum personagem criado ainda. Clique em "Novo Personagem" para começar!
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
