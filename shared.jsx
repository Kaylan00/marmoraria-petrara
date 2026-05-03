// shared.jsx — common components: Logo, Header, Footer, Icons, Modal, FAB

const { useState, useEffect, useRef } = React;

// ────────────────────────────────────────────────────────────────────────
// Icons
// ────────────────────────────────────────────────────────────────────────
const Icon = {
  Pin: (p) => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  Whats: (p) => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.7-1.7-1-2.3-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.7.4-.3.3-1 1-1 2.4 0 1.4 1 2.8 1.2 3 .1.2 2 3 4.8 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.3.2-.7.2-1.2.2-1.3-.1-.1-.3-.2-.6-.3z M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.3C8.6 21.5 10.3 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2z"/>
    </svg>
  ),
  Phone: (p) => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.33 1.85.57 2.81.7a2 2 0 0 1 1.72 2.03Z"/>
    </svg>
  ),
  Mail: (p) => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-10 5L2 7"/>
    </svg>
  ),
  Clock: (p) => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Fb: (p) => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.3.2 2.3.2v2.5h-1.3c-1.3 0-1.7.8-1.7 1.6V12h2.9l-.5 2.9h-2.4v7A10 10 0 0 0 22 12z"/></svg>
  ),
  Ig: (p) => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect width="20" height="20" x="2" y="2" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  ),
  Pin2: (p) => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 0C5.4 0 0 5.4 0 12c0 5 3 9.4 7.4 11.2-.1-.9-.2-2.4 0-3.5l1.6-6.6s-.4-.8-.4-2c0-1.9 1.1-3.3 2.5-3.3 1.2 0 1.7.9 1.7 2 0 1.2-.8 3-1.2 4.7-.3 1.4.7 2.5 2.1 2.5 2.5 0 4.4-2.6 4.4-6.4 0-3.4-2.4-5.7-5.9-5.7-4 0-6.4 3-6.4 6.1 0 1.2.5 2.5 1.1 3.2.1.1.1.2.1.4l-.4 1.5c-.1.2-.2.3-.5.2-1.7-.8-2.7-3.2-2.7-5.2 0-4.2 3.1-8.1 8.8-8.1 4.6 0 8.2 3.3 8.2 7.7 0 4.6-2.9 8.3-6.9 8.3-1.4 0-2.6-.7-3.1-1.5l-.8 3.2c-.3 1.1-1.1 2.6-1.6 3.4 1.2.4 2.5.6 3.8.6 6.6 0 12-5.4 12-12C24 5.4 18.6 0 12 0z"/></svg>
  ),
  Arrow: (p) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  Up: (p) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <polyline points="18 15 12 9 6 15"/>
    </svg>
  ),
  X: (p) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  Chev: (p) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  Check: (p) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
};

// ────────────────────────────────────────────────────────────────────────
// Logo glyph: stylized "P" arch (mármore-inspired)
// ────────────────────────────────────────────────────────────────────────
function LogoGlyph({ size = 44, color }) {
  return (
    <svg width={size} height={size * 0.74} viewBox="0 0 44 32" fill="none" style={{ color: color || "currentColor" }}>
      <path d="M2 30 L10 6 L14 6 L14 30" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M22 30 L22 2 L30 18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M30 18 L38 2 L38 30" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M14 12 L22 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.7"/>
      <circle cx="22" cy="12" r="1.6" fill="currentColor"/>
    </svg>
  );
}

function Logo({ light = false }) {
  return (
    <a href="index.html" className="logo" aria-label="Petrara — início">
      <LogoGlyph color="var(--accent)" />
      <div className="logo-mark">PETRARA</div>
      <div className="logo-sub">Mármores &amp; Granitos</div>
    </a>
  );
}

// ────────────────────────────────────────────────────────────────────────
// Topbar
// ────────────────────────────────────────────────────────────────────────
function Topbar() {
  return (
    <div className="topbar">
      <div className="container topbar-inner">
        <div className="topbar-info">
          <span className="topbar-item"><Icon.Pin /> Av. Faria Lima, 2840 — Itaim Bibi, São Paulo — SP, 04538-132</span>
        </div>
        <div className="topbar-meta">
          <span className="topbar-item"><Icon.Whats /> WhatsApp: (11) 94512-8800</span>
          <span className="topbar-item"><Icon.Phone /> Telefone: (11) 3045-2200</span>
          <span className="topbar-item">Siga-nos:</span>
          <div className="topbar-socials">
            <a href="#" aria-label="Facebook"><Icon.Fb /></a>
            <a href="#" aria-label="Instagram"><Icon.Ig /></a>
            <a href="#" aria-label="Pinterest"><Icon.Pin2 /></a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────
// Header (sticky w/ scroll state)
// ────────────────────────────────────────────────────────────────────────
function Header({ active = "home", transparent = false, onCTAClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);
  const isTransparent = transparent && !scrolled;
  const close = () => setMenuOpen(false);
  return (
    <header className={`header ${scrolled ? "is-scrolled" : ""} ${isTransparent ? "is-transparent" : ""}`}>
      <div className="container header-inner">
        <Logo />
        <nav className="nav">
          <a href="index.html" className={`nav-link ${active === "home" ? "is-active" : ""}`}>Home</a>
          <a href="index.html#sobre" className="nav-link">Sobre</a>
          <a href="index.html#servicos" className="nav-link">Serviços</a>
          <a href="produto.html" className={`nav-link ${active === "produto" ? "is-active" : ""}`}>Produtos</a>
          <a href="portfolio.html" className={`nav-link ${active === "portfolio" ? "is-active" : ""}`}>Portfólio</a>
          <a href="index.html#depoimentos" className="nav-link">Depoimentos</a>
          <a href="index.html#blog" className="nav-link">Blog</a>
        </nav>
        <button className="btn btn-outline btn-sm header-cta" onClick={onCTAClick}>Solicitar Orçamento</button>
        <button
          className={`hamburger ${menuOpen ? "is-open" : ""}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Menu"
          aria-expanded={menuOpen}
        >
          <span></span><span></span><span></span>
        </button>
      </div>
      {/* Mobile drawer */}
      <div className={`mobile-drawer ${menuOpen ? "is-open" : ""}`} onClick={close}>
        <div className="mobile-drawer-inner" onClick={(e) => e.stopPropagation()}>
          <div className="mobile-drawer-head">
            <Logo />
            <button className="mobile-drawer-close" onClick={close} aria-label="Fechar">×</button>
          </div>
          <nav className="mobile-nav">
            <a href="index.html" onClick={close}>Home</a>
            <a href="index.html#sobre" onClick={close}>Sobre</a>
            <a href="index.html#servicos" onClick={close}>Serviços</a>
            <a href="produto.html" onClick={close}>Produtos</a>
            <a href="portfolio.html" onClick={close}>Portfólio</a>
            <a href="index.html#depoimentos" onClick={close}>Depoimentos</a>
            <a href="index.html#blog" onClick={close}>Blog</a>
          </nav>
          <button className="btn btn-primary mobile-drawer-cta" onClick={() => { close(); onCTAClick && onCTAClick(); }}>Solicitar Orçamento</button>
          <div className="mobile-drawer-contact">
            <div><Icon.Whats /> (11) 94512-8800</div>
            <div><Icon.Phone /> (11) 3045-2200</div>
            <div><Icon.Pin /> Av. Faria Lima, 2840 — São Paulo</div>
          </div>
        </div>
      </div>
    </header>
  );
}

// ────────────────────────────────────────────────────────────────────────
// Footer
// ────────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Logo />
            <p className="footer-blurb">
              Tudo o que você procura em pedras de qualidade, seja em mármore, granito,
              quartzo ou quartzito — com curadoria e instalação assinadas.
            </p>
            <div style={{ marginTop: 22 }}>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(255,255,255,.85)", marginBottom: 14 }}>
                Siga-nos nas redes
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                {["Fb", "Ig", "Pin2"].map((k) => {
                  const I = Icon[k];
                  return (
                    <a key={k} href="#" style={{
                      width: 36, height: 36,
                      border: "1px solid rgba(255,255,255,.18)",
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      color: "rgba(255,255,255,.7)", borderRadius: "50%",
                    }}>
                      <I />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
          <div>
            <h4>Nossos Serviços</h4>
            <ul>
              <li><a href="#">Instalação</a></li>
              <li><a href="#">Escadas</a></li>
              <li><a href="#">Pias &amp; Lavatórios</a></li>
              <li><a href="#">Balcões &amp; Mesas</a></li>
              <li><a href="#">Lavatórios Esculpidos</a></li>
              <li><a href="#">Soleiras &amp; Peitoris</a></li>
            </ul>
          </div>
          <div>
            <h4>Institucional</h4>
            <ul>
              <li><a href="index.html">Home</a></li>
              <li><a href="#">Sobre</a></li>
              <li><a href="portfolio.html">Portfólio</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Política de privacidade</a></li>
              <li><a href="#">Termos de uso</a></li>
            </ul>
          </div>
          <div>
            <h4>Atendimento</h4>
            <div className="footer-contact">
              <div className="footer-contact-row"><Icon.Phone /><span>(11) 3045-2200</span></div>
              <div className="footer-contact-row"><Icon.Whats /><span>(11) 94512-8800</span></div>
              <div className="footer-contact-row"><Icon.Mail /><span>contato@petrara.com.br</span></div>
              <div className="footer-contact-row"><Icon.Pin /><span>Av. Faria Lima, 2840<br/>Itaim Bibi, São Paulo — SP</span></div>
              <div className="footer-contact-row"><Icon.Clock /><span>Seg a Sex: 8h às 18h<br/>Sábado: 8h às 14h</span></div>
            </div>
          </div>
        </div>
        <div className="footer-bar">
          <div>© 2026 Petrara — Mármores &amp; Granitos. Todos os direitos reservados.</div>
          <div>Curadoria de pedras desde 2008</div>
        </div>
      </div>
    </footer>
  );
}

// ────────────────────────────────────────────────────────────────────────
// Floating action: WhatsApp + Back-to-top
// ────────────────────────────────────────────────────────────────────────
function Floaters() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const goWhats = () => {
    const msg = encodeURIComponent("Olá! Vim pelo site da Petrara e gostaria de um orçamento.");
    window.open(`https://wa.me/5511945128800?text=${msg}`, "_blank", "noopener");
  };
  return (
    <>
      <button className="fab-whats" onClick={goWhats}>
        <span style={{
          width: 28, height: 28, borderRadius: "50%",
          background: "rgba(255,255,255,.18)",
          display: "inline-flex", alignItems: "center", justifyContent: "center"
        }}>
          <Icon.Whats />
        </span>
        Fale Conosco
      </button>
      <button
        className={`fab-back ${show ? "is-visible" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Voltar ao topo"
      >
        <Icon.Up />
      </button>
    </>
  );
}

// ────────────────────────────────────────────────────────────────────────
// Modal: multi-step quote
// ────────────────────────────────────────────────────────────────────────
function QuoteModal({ open, onClose }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    type: null,
    space: null,
    stone: null,
    area: "",
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const total = 4;

  useEffect(() => {
    if (open) {
      setStep(0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape" && open) onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const setF = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const next = () => setStep((s) => Math.min(s + 1, total - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const stepValid = (() => {
    if (step === 0) return !!form.type;
    if (step === 1) return !!form.space && !!form.stone;
    if (step === 2) return form.area.trim().length > 0;
    return form.name && form.email && form.phone;
  })();

  return (
    <div className={`modal-back ${open ? "is-open" : ""}`} onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-side">
          <span className="modal-steps-pill">Etapa {step + 1} de {total}</span>
          <h3>Vamos desenhar o seu projeto.</h3>
          <p>Em até 24h um especialista retorna com a curadoria de pedras e estimativa para a sua obra.</p>
          <div style={{ marginTop: 28, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,.14)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "rgba(255,255,255,.78)", marginBottom: 8 }}>
              <Icon.Whats /> Resposta em até 24h
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "rgba(255,255,255,.78)" }}>
              <Icon.Check /> Consultoria sem custo
            </div>
          </div>
        </div>

        <div className="modal-body">
          <button className="modal-close" onClick={onClose} aria-label="Fechar"><Icon.X /></button>
          <div className="modal-progress">
            {Array.from({ length: total }).map((_, i) => (
              <div key={i} className={`modal-progress-step ${i <= step ? "is-done" : ""}`} />
            ))}
          </div>

          {step === 0 && (
            <>
              <div className="modal-step-meta">
                <span className="step-no">— Tipo de obra</span>
                <span className="step-count">01 / 04</span>
              </div>
              <h4>O que você está construindo?</h4>
              <p className="modal-step-sub">Selecione a categoria que mais se aproxima do seu projeto.</p>
              <div className="modal-fields">
                <div className="choice-grid">
                  {[
                    { k: "residencial", t: "Residencial", s: "Casa, apartamento, reforma" },
                    { k: "comercial", t: "Comercial", s: "Loja, escritório, hotelaria" },
                    { k: "arquiteto", t: "Para Arquiteto", s: "Projeto assinado" },
                    { k: "outro", t: "Outro", s: "Conte mais nas observações" },
                  ].map((o) => (
                    <button key={o.k} className={`choice ${form.type === o.k ? "is-on" : ""}`} onClick={() => setF("type", o.k)}>
                      <div className="choice-title">{o.t}</div>
                      <div className="choice-sub">{o.s}</div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div className="modal-step-meta">
                <span className="step-no">— Ambiente &amp; pedra</span>
                <span className="step-count">02 / 04</span>
              </div>
              <h4>Onde a pedra entra?</h4>
              <p className="modal-step-sub">Você pode ajustar depois — isso ajuda a curadoria inicial.</p>
              <div className="modal-fields">
                <div>
                  <label className="field-label">Ambiente</label>
                  <div className="choice-grid">
                    {["Cozinha", "Banheiro", "Sala/Living", "Fachada"].map((s) => (
                      <button key={s} className={`choice ${form.space === s ? "is-on" : ""}`} onClick={() => setF("space", s)}>
                        <div className="choice-title">{s}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="field-label">Tipo de pedra</label>
                  <div className="choice-grid">
                    {["Mármore", "Granito", "Quartzito", "Ainda não sei"].map((s) => (
                      <button key={s} className={`choice ${form.stone === s ? "is-on" : ""}`} onClick={() => setF("stone", s)}>
                        <div className="choice-title">{s}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="modal-step-meta">
                <span className="step-no">— Dimensões</span>
                <span className="step-count">03 / 04</span>
              </div>
              <h4>Tamanho aproximado</h4>
              <p className="modal-step-sub">Sem precisão — uma estimativa em metros lineares ou m² já basta.</p>
              <div className="modal-fields">
                <div>
                  <label className="field-label">Área aproximada</label>
                  <input className="field-input" value={form.area} onChange={(e) => setF("area", e.target.value)} placeholder="Ex.: 6 m² de bancada + 2 m de soleira" />
                </div>
                <div>
                  <label className="field-label">Observações (opcional)</label>
                  <textarea className="field-textarea" value={form.notes} onChange={(e) => setF("notes", e.target.value)} placeholder="Acabamento desejado, prazo, referências..."/>
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="modal-step-meta">
                <span className="step-no">— Seus dados</span>
                <span className="step-count">04 / 04</span>
              </div>
              <h4>Como falamos com você?</h4>
              <p className="modal-step-sub">Os dados servem apenas para retornar com a proposta.</p>
              <div className="modal-fields">
                <div>
                  <label className="field-label">Nome completo</label>
                  <input className="field-input" value={form.name} onChange={(e) => setF("name", e.target.value)} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div>
                    <label className="field-label">E-mail</label>
                    <input className="field-input" type="email" value={form.email} onChange={(e) => setF("email", e.target.value)} />
                  </div>
                  <div>
                    <label className="field-label">Telefone</label>
                    <input className="field-input" value={form.phone} onChange={(e) => setF("phone", e.target.value)} placeholder="(11) 90000-0000" />
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="modal-actions">
            <button className="link-btn" onClick={prev} disabled={step === 0}>‹ Voltar</button>
            {step < total - 1 ? (
              <button className="btn btn-primary btn-sm" onClick={next} disabled={!stepValid}>
                Continuar <Icon.Arrow />
              </button>
            ) : (
              <button className="btn btn-primary btn-sm" onClick={() => { alert("Pedido enviado! Retornaremos em até 24h."); onClose(); }} disabled={!stepValid}>
                Enviar solicitação <Icon.Arrow />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────
// Reveal-on-scroll hook
// ────────────────────────────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.05, rootMargin: "0px 0px -40px 0px" });
    els.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        el.classList.add("is-in");
      } else {
        io.observe(el);
      }
    });
    return () => io.disconnect();
  }, []);
}

// ────────────────────────────────────────────────────────────────────────
// Newsletter
// ────────────────────────────────────────────────────────────────────────
function Newsletter() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  return (
    <div className="container" style={{ position: "relative", zIndex: 5 }}>
      <div className="newsletter">
        <div className="newsletter-label">Cadastre-se e fique por dentro das novidades.</div>
        <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); alert("Inscrito! Obrigado."); setEmail(""); setName(""); }}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Seu melhor e-mail" type="email" />
          <button className="btn btn-primary" type="submit">Cadastrar</button>
        </form>
      </div>
    </div>
  );
}

// expose globals
Object.assign(window, {
  Icon, Logo, LogoGlyph, Topbar, Header, Footer, Floaters, QuoteModal, Newsletter, useReveal,
});
