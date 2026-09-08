# Auditoria de contraste — MeuControle V1.07

Escopo: desktop e mobile, preservando a identidade visual atual.

## Prioridade alta
- Textos secundários e metadados: reforçar contraste sem competir com títulos.
- Placeholders de pesquisa/formulários: remover aparência excessivamente apagada.
- Textos pequenos da Central Hoje: elevar legibilidade em fundos claros.

## Prioridade média
- Chips/etiquetas: reforçar texto mantendo fundos suaves.
- Abas e meses inativos: aumentar contraste sem parecerem selecionados.
- Textos auxiliares do Painel e Configurações: uniformizar nível de contraste.
- Bordas de campos e pesquisas: dar definição um pouco maior.

## Preservado
- Cores semânticas de vencidos, importantes e estados ativos.
- Cor primária e identidade azul do app.
- Hierarquia dos títulos e números principais.
- Layout, espaçamento e comportamento das telas.

## Tokens globais adotados
- --mc-text-strong
- --mc-text-body
- --mc-text-secondary
- --mc-text-muted
- --mc-placeholder
- --mc-chip-text
- --mc-inactive-text
- --mc-border-readable

A camada global fica centralizada em `global-contrast-v107.js`, para evitar correções espalhadas por diversos arquivos.
