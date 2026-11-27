(function () {
  // قائمة مفاتيح Gemini API (ضع مفتاحك الثاني مكان النص الموضح بالأسفل)
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

  // إجابات نموذجية فورية للأسئلة السريعة لتوفير رصيد API والرد اللحظي
  const presetAnswers = {
    'اشرح لي باختصار موقع ومساحة قارات العالم': `🌍 **قارات العالم من حيث المساحة (من الأكبر للأصغر):**
1. **آسيا:** أكبر القارات (44.2 مليون كم²).
2. **أفريقيا:** ثاني القارات (30.3 مليون كم²).
3. **أمريكا الشمالية:** (24.2 مليون كم²).
4. **أمريكا الجنوبية:** (17.8 مليون كم²).
5. **القطبية الجنوبية (أنتاركتيكا):** (12.3 مليون كم²) وهي قارة متجمدة غير مأهولة بالسكان.
6. **أوروبا:** (10.5 مليون كم²).
7. **أستراليا (الأوقيانوسية):** أصغر القارات (7.8 مليون كم²).
💡 *تُسمى آسيا وأفريقيا وأوروبا بقارات العالم القديم، بينما باقي القارات هي قارات العالم الجديد.*`,

    'كيف تولى محمد علي حكم مصر عام 1805م؟': `🏺 **تولية محمد علي حكم مصر (13 مايو 1805م):**
- استغل محمد علي ثورة الشعب المصري ضد الوالي العثماني **خورشيد باشا** بسبب فرض الضرائب الباهظة.
- جهر بالانضمام إلى العلماء والمشايخ والأهالي، وتعهد ببذل قصارى جهده لرفع الضريبة عن الناس.
- اجتمع زعماء الشعب والعلماء بقيادة **عمر مكرم** في **دار المحكمة (بيت القاضي)** يوم 13 مايو 1805م، وقرروا عزل خورشيد باشا وتعيين محمد علي والياً على مصر بشروطهم.
- اضطر السلطان العثماني لإصدار فرمان بتعيينه في يوليو 1805م استجابة لإرادة الشعب.`,

    'بم تفسر: كثرة الموانئ الطبيعية في قارة أوروبا؟': `⚓ **بم تفسر كثرة الموانئ الطبيعية في أوروبا؟**
- بسبب **كثرة تعاريج سواحلها وكثرة الجزر** بها، مما ساعد على إنشاء الموانئ الطبيعية وسهولة اتصالها بالعالم الخارجي.`,

    'لخص لي الأقاليم المناخية الحارة في العالم': `☀️ **الأقاليم المناخية الحارة (تمتد بين دائرتي عرض 30° شمالاً وجنوباً):**
1. **الإقليم الاستوائي وشبه الاستوائي:** حار ممطر طوال العام (حوض الكونغو، حوض الأمازون، جزر إندونيسيا).
2. **الإقليم المداري الحار (السوداني):** حار ممطر صيفاً وجاف شتاءً، وتنمو به حشائش السافانا.
3. **الإقليم الموسمي:** غزير المطر صيفاً وجاف شتاءً (الهند والهند الصينية)، وتنمو به أشجار جوز الهند.
4. **الإقليم الصحراوي الحار:** شديد الحرارة صيفاً وشديد البرودة شتاءً ونادر الأمطار.`,

    'ما الفرق بين السلالة الزنجية والمغولية والقوقازية؟': `🧬 **السلالات البشرية الرئيسية في العالم:**
1. **السلالة الزنجية (10%):** البشرة الداكنة، الأنف العريض، الشعر الأجعد، الشفاه الغليظة (تتركز في أفريقيا).
2. **السلالة المغولية (40%):** البشرة الصفراء، العيون المنحرفة، الشعر الأسود المسترسل (تتركز في شرق وجنوب شرق آسيا).
3. **السلالة القوقازية (50%):** البشرة البيضاء الوردية، الشعر المتموج، الشفاه الرفيعة (تنتشر في أوروبا والأمريكتين وشمال أفريقيا).`,

    'ما نتائج معركة أبي قير البحرية عام 1798م؟': `🚢 **نتائج معركة أبي قير البحرية (أغسطس 1798م):**
1. تحطيم وإغراق الأسطول الفرنسي على يد الأسطول الإنجليزي بقيادة **نيلسون**.
2. القضاء على آمال فرنسا في السيطرة على سواحل البحر المتوسط.
3. حرمان الحملة الفرنسية في مصر من إمدادات فرنسا لها.
4. شعور الجنود الفرنسيين بأنهم محاصرون داخل مصر، وتوقف حركة التجارة الخارجية لمصر.`,

    'كيف تخلص محمد علي من الزعامة الشعبية والمماليك؟': `🏰 **انفراد محمد علي بحكم مصر:**
- **الزعامة الشعبية:** استغل انقسام القيادات الشعبية حول مكانة **عمر مكرم**، فقام بخلعه من نقابة الأشراف ونفيه إلى **دمياط** عام 1809م.
- **المماليك:** حرمهم من تولي المناصب الرفيعة مثل مشيخة البلد، وطاردهم في كل مكان، ثم دبر لهم **مذبحة القلعة** في مارس 1811م وتخلص منهم نهائياً.`,

    'اشرح نظام الاحتكار الذي طبقه محمد علي في الاقتصاد': `🏭 **نظام الاحتكار في عهد محمد علي:**
هو نظام تقوم فيه الحكومة ممثلة في محمد علي بتحديد نوع الغلات التي تزرع ونوع المصنوعات التي تنتج، وتحديد أثمان شرائها من المنتجين وأثمان بيعها في السوق، وذلك لضمان الدخول في سوق التجارة الدولية منافساً لغيره من الدول.`,

    'ما أسباب فشل الثورة العرابية عام 1882م؟': `🎖️ **أسباب فشل الثورة العرابية:**
1. عدم تكافؤ القوة العسكرية بين قوات الاحتلال البريطاني والقوات المصرية.
2. تواطؤ إدارة شركة قناة السويس (ديليسبس) مع الإنجليز والسماح لهم بالمرور في القناة.
3. إصدار السلطان العثماني منشوراً بإعلان **عصيان عرابي**، مما أضعف الروح المعنوية للمصريين.
4. عدم إدراك قيادة الثورة لأهمية التعبئة الشعبية لمساندة القوات المصرية.`,

    'أهم إنجازات الزعيم مصطفى كامل ومحمد فريد': `✊ **كفاح الحركة الوطنية ضد الاحتلال:**
- **مصطفى كامل:** أسس جريدة اللواء (1900م) والحزب الوطني (1907م)، وندد بجرائم الاحتلال في الداخل والخارج خاصة بعد **حادثة دنشواي (1906م)** مما أدى لاستقالة اللورد كرومر.
- **محمد فريد:** طالب بإنشاء مجلس نيابي ونقابات للعمال، وأنشأ مدارس الشعب الليلية لتعليم الفقراء مجاناً، ونجح في إجبار الحكومة على رفض مد امتياز شركة قناة السويس 40 عاماً أخرى.`,

    'لخص لي أسباب ونتائج ثورة 1919م': `🇪🇬 **ثورة 1919م:**
- **الأسباب:** ازدياد الوعي الوطني، الإجراءات العنيفة التي اتخذتها بريطانيا أثناء الحرب العالمية الأولى، إعلان مبادئ الرئيس الأمريكي ويلسون، ورفض سلطات الاحتلال سفر الوفد المصري برئاسة **سعد زغلول** إلى مؤتمر الصلح بباريس ونفيه إلى جزيرة مالطا.
- **النتائج:** عزل السير ونجت وتعيين الجنرال اللنبي، الإفراج عن سعد زغلول والسماح له بالسفر لباريس، وإرسال لجنة ملنر للتفاوض.`,

    'ما هي نصوص تصريح 28 فبراير 1922م والتحفظات الأربعة؟': `📜 **تصريح 28 فبراير 1922م:**
اعترفت فيه بريطانيا بمصر دولة مستقلة ذات سيادة، وأنهت الحماية البريطانية عليها، مع وجود **4 تحفظات**:
1. تأمين المواصلات البريطانية في مصر.
2. الدفاع عن مصر ضد أي اعتداء أجنبي.
3. حماية المصالح الأجنبية وحماية الأقليات في مصر.
4. استمرار أوضاع السودان وفقاً لاتفاقية الحكم الثنائي عام 1899م.`,

    'اذكر أهم نتائج معاهدة 1936م بين مصر وبريطانيا': `🤝 **نتائج معاهدة 1936م:**
1. انتهاء احتلال مصر عسكرياً مع بقاء قوات بريطانية في منطقة قناة السويس.
2. انضمام مصر إلى عضوية **عصبة الأمم** باعتبارها دولة مستقلة.
3. إلغاء الامتيازات الأجنبية وفقاً لمؤتمر مونترو (1937م).
4. عودة الجيش المصري إلى السودان وتقوية الجيش المصري ليتمكن من الدفاع عن القناة.`
  };

  // أسئلة اختبار عشوائية متجددة بدون استهلاك API
  const geoQuizzes = [
    `📝 **سؤال جغرافيا سريع:**\nبم تفسر: ضيق السهول الساحلية في غرب أمريكا الجنوبية؟\n\n*(فكر في الإجابة، ثم اكتبها لي وسأصححها لك!)*`,
    `📝 **سؤال جغرافيا سريع:**\nما المقصود بـ **الدولة الجزرية**؟ مع ذكر مثالين من قارة آسيا.\n\n*(اكتب إجابتك في مربع الرسائل وسأراجعها معك!)*`,
    `📝 **سؤال جغرافيا سريع:**\nأين تقع أعلى قمة جبلية في العالم؟ وما اسم السلسلة الجبلية التي تنتمي إليها؟\n\n*(أرسل إجابتك الآن!)*`
  ];

  const hisQuizzes = [
    `🎯 **سؤال تاريخ سريع:**\nمن هو قائد الأسطول الإنجليزي الذي حطم الأسطول الفرنسي في معركة أبي قير البحرية عام 1798م؟\n\n*(اكتب إجابتك وسأصححها لك فوراً!)*`,
    `🎯 **سؤال تاريخ سريع:**\nما النتائج المترتبة على: مذبحة القلعة في مارس 1811م؟\n\n*(أرسل إجابتك الآن!)*`,
    `🎯 **سؤال تاريخ سريع:**\nفي عهد أي من حكام مصر تم حفر ترعة الإبراهيمية وافتتاح قناة السويس للملاحة؟\n\n*(اكتب إجابتك وسأراجعها معك!)*`
  ];

  // استخراج اسم ثنائي (عربي أو إنجليزي حسب المتوفر) لرسالة الترحيب داخل نافذة الشات
  function getTwoPartStudentName() {
    let raw = '';
    try {
      const uid = window.__explorerUid || '';
      if (uid) {
        const savedProfile = localStorage.getItem('explorerStudentProfile_' + uid);
        if (savedProfile) {
          const parsed = JSON.parse(savedProfile);
          raw = (parsed.nameAr || parsed.nameEn || '').trim();
        }
      }
      if (!raw) {
        raw = (
          localStorage.getItem('explorerUserName') ||
          sessionStorage.getItem('explorerUserName') ||
          ''
        ).trim();
      }
    } catch (e) {}

    if (!raw) return '';
    if (raw.includes('@')) {
      raw = raw.split('@')[0].replace(/[._-]+/g, ' ').trim();
    }
    const parts = raw.split(/\s+/).filter(Boolean);
    return parts.slice(0, 2).join(' ');
  }

  function buildOpenedChatGreetingHTML() {
    const twoName = getTwoPartStudentName();
    const who = twoName ? `يا <b>${twoName.replace(/</g, '&lt;')}</b>` : 'يا بطل';
    return `أهلاً بك ${who} في <b>مركز المستكشف الرقمي</b>! 👋<br>اسألني أي سؤال في منهج الدراسات الاجتماعية للصف الثالث الإعدادي، وسأشرحه لك فوراً!`;
  }

  // إضافة التنسيقات (CSS) بما فيها الرسالة المنبثقة فوق البوت
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

    /* فقاعة الإشعار المنبثقة فوق زر البوت (مثل ماسنجر) */
    #de-toast {
      position: fixed; bottom: 106px; right: 26px; z-index: 9998;
      max-width: 290px; background: linear-gradient(145deg, #42251a, #2e1a10);
      border: 1.5px solid #f0b44c; color: #f6e8d4; padding: 12px 16px;
      border-radius: 18px 18px 4px 18px; font-family: 'Cairo', sans-serif;
      font-size: .88rem; line-height: 1.55; direction: rtl; cursor: pointer;
      box-shadow: 0 16px 40px rgba(0,0,0,.65), 0 0 20px rgba(240,180,76,.25);
      opacity: 0; transform: translateY(14px) scale(.95); pointer-events: none;
      transition: opacity .35s ease, transform .35s cubic-bezier(.25,.8,.25,1);
    }
    #de-toast.show { opacity: 1; transform: translateY(0) scale(1); pointer-events: auto; }
    #de-toast::after {
      content: ""; position: absolute; bottom: -8px; right: 24px;
      width: 14px; height: 14px; background: #2e1a10;
      border-right: 1.5px solid #f0b44c; border-bottom: 1.5px solid #f0b44c;
      transform: rotate(45deg);
    }
    #de-toast-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
    #de-toast-head b { color: #f0b44c; font-size: .82rem; font-family: 'Reem Kufi', sans-serif; }
    #de-toast-x { background: none; border: none; color: #c9ae94; font-size: 1rem; cursor: pointer; padding: 0 4px; line-height: 1; }
    #de-toast-x:hover { color: #f0b44c; }
    #de-toast-txt { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }

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
    <div id="de-toast" role="status" aria-live="polite">
      <div id="de-toast-head">
        <b>🤖 المستكشف الذكي</b>
        <button type="button" id="de-toast-x" aria-label="إغلاق الإشعار">✕</button>
      </div>
      <div id="de-toast-txt"></div>
    </div>
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
        <div class="de-msg bot" id="de-welcome-msg">${buildOpenedChatGreetingHTML()}</div>
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
  const welcomeMsgEl = document.getElementById('de-welcome-msg');
  const input = document.getElementById('de-in');
  const sendBtn = document.getElementById('de-send');
  const chipsContainer = document.getElementById('de-chips');
  const toast = document.getElementById('de-toast');
  const toastTxt = document.getElementById('de-toast-txt');
  let toastTimer = null;

  function refreshOpenedGreetingIfPristine() {
    if (welcomeMsgEl && chatHistory.length === 0) {
      welcomeMsgEl.innerHTML = buildOpenedChatGreetingHTML();
    }
  }

  function openChatBox() {
    hideToast();
    refreshOpenedGreetingIfPristine();
    box.classList.add('open');
  }

  // دالة إظهار فقاعة الإشعار فوق زر البوت عندما يكون الشات مغلقاً
  function showToast(text, duration = 6000) {
    if (box.classList.contains('open')) return;
    const cleanText = text.replace(/\*\*/g, '').replace(/\*/g, '').replace(/\n+/g, ' ');
    toastTxt.textContent = cleanText;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  function hideToast() {
    clearTimeout(toastTimer);
    toast.classList.remove('show');
  }

  // إظهار فقاعة ترحيبية ذكية بعد 3 ثوانٍ من فتح الصفحة
  setTimeout(() => {
    if (!box.classList.contains('open')) {
      showToast('أهلاً بك يا بطل! 👋 عندك سؤال في الجغرافيا أو التاريخ؟ اضغط هنا واسألني فوراً!', 6500);
    }
  }, 3000);

  toast.onclick = (e) => {
    if (e.target.id === 'de-toast-x') {
      e.stopPropagation();
      hideToast();
      return;
    }
    openChatBox();
  };

  btn.onclick = () => {
    if (box.classList.contains('open')) {
      box.classList.remove('open');
    } else {
      openChatBox();
    }
  };
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
    // 1. الرد الفوري من الإجابات النموذجية المحفوظة أو الاختبارات العشوائية (بدون استهلاك API)
    let instantReply = presetAnswers[userText] || replyCache[userText];
    if (userText === 'اعمل لي سؤال اختبار سريع في الجغرافيا') {
      instantReply = geoQuizzes[Math.floor(Math.random() * geoQuizzes.length)];
    } else if (userText === 'اعمل لي سؤال اختبار سريع في التاريخ') {
      instantReply = hisQuizzes[Math.floor(Math.random() * hisQuizzes.length)];
    }

    if (instantReply) {
      const typingEl = addMsg('<span class="de-typing">المستكشف الذكي يكتب الإجابة... ⏳</span>', 'bot');
      setTimeout(() => {
        chatHistory.push({ role: 'user', parts: [{ text: userText }] });
        chatHistory.push({ role: 'model', parts: [{ text: instantReply }] });
        typingEl.innerHTML = formatMarkdown(instantReply);
        msgs.scrollTop = msgs.scrollHeight;
        showToast(instantReply, 6000);
      }, 450);
      return;
    }

    // 2. الاتصال بالذكاء الاصطناعي للأسئلة الحرة
    chatHistory.push({ role: 'user', parts: [{ text: userText }] });
    const typingEl = addMsg('<span class="de-typing">المستكشف الذكي يكتب الإجابة... ⏳</span>', 'bot');
    sendBtn.disabled = true;

    const models = [
      'gemini-2.5-flash',
      'gemini-2.5-flash-lite',
      'gemini-3-flash-preview',
      'gemini-flash-latest'
    ];

    let success = false;
    let isQuotaFull = false;

    for (const apiKey of API_KEYS) {
      if (!apiKey || apiKey.includes('ضع_هنا')) continue;
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
          showToast(replyText, 6500);
          success = true;
          break;
        } catch (err) {
          clearTimeout(timer);
        }
      }
      if (success) break;
    }

    if (!success) {
      const errMsg = isQuotaFull
        ? '⏳ تم الوصول للحد اليومي للأسئلة الحرة اليوم، يمكنك استخدام الأسئلة السريعة بالأسفل أو العودة غداً!'
        : '⚠️ الخادم مزدحم حالياً، حاول مرة أخرى بعد قليل.';
      typingEl.innerHTML = errMsg;
      showToast(errMsg, 5000);
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
