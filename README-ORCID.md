<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Eric Spierings | Transplantation Immunology & Immunogenetics</title>
  <meta name="description" content="Professional profile of Eric Spierings, Associate Professor and medical immunologist at UMC Utrecht, working in transplantation immunology, immunogenetics, HLA diagnostics, epitope matching, and clinical implementation.">
  <meta name="theme-color" content="#005eb8">
  <meta property="og:title" content="Eric Spierings | Transplantation Immunology & Immunogenetics">
  <meta property="og:description" content="Diagnostics, immunogenetics, epitope-based matching, data standards, and clinical translation at UMC Utrecht.">
  <meta property="og:type" content="website">

  <style>
    :root {
      --umcu-blue: #005eb8;
      --umcu-blue-dark: #003b70;
      --umcu-blue-soft: #eaf4fb;
      --umcu-cyan: #00a6d6;
      --umcu-orange: #f28c28;
      --umcu-orange-soft: #fff2e5;
      --ink: #182230;
      --muted: #5d6876;
      --line: #d9e0e7;
      --soft: #f5f8fb;
      --white: #ffffff;
      --shadow: 0 16px 36px rgba(0, 59, 112, 0.09);
      --radius-lg: 24px;
      --radius-md: 14px;
      --max-width: 1180px;
    }

    * {
      box-sizing: border-box;
    }

    html {
      scroll-behavior: smooth;
    }

    body {
      margin: 0;
      color: var(--ink);
      background: var(--white);
      font-family: Arial, Helvetica, sans-serif;
      line-height: 1.58;
      -webkit-font-smoothing: antialiased;
    }

    a {
      color: inherit;
    }

    button,
    select {
      font: inherit;
    }

    .site-header {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(255, 255, 255, 0.96);
      border-bottom: 1px solid var(--line);
      backdrop-filter: blur(14px);
    }

    .nav-shell,
    .container {
      width: min(var(--max-width), calc(100% - 36px));
      margin: 0 auto;
    }

    .nav-shell {
      min-height: 72px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 28px;
    }

    .wordmark {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      color: var(--umcu-blue-dark);
    }

    .wordmark-mark {
      width: 44px;
      height: 44px;
      display: block;
      flex: 0 0 44px;
      border-radius: 12px;
      box-shadow: 0 5px 14px rgba(0, 59, 112, 0.18);
    }

    .wordmark-text strong {
      display: block;
      font-size: 0.98rem;
    }

    .wordmark-text span {
      display: block;
      color: var(--muted);
      font-size: 0.75rem;
    }

    .primary-nav {
      display: flex;
      align-items: center;
      gap: 24px;
    }

    .primary-nav a {
      color: var(--muted);
      text-decoration: none;
      font-size: 0.92rem;
      font-weight: 700;
    }

    .primary-nav a:hover,
    .primary-nav a:focus {
      color: var(--umcu-blue);
    }

    .hero {
      position: relative;
      overflow: hidden;
      background:
        linear-gradient(135deg, #ffffff 0%, #f1f7fc 56%, #e6f1f9 100%);
      border-bottom: 1px solid var(--line);
    }

    .hero::after {
      content: "";
      position: absolute;
      right: -180px;
      top: -200px;
      width: 520px;
      height: 520px;
      border-radius: 50%;
      background:
        radial-gradient(circle at 50% 50%, rgba(0, 94, 184, 0.13), rgba(0, 166, 214, 0.04) 58%, transparent 72%);
      pointer-events: none;
    }

    .hero-inner {
      position: relative;
      z-index: 1;
      display: grid;
      grid-template-columns: minmax(0, 1fr) 320px;
      gap: 64px;
      align-items: center;
      min-height: 640px;
      padding: 74px 0 62px;
    }

    .hero-kicker {
      margin: 0 0 20px;
      color: var(--umcu-orange);
      font-size: 0.82rem;
      font-weight: 800;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }

    .hero-name {
      margin: 0;
      color: var(--umcu-blue-dark);
      font-size: clamp(3.2rem, 7vw, 6.7rem);
      font-weight: 800;
      letter-spacing: -0.055em;
      line-height: 0.9;
    }

    .hero-name span {
      display: block;
    }

    .hero-role {
      max-width: 780px;
      margin: 26px 0 0;
      color: var(--ink);
      font-size: clamp(1.2rem, 2.1vw, 1.75rem);
      line-height: 1.32;
    }

    .hero-summary {
      max-width: 790px;
      margin: 20px 0 0;
      color: var(--muted);
      font-size: 1.03rem;
    }

    .hero-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 30px;
    }

    .button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 44px;
      padding: 10px 17px;
      border: 1px solid var(--umcu-blue);
      border-radius: 999px;
      text-decoration: none;
      font-weight: 800;
      transition: transform 0.16s ease, box-shadow 0.16s ease, background 0.16s ease;
    }

    .button:hover {
      transform: translateY(-1px);
    }

    .button-primary {
      color: white;
      background: var(--umcu-blue);
      box-shadow: 0 8px 22px rgba(0, 94, 184, 0.17);
    }

    .button-secondary {
      color: var(--umcu-blue);
      background: white;
    }

    .portrait-card {
      position: relative;
      padding: 12px;
      border: 1px solid rgba(0, 94, 184, 0.18);
      border-radius: 30px;
      background: rgba(255, 255, 255, 0.9);
      box-shadow: var(--shadow);
    }

    .portrait-card::before {
      content: "";
      position: absolute;
      left: -10px;
      bottom: 38px;
      width: 10px;
      height: 92px;
      background: var(--umcu-orange);
      border-radius: 10px 0 0 10px;
    }

    .portrait-card img {
      display: block;
      width: 100%;
      aspect-ratio: 1 / 1;
      object-fit: cover;
      border-radius: 21px;
      background: #dce9f4;
    }

    .portrait-caption {
      padding: 14px 8px 4px;
    }

    .portrait-caption strong {
      display: block;
      color: var(--umcu-blue-dark);
      font-size: 0.94rem;
    }

    .portrait-caption span {
      color: var(--muted);
      font-size: 0.8rem;
    }

    main {
      overflow: hidden;
    }

    .section {
      padding: 84px 0;
      scroll-margin-top: 82px;
    }

    .section-alt {
      background: var(--soft);
      border-top: 1px solid var(--line);
      border-bottom: 1px solid var(--line);
    }

    .section-head {
      display: grid;
      grid-template-columns: 260px minmax(0, 1fr);
      gap: 38px;
      align-items: start;
      margin-bottom: 34px;
    }

    .section-label {
      margin: 3px 0 0;
      color: var(--umcu-orange);
      font-size: 0.78rem;
      font-weight: 800;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }

    .section-head h2 {
      max-width: 820px;
      margin: 0;
      color: var(--umcu-blue-dark);
      font-size: clamp(2rem, 4vw, 3.35rem);
      letter-spacing: -0.035em;
      line-height: 1.08;
    }

    .section-intro {
      max-width: 850px;
      margin: 16px 0 0;
      color: var(--muted);
      font-size: 1.02rem;
    }

    .profile-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.35fr) minmax(280px, 0.65fr);
      gap: 24px;
    }

    .panel {
      border: 1px solid var(--line);
      border-radius: var(--radius-lg);
      background: white;
      box-shadow: var(--shadow);
    }

    .panel-body {
      padding: 30px;
    }

    .panel-title {
      margin: 0 0 12px;
      color: var(--umcu-blue-dark);
      font-size: 1.22rem;
    }

    .panel p:last-child {
      margin-bottom: 0;
    }

    .mission {
      position: relative;
      padding-left: 28px;
      color: var(--umcu-blue-dark);
      font-size: 1.16rem;
      font-weight: 700;
    }

    .mission::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0.12em;
      bottom: 0.12em;
      width: 5px;
      border-radius: 5px;
      background: var(--umcu-orange);
    }

    .fact-list {
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .fact-list li {
      padding: 15px 0;
      border-bottom: 1px solid var(--line);
    }

    .fact-list li:first-child {
      padding-top: 0;
    }

    .fact-list li:last-child {
      padding-bottom: 0;
      border-bottom: 0;
    }

    .fact-list strong {
      display: block;
      color: var(--umcu-blue-dark);
      font-size: 0.92rem;
    }

    .fact-list span {
      color: var(--muted);
      font-size: 0.92rem;
    }

    .focus-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 18px;
    }

    .focus-card {
      min-height: 310px;
      padding: 26px;
      border: 1px solid var(--line);
      border-radius: var(--radius-lg);
      background: white;
      box-shadow: var(--shadow);
      scroll-margin-top: 92px;
    }


    .focus-figure {
      height: 132px;
      margin: -4px -4px 24px;
      display: grid;
      place-items: center;
      border-radius: 18px;
      background:
        linear-gradient(145deg, rgba(234, 244, 251, 0.95), rgba(255, 255, 255, 0.96));
      border: 1px solid rgba(0, 94, 184, 0.11);
      overflow: hidden;
    }

    .focus-figure svg {
      width: 100%;
      height: 100%;
      display: block;
    }

    .focus-card h3 {
      margin-top: 0;
    }

    .figure-blue {
      stroke: var(--umcu-blue);
    }

    .figure-dark {
      stroke: var(--umcu-blue-dark);
    }

    .figure-orange {
      stroke: var(--umcu-orange);
    }

    .figure-cyan {
      stroke: var(--umcu-cyan);
    }

    .focus-number {
      color: var(--umcu-orange);
      font-size: 0.76rem;
      font-weight: 800;
      letter-spacing: 0.13em;
    }

    .focus-card h3 {
      margin: 54px 0 14px;
      color: var(--umcu-blue-dark);
      font-size: 1.3rem;
      line-height: 1.18;
    }

    .focus-card p {
      margin: 0;
      color: var(--muted);
      font-size: 0.95rem;
    }

    .roles-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 20px;
    }

    .role-card {
      display: grid;
      grid-template-columns: 86px minmax(0, 1fr);
      gap: 18px;
      padding: 24px;
      border: 1px solid var(--line);
      border-radius: var(--radius-md);
      background: white;
    }

    .role-icon {
      width: 68px;
      height: 68px;
      display: grid;
      place-items: center;
      border-radius: 18px;
      color: white;
      background: var(--umcu-blue);
      font-size: 1.05rem;
      font-weight: 800;
    }

    .role-card h3 {
      margin: 0 0 5px;
      color: var(--umcu-blue-dark);
      font-size: 1.08rem;
    }

    .role-card p {
      margin: 0;
      color: var(--muted);
      font-size: 0.93rem;
    }

    .output-toolbar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px;
      margin-bottom: 26px;
    }

    .filter-button {
      padding: 9px 14px;
      border: 1px solid var(--line);
      border-radius: 999px;
      color: var(--muted);
      background: white;
      cursor: pointer;
      font-weight: 700;
    }

    .filter-button:hover,
    .filter-button.active {
      color: white;
      border-color: var(--umcu-blue);
      background: var(--umcu-blue);
    }

    .publication-list {
      display: grid;
      gap: 14px;
    }

    .publication {
      display: grid;
      grid-template-columns: 110px minmax(0, 1fr) 130px;
      gap: 20px;
      align-items: start;
      padding: 24px;
      border: 1px solid var(--line);
      border-radius: var(--radius-md);
      background: white;
      transition: transform 0.16s ease, box-shadow 0.16s ease;
    }

    .publication:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow);
    }

    .publication-year {
      color: var(--umcu-orange);
      font-size: 1.32rem;
      font-weight: 800;
    }

    .publication h3 {
      margin: 0 0 7px;
      color: var(--umcu-blue-dark);
      font-size: 1.06rem;
      line-height: 1.35;
    }

    .publication-meta {
      margin: 0;
      color: var(--muted);
      font-size: 0.91rem;
    }

    .publication-tag {
      justify-self: end;
      padding: 6px 9px;
      border-radius: 999px;
      color: var(--umcu-blue-dark);
      background: var(--umcu-blue-soft);
      font-size: 0.75rem;
      font-weight: 800;
      text-align: center;
    }

    .timeline {
      position: relative;
      margin-left: 10px;
      padding-left: 34px;
      border-left: 2px solid #c9d8e6;
    }

    .timeline-item {
      position: relative;
      padding: 0 0 30px;
    }

    .timeline-item:last-child {
      padding-bottom: 0;
    }

    .timeline-item::before {
      content: "";
      position: absolute;
      left: -43px;
      top: 4px;
      width: 16px;
      height: 16px;
      border: 4px solid white;
      border-radius: 50%;
      background: var(--umcu-orange);
      box-shadow: 0 0 0 1px var(--umcu-orange);
    }

    .timeline-time {
      color: var(--umcu-orange);
      font-size: 0.78rem;
      font-weight: 800;
      letter-spacing: 0.09em;
      text-transform: uppercase;
    }

    .timeline-item h3 {
      margin: 5px 0 4px;
      color: var(--umcu-blue-dark);
      font-size: 1.08rem;
    }

    .timeline-item p {
      max-width: 800px;
      margin: 0;
      color: var(--muted);
    }

    .contact-band {
      color: white;
      background: var(--umcu-blue-dark);
    }

    .contact-band .section-label {
      color: #ffad5b;
    }

    .contact-band .section-head h2,
    .contact-band .section-intro {
      color: white;
    }

    .contact-links {
      display: flex;
      flex-wrap: wrap;
      gap: 14px;
    }

    .contact-link {
      min-width: 220px;
      padding: 16px 18px;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: var(--radius-md);
      color: white;
      text-decoration: none;
      background: rgba(255, 255, 255, 0.06);
    }

    .contact-link strong,
    .contact-link span {
      display: block;
    }

    .contact-link strong {
      font-size: 0.84rem;
    }

    .contact-link span {
      margin-top: 3px;
      color: rgba(255, 255, 255, 0.78);
      font-size: 0.9rem;
    }

    .site-footer {
      background: #052d50;
      color: rgba(255, 255, 255, 0.72);
    }

    .footer-inner {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
      padding: 20px 0;
      font-size: 0.85rem;
    }

    .hidden-publication {
      display: none;
    }

    .orcid-status {
      margin: 0 0 20px;
      padding: 12px 15px;
      border: 1px solid var(--line);
      border-radius: 12px;
      color: var(--muted);
      background: rgba(255, 255, 255, 0.72);
      font-size: 0.9rem;
    }

    .orcid-status strong {
      color: var(--umcu-blue-dark);
    }

    .orcid-status.error {
      border-color: rgba(242, 140, 40, 0.45);
      background: var(--umcu-orange-soft);
    }

    .publication.key-publication {
      border-left: 5px solid var(--umcu-orange);
    }

    .publication-key {
      display: inline-block;
      margin-bottom: 7px;
      color: var(--umcu-orange);
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    .publication-link {
      color: var(--umcu-blue);
      text-decoration: none;
    }

    .publication-link:hover {
      text-decoration: underline;
    }

    .publication-count {
      margin-left: auto;
      color: var(--muted);
      font-size: 0.86rem;
    }

    .view-button {
      padding: 9px 14px;
      border: 1px solid var(--umcu-orange);
      border-radius: 999px;
      color: var(--umcu-orange);
      background: white;
      cursor: pointer;
      font-weight: 800;
    }

    .view-button.active,
    .view-button:hover {
      color: white;
      background: var(--umcu-orange);
    }

    .publication-if {
      margin-top: 7px;
      color: var(--muted);
      font-size: 0.78rem;
    }

    .publication-if strong {
      color: var(--umcu-blue-dark);
    }

    .publication.key-publication {
      border-left: 5px solid var(--umcu-orange);
    }

    .publication-key {
      display: inline-block;
      margin-bottom: 7px;
      color: var(--umcu-orange);
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    .publication-link {
      color: var(--umcu-blue);
      text-decoration: none;
    }

    .publication-link:hover {
      text-decoration: underline;
    }

    .publication-count {
      margin-left: auto;
      color: var(--muted);
      font-size: 0.86rem;
    }

    .view-button {
      padding: 9px 14px;
      border: 1px solid var(--umcu-orange);
      border-radius: 999px;
      color: var(--umcu-orange);
      background: white;
      cursor: pointer;
      font-weight: 800;
    }

    .view-button.active,
    .view-button:hover {
      color: white;
      background: var(--umcu-orange);
    }

    @media (max-width: 1040px) {
      .focus-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 860px) {
      .primary-nav {
        display: none;
      }

      .hero-inner,
      .section-head,
      .profile-grid {
        grid-template-columns: 1fr;
      }

      .hero-inner {
        min-height: auto;
        gap: 36px;
      }

      .portrait-card {
        max-width: 300px;
      }

      .section-head {
        gap: 8px;
      }

      .roles-grid {
        grid-template-columns: 1fr;
      }

      .publication {
        grid-template-columns: 84px minmax(0, 1fr);
      }

      .publication-tag {
        grid-column: 2;
        justify-self: start;
      }
    }

    @media (max-width: 620px) {
      .hero-inner {
        padding: 54px 0 44px;
      }

      .section {
        padding: 62px 0;
      }

      .focus-grid {
        grid-template-columns: 1fr;
      }

      .focus-card {
        min-height: 0;
      }

      .focus-card h3 {
        margin-top: 28px;
      }

      .role-card {
        grid-template-columns: 1fr;
      }

      .publication {
        grid-template-columns: 1fr;
      }

      .publication-tag {
        grid-column: auto;
      }

      .hero-name {
        font-size: clamp(3rem, 20vw, 5.5rem);
      }
    }
  </style>
</head>

<body>
  <header class="site-header">
    <div class="nav-shell">
      <a class="wordmark" href="#top" aria-label="Back to top">
        <img class="wordmark-mark" src="hla-logo.png" alt="Stylized HLA molecule with peptide">
        <span class="wordmark-text">
          <strong>Eric Spierings</strong>
          <span>Transplantation Immunology</span>
        </span>
      </a>

      <nav class="primary-nav" aria-label="Main navigation">
        <a href="#profile">Profile</a>
        <a href="#focus">Focus</a>
        <a href="#roles">Roles</a>
        <a href="#publications">Publications</a>
        <a href="#career">Career</a>
        <a href="#contact">Contact</a>
      </nav>
    </div>
  </header>

  <section class="hero" id="top">
    <div class="container hero-inner">
      <div>
        <p class="hero-kicker">Associate Professor · Medical Immunologist</p>
        <h1 class="hero-name">
          <span>Eric</span>
          <span>Spierings</span>
        </h1>

        <p class="hero-role">
          Advancing transplantation through immunogenetic matching, diagnostic innovation, and clinically implementable data.
        </p>

        <p class="hero-summary">
          Based at UMC Utrecht, I connect accredited transplantation diagnostics with research on HLA compatibility, indirect T-cell epitope recognition, donor-specific antibodies, immune monitoring, and international data standards.
        </p>

        <div class="hero-actions">
          <a class="button button-primary" href="#profile">Explore profile</a>
          <a class="button button-secondary" href="#publications">Selected publications</a>
        </div>
      </div>

      <aside class="portrait-card">
        <img src="profile.png" alt="Portrait of Eric Spierings">
        <div class="portrait-caption">
          <strong>UMC Utrecht</strong>
          <span>Central Diagnostic Laboratory<br>Center for Translational Immunology</span>
        </div>
      </aside>
    </div>
  </section>

  <main>
    <section class="section" id="profile">
      <div class="container">
        <div class="section-head">
          <p class="section-label">Profile</p>
          <div>
            <h2>Diagnostics, science, and implementation in one professional profile</h2>
            <p class="section-intro">
              I am an Associate Professor and medical immunologist at UMC Utrecht. I lead transplantation diagnostics within the Central Diagnostic Laboratory and work at the interface of routine care, translational immunology, immunogenetics, and clinical data innovation.
            </p>
          </div>
        </div>

        <div class="profile-grid">
          <article class="panel">
            <div class="panel-body">
              <p class="mission">
                My mission is to ensure that every transplant patient achieves the best possible outcome by embedding advanced immunogenetic matching and innovative diagnostics into daily clinical practice.
              </p>
              <p>
                My scientific work addresses how donor-recipient immunogenetic differences shape allo-immunity and transplant outcome. This includes HLA typing, antibody diagnostics, indirect HLA epitope recognition, PIRCHE-based risk assessment, donor-specific antibodies, graft rejection, graft failure, and immune monitoring after transplantation.
              </p>
              <p>
                A consistent principle in my work is that novel analytical methods should move beyond proof of concept. They must be interpretable, technically robust, compatible with laboratory quality systems, and connected to clinical workflows.
              </p>
            </div>
          </article>

          <aside class="panel">
            <div class="panel-body">
              <h3 class="panel-title">Current base</h3>
              <ul class="fact-list">
                <li>
                  <strong>UMC Utrecht</strong>
                  <span>Central Diagnostic Laboratory and Center for Translational Immunology</span>
                </li>
                <li>
                  <strong>Primary function</strong>
                  <span>Medical immunologist and Director Transplantation Diagnostics</span>
                </li>
                <li>
                  <strong>Research environment</strong>
                  <span>Transplantation immunology, immunogenetics, and clinical implementation</span>
                </li>
                <li>
                  <strong>ORCID</strong>
                  <span>0000-0001-9441-1019</span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <section class="section section-alt" id="focus">
      <div class="container">
        <div class="section-head">
          <p class="section-label">Scientific focus</p>
          <div>
            <h2>Four connected fields of work</h2>
            <p class="section-intro">
              My focus combines high-quality transplantation diagnostics with mechanistic research, computational matching, and implementation into clinical and laboratory systems.
            </p>
          </div>
        </div>

        <div class="focus-grid">
          <article class="focus-card" id="hla-diagnostics">

            <div class="focus-figure" aria-hidden="true">
              <svg viewBox="0 0 320 132" xmlns="http://www.w3.org/2000/svg">
                <rect width="320" height="132" fill="#f7fbfe"/>
                <g fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M86 32c0-11 9-20 20-20h25c10 0 17 7 17 17v22h-39c-13 0-23-7-23-19Z" class="figure-blue" stroke-width="5"/>
                  <path d="M234 32c0-11-9-20-20-20h-25c-10 0-17 7-17 17v22h39c13 0 23-7 23-19Z" class="figure-blue" stroke-width="5"/>
                  <path d="M112 47c14 13 29 19 48 19s34-6 48-19" class="figure-dark" stroke-width="5"/>
                  <path d="M117 43c15-7 29-10 43-10s28 3 43 10" class="figure-orange" stroke-width="8"/>
                  <path d="M125 68v22c0 13 10 23 23 23h24c13 0 23-10 23-23V68" class="figure-blue" stroke-width="5"/>
                  <path d="M160 113v13" class="figure-dark" stroke-width="5"/>
                  <path d="M91 76c0-9 7-16 16-16h11v39h-11c-9 0-16-7-16-16V76Z" class="figure-cyan" stroke-width="4"/>
                </g>
                <circle cx="58" cy="32" r="7" fill="#f28c28" opacity=".8"/>
                <circle cx="268" cy="92" r="10" fill="#00a6d6" opacity=".22"/>
                <circle cx="280" cy="32" r="5" fill="#005eb8" opacity=".25"/>
              </svg>
            </div>
            <span class="focus-number">01</span>
            <h3>HLA diagnostics</h3>
            <p>
              I lead accredited HLA typing and antibody diagnostics, including clinical interpretation, donor-recipient compatibility assessment, donor-specific antibody evaluation, and direct consultation with transplant teams.
            </p>
          </article>

          <article class="focus-card" id="epitope-matching">

            <div class="focus-figure" aria-hidden="true">
              <svg viewBox="0 0 320 132" xmlns="http://www.w3.org/2000/svg">
                <rect width="320" height="132" fill="#f7fbfe"/>
                <g fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M45 82c25-42 48-58 77-48 18 6 27 20 48 18 25-2 31-25 56-27 19-2 36 8 49 30" class="figure-blue" stroke-width="6"/>
                  <path d="M49 92c28-21 50-27 76-19 19 6 32 17 51 17 24 0 38-15 57-16 18-1 30 5 42 16" class="figure-cyan" stroke-width="4"/>
                  <path d="M89 55l17-8 18 8 16-9 18 9 17-8 18 8" class="figure-orange" stroke-width="7"/>
                  <path d="M88 104h144" class="figure-dark" stroke-width="3"/>
                </g>
                <g fill="#f28c28">
                  <circle cx="89" cy="55" r="5"/>
                  <circle cx="106" cy="47" r="5"/>
                  <circle cx="124" cy="55" r="5"/>
                  <circle cx="140" cy="46" r="5"/>
                  <circle cx="158" cy="55" r="5"/>
                  <circle cx="175" cy="47" r="5"/>
                  <circle cx="193" cy="55" r="5"/>
                </g>
                <g fill="#005eb8" opacity=".16">
                  <circle cx="40" cy="33" r="11"/>
                  <circle cx="275" cy="38" r="15"/>
                  <circle cx="252" cy="107" r="8"/>
                </g>
              </svg>
            </div>
            <span class="focus-number">02</span>
            <h3>Epitope matching</h3>
            <p>
              I quantify immunological compatibility through indirect T-cell epitope recognition, PIRCHE-II, B-cell epitope concepts, and combined risk models for rejection and graft outcome.
            </p>
          </article>

          <article class="focus-card" id="data-standards">

            <div class="focus-figure" aria-hidden="true">
              <svg viewBox="0 0 320 132" xmlns="http://www.w3.org/2000/svg">
                <rect width="320" height="132" fill="#f7fbfe"/>
                <g fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="42" y="29" width="97" height="69" rx="9" class="figure-blue" stroke-width="5"/>
                  <path d="M66 52h50M66 66h38M66 80h57" class="figure-cyan" stroke-width="4"/>
                  <path d="M139 64h39" class="figure-orange" stroke-width="5"/>
                  <path d="M178 64l-10-8M178 64l-10 8" class="figure-orange" stroke-width="5"/>
                  <ellipse cx="230" cy="42" rx="42" ry="12" class="figure-dark" stroke-width="5"/>
                  <path d="M188 42v45c0 7 19 13 42 13s42-6 42-13V42" class="figure-dark" stroke-width="5"/>
                  <path d="M188 64c0 7 19 13 42 13s42-6 42-13M188 84c0 7 19 13 42 13s42-6 42-13" class="figure-dark" stroke-width="4"/>
                </g>
                <g fill="#f28c28">
                  <circle cx="157" cy="64" r="5"/>
                  <circle cx="176" cy="64" r="5"/>
                </g>
              </svg>
            </div>
            <span class="focus-number">03</span>
            <h3>Data standards</h3>
            <p>
              I develop interoperable representations for HLA and antibody data, including GL String, HML, HAML, and related structures that support reproducible exchange between laboratories, registries, software, and research systems.
            </p>
          </article>

          <article class="focus-card" id="clinical-implementation">

            <div class="focus-figure" aria-hidden="true">
              <svg viewBox="0 0 320 132" xmlns="http://www.w3.org/2000/svg">
                <rect width="320" height="132" fill="#f7fbfe"/>
                <g fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="87" cy="42" r="18" class="figure-blue" stroke-width="5"/>
                  <path d="M54 101c3-26 15-39 33-39s30 13 33 39" class="figure-blue" stroke-width="5"/>
                  <circle cx="224" cy="42" r="18" class="figure-cyan" stroke-width="5"/>
                  <path d="M191 101c3-26 15-39 33-39s30 13 33 39" class="figure-cyan" stroke-width="5"/>
                  <path d="M119 70h72" class="figure-orange" stroke-width="6"/>
                  <path d="M177 58l14 12-14 12" class="figure-orange" stroke-width="6"/>
                  <rect x="130" y="28" width="48" height="27" rx="7" class="figure-dark" stroke-width="4"/>
                  <path d="M145 42h18M154 33v18" class="figure-dark" stroke-width="4"/>
                  <path d="M63 108h48M200 108h48" class="figure-dark" stroke-width="4"/>
                </g>
                <circle cx="154" cy="94" r="10" fill="#f28c28" opacity=".2"/>
              </svg>
            </div>
            <span class="focus-number">04</span>
            <h3>Clinical implementation</h3>
            <p>
              I translate assays, algorithms, and data models into validated workflows, interpretable reports, decision support, and infrastructure for routine transplantation care.
            </p>
          </article>
        </div>
      </div>
    </section>

    <section class="section" id="roles">
      <div class="container">
        <div class="section-head">
          <p class="section-label">Current roles</p>
          <div>
            <h2>Institutional and international responsibilities</h2>
            <p class="section-intro">
              My work links laboratory leadership at UMC Utrecht with scientific, educational, and standardization activities in international histocompatibility and immunogenetics networks.
            </p>
          </div>
        </div>

        <div class="roles-grid">
          <article class="role-card">
            <div class="role-icon">CDL</div>
            <div>
              <h3>Director Transplantation Diagnostics</h3>
              <p>I hold scientific and professional responsibility for HLA and transplantation diagnostics within the Central Diagnostic Laboratory at UMC Utrecht.</p>
            </div>
          </article>

          <article class="role-card">
            <div class="role-icon">UU</div>
            <div>
              <h3>Associate Professor</h3>
              <p>I conduct research, supervise researchers and students, teach, and contribute to academic development in transplantation immunology and immunogenetics.</p>
            </div>
          </article>

          <article class="role-card">
            <div class="role-icon">EFI</div>
            <div>
              <h3>EFI Scientific Committee and BITCom</h3>
              <p>I am a member of the EFI Scientific Committee and founding chair of the Bioinformatics and Information Technology Committee.</p>
            </div>
          </article>

          <article class="role-card">
            <div class="role-icon">M</div>
            <div>
              <h3>Secondment at Matchis</h3>
              <p>Through my secondment at Matchis, I strengthen the connection between donor registry practice, HLA expertise, research development, and implementation of improved matching strategies.</p>
            </div>
          </article>

          <article class="role-card">
            <div class="role-icon">TCU</div>
            <div>
              <h3>Diagnostics ambassador</h3>
              <p>As diagnostics ambassador within the Transplantation Center Utrecht, I connect laboratory disciplines with care, research, innovation, and education.</p>
            </div>
          </article>

          <article class="role-card">
            <div class="role-icon">AI</div>
            <div>
              <h3>Data-driven diagnostics and AI</h3>
              <p>I lead CDL-wide development in data-driven working and artificial intelligence, including operational dashboards, workflow analytics, and diagnostic decision support.</p>
            </div>
          </article>
        </div>
      </div>
    </section>


    <section class="section section-alt" id="publications">
      <div class="container">
        <div class="section-head">
          <p class="section-label">Academic output</p>
          <div>
            <h2>Selected and complete publication overview</h2>
            <p class="section-intro">
              Key publications are shown first. The controls below allow switching to the broader selection or filtering by scientific category. Bibliographic details and author order were checked against the ORCID record and primary publication records.
            </p>
          </div>
        </div>

        <div class="output-toolbar" role="group" aria-label="Publication display controls">
          <button class="view-button active" data-view="key">Key publications</button>
          <button class="view-button" data-view="all">All listed publications</button>

          <button class="filter-button active" data-filter="all">All categories</button>
          <button class="filter-button" data-filter="matching">Epitope matching</button>
          <button class="filter-button" data-filter="outcome">Transplant outcome</button>
          <button class="filter-button" data-filter="diagnostics">Diagnostics</button>
          <button class="filter-button" data-filter="standards">Standards</button>
          <button class="filter-button" data-filter="cellular">Cellular immunology</button>

          <span class="publication-count" id="publication-count"></span>
        </div>

        <div class="publication-list">
          <article class="publication key-publication" data-key="true" data-category="matching outcome">
            <div class="publication-year">2025</div>
            <div>
              <span class="publication-key">Key publication</span>
              <h3>Advancing risk stratification in kidney transplantation: integrating HLA-derived T-cell epitope and B-cell epitope matching algorithms for enhanced predictive accuracy of HLA compatibility</h3>
              <p class="publication-meta">Niemann M, Matern BM, Gupta G, Tanriover B, Halleck F, Budde K, Spierings E. <em>Frontiers in Immunology</em>. 2025;16:1548934. PMID: 40007544.</p>
            </div>
            <div class="publication-tag">Matching</div>
          </article>

          <article class="publication key-publication" data-key="true" data-category="matching outcome">
            <div class="publication-year">2022</div>
            <div>
              <span class="publication-key">Key publication</span>
              <h3>The number of donor HLA-derived T cell epitopes available for indirect antigen presentation determines the risk for vascular rejection after kidney transplantation</h3>
              <p class="publication-meta">Betjes MGH, Peereboom ETM, Otten HG, Spierings E. <em>Frontiers in Immunology</em>. 2022;13:973968.</p>
            </div>
            <div class="publication-tag">Outcome</div>
          </article>

          <article class="publication key-publication" data-key="true" data-category="matching outcome">
            <div class="publication-year">2021</div>
            <div>
              <span class="publication-key">Key publication</span>
              <h3>T-Cell Epitopes Shared Between Immunizing HLA and Donor HLA Associate With Graft Failure After Kidney Transplantation</h3>
              <p class="publication-meta">Peereboom ETM, Matern BM, Tomosugi T, Niemann M, and colleagues, including Spierings E. <em>Frontiers in Immunology</em>. 2021;12:784040. PMID: 34868064.</p>
            </div>
            <div class="publication-tag">Outcome</div>
          </article>

          <article class="publication key-publication" data-key="true" data-category="matching outcome">
            <div class="publication-year">2018</div>
            <div>
              <span class="publication-key">Key publication</span>
              <h3>PIRCHE-II Is Related to Graft Failure after Kidney Transplantation</h3>
              <p class="publication-meta">Geneugelijk K, Niemann M, Drylewicz J, van Zuilen AD, Joosten I, Allebes WA, van der Meer A, Hilbrands LB, Baas MC, Hack CE, van Reekum FE, Verhaar MC, Kamburova EG, Bots ML, Seelen MAJ, Sanders JS, Hepkema BG, Lambeck AJ, Bungener LB, Roozendaal C, Tilanus MGJ, Vanderlocht J, Voorter CEM, Wieten L, van Duijnhoven EM, Gelens M, Christiaans MHL, van Ittersum FJ, Nurmohamed A, Lardy JNML, Swelsen W, van der Pant KA, van der Weerd NC, ten Berge IJM, Bemelman FJ, Hoitsma A, van der Boog PJM, de Fijter JW, Betjes MGH, Heidt S, Roelen DL, Claas FHJ, Otten HG, Spierings E. <em>Frontiers in Immunology</em>. 2018;9:321. PMID: 29556227.</p>
            </div>
            <div class="publication-tag">PIRCHE-II</div>
          </article>

          <article class="publication key-publication" data-key="true" data-category="matching outcome">
            <div class="publication-year">2020</div>
            <div>
              <span class="publication-key">Key publication</span>
              <h3>PIRCHE-II: an algorithm to predict indirectly recognizable HLA epitopes in solid organ transplantation</h3>
              <p class="publication-meta">Geneugelijk K, Spierings E. <em>Immunogenetics</em>. 2020;72(1-2):119-129. DOI: 10.1007/s00251-019-01140-x.</p>
            </div>
            <div class="publication-tag">Review</div>
          </article>

          <article class="publication key-publication" data-key="true" data-category="standards">
            <div class="publication-year">2026</div>
            <div>
              <span class="publication-key">Key publication</span>
              <h3>Recommendations for HLA Genotyping Data Standards and Clinical Laboratory Staffing Considerations</h3>
              <p class="publication-meta">Spierings E, Brown NK, Latham K, Robinson J, Melchers M, Askar M, Morris GP, Weimer E, Maiers M, Madbouly A. <em>HLA</em>. 2026;107(4):e70725. DOI: 10.1111/tan.70725.</p>
            </div>
            <div class="publication-tag">Standards</div>
          </article>

          <article class="publication" data-key="false" data-category="matching outcome">
            <div class="publication-year">2024</div>
            <div>
              <h3>Paternal HLA-Derived Epitopes and Live Birth in Secondary Recurrent Pregnancy Loss: New Insights From a Clinical Trial</h3>
              <p class="publication-meta">Krog MC, Peereboom ETM, Geneugelijk K, Matern BM, Kolte AM, Christiansen OB, Steffensen R, Nielsen HS, Spierings E. <em>HLA</em>. 2024;104(4):e15723. DOI: 10.1111/tan.15723.</p>
            </div>
            <div class="publication-tag">Matching</div>
          </article>

          <article class="publication" data-key="false" data-category="cellular diagnostics">
            <div class="publication-year">2022</div>
            <div>
              <h3>The Value of Single-cell Technologies in Solid Organ Transplantation Studies</h3>
              <p class="publication-meta">Peereboom ETM, Matern BM, Spierings E, Geneugelijk K. <em>Transplantation</em>. 2022;106(12):2325-2337. DOI: 10.1097/TP.0000000000004237.</p>
            </div>
            <div class="publication-tag">Single cell</div>
          </article>

          <article class="publication" data-key="false" data-category="diagnostics outcome">
            <div class="publication-year">2018</div>
            <div>
              <h3>Development and Validation of a Multiplex Non-HLA Antibody Assay for the Screening of Kidney Transplant Recipients</h3>
              <p class="publication-meta">Kamburova EG, Kardol-Hoefnagel T, Wisse BW, Joosten I, Allebes WA, van der Meer A, Hilbrands LB, Baas MC, Spierings E, and colleagues. <em>Frontiers in Immunology</em>. 2018;9.</p>
            </div>
            <div class="publication-tag">Antibodies</div>
          </article>

          <article class="publication" data-key="false" data-category="diagnostics">
            <div class="publication-year">2019</div>
            <div>
              <h3>HLA-DQ Typing Kits in Diagnosis and Screening for Celiac Disease</h3>
              <p class="publication-meta">Rouvroye MD, van Zijtveld S, Bonnet P, Spierings E, Bontkes HJ. <em>Genetic Testing and Molecular Biomarkers</em>. 2019;23(6):418-422. DOI: 10.1089/gtmb.2018.0329.</p>
            </div>
            <div class="publication-tag">Diagnostics</div>
          </article>

          <article class="publication" data-key="false" data-category="cellular">
            <div class="publication-year">2009</div>
            <div>
              <h3>Steric hindrance and fast dissociation explain the lack of immunogenicity of the minor histocompatibility HA-1Arg null allele</h3>
              <p class="publication-meta">Spierings E, Gras S, Reiser JB, Mommaas B, Almekinders M, Kester MGD, Chouquet A, Le Gorrec M, Drijfhout JW, Ossendorp F, Housset D, Goulmy E.</p>
            </div>
            <div class="publication-tag">Minor H antigens</div>
          </article>

          <article class="publication" data-key="false" data-category="cellular outcome">
            <div class="publication-year">2006</div>
            <div>
              <h3>Matching of the minor histocompatibility antigen HLA-A1/H-Y may improve prognosis in corneal transplantation</h3>
              <p class="publication-meta">Böhringer D, Spierings E, Enczmann J, Böhringer S, Sundmacher R, Goulmy E, Reinhard T. <em>Transplantation</em>. 2006;82(8):1037-1041. DOI: 10.1097/01.tp.0000235908.54766.44.</p>
            </div>
            <div class="publication-tag">Minor H antigens</div>
          </article>

          <article class="publication" data-key="false" data-category="matching outcome">
            <div class="publication-year">2014</div>
            <div>
              <h3>Predicted indirectly recognizable HLA epitopes correlate with chronic graft-versus-host disease and relapse-related mortality in pediatric patients after cord blood transplantation</h3>
              <p class="publication-meta">Thus KA, Kesmir C, Borst E, de Weger RA, Boelens JJ, Spierings E.</p>
            </div>
            <div class="publication-tag">HSCT</div>
          </article>

          <article class="publication" data-key="false" data-category="diagnostics">
            <div class="publication-year">2022</div>
            <div>
              <h3>Genetics-first approach improves diagnostics of ESKD patients younger than 50 years</h3>
              <p class="publication-meta">Snoek R, van Jaarsveld RH, Nguyen TQ, Peters EDJ, Elferink MG, Ernst RF, Rookmaaker MB, Lilien MR, Spierings E, Goldschmeding R, Knoers NVAM, van der Zwaag B, van Zuilen AD, van Eerde AM. <em>Nephrology Dialysis Transplantation</em>. 2022;37(2).</p>
            </div>
            <div class="publication-tag">Diagnostics</div>
          </article>

          <article class="publication" data-key="false" data-category="matching standards">
            <div class="publication-year">2025</div>
            <div>
              <h3>Quantifying uncertainty of molecular mismatch introduced by mislabelled or imputed HLA genotypes</h3>
              <p class="publication-meta">Matern BM, Spierings E, Bandstra S, and colleagues.</p>
            </div>
            <div class="publication-tag">Molecular mismatch</div>
          </article>
        </div>

        <p class="section-intro" style="margin-top:24px;">
          The ORCID profile contains the complete publication record. <a class="publication-link" href="https://orcid.org/0000-0001-9441-1019" target="_blank" rel="noreferrer">View all works on ORCID</a>.
        </p>
      </div>
    </section>


    <section class="section" id="career">
      <div class="container">
        <div class="section-head">
          <p class="section-label">Career</p>
          <div>
            <h2>From molecular HLA typing to integrated transplantation diagnostics</h2>
          </div>
        </div>

        <div class="timeline">
          <article class="timeline-item">
            <div class="timeline-time">Current</div>
            <h3>UMC Utrecht</h3>
            <p>Associate Professor, medical immunologist, and Director Transplantation Diagnostics within the Central Diagnostic Laboratory.</p>
          </article>

          <article class="timeline-item">
            <div class="timeline-time">Academic development</div>
            <h3>Transplantation immunology and immunogenetics</h3>
            <p>I developed a research line integrating donor-recipient matching, PIRCHE, antibody risk, immune monitoring, computational models, and clinical implementation.</p>
          </article>

          <article class="timeline-item">
            <div class="timeline-time">Postdoctoral period</div>
            <h3>Minor histocompatibility antigens</h3>
            <p>I conducted postdoctoral research in the laboratory of Els Goulmy, expanding my expertise from HLA into cellular allo-immunity and minor histocompatibility antigens.</p>
          </article>

          <article class="timeline-item">
            <div class="timeline-time">Education</div>
            <h3>Leiden University Medical Center</h3>
            <p>I completed an MSc in Biomedical Sciences and a PhD in Immunology. My first practical HLA experience was in 1992 through PCR-SSOP work with Marius Giphart.</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section contact-band" id="contact">
      <div class="container">
        <div class="section-head">
          <p class="section-label">Connect</p>
          <div>
            <h2>Professional profiles and contact</h2>
            <p class="section-intro">
              For scientific collaboration, transplantation diagnostics, standards, education, or international committee work.
            </p>
          </div>
        </div>

        <div class="contact-links">
          <a class="contact-link" href="https://orcid.org/0000-0001-9441-1019" target="_blank" rel="noreferrer">
            <strong>ORCID</strong>
            <span>0000-0001-9441-1019</span>
          </a>

          <div class="contact-link" role="group" aria-label="Email address">
            <strong>Email</strong>
            <span>e.spierings (a) umcutrecht.nl</span>
          </div>

          <a class="contact-link" href="#publications">
            <strong>Publications</strong>
            <span>View selected academic output</span>
          </a>
        </div>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container footer-inner">
      <span>© 2026 Eric Spierings</span>
      <span>Transplantation Immunology &amp; Immunogenetics</span>
    </div>
  </footer>

  <script>
    const PUBLICATION_DATA_URL = "publications.json";

    const state = {
      publications: [],
      view: "key",
      category: "all"
    };

    const listElement = document.getElementById("publication-list");
    const countElement = document.getElementById("publication-count");
    const statusElement = document.getElementById("orcid-status");
    const viewButtons = document.querySelectorAll(".view-button");
    const filterButtons = document.querySelectorAll(".filter-button");

    function escapeHtml(value) {
      return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
    }

    function formatAuthors(authors) {
      if (!Array.isArray(authors) || authors.length === 0) return "";
      return authors.map(escapeHtml).join(", ");
    }

    function publicationUrl(publication) {
      if (publication.doi) {
        return "https://doi.org/" + encodeURIComponent(publication.doi);
      }
      return publication.url || "";
    }

    function compareByDateDescending(a, b) {
      const dateA = a.sortDate || `${a.year || 0}-00-00`;
      const dateB = b.sortDate || `${b.year || 0}-00-00`;
      return dateB.localeCompare(dateA);
    }

    function compareKeyPublications(a, b) {
      const impactA = Number(a.impactFactor || 0);
      const impactB = Number(b.impactFactor || 0);

      if (impactB !== impactA) return impactB - impactA;
      return compareByDateDescending(a, b);
    }

    function visiblePublications() {
      const filtered = state.publications.filter((publication) => {
        const matchesView = state.view === "all" || publication.key === true;
        const categories = Array.isArray(publication.categories)
          ? publication.categories
          : ["other"];
        const matchesCategory =
          state.category === "all" || categories.includes(state.category);

        return matchesView && matchesCategory;
      });

      return filtered.sort(
        state.view === "key" ? compareKeyPublications : compareByDateDescending
      );
    }

    function renderPublications() {
      const publications = visiblePublications();

      countElement.textContent =
        publications.length +
        (publications.length === 1 ? " publication" : " publications");

      if (publications.length === 0) {
        listElement.innerHTML =
          '<div class="orcid-status">No publications match this selection.</div>';
        return;
      }

      listElement.innerHTML = publications.map((publication) => {
        const url = publicationUrl(publication);
        const title = escapeHtml(publication.title || "Untitled work");
        const linkedTitle = url
          ? `<a class="publication-link" href="${escapeHtml(url)}" target="_blank" rel="noreferrer">${title}</a>`
          : title;

        const authors = formatAuthors(publication.authors);
        const journal = escapeHtml(publication.journal || publication.typeLabel || "");
        const volumeIssue = escapeHtml(publication.volumeIssuePages || "");
        const metadata = [authors, journal, volumeIssue]
          .filter(Boolean)
          .join(". ");

        const impactFactor = publication.impactFactor
          ? `<div class="publication-if"><strong>Journal impact factor used for ordering:</strong> ${escapeHtml(publication.impactFactor)}</div>`
          : "";

        const keyLabel = publication.key
          ? '<span class="publication-key">Key publication</span>'
          : "";

        const categoryLabel = escapeHtml(
          publication.primaryCategoryLabel || "Other"
        );

        return `
          <article class="publication ${publication.key ? "key-publication" : ""}">
            <div class="publication-year">${escapeHtml(publication.year || "n.d.")}</div>
            <div>
              ${keyLabel}
              <h3>${linkedTitle}</h3>
              <p class="publication-meta">${metadata}</p>
              ${impactFactor}
            </div>
            <div class="publication-tag">${categoryLabel}</div>
          </article>
        `;
      }).join("");
    }

    async function loadPublications() {
      try {
        const response = await fetch(
          `${PUBLICATION_DATA_URL}?v=${Date.now()}`,
          { cache: "no-store" }
        );

        if (!response.ok) {
          throw new Error(`Publication dataset returned HTTP ${response.status}`);
        }

        const dataset = await response.json();
        state.publications = Array.isArray(dataset.publications)
          ? dataset.publications
          : [];

        statusElement.innerHTML =
          `<strong>${state.publications.length} ORCID works loaded.</strong> ` +
          `Dataset last refreshed ${escapeHtml(dataset.generatedAt || "at an unknown time")}.`;
        statusElement.classList.remove("error");

        renderPublications();
      } catch (error) {
        console.error(error);
        statusElement.innerHTML =
          "<strong>The ORCID dataset could not be loaded.</strong> " +
          "Run the GitHub Action once and confirm that publications.json exists in the repository root.";
        statusElement.classList.add("error");
        listElement.innerHTML = "";
        countElement.textContent = "";
      }
    }

    viewButtons.forEach((button) => {
      button.addEventListener("click", () => {
        state.view = button.dataset.view;
        viewButtons.forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        renderPublications();
      });
    });

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        state.category = button.dataset.filter;
        filterButtons.forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        renderPublications();
      });
    });

    loadPublications();
  </script>
</body>
</html>
