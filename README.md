# Venda Mais App

![GitHub language count](https://img.shields.io/github/languages/count/OS-MUNHECAS/venda-mais-app?style=for-the-badge)
![GitHub top language](https://img.shields.io/github/languages/top/OS-MUNHECAS/venda-mais-app?style=for-the-badge)
![GitHub last commit](https://img.shields.io/github/last-commit/OS-MUNHECAS/venda-mais-app?style=for-the-badge)

Aplicativo mobile para gestão de vendas desenvolvido em React Native com Expo. Projeto da disciplina de Tópicos Especiais II do IFSULDEMINAS.

## Objetivo

Ferramenta simples e eficiente para microempreendedores gerenciarem vendas, produtos e clientes diretamente do celular, substituindo planilhas ou sistemas complexos.

**Público-Alvo:** Pequenas empresas, vendedores autônomos e microempreendedores.

## Funcionalidades

### Implementadas
- **Gestão de Clientes:** Lista com busca e filtros por status
- **Interface Responsiva:** Layout adaptável para diferentes tamanhos de tela
- **Tipagem TypeScript:** Código type-safe e bem estruturado

### Planejadas
- **CRUD Completo:** Cadastro, edição e exclusão de clientes/produtos
- **Registro de Vendas:** Lançamento de vendas com associação cliente-produto
- **Persistência Local:** SQLite para acesso offline
- **Recursos Nativos:** Câmera, biometria e compartilhamento
- **Integração com API:** Consulta de CEP

## Tecnologias

| Componente | Tecnologia | Versão |
|:-----------|:-----------|:-------|
| **Framework** | React Native + Expo | ~54.0.10 |
| **Linguagem** | TypeScript | ~5.9.2 |
| **Navegação** | Expo Router | ~6.0.8 |
| **UI Components** | React Native | 0.81.4 |
| **Animações** | Reanimated | ~4.1.0 |

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

## Como Executar

### Pré-requisitos
- [Node.js LTS](https://nodejs.org/)
- [Git](https://git-scm.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/OS-MUNHECAS/venda-mais-app.git

# Entre na pasta do projeto
cd venda-mais-app

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm start
```

### Executar em dispositivo

```bash
# Android
npm run android

# iOS (requer macOS)
npm run ios

# Web
npm run web
```

### Scripts Disponíveis

```bash
npx expo start          # Inicia o servidor Expo
```

## Status do Desenvolvimento

### Telas Implementadas
- ✅ **Clientes** - Lista com busca e filtros
- ⏳ **Produtos** - Em desenvolvimento
- ⏳ **Pedidos** - Planejada
- ⏳ **Histórico** - Planejada
- ⏳ **Dashboard** - Planejada

## Dependências Principais

```json
{
  "expo": "~54.0.10",
  "react": "19.1.0",
  "react-native": "0.81.4",
  "expo-router": "~6.0.8",
  "typescript": "~5.9.2",
  "@react-navigation/bottom-tabs": "^7.4.0",
  "react-native-reanimated": "~4.1.0"
}
```

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
