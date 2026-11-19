/* ESCUP — funcionamento da loja (não precisa editar) */
(function () {
  const $ = (s) => document.querySelector(s);
  const real = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const valor = (v) => v.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const NATAL_LISTA = typeof NATAL !== "undefined" ? NATAL : [];
  const TODOS = [...PRODUTOS, ...NATAL_LISTA];
  const porId = Object.fromEntries(TODOS.map((p) => [p.id, p]));
  const CHAVE = "escup-sacola-v2";

  // Opções (modelos/tamanhos) e preço de cada uma
  const opcoesDe = (p) => (p.opcoes || []).map((o) => (typeof o === "string" ? { nome: o } : o));
  const precoOpcao = (p, i) => {
    const o = opcoesDe(p)[i];
    return o && o.preco != null ? o.preco : p.preco;
  };
  const precoMinimo = (p) => {
    const ops = opcoesDe(p);
    return ops.length ? Math.min(...ops.map((_, i) => precoOpcao(p, i))) : p.preco;
  };

  // ---------- sacola: chave "id" ou "id::indiceDaOpcao" ----------
  let sacola = {};
  try { sacola = JSON.parse(localStorage.getItem(CHAVE)) || {}; } catch (e) {}
  const partes = (k) => { const [id, op] = k.split("::"); return { p: porId[id], op: op == null ? null : +op }; };
  for (const k in sacola) { const { p } = partes(k); if (!p || p.estoque === 0 || p.preco == null) delete sacola[k]; }
  const salvar = () => { try { localStorage.setItem(CHAVE, JSON.stringify(sacola)); } catch (e) {} };
  const limite = (p) => (p.estoque == null ? 99 : p.estoque);
  const qtdDoProduto = (id) => Object.keys(sacola).filter((k) => k.split("::")[0] === id).reduce((s, k) => s + sacola[k], 0);

  function unitario(k) {
    const { p, op } = partes(k);
    let v = op == null ? p.preco : precoOpcao(p, op);
    if (p.desconto && qtdDoProduto(p.id) >= p.desconto.aPartirDe) v = p.desconto.preco;
    return v;
  }
  const nomeItem = (k) => { const { p, op } = partes(k); return op == null ? p.nome : `${p.nome} (${opcoesDe(p)[op].nome})`; };
  const totalSacola = () => Object.keys(sacola).reduce((s, k) => s + sacola[k] * unitario(k), 0);

  function aviso(txt) {
    const el = $("[data-aviso]");
    el.textContent = txt;
    el.classList.add("mostrar");
    clearTimeout(aviso.t);
    aviso.t = setTimeout(() => el.classList.remove("mostrar"), 2600);
  }

  function adicionar(k) {
    const { p } = partes(k);
    if (qtdDoProduto(p.id) >= limite(p)) {
      aviso(p.estoque === 1 ? "Só temos 1 unidade desta peça." : `Temos ${p.estoque} unidades desta peça.`);
      return;
    }
    sacola[k] = (sacola[k] || 0) + 1;
    salvar(); atualizarSacola();
    aviso(`${nomeItem(k)} foi para a sacola.`);
  }

  // ---------- vitrines ----------
  function selo(p) {
    if (p.estoque === 0) return '<span class="selo selo--esgotado">Esgotado</span>';
    if (p.estoque == null) return "";
    return `<span class="selo">${p.estoque === 1 ? "1 unidade disponível" : p.estoque + " unidades"}</span>`;
  }

  function precoHTML(p, i) {
    if (p.preco == null) return '<span class="preco preco--consulta">Sob orçamento</span>';
    const v = i == null ? (opcoesDe(p).length ? precoOpcao(p, 0) : p.preco) : precoOpcao(p, i);
    return `<span class="preco"><small>R$</small>${valor(v)}</span>`;
  }

  function cartao(p) {
    const ops = opcoesDe(p);
    const seletor = ops.length
      ? `<label class="opcao"><span class="sr">Modelo de ${esc(p.nome)}</span>
           <select data-opcao="${p.id}">${ops.map((o, i) => `<option value="${i}">${esc(o.nome)}${o.preco != null && ops.some((x) => x.preco !== o.preco) ? " · " + real(o.preco) : ""}</option>`).join("")}</select>
         </label>`
      : "";
    let botao;
    if (p.preco == null) botao = `<button class="btn btn--azul" type="button" data-orcamento="${p.id}">Pedir orçamento</button>`;
    else if (p.estoque === 0) botao = `<button class="btn btn--azul" type="button" disabled>Esgotado</button>`;
    else botao = `<button class="btn btn--azul" type="button" data-add="${p.id}">Adicionar</button>`;
    return `
      <li class="produto">
        <div class="produto__foto">
          <img src="${p.foto}" alt="${esc(p.nome)}" loading="lazy" width="800" height="800">
          ${selo(p)}
        </div>
        <div class="produto__info">
          <span class="produto__cat">${esc(p.categoria)}</span>
          <h3 class="produto__nome">${esc(p.nome)}</h3>
          <p class="produto__detalhe">${esc(p.detalhe || "")}</p>
          ${seletor}
          <div class="produto__base">
            <span data-preco="${p.id}">${precoHTML(p)}</span>
            ${botao}
          </div>
        </div>
      </li>`;
  }

  function criarVitrine(lista, vitrineSel, filtrosSel) {
    const estado = { filtro: "Todas" };
    const cats = ["Todas", ...new Set(lista.map((p) => p.categoria))];
    function desenhar() {
      const box = $(filtrosSel);
      if (cats.length <= 2) box.hidden = true;
      else box.innerHTML = cats.map((c) => `<button type="button" aria-pressed="${c === estado.filtro}" data-cat="${esc(c)}" data-alvo="${vitrineSel}">${esc(c)}</button>`).join("");
      $(vitrineSel).innerHTML = lista.filter((p) => estado.filtro === "Todas" || p.categoria === estado.filtro).map(cartao).join("");
    }
    desenhar();
    return { estado, desenhar };
  }

  const vitrines = {};
  vitrines["[data-vitrine]"] = criarVitrine(PRODUTOS, "[data-vitrine]", "[data-filtros]");
  if (NATAL_LISTA.length) {
    vitrines["[data-vitrine-natal]"] = criarVitrine(NATAL_LISTA, "[data-vitrine-natal]", "[data-filtros-natal]");
  } else {
    document.querySelectorAll("[data-so-natal]").forEach((el) => el.remove());
  }

  // ---------- painel da sacola ----------
  function atualizarSacola() {
    const ks = Object.keys(sacola);
    const qtdTotal = ks.reduce((s, k) => s + sacola[k], 0);

    const badge = $("[data-qtd-sacola]");
    badge.textContent = qtdTotal;
    badge.hidden = qtdTotal === 0;

    $("[data-vazia]").hidden = ks.length > 0;
    $("[data-rodape-sacola]").hidden = ks.length === 0;
    $("[data-total]").textContent = real(totalSacola());
    $("[data-itens]").innerHTML = ks.map((k) => {
      const { p, op } = partes(k), q = sacola[k];
      const u = unitario(k);
      const cheio = op == null ? p.preco : precoOpcao(p, op);
      return `
        <li class="item">
          <img src="${p.foto}" alt="">
          <div>
            <h3>${esc(p.nome)}</h3>
            ${op != null ? `<p class="item__opcao">${esc(opcoesDe(p)[op].nome)}</p>` : ""}
            <p>${real(u)}${u < cheio ? ` <span class="item__desc">preço de ${p.desconto.aPartirDe}+ peças</span>` : ""}</p>
            <div class="qtd">
              <button type="button" data-menos="${k}" aria-label="Diminuir quantidade de ${esc(nomeItem(k))}">−</button>
              <span>${q}</span>
              <button type="button" data-mais="${k}" aria-label="Aumentar quantidade de ${esc(nomeItem(k))}" ${qtdDoProduto(p.id) >= limite(p) ? "disabled" : ""}>+</button>
            </div>
          </div>
          <button type="button" class="item__rem" data-remover="${k}">Remover</button>
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
    const ks = Object.keys(sacola);
    if (!ks.length) return;
    const linhas = ks.map((k) => `• ${sacola[k]}x ${nomeItem(k)} — ${real(unitario(k) * sacola[k])}`);
    abrirWhats(
      `Oi, ESCUP! Quero fazer este pedido pelo site:\n\n${linhas.join("\n")}\n\nTotal: ${real(totalSacola())}\n\nPodem confirmar a disponibilidade e como fica o pagamento e a entrega?`
    );
  }

  // ---------- eventos ----------
  document.addEventListener("change", (e) => {
    const s = e.target.closest("[data-opcao]");
    if (!s) return;
    const p = porId[s.dataset.opcao];
    document.querySelector(`[data-preco="${p.id}"]`).innerHTML = precoHTML(p, +s.value);
  });

  document.addEventListener("click", (e) => {
    const t = e.target.closest("button, [data-fechar-sacola]");
    if (!t) return;
    const d = t.dataset;
    if (d.add) {
      const s = document.querySelector(`[data-opcao="${d.add}"]`);
      adicionar(s ? `${d.add}::${s.value}` : d.add);
    } else if (d.orcamento) {
      const p = porId[d.orcamento];
      abrirWhats(`Oi, ESCUP! ${p.mensagem || `Quero um orçamento de: ${p.nome}.`}`);
    } else if (d.cat) {
      const v = vitrines[d.alvo]; v.estado.filtro = d.cat; v.desenhar();
    } else if (d.mais) adicionar(d.mais);
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

  atualizarSacola();
})();
