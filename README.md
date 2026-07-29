# Portfólio da Veru

Site de portfólio pessoal — Home, Work, About, Case Study e Contact, bilíngue (EN/PT), construído em HTML/CSS/JS puro (sem build).

## Estrutura

```
index.html                landing (hero, projetos em destaque, depoimentos, tira de sobre, CTA final)
work.html                 listagem de projetos com skeleton de carregamento
about.html                sobre, ferramentas do dia a dia e disponibilidade
case-study.html           case study completo (nav, hero, decisões, resultado), 5 variações via ?case=1..5
contact.html              contato direto (e-mail e LinkedIn)
assets/
  site.js                 JS compartilhado por todas as páginas: idioma, chrome (nav/footer/drawer), click-burst, loading bar e hero FLIP
  ds-tokens.css           cópia de design-system/tokens.css (cores, tipografia, espaçamento, motion)
  ds-components.css       extração curada de navigation.html/buttons.html/cards.html do design system
  site-components.css     extensões autorais que compõem com as classes do DS (ex. .case-card)
fonts/                    Space Grotesk e Material Symbols Rounded, self-hosted (woff2)
design-system/            submódulo git do maomao-ds (ver seção "Design system" abaixo)
```

Todas as páginas navegam entre si (`index.html` ↔ `work.html` ↔ `about.html` ↔ `contact.html` ↔ `case-study.html`), compartilham o mesmo alternador de idioma EN/PT (persistido em `localStorage`) e o mesmo efeito de click-burst.

O conteúdo real (nome, e-mail, cases, bio) está marcado com placeholders entre colchetes — ex. `[YOUR NAME]`, `[EMAIL]`, `[CASE 1: TÍTULO]` — para substituir antes de publicar.

## Design system

Os tokens de cor, tipografia, espaçamento e os componentes que originaram este site vivem no **maomao-ds**, incluído aqui como git submodule em `design-system/`.

Clonando o portfólio pela primeira vez:

```bash
git clone --recurse-submodules https://github.com/euvrusk/portfolio-da-veru.git
```

Se já clonou sem `--recurse-submodules`, `design-system/` fica vazio — rode:

```bash
git submodule update --init
```

Puxando atualizações do design system:

```bash
git submodule update --remote design-system
```

Isso só atualiza o submódulo — os arquivos que o site de fato carrega (`assets/ds-tokens.css` e `assets/ds-components.css`) não sincronizam sozinhos. Depois de atualizar o submódulo:

1. Copiar `design-system/tokens.css` para `assets/ds-tokens.css` (é uma cópia direta, sem edição).
2. Reconferir `design-system/components/navigation.html`, `buttons.html` e `cards.html` contra o que já está em `assets/ds-components.css` (cada bloco tem um comentário `/* from x.html */`) e copiar à mão qualquer regra nova, alterada ou removida — é extração manual, não script, porque cada arquivo do DS mistura CSS de componente com CSS de moldura de demonstração.
3. Abrir as 5 páginas no navegador, alternar EN/PT, testar o menu mobile, a transição entre um card de projeto e o case study, e o click-burst, antes de commitar.
4. `git add design-system assets/ds-tokens.css assets/ds-components.css` e commitar.

`assets/site-components.css` é autoral do portfólio (não vem do submódulo) — não mexer nele ao ressincronizar.

## Como visualizar

Abra `index.html` direto no navegador. Não há build nem dependências.
