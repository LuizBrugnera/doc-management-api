# API de Gerenciamento de Documentos

Documentação resumida da API para gerenciamento de documentos, usuários, logs, notificações, departamentos e autenticação.

## Tecnologias Utilizadas

O projeto foi desenvolvido utilizando as seguintes tecnologias e bibliotecas:

- **Node.js**: Ambiente de execução para JavaScript no lado do servidor.
- **Express**: Framework web para Node.js que facilita a criação de APIs robustas.
- **TypeScript**: Superset do JavaScript que adiciona tipagem estática opcional e outros recursos.
- **TypeORM**: ORM que suporta múltiplos bancos de dados, utilizado aqui com MySQL.
- **MySQL**: Sistema de gerenciamento de banco de dados relacional para armazenamento dos dados.
- **JWT (jsonwebtoken)**: Implementação de JSON Web Tokens para autenticação segura.
- **BcryptJS**: Biblioteca para hashing de senhas, garantindo segurança na armazenagem de credenciais.
- **Multer**: Middleware para manipulação de uploads de arquivos em aplicações Node.js.
- **Nodemailer**: Módulo para envio de emails a partir do servidor Node.js.
- **UUID**: Geração de identificadores únicos universais.

## Índice

- [Endpoints Principais](#endpoints-principais)
  - [Autenticação](#autenticação)
  - [Usuários](#usuários)
  - [Documentos](#documentos)
  - [Logs](#logs)
  - [Logs de Administrador](#logs-de-administrador)
  - [Notificações](#notificações)
  - [Departamentos](#departamentos)
  - [Administradores](#administradores)
- [Autenticação](#autenticação-1)
- [Download da Documentação Completa](#download-da-documentação-completa)

## Endpoints Principais

### Autenticação

- **Registrar Usuário**: `POST /auth/user/register`
- **Login de Usuário**: `POST /auth/user/login`
- **Registrar Administrador**: `POST /auth/admin/register`
- **Login de Administrador**: `POST /auth/admin/login`
- **Gerar Código de Redefinição de Senha**: `POST /auth/generate-code`

### Usuários

- **Listar Usuários**: `GET /users`
- **Criar Usuário**: `POST /users`
- **Buscar Usuário por ID**: `GET /users/{id}`
- **Atualizar Usuário**: `PUT /users/{id}`
- **Deletar Usuário**: `DELETE /users/{id}`

### Documentos

- **Upload de Documento para Usuário Específico**: `POST /documents/upload/file/{userId}`
- **Upload de Documento com Atribuição Automática**: `POST /documents/upload/auto-assign`

### Logs

- **Listar Logs**: `GET /logs`
- **Criar Log**: `POST /logs`
- **Buscar Log por ID**: `GET /logs/{id}`
- **Atualizar Log**: `PUT /logs/{id}`
- **Deletar Log**: `DELETE /logs/{id}`

### Logs de Administrador

- **Listar Logs de Administrador**: `GET /admin-logs`
- **Criar Log de Administrador**: `POST /admin-logs`
- **Buscar Log de Administrador por ID**: `GET /admin-logs/{id}`
- **Atualizar Log de Administrador**: `PUT /admin-logs/{id}`

### Notificações

- **Marcar Notificação como Lida**: `PUT /notifications/read/{id}`
- **Listar Notificações do Usuário Autenticado**: `GET /notifications/user`

### Departamentos

- **Listar Departamentos**: `GET /departments`
- **Criar Departamento**: `POST /departments`
- **Buscar Departamento por ID**: `GET /departments/{id}`
- **Atualizar Departamento**: `PUT /departments/{id}`
- **Deletar Departamento**: `DELETE /departments/{id}`
- **Buscar Departamentos pelo Nome**: `GET /departments/by-department/{department}`

### Administradores

- **Atualizar Administrador**: `PUT /admins/{id}`

## Autenticação

A API utiliza autenticação via token JWT. Para acessar os endpoints protegidos, inclua o token no cabeçalho das requisições:

## Download da Documentação Completa

Para mais detalhes sobre os endpoints, esquemas e exemplos, faça o download do arquivo JSON completo da documentação.

- [Baixar doc.json](./doc.json)