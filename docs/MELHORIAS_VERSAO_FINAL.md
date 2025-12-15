# 🚀 Melhorias para Versão Final - Venda Mais App

## ✅ Completado

- [x] README.md atualizado com status real dos módulos
- [x] Documentação organizada em pasta `/docs`
- [x] Stack tecnológica atualizada com versões corretas

---

## ⚡ PRIORIDADE ALTA - Fazer Antes da Apresentação

### 1. Remover Código Não Utilizado

**Arquivos que existem mas não são usados:**

```bash
# Deletar ou integrar:
components/DeleteProductModal.tsx
components/ProductDetailsScreen.tsx
```

**Comando para remover:**
```bash
git rm components/DeleteProductModal.tsx components/ProductDetailsScreen.tsx
```

**Ou integrar** na tela `produtos.tsx` (recomendado se quiser manter a funcionalidade)

---

### 2. Substituir Mock Data em Produção

**Arquivo:** `app/(tabs)/pedidos.tsx` (linha 16)

**Problema:**
```tsx
import { mockCustomers, mockProducts } from '../../database/mocks';
```

**Solução:**
```tsx
// Remover import de mocks
// import { mockCustomers, mockProducts } from '../../database/mocks';

// Adicionar imports dos services
import { CustomerService } from '../../services/customer.service';
import { ProductService } from '../../services/product.service';

// No componente, substituir:
// const [customers] = useState<Customer[]>(mockCustomers);
// const [products] = useState<Product[]>(mockProducts);

// Por:
const [customers, setCustomers] = useState<Customer[]>([]);
const [products, setProducts] = useState<Product[]>([]);

useEffect(() => {
  const loadData = async () => {
    const loadedCustomers = await CustomerService.getAll();
    const loadedProducts = await ProductService.getAll();
    setCustomers(loadedCustomers);
    setProducts(loadedProducts);
  };
  loadData();
}, []);
```

---

### 3. Adicionar Tratamento de Erros

**Arquivo:** `app/(tabs)/historico.tsx` (linha 24)

**Problema:**
```tsx
loadOrders().then(setOrders); // ❌ Sem tratamento de erro
```

**Solução:**
```tsx
const loadOrdersData = async () => {
  try {
    const data = await loadOrders();
    setOrders(data);
  } catch (error) {
    console.error('Erro ao carregar pedidos:', error);
    Alert.alert('Erro', 'Não foi possível carregar o histórico de pedidos');
  }
};

useEffect(() => {
  if (isFocused) {
    loadOrdersData();
  }
}, [isFocused]);
```

---

### 4. Criar Constants para Payment Methods

**Criar arquivo:** `constants/payment-methods.ts`

```typescript
export interface PaymentMethod {
  id_payment: number;
  description: string;
  rate: number;
  term_days: number;
  active: boolean;
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  { description: 'Dinheiro', id_payment: 1, rate: 0, term_days: 0, active: true },
  { description: 'PIX', id_payment: 2, rate: 0, term_days: 0, active: true },
  { description: 'Cartão de Débito', id_payment: 3, rate: 2.5, term_days: 0, active: true },
  { description: 'Cartão de Crédito', id_payment: 4, rate: 3.5, term_days: 30, active: true },
  { description: 'Boleto', id_payment: 5, rate: 1.0, term_days: 7, active: true },
];

export const PAYMENT_TERMS = ['À vista', '7/14/21', '10/15/20', '30/60/90'];

export const SHIPPING_TYPES = [
  { value: 'CIF', label: 'CIF - Vendedor paga frete' },
  { value: 'FOB', label: 'FOB - Comprador paga frete' },
  { value: 'RET', label: 'RET - Retirada no local' },
] as const;
```

**Depois importar em `pedidos.tsx`:**
```tsx
import { PAYMENT_METHODS, PAYMENT_TERMS, SHIPPING_TYPES } from '../../constants/payment-methods';
```

---

## 📊 PRIORIDADE MÉDIA - Bom Ter

### 5. Otimizar Performance das FlatLists

**Arquivos:** `clientes.tsx`, `produtos.tsx`, `historico.tsx`

**Adicionar props de otimização:**
```tsx
<FlatList
  data={items}
  // ... outras props
  // Adicionar:
  windowSize={5}
  maxToRenderPerBatch={10}
  removeClippedSubviews={true}
  initialNumToRender={10}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>
```

---

### 6. Adicionar Loading States

**Em todas as telas que fazem carregamento de dados:**

```tsx
const [loading, setLoading] = useState(true);
const [refreshing, setRefreshing] = useState(false);

const loadData = async () => {
  try {
    setLoading(true);
    const data = await Service.getAll();
    setData(data);
  } catch (error) {
    Alert.alert('Erro', 'Não foi possível carregar os dados');
  } finally {
    setLoading(false);
  }
};

// No render:
{loading ? (
  <ActivityIndicator size="large" color={theme.primary} />
) : (
  <FlatList ... />
)}
```

---

### 7. Melhorar Validações

**Criar arquivo:** `utils/validators.ts`

```typescript
export const validateCPF = (cpf: string): boolean => {
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length !== 11) return false;

  // Algoritmo de validação do CPF
  let sum = 0;
  let remainder;

  if (cpf === '00000000000') return false;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(10, 11))) return false;

  return true;
};

export const validateCNPJ = (cnpj: string): boolean => {
  cnpj = cnpj.replace(/\D/g, '');
  if (cnpj.length !== 14) return false;

  // Algoritmo de validação do CNPJ
  // ... (implementar)

  return true;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/\D/g, '');
  return cleanPhone.length === 10 || cleanPhone.length === 11;
};
```

---

## 🎨 PRIORIDADE BAIXA - Pós-Apresentação

### 8. Adicionar Screenshots ao README

Capturar telas principais e adicionar ao README:

```markdown
## 📱 Screenshots

### Tela Inicial
![Home](./docs/screenshots/home.png)

### Gestão de Clientes
![Clientes](./docs/screenshots/clientes.png)

### Cadastro de Produtos
![Produtos](./docs/screenshots/produtos.png)

### Wizard de Pedidos
![Pedidos](./docs/screenshots/pedidos.png)
```

---

### 9. Testes Unitários

**Instalar dependências:**
```bash
npm install --save-dev jest @testing-library/react-native @testing-library/jest-native
```

**Criar testes para services:**
```typescript
// __tests__/services/customer.service.test.ts
import { CustomerService } from '../../services/customer.service';

describe('CustomerService', () => {
  test('deve criar cliente válido', async () => {
    const customerData = {
      name: 'Teste',
      cpf_cnpj: '12345678901',
      person_type: 'F',
      contacts: [],
    };

    const customer = await CustomerService.create(customerData);
    expect(customer.id_customer).toBeDefined();
    expect(customer.person.name).toBe('Teste');
  });

  test('deve lançar erro para dados inválidos', async () => {
    await expect(
      CustomerService.create({ name: '', cpf_cnpj: '', person_type: 'F', contacts: [] })
    ).rejects.toThrow('Nome é obrigatório');
  });
});
```

---

### 10. Implementar Backend Real

**Tecnologias sugeridas:**
- Node.js + Express + TypeScript
- Prisma ORM
- PostgreSQL
- JWT para autenticação

**Estrutura básica:**
```
backend/
├── src/
│   ├── controllers/
│   ├── services/
│   ├── models/
│   ├── routes/
│   └── middlewares/
├── prisma/
│   └── schema.prisma
└── package.json
```

---

## 🎯 Resumo de Ações Imediatas

```bash
# 1. Remover código morto
git rm components/DeleteProductModal.tsx components/ProductDetailsScreen.tsx

# 2. Verificar mudanças
git status

# 3. Commitar
git add .
git commit -m "chore: remove unused components and update documentation"

# 4. Fazer as alterações manuais em pedidos.tsx e historico.tsx
# (conforme descrito nas seções 2 e 3)

# 5. Testar tudo
npx expo start

# 6. Commit final
git add .
git commit -m "feat: improve error handling and remove mock data from production"
```

---

## ✅ Checklist Final para Apresentação

- [ ] README atualizado ✅
- [ ] Documentação organizada ✅
- [ ] Código morto removido
- [ ] Mock data substituído por services
- [ ] Tratamento de erros adicionado
- [ ] Constants criado para payment methods
- [ ] App testado em modo produção
- [ ] Screenshots capturados
- [ ] Apresentação preparada (roteiro de 3min)
- [ ] Código commitado e pushado

---

**Data:** 14/12/2025
**Versão:** 1.0.0 (Release Candidate)
**Status:** Pronto para apresentação após correções de prioridade alta
