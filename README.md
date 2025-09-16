# Venda+ Mobile

![GitHub repo size](https://img.shields.io/github/repo-size/seu-usuario/venda-plus?style=for-the-badge )
![GitHub language count](https://img.shields.io/github/languages/count/seu-usuario/venda-plus?style=for-the-badge )
![GitHub top language](https://img.shields.io/github/languages/top/seu-usuario/venda-plus?style=for-the-badge )
![GitHub last commit](https://img.shields.io/github/last-commit/seu-usuario/venda-plus?style=for-the-badge )

## Introdução e Objetivos

O **Venda+** é um aplicativo mobile de gestão de vendas, desenvolvido como projeto da disciplina de Tópicos Especiais II.

O objetivo principal é criar uma ferramenta simples e eficiente para atender às necessidades de **pequenas empresas, vendedores autônomos e profissionais liberais**. O aplicativo será intuitivo e fácil de usar, permitindo o gerenciamento de vendas, produtos, clientes e relatórios de forma rápida e organizada, diretamente do celular.

## Público-Alvo

*   Pequenas empresas
*   Vendedores autônomos
*   Profissionais liberais

## ✨ Funcionalidades Essenciais

O projeto se concentra em entregar um MVP (Produto Mínimo Viável) robusto com as seguintes funcionalidades:

-   **CRUD de Clientes:** Cadastro, consulta, edição e remoção de clientes.
-   **CRUD de Produtos:** Gerenciamento de produtos, incluindo nome, descrição e preço.
-   **Navegação Intuitiva:** Telas claras e fluxo de navegação lógico entre as funcionalidades.
-   **Persistência Local:** Uso de armazenamento no dispositivo para uma experiência de uso mais rápida e responsiva.
-   **Integração com API Externa:** Consulta automática de endereços via CEP para agilizar o cadastro de clientes.
-   **Recursos Nativos:** Utilização de funcionalidades do dispositivo para melhorar a experiência do usuário (ex: câmera, biometria).
-   **Validação de Formulários:** Garantia de que os dados inseridos sejam consistentes e válidos.
-   **Feedback Visual:** Componentes de loading, mensagens de sucesso e erro para manter o usuário informado.

## 🛠️ Tecnologias e Arquitetura

A arquitetura do projeto é baseada em uma abordagem Cliente-Servidor, priorizando tecnologias ágeis e eficientes.

| Camada | Tecnologia | Justificativa |
| :--- | :--- | :--- |
| **Frontend (Mobile)** | `React Native` | Framework para desenvolvimento de apps nativos para Android e iOS com um único código-base. |
| **Backend (API)** | `Python` + `Flask` | Uma stack leve e poderosa para a construção de APIs REST, ideal para um desenvolvimento rápido e eficiente. |
| **Banco de Dados** | `PostgreSQL` | Banco de dados relacional robusto e confiável para garantir a integridade dos dados. |
| **Persistência Local** | `SQLite` | Armazenamento de dados no dispositivo para performance, acesso offline e cumprimento dos requisitos. |
| **API Externa** | `ViaCEP` | Utilizada para automatizar o preenchimento de endereços a partir do CEP. |

## 🚀 Como Executar o Projeto

### Pré-requisitos

-   [Node.js (LTS)](https://nodejs.org/en/ )
-   [NPM](https://www.npmjs.com/get-npm ) (já vem com o Node.js)
-   [Python 3.10+](https://www.python.org/downloads/ )
-   [Docker](https://www.docker.com/get-started/ ) (Recomendado para rodar o PostgreSQL)
-   Ambiente de desenvolvimento mobile configurado ([Android Studio](https://developer.android.com/studio ) / [Xcode](https://developer.apple.com/xcode/ )).

### Instalação e Execução

```bash
# 1. Clone o repositório
$ git clone https://github.com/seu-usuario/venda-plus.git
$ cd venda-plus

# 2. Inicie o banco de dados com Docker
$ cd backend
$ docker-compose up -d # Este comando irá iniciar um container com o PostgreSQL

# 3. Configure e execute a API Flask
$ python3 -m venv venv
$ source venv/bin/activate
$ pip install -r requirements.txt
$ flask run

# 4. Em um novo terminal, instale e execute o app mobile
$ cd ../frontend
$ npm install
$ npm run android # ou npm run ios
```

## 🤝 Equipe do Projeto

| Nome | Papel no Projeto | GitHub |
| :--- | :--- | :--- |
| `Diogo Henrique da Silva` | Líder do Projeto / Desenvolvedor | [@Diogohs630](https://github.com/Diogohs630 ) |
| `Andre Luiz da Silva` | Desenvolvedor | [@andreflabr](https://github.com/andreflabr ) |
| `Leonardo Rodrigues Gabriel` | Desenvolvedor | [@leorgabriel](https://github.com/leorgabriel ) |
