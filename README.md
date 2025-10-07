# 🚀 Sistema de Pedidos Online

Um sistema completo de gerenciamento de pedidos desenvolvido com **React.js**, **Node.js** e **PostgreSQL**. Permite que clientes enviem pedidos online e administradores gerenciem todo o fluxo, com interface moderna e responsiva.

---

## ✨ Demonstração

- **🌐 Site:** [sistema-pedidos-online.netlify.app](https://sistema-pedidos-online.netlify.app)
- **🔧 API:** [sistema-pedidos-production-bba4.up.railway.app](https://sistema-pedidos-production-bba4.up.railway.app)

---

## 🎯 Credenciais de Teste

- **Administrador:**  
  `admin@sistema.com` / `admin123`
- **Usuário comum:**  
  Crie uma conta no site

---

## 🛠️ Tecnologias Utilizadas

### Frontend

- **React.js 18** · Biblioteca principal
- **Vite** · Build tool & dev server
- **Tailwind CSS** · Estilização moderna
- **React Router DOM** · Roteamento SPA
- **Axios** · Cliente HTTP
- **Lucide React** · Ícones

### Backend

- **Node.js** · Runtime JavaScript
- **Express.js** · Framework web
- **PostgreSQL** · Banco de dados relacional
- **JWT** · Autenticação segura
- **bcryptjs** · Criptografia de senhas
- **Zod** · Validação de dados
- **CORS** · Cross-Origin Resource Sharing

### Infraestrutura

- **Neon.tech** · Banco de dados PostgreSQL Cloud
- **Railway** · Deploy backend
- **Netlify** · Deploy frontend

---

## 📋 Funcionalidades

### 👤 Usuário Comum

- ✅ Criar conta e fazer login
- ✅ Fazer novos pedidos com orçamento
- ✅ Visualizar histórico de pedidos
- ✅ Acompanhar status dos pedidos
- ✅ Categorizar pedidos

### 🛠️ Administrador

- ✅ Visualizar todos os pedidos
- ✅ Atualizar status dos pedidos
- ✅ Filtrar pedidos por status
- ✅ Gerenciar usuários

---

## 📊 Status dos Pedidos

| Status           | Descrição                 | Emoji   |
|------------------|--------------------------|---------|
| Em análise       | Pedido recebido          | 🔍      |
| Aprovado         | Pedido aceito            | ✅      |
| Rejeitado        | Pedido recusado          | ❌      |
| Em andamento     | Em produção              | ⚙️      |
| Concluído        | Finalizado               | 🏁      |

---

## 🚀 Como Executar Localmente

### **Pré-requisitos**

- Node.js 16+
- PostgreSQL ou conta no [Neon.tech](https://neon.tech/)
- npm ou yarn

---

### 1. Clone o repositório

```bash
git clone https://github.com/PabloG-7/sistema-pedidos.git
cd sistema-pedidos
```

---

### 2. Configuração do Backend

```bash
cd backend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
DATABASE_URL=sua_string_conexao_neon_tech
JWT_SECRET=seu_jwt_secret_super_seguro
PORT=5000
NODE_ENV=development
```

Execute o backend:

```bash
npm run dev
```

---

### 3. Configuração do Frontend

```bash
cd frontend

# Instale as dependências
npm install

# Execute o frontend
npm run dev
```

---

### 4. Configuração do Banco de Dados

Execute o script `backend/database/schema.sql` no seu banco PostgreSQL.

---

## 📦 Scripts Disponíveis

### Backend

```bash
npm run dev      # Desenvolvimento com hot reload
npm start        # Produção
```

### Frontend

```bash
npm run dev      # Desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview do build
```

---

## 🗃️ Estrutura do Banco de Dados

### Tabela users

| id (UUID) | name | email | password | role | created_at | updated_at |

### Tabela orders

| id (UUID) | user_id | description | category | estimated_budget | status | created_at | updated_at |

---

## 🔌 API Endpoints

### Autenticação

- `POST /api/auth/register` · Criar conta
- `POST /api/auth/login` · Fazer login

### Pedidos

- `POST /api/orders` · Criar pedido
- `GET /api/orders/my-orders` · Meus pedidos
- `GET /api/orders` · Todos pedidos (admin)
- `PATCH /api/orders/:id/status` · Atualizar status

### Usuários

- `GET /api/users/profile` · Perfil do usuário

---

## 🌐 Deploy

### Backend (Railway)

- Conecte seu repositório no Railway
- Configure as variáveis de ambiente
- Deploy automático

### Frontend (Netlify)

- Conecte seu repositório no Netlify
- Configure:
  - **Build command:** `npm run build`
  - **Publish directory:** `dist`
  - **Environment:** `VITE_API_URL=sua_url_backend`

### Banco de Dados (Neon.tech)

- Crie uma conta no [Neon.tech](https://neon.tech/)
- Crie um novo projeto
- Execute o script `schema.sql`

---

## 🎨 Estrutura do Projeto

```text
sistema-pedidos-online/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── server.js
│   ├── database/
│   │   └── schema.sql
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
└── README.md
```

---

## 🤝 Contribuindo

1. **Fork** o projeto
2. Crie uma branch para sua feature  
   `git checkout -b feature/NomeDaFeature`
3. Commit suas mudanças  
   `git commit -m 'Add NomeDaFeature'`
4. Push para a branch  
   `git push origin feature/NomeDaFeature`
5. Abra um **Pull Request**

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

---
