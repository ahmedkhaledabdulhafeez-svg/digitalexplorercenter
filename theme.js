/* =========================================================
   theme.js — وضع ليلي / نهاري لكل صفحات مركز المستكشف الرقمي
   الاستخدام: ضع السطر التالي داخل <head> في كل صفحة:
   <script src="./theme.js"></script>
   (في الصفحات داخل مجلدات: ../theme.js)
   ========================================================= */
(function () {
  var KEY = 'explorerTheme';
  // 'auto' = يتبع إعداد جهاز الطالب | 'dark' = ليلي دائماً لمن لم يختر
  var DEFAULT_MODE = 'auto';

  var root = document.documentElement;

  function systemTheme() {
    return window.matchMedia && matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  function saved() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function current() {
    return saved() || (DEFAULT_MODE === 'dark' ? 'dark' : systemTheme());
  }
  function apply(t) {
    root.setAttribute('data-theme', t);
    var btn = document.getElementById('themeToggle');
    if (btn) {
      btn.textContent = t === 'light' ? '🌙' : '☀️';
      btn.title = t === 'light' ? 'التبديل إلى الوضع الليلي' : 'التبديل إلى الوضع النهاري';
      btn.setAttribute('aria-label', btn.title);
    }
  }

  // تطبيق فوري قبل رسم الصفحة (يمنع الوميض)
  apply(current());

  // ---------- ألوان الوضع النهاري ----------
  var css = '' +
  'html[data-theme="light"]{' +
    '--bg:#fbf3e6;--bg2:#f3e4cc;--panel:#fff8ec;--line:rgba(140,80,40,.25);' +
    '--copper:#b5653a;--gold:#b87a10;--sand:#5a3318;--text:#3a2116;--mute:#7a5a44;color-scheme:light}' +
  'html[data-theme="dark"]{color-scheme:dark}' +
  'body{transition:background-color .3s,color .3s}' +

  /* ألوان مكتوبة مباشرة في الصفحة الرئيسية */
  '[data-theme="light"] header{background:rgba(251,243,230,.9)}' +
  '[data-theme="light"] footer{background:#efdcc0}' +
  '[data-theme="light"] .scene{background:linear-gradient(180deg,#fdf1d9 0%,#f7dcae 60%,#efc88e 100%)}' +
  '[data-theme="light"] .twinkle{opacity:0!important}' +
  '[data-theme="light"] .hero::after{background:linear-gradient(270deg,var(--bg) 0%,rgba(251,243,230,.96) 40%,rgba(251,243,230,.35) 72%,rgba(251,243,230,0) 100%),linear-gradient(0deg,var(--bg) 0%,rgba(251,243,230,0) 22%)}' +
  '@media(max-width:900px){[data-theme="light"] .hero::after{background:linear-gradient(0deg,var(--bg) 0%,rgba(251,243,230,.85) 55%,rgba(251,243,230,.45) 100%)}}' +
  '[data-theme="light"] .logo-orb .core{background:rgba(255,255,255,.55)}' +
  '[data-theme="light"] .step{background:rgba(140,80,40,.06)}' +
  '[data-theme="light"] .chip{background:rgba(255,255,255,.5)}' +
  '[data-theme="light"] .g-btn{background:rgba(140,80,40,.08)}' +
  '[data-theme="light"] .g-prog{background:rgba(140,80,40,.15)}' +
  '[data-theme="light"] .frame{box-shadow:0 20px 50px rgba(120,70,30,.18)}' +
  '[data-theme="light"] .card:hover{box-shadow:0 20px 40px rgba(120,70,30,.22),0 0 40px -10px var(--c)}' +
  '[data-theme="light"] .term-box:hover{box-shadow:0 12px 28px rgba(120,70,30,.2)}' +

  /* ===== تحسين التباين والتناسق في الوضع النهاري ===== */
  'html[data-theme="light"]{--line:rgba(140,80,40,.32)}' +
  /* الأرقام في خطوات الاستخدام */
  '[data-theme="light"] .step{background:#fff;border:1px solid var(--line);box-shadow:0 6px 18px rgba(120,70,30,.1)}' +
  '[data-theme="light"] .step .n{background:var(--copper);color:#fff;box-shadow:0 4px 10px rgba(181,101,58,.35)}' +
  '[data-theme="light"] .step:hover{border-color:var(--copper)}' +
  /* الكروت */
  '[data-theme="light"] .card,[data-theme="light"] .term-box{background:#fff;box-shadow:0 8px 24px rgba(120,70,30,.12)}' +
  '[data-theme="light"] .tip{background:rgba(181,101,58,.08);border-color:var(--copper)}' +
  '[data-theme="light"] .about .bot,[data-theme="light"] .tip .bulb{box-shadow:0 4px 14px rgba(181,101,58,.4)}' +
  '[data-theme="light"] .term-def{color:var(--text)}' +
  /* مشهد الهيرو: سماء أعمق وأهرامات أوضح */
  '[data-theme="light"] .scene{background:linear-gradient(180deg,#fdf6ea 0%,#f9ecd6 100%)}' +
  '[data-theme="light"] .scene svg{filter:none}' +
  /* الغطاء الأبيض يغطي منطقة النص فقط، فلا يضبّب الهرم */
  '@media(min-width:901px){html[data-theme="light"] .hero::after{background:linear-gradient(270deg,var(--bg) 0%,rgba(251,243,230,.92) 28%,rgba(251,243,230,0) 52%),linear-gradient(0deg,var(--bg) 0%,rgba(251,243,230,0) 14%)}}' +
  /* ألوان المشهد: درجات رملية هادئة متناسقة */
  '[data-theme="light"] #pyL stop:first-child{stop-color:#ecc9a0}' +
  '[data-theme="light"] #pyL stop:last-child{stop-color:#d9a574}' +
  '[data-theme="light"] #pyR stop:first-child{stop-color:#c48a5c}' +
  '[data-theme="light"] #pyR stop:last-child{stop-color:#a8703f}' +
  '[data-theme="light"] #dune1 stop:first-child{stop-color:#ecd2a8}' +
  '[data-theme="light"] #dune1 stop:last-child{stop-color:#e2bf8e}' +
  '[data-theme="light"] #dune2 stop:first-child{stop-color:#dcb583}' +
  '[data-theme="light"] #dune2 stop:last-child{stop-color:#cf9f6a}' +
  '[data-theme="light"] #raGlow stop:first-child{stop-color:#f6c566;stop-opacity:.55}' +
  '[data-theme="light"] #raGlow stop:nth-child(2){stop-color:#f2b77a;stop-opacity:.25}' +
  '[data-theme="light"] .trail{stroke:#b5653a;opacity:.6}' +
  '[data-theme="light"] .scene svg g[fill="#8a5230"]{fill:#b98258}' +
  '[data-theme="light"] .logo-orb .core{background:#fff;border-color:var(--copper);box-shadow:0 10px 40px rgba(181,101,58,.35)}' +
  /* الفوتر (من footer.js): نصوص داكنة وواضحة */
  '[data-theme="light"] footer{background:#f1dfc3;border-top:1px solid var(--line)}' +
  '[data-theme="light"] footer h1,[data-theme="light"] footer h2,[data-theme="light"] footer h3,[data-theme="light"] footer h4{color:#8a4f1a!important}' +
  '[data-theme="light"] footer p,[data-theme="light"] footer li,[data-theme="light"] footer a,[data-theme="light"] footer span{color:#5a3a28!important;opacity:1!important}' +
  '[data-theme="light"] footer a:hover{color:#b5653a!important}' +
  '[data-theme="light"] footer div,[data-theme="light"] footer small,[data-theme="light"] footer b,[data-theme="light"] footer strong{color:#5a3a28!important;opacity:1!important}' +
  '[data-theme="light"] footer button{color:#8a4f1a!important;border-color:#b5653a!important;opacity:1!important}' +

  /* زر التبديل */
  '#themeToggle{position:fixed;left:16px;bottom:16px;z-index:9998;width:46px;height:46px;border-radius:50%;' +
    'border:1.5px solid var(--copper);background:var(--bg2);color:var(--text);font-size:1.3rem;cursor:pointer;' +
    'display:grid;place-items:center;box-shadow:0 6px 20px rgba(0,0,0,.3);transition:transform .25s,background .3s}' +
  '#themeToggle:hover{transform:scale(1.1) rotate(15deg)}';

  var st = document.createElement('style');
  st.id = 'theme-styles';
  st.textContent = css;
  document.head.appendChild(st);

  function addButton() {
    if (document.getElementById('themeToggle')) return;
    var b = document.createElement('button');
    b.id = 'themeToggle';
    b.type = 'button';
    b.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      try { localStorage.setItem(KEY, next); } catch (e) {}
      apply(next);
    });
    document.body.appendChild(b);
    apply(root.getAttribute('data-theme'));
  }
  if (document.body) addButton();
  else document.addEventListener('DOMContentLoaded', addButton);

  // لو الطالب لم يختر يدوياً: يتابع تغيّر إعداد الجهاز
  if (window.matchMedia) {
    matchMedia('(prefers-color-scheme: light)').addEventListener('change', function () {
      if (!saved() && DEFAULT_MODE !== 'dark') apply(systemTheme());
    });
  }

  // للصفحات الأخرى: تقدر تسمع للحدث ده لو عندك عناصر بتحتاج تحديث
  window.getExplorerTheme = function () { return root.getAttribute('data-theme'); };
})();
