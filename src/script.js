const elements = {
  html: document.documentElement,
  header: document.querySelector("#site-header"),
  themeToggle: document.querySelector("#theme-toggle"),
  themeIconSun: document.querySelector("#theme-icon-sun"),
  themeIconMoon: document.querySelector("#theme-icon-moon"),
  navLinks: document.querySelectorAll("[data-nav-link]"),
  mobileNavLinks: document.querySelectorAll("[data-mobile-nav-link]"),
  revealElements: document.querySelectorAll("[data-reveal]"),
  magneticElements: document.querySelectorAll("[data-magnetic]"),
  spotlight: document.querySelector("#spotlight"),
  cursorGlow: document.querySelector("[data-cursor-glow]"),
  cursorDot: document.querySelector("[data-cursor-dot]"),
  hero: document.querySelector("#home"),
  backToTop: document.querySelector("#back-to-top"),
  contactForm: document.querySelector("#contact-form"),
  popup: document.querySelector("#popup"),
  popupClose: document.querySelector("#popup-close"),
};

const isLightMode = () => elements.html.classList.contains("light");
const isDesktop = () => window.innerWidth >= 1024;
const isMobile = () => window.innerWidth < 768;

const updateThemeUI = () => {
  const light = isLightMode();
  elements.themeIconSun?.classList.toggle("theme-icon-active", light);
  elements.themeIconMoon?.classList.toggle("theme-icon-active", !light);
  elements.themeToggle?.setAttribute(
    "aria-label",
    light ? "Toggle dark mode" : "Toggle light mode",
  );
  elements.html.style.colorScheme = light ? "light" : "dark";
};

const applyTheme = (theme) => {
  const isLight = theme === "light";
  elements.html.classList.add("theme-changing");
  elements.html.classList.toggle("light", isLight);
  elements.html.classList.toggle("dark", !isLight);
  localStorage.setItem("theme", isLight ? "light" : "dark");
  updateThemeUI();

  requestAnimationFrame(() => {
    setTimeout(() => {
      elements.html.classList.remove("theme-changing");
    }, 50);
  });
};

const setupTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  const systemTheme = window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
  applyTheme(savedTheme || systemTheme);
  elements.themeToggle?.addEventListener("click", () => {
    applyTheme(isLightMode() ? "dark" : "light");
  });
};

const setupCursorEffects = () => {
  if (!elements.spotlight || !isDesktop()) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let frame = 0;
  let currentX = window.innerWidth / 2;
  let currentY = window.innerHeight / 2;

  const render = () => {
    currentX += (mouseX - currentX) * 0.12;
    currentY += (mouseY - currentY) * 0.12;

    elements.html.style.setProperty("--mouse-x", `${currentX}px`);
    elements.html.style.setProperty("--mouse-y", `${currentY}px`);

    frame = 0;
  };

  const animate = () => {
    if (!frame) {
      frame = requestAnimationFrame(render);
    }
  };

  window.addEventListener(
    "pointermove",
    (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      animate();
    },
    { passive: true },
  );

  const startLoop = () => {
    render();
    requestAnimationFrame(startLoop);
  };
  startLoop();
};

const setupMagneticElements = () => {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

  if (reducedMotion || coarsePointer || isMobile()) return;

  elements.magneticElements.forEach((element) => {
    element.style.setProperty("--magnetic-x", "0px");
    element.style.setProperty("--magnetic-y", "0px");

    element.addEventListener("pointermove", (event) => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - (rect.left + rect.width / 2);
      const y = event.clientY - (rect.top + rect.height / 2);
      element.style.setProperty("--magnetic-x", `${x * 0.04}px`);
      element.style.setProperty("--magnetic-y", `${y * 0.04}px`);
    });

    element.addEventListener("pointerleave", () => {
      element.style.setProperty("--magnetic-x", "0px");
      element.style.setProperty("--magnetic-y", "0px");
    });
  });
};

const setupPageEntrance = () => {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const heroElements = elements.hero
    ? elements.hero.querySelectorAll("[data-reveal]")
    : [];

  if (reducedMotion) {
    if (elements.header) {
      elements.header.style.opacity = "1";
      elements.header.style.transform = "none";
    }
    heroElements.forEach((el) => {
      el.classList.add("is-visible");
      el.style.opacity = "1";
      el.style.transform = "none";
    });
    return;
  }

  if (elements.header) {
    elements.header.style.opacity = "0";
    elements.header.style.transform = "translateY(-80px)";
    elements.header.style.transition =
      "opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)";
  }

  heroElements.forEach((element, index) => {
    element.classList.add("is-visible");
    element.style.opacity = "0";
    element.style.transform = "translate3d(0, 40px, 0) scale(0.96)";
    element.style.transition =
      "opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)";
    element.style.transitionDelay = `${index * 100}ms`;
  });

  requestAnimationFrame(() => {
    if (elements.header) {
      setTimeout(() => {
        elements.header.style.opacity = "1";
        elements.header.style.transform = "translateY(0)";
      }, 100);
    }

    heroElements.forEach((element) => {
      setTimeout(() => {
        element.style.opacity = "1";
        element.style.transform = "translate3d(0, 0, 0) scale(1)";
      }, 200);
    });

    setTimeout(() => {
      if (elements.header) {
        elements.header.style.opacity = "";
        elements.header.style.transform = "";
        elements.header.style.transition = "";
      }
      heroElements.forEach((element) => {
        element.style.opacity = "";
        element.style.transform = "";
        element.style.transition = "";
        element.style.transitionDelay = "";
      });
    }, 2000);
  });
};

const setupRevealObserver = () => {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (reducedMotion) {
    elements.revealElements.forEach((element) =>
      element.classList.add("is-visible"),
    );
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -20px 0px" },
  );

  elements.revealElements.forEach((element, index) => {
    if (element.closest("#home")) return;
    element.style.transitionDelay = `${Math.min(index % 3, 2) * 50}ms`;
    observer.observe(element);
  });
};

const setupHeroParallax = () => {
  if (!elements.hero || !isDesktop()) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (reducedMotion) return;

  let frame = 0;

  const update = () => {
    const rect = elements.hero.getBoundingClientRect();
    const progress = Math.max(-1, Math.min(1, rect.top / window.innerHeight));

    elements.magneticElements.forEach((element) => {
      if (!element.closest("#home")) return;
      element.style.setProperty("--parallax-y", `${progress * -15}px`);
    });

    frame = 0;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!frame) {
        frame = requestAnimationFrame(update);
      }
    },
    { passive: true },
  );

  update();
};

const updateHeader = () => {
  if (!elements.header) return;
  const scrolled = window.scrollY > 25;
  elements.header.classList.toggle("shadow-2xl", scrolled);
};

const setupHeaderScroll = () => {
  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();
};

const setActiveNavLink = () => {
  const sections = [...elements.navLinks]
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const scrollPosition = window.scrollY + window.innerHeight * 0.3;
  let current = "";

  sections.forEach((section) => {
    if (section.offsetTop <= scrollPosition) {
      current = `#${section.id}`;
    }
  });

  elements.navLinks.forEach((link) => {
    const active = link.getAttribute("href") === current;
    link.classList.toggle("bg-sky-500/10", active);
    link.classList.toggle("text-sky-500", active);
  });
};

const setActiveMobileNavLink = () => {
  const sections = [...elements.mobileNavLinks]
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const scrollPosition = window.scrollY + window.innerHeight * 0.3;
  let current = "";

  sections.forEach((section) => {
    if (section.offsetTop <= scrollPosition) {
      current = `#${section.id}`;
    }
  });

  elements.mobileNavLinks.forEach((link) => {
    const active = link.getAttribute("href") === current;
    link.classList.toggle("active", active);
    link.classList.toggle("text-sky-500", active);
    link.classList.toggle("bg-sky-500/10", active);
  });
};

const setupActiveNavigation = () => {
  const updateActive = () => {
    setActiveNavLink();
    setActiveMobileNavLink();
  };

  window.addEventListener("scroll", updateActive, { passive: true });
  updateActive();
};

const setupBackToTop = () => {
  if (!elements.backToTop) return;

  const update = () => {
    const shouldShow = window.scrollY > 500;
    elements.backToTop.classList.toggle("opacity-0", !shouldShow);
    elements.backToTop.classList.toggle("pointer-events-none", !shouldShow);
  };

  window.addEventListener("scroll", update, { passive: true });

  elements.backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  update();
};

const setupContactForm = () => {
  if (!elements.contactForm) return;

  elements.contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(elements.contactForm);
    const name = formData.get("name") || "";
    const phone = formData.get("phone") || "";
    const message = formData.get("message") || "";

    const text = [
      "السلام عليكم م. إيهاب،",
      "",
      `الاسم: ${name}`,
      `رقم الهاتف: ${phone}`,
      `الرسالة: ${message}`,
    ].join("\n");

    const whatsappUrl = `https://wa.me/201145383426?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  });
};

const setupPopup = () => {
  if (!elements.popup) return;

  const closePopup = () => {
    elements.popup.classList.add("hidden");
  };

  elements.popupClose?.addEventListener("click", closePopup);

  elements.popup.addEventListener("click", (event) => {
    if (event.target === elements.popup) {
      closePopup();
    }
  });
};

const init = () => {
  setupTheme();
  setupCursorEffects();
  setupMagneticElements();
  setupPageEntrance();
  setupRevealObserver();
  setupHeroParallax();
  setupHeaderScroll();
  setupActiveNavigation();
  setupBackToTop();
  setupContactForm();
  setupPopup();
};

document.addEventListener("DOMContentLoaded", init);
