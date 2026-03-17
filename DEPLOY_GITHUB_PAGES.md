# Deploy do StoryWeaver no GitHub Pages

Este guia explica como fazer o deploy permanente do StoryWeaver no GitHub Pages.

## Pré-requisitos

- Node.js 22+ instalado
- pnpm instalado (`npm install -g pnpm`)
- Git instalado
- Acesso ao repositório GitHub

## Passos para Deploy

### 1. Clone o repositório (se ainda não tiver)
```bash
git clone https://github.com/joaopinguim928-hash/app-livro.git
cd app-livro
```

### 2. Instale as dependências
```bash
pnpm install
```

### 3. Faça o build da aplicação
```bash
pnpm build
```

Isso criará a pasta `dist/public` com todos os arquivos otimizados.

### 4. Instale o `gh-pages` (ferramenta de deploy)
```bash
pnpm add -D gh-pages
```

### 5. Atualize o `package.json`

Adicione o seguinte script na seção `"scripts"`:

```json
"deploy": "pnpm build && gh-pages -d dist/public"
```

Seu `package.json` deve ficar assim:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "deploy": "pnpm build && gh-pages -d dist/public",
    ...
  }
}
```

### 6. Execute o deploy
```bash
pnpm deploy
```

Isso fará o build e enviará os arquivos para o branch `gh-pages` do seu repositório.

### 7. Ative o GitHub Pages

1. Acesse seu repositório: https://github.com/joaopinguim928-hash/app-livro
2. Vá para **Settings** (Configurações)
3. Clique em **Pages** (no menu esquerdo)
4. Em **Source**, selecione **Deploy from a branch**
5. Em **Branch**, selecione **gh-pages** e **/ (root)**
6. Clique em **Save**

## URL Permanente

Após completar os passos acima, seu site estará disponível em:

```
https://joaopinguim928-hash.github.io/app-livro/
```

## Atualizações Futuras

Sempre que você quiser atualizar o site, basta executar:

```bash
pnpm deploy
```

O GitHub Pages será atualizado automaticamente!

## Troubleshooting

### Erro: "gh-pages não encontrado"
```bash
pnpm add -D gh-pages
```

### Erro: "Permissão negada"
Verifique se você tem permissão de push no repositório.

### Site não aparece
Aguarde 2-3 minutos após o deploy. GitHub Pages pode levar um tempo para processar.

---

**Pronto!** Seu StoryWeaver agora está online permanentemente no GitHub Pages! 🎉
