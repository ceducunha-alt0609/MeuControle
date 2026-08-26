# Meu Controle

PWA para compromissos, despesas, consultas e lembretes.

## Publicar no GitHub Pages

1. Crie um repositório no GitHub (ex.: `meu-controle`).
2. Envie **todo o conteúdo desta pasta** para a raiz do repositório.
3. No GitHub: **Settings → Pages**.
4. Em **Build and deployment**, escolha **Deploy from a branch**.
5. Branch: `main` e pasta `/ (root)`.
6. Salve e aguarde o endereço HTTPS do GitHub Pages.
7. Abra o site no Edge/Chrome.
8. Use **Configurações → Aplicativo → Instalar Meu Controle**, ou o ícone de instalação na barra do navegador.

## Observação importante sobre dados

Os dados ficam no `localStorage` daquele navegador/dispositivo. Use **Exportar backup** regularmente.
A publicação no GitHub Pages publica apenas o aplicativo; seus lançamentos pessoais não são enviados para o GitHub.

## PWA

O projeto inclui:
- `manifest.json`
- service worker (`sw.js`)
- favicon
- Apple touch icon
- ícones 192 e 512 px
- funcionamento offline após a primeira carga
