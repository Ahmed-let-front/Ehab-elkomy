function init() {
  const THEME_KEY = "ehab-elkomy-theme";
  const root = document.documentElement;
  const toggleBtn = document.getElementById("theme-toggle");
  const iconSun = document.getElementById("icon-sun");
  const iconMoon = document.getElementById("icon-moon");
  const burger = document.getElementById("burger");
  const menu = document.getElementById("mobile-menu");
  const siteNav = document.getElementById("site-nav");
  const backToTop = document.getElementById("back-to-top");
  const popupOverlay = document.getElementById("popup-overlay");

  const applyTheme = (theme) => {
    if (theme === "light") {
      root.setAttribute("data-theme", "light");
      iconSun.classList.remove("hidden");
      iconMoon.classList.add("hidden");
      toggleBtn.setAttribute("aria-pressed", "true");
    } else {
      root.removeAttribute("data-theme");
      iconSun.classList.add("hidden");
      iconMoon.classList.remove("hidden");
      toggleBtn.setAttribute("aria-pressed", "false");
    }
  };

  const savedTheme = localStorage.getItem(THEME_KEY);
  applyTheme(savedTheme === "light" ? "light" : "dark");

  toggleBtn.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });

  const openMenu = () => {
    menu.classList.add("open");
    burger.setAttribute("aria-expanded", "true");
  };

  const closeMenu = () => {
    menu.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
  };

  burger.addEventListener("click", () => {
    if (menu.classList.contains("open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  document.querySelectorAll(".nav-mobile-link").forEach((a) => {
    a.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (e) => {
    if (
      menu.classList.contains("open") &&
      !menu.contains(e.target) &&
      !burger.contains(e.target)
    ) {
      closeMenu();
    }
  });

  const spot = document.getElementById("spotlight");
  window.addEventListener(
    "mousemove",
    (e) => {
      spot.style.setProperty("--x", e.clientX + "px");
      spot.style.setProperty("--y", e.clientY + "px");
    },
    { passive: true },
  );

  document.querySelectorAll(".magnetic").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const r = btn.getBoundingClientRect();
      btn.style.setProperty("--mx", e.clientX - r.left + "px");
      btn.style.setProperty("--my", e.clientY - r.top + "px");
    });
  });

  const floaters = document.querySelectorAll(".float-shape");
  const hero = document.getElementById("hero");
  hero.addEventListener(
    "mousemove",
    (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      floaters.forEach((f) => {
        const depth = parseFloat(f.getAttribute("data-depth")) || 20;
        f.style.transform = `translate(${dx * depth * -1}px, ${dy * depth * -1}px)`;
      });
    },
    { passive: true },
  );

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -60px 0px" },
  );

  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  const navLinks = Array.from(
    document.querySelectorAll('.nav-link[href^="#"]'),
  );
  const sections = navLinks
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  window.addEventListener(
    "scroll",
    () => {
      siteNav.classList.toggle("nav-scrolled", window.scrollY > 8);
      backToTop.classList.toggle("show", window.scrollY > 480);
    },
    { passive: true },
  );

  const sectionIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = "#" + entry.target.id;
        const link = navLinks.find((a) => a.getAttribute("href") === id);
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach((a) => a.classList.remove("active"));
          link.classList.add("active");
        }
      });
    },
    { threshold: 0.4 },
  );

  sections.forEach((s) => sectionIO.observe(s));

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const form = document.getElementById("contact-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("c-name").value.trim();
    const grade = document.getElementById("c-grade").value;
    const msg = document.getElementById("c-msg").value.trim();
    const text = `اسمي ${name} - ${grade}${msg ? "\n" + msg : "\nعايز أعرف تفاصيل الاشتراك في الأكواد."}`;
    window.open(
      "https://wa.me/201145383426?text=" + encodeURIComponent(text),
      "_blank",
    );
  });

  const openPopup = (contentHTML) => {
    popupOverlay.innerHTML = `<div class="popup-content">${contentHTML}</div>`;
    popupOverlay.classList.add("active");
    popupOverlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closePopup = () => {
    popupOverlay.classList.remove("active");
    popupOverlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    setTimeout(() => {
      popupOverlay.innerHTML = "";
    }, 300);
  };

  popupOverlay.addEventListener("click", (e) => {
    if (e.target === popupOverlay) closePopup();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (popupOverlay.classList.contains("active")) {
        closePopup();
      }
      if (menu.classList.contains("open")) {
        closeMenu();
      }
    }
  });

  window.openPopup = openPopup;
  window.closePopup = closePopup;
}

init();
