// Injects the shared header and footer on every page, and marks the
// current page's nav item so it highlights correctly.
(function () {
  const ICON = "assets/zims-logo-mark.png";
  const ICON_MARK = "assets/zims-icon-transparent.png";
  const IG = "assets/instagram-logo-png-transparent-background.png";
  const LI = "assets/linkedin-logo.png";
  const DC = "assets/discord-logo.png";

  const NAV = [
    { label: "About", href: "index.html" },
    { label: "projects", href: "projects.html" },
    { label: "Makerspace", href: "makerspace.html" },
    { label: "Events", href: "events.html" },
    { label: "Officers", href: "#", disabled: true, title: "Coming soon" },
    {
      label: "Partnerships",
      dropdown: [
        { label: "Our Sponsors", href: "our-sponsors.html" },
        { label: "Our Network", href: "our-network.html" },
      ],
    },
  ];

  function navLinkHTML(item) {
    if (item.dropdown) {
      const links = item.dropdown
        .map((d) => `<a href="${d.href}">${d.label}</a>`)
        .join("");
      return `
        <div class="nav-item">
          <a href="#" class="nav-link" data-dropdown-toggle>
            ${item.label}
            <svg class="caret" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </a>
          <div class="dropdown">${links}</div>
        </div>`;
    }
    const disabledAttrs = item.disabled
      ? `aria-disabled="true" title="${item.title || "Coming soon"}"`
      : "";
    const cls = item.disabled ? "nav-link is-disabled" : "nav-link";
    return `<div class="nav-item"><a href="${item.href}" class="${cls}" ${disabledAttrs}>${item.label}</a></div>`;
  }

  const headerHTML = `
    <div class="menu-contents">
      <a href="index.html" class="logo-link">
        <img src="${ICON}" alt="ZIMS — ZOTbotics Introductory Makerspace" class="logo-full" />
      </a>
      <button class="nav-toggle" id="navToggle" aria-label="Toggle menu" aria-expanded="false">
        <svg viewBox="0 0 24 24" fill="none"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </button>
      <nav class="nav-menu" id="navMenu">
        ${NAV.map(navLinkHTML).join("")}
        <div class="nav-item"><a href="join-us.html" class="nav-link cta">Join Us!</a></div>
      </nav>
    </div>`;

  const footerHTML = `
    <div class="footer-row">
      <a href="index.html" class="footer-logo">
        <img src="${ICON}" alt="ZIMS logo" class="logo-full" style="height:56px; width:auto;" />
      </a>
      <p class="footer-copy">&copy; 2026 Zotbotics at UC Irvine. All rights reserved.</p>
      <div class="footer-social">
        <a href="https://www.linkedin.com/company/zotbotics-robotics-club-at-uci/" target="_blank" rel="noopener" aria-label="LinkedIn">
          <img src="${LI}" alt="LinkedIn" />
        </a>
        <a href="https://www.instagram.com/zims.uci" target="_blank" rel="noopener" aria-label="Instagram">
          <img src="${IG}" alt="Instagram" />
        </a>
        <a href="https://discord.gg/WxgaVfrqmv" target="_blank" rel="noopener" aria-label="Discord">
          <img src="${DC}" alt="Discord" />
        </a>
      </div>
    </div>`;

  function mount() {
    const headerEl = document.getElementById("site-header");
    const footerEl = document.getElementById("site-footer");
    if (headerEl) headerEl.innerHTML = headerHTML;
    if (footerEl) footerEl.innerHTML = footerHTML;
    document.dispatchEvent(new CustomEvent("chrome:mounted"));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
