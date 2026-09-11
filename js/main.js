/* ===================================================================
   Leon Begiristain — site behavior
   - renders About / News / Publications from data/*.js
   - sliding nav indicator + scrollspy
   - theme toggle (persisted)
   =================================================================== */
(function () {
  "use strict";

  // Name to bold in author lists. Adjust if your data uses a different spelling.
  var NAME = "Leon Begiristain";

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var el = function (tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };
  var esc = function (s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  };

  /* ---------------- theme ---------------- */
  var THEME_KEY = "leon-theme";
  function getStored() {
    try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
  }
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
  }
  function initTheme() {
    var stored = getStored();
    var prefersDark = window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(stored || (prefersDark ? "dark" : "light"));
    var btn = $("#themeToggle");
    if (btn) {
      btn.addEventListener("click", function () {
        var next =
          document.documentElement.getAttribute("data-theme") === "dark"
            ? "light"
            : "dark";
        applyTheme(next);
        try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
        moveIndicator();
      });
    }
  }

  /* ---------------- icons ---------------- */
  var ICONS = {
    email:
      '<svg viewBox="0 0 24 24"><path d="M2 5h20v14H2zM2 5l10 8L22 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    github:
      '<svg viewBox="0 0 24 24"><path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.94c.57.1.78-.25.78-.55v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.27 3.4.97.1-.75.4-1.27.73-1.56-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.2-3.1-.13-.29-.52-1.46.1-3.05 0 0 .97-.31 3.2 1.18a11 11 0 0 1 5.82 0c2.22-1.5 3.19-1.18 3.19-1.18.63 1.59.24 2.76.12 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.28 5.69.42.36.79 1.07.79 2.16v3.2c0 .31.2.66.79.55A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5z"/></svg>',
    linkedin:
      '<svg viewBox="0 0 24 24"><path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C20.4 8.65 22 10.6 22 14v7h-4v-6.2c0-1.48-.03-3.38-2.06-3.38-2.06 0-2.38 1.6-2.38 3.27V21H9z"/></svg>',
    scholar:
      '<svg viewBox="0 0 24 24"><path d="M12 3L1 9l11 6 9-4.9V17h2V9zM4 13.4V17c0 1.7 3.6 3 8 3s8-1.3 8-3v-3.6l-8 4.4z"/></svg>',
    twitter:
      '<svg viewBox="0 0 24 24"><path d="M18.9 3H22l-7.1 8.1L23 21h-6.6l-5.2-6.8L5.3 21H2l7.6-8.7L1.5 3h6.8l4.7 6.2zm-1.2 16h1.8L7.4 4.8H5.5z"/></svg>',
    cv:
      '<svg viewBox="0 0 24 24"><path d="M6 2h9l5 5v15H6zM14 2v6h6" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
  };
  var LINK_LABELS = {
    email: "Email", github: "GitHub", linkedin: "LinkedIn",
    scholar: "Scholar", twitter: "Twitter", cv: "CV",
  };
  var LINK_ORDER = ["email", "github", "linkedin", "scholar", "twitter", "cv"];

  /* ---------------- render: about ---------------- */
  function renderProfile() {
    var p = window.PROFILE || {};
    if (p.name) { $("#profileName").textContent = p.name; document.title = p.name; }
    var roleEl = $("#profileRole");
    roleEl.textContent = [p.role, p.affiliation].filter(Boolean).join(" · ");
    if (p.blurb) $("#profileBlurb").innerHTML = p.blurb;
    if (p.photo) {
      var img = $("#profilePhoto");
      img.src = p.photo;
      img.alt = "Portrait of " + (p.name || "");
    }

    var list = $("#profileLinks");
    list.innerHTML = "";
    var links = p.links || {};
    LINK_ORDER.forEach(function (key) {
      var val = links[key];
      if (!val) return;
      var href = key === "email" ? "mailto:" + val : val;
      var li = el("li");
      var a = el("a", null, (ICONS[key] || "") + "<span>" + esc(LINK_LABELS[key] || key) + "</span>");
      a.href = href;
      if (key !== "email") { a.target = "_blank"; a.rel = "noopener"; }
      li.appendChild(a);
      list.appendChild(li);
    });
  }

  /* ---------------- render: news ---------------- */
  function renderNews() {
    var items = window.NEWS || [];
    var list = $("#newsList");
    list.innerHTML = "";
    if (!items.length) {
      list.appendChild(el("li", "news-item", '<span></span><span class="news-text">No news yet.</span>'));
      return;
    }
    items.forEach(function (n) {
      var text = n.link
        ? '<a href="' + esc(n.link) + '" target="_blank" rel="noopener">' + n.text + "</a>"
        : n.text;
      var li = el(
        "li",
        "news-item",
        '<span class="news-date">' + esc(n.date || "") + "</span>" +
          '<span class="news-text">' + text + "</span>"
      );
      list.appendChild(li);
    });
  }

  /* ---------------- render: publications ---------------- */
  function authorsHTML(authors) {
    return (authors || [])
      .map(function (a) {
        return a === NAME ? '<span class="me">' + esc(a) + "</span>" : esc(a);
      })
      .join(", ");
  }

  function renderPublications() {
    var pubs = (window.PUBLICATIONS || []).slice().sort(function (a, b) {
      return (b.year || 0) - (a.year || 0);
    });
    var wrap = $("#pubList");
    wrap.innerHTML = "";
    if (!pubs.length) {
      wrap.appendChild(el("p", "random-placeholder", "No publications yet."));
      return;
    }
    pubs.forEach(function (pub) {
      var card = el("article", "pub-card" + (pub.selected ? " is-selected" : ""));

      var fig = el("div", "pub-figure");
      var im = el("img");
      im.src = pub.figure || "assets/pub-placeholder.svg";
      im.alt = "Figure for " + (pub.title || "publication");
      im.loading = "lazy";
      fig.appendChild(im);

      var linksHTML = "";
      var links = pub.links || {};
      Object.keys(links).forEach(function (k) {
        if (!links[k]) return;
        linksHTML +=
          '<a href="' + esc(links[k]) + '" target="_blank" rel="noopener">' + esc(k) + "</a>";
      });

      // show "· year" only if the venue text doesn't already contain it
      var venue = pub.venue || "";
      var yearSuffix =
        pub.year && venue.indexOf(String(pub.year)) === -1 ? " · " + esc(pub.year) : "";

      var body = el(
        "div",
        "pub-body",
        '<h3 class="pub-title">' + esc(pub.title || "") + "</h3>" +
          '<p class="pub-authors">' + authorsHTML(pub.authors) + "</p>" +
          '<p class="pub-venue"><em>' + esc(venue) + "</em>" + yearSuffix + "</p>" +
          '<p class="pub-desc">' + esc(pub.description || "") + "</p>" +
          (linksHTML ? '<div class="pub-links">' + linksHTML + "</div>" : "")
      );

      card.appendChild(fig);
      card.appendChild(body);
      wrap.appendChild(card);
    });
  }

  /* ---------------- nav: sliding indicator + scrollspy ---------------- */
  var navLinks = [].slice.call(document.querySelectorAll(".nav-link"));
  var indicator = $("#navIndicator");
  var currentSection = "about";

  function moveIndicator() {
    var active = navLinks.filter(function (l) {
      return l.dataset.section === currentSection;
    })[0];
    if (!active || !indicator) return;
    indicator.style.width = active.offsetWidth + "px";
    indicator.style.transform = "translateX(" + active.offsetLeft + "px)";
  }

  function setActive(section) {
    if (section === currentSection) return;
    currentSection = section;
    navLinks.forEach(function (l) {
      l.classList.toggle("is-active", l.dataset.section === section);
    });
    moveIndicator();
  }

  function initNav() {
    // smooth-scroll on click (also works without JS via href)
    navLinks.forEach(function (l) {
      l.addEventListener("click", function () {
        setActive(l.dataset.section);
      });
    });

    var sections = [].slice.call(document.querySelectorAll("main .section"));
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) setActive(e.target.id);
          });
        },
        { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
      );
      sections.forEach(function (s) { io.observe(s); });
    }

    window.addEventListener("resize", moveIndicator);
    // fonts/layout may settle after load
    window.addEventListener("load", moveIndicator);
    setTimeout(moveIndicator, 60);
  }

  /* ---------------- init ---------------- */
  initTheme();
  renderProfile();
  renderNews();
  renderPublications();
  initNav();
  moveIndicator();

  var y = $("#year");
  if (y) y.textContent = new Date().getFullYear();
})();
