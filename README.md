Descrição
Este projeto é composto por duas partes: uma API desenvolvida em ASP.NET e um Front-end desenvolvido em React JS com TypeScript. 
A API implementa a lógica de um CRUD (Create, Read, Update, Delete) para funcionários e departamentos, ambos interligados. Além disso, 
possui um sistema de upload de imagem para as fotos dos funcionários. A interface em React fornece os formulários e a visualização dos 
dados dessas entidades.

Tecnologias Utilizadas:

Back-end (API):
  ASP.NET
  Entity Framework Core - ORM
  MySQL - Banco de dados
  Swagger - Documentação da API

Front-end:
  React JS
  TypeScript
  React Router - Gerenciamento de rotas

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Funcionalidades:

API
  CRUD de Funcionários
  CRUD de Departamentos
  Upload de imagens para fotos dos funcionários
  Relacionamento entre funcionários e departamentos
  
Front-end:
  Formulários para criação e edição de funcionários e departamentos
  Visualização de listas de funcionários e departamentos
  Upload de imagens para funcionários
  Navegação entre páginas utilizando React Router

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Como Executar o Projeto:
  Pré-requisitos:
    Node.js (para o Front-end)
    .NET SDK (para a API)
    MySQL (para o banco de dados)

  Passos para Executar a API:
    1 - Clone este repositório: 
    2 - Navegue até a pasta da API: 
    3 - Configure a string de conexão do banco de dados no arquivo "appsettings.json"
    4 - Execute as migrações do Entity Framework para criar o banco de dados: "dotnet ef database update" (Terminal) || "Update-Database" (Console do gerenciador de pacotes Nuget)
    5 - Execute a aplicação: "dotnet run"

  Passos para Executar o Front-end:
    1 - Navegue até a pasta do projeto React: 
    2 - Instale as dependências: "npm install"
    3 - Execute a aplicação: "npm start"
    
