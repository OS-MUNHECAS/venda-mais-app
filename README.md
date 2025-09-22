# Venda+ Mobile

![GitHub language count](https://img.shields.io/github/languages/count/SEU-USUARIO/SEU-REPOSITORIO?style=for-the-badge)
![GitHub top language](https://img.shields.io/github/languages/top/SEU-USUARIO/SEU-REPOSITORIO?style=for-the-badge)
![GitHub last commit](https://img.shields.io/github/last-commit/SEU-USUARIO/SEU-REPOSITORIO?style=for-the-badge)

O **Venda+** (Venda Plus) é um aplicativo mobile para gestão de vendas, desenvolvido como projeto da disciplina de Tópicos Especiais II. Ele foi projetado para ser uma ferramenta simples e eficiente para autônomos e pequenas empresas.

## 1. Objetivo e Público-Alvo

O objetivo é capacitar o microempreendedor a gerenciar suas vendas, produtos e clientes de forma organizada diretamente do celular, substituindo planilhas complexas ou sistemas caros.

*   **Público-Alvo:** Pequenas empresas, vendedores autônomos e demais.

## 2. Funcionalidades Planejadas

O escopo do projeto está focado nas seguintes funcionalidades essenciais:

-   **Gestão de Clientes e Produtos (CRUD):** Cadastro, consulta, edição e remoção.
-   **Registro de Vendas:** Lançamento de vendas associando clientes e produtos.
-   **Persistência Local:** Os dados são salvos no dispositivo para acesso rápido e offline.
-   **Recursos Nativos:** Uso de câmera, biometria (*Estamos avaliando) e compartilhamento para melhorar a experiência.
-   **Integração com API:** Consulta de CEP para preenchimento automático de endereço.

## 3. Tecnologias e Arquitetura

A arquitetura foi planejada para ser moderna e eficiente, utilizando tecnologias alinhadas às boas práticas de mercado.

| Componente          | Tecnologia Escolhida      | Justificativa da Escolha                                                                    |
| :------------------ | :------------------------ | :------------------------------------------------------------------------------------------ |
| **Framework**       | React Native com Expo     | Desenvolvimento multiplataforma (Android/iOS) com um único código e ambiente simplificado.    |
| **Navegação**       | Expo Router               | Estrutura de rotas baseada em arquivos, tornando a navegação mais intuitiva e organizada.   |
| **Persistência Local**| SQLite (via `expo-sqlite`)| Banco de dados relacional simples para garantir a integridade dos dados e o acesso offline. |

## 4. Como Executar o Projeto

O projeto está em sua fase inicial de desenvolvimento. As instruções abaixo são para configurar o ambiente. O aplicativo em si ainda não possui funcionalidades implementadas.

**1. Pré-requisitos**

*   [Node.js (versão LTS)](https://nodejs.org/en/)
*   [Git](https://git-scm.com/)

**2. Configuração Inicial**

```bash
# 1. Clone o repositório
git clone https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git

# 2. Entre na pasta do projeto
cd SEU-REPOSITORIO

# 3. Instale as dependências (serão adicionadas em breve)
# npm install
```
*(As dependências do projeto serão adicionadas nos próximos commits.)*

## 🤝 Equipe do Projeto

| Nome | Papel no Projeto | GitHub |
| :--- | :--- | :--- |
| `Diogo Henrique da Silva` | Líder do Projeto / Desenvolvedor | [@Diogohs630](https://github.com/Diogohs630 ) |
| `Andre Luiz da Silva` | Desenvolvedor | [@andreflabr](https://github.com/andreflabr ) |
| `Leonardo Rodrigues Gabriel` | Desenvolvedor | [@leorgabriel](https://github.com/leorgabriel ) |
