# StatCard Component

Componente reutilizável para exibir estatísticas com ícone, número e descrição no estilo horizontal.

## Uso Básico

```jsx
import StatCard from "./StatCard";
import { BookOpen, Clock } from "lucide-react";

<StatCard icon={<BookOpen size={20} />} value={9} label="Respostas" />
<StatCard icon={<Clock size={20} />} value={20} label="Minutos" />
```

## Props

| Prop | Tipo | Obrigatório | Descrição |
|------|------|-------------|-----------|
| `icon` | React.ReactNode | ✅ | Ícone a ser exibido (componente do lucide-react, react-icons, etc.) |
| `value` | number | ✅ | Valor numérico da estatística |
| `label` | string | ✅ | Descrição da estatística |
| `className` | string | ❌ | Classes CSS adicionais |
| `variant` | string | ❌ | Variante do estilo: 'default', 'compact', 'large' |

## Variantes

### Default
```jsx
<StatCard icon={<BookOpen size={20} />} value={9} label="Respostas" />
```

### Compact
```jsx
<StatCard 
  icon={<BookOpen size={16} />} 
  value={9} 
  label="Respostas" 
  variant="compact" 
/>
```

### Large
```jsx
<StatCard 
  icon={<BookOpen size={24} />} 
  value={9} 
  label="Respostas" 
  variant="large" 
/>
```

## Exemplos de Uso

### Estatísticas de Usuário
```jsx
<div style={{ display: "flex", gap: "1rem" }}>
  <StatCard icon={<BookOpen size={20} />} value={15} label="Respostas" />
  <StatCard icon={<Clock size={20} />} value={120} label="Minutos" />
  <StatCard icon={<Trophy size={20} />} value={5} label="Conquistas" />
</div>
```

### Dashboard
```jsx
<div style={{ 
  display: "grid", 
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
  gap: "1rem" 
}}>
  <StatCard icon={<Users size={20} />} value={42} label="Usuários" />
  <StatCard icon={<Star size={20} />} value={4.8} label="Avaliação" />
  <StatCard icon={<Target size={20} />} value={85} label="Precisão" />
</div>
```

### Com Classes Customizadas
```jsx
<StatCard 
  icon={<BookOpen size={20} />} 
  value={9} 
  label="Respostas" 
  className="custom-stat-card"
/>
```

## Características

- ✅ **Layout Horizontal**: Ícone à esquerda, número e descrição à direita
- ✅ **Responsivo**: Adapta-se a diferentes tamanhos de tela
- ✅ **Tema Dark**: Suporte automático ao tema escuro
- ✅ **Hover Effects**: Efeitos visuais ao passar o mouse
- ✅ **Flexível**: Múltiplas variantes de tamanho
- ✅ **Acessível**: Estrutura semântica adequada
- ✅ **Customizável**: Classes CSS e props personalizáveis

## Estilos

O componente usa as seguintes classes CSS:

- `.stat-card` - Container principal
- `.stat-card__icon` - Container do ícone
- `.stat-card__content` - Container do conteúdo (número + label)
- `.stat-card__value` - Valor numérico
- `.stat-card__label` - Descrição/label

### Variantes CSS

- `.stat-card--compact` - Versão compacta
- `.stat-card--large` - Versão grande
- `.stat-card--disabled` - Estado desabilitado
- `.stat-card--loading` - Estado de carregamento

## Tema Dark

O componente automaticamente se adapta ao tema dark quando a classe `dark` está presente no `body`:

```css
body.dark .stat-card {
  background-color: var(--bg-secondary);
  border-color: var(--border-primary);
  /* ... outros estilos */
}
```

## Responsividade

O componente é totalmente responsivo e se adapta a diferentes tamanhos de tela:

- **Desktop**: Tamanho padrão
- **Tablet**: Redução sutil de tamanho
- **Mobile**: Versão compacta otimizada

## Estados Especiais

### Desabilitado
```jsx
<StatCard 
  icon={<BookOpen size={20} />} 
  value={9} 
  label="Respostas" 
  className="stat-card--disabled"
/>
```

### Carregamento
```jsx
<StatCard 
  icon={<BookOpen size={20} />} 
  value={9} 
  label="Respostas" 
  className="stat-card--loading"
/>
```

## Dicas de Uso

1. **Ícones**: Use ícones do lucide-react ou react-icons para consistência
2. **Tamanhos**: Ajuste o tamanho do ícone conforme a variante escolhida
3. **Valores**: Suporte a números inteiros e decimais
4. **Labels**: Use textos curtos e descritivos
5. **Layout**: Use flexbox ou grid para organizar múltiplos cards

## Exemplo Completo

Veja o arquivo `examples/StatCardExample.jsx` para exemplos completos de uso.
