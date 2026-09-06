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

const updateThemeUI = () => {
  const light = isLightMode();
  elements.themeIconSun?.classList.toggle("theme-icon-active", light);
  elements.themeIconMoon?.classList.toggle("theme-icon-active", !light);
  elements.themeToggle?.setAttribute(
    "aria-label",
    light ? "تفعيل الوضع الداكن" : "تفعيل الوضع الفاتح",
  );
  elements.html.style.colorScheme = light ? "light" : "dark";
};

const applyTheme = (theme) => {
  const isLight = theme === "light";
  elements.html.classList.toggle("light", isLight);
  elements.html.classList.toggle("dark", !isLight);
  localStorage.setItem("theme", isLight ? "light" : "dark");
  updateThemeUI();
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
    // Smooth follow
    currentX += (mouseX - currentX) * 0.15;
    currentY += (mouseY - currentY) * 0.15;

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

  // Start animation loop
  const startLoop = () => {
    render();
    requestAnimationFrame(startLoop);
  };
  startLoop();

  // Don't hide cursor - keep it visible
  // Just the glow follows behind
};

const setupMagneticElements = () => {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

  if (reducedMotion || coarsePointer) return;

  elements.magneticElements.forEach((element) => {
    element.style.setProperty("--magnetic-x", "0px");
    element.style.setProperty("--magnetic-y", "0px");

    element.addEventListener("pointermove", (event) => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - (rect.left + rect.width / 2);
      const y = event.clientY - (rect.top + rect.height / 2);
      element.style.setProperty("--magnetic-x", `${x * 0.045}px`);
      element.style.setProperty("--magnetic-y", `${y * 0.045}px`);
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
  if (reducedMotion) return;

  // Header from top - 3 seconds duration
  if (elements.header) {
    elements.header.style.opacity = "0";
    elements.header.style.transform = "translateY(-100px)";
    elements.header.style.transition =
      "opacity 3s cubic-bezier(0.16, 1, 0.3, 1), transform 3s cubic-bezier(0.16, 1, 0.3, 1)";
  }

  // Hero content from right - 3 seconds duration
  const heroContent = elements.hero?.querySelector('[data-reveal="right"]');
  if (heroContent) {
    heroContent.style.opacity = "0";
    heroContent.style.transform = "translate3d(150px, 0, 0) scale(0.9)";
    heroContent.style.transition =
      "opacity 3s cubic-bezier(0.16, 1, 0.3, 1), transform 3s cubic-bezier(0.16, 1, 0.3, 1)";
  }

  // Hero image from left - 3 seconds duration
  const heroImage = elements.hero?.querySelector('[data-reveal="left"]');
  if (heroImage) {
    heroImage.style.opacity = "0";
    heroImage.style.transform = "translate3d(-150px, 0, 0) scale(0.9)";
    heroImage.style.transition =
      "opacity 3s cubic-bezier(0.16, 1, 0.3, 1), transform 3s cubic-bezier(0.16, 1, 0.3, 1)";
  }

  // Trigger animations with delays
  requestAnimationFrame(() => {
    // Header animation - starts immediately
    if (elements.header) {
      setTimeout(() => {
        elements.header.style.opacity = "1";
        elements.header.style.transform = "translateY(0)";
      }, 100);
    }

    // Hero content animation - starts after 500ms
    if (heroContent) {
      setTimeout(() => {
        heroContent.style.opacity = "1";
        heroContent.style.transform = "translate3d(0, 0, 0) scale(1)";
      }, 500);
    }

    // Hero image animation - starts after 800ms
    if (heroImage) {
      setTimeout(() => {
        heroImage.style.opacity = "1";
        heroImage.style.transform = "translate3d(0, 0, 0) scale(1)";
      }, 800);
    }
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
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );

  elements.revealElements.forEach((element, index) => {
    if (element.closest("#home")) return; // Hero elements already animated
    element.style.transitionDelay = `${Math.min(index % 5, 4) * 70}ms`;
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
      element.style.setProperty("--parallax-y", `${progress * -18}px`);
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
