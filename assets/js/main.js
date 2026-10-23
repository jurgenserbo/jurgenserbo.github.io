// Shared chrome (header/footer) + interactions for every page.
(() => {
  const root = document.documentElement;
  const isHome = document.body.dataset.page === "home";

  const CONTACT = {
    email: "jurgen.serbo@live.com",
    linkedin: "https://www.linkedin.com/in/jurgenserbo",
    x: "https://x.com/jurgens377",
  };

  const icons = {
    moon: '<svg class="i-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
    sun: '<svg class="i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    next: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>',
    prev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 6-6 6 6 6"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  };

  // ---------- Header ----------
  const header = document.querySelector("[data-header]");
  if (header) {
    header.className = "site-header";
    header.innerHTML = `
      <div class="wrap site-header__inner">
        <nav aria-label="Contact">
          ${isHome ? "" : '<a href="index.html">Jurgen Serbo</a>'}
          <a href="mailto:${CONTACT.email}">Email</a>
          <a href="${CONTACT.linkedin}" target="_blank" rel="noopener">LinkedIn</a>
          <a href="${CONTACT.x}" target="_blank" rel="noopener">X</a>
        </nav>
        <button class="theme-toggle" type="button" aria-label="Switch color theme">${icons.moon}${icons.sun}<span data-theme-label></span></button>
      </div>`;
  }

  // ---------- Footer ----------
  const footer = document.querySelector("[data-footer]");
  if (footer) {
    footer.className = "site-footer";
    footer.id = "contact";
    footer.innerHTML = `
      <div class="wrap">
        <h2>Thanks for looking around. <span>Stay in touch.</span></h2>
        <div class="footer-links">
          <a class="text-link" href="mailto:${CONTACT.email}">${CONTACT.email}</a>
          <button class="text-link meta" type="button" data-copy="${CONTACT.email}">Copy email</button>
          <a class="text-link" href="${CONTACT.linkedin}" target="_blank" rel="noopener">LinkedIn</a>
          <a class="text-link" href="${CONTACT.x}" target="_blank" rel="noopener">X</a>
        </div>
        <div class="footer-bottom meta meta--sm">
          <span>© ${new Date().getFullYear()} Jurgen Serbo</span>
          <span>Tirana · <time data-clock>--:--</time></span>
        </div>
      </div>`;

    const copyBtn = footer.querySelector("[data-copy]");
    if (!navigator.clipboard) copyBtn.remove();
    else copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(copyBtn.dataset.copy);
        copyBtn.textContent = "Copied";
        setTimeout(() => (copyBtn.textContent = "Copy email"), 1600);
      } catch {}
    });
  }

  // ---------- Theme ----------
  const themeBtn = document.querySelector(".theme-toggle");
  const syncThemeLabel = () => {
    const label = themeBtn?.querySelector("[data-theme-label]");
    if (label) label.textContent = root.dataset.theme === "dark" ? "Light" : "Dark";
  };
  syncThemeLabel();
  themeBtn?.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    try { localStorage.setItem("theme", root.dataset.theme); } catch {}
    syncThemeLabel();
  });

  // ---------- Tirana clock ----------
  const clocks = document.querySelectorAll("[data-clock]");
  if (clocks.length) {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Tirane" });
    const tick = () => clocks.forEach((c) => (c.textContent = fmt.format(new Date())));
    tick();
    setInterval(tick, 15000);
  }

  // ---------- Fade in on scroll ----------
  const fades = document.querySelectorAll(".fade");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("is-in");
          io.unobserve(en.target);
        }
      }),
      { rootMargin: "0px 0px -6% 0px" }
    );
    fades.forEach((el) => io.observe(el));
  } else {
    fades.forEach((el) => el.classList.add("is-in"));
  }

  // ---------- Timeline: highlight the section in view, keep it visible in the bar ----------
  const timeline = document.querySelector(".timeline__scroller");
  if (timeline && "IntersectionObserver" in window) {
    const links = new Map([...timeline.querySelectorAll("a")].map((a) => [a.hash.slice(1), a]));
    const setActive = (id) => {
      links.forEach((a, key) => {
        const on = key === id;
        a.classList.toggle("is-active", on);
        if (on) {
          a.setAttribute("aria-current", "true");
          const left = a.offsetLeft - timeline.clientWidth / 2 + a.offsetWidth / 2;
          timeline.scrollTo({ left, behavior: "smooth" });
        } else {
          a.removeAttribute("aria-current");
        }
      });
    };
    const spy = new IntersectionObserver(
      (entries) => entries.forEach((en) => en.isIntersecting && setActive(en.target.id)),
      { rootMargin: "-40% 0px -55% 0px" }
    );
    links.forEach((_, id) => {
      const section = document.getElementById(id);
      if (section) spy.observe(section);
    });
  }

  // ---------- Carousels ----------
  document.querySelectorAll("[data-carousel]").forEach((carousel) => {
    const track = carousel.querySelector(".carousel__track");
    const mk = (dir) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = `carousel__btn carousel__btn--${dir}`;
      b.setAttribute("aria-label", dir === "next" ? "Next image" : "Previous image");
      b.innerHTML = icons[dir];
      b.addEventListener("click", () => {
        const step = Math.max(track.clientWidth * 0.6, 280);
        track.scrollBy({ left: dir === "next" ? step : -step, behavior: "smooth" });
      });
      carousel.appendChild(b);
      return b;
    };
    const prev = mk("prev");
    const next = mk("next");
    const update = () => {
      prev.hidden = track.scrollLeft < 8;
      next.hidden = track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;
    };
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    track.querySelectorAll("img").forEach((img) => img.addEventListener("load", update));
    update();
  });

  // ---------- Lightbox ----------
  const zoomables = document.querySelectorAll("[data-zoom]");
  if (zoomables.length) {
    const box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Image preview");
    box.innerHTML = `<img alt=""><button class="lightbox__close" type="button" aria-label="Close preview">${icons.close}</button>`;
    document.body.appendChild(box);
    const img = box.querySelector("img");
    let lastFocus = null;

    const close = () => {
      box.classList.remove("is-open");
      document.body.style.overflow = "";
      lastFocus?.focus();
    };
    const open = (pic, trigger) => {
      lastFocus = trigger;
      img.src = pic.currentSrc || pic.src;
      img.alt = pic.alt;
      box.classList.add("is-open");
      document.body.style.overflow = "hidden";
      box.querySelector("button").focus();
    };

    zoomables.forEach((el) => {
      const pic = el.querySelector("img");
      el.setAttribute("tabindex", "0");
      el.setAttribute("role", "button");
      el.setAttribute("aria-label", `Enlarge image: ${pic.alt}`);
      el.addEventListener("click", () => open(pic, el));
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open(pic, el);
        }
      });
    });
    box.addEventListener("click", close);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && box.classList.contains("is-open")) close();
    });
  }
})();
