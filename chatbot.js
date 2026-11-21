(function () {
  // تحديد المسار تلقائياً سواء الصفحة في الرئيسية أو داخل مجلد فرعي (قسم-الجغرافيا أو قسم-التاريخ)
  const decodedPath = decodeURIComponent(location.pathname);
  const isSubFolder = decodedPath.includes('/قسم-');
  const base = isSubFolder ? '../' : '';

  // قاعدة بيانات المساعد التعليمي بروابط صحيحة بدون مسافات (بالشرطات)
  const knowledgeBase = [
    {
      keys: ['مرحبا', 'اهلا', 'السلام', 'هاي', 'ازيك', 'صباح', 'مساء'],
      reply: 'أهلاً بك يا بطل في <b>مركز المستكشف الرقمي</b>! 🤖 أنا مساعدك التعليمي الذكي. اسألني عن أي درس في الجغرافيا أو التاريخ، أو اختر من الأزرار السريعة بالأسفل 👇'
    },
    {
      keys: ['قارات', 'العالم', 'اسيا', 'أفريقيا', 'اوروبا', 'مساحة', 'موقع', 'جغرافيا'],
      reply: '🌍 <b>قارات العالم:</b> ينقسم العالم إلى 7 قارات (آسيا أكبرها مساحة وأستراليا أصغرها).<br>تقدر تدخل تذاكر الدرس وتلعب نشاط الخريطة التفاعلي من <a href="' + base + 'قسم-الجغرافيا/درس-قارات-العالم-الموقع-والمساحة.html" style="color:#f0b44c;text-decoration:underline;">هنا</a> أو تصفح كل دروس <a href="' + base + 'قسم-الجغرافيا/قسم-الجغرافيا.html" style="color:#f0b44c;text-decoration:underline;">قسم الجغرافيا</a>.'
    },
    {
      keys: ['محمد علي', 'تولية', 'حكم', 'مصر', 'تاريخ', 'المماليك', 'الزعامة'],
      reply: '🏺 <b>قسم التاريخ:</b> استكشف دروس التاريخ وتولية محمد علي حكم مصر (1805م) وتثبيت دعائم حكمه.<br>ادخل مباشرة على <a href="' + base + 'قسم-التاريخ/قسم-التاريخ.html" style="color:#f0b44c;text-decoration:underline;">قسم التاريخ</a> أو اسمع الشخصيات التاريخية تتحدث عن نفسها في <a href="' + base + 'محاكاة-الشخصيات.html" style="color:#f0b44c;text-decoration:underline;">محاكاة الشخصيات</a>!'
    },
    {
      keys: ['خرائط', 'خريطة', 'ذكية'],
      reply: '🗺️ تقدر تستكشف القارات والتضاريس والدول بشكل تفاعلي من خلال صفحة <a href="' + base + 'readings.html" style="color:#f0b44c;text-decoration:underline;">الخرائط الجغرافية الذكية</a>.'
    },
    {
      keys: ['ذكاء', 'اصطناعي', 'شخصيات', 'محاكاة'],
      reply: '🤖 في قسم <a href="' + base + 'محاكاة-الشخصيات.html" style="color:#f0b44c;text-decoration:underline;">محاكاة الشخصيات التاريخية</a> هتلاقي حكام وشخصيات تاريخية يتحدثون عن أنفسهم بالذكاء الاصطناعي!'
    },
    {
      keys: ['اعداد', 'مين', 'صمم', 'جامعة', 'اسوان', 'فريق'],
      reply: '🎓 تم تصميم وإعداد هذه المنصة بواسطة طلاب الفرقة الرابعة - قسم تكنولوجيا التعليم - كلية التربية النوعية - <b>جامعة أسوان</b>.'
    }
  ];

  // إضافة التنسيقات (CSS) في اليمين وبحجم أكبر للكمبيوتر
  const style = document.createElement('style');
  style.textContent = `
    #de-bot-btn {
      position: fixed; bottom: 26px; right: 26px; z-index: 9999;
      width: 68px; height: 68px; border-radius: 50%; border: 2px solid #f0b44c;
      background: linear-gradient(135deg, #c8825a, #42251a); color: #fff;
      cursor: pointer; box-shadow: 0 12px 32px rgba(0,0,0,.6), 0 0 24px rgba(240,180,76,.45);
      display: grid; place-items: center; transition: transform .3s, box-shadow .3s;
    }
    #de-bot-btn:hover { transform: scale(1.08) translateY(-3px); box-shadow: 0 16px 38px rgba(0,0,0,.7), 0 0 30px rgba(240,180,76,.7); }
    #de-bot-btn svg { width: 36px; height: 36px; }
    #de-bot-box {
      position: fixed; bottom: 108px; right: 26px; z-index: 9999;
      width: 420px; max-width: calc(100vw - 36px); height: 560px; max-height: 78vh;
      background: #2e1a10; border: 1.5px solid #c8825a; border-radius: 26px;
      box-shadow: 0 28px 70px rgba(0,0,0,.75); display: none; flex-direction: column;
      overflow: hidden; font-family: 'Cairo', sans-serif; direction: rtl; color: #f6e8d4;
    }
    #de-bot-box.open { display: flex; animation: dePop .28s ease; }
    @keyframes dePop { from { opacity: 0; transform: translateY(18px) scale(.96); } to { opacity: 1; transform: none; } }
    .de-head {
      background: linear-gradient(90deg, #42251a, #5c3322); padding: 16px 20px;
      border-bottom: 1px solid rgba(224,160,110,.25); display: flex; align-items: center; justify-content: space-between;
    }
    .de-head-info { display: flex; align-items: center; gap: 12px; }
    .de-head-icon {
      width: 42px; height: 42px; border-radius: 14px; background: rgba(240,180,76,.15);
      border: 1px solid #f0b44c; display: grid; place-items: center;
    }
    .de-head b { font-family: 'Reem Kufi', sans-serif; color: #f0b44c; font-size: 1.15rem; display: block; line-height: 1.3; }
    .de-head small { color: #c9ae94; font-size: .8rem; }
    .de-close { background: none; border: none; color: #f3dcb8; font-size: 1.4rem; cursor: pointer; padding: 4px 8px; }
    .de-close:hover { color: #f0b44c; }
    .de-msgs { flex: 1; padding: 16px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; }
    .de-msg { max-width: 86%; padding: 12px 16px; border-radius: 18px; font-size: .95rem; line-height: 1.65; }
    .de-msg.bot { background: #3a2116; border: 1px solid rgba(224,160,110,.22); align-self: flex-start; border-bottom-right-radius: 4px; }
    .de-msg.usr { background: #c8825a; color: #2a150b; font-weight: 700; align-self: flex-end; border-bottom-left-radius: 4px; }
    .de-chips { padding: 10px 14px; display: flex; gap: 8px; overflow-x: auto; border-top: 1px solid rgba(224,160,110,.15); scrollbar-width: none; }
    .de-chips::-webkit-scrollbar { display: none; }
    .de-chips button {
      flex-shrink: 0; background: rgba(200,130,90,.15); border: 1px solid #c8825a; color: #f3dcb8;
      padding: 6px 14px; border-radius: 99px; font-size: .82rem; font-family: inherit; cursor: pointer; transition: .2s;
    }
    .de-chips button:hover { background: #c8825a; color: #2a150b; }
    .de-form { display: flex; gap: 10px; padding: 12px 14px; background: #24130b; border-top: 1px solid rgba(224,160,110,.22); }
    .de-form input {
      flex: 1; background: #3a2116; border: 1px solid rgba(224,160,110,.3); border-radius: 14px;
      padding: 10px 14px; color: #f6e8d4; font-family: inherit; font-size: .92rem; outline: none;
    }
    .de-form input:focus { border-color: #f0b44c; }
    .de-form button {
      background: #f0b44c; color: #2a150b; border: none; border-radius: 14px; padding: 0 20px;
      font-weight: 700; font-family: inherit; font-size: .92rem; cursor: pointer; transition: .2s;
    }
    .de-form button:hover { background: #f3dcb8; }
  `;
  document.head.appendChild(style);

  // أيقونة الروبوت الذكي SVG
  const robotSvg = `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="32" y1="6" x2="32" y2="15" stroke="#f0b44c" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="32" cy="6" r="4" fill="#fffbe6"/>
      <rect x="12" y="15" width="40" height="32" rx="12" fill="#2e1a10" stroke="#f0b44c" stroke-width="3"/>
      <rect x="18" y="22" width="28" height="16" rx="7" fill="#42251a"/>
      <circle cx="25" cy="30" r="3.5" fill="#f0b44c"/>
      <circle cx="39" cy="30" r="3.5" fill="#f0b44c"/>
      <path d="M26 42 Q32 45 38 42" stroke="#f3dcb8" stroke-width="2.5" stroke-linecap="round"/>
      <rect x="6" y="25" width="4" height="12" rx="2" fill="#c8825a"/>
      <rect x="54" y="25" width="4" height="12" rx="2" fill="#c8825a"/>
      <path d="M20 52 C20 49 44 49 44 52 L46 57 H18 Z" fill="#f0b44c"/>
    </svg>
  `;

  // بناء واجهة الشات بوت في الصفحة
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <button id="de-bot-btn" aria-label="المساعد الذكي" title="اسأل المستكشف الذكي">${robotSvg}</button>
    <div id="de-bot-box" role="dialog" aria-label="المساعد التعليمي">
      <div class="de-head">
        <div class="de-head-info">
          <div class="de-head-icon" style="width:38px;height:38px;padding:4px;">${robotSvg}</div>
          <div><b>المستكشف الذكي</b><small>مساعدك في الدراسات الاجتماعية</small></div>
        </div>
        <button class="de-close" id="de-bot-x" aria-label="إغلاق">✕</button>
      </div>
      <div class="de-msgs" id="de-msgs">
        <div class="de-msg bot">أهلاً بك في <b>مركز المستكشف الرقمي</b>! 👋<br>أنا هنا لمساعدتك في دروس الجغرافيا والتاريخ للصف الثالث الإعدادي. اسألني عن أي درس أو اختر من الأزرار بالأسفل:</div>
      </div>
      <div class="de-chips">
        <button type="button" data-q="قارات العالم">🌍 قارات العالم</button>
        <button type="button" data-q="قسم التاريخ">🏺 قسم التاريخ</button>
        <button type="button" data-q="الخرائط الذكية">🗺️ الخرائط الذكية</button>
        <button type="button" data-q="محاكاة الشخصيات">🤖 محاكاة الشخصيات</button>
      </div>
      <form class="de-form" id="de-form">
        <input type="text" id="de-in" placeholder="اكتب سؤالك هنا..." autocomplete="off">
        <button type="submit">إرسال</button>
      </form>
    </div>
  `;
  document.body.appendChild(wrap);

  const btn = document.getElementById('de-bot-btn');
  const box = document.getElementById('de-bot-box');
  const msgs = document.getElementById('de-msgs');
  const input = document.getElementById('de-in');

  btn.onclick = () => box.classList.toggle('open');
  document.getElementById('de-bot-x').onclick = () => box.classList.remove('open');

  function addMsg(html, type) {
    const d = document.createElement('div');
    d.className = 'de-msg ' + type;
    d.innerHTML = html;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function getReply(text) {
    const q = text.trim().toLowerCase();
    for (const item of knowledgeBase) {
      if (item.keys.some(k => q.includes(k))) return item.reply;
    }
    return 'سؤال جميل! 🤔 جرب تسألني بكلمات أوضح مثل: <b>قارات العالم</b>، <b>قسم التاريخ</b>، <b>الخرائط الذكية</b>، أو <b>محاكاة الشخصيات</b>.';
  }

  function handleAsk(text) {
    if (!text.trim()) return;
    addMsg(text, 'usr');
    setTimeout(() => addMsg(getReply(text), 'bot'), 250);
  }

  document.getElementById('de-form').onsubmit = (e) => {
    e.preventDefault();
    handleAsk(input.value);
    input.value = '';
  };

  wrap.querySelectorAll('.de-chips button').forEach(b => {
    b.onclick = () => handleAsk(b.getAttribute('data-q'));
  });
})();
