/*
 * Shared site craft: language persistence, nav/footer/drawer chrome
 * rendering, click-burst (components/click-burst.html), and the
 * page-transition loading bar + hero shared-element flight
 * (components/hero-transition.html). Loaded by every page in pages/
 * so this logic lives in one place instead of five.
 */
window.SiteCraft = (function () {
  'use strict';

  var LANG_KEY = 'portfolio_lang';
  var HERO_KEY = 'portfolio_hero_rect';
  // Mesmo valor de --ease-in-out no design-system/tokens.css.
  var HERO_EASE = 'cubic-bezier(0.65,0,0.35,1)';
  // 380/340ms abaixo sao intencionalmente diferentes de --duration-hero (420ms,
  // so existe em design-system/components/hero-transition.html): a versao daqui
  // navega entre paginas de verdade e foi ajustada a parte da demo do DS.

  function reducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function detectLang() {
    try {
      var saved = localStorage.getItem(LANG_KEY);
      if (saved === 'pt' || saved === 'en') return saved;
    } catch (e) {}
    var nav = (navigator.language || 'en').toLowerCase();
    return nav.indexOf('pt') === 0 ? 'pt' : 'en';
  }

  function setLang(lang) {
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
  }

  // Every page shares these ids for its nav/footer/mobile-drawer chrome.
  function queryChromeEls() {
    return {
      skipLink: document.getElementById('skipLink'),
      brandNameNav: document.getElementById('brandNameNav').querySelector('span:last-child'),
      navWork: document.getElementById('navWork'),
      navAbout: document.getElementById('navAbout'),
      navContact: document.getElementById('navContact'),
      langToggleTop: document.getElementById('langToggleTop'),
      ctaTop: document.getElementById('ctaTop'),
      brandNameFooter: document.getElementById('brandNameFooter'),
      footerCv: document.getElementById('footerCv'),
      langToggleBottom: document.getElementById('langToggleBottom'),
      copyright: document.getElementById('copyright'),
      menuBtn: document.getElementById('menuBtn'),
      menuCloseBtn: document.getElementById('menuCloseBtn'),
      mobileDrawer: document.getElementById('mobileDrawer'),
      drawerBrandName: document.getElementById('drawerBrandName'),
      drawerNavWork: document.getElementById('drawerNavWork'),
      drawerNavAbout: document.getElementById('drawerNavAbout'),
      drawerNavContact: document.getElementById('drawerNavContact'),
      langToggleDrawer: document.getElementById('langToggleDrawer'),
      ctaDrawer: document.getElementById('ctaDrawer')
    };
  }

  // Updates the shared chrome (nav, footer, drawer) from a copy object L
  // that has: skip, brandName, work, about, contact, toggle, toggleAria,
  // getInTouch, cv, copyright. `els` may have extra page-specific keys —
  // only the chrome ones above are read.
  function renderChrome(els, L) {
    els.skipLink.textContent = L.skip;
    els.brandNameNav.textContent = L.brandName;
    els.brandNameFooter.textContent = L.brandName;
    els.navWork.textContent = L.work;
    els.navAbout.textContent = L.about;
    els.navContact.textContent = L.contact;
    els.langToggleTop.textContent = L.toggle;
    els.langToggleTop.setAttribute('aria-label', L.toggleAria);
    els.langToggleBottom.textContent = L.toggle;
    els.langToggleBottom.setAttribute('aria-label', L.toggleAria);
    els.ctaTop.textContent = L.getInTouch;
    els.footerCv.textContent = L.cv;
    els.copyright.textContent = L.copyright;
    els.drawerBrandName.textContent = L.brandName;
    els.drawerNavWork.textContent = L.work;
    els.drawerNavAbout.textContent = L.about;
    els.drawerNavContact.textContent = L.contact;
    els.langToggleDrawer.textContent = L.toggle;
    els.langToggleDrawer.setAttribute('aria-label', L.toggleAria);
    els.ctaDrawer.textContent = L.getInTouch;
  }

  function wireLangToggle(els, onToggle) {
    els.langToggleTop.addEventListener('click', onToggle);
    els.langToggleBottom.addEventListener('click', onToggle);
    els.langToggleDrawer.addEventListener('click', onToggle);
  }

  function wireDrawer(els) {
    function setOpen(open) {
      els.mobileDrawer.classList.toggle('is-open', open);
      els.menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    els.menuBtn.addEventListener('click', function () { setOpen(true); });
    els.menuCloseBtn.addEventListener('click', function () { setOpen(false); });
    Array.prototype.forEach.call(els.mobileDrawer.querySelectorAll('a'), function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });
  }

  // Click-burst micro-interaction — see components/click-burst.html.
  var lastBurst = { t: 0, x: 0, y: 0 };
  function burst(x, y) {
    if (reducedMotion()) return;
    var now = Date.now();
    if (now - lastBurst.t < 150 && Math.abs(x - lastBurst.x) < 12 && Math.abs(y - lastBurst.y) < 12) return;
    lastBurst = { t: now, x: x, y: y };
    var colors = ['var(--color-accent)', 'var(--color-dark)'];
    var count = 10;
    for (var i = 0; i < count; i++) {
      (function (i) {
        var line = document.createElement('span');
        var angle = (360 / count) * i + (Math.random() * 12 - 6);
        var dist = 24 + Math.random() * 16;
        Object.assign(line.style, {
          position: 'fixed', left: x + 'px', top: y + 'px', width: '3px', height: '10px',
          margin: '-5px -1.5px', borderRadius: '2px', background: colors[i % 2],
          pointerEvents: 'none', zIndex: '999', transform: 'rotate(' + angle + 'deg) translateY(0) scale(1)',
          opacity: '1', transition: 'transform 550ms cubic-bezier(.16,1,.3,1), opacity 550ms cubic-bezier(.16,1,.3,1)'
        });
        document.body.appendChild(line);
        requestAnimationFrame(function () {
          line.style.transform = 'rotate(' + angle + 'deg) translateY(-' + dist + 'px) scale(0.4)';
          line.style.opacity = '0';
        });
        setTimeout(function () { line.remove(); }, 560);
      })(i);
    }
  }

  function showLoadingBar() {
    if (document.getElementById('pageLoadingBar')) return;
    var track = document.createElement('div');
    track.id = 'pageLoadingBar';
    track.setAttribute('role', 'status');
    track.setAttribute('aria-live', 'polite');
    track.setAttribute('aria-label', 'Loading page');
    Object.assign(track.style, {
      position: 'fixed', top: '0', left: '0', right: '0', height: '3px',
      background: 'rgba(25,26,35,.12)', overflow: 'hidden', zIndex: '1000'
    });
    var fill = document.createElement('div');
    Object.assign(fill.style, {
      width: '40%', height: '100%', background: '#FF9900',
      animation: reducedMotion() ? 'none' : 'pageLoadingSlide 1.3s ease-in-out infinite'
    });
    track.appendChild(fill);
    document.body.appendChild(track);
  }

  // Where the case-study cover will sit when the next page opens — both
  // sides of the navigation agree on this rect, so the flight and the
  // arrival read as one motion.
  function landingRect() {
    var vw = window.innerWidth;
    var width = Math.min(900, vw - 48);
    var height = Math.min(420, Math.round(window.innerHeight * 0.52));
    return { left: Math.round((vw - width) / 2), top: 104, width: width, height: height, radius: '20px' };
  }

  // Flies a clone of the clicked card's [data-hero] cover to where the
  // next page's cover will appear. Returns true when a flight started.
  function flyHeroExit(anchor) {
    var hero = anchor.querySelector && anchor.querySelector('[data-hero]');
    if (!hero) return false;
    var from = hero.getBoundingClientRect();
    var to = landingRect();
    try { sessionStorage.setItem(HERO_KEY, JSON.stringify(Object.assign({ t: Date.now() }, to))); } catch (e) {}
    var clone = hero.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    Object.assign(clone.style, {
      position: 'fixed', margin: '0', zIndex: '900', pointerEvents: 'none',
      left: from.left + 'px', top: from.top + 'px', width: from.width + 'px', height: from.height + 'px',
      borderRadius: getComputedStyle(hero).borderRadius,
      transition: 'left 380ms ' + HERO_EASE + ', top 380ms ' + HERO_EASE + ', width 380ms ' + HERO_EASE + ', height 380ms ' + HERO_EASE + ', border-radius 380ms ' + HERO_EASE
    });
    document.body.appendChild(clone);
    requestAnimationFrame(function () {
      clone.style.left = to.left + 'px';
      clone.style.top = to.top + 'px';
      clone.style.width = to.width + 'px';
      clone.style.height = to.height + 'px';
      clone.style.borderRadius = to.radius;
    });
    setTimeout(function () { clone.remove(); }, 400);
    return true;
  }

  function isInternalPageLink(a) {
    if (!a || !a.getAttribute) return false;
    var href = a.getAttribute('href') || '';
    if (a.target === '_blank' || href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0 || href.indexOf('#') === 0) return false;
    return href.indexOf('.html') !== -1;
  }

  // Wires click-burst everywhere and the loading-bar + hero-flight
  // handoff on internal link clicks. Call once per page.
  function initPageTransitions() {
    document.addEventListener('pointerdown', function (e) {
      var tag = (e.target && e.target.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      burst(e.clientX, e.clientY);
    });

    document.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      var a = e.target.closest && e.target.closest('a');
      if (!isInternalPageLink(a)) return;
      e.preventDefault();
      var href = a.getAttribute('href');
      if (reducedMotion()) { window.location.href = href; return; }
      showLoadingBar();
      var flying = flyHeroExit(a);
      setTimeout(function () { window.location.href = href; }, flying ? 320 : 90);
    });
  }

  function heroPending() {
    try {
      var saved = JSON.parse(sessionStorage.getItem(HERO_KEY) || 'null');
      return !!saved && Date.now() - saved.t < 4000;
    } catch (e) { return false; }
  }

  // Reverse-FLIP: on load, animates `el` from the rect saved by
  // flyHeroExit() to its natural position. Only case-study.html's cover
  // is ever a landing target. Call as early as possible (before render)
  // so the flight and the arrival read as one continuous motion.
  function playHeroEnterSync(el) {
    if (!el || reducedMotion()) return false;
    var saved = null;
    try {
      saved = JSON.parse(sessionStorage.getItem(HERO_KEY) || 'null');
      sessionStorage.removeItem(HERO_KEY);
    } catch (e) {}
    if (!saved || Date.now() - saved.t > 4000) return false;

    var now = el.getBoundingClientRect();
    if (!now.width || !now.height) return false;
    window.__heroEntering = true;
    var prevRadius = el.style.borderRadius;
    var prevTransform = el.style.transform;

    el.style.transformOrigin = 'top left';
    el.style.transition = 'none';
    el.style.transform = 'translate(' + (saved.left - now.left) + 'px, ' + (saved.top - now.top) + 'px) scale(' + (saved.width / now.width) + ', ' + (saved.height / now.height) + ')';
    el.style.borderRadius = saved.radius || '20px';

    requestAnimationFrame(function () {
      el.style.transition = 'transform 340ms ' + HERO_EASE + ', border-radius 340ms ' + HERO_EASE;
      el.style.transform = 'none';
      el.style.borderRadius = prevRadius;
      setTimeout(function () {
        el.style.transition = '';
        el.style.transformOrigin = '';
        el.style.transform = prevTransform;
        window.__heroEntering = false;
      }, 380);
    });
    return true;
  }

  // Page entrance: fade + rise, skipped for reduced-motion users and
  // while a hero cover is mid-arrival (the two animations would fight).
  function fadeInRoot(root) {
    if (!root || reducedMotion() || heroPending() || window.__heroEntering) return;
    root.style.opacity = '0';
    root.style.transform = 'translateY(10px)';
    requestAnimationFrame(function () {
      root.style.transition = 'opacity 400ms cubic-bezier(.16,1,.3,1), transform 400ms cubic-bezier(.16,1,.3,1)';
      root.style.opacity = '1';
      root.style.transform = 'none';
    });
  }

  return {
    detectLang: detectLang,
    setLang: setLang,
    queryChromeEls: queryChromeEls,
    renderChrome: renderChrome,
    wireLangToggle: wireLangToggle,
    wireDrawer: wireDrawer,
    reducedMotion: reducedMotion,
    initPageTransitions: initPageTransitions,
    fadeInRoot: fadeInRoot,
    playHeroEnterSync: playHeroEnterSync
  };
})();
