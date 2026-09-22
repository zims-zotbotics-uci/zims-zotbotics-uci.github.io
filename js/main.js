// Site-wide interactivity: mobile nav toggle, hover/click dropdown,
// current-page highlighting, and the event photo carousels.
(function () {
  function initHeader() {
    const toggle = document.getElementById("navToggle");
    const menu = document.getElementById("navMenu");
    if (toggle && menu) {
      toggle.addEventListener("click", () => {
        const isOpen = menu.classList.toggle("mobile-open");
        toggle.setAttribute("aria-expanded", String(isOpen));
      });
    }

    // Dropdown: hover on desktop, click/tap on touch + mobile menu
    document.querySelectorAll(".nav-item").forEach((item) => {
      const toggleLink = item.querySelector("[data-dropdown-toggle]");
      if (!toggleLink) return;

      let hoverTimer;
      item.addEventListener("mouseenter", () => {
        clearTimeout(hoverTimer);
        item.classList.add("open");
      });
      item.addEventListener("mouseleave", () => {
        hoverTimer = setTimeout(() => item.classList.remove("open"), 120);
      });
      toggleLink.addEventListener("click", (e) => {
        e.preventDefault();
        item.classList.toggle("open");
      });
      document.addEventListener("click", (e) => {
        if (!item.contains(e.target)) item.classList.remove("open");
      });
    });

    // Disabled nav items (e.g. Officers) don't go anywhere yet
    document.querySelectorAll(".nav-link.is-disabled").forEach((link) => {
      link.addEventListener("click", (e) => e.preventDefault());
    });

    // Highlight current page in the nav
    const path = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-link[href]").forEach((link) => {
      const href = link.getAttribute("href").split("#")[0];
      if (href && href === path) {
        link.closest(".nav-item").classList.add("current");
      }
    });
  }

  function initCarousels() {
    document.querySelectorAll("[data-carousel]").forEach((root) => {
      if (root.dataset.carouselReady) return; // never wire the same carousel twice
      root.dataset.carouselReady = "true";

      const track = root.querySelector(".carousel-track");
      const slides = Array.from(track.children);
      const dotsWrap = root.querySelector(".carousel-dots");
      let index = 0;
      let timer = null;
      let locked = false; // debounce: ignore a second call while one is settling

      slides.forEach((_, i) => {
        const dot = document.createElement("button");
        if (i === 0) dot.classList.add("active");
        dot.setAttribute("aria-label", "Go to photo " + (i + 1));
        dot.addEventListener("click", () => {
          goTo(i);
          restartAutoplay();
        });
        dotsWrap.appendChild(dot);
      });
      const dots = Array.from(dotsWrap.children);

      function goTo(i) {
        if (locked) return;
        locked = true;
        setTimeout(() => { locked = false; }, 350);
        index = (i + slides.length) % slides.length;
        track.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((d, di) => d.classList.toggle("active", di === index));
      }

      function stopAutoplay() {
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
      }
      function startAutoplay() {
        stopAutoplay();
        if (slides.length > 1) {
          timer = setInterval(() => goTo(index + 1), 5500);
        }
      }
      function restartAutoplay() {
        stopAutoplay();
        startAutoplay();
      }

      root.querySelector(".carousel-btn.prev").addEventListener("click", () => {
        goTo(index - 1);
        restartAutoplay();
      });
      root.querySelector(".carousel-btn.next").addEventListener("click", () => {
        goTo(index + 1);
        restartAutoplay();
      });

      // autoplay, pauses on hover/touch — always fully cleared before restarting
      // so hovering in/out (or tapping, on phones) repeatedly can never stack
      // multiple timers, which was the cause of the mobile skip-by-2 bug
      root.addEventListener("mouseenter", stopAutoplay);
      root.addEventListener("mouseleave", startAutoplay);
      root.addEventListener("touchstart", stopAutoplay, { passive: true });

      startAutoplay();
    });
  }

  document.addEventListener("chrome:mounted", initHeader);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCarousels);
  } else {
    initCarousels();
  }
})();
