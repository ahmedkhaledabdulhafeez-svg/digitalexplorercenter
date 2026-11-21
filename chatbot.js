(function () {
  // تحديد المسار تلقائياً سواء الصفحة في الرئيسية أو جوه فولدر فرعي
  const isSubFolder = decodeURIComponent(location.pathname).includes('/قسم-') || decodeURIComponent(location.pathname).includes('/قسم ');
  const base = isSubFolder ? '../' : '';

  // قاعدة بيانات المساعد التعليمي (تقدر تزود فيها أسئلة وإجابات براحتك)
  const knowledgeBase = [
    {
      keys: ['مرحبا', 'اهلا', 'السلام', 'هاي', 'ازيك', 'صباح', 'مساء'],
      reply: 'أهلاً بك يا بطل في <b>مركز المستكشف الرقمي</b>! 🏺 أنا مساعدك التعليمي الذكي. اسألني عن أي درس في الجغرافيا أو التاريخ، أو اختار من الأزرار تحت 👇'
    },
    {
      keys: ['قارات', 'العالم', 'اسيا', 'أفريقيا', 'اوروبا', 'مساحة', 'موقع'],
      reply: '🌍 <b>قارات العالم:</b> ينقسم العالم إلى 7 قارات (آسيا أكبرها مساحة وأستراليا أصغرها).<br>تقدر تدخل تذاكر الدرس وتلعب نشاط الخريطة التفاعلي من <a href="' + base + 'قسم-الجغرافيا/درس-قارات-العالم-الموقع-والمساحة.html" style="color:#f0b44c;text-decoration:underline;">هنا</a>.'
    },
    {
      keys: ['محمد علي', 'تولية', 'حكم', 'مصر', 'تاريخ', 'المماليك', 'الزعامة'],
      reply: '🏺 <b>تولية محمد علي حكم مصر (1805م):</b> اختاره الشعب والزعامة الشعبية بقيادة عمر مكرم والياً على مصر، وواجه تحديات مثل حملة فريزر والمماليك.<br>ادخل على <a href="' + base + 'قسم التاريخ/قسم التاريخ.html" style="color:#f0b44c;text-decoration:underline;">قسم التاريخ</a> أو اسمع محمد علي بنفسه في <a href="' + base + 'محاكاة الشخصيات.html" style="color:#f0b44c;text-decoration:underline;">محاكاة الشخصيات</a>!'
    },
    {
      keys: ['خرائط', 'خريطة', 'ذكية'],
      reply: '🗺️ تقدر تستكشف القارات والتضاريس والدول بشكل تفاعلي من خلال صفحة <a href="' + base + 'readings.html" style="color:#f0b44c;text-decoration:underline;">الخرائط الجغرافية الذكية</a>.'
    },
    {
      keys: ['ذكاء', 'اصطناعي', 'شخصيات', 'محاكاة'],
      reply: '🤖 في قسم <a href="' + base + 'محاكاة الشخصيات.html" style="color:#f0b44c;text-decoration:underline;">محاكاة الشخصيات التاريخية</a> هتلاقي حكام وشخصيات تاريخية بيتكلموا عن نفسهم بالذكاء الاصطناعي!'
    },
    {
      keys: ['اعداد', 'مين', 'صمم', 'جامعة', 'اسوان', 'فريق'],
      reply: '🎓 تم تصميم وإعداد هذه المنصة بواسطة طلاب الفرقة الرابعة - قسم تكنولوجيا التعليم - كلية التربية النوعية - <b>جامعة أسوان</b>.'
    }
  ];

  // إضافة التنسيقات (CSS) بنفس ألوان المنصة
  const style = document.createElement('style');
  style.textContent = `
    #de-bot-btn {
      position: fixed; bottom: 24px; left: 24px; z-index: 9999;
      width: 62px; height: 62px; border-radius: 50%; border: 2px solid #f0b44c;
      background: linear-gradient(135deg, #c8825a, #42251a); color: #fff;
      font-size: 28px; cursor: pointer; box-shadow: 0 10px 30px rgba(0,0,0,.55), 0 0 20px rgba(240,180,76,.4);
      display: grid; place-items: center; transition: transform .3s;
    }
    #de-bot-btn:hover { transform: scale(1.08) rotate(-6deg); }
    #de-bot-box {
      position: fixed; bottom: 98px; left: 24px; z-index: 9999;
      width: 350px; max-width: calc(100vw - 36px); height: 470px; max-height: 75vh;
      background: #2e1a10; border: 1.5px solid #c8825a; border-radius: 24px;
      box-shadow: 0 24px 60px rgba(0,0,0,.7); display: none; flex-direction: column;
      overflow: hidden; font-family: 'Cairo', sans-serif; direction: rtl; color: #f6e8d4;
    }
    #de-bot-box.open { display: flex; animation: dePop .25s ease; }
    @keyframes dePop { from { opacity: 0; transform: translateY(15px) scale(.96); } to { opacity: 1; transform: none; } }
    .de-head {
      background: linear-gradient(90deg, #42251a, #5c3322); padding: 14px 18px;
      border-bottom: 1px solid rgba(224,160,110,.25); display: flex; align-items: center; justify-content: space-between;
    }
    .de-head b { font-family: 'Reem Kufi', sans-serif; color: #f0b44c; font-size: 1.05rem; display: block; }
    .de-head small { color: #c9ae94; font-size: .75rem; }
    .de-close { background: none; border: none; color: #f3dcb8; font-size: 1.3rem; cursor: pointer; }
    .de-msgs { flex: 1; padding: 14px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; }
    .de-msg { max-width: 85%; padding: 10px 14px; border-radius: 16px; font-size: .88rem; line-height: 1.6; }
    .de-msg.bot { background: #3a2116; border: 1px solid rgba(224,160,110,.22); align-self: flex-start; border-bottom-right-radius: 4px; }
    .de-msg.usr { background: #c8825a; color: #2a150b; font-weight: 700; align-self: flex-end; border-bottom-left-radius: 4px; }
    .de-chips { padding: 8px 12px; display: flex; gap: 6px; overflow-x: auto; border-top: 1px solid rgba(224,160,110,.15); scrollbar-width: none; }
    .de-chips::-webkit-scrollbar { display: none; }
    .de-chips button {
      flex-shrink: 0; background: rgba(200,130,90,.15); border: 1px solid #c8825a; color: #f3dcb8;
      padding: 4px 12px; border-radius: 99px; font-size: .76rem; font-family: inherit; cursor: pointer; transition: .2s;
    }
    .de-chips button:hover { background: #c8825a; color: #2a150b; }
    .de-form { display: flex; gap: 8px; padding: 10px 12px; background: #24130b; border-top: 1px solid rgba(224,160,110,.22); }
    .de-form input {
      flex: 1; background: #3a2116; border: 1px solid rgba(224,160,110,.3); border-radius: 12px;
      padding: 8px 12px; color: #f6e8d4; font-family: inherit; font-size: .88rem; outline: none;
    }
    .de-form input:focus { border-color: #f0b44c; }
    .de-form button {
      background: #f0b44c; color: #2a150b; border: none; border-radius: 12px; padding: 0 16px;
      font-weight: 700; font-family: inherit; cursor: pointer;
    }
  `;
  document.head.appendChild(style);

  // بناء واجهة الشات بوت في الصفحة
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <button id="de-bot-btn" aria-label="المساعد الذكي" title="اسأل المستكشف الذكي">🧭</button>
    <div id="de-bot-box" role="dialog" aria-label="المساعد التعليمي">
      <div class="de-head">
        <div><b>المستكشف الذكي 🏺</b><small>مساعدك في الدراسات الاجتماعية</small></div>
        <button class="de-close" id="de-bot-x" aria-label="إغلاق">✕</button>
      </div>
      <div class="de-msgs" id="de-msgs">
        <div class="de-msg bot">أهلاً بك في <b>مركز المستكشف الرقمي</b>! 👋<br>أنا هنا لمساعدتك في دروس الجغرافيا والتاريخ للصف الثالث الإعدادي. اسألني عن أي درس أو اختار من تحت:</div>
      </div>
      <div class="de-chips">
        <button type="button" data-q="قارات العالم">🌍 قارات العالم</button>
        <button type="button" data-q="محمد علي">🏺 محمد علي</button>
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
    return 'سؤال جميل! 🤔 جرب تسألني بكلمات أوضح مثل: <b>قارات العالم</b>، <b>محمد علي</b>، <b>الخرائط الذكية</b>، أو <b>محاكاة الشخصيات</b>.';
  }

  function handleAsk(text) {
    if (!text.trim()) return;
    addMsg(text, 'usr');
    setTimeout(() => addMsg(getReply(text), 'bot'), 300);
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
