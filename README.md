# 🚀 Sistema de Pedidos Online

Um sistema completo para gerenciamento de pedidos, desenvolvido com **React.js**, **Node.js** e **PostgreSQL**. Permite que clientes enviem pedidos online e administradores gerenciem todo o fluxo, com interface moderna, responsiva e suporte a temas claro/escuro.

---

## ✨ Demonstração Rápida

- **Site:** [sistema-pedidos-online.vercel.app](https://sistema-pedidos-online.vercel.app)
- **API:** [sistema-pedidos-backend.onrender.com](https://sistema-pedidos-backend.onrender.com)
- **Database:** [Neon.tech PostgreSQL](https://neon.tech/)

---

## 🎯 Credenciais de Teste

**Administrador**  
- Email: `admin@sistema.com`  
- Senha: `admin123`

**Usuário Comum**  
- Crie uma conta diretamente pelo site

---

## 🆕 Funcionalidades Implementadas

### 🎨 Interface Moderna
- **Tema Dark/Light:** Alternância com persistência
- **Design Responsivo:** Perfeito no mobile e desktop
- **UI/UX Melhorado:** Componentes elegantes e intuitivos

### 🔍 Sistema de Busca Avançada
- **Busca em tempo real** por descrição e categoria
- **Filtros múltiplos:** status, categoria, orçamento, data
- **Estatísticas em tempo real:** Cards com métricas
- **Filtros salvos:** Interface intuitiva

### 📊 Dashboard Aprimorado
- **Gráficos de status:** Visualização rápida da distribuição dos pedidos
- **Métricas principais:** Cards com números e tendências
- **Pedidos recentes:** Lista com preview rápido
- **Ações rápidas:** Links diretos para funções principais

---

## 🛠️ Tecnologias Utilizadas

### **Frontend**
- React.js 18
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Lucide React (Ícones)
- Context API

### **Backend**
- Node.js
- Express.js
- PostgreSQL
- JWT (autenticação)
- bcryptjs (criptografia de senha)
- Zod (validação)
- CORS
- Multer (upload de arquivos, pronto para implementar)

### **Infraestrutura**
- Neon.tech (PostgreSQL Cloud)
- Render.com (backend)
- Vercel (frontend)

---

## 📋 Funcionalidades Principais

### 👤 Usuário Comum
- Criar conta e login
- Fazer novos pedidos com orçamento
- Visualizar histórico de pedidos
- Acompanhar status em tempo real
- Categorizar e filtrar pedidos
- Interface com tema claro/escuro

### 🛠️ Administrador
- Visualizar todos os pedidos
- Atualizar status dos pedidos
- Filtrar pedidos por múltiplos critérios
- Gerenciar usuários
- Dashboard com métricas avançadas e gráficos

---

## 📊 Status dos Pedidos

| Status        | Descrição         | Emoji |
|---------------|------------------|-------|
| Em análise    | Pedido recebido  | 🔍    |
| Aprovado      | Pedido aceito    | ✅    |
| Rejeitado     | Pedido recusado  | ❌    |
| Em andamento  | Em produção      | ⚙️    |
| Concluído     | Finalizado       | 🏁    |

---

## 🚀 Como Executar Localmente

### **Pré-requisitos**
- Node.js 18+
- PostgreSQL (local ou [Neon.tech](https://neon.tech))
- npm ou yarn

### 1. Clone o repositório

```bash
git clone https://github.com/PabloG-7/sistema-pedidos.git
cd sistema-pedidos
```

### 2. Configuração do Backend

```bash
cd backend
npm install
cp .env.example .env
```
- Edite o `.env` com suas configurações:
  ```env
  DATABASE_URL=sua_string_conexao_neon_tech
  JWT_SECRET=seu_jwt_secret_super_seguro
  PORT=5000
  NODE_ENV=development
  ```
- Execute o backend:
  ```bash
  npm run dev
  ```

### 3. Configuração do Frontend

```bash
cd ../frontend
npm install
npm run dev
```

### 4. Configuração do Banco de Dados

- Execute o script `backend/database/schema.sql` no seu banco PostgreSQL.

---

## 📦 Scripts Disponíveis

### **Backend**
```bash
npm run dev      # Desenvolvimento com hot reload
npm start        # Produção
```

### **Frontend**
```bash
npm run dev      # Desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview do build
```

---

## 🗃️ Estrutura do Banco de Dados

### **Tabela `users`**
| Campo       | Tipo      | Descrição                |
|-------------|-----------|--------------------------|
| id          | UUID      | Identificador único      |
| name        | VARCHAR   | Nome do usuário          |
| email       | VARCHAR   | Email único              |
| password    | VARCHAR   | Senha criptografada      |
| role        | VARCHAR   | admin ou user            |
| created_at  | TIMESTAMP | Data de criação          |
| updated_at  | TIMESTAMP | Data de atualização      |

### **Tabela `orders`**
| Campo             | Tipo      | Descrição                  |
|-------------------|-----------|----------------------------|
| id                | UUID      | Identificador único        |
| user_id           | UUID      | ID do usuário              |
| description       | TEXT      | Descrição do pedido        |
| category          | VARCHAR   | Categoria do pedido        |
| estimated_budget  | DECIMAL   | Orçamento estimado         |
| status            | VARCHAR   | Status atual do pedido     |
| created_at        | TIMESTAMP | Data de criação            |
| updated_at        | TIMESTAMP | Data de atualização        |

---

## 🔌 API Endpoints

### **Autenticação**
- `POST /api/auth/register` — Criar conta
- `POST /api/auth/login` — Fazer login

### **Pedidos**
- `POST /api/orders` — Criar pedido
- `GET /api/orders/my-orders` — Meus pedidos
- `GET /api/orders` — Todos pedidos (admin)
- `PATCH /api/orders/:id/status` — Atualizar status

### **Upload (pronto para implementar)**
- `POST /api/upload/upload` — Upload de arquivos
- `GET /api/upload/files/:filename` — Servir arquivos

### **Usuários**
- `GET /api/users/profile` — Perfil do usuário

---

## 🌐 Deploy

### **Backend (Render.com)**
- Conecte o repositório no Render
- Configure as variáveis de ambiente:
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `NODE_ENV=production`
- Deploy automático a cada push

### **Frontend (Vercel)**
- Conecte o repositório no Vercel
- Configure:
  - Framework Preset: `Vite`
  - Root Directory: `frontend`
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - Environment Variable: `VITE_API_URL=https://sistema-pedidos-backend.onrender.com/api`
- Deploy contínuo automático

### **Banco de Dados (Neon.tech)**
- Crie uma conta no [Neon.tech](https://neon.tech)
- Crie um novo projeto PostgreSQL
- Execute o script `schema.sql`

---

## 🎯 Próximas Funcionalidades Planejadas

- 📱 PWA (Progressive Web App)
- 📁 Upload completo de arquivos
- 💬 Notificações em tempo real
- 📈 Relatórios PDF/Excel
- 🔐 Autenticação social (Google/GitHub)

---
