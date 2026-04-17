"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type OverviewView = "thesis" | "fit" | "motion";
type FilterValue =
  | "all"
  | "priority1"
  | "priority2"
  | "selective"
  | "healthcare"
  | "lifesciences"
  | "financial"
  | "industrial"
  | "hospitality";

type Account = {
  id: string;
  name: string;
  priorityLabel: string;
  priorityClass: "p1" | "p2" | "sel";
  categories: FilterValue[];
  search: string;
  chips: string[];
  summary: string;
  thesis: string;
  entryPoints: string;
  landMotion: string;
};

const overviewTabs: Array<{ id: OverviewView; label: string }> = [
  { id: "thesis", label: "Strategy thesis" },
  { id: "fit", label: "Why I fit" },
  { id: "motion", label: "Land and expand motion" },
];

const filterTabs: Array<{ id: FilterValue; label: string }> = [
  { id: "all", label: "All" },
  { id: "priority1", label: "Priority 1" },
  { id: "priority2", label: "Priority 2" },
  { id: "selective", label: "Selective" },
  { id: "healthcare", label: "Healthcare" },
  { id: "lifesciences", label: "Life Sciences" },
  { id: "financial", label: "Financial" },
  { id: "industrial", label: "Industrial" },
  { id: "hospitality", label: "Hospitality / Gaming / Payments" },
];

const accounts: Account[] = [
  {
    id: "chop",
    name: "Children's Hospital of Philadelphia",
    priorityLabel: "Priority 1",
    priorityClass: "p1",
    categories: ["priority1", "healthcare"],
    search:
      "children's hospital of philadelphia chop hospital pediatric healthcare security platform observability compliance",
    chips: ["Healthcare", "High-trust sale", "Complex environment"],
    summary:
      "Best-fit account for my background. Strong potential for a sharp executive story around data control, security operations, and operational resilience.",
    thesis:
      "Help Security and IT teams access the right data faster while reducing friction across routing, storage, and investigations.",
    entryPoints:
      "CISO org, SecOps, infrastructure leadership, platform engineering, enterprise architecture.",
    landMotion:
      "One visible telemetry workflow tied to investigation speed, data sprawl, or tool cost.",
  },
  {
    id: "ibx",
    name: "Independence Blue Cross",
    priorityLabel: "Priority 1",
    priorityClass: "p1",
    categories: ["priority1", "healthcare", "financial"],
    search:
      "independence blue cross ibx healthcare insurance payer compliance security cloud data",
    chips: ["Insurance", "Regulated", "Business-case fit"],
    summary:
      "Strong economics story. A likely fit for cost control, governance, and better control over telemetry growth without sacrificing search or response capability.",
    thesis:
      "Give teams better control over data volume, routing, retention, and search while improving flexibility across the stack.",
    entryPoints:
      "Security leadership, infrastructure ops, cloud/platform, compliance and architecture stakeholders.",
    landMotion: "SIEM cost pressure, cloud log growth, or investigation/search friction.",
  },
  {
    id: "shift4",
    name: "Shift4",
    priorityLabel: "Priority 1",
    priorityClass: "p1",
    categories: ["priority1", "hospitality"],
    search:
      "shift4 payments commerce platform cloud data telemetry security performance",
    chips: ["Payments", "High data volume", "Modern platform fit"],
    summary:
      "Very strong Cribl fit because the environment is likely fast-moving, data-heavy, and sensitive to uptime, security, and operational efficiency.",
    thesis:
      "Help platform and security teams route the right data to the right places while reducing waste and improving signal quality.",
    entryPoints:
      "CTO/CISO org, platform engineering, observability leaders, SRE, security analytics.",
    landMotion:
      "One log or telemetry pipeline with visible cost, noise, or incident-response drag.",
  },
  {
    id: "avantor",
    name: "Avantor",
    priorityLabel: "Priority 1",
    priorityClass: "p1",
    categories: ["priority1", "lifesciences"],
    search:
      "avantor life sciences pharma manufacturing supply chain security cloud telemetry",
    chips: ["Life Sciences", "Enterprise complexity", "Platform story"],
    summary:
      "Great fit for a strategic platform message where data flexibility, operational resilience, and better cross-team access all matter.",
    thesis:
      "Improve telemetry control and efficiency across a distributed enterprise environment with meaningful compliance and operational needs.",
    entryPoints:
      "CISO, infrastructure leaders, cloud/platform, architecture, compliance-aligned stakeholders.",
    landMotion: "Telemetry normalization and routing across a fragmented tool environment.",
  },
  {
    id: "uhs",
    name: "Universal Health Services",
    priorityLabel: "Priority 1",
    priorityClass: "p1",
    categories: ["priority1", "healthcare"],
    search:
      "universal health services uhs hospital acute behavioral healthcare security operations",
    chips: ["Healthcare system", "Multi-site complexity", "High strategic fit"],
    summary:
      "Large healthcare footprint with likely complexity across infrastructure, security, compliance, and operational visibility.",
    thesis:
      "Reduce telemetry sprawl and help teams shape, find, and access the right data across a broad care network.",
    entryPoints:
      "CISO office, network/security engineering, enterprise platform teams, infrastructure leadership.",
    landMotion:
      "Incident investigation, retention strategy, or cross-team visibility challenge.",
  },
  {
    id: "west",
    name: "West Pharmaceuticals",
    priorityLabel: "Priority 1",
    priorityClass: "p1",
    categories: ["priority1", "lifesciences"],
    search:
      "west pharmaceuticals pharma biotech medical manufacturing compliance telemetry",
    chips: ["Pharma / Medtech", "Regulated", "Operational resilience"],
    summary:
      "Strong fit for a disciplined value conversation around governance, telemetry flexibility, and resilience across critical systems.",
    thesis:
      "Create cleaner telemetry operations across security, infrastructure, and critical enterprise systems.",
    entryPoints:
      "CIO/CISO org, security engineering, infrastructure leadership, enterprise architecture.",
    landMotion:
      "Routing, retention, or search strategy tied to compliance and operational continuity.",
  },
  {
    id: "caterpillar",
    name: "Caterpillar",
    priorityLabel: "Priority 2",
    priorityClass: "p2",
    categories: ["priority2", "industrial"],
    search:
      "caterpillar industrial manufacturing global operations telemetry iot cloud security",
    chips: ["Industrial", "Global scale", "Large upside"],
    summary:
      "Massive upside account. I would work it thoughtfully without letting it absorb too much early-cycle time.",
    thesis:
      "Control high-volume telemetry across distributed environments while supporting security and operational teams.",
    entryPoints: "Security leadership, platform engineering, cloud ops, architecture.",
    landMotion: "Log cost or pipeline inefficiency with measurable business impact.",
  },
  {
    id: "tower",
    name: "Tower Health",
    priorityLabel: "Priority 2",
    priorityClass: "p2",
    categories: ["priority2", "healthcare"],
    search: "tower health healthcare hospital pennsylvania regional",
    chips: ["Regional healthcare", "Local relevance", "Practical path"],
    summary:
      "A strong account for practical value selling if timing and urgency are present.",
    thesis:
      "Help lean teams do more with less by simplifying telemetry management and increasing visibility.",
    entryPoints:
      "CIO/CISO org, IT operations, network/security, infrastructure leaders.",
    landMotion:
      "Efficiency plus security visibility in a resource-conscious environment.",
  },
  {
    id: "fulton",
    name: "Fulton Financial",
    priorityLabel: "Priority 2",
    priorityClass: "p2",
    categories: ["priority2", "financial"],
    search: "fulton financial bank banking compliance cloud security telemetry",
    chips: ["Financial services", "Compliance-heavy", "Strong economics case"],
    summary:
      "Good fit for a story centered on governance, searchability, and reducing waste in data pipelines.",
    thesis:
      "Improve flexibility and reduce waste in telemetry pipelines without weakening oversight or investigations.",
    entryPoints:
      "CISO, infrastructure ops, cloud/platform, compliance/risk allies.",
    landMotion: "SIEM economics, retention pressure, or cloud log growth.",
  },
  {
    id: "aramark",
    name: "Aramark",
    priorityLabel: "Priority 2",
    priorityClass: "p2",
    categories: ["priority2", "hospitality"],
    search:
      "aramark hospitality facilities food services distributed operations enterprise architecture",
    chips: ["Hospitality / Facilities", "Distributed ops", "Discovery-led motion"],
    summary:
      "Interesting because of the broad operating footprint and likely mix of data sources and environments.",
    thesis:
      "Give operations and security teams better control over data generated across a broad distributed estate.",
    entryPoints: "Security, infrastructure, cloud, enterprise architecture.",
    landMotion:
      "One business unit or workflow where telemetry volume or fragmentation is painful.",
  },
  {
    id: "penn",
    name: "PENN Entertainment",
    priorityLabel: "Priority 2",
    priorityClass: "p2",
    categories: ["priority2", "hospitality"],
    search:
      "penn entertainment gaming casinos digital sports media loyalty security performance",
    chips: ["Gaming", "Digital + physical", "Security + performance"],
    summary:
      "Potentially valuable blend of digital operations, loyalty platforms, and enterprise security/performance needs.",
    thesis:
      "Support secure and efficient telemetry strategy across digital platforms and enterprise operations.",
    entryPoints:
      "CISO org, digital operations, platform/infrastructure, observability leaders.",
    landMotion:
      "Visibility gap or cost issue tied to digital operations or security investigations.",
  },
  {
    id: "delta",
    name: "Delta Dental",
    priorityLabel: "Priority 2",
    priorityClass: "p2",
    categories: ["priority2", "healthcare"],
    search: "delta dental dental benefits payer insurance healthcare compliance security",
    chips: ["Dental benefits", "Payer-adjacent", "Governance fit"],
    summary:
      "Secondary to IBX, but still a strong value story around flexibility, cost, and faster access to the right data.",
    thesis:
      "Control telemetry growth while improving security and operational responsiveness.",
    entryPoints: "Security leadership, infrastructure ops, cloud/platform owners.",
    landMotion:
      "Pain around data economics, retention, or search/investigation speed.",
  },
  {
    id: "rite-aid",
    name: "Rite Aid",
    priorityLabel: "Selective",
    priorityClass: "sel",
    categories: ["selective"],
    search: "rite aid retail pharmacy restructuring opportunistic special case",
    chips: ["Retail pharmacy", "Special case", "Timing dependent"],
    summary:
      "I would not over-invest early. This stays on a watchlist until there is a clear funded buyer and stable motion.",
    thesis:
      "Only pursue if there is a retained buyer, funded initiative, or inherited environment needing rationalization.",
    entryPoints: "Known stakeholders only, or partner/channel intelligence.",
    landMotion: "None until account stability and buyer continuity are confirmed.",
  },
];

const smoothScrollTo = (sectionId: string): void => {
  document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
};

const handleAnchorJump = (
  event: React.MouseEvent<HTMLAnchorElement>,
  sectionId: string,
): void => {
  event.preventDefault();
  smoothScrollTo(sectionId);
  window.history.replaceState(null, "", `#${sectionId}`);
};

export default function Home() {
  const [activeView, setActiveView] = useState<OverviewView>("thesis");
  const [activeFilter, setActiveFilter] = useState<FilterValue>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [openAccountIds, setOpenAccountIds] = useState<Record<string, boolean>>({});

  const filteredAccounts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return accounts.filter((account) => {
      const matchesFilter =
        activeFilter === "all" || account.categories.includes(activeFilter);

      if (!matchesFilter) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const searchableText = [
        account.name,
        account.search,
        account.summary,
        account.thesis,
        account.entryPoints,
        account.landMotion,
        ...account.chips,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedSearch);
    });
  }, [activeFilter, searchTerm]);

  return (
    <div className="container">
      <div className="nav glass">
        <div className="nav-left">
          <div className="logo-wrap">
            <Image
              src="https://images.ctfassets.net/xnqwd8kotbaj/2p7cUlrhzzi0w4MQrsip8g/c3cac3b93bf0a0871a72918c07750fb0/Cribl.FULL_COLOR.WHT_ALT.svg"
              alt="Cribl logo"
              width={26}
              height={26}
            />
          </div>
          <div className="nav-meta">
            <div className="nav-title">David Gutshall | Cribl Enterprise Business Plan</div>
            <div className="nav-sub">
              Named account strategy - enterprise sales interview - browser-ready presentation
            </div>
          </div>
        </div>
        <div className="nav-actions">
          <a
            className="btn"
            href="#overview"
            onClick={(event) => handleAnchorJump(event, "overview")}
          >
            Overview
          </a>
          <a
            className="btn"
            href="#accounts"
            onClick={(event) => handleAnchorJump(event, "accounts")}
          >
            Accounts
          </a>
          <a
            className="btn"
            href="#plan90"
            onClick={(event) => handleAnchorJump(event, "plan90")}
          >
            30-60-90
          </a>
          <a
            className="btn"
            href="#talktrack"
            onClick={(event) => handleAnchorJump(event, "talktrack")}
          >
            Talk Track
          </a>
          <button className="btn primary" onClick={() => window.print()}>
            Print / Save PDF
          </button>
        </div>
      </div>

      <section className="hero glass">
        <div>
          <div className="eyebrow">
            <span className="pulse" />Cribl enterprise territory plan
          </div>
          <h1>
            <span className="gradient-text">
              Focus the right accounts. Create urgency. Build strategic platform deals.
            </span>
          </h1>
          <p className="hero-copy">
            My strategy for this territory is to prioritize the accounts where Cribl can create
            the clearest executive value: lower telemetry cost, better control over where data
            goes, faster investigation workflows, and more flexibility across Security,
            Infrastructure, Platform, and Observability teams. I do not plan to treat every named
            account equally. I plan to win by focusing the board, opening the right conversations,
            and turning one urgent use case into enterprise expansion.
          </p>

          <div className="hero-actions">
            <button className="btn primary" onClick={() => smoothScrollTo("accounts")}>
              Open account strategy
            </button>
            <button className="btn" onClick={() => smoothScrollTo("talktrack")}>
              Jump to talk track
            </button>
          </div>

          <div className="hero-grid">
            <div className="metric">
              <div className="metric-value">$47M+</div>
              <div className="metric-label">Closed at Evolv in 5 years</div>
            </div>
            <div className="metric">
              <div className="metric-value">100+</div>
              <div className="metric-label">Net-new logos landed</div>
            </div>
            <div className="metric">
              <div className="metric-value">75+</div>
              <div className="metric-label">Expansion deals closed</div>
            </div>
            <div className="metric">
              <div className="metric-value">Splunk</div>
              <div className="metric-label">Adjacent credibility for Cribl conversations</div>
            </div>
          </div>
        </div>

        <div className="hero-side">
          <div className="score-panel">
            <h3>Why this territory fits me</h3>
            <p>
              This account set rewards reps who can navigate complex buying groups, sell to
              regulated and operationally sensitive environments, and turn technical value into
              business outcomes.
            </p>

            <div className="bars">
              <div className="bar-row">
                <div className="bar-top">
                  <span>Complex enterprise selling</span>
                  <span>96%</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: "96%" }} />
                </div>
              </div>
              <div className="bar-row">
                <div className="bar-top">
                  <span>Healthcare pattern recognition</span>
                  <span>94%</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: "94%" }} />
                </div>
              </div>
              <div className="bar-row">
                <div className="bar-top">
                  <span>Executive credibility</span>
                  <span>92%</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: "92%" }} />
                </div>
              </div>
              <div className="bar-row">
                <div className="bar-top">
                  <span>Platform / data-adjacent relevance</span>
                  <span>90%</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: "90%" }} />
                </div>
              </div>
            </div>
          </div>

          <div className="hero-card-small">
            <h4>My thesis in one sentence</h4>
            <ul>
              <li>Attack the top six first.</li>
              <li>Open both operator and executive conversations.</li>
              <li>Lead with one urgent use case, not ten vague ideas.</li>
              <li>Multi-thread early and expand from proof to platform.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section glass" id="overview">
        <div className="section-head">
          <div>
            <h2 className="section-title">Territory overview</h2>
            <p className="section-copy">
              This territory has real enterprise density across healthcare, financial services,
              industrial, payments, gaming, and life sciences. That makes prioritization the most
              important first move.
            </p>
          </div>
        </div>

        <div className="tabs" id="tabs">
          {overviewTabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab ${activeView === tab.id ? "active" : ""}`}
              onClick={() => setActiveView(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeView === "thesis" && (
          <div className="overview-grid">
            <div className="panel">
              <h3>How I would segment the board</h3>
              <div className="bullet-list">
                <div className="bullet">
                  <div className="bullet-dot" />
                  <p>
                    <strong>Priority 1:</strong> CHOP, Independence Blue Cross, Shift4, Avantor,
                    Universal Health Services, West Pharmaceuticals.
                  </p>
                </div>
                <div className="bullet">
                  <div className="bullet-dot" />
                  <p>
                    <strong>Priority 2:</strong> Caterpillar, Tower Health, Fulton Financial,
                    Aramark, PENN Entertainment, Delta Dental.
                  </p>
                </div>
                <div className="bullet">
                  <div className="bullet-dot" />
                  <p>
                    <strong>Selective:</strong> Rite Aid stays opportunistic until buyer continuity
                    and timing are clearer.
                  </p>
                </div>
              </div>
            </div>

            <div className="panel">
              <h3>What I am selling into</h3>
              <div className="bullet-list">
                <div className="bullet">
                  <div className="bullet-dot" />
                  <p>
                    <strong>Security + IT complexity:</strong> multiple teams, multiple tools,
                    conflicting retention and routing needs.
                  </p>
                </div>
                <div className="bullet">
                  <div className="bullet-dot" />
                  <p>
                    <strong>Telemetry economics:</strong> cost pressure, storage choices,
                    searchability, and wasted volume.
                  </p>
                </div>
                <div className="bullet">
                  <div className="bullet-dot" />
                  <p>
                    <strong>Executive pressure:</strong> better control, less lock-in, faster
                    investigations, cleaner operating models.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === "fit" && (
          <div className="overview-grid">
            <div className="panel">
              <h3>What I bring</h3>
              <div className="bullet-list">
                <div className="bullet">
                  <div className="bullet-dot" />
                  <p>
                    <strong>Complex deal discipline:</strong> long cycles, multi-stakeholder
                    selling, executive trust, and structured opportunity management.
                  </p>
                </div>
                <div className="bullet">
                  <div className="bullet-dot" />
                  <p>
                    <strong>Healthcare and regulated selling experience:</strong> useful
                    immediately in CHOP, UHS, Tower, IBX, and Delta Dental.
                  </p>
                </div>
                <div className="bullet">
                  <div className="bullet-dot" />
                  <p>
                    <strong>Splunk background:</strong> valuable adjacent credibility in
                    observability, logging, and enterprise data workflows.
                  </p>
                </div>
              </div>
            </div>

            <div className="panel">
              <h3>What that means for Cribl</h3>
              <div className="bullet-list">
                <div className="bullet">
                  <div className="bullet-dot" />
                  <p>
                    <strong>Faster ramp:</strong> I can credibly enter technical and executive
                    conversations earlier than a pure generalist seller.
                  </p>
                </div>
                <div className="bullet">
                  <div className="bullet-dot" />
                  <p>
                    <strong>Better qualification:</strong> I know how to find urgency, power, and
                    business impact in messy accounts.
                  </p>
                </div>
                <div className="bullet">
                  <div className="bullet-dot" />
                  <p>
                    <strong>Better territory judgment:</strong> I will not confuse activity with
                    progress.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === "motion" && (
          <div className="overview-grid">
            <div className="panel">
              <h3>Land motion</h3>
              <div className="bullet-list">
                <div className="bullet">
                  <div className="bullet-dot" />
                  <p>
                    <strong>Start with one pain:</strong> log cost, telemetry sprawl, search
                    delays, poor routing, or retention friction.
                  </p>
                </div>
                <div className="bullet">
                  <div className="bullet-dot" />
                  <p>
                    <strong>Anchor on measurable value:</strong> time, cost, control, or incident
                    response improvement.
                  </p>
                </div>
                <div className="bullet">
                  <div className="bullet-dot" />
                  <p>
                    <strong>Keep scope sharp:</strong> one team, one workflow, one executive reason
                    to care.
                  </p>
                </div>
              </div>
            </div>

            <div className="panel">
              <h3>Expansion motion</h3>
              <div className="bullet-list">
                <div className="bullet">
                  <div className="bullet-dot" />
                  <p>
                    <strong>Expand across buying centers:</strong> SecOps to Platform to
                    Infrastructure to Architecture.
                  </p>
                </div>
                <div className="bullet">
                  <div className="bullet-dot" />
                  <p>
                    <strong>Broaden the conversation:</strong> from a tactical workflow into a
                    standard for telemetry control and access.
                  </p>
                </div>
                <div className="bullet">
                  <div className="bullet-dot" />
                  <p>
                    <strong>Sell platform gravity:</strong> once Cribl proves value, it becomes
                    sticky and strategic.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="section glass" id="accounts">
        <div className="section-head">
          <div>
            <h2 className="section-title">Named account strategy</h2>
            <p className="section-copy">
              Click any card to expand the account thesis, likely entry point, and first land
              motion.
            </p>
          </div>
        </div>

        <div className="controls">
          {filterTabs.map((filterTab) => (
            <button
              key={filterTab.id}
              className={`tab filter-tab ${activeFilter === filterTab.id ? "active" : ""}`}
              onClick={() => setActiveFilter(filterTab.id)}
            >
              {filterTab.label}
            </button>
          ))}

          <div className="search-wrap">
            <span>Search</span>
            <input
              id="searchInput"
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search account, vertical, use case, or thesis..."
            />
          </div>
        </div>

        <div className="accounts" id="accountGrid">
          {filteredAccounts.map((account) => {
            const isOpen = !!openAccountIds[account.id];

            return (
              <div
                className={`account ${isOpen ? "open" : ""}`}
                key={account.id}
                data-category={account.categories.join(" ")}
              >
                <div className="account-top">
                  <h4>{account.name}</h4>
                  <div className={`priority ${account.priorityClass}`}>{account.priorityLabel}</div>
                </div>
                <div className="chips">
                  {account.chips.map((chip) => (
                    <span className="chip" key={chip}>
                      {chip}
                    </span>
                  ))}
                </div>
                <div className="account-body">
                  <p>{account.summary}</p>
                </div>
                <button
                  className="expand-btn"
                  onClick={() =>
                    setOpenAccountIds((currentState) => ({
                      ...currentState,
                      [account.id]: !currentState[account.id],
                    }))
                  }
                  aria-expanded={isOpen}
                >
                  {isOpen ? "Close account thesis" : "Open account thesis"}
                  <span>{isOpen ? "-" : "+"}</span>
                </button>
                <div className="account-details">
                  <div className="details-inner">
                    <div className="detail">
                      <strong>Thesis:</strong> {account.thesis}
                    </div>
                    <div className="detail">
                      <strong>Likely entry points:</strong> {account.entryPoints}
                    </div>
                    <div className="detail">
                      <strong>Land motion:</strong> {account.landMotion}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredAccounts.length === 0 && (
          <div className="panel" style={{ marginTop: "16px" }}>
            <h3>No accounts match this filter</h3>
            <p className="section-copy" style={{ marginTop: "8px" }}>
              Try broadening your filter or search terms.
            </p>
          </div>
        )}
      </section>

      <section className="section glass" id="plan90">
        <div className="section-head">
          <div>
            <h2 className="section-title">30-60-90 day plan</h2>
            <p className="section-copy">
              My first 90 days are about compressing learning, focusing the board, and turning
              account hypotheses into real pipeline.
            </p>
          </div>
        </div>

        <div className="timeline">
          <div className="phase">
            <div className="phase-tag">Days 1-30</div>
            <h3>Learn + focus</h3>
            <ul>
              <li>Internalize Cribl&apos;s value story and strongest use cases.</li>
              <li>Rank the territory and build account-by-account hypotheses.</li>
              <li>Map likely buying centers and internal political landscapes.</li>
              <li>Shadow top reps and SEs to absorb the best talk tracks.</li>
              <li>Launch tailored outreach into the top six accounts first.</li>
            </ul>
          </div>

          <div className="phase">
            <div className="phase-tag">Days 31-60</div>
            <h3>Create pipeline</h3>
            <ul>
              <li>
                Convert hypotheses into meetings with security, platform, and infrastructure teams.
              </li>
              <li>Qualify for pain, urgency, and organizational priority.</li>
              <li>
                Partner tightly with SEs to build technical credibility without overcomplicating the
                motion.
              </li>
              <li>Move top opportunities into scoped evaluations with clear success criteria.</li>
              <li>Build multi-threaded account plans tied to executive outcomes.</li>
            </ul>
          </div>

          <div className="phase">
            <div className="phase-tag">Days 61-90</div>
            <h3>Land + expand</h3>
            <ul>
              <li>Close first land opportunities with measurable business value.</li>
              <li>Document proof points and convert them into expansion plays.</li>
              <li>Formalize executive relationships in top strategic accounts.</li>
              <li>Refine forecast discipline and next-quarter territory priorities.</li>
              <li>Scale repeatable messaging across Priority 2 accounts.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section glass" id="talktrack">
        <div className="section-head">
          <div>
            <h2 className="section-title">Executive talk track</h2>
            <p className="section-copy">
              I lead with a practical conversation about control, economics, and investigation speed,
              then align one urgent use case to a measurable business outcome.
            </p>
          </div>
        </div>

        <div className="overview-grid">
          <div className="panel">
            <h3>Opening message</h3>
            <div className="bullet-list">
              <div className="bullet">
                <div className="bullet-dot" />
                <p>
                  <strong>Frame:</strong> Most enterprise teams are paying to move, store, and
                  search telemetry they do not actually need in every destination.
                </p>
              </div>
              <div className="bullet">
                <div className="bullet-dot" />
                <p>
                  <strong>Business impact:</strong> rising platform cost, slower investigations, and
                  governance friction across teams.
                </p>
              </div>
              <div className="bullet">
                <div className="bullet-dot" />
                <p>
                  <strong>Cribl value:</strong> route and shape the right data to the right place at
                  the right time, without sacrificing visibility.
                </p>
              </div>
            </div>
          </div>

          <div className="panel">
            <h3>Discovery priorities</h3>
            <div className="bullet-list">
              <div className="bullet">
                <div className="bullet-dot" />
                <p>
                  <strong>Economics:</strong> Where is telemetry growth outpacing budget, and which
                  teams are feeling pressure now?
                </p>
              </div>
              <div className="bullet">
                <div className="bullet-dot" />
                <p>
                  <strong>Operations:</strong> Which workflows are delayed because teams cannot find
                  or trust the right data quickly?
                </p>
              </div>
              <div className="bullet">
                <div className="bullet-dot" />
                <p>
                  <strong>Governance:</strong> Who owns routing, retention, and access policy
                  decisions across the estate?
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="quote-grid" style={{ marginTop: "16px" }}>
          <div className="quote">
            <strong>Operator-level language</strong>
            <p>
              &quot;Let&apos;s target one painful pipeline first. If we can reduce noise, cut
              waste, and speed investigations in that workflow, we will have a repeatable model for
              broader rollout.&quot;
            </p>
          </div>
          <div className="quote">
            <strong>Executive-level language</strong>
            <p>
              &quot;This is not another tool conversation. It is a control-layer decision that can
              lower telemetry cost, improve risk response, and create long-term flexibility across
              your data stack.&quot;
            </p>
          </div>
        </div>
      </section>

      <div className="footer">
        David Gutshall - Cribl enterprise territory plan - built for interview presentation and
        strategic account discussion.
      </div>
    </div>
  );
}
