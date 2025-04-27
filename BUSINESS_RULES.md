# Fluxo de Uso

## Registro de Usuário
O usuário realiza o registro no sistema fornecendo um nome de usuário e senha.

## Login de Usuário
O usuário realiza o login no sistema utilizando suas credenciais (nome de usuário e senha).

## Criação de Lista de Compras
Após o login, o usuário pode criar uma nova lista de compras, fornecendo um nome para a lista.

## Adição de Usuários à Lista de Compras
O usuário pode adicionar outros usuários à lista de compras, utilizando o nome de usuário ou o ID do usuário.

## Adição de Itens à Lista de Compras
O usuário pode adicionar itens à lista de compras, fornecendo informações como nome, preço e categoria.

## Sincronização em Tempo Real
- Quando um item é adicionado à lista, um evento é disparado via WebSocket para notificar os outros usuários da lista.
- Os clientes conectados recebem o ID da lista e do item.
- Os clientes realizam uma consulta ao banco de dados para buscar os dados atualizados e atualizar a interface.

---

# Requisitos Funcionais

## Registro de Usuário
- O sistema deve permitir que novos usuários se registrem fornecendo um nome de usuário único e uma senha.
- O sistema deve validar se o nome de usuário já está em uso antes de concluir o registro.

## Login de Usuário
- O sistema deve autenticar os usuários com base no nome de usuário e senha.
- Após o login bem-sucedido, o sistema deve retornar um token de autenticação (JWT).

## Criação de Lista de Compras
- O sistema deve permitir que usuários autenticados criem listas de compras.
- Cada lista deve ser associada ao usuário que a criou.

## Adição de Usuários à Lista de Compras
- O sistema deve permitir que o criador da lista adicione outros usuários à lista.
- A adição pode ser feita utilizando o nome de usuário ou o ID do usuário.
- O sistema deve verificar se o usuário a ser adicionado existe.

## Adição de Itens à Lista de Compras
- O sistema deve permitir que usuários associados à lista adicionem itens à lista.
- Cada item deve conter informações como nome, preço, categoria e estado (marcado ou não).
- O sistema deve registrar o usuário que adicionou o item.

## Sincronização em Tempo Real
- O sistema deve emitir eventos via WebSocket sempre que um item for adicionado à lista.
- Os eventos devem conter o ID da lista e do item.
- Os clientes conectados devem buscar os dados atualizados no banco de dados e atualizar a interface.

## Segurança e Controle de Acesso
- Apenas usuários autenticados devem acessar as funcionalidades do sistema.
- Apenas usuários associados a uma lista devem poder visualizar ou modificar seus itens.
- O sistema deve validar permissões antes de permitir qualquer ação.