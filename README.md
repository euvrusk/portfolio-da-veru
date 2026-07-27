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
fonts/                    Space Grotesk e Material Symbols Rounded, self-hosted (woff2)
```

Todas as páginas navegam entre si (`index.html` ↔ `work.html` ↔ `about.html` ↔ `contact.html` ↔ `case-study.html`), compartilham o mesmo alternador de idioma EN/PT (persistido em `localStorage`) e o mesmo efeito de click-burst.

O conteúdo real (nome, e-mail, cases, bio) está marcado com placeholders entre colchetes — ex. `[YOUR NAME]`, `[EMAIL]`, `[CASE 1: TÍTULO]` — para substituir antes de publicar.

## Design system

Os tokens de cor, tipografia, espaçamento e os componentes que originaram este site vivem no design system, em um repositório separado.

## Como visualizar

Abra `index.html` direto no navegador. Não há build nem dependências.
