# 📋 Módulo CRUD de Clientes - Venda Mais App

## 🎯 Funcionalidades Implementadas

O módulo de clientes agora possui um sistema CRUD completo com as seguintes funcionalidades:

### ✅ **CREATE (Criar)**
- Formulário completo de cadastro de cliente
- Validação de CPF/CNPJ por tipo de pessoa
- Cadastro de múltiplos contatos (Email, Telefone, WhatsApp)
- Cadastro de múltiplos endereços com integração ViaCEP
- Preenchimento automático de endereço por CEP

### ✅ **READ (Ler/Visualizar)**
- Listagem de todos os clientes com filtros
- Busca por nome, documento ou contatos
- Filtros por status (Ativo/Inativo)
- Tela de detalhes completa do cliente
- Informações de contatos e endereços
- Estatísticas básicas do cliente

### ✅ **UPDATE (Atualizar)**
- Edição completa dos dados do cliente
- Modificação de contatos e endereços
- Validações em tempo real
- Carregamento automático dos dados existentes

### ✅ **DELETE (Excluir)**
- Opção de desativação (soft delete)
- Opção de exclusão permanente (hard delete)
- Modal de confirmação com opções claras
- Preservação de dados para reativação

## 🏗️ Arquitetura do Sistema

### **Serviços**
- `CustomerService` - Gerencia todas as operações CRUD
- `ViaCEPService` - Integração com API do ViaCEP para busca de endereços

### **Componentes**
- `CreateCustomerModal` - Modal para cadastro de novos clientes
- `EditCustomerModal` - Modal para edição de clientes existentes
- `CustomerDetailsScreen` - Tela de detalhes completa do cliente
- `DeleteCustomerModal` - Modal de confirmação para exclusão

### **Tipos TypeScript**
- `Customer` - Tipo principal do cliente
- `Contact` - Dados de contato
- `Address` - Dados de endereço
- `CustomerFormData` - Dados para formulários
- `ContactFormData` - Dados de contato para formulários

## 🚀 Como Usar

### **1. Visualizar Clientes**
- Abra a aba "Clientes"
- Use a barra de busca para filtrar por nome, documento ou contato
- Use os filtros "Todos", "Ativos" ou "Inativos"
- Puxe a lista para baixo para atualizar (pull-to-refresh)

### **2. Criar Novo Cliente**
1. Toque no botão "+" no canto inferior direito
2. Preencha os dados pessoais obrigatórios
3. Adicione pelo menos um contato
4. Opcionalmente, adicione endereços (use o CEP para preenchimento automático)
5. Toque em "Salvar"

### **3. Visualizar Detalhes**
- Toque em qualquer cliente da lista
- Visualize todas as informações, contatos e endereços
- Use os botões de ação para ligar, enviar WhatsApp ou email
- Compartilhe os dados do cliente

### **4. Editar Cliente**
- Na tela de detalhes, toque no ícone de edição (✏️)
- Ou mantenha pressionado um cliente na lista e escolha "Editar"
- Modifique os dados necessários
- Toque em "Atualizar"

### **5. Excluir Cliente**
- Na tela de detalhes, toque no ícone de lixeira (🗑️)
- Ou mantenha pressionado um cliente na lista e escolha "Excluir"
- Escolha entre:
  - **Desativar**: Cliente fica inativo mas pode ser reativado
  - **Excluir Permanentemente**: Remove todos os dados (irreversível)

## 🔄 Integração com ViaCEP

O sistema integra automaticamente com a API do ViaCEP para facilitar o cadastro de endereços:

1. Digite um CEP válido no formato xxxxx-xxx
2. O sistema busca automaticamente:
   - Logradouro (rua/avenida)
   - Bairro
   - Cidade e Estado
3. Complete apenas número, complemento e referência

## 📱 Funcionalidades Móveis

### **Ações de Contato Diretas**
- **Telefone**: Toque para ligar diretamente
- **WhatsApp**: Abre o WhatsApp com o número
- **Email**: Abre o app de email padrão

### **Compartilhamento**
- Compartilhe dados completos do cliente
- Inclui informações de contato e endereços
- Funciona com qualquer app de mensagens

### **Responsividade**
- Layout adaptado para tablets (2 colunas)
- Interface otimizada para diferentes tamanhos de tela
- Componentes touch-friendly

## 🛡️ Validações Implementadas

### **Dados Pessoais**
- Nome obrigatório
- CPF: 11 dígitos para Pessoa Física
- CNPJ: 14 dígitos para Pessoa Jurídica
- Formatação automática de documentos
- Verificação de duplicatas

### **Contatos**
- Email com validação de formato
- Pelo menos um contato obrigatório
- Tipos: Email, Telefone, WhatsApp

### **Endereços**
- CEP com validação de formato
- Logradouro e bairro obrigatórios
- Integração com ViaCEP para validação

## 📊 Estados e Filtros

### **Status de Cliente**
- **Ativo**: Cliente pode fazer compras
- **Inativo**: Cliente desabilitado (soft delete)

### **Tipos de Pessoa**
- **Pessoa Física (F)**: CPF obrigatório
- **Pessoa Jurídica (J)**: CNPJ obrigatório

### **Tipos de Contato**
- **E**: Email
- **T**: Telefone
- **W**: WhatsApp

### **Tipos de Endereço**
- **R**: Residencial
- **C**: Comercial
- **E**: Entrega

## 🔧 Arquivos Principais

```
├── app/(tabs)/
│   ├── clientes.tsx                    # Tela principal de clientes
│   └── types/
│       ├── customer.ts                 # Tipos do cliente
│       └── address.ts                  # Tipos de endereço
├── components/
│   ├── CreateCustomerModal.tsx         # Modal de cadastro
│   ├── EditCustomerModal.tsx           # Modal de edição
│   ├── CustomerDetailsScreen.tsx       # Tela de detalhes
│   └── DeleteCustomerModal.tsx         # Modal de exclusão
├── services/
│   ├── customer.service.ts             # Serviço CRUD de clientes
│   └── viacep.service.ts              # Serviço ViaCEP
└── database/
    ├── cad_tables.sql                  # Estrutura do banco
    ├── sell_tables.sql                 # Tabelas de vendas
    ├── initial_data.sql                # Dados iniciais
    └── mocks.ts                        # Dados de teste
```

## 🎨 Características da UI/UX

- **Design Material**: Interface moderna e intuitiva
- **Feedback Visual**: Loading states, pull-to-refresh
- **Navegação Fluida**: Modais e transições suaves
- **Acessibilidade**: Botões grandes, contraste adequado
- **Gestos**: Long press para menu de contexto
- **Estados Empty**: Mensagens informativas quando não há dados

## 🚀 Próximos Passos Sugeridos

1. **Integração com Backend Real**: Substituir simulações por APIs reais
2. **Cache Local**: Implementar cache para modo offline
3. **Sincronização**: Sync automática com servidor
4. **Relatórios**: Adicionar relatórios e estatísticas avançadas
5. **Importação/Exportação**: CSV, Excel, vCard
6. **Fotos de Perfil**: Adicionar avatares aos clientes
7. **Histórico de Alterações**: Log de mudanças nos dados
8. **Backup**: Backup automático dos dados

O módulo está completo e pronto para uso, oferecendo uma experiência moderna e eficiente para gerenciamento de clientes! 🎉