/* ==========================================================================
   D:\WorkProgram\whyselftest\js\main.js
   交互脚本（原生 ES6，无任何依赖）：
     1. 页脚年份
     2. 深浅主题切换（localStorage 记忆 + 跟随系统）
     3. 移动端汉堡菜单（aria-expanded 同步、Esc 关闭、点击外部关闭）
     4. 滚动时高亮当前导航项（scroll + requestAnimationFrame 节流）
     5. 区块入场动画与技能条展开（IntersectionObserver）

   说明：这里刻意写成普通脚本（<script defer>），不使用 ES module，
   这样用 file:// 双击打开 index.html 时也不会因为 CORS 报错。
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var THEME_KEY = 'theme';
  var DESKTOP_MIN = 768;

  function $(selector, context) {
    return (context || document).querySelector(selector);
  }

  function $all(selector, context) {
    return Array.prototype.slice.call((context || document).querySelectorAll(selector));
  }

  /* ---------- 1. 页脚年份 ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* ---------- 2. 主题切换 ---------- */
  var themeToggle = document.getElementById('themeToggle');
  var media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function readStoredTheme() {
    try {
      var value = localStorage.getItem(THEME_KEY);
      return (value === 'light' || value === 'dark') ? value : null;
    } catch (error) {
      return null;
    }
  }

  function storeTheme(value) {
    try {
      localStorage.setItem(THEME_KEY, value);
    } catch (error) {
      /* 隐私模式或个别浏览器的 file:// 下写入会失败，忽略即可 */
    }
  }

  function systemTheme() {
    return (media && media.matches) ? 'dark' : 'light';
  }

  function currentTheme() {
    var attr = root.getAttribute('data-theme');
    return (attr === 'dark' || attr === 'light') ? attr : systemTheme();
  }

  function syncThemeButton(theme) {
    if (!themeToggle) {
      return;
    }
    var isDark = theme === 'dark';
    var label = isDark ? '切换到浅色主题' : '切换到深色主题';
    themeToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    themeToggle.setAttribute('aria-label', label);
    themeToggle.setAttribute('title', label);
  }

  function applyTheme(theme, persist) {
    root.setAttribute('data-theme', theme);
    if (persist) {
      storeTheme(theme);
    }
    syncThemeButton(theme);
  }

  /* 初始化：手动选择过就用保存的值，否则跟随系统（head 内联脚本已提前应用过一次，这里保持同步） */
  applyTheme(readStoredTheme() || systemTheme(), false);

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      applyTheme(currentTheme() === 'dark' ? 'light' : 'dark', true);
    });
  }

  /* 用户没手动选过时，跟随系统主题变化 */
  if (media) {
    var onSystemThemeChange = function () {
      if (!readStoredTheme()) {
        applyTheme(systemTheme(), false);
      }
    };
    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', onSystemThemeChange);
    } else if (typeof media.addListener === 'function') {
      media.addListener(onSystemThemeChange);
    }
  }

  /* ---------- 3. 移动端汉堡菜单 ---------- */
  var navToggle = document.getElementById('navToggle');
  var nav = document.getElementById('primaryNav');

  function isNavOpen() {
    return !!nav && nav.classList.contains('is-open');
  }

  function closeNav() {
    if (!nav || !navToggle) {
      return;
    }
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', '打开导航菜单');
  }

  function openNav() {
    if (!nav || !navToggle) {
      return;
    }
    nav.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', '关闭导航菜单');
  }

  if (nav && navToggle) {
    navToggle.addEventListener('click', function () {
      if (isNavOpen()) {
        closeNav();
      } else {
        openNav();
      }
    });

    /* 点击菜单项后自动收起 */
    $all('.nav-link', nav).forEach(function (link) {
      link.addEventListener('click', closeNav);
    });

    /* 点击菜单外部收起 */
    document.addEventListener('click', function (event) {
      if (!isNavOpen()) {
        return;
      }
      if (nav.contains(event.target) || navToggle.contains(event.target)) {
        return;
      }
      closeNav();
    });

    /* Esc 收起并把焦点还给按钮 */
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && isNavOpen()) {
        closeNav();
        navToggle.focus();
      }
    });

    /* 放大到桌面宽度时复位，避免状态残留 */
    window.addEventListener('resize', function () {
      if (window.innerWidth >= DESKTOP_MIN && isNavOpen()) {
        closeNav();
      }
    });
  }

  /* ---------- 4. 滚动高亮当前区块 ---------- */
  var sections = $all('main section[id]');
  var navLinks = $all('.nav-link');
  var header = $('.site-header');
  var ticking = false;

  function updateActiveLink() {
    ticking = false;

    if (!sections.length || !navLinks.length) {
      return;
    }

    var headerHeight = header ? header.offsetHeight : 0;
    var probe = window.scrollY + headerHeight + 24;
    var activeId = sections[0].id;
    var i;

    for (i = 0; i < sections.length; i++) {
      var top = sections[i].getBoundingClientRect().top + window.scrollY;
      if (top <= probe) {
        activeId = sections[i].id;
      }
    }

    /* 滚到底部时高亮最后一个区块（否则短区块可能永远轮不到） */
    var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll > 0 && window.scrollY >= maxScroll - 2) {
      activeId = sections[sections.length - 1].id;
    }

    navLinks.forEach(function (link) {
      var isActive = link.getAttribute('href') === '#' + activeId;
      link.classList.toggle('is-active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  function requestActiveLinkUpdate() {
    if (ticking) {
      return;
    }
    ticking = true;
    window.requestAnimationFrame(updateActiveLink);
  }

  window.addEventListener('scroll', requestActiveLinkUpdate, { passive: true });
  window.addEventListener('resize', requestActiveLinkUpdate);
  window.addEventListener('load', requestActiveLinkUpdate);
  requestActiveLinkUpdate();

  /* ---------- 5. 入场动画 ---------- */
  var revealTargets = $all('.reveal');

  if (revealTargets.length) {
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.08,
        rootMargin: '0px 0px -8% 0px'
      });

      revealTargets.forEach(function (target) {
        observer.observe(target);
      });
    } else {
      /* 老浏览器直接显示，不做动画 */
      revealTargets.forEach(function (target) {
        target.classList.add('is-visible');
      });
    }
  }
})();
