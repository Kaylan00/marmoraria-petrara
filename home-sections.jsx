// home-sections.jsx — Home page sections

const { useState: useS, useEffect: useE, useRef: useR } = React;

// Hero photos — Unsplash
const HERO_SLIDES = [
  {
    img: "assets/stones/01-calacatta.svg",
    eyebrow: "Design",
    title: "Transforme seus espaços",
    sub: "Curadoria de mármores e granitos para projetos que pedem permanência e sofisticação.",
  },
  {
    img: "assets/stones/02-carrara.svg",
    eyebrow: "Cozinhas",
    title: "Bancadas que duram décadas",
    sub: "Pedras selecionadas em chapas inteiras — você escolhe a sua antes de cortar.",
  },
  {
    img: "assets/stones/03-nero.svg",
    eyebrow: "Banheiros",
    title: "Lavatórios assinados",
    sub: "Esculpidos em peça única, com acabamentos sob medida.",
  },
];

// ────────────────── HERO ──────────────────
function HeroFull({ onCTA }) {
  const [i, setI] = useS(0);
  useE(() => {
    const t = setInterval(() => setI((v) => (v + 1) % HERO_SLIDES.length), 6500);
    return () => clearInterval(t);
  }, []);
  const s = HERO_SLIDES[i];
  return (
    <section className="hero hero-full">
      {HERO_SLIDES.map((sl, idx) => (
        <div key={idx} className={`hero-bg ${idx === i ? "is-on" : ""}`} style={{ backgroundImage: `url(${sl.img})` }} />
      ))}
      <div className="hero-overlay" />
      <div className="container hero-content">
        <div className="eyebrow eyebrow-light">— {s.eyebrow}</div>
        <h1 className="title-display hero-title">{s.title}</h1>
        <p className="hero-sub">{s.sub}</p>
        <button className="btn btn-primary" onClick={onCTA}>Solicitar Orçamento</button>
      </div>
      <button className="hero-arrow hero-arrow-prev" onClick={() => setI((v) => (v - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)} aria-label="Anterior">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <button className="hero-arrow hero-arrow-next" onClick={() => setI((v) => (v + 1) % HERO_SLIDES.length)} aria-label="Próximo">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
      <div className="hero-dots">
        {HERO_SLIDES.map((_, idx) => (
          <button key={idx} className={`hero-dot ${idx === i ? "is-on" : ""}`} onClick={() => setI(idx)} aria-label={`Slide ${idx+1}`} />
        ))}
      </div>
      <div className="hero-stripe" />
    </section>
  );
}

function HeroSplit({ onCTA }) {
  return (
    <section className="hero hero-split">
      <div className="container hero-split-grid">
        <div className="hero-split-text">
          <div className="eyebrow">— Design</div>
          <h1 className="title-display hero-split-title">
            Transforme<br/>seus espaços<br/><em style={{ fontStyle: "italic", color: "var(--accent)" }}>com permanência.</em>
          </h1>
          <p className="hero-split-sub">
            Mais de 18 anos selecionando pedras nobres em chapas inteiras —
            cada bancada, escada e revestimento parte de um bloco que você escolhe.
          </p>
          <div style={{ display: "flex", gap: 14, marginTop: 28 }}>
            <button className="btn btn-primary" onClick={onCTA}>Solicitar Orçamento</button>
            <a className="btn btn-outline" href="portfolio.html">Ver portfólio</a>
          </div>
          <div className="hero-split-stats">
            <div><strong>+1.200</strong><span>obras entregues</span></div>
            <div><strong>18</strong><span>anos de marmoraria</span></div>
            <div><strong>40+</strong><span>pedras em estoque</span></div>
          </div>
        </div>
        <div className="hero-split-visual">
          <img src="assets/stones/04-verde.svg" alt="Cozinha em mármore" />
          <div className="hero-split-tag">
            <div className="hero-split-tag-no">01</div>
            <div>
              <div className="hero-split-tag-t">Calacatta Oro</div>
              <div className="hero-split-tag-s">Itália · 3cm · polido</div>
            </div>
          </div>
        </div>
      </div>
      <div className="hero-stripe" />
    </section>
  );
}

function HeroEditorial({ onCTA }) {
  return (
    <section className="hero hero-editorial">
      <div className="container hero-edit-inner">
        <div className="hero-edit-mosaic">
          <div className="hero-edit-mblock m1">
            <img src="assets/stones/05-travertino.svg" alt=""/>
          </div>
          <div className="hero-edit-mblock m2">
            <img src="assets/stones/06-graniteBrn.svg" alt=""/>
          </div>
          <div className="hero-edit-mblock m3">
            <img src="assets/stones/07-onyxAmber.svg" alt=""/>
          </div>
        </div>
        <div className="hero-edit-text">
          <div className="eyebrow">— Petrara · est. 2008</div>
          <h1 className="title-display hero-edit-title">Pedra é matéria<br/>que não envelhece.</h1>
          <p className="hero-edit-sub">
            Trabalhamos com mármores, granitos e quartzitos selecionados na pedreira —
            cada projeto é assinado da escolha da chapa à instalação.
          </p>
          <button className="btn btn-primary" onClick={onCTA}>Solicitar Orçamento</button>
        </div>
      </div>
      <div className="hero-stripe" />
    </section>
  );
}

// ────────────────── ABOUT ──────────────────
function About({ onCTA }) {
  return (
    <section className="section-pad section-about" id="sobre">
      <div className="container about-grid">
        <div className="about-text reveal">
          <div className="eyebrow">— Sobre Nós</div>
          <h2 className="title-section">
            Especialistas em projetos profissionais de mármores e granitos.
          </h2>
          <p>
            A Petrara nasceu em 2008 da obsessão por matéria-prima bem escolhida.
            Selecionamos chapas em pedreiras nacionais e importadas, mantendo um estoque
            curado de mais de quarenta pedras — todas disponíveis para visita antes do corte.
          </p>
          <p>
            Cada projeto é tratado como peça única. Da medição em obra ao acabamento,
            o trabalho é assinado por uma equipe que entende que pedra não tem segunda chance.
          </p>
          <div style={{ display: "flex", gap: 14, marginTop: 30 }}>
            <a className="btn btn-outline" href="#">Saiba Mais</a>
            <button className="btn btn-primary" onClick={onCTA}>Solicitar Orçamento</button>
          </div>
        </div>
        <div className="about-visual reveal">
          <div className="about-img-a">
            <img src="assets/stones/08-patagonia.svg" alt="Cozinha com mármore" />
          </div>
          <div className="about-img-b">
            <img src="assets/stones/09-bege.svg" alt="Banheiro com mármore" />
          </div>
          <div className="about-quote">
            <div className="about-quote-mark">“</div>
            <p>Cada chapa é única.<br/>Por isso, cada projeto também.</p>
            <span>— Helena Castro, fundadora</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ────────────────── SERVICES (carousel) ──────────────────
const SERVICES = [
  { name: "Instalação",        img: "assets/stones/10-graniteGry.svg" },
  { name: "Escadas",           img: "assets/stones/11-rosaPort.svg" },
  { name: "Pias & Lavatórios", img: "assets/stones/12-azulMacaub.svg" },
  { name: "Balcões & Mesas",   img: "assets/stones/01-calacatta.svg" },
  { name: "Lavatórios Esculpidos", img: "assets/stones/02-carrara.svg" },
  { name: "Soleiras & Peitoris", img: "assets/stones/03-nero.svg" },
];
function Services() {
  return (
    <section className="section-pad section-services" id="servicos">
      <div className="container center-head reveal">
        <div className="eyebrow">— Nossos Serviços</div>
        <h2 className="title-section">Estamos sempre disponíveis,<br/>atendendo em diversos canais.</h2>
        <p>Da especificação ao pós-venda — uma equipe dedicada acompanha cada etapa do projeto.</p>
      </div>
      <div className="services-strip reveal">
        {SERVICES.map((s, i) => (
          <a key={i} className="service-tile" href="produto.html" style={{ backgroundImage: `url(${s.img})` }}>
            <div className="service-tile-overlay" />
            <div className="service-tile-label">
              <span className="service-tile-no">0{i + 1}</span>
              <span className="service-tile-name">{s.name}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

// ────────────────── DIFFERENTIALS ──────────────────
const DIFFS = [
  { t: "Profissionais Capacitados", d: "Equipe formada por marmoristas e instaladores com mais de uma década de obra fina.",  i: "users",    img: "assets/stones/01-calacatta.svg" },
  { t: "Serviços Ricos em Acabamentos", d: "Polido, levigado, escovado, flameado — escolhemos junto com o arquiteto.",   i: "tools",    img: "assets/stones/05-travertino.svg" },
  { t: "Produtos de Alta Qualidade", d: "Estoque curado de pedras nacionais e importadas, em chapas inteiras.", i: "diamond",  img: "assets/stones/03-nero.svg" },
  { t: "Trabalho Garantido", d: "Garantia formal de instalação e suporte por toda a vida útil do projeto.", i: "shield",   img: "assets/stones/06-graniteBrn.svg" },
  { t: "Visita Técnica", d: "Medição em obra com tecnologia de gabaritos digitais — sem retrabalho.", i: "compass",  img: "assets/stones/04-verde.svg" },
  { t: "Departamento de Projetos", d: "Trabalho próximo a arquitetos: do briefing ao desenho de paginação.", i: "drafting", img: "assets/stones/12-azulMacaub.svg" },
  { t: "Consultoria Gratuita", d: "Curadoria de pedras compatível com o orçamento e o uso final do ambiente.", i: "chat",     img: "assets/stones/07-onyxAmber.svg" },
];
function DiffIcon({ k }) {
  const props = { width: 30, height: 30, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round" };
  if (k === "users")    return <svg {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
  if (k === "tools")    return <svg {...props}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>;
  if (k === "diamond")  return <svg {...props}><path d="M6 3h12l4 6-10 13L2 9z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/></svg>;
  if (k === "shield")   return <svg {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>;
  if (k === "compass")  return <svg {...props}><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>;
  if (k === "drafting") return <svg {...props}><path d="M12 3v17"/><path d="M5 7h14"/><path d="M5 21l7-4 7 4"/></svg>;
  if (k === "chat")     return <svg {...props}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
  return null;
}
function Differentials() {
  return (
    <section className="section-pad section-diffs">
      <div className="diff-bg" />
      <div className="container center-head reveal">
        <div className="eyebrow">— Nossos Diferenciais</div>
        <h2 className="title-section">Por que nos escolher?</h2>
        <p>Realizamos serviços ricos em detalhes e cheios de capricho, mantendo-nos sempre atualizados às tendências do mercado.</p>
      </div>
      <div className="container diff-grid reveal">
        {DIFFS.map((d, i) => (
          <div key={i} className="diff-card">
            <div className="diff-card-bg" style={{ backgroundImage: `url(${d.img})` }} />
            <div className="diff-card-inner">
              <div className="diff-icon-wrap">
                <span className="diff-icon-front"><DiffIcon k={d.i} /></span>
                <span className="diff-icon-back"><DiffIcon k={d.i} /></span>
              </div>
              <h3 className="diff-t">{d.t}</h3>
              <p className="diff-d">{d.d}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ────────────────── PORTFOLIO grid (preview) ──────────────────
const PORTFOLIO_IMGS = [
  "assets/stones/04-verde.svg",
  "assets/stones/05-travertino.svg",
  "assets/stones/06-graniteBrn.svg",
  "assets/stones/07-onyxAmber.svg",
  "assets/stones/08-patagonia.svg",
  "assets/stones/09-bege.svg",
  "assets/stones/10-graniteGry.svg",
  "assets/stones/11-rosaPort.svg",
];
function PortfolioGrid() {
  return (
    <section className="section-pad section-portfolio" id="portfolio">
      <div className="container center-head reveal">
        <div className="eyebrow">— Portfólio</div>
        <h2 className="title-section">Confira alguns dos<br/>nossos trabalhos.</h2>
      </div>
      <div className="container portfolio-grid reveal">
        {PORTFOLIO_IMGS.map((src, i) => (
          <a key={i} className="portfolio-cell" href="portfolio.html" style={{ backgroundImage: `url(${src})` }}>
            <div className="portfolio-cell-overlay">
              <span>Ver projeto</span>
              <Icon.Arrow />
            </div>
          </a>
        ))}
      </div>
      <div className="container" style={{ textAlign: "center", marginTop: 50 }}>
        <a className="btn btn-outline" href="portfolio.html">Ver portfólio completo</a>
      </div>
    </section>
  );
}

// ────────────────── TESTIMONIALS ──────────────────
const TESTS = [
  { q: "A curadoria foi cirúrgica. Visitei o galpão, escolhi a chapa exata e recebi a bancada como vi no dia.", n: "Renata Salgado", r: "Arquiteta — Studio Bossa" },
  { q: "Equipe pontual, instalação impecável, acabamento que segue impecável depois de quatro anos de uso pesado.", n: "André Mancini", r: "Cliente residencial — Pinheiros" },
  { q: "Trabalho com a Petrara em todos os meus projetos hoteleiros desde 2019. Não há substituto.", n: "Júlia Tavares", r: "Arquiteta de hotelaria" },
];
function Testimonials() {
  const [i, setI] = useS(0);
  return (
    <section className="section-pad section-tests" id="depoimentos">
      <div className="container center-head reveal" style={{ marginBottom: 36 }}>
        <div className="eyebrow eyebrow-light">— Depoimentos</div>
        <h2 className="title-section" style={{ color: "#fff" }}>O que dizem os nossos clientes.</h2>
      </div>
      <div className="container tests-stage reveal">
        <div className="tests-quote-mark">“</div>
        <p className="tests-q">{TESTS[i].q}</p>
        <div className="tests-meta">
          <strong>{TESTS[i].n}</strong>
          <span>{TESTS[i].r}</span>
        </div>
        <div className="tests-dots">
          {TESTS.map((_, idx) => (
            <button key={idx} className={`tests-dot ${idx === i ? "is-on" : ""}`} onClick={() => setI(idx)} aria-label={`${idx+1}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────── BLOG ──────────────────
const POSTS = [
  { tag: "Cozinhas", t: "Como escolher o mármore certo para a sua cozinha", d: "Os mármores são uma das pedras mais importantes na hora de remodelar ou construir uma cozinha. Eles não apenas...", img: "assets/stones/12-azulMacaub.svg" },
  { tag: "Banheiros", t: "Granito ou quartzito: o que faz mais sentido no banheiro?", d: "Cada pedra confere elegância e sofisticação ao espaço. Seja para revestimento de pisos, paredes, mas...", img: "assets/stones/01-calacatta.svg" },
  { tag: "Materiais", t: "Quartzito Calacatta: o luxo do mármore com a dureza do granito", d: "Em bancadas de cozinha, pisos ou banheiros, pode adicionar um toque de elegância e sofisticação. No...", img: "assets/stones/02-carrara.svg" },
];
function Blog() {
  return (
    <section className="section-pad section-blog" id="blog">
      <div className="container center-head reveal">
        <div className="eyebrow">— Conteúdo</div>
        <h2 className="title-section">No nosso blog</h2>
      </div>
      <div className="container blog-grid reveal">
        {POSTS.map((p, i) => (
          <article key={i} className="blog-card">
            <div className="blog-img" style={{ backgroundImage: `url(${p.img})` }} />
            <div className="blog-body">
              <span className="blog-tag">— {p.tag}</span>
              <h3 className="blog-t">{p.t}</h3>
              <p className="blog-d">{p.d}</p>
              <a href="#" className="blog-link">Ver postagem <Icon.Arrow /></a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

Object.assign(window, { HeroFull, HeroSplit, HeroEditorial, About, Services, Differentials, PortfolioGrid, Testimonials, Blog });
