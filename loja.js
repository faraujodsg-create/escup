/* ESCUP — funcionamento da loja (não precisa editar) */
(function () {
  const $ = (s) => document.querySelector(s);
  const real = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const porId = Object.fromEntries(PRODUTOS.map((p) => [p.id, p]));
  const CHAVE = "escup-sacola";

  // ---------- sacola (guardada no navegador) ----------
  let sacola = {};
  try { sacola = JSON.parse(localStorage.getItem(CHAVE)) || {}; } catch (e) {}
  for (const id in sacola) if (!porId[id] || porId[id].estoque === 0) delete sacola[id];
  const salvar = () => { try { localStorage.setItem(CHAVE, JSON.stringify(sacola)); } catch (e) {} };
  const limite = (p) => (p.estoque == null ? 99 : p.estoque);

  function aviso(txt) {
    const el = $("[data-aviso]");
    el.textContent = txt;
    el.classList.add("mostrar");
    clearTimeout(aviso.t);
    aviso.t = setTimeout(() => el.classList.remove("mostrar"), 2600);
  }

  function adicionar(id) {
    const p = porId[id];
    const atual = sacola[id] || 0;
    if (atual >= limite(p)) {
      aviso(p.estoque === 1 ? "Só temos 1 unidade desta peça." : `Temos ${p.estoque} unidades desta peça.`);
      return;
    }
    sacola[id] = atual + 1;
    salvar(); atualizarSacola();
    aviso(`${p.nome} foi para a sacola.`);
  }

  // ---------- vitrine ----------
  const categorias = ["Todas", ...new Set(PRODUTOS.map((p) => p.categoria))];
  let filtro = "Todas";

  function selo(p) {
    if (p.estoque === 0) return '<span class="selo selo--esgotado">Esgotado</span>';
    if (p.estoque == null) return '<span class="selo">Sob encomenda</span>';
    return `<span class="selo">${p.estoque === 1 ? "1 unidade disponível" : p.estoque + " unidades"}</span>`;
  }

  function desenharFiltros() {
    const box = $("[data-filtros]");
    if (categorias.length <= 2) { box.hidden = true; return; }
    box.innerHTML = categorias
      .map((c) => `<button type="button" aria-pressed="${c === filtro}" data-cat="${c}">${c}</button>`)
      .join("");
  }

  function desenharVitrine() {
    const lista = PRODUTOS.filter((p) => filtro === "Todas" || p.categoria === filtro);
    $("[data-vitrine]").innerHTML = lista.map((p) => `
      <li class="produto">
        <div class="produto__foto">
          <img src="${p.foto}" alt="${p.nome}" loading="lazy" width="800" height="800">
          ${selo(p)}
        </div>
        <div class="produto__info">
          <span class="produto__cat">${p.categoria}</span>
          <h3 class="produto__nome">${p.nome}</h3>
          <p class="produto__detalhe">${p.detalhe || ""}</p>
          <div class="produto__base">
            <span class="preco"><small>R$</small>${p.preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
            <button class="btn btn--azul" type="button" data-add="${p.id}" ${p.estoque === 0 ? "disabled" : ""}>
              ${p.estoque === 0 ? "Esgotado" : "Adicionar"}
            </button>
          </div>
        </div>
      </li>`).join("");
  }

  // ---------- painel da sacola ----------
  function atualizarSacola() {
    const ids = Object.keys(sacola);
    const qtdTotal = ids.reduce((s, id) => s + sacola[id], 0);
    const total = ids.reduce((s, id) => s + sacola[id] * porId[id].preco, 0);

    const badge = $("[data-qtd-sacola]");
    badge.textContent = qtdTotal;
    badge.hidden = qtdTotal === 0;

    $("[data-vazia]").hidden = ids.length > 0;
    $("[data-rodape-sacola]").hidden = ids.length === 0;
    $("[data-total]").textContent = real(total);
    $("[data-itens]").innerHTML = ids.map((id) => {
      const p = porId[id], q = sacola[id];
      return `
        <li class="item">
          <img src="${p.foto}" alt="">
          <div>
            <h3>${p.nome}</h3>
            <p>${real(p.preco)}</p>
            <div class="qtd">
              <button type="button" data-menos="${id}" aria-label="Diminuir quantidade de ${p.nome}">−</button>
              <span>${q}</span>
              <button type="button" data-mais="${id}" aria-label="Aumentar quantidade de ${p.nome}" ${q >= limite(p) ? "disabled" : ""}>+</button>
            </div>
          </div>
          <button type="button" class="item__rem" data-remover="${id}">Remover</button>
        </li>`;
    }).join("");
  }

  const painel = $("[data-sacola]");
  const abrir = () => { painel.hidden = false; document.body.style.overflow = "hidden"; $(".btn-x").focus(); };
  const fechar = () => { painel.hidden = true; document.body.style.overflow = ""; };

  // ---------- WhatsApp ----------
  function abrirWhats(texto) {
    if (!LOJA.whatsapp) {
      aviso("O número do WhatsApp ainda não foi configurado no arquivo produtos.js.");
      return;
    }
    window.open(`https://wa.me/${LOJA.whatsapp}?text=${encodeURIComponent(texto)}`, "_blank", "noopener");
  }

  function finalizar() {
    const ids = Object.keys(sacola);
    if (!ids.length) return;
    const linhas = ids.map((id) => {
      const p = porId[id];
      return `• ${sacola[id]}x ${p.nome} — ${real(p.preco * sacola[id])}`;
    });
    const total = ids.reduce((s, id) => s + sacola[id] * porId[id].preco, 0);
    abrirWhats(
      `Oi, ESCUP! Quero fazer este pedido pelo site:\n\n${linhas.join("\n")}\n\nTotal: ${real(total)}\n\nPodem confirmar a disponibilidade e como fica o pagamento e a entrega?`
    );
  }

  // ---------- eventos ----------
  document.addEventListener("click", (e) => {
    const t = e.target.closest("button, [data-fechar-sacola]");
    if (!t) return;
    const d = t.dataset;
    if (d.add) adicionar(d.add);
    else if (d.cat) { filtro = d.cat; desenharFiltros(); desenharVitrine(); }
    else if (d.mais) adicionar(d.mais);
    else if (d.menos) { if (--sacola[d.menos] <= 0) delete sacola[d.menos]; salvar(); atualizarSacola(); }
    else if (d.remover) { delete sacola[d.remover]; salvar(); atualizarSacola(); }
    else if ("abrirSacola" in d) abrir();
    else if ("fecharSacola" in d) fechar();
    else if ("finalizar" in d) finalizar();
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !painel.hidden) fechar(); });

  $("[data-form-encomenda]").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    abrirWhats(`Oi, ESCUP! Meu nome é ${f.get("nome")}. Queria um orçamento de peça personalizada:\n\n${f.get("ideia")}`);
  });

  // ---------- rodapé ----------
  const contatos = [];
  if (LOJA.whatsapp) contatos.push(`<a href="https://wa.me/${LOJA.whatsapp}" target="_blank" rel="noopener">WhatsApp</a>`);
  if (LOJA.instagram) contatos.push(`<a href="https://instagram.com/${LOJA.instagram}" target="_blank" rel="noopener">Instagram @${LOJA.instagram}</a>`);
  $("[data-contatos]").innerHTML = contatos.join("");
  $("[data-ano]").textContent = new Date().getFullYear();
  $("[data-cidade]").textContent = LOJA.cidade;

  desenharFiltros();
  desenharVitrine();
  atualizarSacola();
})();
