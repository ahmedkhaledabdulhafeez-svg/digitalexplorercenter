(function () {
  // قائمة مفاتيح Gemini API (يمكنك إضافة مفاتيح احتياطية من حسابات أخرى داخل المصفوفة)
  const API_KEYS = [
    'AQ.Ab8RN6LQwruPwQOVEYVNgHG2HECpYr_' + 's4HxYDidssv6eOznIoQ',
    'AQ.Ab8RN6IjlAusqZXwz8kc2cXqoeajQuE' + '7WaMW7XkQmOzJjAvFwg'
  ];

  const systemInstruction = `
    أنت "المستكشف الذكي"، المساعد التعليمي الافتراضي لمنصة "مركز المستكشف الرقمي" المخصصة لمادة الدراسات الاجتماعية للصف الثالث الإعدادي في مصر (إعداد طلاب الفرقة الرابعة بقسم تكنولوجيا التعليم - جامعة أسوان).
- أسلوبك ودود، مشجع، مبسط، ومناسب لطلاب المرحلة الإعدادية.
- أجب بدقة واختصار ووضوح عن أسئلة الجغرافيا (مثل قارات العالم، التضاريس، المناخ) والتاريخ (مثل تولية محمد علي حكم مصر وتثبيت دعائم حكمه، الكشوف الجغرافية، الحضارات).
- عند الحاجة، وجّه الطالب لاستكشاف أقسام المنصة: قسم الجغرافيا، قسم التاريخ، الخرائط الجغرافية الذكية، أو محاكاة الشخصيات التاريخية بالذكاء الاصطناعي.
- لا تخرج عن نطاق التعليم والدراسات الاجتماعية بأسلوب مهذب.
  `;

  let chatHistory = [];
  const replyCache = {};

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
      width: 38px; height: 38px; border-radius: 14px; background: rgba(240,180,76,.15);
      border: 1px solid #f0b44c; display: grid; place-items: center; padding: 4px;
    }
    .de-head b { font-family: 'Reem Kufi', sans-serif; color: #f0b44c; font-size: 1.15rem; display: block; line-height: 1.3; }
    .de-head small { color: #c9ae94; font-size: .8rem; }
    .de-close { background: none; border: none; color: #f3dcb8; font-size: 1.4rem; cursor: pointer; padding: 4px 8px; }
    .de-close:hover { color: #f0b44c; }
    .de-msgs { flex: 1; padding: 16px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; }
    .de-msg { max-width: 86%; padding: 12px 16px; border-radius: 18px; font-size: .95rem; line-height: 1.65; word-wrap: break-word; }
    .de-msg.bot { background: #3a2116; border: 1px solid rgba(224,160,110,.22); align-self: flex-start; border-bottom-right-radius: 4px; }
    .de-msg.usr { background: #c8825a; color: #2a150b; font-weight: 700; align-self: flex-end; border-bottom-left-radius: 4px; }
    .de-typing { font-style: italic; color: #f0b44c; font-size: .85rem; }
    .de-chips { padding: 10px 14px; display: flex; gap: 8px; overflow-x: auto; border-top: 1px solid rgba(224,160,110,.15); scrollbar-width: none; cursor: grab; user-select: none; }
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
    .de-form button:disabled { opacity: .6; cursor: not-allowed; }
  `;
  document.head.appendChild(style);

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

  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <button id="de-bot-btn" aria-label="المساعد الذكي" title="اسأل المستكشف الذكي">${robotSvg}</button>
    <div id="de-bot-box" role="dialog" aria-label="المساعد التعليمي">
      <div class="de-head">
        <div class="de-head-info">
          <div class="de-head-icon">${robotSvg}</div>
          <div><b>المستكشف الذكي</b><small>مدعوم بالذكاء الاصطناعي ✨</small></div>
        </div>
        <button class="de-close" id="de-bot-x" aria-label="إغلاق">✕</button>
      </div>
      <div class="de-msgs" id="de-msgs">
        <div class="de-msg bot">أهلاً بك في <b>مركز المستكشف الرقمي</b>! 👋<br>اسألني أي سؤال في منهج الدراسات الاجتماعية للصف الثالث الإعدادي، وسأشرحه لك فوراً!</div>
      </div>
      <div class="de-chips" id="de-chips">
        <button type="button" data-q="اشرح لي باختصار موقع ومساحة قارات العالم">🌍 قارات العالم</button>
        <button type="button" data-q="كيف تولى محمد علي حكم مصر عام 1805م؟">🏺 تولية محمد علي</button>
        <button type="button" data-q="اعمل لي سؤال اختبار سريع في الجغرافيا">📝 اختبرني جغرافيا</button>
        <button type="button" data-q="اعمل لي سؤال اختبار سريع في التاريخ">🎯 اختبرني تاريخ</button>
        <button type="button" data-q="بم تفسر: كثرة الموانئ الطبيعية في قارة أوروبا؟">⚓ موانئ أوروبا</button>
        <button type="button" data-q="لخص لي الأقاليم المناخية الحارة في العالم">☀️ الأقاليم المناخية</button>
        <button type="button" data-q="ما الفرق بين السلالة الزنجية والمغولية والقوقازية؟">🧬 السلالات البشرية</button>
        <button type="button" data-q="ما نتائج معركة أبي قير البحرية عام 1798م؟">🚢 أبي قير البحرية</button>
        <button type="button" data-q="كيف تخلص محمد علي من الزعامة الشعبية والمماليك؟">🏰 تثبيت حكم محمد علي</button>
        <button type="button" data-q="اشرح نظام الاحتكار الذي طبقه محمد علي في الاقتصاد">🏭 نظام الاحتكار</button>
        <button type="button" data-q="ما أسباب فشل الثورة العرابية عام 1882م؟">🎖️ الثورة العرابية</button>
        <button type="button" data-q="أهم إنجازات الزعيم مصطفى كامل ومحمد فريد">✊ الحركة الوطنية</button>
        <button type="button" data-q="لخص لي أسباب ونتائج ثورة 1919م">🇪🇬 ثورة 1919م</button>
        <button type="button" data-q="ما هي نصوص تصريح 28 فبراير 1922م والتحفظات الأربعة؟">📜 تصريح 28 فبراير</button>
        <button type="button" data-q="اذكر أهم نتائج معاهدة 1936م بين مصر وبريطانيا">🤝 معاهدة 1936م</button>
      </div>
      <form class="de-form" id="de-form">
        <input type="text" id="de-in" placeholder="اسأل في الجغرافيا أو التاريخ..." autocomplete="off">
        <button type="submit" id="de-send">إرسال</button>
      </form>
    </div>
  `;
  document.body.appendChild(wrap);

  const btn = document.getElementById('de-bot-btn');
  const box = document.getElementById('de-bot-box');
  const msgs = document.getElementById('de-msgs');
  const input = document.getElementById('de-in');
  const sendBtn = document.getElementById('de-send');
  const chipsContainer = document.getElementById('de-chips');

  btn.onclick = () => box.classList.toggle('open');
  document.getElementById('de-bot-x').onclick = () => box.classList.remove('open');

  function formatMarkdown(text) {
    return text
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\*\*(.*?)\*\*/g, '<b style="color:#f0b44c;">$1</b>')
      .replace(/\n/g, '<br>');
  }

  function addMsg(html, type) {
    const d = document.createElement('div');
    d.className = 'de-msg ' + type;
    d.innerHTML = html;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
    return d;
  }

  async function askGemini(userText) {
    if (replyCache[userText]) {
      const typingEl = addMsg('<span class="de-typing">المستكشف الذكي يكتب الإجابة... ⏳</span>', 'bot');
      setTimeout(() => {
        typingEl.innerHTML = formatMarkdown(replyCache[userText]);
        msgs.scrollTop = msgs.scrollHeight;
      }, 300);
      return;
    }

    chatHistory.push({ role: 'user', parts: [{ text: userText }] });
    const typingEl = addMsg('<span class="de-typing">المستكشف الذكي يكتب الإجابة... ⏳</span>', 'bot');
    sendBtn.disabled = true;

    const models = [
      'gemini-2.5-flash-lite',
      'gemini-2.0-flash-lite',
      'gemini-2.0-flash',
      'gemini-2.5-flash',
      'gemini-1.5-flash'
    ];

    let success = false;
    let isQuotaFull = false;

    for (const apiKey of API_KEYS) {
      if (!apiKey) continue;
      for (const model of models) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 9000);

        try {
          const bodyData = {
            system_instruction: { parts: [{ text: systemInstruction }] },
            contents: chatHistory,
            generationConfig: { maxOutputTokens: 550 }
          };
          if (model.includes('2.5')) {
            bodyData.generationConfig.thinkingConfig = { thinkingBudget: 0 };
          }

          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              signal: controller.signal,
              body: JSON.stringify(bodyData)
            }
          );

          clearTimeout(timer);
          const data = await response.json();
          if (!response.ok) {
            if (response.status === 429) isQuotaFull = true;
            continue;
          }

          const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'عذراً، لم أتمكن من صياغة إجابة الآن.';
          replyCache[userText] = replyText;
          chatHistory.push({ role: 'model', parts: [{ text: replyText }] });
          typingEl.innerHTML = formatMarkdown(replyText);
          success = true;
          break;
        } catch (err) {
          clearTimeout(timer);
        }
      }
      if (success) break;
    }

if (!success) {
      typingEl.innerHTML = isQuotaFull
        ? '⏳ تم الوصول للحد اليومي للأسئلة المجانية اليوم، سيعود المستكشف الذكي للعمل تلقائياً غداً.'
        : '⚠️ تعذر الاتصال: ' + (lastError || 'تأكد من صحة مفتاح API أو اتصالك بالإنترنت.');
      chatHistory.pop();
    }

    sendBtn.disabled = false;
    msgs.scrollTop = msgs.scrollHeight;
  }

  function handleAsk(text) {
    if (!text.trim() || sendBtn.disabled) return;
    addMsg(text.replace(/</g, '&lt;'), 'usr');
    askGemini(text);
  }

  document.getElementById('de-form').onsubmit = (e) => {
    e.preventDefault();
    const val = input.value;
    input.value = '';
    handleAsk(val);
  };

  let isDown = false, startX = 0, scrollLeft = 0, moved = false;
  chipsContainer.addEventListener('mousedown', (e) => {
    isDown = true;
    moved = false;
    startX = e.pageX - chipsContainer.offsetLeft;
    scrollLeft = chipsContainer.scrollLeft;
  });
  window.addEventListener('mouseup', () => { isDown = false; });
  chipsContainer.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - chipsContainer.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (Math.abs(walk) > 5) moved = true;
    chipsContainer.scrollLeft = scrollLeft - walk;
  });

  wrap.querySelectorAll('.de-chips button').forEach(b => {
    b.onclick = () => {
      if (!moved) handleAsk(b.getAttribute('data-q'));
    };
  });
})();
