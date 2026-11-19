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
];
