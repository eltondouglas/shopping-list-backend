# shopping-list-backend

Backend do shopping list usando websockets.

## Funcionalidades Implementadas

### API REST
- **Autenticação de usuários**:
  - Registro de usuários com hash de senha.
  - Login de usuários com geração de token JWT.
- **Gerenciamento de grupos**:
  - Criação de grupos com retorno do ID do grupo.
  - Adição de usuários a grupos existentes.
- **Gerenciamento de listas de compras**:
  - Adição de itens à lista de compras com nome, preço e categoria.
  - Recuperação de itens da lista de compras por grupo.

### WebSocket
- **Sincronização em tempo real**:
  - Usuários podem entrar em grupos via WebSocket.
  - Atualizações em tempo real para todos os usuários do grupo:
    - Marcar/desmarcar itens como concluídos.
    - Atualizar informações de itens (nome, preço, categoria).
    - Remover itens da lista.
  - Eventos emitidos para todos os usuários do grupo quando alterações ocorrem.

### Estrutura do Banco de Dados
- Tabelas para gerenciar usuários, grupos, listas de compras e associação entre usuários e grupos.

## TODO

### Decisão de Design: Comunicação com o WebSocket
Definir como os dados serão processados e sincronizados:
1. **Opção 1**: 
   - Os dados são salvos primeiro no banco de dados via API REST.
   - Um evento é disparado pelo WebSocket, onde o ID do cliente que disparou o evento é usado para recuperar os dados atualizados do banco e sincronizar com todos os usuários do grupo.

2. **Opção 2**:
   - Os dados são enviados diretamente pelo WebSocket.
   - O servidor WebSocket grava os dados no banco de dados e, em seguida, sincroniza as alterações com todos os usuários do grupo.

Avaliar as vantagens e desvantagens de cada abordagem para garantir consistência e desempenho.

## Como Executar

1. Instale as dependências:
   ```bash
   npm install

2. Configure o banco de dados:
   - Crie as tabelas conforme descrito na seção de estrutura do banco de dados.

3. Inicie o servidor:
   ```bash 
   npm deploy

4. Acesse a API REST:
   - Endpoints disponíveis em /api/auth e /api

5. Teste o WebSocket:
   - Conecte-se ao WebSocket em ws://localhost:3000.

### Tecnologias Utilizadas
   - Node.js com Express para a API REST.
   - Socket.IO para comunicação em tempo real.
   - PostgreSQL como banco de dados.
   - JWT para autenticação.
   - Bcrypt para hash de senhas.