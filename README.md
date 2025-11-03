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

### Implementadas
- **Gestão de Clientes:** CRUD completo com busca e filtros
- **Recursos Nativos:** Câmera e galeria para fotos de clientes
- **Persistência Local:** Dados salvos no LocalStorage
- **Interface Profissional:** Design limpo e responsivo

### Planejadas
- **Gestão de Produtos:** CRUD completo de produtos
- **Registro de Vendas:** Lançamento de vendas
- **Relatórios:** Histórico e métricas de vendas
- **Integração com API:** Consulta de CEP

## Stack Tecnológica

| Componente | Tecnologia | Versão |
|:-----------|:-----------|:-------|
| **Framework** | React Native + Expo | ~54.0.10 |
| **Linguagem** | TypeScript | ~5.9.2 |
| **Navegação** | Expo Router | ~6.0.8 |
| **Recursos Nativos** | expo-image-picker | Latest |
| **Persistência** | LocalStorage / Memory | Nativo |

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

- ✅ **Clientes** - CRUD completo com fotos
- ⏳ **Produtos** - Em desenvolvimento
- ⏳ **Pedidos** - Planejado
- ⏳ **Histórico** - Planejado

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
