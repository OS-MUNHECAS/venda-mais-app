# Venda Mais App

![GitHub language count](https://img.shields.io/github/languages/count/OS-MUNHECAS/venda-mais-app?style=for-the-badge)
![GitHub top language](https://img.shields.io/github/languages/top/OS-MUNHECAS/venda-mais-app?style=for-the-badge)
![GitHub last commit](https://img.shields.io/github/last-commit/OS-MUNHECAS/venda-mais-app?style=for-the-badge)

Aplicativo mobile para gestão de vendas desenvolvido em React Native com Expo. Projeto da disciplina de Tópicos Especiais II do IFSULDEMINAS.

## Arquitetura

- **Frontend Mobile:** React Native com Expo (Cross-platform)
- **Navegação:** Expo Router (File-based routing)
- **Estado:** Context API + LocalStorage
- **Persistência:** LocalStorage (Web) / Memory Storage (Mobile)
- **Tipagem:** TypeScript para type safety

## Objetivo

Ferramenta simples e eficiente para microempreendedores gerenciarem vendas, produtos e clientes diretamente do celular, substituindo planilhas ou sistemas complexos.

**Público-Alvo:** Pequenas empresas, vendedores autônomos e microempreendedores.

## Funcionalidades

### ✅ Implementadas
- **Gestão de Clientes:** CRUD completo com busca, filtros e fotos
- **Gestão de Produtos:** CRUD completo com validações e fotos
- **Registro de Pedidos:** Sistema wizard em 4 etapas (Cliente → Produtos → Frete/Pagamento → Revisão)
- **Histórico de Vendas:** Listagem e detalhamento de pedidos realizados
- **Recursos Nativos:** Câmera e galeria (expo-image-picker)
- **Integração API Externa:** Consulta de CEP via ViaCEP
- **Persistência Local:** LocalStorage/AsyncStorage
- **Sistema de Temas:** 3 temas (Claro, Escuro, Alto Contraste)
- **Interface Profissional:** Design responsivo e acessível

### 🎯 Funcionalidades Detalhadas

#### Módulo de Clientes
- Cadastro completo (Nome, CPF/CNPJ, Contatos, Endereços)
- Busca automática de endereço por CEP
- Múltiplos contatos (Email, Telefone, WhatsApp)
- Foto do cliente (câmera ou galeria)
- Soft delete e hard delete
- Filtros: Todos, Ativos, Inativos

#### Módulo de Produtos
- Cadastro detalhado (Preço custo/venda, Estoque, Pesos, NCM/CEST)
- Cálculo automático de margem de lucro
- Foto do produto (câmera ou galeria)
- Validações de campos obrigatórios
- Soft delete e hard delete
- Busca e filtros por categoria

#### Módulo de Pedidos
- **Etapa 1:** Seleção de cliente
- **Etapa 2:** Adição de produtos e quantidades
- **Etapa 3:** Configuração de frete (CIF/FOB/Retirada) e pagamento
- **Etapa 4:** Revisão e confirmação
- Cálculo automático de totais
- Múltiplas formas de pagamento
- Edição de pedidos existentes

#### Módulo de Histórico
- Listagem cronológica de pedidos
- Detalhamento completo de cada pedido
- Opções de editar e excluir
- Status e valores exibidos

### 🚧 Futuras Melhorias
- Backend com API REST
- Relatórios e gráficos de vendas
- Exportação de dados (PDF, Excel)
- Notificações push
- Sincronização em nuvem

## Stack Tecnológica

| Componente | Tecnologia | Versão |
|:-----------|:-----------|:-------|
| **Framework** | React Native + Expo | ~54.0.29 |
| **Linguagem** | TypeScript | ~5.9.2 |
| **Navegação** | Expo Router | ~6.0.19 |
| **Recursos Nativos** | expo-image-picker | ~17.0.10 |
| **Persistência** | AsyncStorage | ~2.2.0 |
| **Ícones** | @expo/vector-icons | ~15.0.3 |
| **HTTP Client** | Fetch API (nativo) | - |

## Estrutura do Projeto

```
venda-mais-app/
├── app/                    # Estrutura de rotas (Expo Router)
│   ├── (tabs)/            # Navegação por abas
│   │   ├── clientes.tsx   # Tela de clientes (implementada)
│   │   ├── produtos.tsx   # Tela de produtos
│   │   ├── pedidos.tsx    # Tela de pedidos
│   │   ├── historico.tsx  # Histórico de vendas
│   │   ├── index.tsx      # Tela inicial
│   │   └── types/         # Tipos TypeScript
│   ├── _layout.tsx        # Layout raiz
│   └── +not-found.tsx     # Página 404
├── components/            # Componentes reutilizáveis
├── constants/             # Constantes e temas
├── hooks/                 # Hooks customizados
└── assets/               # Imagens e recursos
```

## Executar Localmente

### Pré-requisitos
- [Node.js LTS](https://nodejs.org/)
- [Git](https://git-scm.com/)

### Instalação e Execução

```bash
# Clone o repositório
git clone https://github.com/OS-MUNHECAS/venda-mais-app.git
cd venda-mais-app

# Instale dependências e execute
npm install
npx expo start
```

### Opções de Execução

```bash
npx expo start --web     # Executar no navegador
npx expo start --android # Executar no Android
npx expo start --ios     # Executar no iOS (macOS)
```

## Status do Desenvolvimento

| Módulo | Status | Descrição |
|:-------|:------:|:----------|
| **Clientes** | ✅ Completo | CRUD completo com fotos e ViaCEP |
| **Produtos** | ✅ Completo | CRUD completo com fotos e validações |
| **Pedidos** | ✅ Completo | Sistema wizard com 4 etapas |
| **Histórico** | ✅ Completo | Listagem e detalhamento de pedidos |
| **Configurações** | ✅ Completo | Gerenciamento de 3 temas |
| **Sobre** | ✅ Completo | Informações do app e equipe |
| **Ajuda** | ✅ Completo | FAQ funcional |

## Contribuição

1. Faça um clone do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'feat: adicionar nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## Equipe

| Nome | Papel | GitHub |
|:-----|:------|:-------|
| Diogo Henrique da Silva | Líder do Projeto | [@Diogohs630](https://github.com/Diogohs630) |
| Andre Luiz da Silva | Desenvolvedor | [@andreflabr](https://github.com/andreflabr) |
| Leonardo Rodrigues Gabriel | Desenvolvedor | [@leorgabriel](https://github.com/leorgabriel) |
