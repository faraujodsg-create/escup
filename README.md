# Site da ESCUP

Loja online da ESCUP: o cliente coloca as peças na sacola e o pedido vai pronto para o WhatsApp da loja.

## Antes de publicar
Abra `produtos.js` e preencha:
- `whatsapp`: número com 55 + DDD, só números (ex.: `5568999998888`)
- `instagram`: o @ sem o arroba

## Adicionar ou mudar produtos
Tudo fica em `produtos.js`. Copie um bloco `{ ... }` e troque nome, detalhe, categoria, preço e estoque.
- `estoque: 0` mostra **Esgotado**
- `estoque: null` mostra **Sob encomenda**

Coloque a foto (quadrada, cerca de 800 × 800 px) em `img/produtos/`.

## Publicar no GitHub Pages
1. Envie todos os arquivos desta pasta para a raiz de um repositório público.
2. No repositório, abra **Settings → Pages → Deploy from a branch**, selecione a branch `main` e a pasta `/ (root)`, depois clique em **Save**.
3. O site fica em `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO`.
