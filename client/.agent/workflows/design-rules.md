# Regras de Design - OLÁ Guia Portal

## 📐 Espaçamentos e Alinhamentos

### Seções da Home
- Usar a seção **"EMPRESAS & NEGÓCIOS"** como referência de espaçamento
- Manter consistência nas distâncias entre elementos
- Cards de posts: padding consistente em todos os carrosséis

### Carrosséis
- **Setas de navegação**: 
  - Background: `bg-[#E2DED2] hover:bg-[#D6D0C2]`
  - Texto/Ícone: `text-[#126861]`
  - Borda: `border border-[#928575]/40`
  - Previous: adicionar `rotate-180`
  - Classes posicionamento: `static left-auto right-auto top-auto bottom-auto translate-y-0`

### Cards de Posts
- Overlay: gradiente preto `bg-gradient-to-t from-black/70 to-transparent`
- Texto posicionado no canto inferior esquerdo
- Título: `font-open-sans font-semibold uppercase line-clamp-2`

---

## 🎨 Tipografia

### Fontes
- **Títulos**: `font-open-sans font-semibold uppercase`
- **Texto corrido**: fonte padrão do sistema
- **Badges de categoria**: `text-xs font-semibold uppercase`

### Tamanhos de Título por Seção
| Seção | Título | Descrição |
|-------|--------|-----------|
| Home carrossel | `text-base/6` | `text-xs` |
| Post page | `text-3xl md:text-4xl` | `text-base` |
| Cards | `text-base lg:text-lg/6` | `text-xs` |

---

## 🖼️ Imagens

### Configuração Next.js
```javascript
images: {
  unoptimized: true, // Para simplicidade
  remotePatterns: [
    { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
  ],
}
```

### Banners Horizontais (Full Width)
- Largura recomendada: **1920px**
- Altura: **200-300px**
- Proporção: 9.6:1 ou 6.4:1

### Banners Verticais (Sidebar)
- Half Page: **300x600px** (1:2)
- Medium Rectangle: **300x250px** (1.2:1)

### Imagens em Posts
- Featured image: `h-[500px] rounded-lg overflow-hidden`
- Imagens inline: `h-48 sm:h-56 w-full object-cover rounded-lg`

---

## 🏷️ Badges de Categoria

### Posição
- Na **página do post**: ao lado do título (desktop), oculto em mobile
- Nos **cards**: acima ou sobre a imagem

### Estilo
```css
bg-[#C68C0E] hover:bg-[#C68C0E] text-white px-3 py-1.5 rounded text-xs font-semibold uppercase
```

---

## 👣 Footer

### Layout Geral
![Footer Reference](file:///home/loctordevelopment/.gemini/antigravity/brain/1ab10b47-b99a-4a8d-9021-a22a5438caab/uploaded_media_1770144067119.png)

### Regras de Espaçamento
1. **Ocupar melhor os espaços** - Textos em 2 linhas quando necessário
2. **Alinhar todo o texto** pela mesma linha base
3. **Seções separadas** com espaçamento vertical consistente
4. **Botões lado a lado** (em row, não em column)

### Estrutura das Seções Direita

```
┌─────────────────────────────────────────┐
│ TRABALHE COM AGENTE                     │
│ Você é uma pessoa honesta, trabalhadora │
│ e gosta de trabalhar com marketing...   │
├─────────────────────────────────────────┤
│ FRANQUIA                                │
│ Você gosta da proposta do OLÁ GUIA?...  │
├─────────────────────────────────────────┤
│ Gostaria de receber notícias...         │
│ Entre no nosso canal no Instagram       │
├─────────────────────────────────────────┤
│ [Canal leitores] [Canal anunciantes]    │  ← Botões lado a lado
└─────────────────────────────────────────┘
```

### Botões do Footer
- Disposição: `flex-row` (lado a lado)
- Estilo: `bg-white hover:bg-gray-100 text-[#353E5C] px-5 py-2 rounded-none text-sm font-semibold border border-gray-300`
- Gap: `gap-3` entre botões

---

## 🎯 Cores Principais

| Uso | Cor |
|-----|-----|
| Verde principal | `#126861` |
| Badge categoria | `#C68C0E` |
| Texto escuro | `#353E5C` |
| Marrom neutro | `#928575` |
| Background degrade | `from-black/70 to-transparent` |

---

## ✅ Checklist de Implementação

Ao criar/modificar páginas, verificar:

- [ ] Espaçamentos consistentes com seção EMPRESAS & NEGÓCIOS
- [ ] Setas de carrossel no padrão correto
- [ ] Overlay de cards com gradiente preto
- [ ] Fontes Open Sans em títulos
- [ ] Badges de categoria com cor mostarda
- [ ] Imagens com tamanhos adequados
