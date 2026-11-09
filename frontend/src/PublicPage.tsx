import { useEffect, useState } from "react";
import { getPublicLinks } from "./api";
import type { LinkItem } from "./types";

const expertise = [
  {
    title: "AI & Applied LLM",
    description:
      "Researching and integrating LLMs into internal tools, building RAG pipelines, experimenting with local models and packaging AI capabilities into reusable APIs.",
    tags: [
      "Python",
      "LLM",
      "RAG",
      "Llama",
      "Mistral",
      "LangChain",
      "Hugging Face",
      "FAISS",
      "Pinecone",
      "PyTorch",
      "TensorFlow",
    ],
  },
  {
    title: "Automation & Integration",
    description:
      "Designing automated workflows connecting APIs, databases, internal applications and operational business processes.",
    tags: [
      "n8n",
      "REST API",
      "Google Workspace",
      "HubSpot",
      "Meta APIs",
      "Marketplace APIs",
      "Google Apps Script",
    ],
  },
  {
    title: "Backend Engineering",
    description:
      "Building APIs, data-processing services, authentication flows and backend systems supporting internal platforms and automation.",
    tags: ["Python", "FastAPI", "PostgreSQL", "MySQL", "SQL Server", "PHP", "Laravel"],
  },
  {
    title: "Frontend & Analytics",
    description:
      "Building internal interfaces and dashboards that transform operational data into usable information and actionable insights.",
    tags: ["React", "JavaScript", "HTML", "CSS", "Power BI", "Tableau", "Looker Studio", "Figma"],
  },
  {
    title: "Infrastructure & Delivery",
    description:
      "Deploying applications, automation services and local AI infrastructure while connecting frontend, backend and databases across environments.",
    tags: ["Docker", "NGINX", "Linux", "Git", "GitHub", "Local AI Server"],
  },
];

const projects = [
  {
    type: "Marketplace Automation",
    title: "Marketplace Research Automation Platform",
    lead: "Automating marketplace intelligence across eBay, Reverb, Etsy and Chợ Tốt.",
    description:
      "A repeatable research pipeline for hundreds of keywords, scheduled workflows and consolidated marketplace data.",
    tags: ["n8n", "REST API", "PostgreSQL", "Google Sheets", "Python"],
    architecture: [
      "Keywords",
      "Marketplace API / Search",
      "Pagination",
      "Normalization",
      "Relevance Filtering",
      "Deduplication",
      "PostgreSQL",
      "Analytics",
    ],
    note: "Strict matching, duplicate prevention, API-limit awareness and normalized listings support faster operational research.",
  },
  {
    type: "Data Platform",
    title: "Marketplace Analytics & Data Quality Platform",
    lead: "Turning marketplace listing data into operational intelligence.",
    description:
      "A searchable data layer for listing, seller, price and keyword trends with quality checks built into the workflow.",
    tags: ["React", "FastAPI", "PostgreSQL", "Docker"],
    architecture: ["React", "FastAPI", "PostgreSQL"],
    note: "Filters, pagination, CSV export and seller analytics turn raw data into practical operational views.",
  },
  {
    type: "Applied AI",
    title: "Internal RAG & LLM Platform",
    lead: "Experimenting with and integrating AI models into internal tools.",
    description:
      "A reusable path from business documents and data to retrieval-augmented internal applications.",
    tags: ["Python", "FastAPI", "RAG", "FAISS", "Hugging Face"],
    architecture: ["Documents", "Chunking", "Embeddings", "FAISS", "Local LLM", "FastAPI"],
    note: "Research and integration focused on making LLM capabilities practical inside existing workflows.",
  },
];

const publications = [
  {
    source: "Springer",
    title:
      "Feature Selection Based on Ranking Metagenomic Relative Abundance for Inflammatory Bowel Disease Prediction",
    tags: ["Machine Learning", "Metagenomics", "Feature Selection"],
    url: "https://link.springer.com/chapter/10.1007/978-3-031-70011-8_9",
    action: "Open publication",
  },
  {
    source: "Springer",
    title:
      "Fine-Tuned Visualization with T-Distributed Stochastic Neighbor Embeddings on Metagenomic Data for Disease Classification",
    tags: ["Machine Learning", "t-SNE", "Data Visualization", "Metagenomics"],
    url: "https://link.springer.com/chapter/10.1007/978-981-96-0695-5_2",
    action: "Open publication",
  },
  {
    source: "CTU Research Lab",
    title: "The Similar Thesis Detection in a Submission System of the Thesis Report",
    description:
      "Research focused on identifying similar thesis content within an academic submission system.",
    tags: ["NLP", "Text Similarity", "Information Retrieval"],
    url: "https://fis.ctu.edu.vn/research/integrated-information-systems-laboratory",
    action: "Open research link",
  },
];

const experience = [
  {
    period: "2025 — Present",
    role: "AI Engineer / Automation & Technical Lead",
    company: "HQsing",
    tags: ["AI", "Automation", "Backend", "Internal Systems"],
    points: [
      "LLM and RAG research, integration and local AI infrastructure.",
      "FastAPI services, React internal tools and n8n workflows for marketplace and business operations.",
      "Business requirements, SRS documentation, system design, deployment and development-team coordination.",
    ],
  },
  {
    period: "Aug 2024 — Mar 2025",
    role: "Data Analyst",
    company: "GoBuy",
    tags: ["E-commerce", "Data", "Analytics"],
    points: [
      "E-commerce scraping systems, marketplace data processing and platform research.",
      "Data filtering, customer demand analysis and Tableau, BI and Excel visualizations.",
    ],
  },
  {
    period: "2023 — 2024",
    role: "Research Leader",
    company: "Can Tho University",
    tags: ["Machine Learning", "NLP", "Research"],
    points: [
      "Thesis similarity detection, Python data collection, machine-learning experiments and scientific research.",
    ],
  },
];

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="portfolio-label">
      <span />
      {children}
    </p>
  );
}

function Tags({ items }: { items: string[] }) {
  return (
    <div className="tag-list">
      {items.map((tag) => (
        <span key={tag}>{tag}</span>
      ))}
    </div>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="portfolio-header">
      <a className="portfolio-logo" href="#home" aria-label="Mansooho home">
        <span>M</span>
        <strong>Mansooho</strong>
      </a>
      <button
        className="menu-toggle"
        aria-expanded={menuOpen}
        aria-label="Toggle navigation"
        onClick={() => setMenuOpen((open) => !open)}
        type="button"
      >
        <i />
        <i />
      </button>
      <nav className={menuOpen ? "portfolio-nav open" : "portfolio-nav"}>
        {["Home", "About", "Expertise", "Work", "Research", "Experience", "Contact"].map(
          (item) => (
            <a
              href={`#${item.toLowerCase()}`}
              key={item}
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </a>
          ),
        )}
        <a className="nav-github" href="https://github.com/HatNguyenLe" rel="noreferrer" target="_blank">
          GitHub ↗
        </a>
      </nav>
    </header>
  );
}

export default function PublicPage() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [linksError, setLinksError] = useState("");

  useEffect(() => {
    getPublicLinks()
      .then(setLinks)
      .catch((reason: unknown) =>
        setLinksError(reason instanceof Error ? reason.message : "Unable to load links."),
      );
  }, []);

  return (
    <div className="portfolio-site">
      <Header />
      <main>
        <section className="portfolio-section hero-section" id="home">
          <div className="hero-copy">
            <SectionLabel>AI · Automation · Systems</SectionLabel>
            <h1>Hi, I&apos;m Mansooho.</h1>
            <h2>
              <span>AI Automation Engineer</span>
              <br />& Technical Team Lead
            </h2>
            <p className="hero-lead">
              I design and build AI-powered automation, backend services and data systems
              using Python, FastAPI, React, PostgreSQL and n8n.
            </p>
            <p className="hero-muted">
              My work focuses on transforming operational problems into deployable,
              measurable and scalable software solutions.
            </p>
            <div className="hero-actions">
              <a className="button-accent" href="#work">View my work ↓</a>
              <a className="button-outline" href="https://github.com/HatNguyenLe" rel="noreferrer" target="_blank">
                GitHub ↗
              </a>
            </div>
            <Tags items={["Python", "FastAPI", "React", "PostgreSQL", "n8n", "Docker", "REST API", "LLM", "RAG"]} />
          </div>
          <aside className="profile-card">
            <div className="profile-rule" />
            <img src="/images/avatar.jpg" alt="Hat (Mansooho) Nguyen Le" />
            <span>Profile</span>
            <h3>Hat (Mansooho) Nguyen Le</h3>
            <p>0938812473</p>
            <p>Ho Chi Minh City, Vietnam</p>
            <strong><i /> Open to collaboration</strong>
          </aside>
        </section>

        <section className="portfolio-section about-section" id="about">
          <div>
            <SectionLabel>About</SectionLabel>
            <h2>Building systems, not just features.</h2>
          </div>
          <div className="about-copy">
            <p>My background combines data research, software engineering, automation and applied AI.</p>
            <p>
              I started with scientific research and data analysis, working with machine
              learning, metagenomic datasets and visualization. I later moved into
              e-commerce data analytics before focusing on AI engineering and enterprise automation.
            </p>
            <p>
              Today, I work across the full lifecycle of internal technology projects,
              from understanding business requirements and designing workflows to backend
              development, automation, deployment and development-team coordination.
            </p>
            <strong>
              My main focus is building practical systems that connect AI, APIs, data and business processes.
            </strong>
          </div>
        </section>

        <section className="portfolio-section" id="expertise">
          <SectionLabel>Expertise</SectionLabel>
          <h2 className="section-title">What I work with.</h2>
          <div className="expertise-grid">
            {expertise.map((item, index) => (
              <article className="expertise-card" key={item.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <Tags items={item.tags} />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="portfolio-section work-section" id="work">
          <SectionLabel>Selected Work</SectionLabel>
          <h2 className="section-title">Systems I&apos;ve designed and built.</h2>
          <p className="section-intro">
            Technical case studies across marketplace operations, applied AI, automation and internal platforms.
          </p>
          <div className="projects-list">
            {projects.map((project, index) => (
              <article className="project-card" key={project.title}>
                <div className="project-meta">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>{project.type}</span>
                </div>
                <div className="project-body">
                  <div>
                    <h3>{project.title}</h3>
                    <strong>{project.lead}</strong>
                    <p>{project.description}</p>
                    <Tags items={project.tags} />
                  </div>
                  <div className="architecture">
                    <h4>Architecture</h4>
                    <div className="architecture-flow">
                      {project.architecture.map((step, stepIndex) => (
                        <span key={step}>
                          <b>{step}</b>
                          {stepIndex < project.architecture.length - 1 && <i>→</i>}
                        </span>
                      ))}
                    </div>
                    <p><b>+</b> {project.note}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="portfolio-section research-section" id="research">
          <SectionLabel>Research</SectionLabel>
          <h2 className="section-title">Research & Publications.</h2>
          <p className="section-intro">
            A scientific foundation in machine learning, metagenomics, visualization and NLP.
          </p>
          <div className="publication-grid">
            {publications.map((publication, index) => (
              <article className="publication-card" key={publication.title}>
                <div className="publication-meta">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>{publication.source}</span>
                </div>
                <h3>{publication.title}</h3>
                {publication.description && <p>{publication.description}</p>}
                <Tags items={publication.tags} />
                <a href={publication.url} rel="noreferrer" target="_blank">
                  {publication.action} ↗
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="portfolio-section experience-section" id="experience">
          <div>
            <SectionLabel>Experience</SectionLabel>
            <h2 className="section-title">From research to production systems.</h2>
          </div>
          <div className="timeline">
            {experience.map((item) => (
              <article className="timeline-item" key={item.period}>
                <span>{item.period}</span>
                <h3>{item.role}</h3>
                <h4>{item.company}</h4>
                <Tags items={item.tags} />
                <ul>
                  {item.points.map((point) => <li key={point}>{point}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="education-section">
          <span>Education</span>
          <div><strong>Can Tho University</strong><p>Information Systems</p></div>
          <div><strong>Aptech</strong><p>Diploma in Information Systems Management · Advanced Diploma in Software Engineering</p></div>
        </section>

        <section className="portfolio-section contact-section" id="contact">
          <div>
            <SectionLabel>Contact</SectionLabel>
            <h2 className="section-title">Let&apos;s build something useful.</h2>
            <p className="section-intro">
              I&apos;m interested in AI automation, internal platforms, data systems and applied AI projects.
            </p>
            <a className="button-accent" href="https://github.com/HatNguyenLe" rel="noreferrer" target="_blank">
              Start a conversation →
            </a>
          </div>
          <div className="contact-links">
            {links.map((link) => (
              <a href={link.url} key={link.id} rel="noreferrer" target="_blank">
                <span>{link.title}</span><span>↗</span>
              </a>
            ))}
            {linksError && <p className="links-error">{linksError}</p>}
            <a className="admin-contact-link" href="/admin">Manage links →</a>
          </div>
        </section>
      </main>
      <footer className="portfolio-footer">
        <p>© {new Date().getFullYear()} Mansooho. Built with React, FastAPI and PostgreSQL.</p>
        <a href="#home">Back to top ↑</a>
      </footer>
    </div>
  );
}
