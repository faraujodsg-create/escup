/* =========================================================
   ESCUP — CONFIGURAÇÃO DA LOJA E LISTA DE PRODUTOS
   Este é o único arquivo que você precisa editar no dia a dia.
   ========================================================= */

const LOJA = {
  // Número do WhatsApp que recebe os pedidos: só números, com 55 + DDD.
  // Exemplo: "5568999998888". Enquanto estiver vazio, o botão avisa.
  whatsapp: "5568999640692",

  // @ do Instagram, sem o @. Exemplo: "escup3d"
  instagram: "escupi3d",

  cidade: "Rio Branco, Acre",
};

/* ---------------------------------------------------------
   PRODUTOS
   Para adicionar um produto, copie um bloco { ... }, cole
   abaixo do último e troque as informações.

   id        → nome curto, sem espaço nem acento (único)
   nome      → nome que aparece no site
   detalhe   → medida ou o que vem no kit
   categoria → ex.: "Religiosos", "Decoração", "Utilidades"
   preco     → número com ponto: 90 ou 89.90
   estoque   → quantas unidades prontas. 0 = esgotado.
               Use null para "sob encomenda" (sem limite).
   foto      → caminho da foto dentro da pasta img/produtos
   ------------------------------------------------------- */

const PRODUTOS = [
  {
    id: "arcanjo-miguel",
    nome: "Arcanjo Miguel",
    detalhe: "20 cm de altura",
    categoria: "Religiosos",
    preco: 90,
    estoque: 1,
    foto: "img/produtos/arcanjo-miguel.jpg",
  },
  {
    id: "porta-terco-nossa-senhora",
    nome: "Porta-terço Nossa Senhora",
    detalhe: "Base para guardar o terço",
    categoria: "Religiosos",
    preco: 60,
    estoque: 1,
    foto: "img/produtos/porta-terco-nossa-senhora.jpg",
  },
  {
    id: "kit-ore-e-confie",
    nome: "Kit Ore e Confie",
    detalhe: "Letreiro + santinha + porta-vela + velinha de LED",
    categoria: "Decoração",
    preco: 70,
    estoque: 1,
    foto: "img/produtos/kit-ore-e-confie.jpg",
  },
  {
    id: "caboclo",
    nome: "Caboclo",
    detalhe: "20 cm de altura",
    categoria: "Religiosos",
    preco: 120,
    estoque: 1,
    foto: "img/produtos/caboclo.jpg",
  },
  {
    id: "ogum",
    nome: "Ogum",
    detalhe: "20 cm de altura · pintura artesanal",
    categoria: "Religiosos",
    preco: 80,
    estoque: 1,
    foto: "img/produtos/ogum.jpg",
  },
  {
    id: "nana",
    nome: "Nanã",
    detalhe: "20 cm de altura",
    categoria: "Religiosos",
    preco: 120,
    estoque: 1,
    foto: "img/produtos/nana.jpg",
  },
  {
    id: "sagrada-familia-porta-terco",
    nome: "Porta-terço Sagrada Família",
    detalhe: "Base para guardar o terço",
    categoria: "Religiosos",
    preco: 60,
    estoque: 1,
    foto: "img/produtos/sagrada-familia-porta-terco.jpg",
  },
  {
    id: "espartano",
    nome: "Espartano",
    detalhe: "16 cm de altura",
    categoria: "Colecionáveis",
    preco: 89,
    estoque: 1,
    foto: "img/produtos/espartano.jpg",
  },
];

/* ---------------------------------------------------------
   CATÁLOGO DE NATAL
   Mesmos campos dos produtos acima, mais estes opcionais:
   opcoes   → lista de modelos/tamanhos para o cliente escolher.
              Se um modelo tiver preço diferente, use { nome, preco }.
   desconto → { aPartirDe: 3, preco: 25 } = a partir de 3 peças,
              cada uma sai por R$ 25,00.
   preco: null → mostra o botão "Pedir orçamento".
   Para tirar o catálogo do site depois do Natal, deixe: const NATAL = [];
   ------------------------------------------------------- */

const NATAL = [
  { id: "kit-feliz-natal-1", nome: "Kit Feliz Natal 1", categoria: "Kits",
    detalhe: "Bandeja + letreiro vermelho + boneco de neve, Papai Noel e rena",
    preco: 140, estoque: null, foto: "img/natal/kit-feliz-natal-1.jpg" },
  { id: "kit-feliz-natal-2", nome: "Kit Feliz Natal 2", categoria: "Kits",
    detalhe: "Bandeja + letreiro verde + Papai Noel, rena e boneco de neve",
    preco: 116, estoque: null, foto: "img/natal/kit-feliz-natal-2.jpg" },
  { id: "kit-feliz-natal-3", nome: "Kit Feliz Natal 3", categoria: "Kits",
    detalhe: "Bandeja + Papai Noel, árvore, boneco de neve e rena",
    preco: 115, estoque: null, foto: "img/natal/kit-feliz-natal-3.jpg" },
  { id: "kit-feliz-natal-4", nome: "Kit Feliz Natal 4", categoria: "Kits",
    detalhe: "Bandeja + árvore, Papai Noel e rena",
    preco: 90, estoque: null, foto: "img/natal/kit-feliz-natal-4.jpg" },
  { id: "kit-alces-anjinho", nome: "Kit Alces e Anjinho", categoria: "Kits",
    detalhe: "Bandeja + 2 alces + anjinho",
    preco: 105, estoque: null, foto: "img/natal/kit-alces-anjinho.jpg" },
  { id: "kit-minimalista", nome: "Kit Feliz Natal Minimalista", categoria: "Kits",
    detalhe: "Presépio + 2 alces de LED + anjinho + 2 alces",
    preco: 278, estoque: null, foto: "img/natal/kit-minimalista.jpg" },
  { id: "miniaturas-natalinas", nome: "Miniaturas Natalinas", categoria: "Peças",
    detalhe: "7 cm de altura. Acima de 2 peças, R$ 25,00 cada",
    preco: 30, desconto: { aPartirDe: 3, preco: 25 }, estoque: null,
    opcoes: ["Boneco de neve", "Árvore de Natal", "Rena natalina", "Pinguim de Natal", "Papai Noel", "Biscoitinho"],
    foto: "img/natal/miniaturas.jpg" },
  { id: "alces-natalinos", nome: "Alces Natalinos", categoria: "Peças",
    detalhe: "Escolha a cor",
    preco: 30, estoque: null,
    opcoes: ["Marrom, 12 cm", "Bege, 10,5 cm"],
    foto: "img/natal/alces-natalinos.jpg" },
  { id: "alce-led", nome: "Alce Natalino decorativo", categoria: "Peças",
    detalhe: "Acompanha vela de LED",
    preco: 75, estoque: null,
    opcoes: [{ nome: "Maior, 23 cm", preco: 75 }, { nome: "Menor, 16 cm", preco: 40 }],
    foto: "img/natal/alce-led.jpg" },
  { id: "anjinho", nome: "Anjinho", categoria: "Peças",
    detalhe: "12 cm de altura. Outras cores sob consulta",
    preco: 33, estoque: null, foto: "img/natal/anjinho.jpg" },
  { id: "presepio-natalino", nome: "Presépio Natalino", categoria: "Peças",
    detalhe: "Sagrada Família, Reis Magos e animais",
    preco: 60, estoque: null, foto: "img/natal/presepio.jpg" },
  { id: "letreiro-feliz-natal-vermelho", nome: "Letreiro Feliz Natal com árvore", categoria: "Peças",
    detalhe: "10,5 × 23 cm",
    preco: 50, estoque: null, foto: "img/natal/letreiro-vermelho.jpg" },
  { id: "letreiro-feliz-natal-verde", nome: "Letreiro Feliz Natal com floco de neve", categoria: "Peças",
    detalhe: "14 cm de altura. Outras cores sob consulta",
    preco: 26, estoque: null, foto: "img/natal/letreiro-verde.jpg" },
  { id: "arvore-da-familia", nome: "Árvore da Família", categoria: "Personalizados",
    detalhe: "Com os nomes da sua família. O valor depende da quantidade de nomes",
    preco: null, estoque: null, foto: "img/natal/arvore-da-familia.jpg",
    mensagem: "Quero um orçamento da Árvore da Família. Os nomes são: " },
  { id: "guirlanda-belem", nome: "Guirlanda Estrelinha de Belém", categoria: "Personalizados",
    detalhe: "Guirlanda de porta com presépio",
    preco: null, estoque: null, foto: "img/natal/guirlanda-belem.jpg",
    mensagem: "Quero um orçamento da Guirlanda Estrelinha de Belém." },
];
