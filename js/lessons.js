// بيانات محرك الدروس المتكامل لمنصة BlocksCode

const LessonsData = [
    // ==========================================
    // مسار HTML - 10 دروس
    // ==========================================
    {
        id: "html-1",
        course: "HTML",
        title: "الدرس 1: بداية الرحلة (النصوص)",
        description: "مرحباً بك في عالم تطوير الويب! لغة HTML هي الهيكل العظمي لأي موقع. لنبدأ بكتابة نصوص على الشاشة.",
        goal: "اسحب بلوك '<h1> - عنوان رئيسي' وبلوك '<p> - فقرة نصية' إلى مساحة العمل.",
        validator: (blocks) => {
            const hasH1 = blocks.some(b => b.tag === 'h1');
            const hasP = blocks.some(b => b.tag === 'p');
            return hasH1 && hasP;
        }
    },
    {
        id: "html-2",
        course: "HTML",
        title: "الدرس 2: تنسيق النصوص",
        description: "يمكنك جعل بعض الكلمات بارزة للفت انتباه القارئ.",
        goal: "أضف بلوك '<b> - نص غامق' وبلوك '<br> - سطر جديد'.",
        validator: (blocks) => {
            return blocks.some(b => b.tag === 'b') && blocks.some(b => b.tag === 'br');
        }
    },
    {
        id: "html-3",
        course: "HTML",
        title: "الدرس 3: القوائم النقطية",
        description: "القوائم مهمة جداً لترتيب العناصر، مثل قائمة المشتريات.",
        goal: "اسحب بلوك '<ul> - قائمة نقطية' وضع بداخله على الأقل عنصرين من نوع '<li> - عنصر قائمة'.",
        validator: (blocks) => {
            const ul = blocks.find(b => b.tag === 'ul');
            return ul && ul.children && ul.children.filter(c => c.tag === 'li').length >= 2;
        }
    },
    {
        id: "html-4",
        course: "HTML",
        title: "الدرس 4: إضافة الصور",
        description: "الموقع بدون صور هو موقع ممل! نستخدم وسم img لعرض الصور.",
        goal: "أضف بلوك '<img> - صورة'. قم بتغيير مسار الصورة (src) من المفتش إلى أي رابط آخر.",
        validator: (blocks) => {
            const img = blocks.find(b => b.tag === 'img');
            return img && img.attributes.src && img.attributes.src !== "https://via.placeholder.com/150";
        }
    },
    {
        id: "html-5",
        course: "HTML",
        title: "الدرس 5: الروابط التشعبية",
        description: "الإنترنت عبارة عن صفحات مترابطة عبر الروابط (Links).",
        goal: "أضف بلوك '<a> - رابط' واجعل خاصية (href) تشير إلى 'https://google.com'.",
        validator: (blocks) => {
            return blocks.some(b => b.tag === 'a' && b.attributes.href && b.attributes.href.includes('google'));
        }
    },
    {
        id: "html-6",
        course: "HTML",
        title: "الدرس 6: الحاويات (الصناديق)",
        description: "وسم div هو أهم وسم في HTML، فهو يعتبر صندوقاً فارغاً نجمع فيه العناصر لترتيبها.",
        goal: "أضف بلوك '<div> - حاوية عامة' وضع بداخله عنوان <h3>.",
        validator: (blocks) => {
            const div = blocks.find(b => b.tag === 'div');
            return div && div.children && div.children.some(c => c.tag === 'h3');
        }
    },
    {
        id: "html-7",
        course: "HTML",
        title: "الدرس 7: تقسيم الصفحة (Semantic)",
        description: "المواقع الحديثة تقسم إلى ترويسة، قسم رئيسي، وتذييل، ليتمكن متصفح جوجل من فهمها.",
        goal: "أضف بلوك '<header>' وبلوك '<section>'.",
        validator: (blocks) => {
            return blocks.some(b => b.tag === 'header') && blocks.some(b => b.tag === 'section');
        }
    },
    {
        id: "html-8",
        course: "HTML",
        title: "الدرس 8: الجداول",
        description: "تستخدم الجداول لعرض البيانات المنظمة مثل الإحصائيات.",
        goal: "أضف بلوك '<table>' وضع بداخله صف '<tr>' يحتوي على خلية بيانات '<td>'.",
        validator: (blocks) => {
            const table = blocks.find(b => b.tag === 'table');
            if (!table || !table.children) return false;
            const tr = table.children.find(c => c.tag === 'tr');
            return tr && tr.children && tr.children.some(cc => cc.tag === 'td');
        }
    },
    {
        id: "html-9",
        course: "HTML",
        title: "الدرس 9: نماذج الإدخال (Forms 1)",
        description: "كيف نأخذ بيانات من المستخدم؟ عبر حقول الإدخال.",
        goal: "أضف بلوك '<input>' وغير نوعه من المفتش إلى 'email' أو 'password'.",
        validator: (blocks) => {
            return blocks.some(b => b.tag === 'input' && (b.attributes.type === 'email' || b.attributes.type === 'password'));
        }
    },
    {
        id: "html-10",
        course: "HTML",
        title: "الدرس 10: إرسال البيانات (Forms 2)",
        description: "لإرسال البيانات نحتاج إلى نموذج وزر.",
        goal: "أضف حاوية '<form>' وضع بداخلها حقل '<input>' وزر '<button>'.",
        validator: (blocks) => {
            const form = blocks.find(b => b.tag === 'form');
            if (!form || !form.children) return false;
            return form.children.some(c => c.tag === 'input') && form.children.some(c => c.tag === 'button');
        }
    },

    // ==========================================
    // مسار CSS - 10 دروس
    // ==========================================
    {
        id: "css-1",
        course: "CSS",
        title: "الدرس 1: لغة الألوان",
        description: "لغة CSS هي فرشاة الرسم التي نلون بها موقعنا. نستطيع تحديد عنصر كامل (Tag) وتغيير لونه.",
        goal: "أضف بلوك 'تنسيق عنصر (Tag)'. اجعل المُحدد 'body'، وغير لون الخلفية إلى أي لون غير الأبيض.",
        validator: (blocks) => {
            const rule = blocks.find(b => b.tag === 'css-rule' && b.attributes.selector === 'body');
            return rule && rule.styles.backgroundColor && rule.styles.backgroundColor !== '#ffffff';
        }
    },
    {
        id: "css-2",
        course: "CSS",
        title: "الدرس 2: الخطوط والمحاذاة",
        description: "يمكننا جعل النصوص تبدو أجمل بكثير.",
        goal: "أضف تنسيق عنصر للمُحدد 'h1'. اجعل حجم الخط '30px' والمحاذاة 'center'.",
        validator: (blocks) => {
            const rule = blocks.find(b => b.tag === 'css-rule' && b.attributes.selector === 'h1');
            return rule && rule.styles.fontSize && rule.styles.textAlign === 'center';
        }
    },
    {
        id: "css-3",
        course: "CSS",
        title: "الدرس 3: الفئات (Classes)",
        description: "الفئات تميز عناصر معينة لتنسيقها دون التأثير على البقية. تبدأ الفئة دائماً بنقطة (.).",
        goal: "أنشئ 'تنسيق فئة' باسم '.card'. أضف '<div>' في مساحة العمل واكتب في حقل الفئة بالمفتش كلمة 'card'.",
        validator: (blocks) => {
            const hasRule = blocks.some(b => b.tag === 'css-rule' && b.attributes.selector === '.card');
            const hasDiv = blocks.some(b => b.tag === 'div' && b.attributes.class === 'card');
            return hasRule && hasDiv;
        }
    },
    {
        id: "css-4",
        course: "CSS",
        title: "الدرس 4: الهوامش الداخلية (Padding)",
        description: "الـ Padding يوسع المسافة داخل الصندوق بين الإطار والمحتوى.",
        goal: "في تنسيق '.card'، أضف هوامش داخلية (Padding) بقيمة '20px'.",
        validator: (blocks) => {
            const rule = blocks.find(b => b.attributes.selector === '.card');
            return rule && rule.styles.padding === '20px';
        }
    },
    {
        id: "css-5",
        course: "CSS",
        title: "الدرس 5: الحدود والاستدارة",
        description: "لنجعل الصندوق يبدو كبطاقة حقيقية.",
        goal: "أضف استدارة (Border Radius) بقيمة '10px' لتنسيق الفئة '.card'.",
        validator: (blocks) => {
            const rule = blocks.find(b => b.attributes.selector === '.card');
            return rule && rule.styles.borderRadius && rule.styles.borderRadius.includes('10');
        }
    },
    {
        id: "css-6",
        course: "CSS",
        title: "الدرس 6: الظلال (Box Shadow)",
        description: "الظلال تعطي عمقاً (3D) لتصميمك.",
        goal: "أضف ظلاً للبطاقة '.card'. اكتب في حقل الظل: '0 4px 8px #000'.",
        validator: (blocks) => {
            const rule = blocks.find(b => b.attributes.selector === '.card');
            return rule && rule.styles.boxShadow;
        }
    },
    {
        id: "css-7",
        course: "CSS",
        title: "الدرس 7: التوزيع السحري (Flexbox)",
        description: "الـ Flex هو أحدث وأقوى طريقة لترتيب العناصر بجوار بعضها.",
        goal: "أضف بلوك 'حاوية مرنة (Flex)'. ضع بداخلها 3 أزرار '<button>'.",
        validator: (blocks) => {
            const flexDiv = blocks.find(b => b.styles && b.styles.display === 'flex');
            return flexDiv && flexDiv.children && flexDiv.children.filter(c => c.tag === 'button').length >= 3;
        }
    },
    {
        id: "css-8",
        course: "CSS",
        title: "الدرس 8: التفاعل (Hover)",
        description: "نستطيع تغيير التنسيق فقط عندما يمر الماوس فوق العنصر.",
        goal: "أضف بلوك 'تأثير التحويم'. اجعل المُحدد '.card:hover' وغير لون الخلفية فيه.",
        validator: (blocks) => {
            const hover = blocks.find(b => b.tag === 'css-rule' && b.attributes.selector && b.attributes.selector.includes(':hover'));
            return hover && hover.styles.backgroundColor;
        }
    },
    {
        id: "css-9",
        course: "CSS",
        title: "الدرس 9: نعومة الانتقال (Transition)",
        description: "تأثيرات المرور تبدو قاسية بدون انتقال سلس.",
        goal: "عد للـ '.card' العادية (ليس الـ hover) وأضف تأثير انتقال (Transition) بقيمة '0.3s ease'.",
        validator: (blocks) => {
            const rule = blocks.find(b => b.attributes.selector === '.card');
            return rule && rule.styles.transition;
        }
    },
    {
        id: "css-10",
        course: "CSS",
        title: "الدرس 10: متجاوب مع الجوال",
        description: "المواقع الحديثة يجب أن تتغير لتناسب شاشة الهاتف.",
        goal: "أضف بلوك 'شاشات الجوال (Mobile)'. استهدف '.card' واجعل عرضها (Width) 100% باستخدام إضافة خاصية العرض (إذا لم تجدها غير حجم الخط).",
        validator: (blocks) => {
            return blocks.some(b => b.tag === 'css-media-mobile');
        }
    },

    // ==========================================
    // مسار JS - 10 دروس
    // ==========================================
    {
        id: "js-1",
        course: "JS",
        title: "الدرس 1: التحدث مع المتصفح",
        description: "أوامر جافاسكريبت تنفذ إجراءات حقيقية. لنقم بإظهار رسالة منبثقة.",
        goal: "أضف بلوك 'رسالة تنبيه (Alert)' واكتب فيها 'مرحباً جافاسكريبت!'.",
        validator: (blocks) => {
            return blocks.some(b => b.tag === 'alert' && b.attributes.message !== 'مرحباً!');
        }
    },
    {
        id: "js-2",
        course: "JS",
        title: "الدرس 2: التحدث مع المبرمج",
        description: "أحياناً نريد طباعة رسائل خفية لا يراها سوى المبرمج في الـ Console.",
        goal: "أضف بلوك 'طباعة (Console Log)'.",
        validator: (blocks) => {
            return blocks.some(b => b.tag === 'console-log');
        }
    },
    {
        id: "js-3",
        course: "JS",
        title: "الدرس 3: الأحداث (Events)",
        description: "الأكواد لا يجب أن تعمل فوراً، بل يجب أن تنتظر تفاعل المستخدم.",
        goal: "أضف زر '<button>' في الواجهة. ثم أضف بلوك 'عند الضغط (Click)' وضع داخله رسالة الـ Alert.",
        validator: (blocks) => {
            const btn = blocks.find(b => b.tag === 'button');
            const click = blocks.find(b => b.tag === 'event-click');
            return btn && click && click.children && click.children.some(c => c.tag === 'alert');
        }
    },
    {
        id: "js-4",
        course: "JS",
        title: "الدرس 4: الذاكرة (المتغيرات)",
        description: "المتغيرات هي صناديق نحفظ فيها البيانات.",
        goal: "أضف بلوك 'إنشاء متغير'، سمه 'points'، واعطه القيمة '10'.",
        validator: (blocks) => {
            return blocks.some(b => b.tag === 'var-declare' && b.attributes.varName === 'points' && b.attributes.varValue === '10');
        }
    },
    {
        id: "js-5",
        course: "JS",
        title: "الدرس 5: التعديل الحي (DOM 1)",
        description: "يمكن لجافاسكريبت قراءة الصفحة وتغييرها.",
        goal: "أضف '<h1>'. ثم أضف بلوك 'تغيير نص العنصر' واستهدف 'h1' بنص جديد.",
        validator: (blocks) => {
            const h1 = blocks.find(b => b.tag === 'h1');
            const change = blocks.find(b => b.tag === 'change-text' && b.attributes.targetSelector.includes('h1'));
            return h1 && change;
        }
    },
    {
        id: "js-6",
        course: "JS",
        title: "الدرس 6: إخفاء وإظهار",
        description: "إضافة وحذف الفئات (Classes) برمجياً هو أساس تفاعل الواجهات.",
        goal: "أضف بلوك 'تبديل فئة (Toggle Class)'.",
        validator: (blocks) => {
            return blocks.some(b => b.tag === 'js-toggle-class');
        }
    },
    {
        id: "js-7",
        course: "JS",
        title: "الدرس 7: قراءة المدخلات",
        description: "التطبيق الذكي يقرأ ما يكتبه المستخدم.",
        goal: "أضف '<input>' واجعل مُعرفه (id) هو 'username'. ثم أضف بلوك 'قراءة قيمة من حقل' واستهدف '#username'.",
        validator: (blocks) => {
            const inp = blocks.find(b => b.tag === 'input' && b.attributes.id === 'username');
            const read = blocks.find(b => b.tag === 'var-from-input' && b.attributes.inputId === '#username');
            return inp && read;
        }
    },
    {
        id: "js-8",
        course: "JS",
        title: "الدرس 8: اتخاذ القرارات (If)",
        description: "البرنامج يتخذ مسارات مختلفة بناءً على الشروط.",
        goal: "أضف بلوك 'شرط (If)'. واجعل الشرط 'points > 5'.",
        validator: (blocks) => {
            return blocks.some(b => b.tag === 'if-condition' && b.attributes.condition.includes('5'));
        }
    },
    {
        id: "js-9",
        course: "JS",
        title: "الدرس 9: التكرار (Loops)",
        description: "الكمبيوتر لا يمل من التكرار!",
        goal: "أضف بلوك 'تكرار (For Loop)' واجعله يتكرر '3' مرات.",
        validator: (blocks) => {
            return blocks.some(b => b.tag === 'loop-for' && b.attributes.times === '3');
        }
    },
    {
        id: "js-10",
        course: "JS",
        title: "الدرس 10: المؤقتات",
        description: "أحياناً نحتاج لتأجيل كود ليعمل بعد ثوانٍ معينة.",
        goal: "أضف بلوك 'مؤقت (Timeout)' واجعله '2000' ميلي ثانية (ثانيتين).",
        validator: (blocks) => {
            return blocks.some(b => b.tag === 'timer-timeout' && b.attributes.delayMs === '2000');
        }
    },

    // ==========================================
    // مسار HTML المتقدم - دروس 11-15
    // ==========================================
    {
        id: "html-11",
        course: "HTML",
        title: "الدرس 11: HTML الدلالي (Semantic)",
        description: "المواقع الاحترافية تستخدم وسوماً دلالية تساعد محركات البحث وقارئات الشاشة على فهم هيكل الصفحة.",
        goal: "أضف بلوك '<article>' وبلوك '<aside>' من فئة Semantic.",
        validator: (blocks) => {
            const flat = (arr) => arr.flatMap(b => [b, ...(b.children ? flat(b.children) : [])]);
            const all = flat(blocks);
            return all.some(b => b.tag === 'article') && all.some(b => b.tag === 'aside');
        }
    },
    {
        id: "html-12",
        course: "HTML",
        title: "الدرس 12: الـ Figure والـ Figcaption",
        description: "لعرض صورة مع تعليق وصفي نستخدم figure وfigcaption — وهذا أفضل لـ SEO من div عادي.",
        goal: "أضف بلوك '<figure>' وضع بداخله '<img>' و'<figcaption>'.",
        validator: (blocks) => {
            const flat = (arr) => arr.flatMap(b => [b, ...(b.children ? flat(b.children) : [])]);
            const all = flat(blocks);
            const fig = all.find(b => b.tag === 'figure');
            if (!fig || !fig.children) return false;
            return fig.children.some(c => c.tag === 'img') && fig.children.some(c => c.tag === 'figcaption');
        }
    },
    {
        id: "html-13",
        course: "HTML",
        title: "الدرس 13: حقول الإدخال المتقدمة",
        description: "HTML5 أضاف أنواعاً جديدة من حقول الإدخال تتحقق من البيانات تلقائياً.",
        goal: "أضف حقل '<input>' وغير نوعه إلى 'number' أو 'date' أو 'range' من المفتش.",
        validator: (blocks) => {
            const flat = (arr) => arr.flatMap(b => [b, ...(b.children ? flat(b.children) : [])]);
            const all = flat(blocks);
            return all.some(b => b.tag === 'input' && ['number','date','range','color','tel','url'].includes(b.attributes.type));
        }
    },
    {
        id: "html-14",
        course: "HTML",
        title: "الدرس 14: القائمة المنسدلة الديناميكية",
        description: "عنصر Select مع Options يبني قائمة منسدلة — أساس كل نموذج ويب احترافي.",
        goal: "أضف بلوك '<select>' وضع بداخله 3 عناصر '<option>' على الأقل.",
        validator: (blocks) => {
            const flat = (arr) => arr.flatMap(b => [b, ...(b.children ? flat(b.children) : [])]);
            const all = flat(blocks);
            const sel = all.find(b => b.tag === 'select');
            return sel && sel.children && sel.children.filter(c => c.tag === 'option').length >= 3;
        }
    },
    {
        id: "html-15",
        course: "HTML",
        title: "الدرس 15: تضمين الفيديو والصوت",
        description: "HTML5 يدعم تشغيل الوسائط مباشرة في المتصفح بدون Flash.",
        goal: "أضف بلوك '<video>' أو '<audio>' من فئة Media.",
        validator: (blocks) => {
            const flat = (arr) => arr.flatMap(b => [b, ...(b.children ? flat(b.children) : [])]);
            const all = flat(blocks);
            return all.some(b => b.tag === 'video' || b.tag === 'audio');
        }
    },

    // ==========================================
    // مسار CSS المتقدم - دروس 11-20
    // ==========================================
    {
        id: "css-11",
        course: "CSS",
        title: "الدرس 11: شبكة CSS Grid",
        description: "CSS Grid هو أقوى نظام لتوزيع العناصر في صفوف وأعمدة معاً — مختلف عن Flex.",
        goal: "أضف بلوك 'Grid' من فئة Structure (display:grid). ضع بداخله 3 عناصر div على الأقل.",
        validator: (blocks) => {
            const flat = (arr) => arr.flatMap(b => [b, ...(b.children ? flat(b.children) : [])]);
            const all = flat(blocks);
            const grid = all.find(b => b.styles && b.styles.display === 'grid');
            return grid && grid.children && grid.children.length >= 3;
        }
    },
    {
        id: "css-12",
        course: "CSS",
        title: "الدرس 12: متغيرات CSS",
        description: "متغيرات CSS (Custom Properties) تسمح لك بتعريف قيم مرة واحدة واستخدامها في كل مكان.",
        goal: "أضف بلوك 'CSS Raw' من Custom Code واكتب متغيراً مثل: :root { --primary: #6366f1; }",
        validator: (blocks) => {
            const flat = (arr) => arr.flatMap(b => [b, ...(b.children ? flat(b.children) : [])]);
            const all = flat(blocks);
            return all.some(b => b.tag === 'custom-css' && b.attributes.rawCode && b.attributes.rawCode.includes('--'));
        }
    },
    {
        id: "css-13",
        course: "CSS",
        title: "الدرس 13: الموضع الثابت (Position Fixed)",
        description: "العناصر ذات position:fixed تبقى في مكانها حتى عند التمرير — مثال: شريط التنقل.",
        goal: "أضف '<div>' وعيّن له تنسيق CSS بالمُحدد '.navbar'. أضف position: fixed فيه.",
        validator: (blocks) => {
            const flat = (arr) => arr.flatMap(b => [b, ...(b.children ? flat(b.children) : [])]);
            const all = flat(blocks);
            return all.some(b => b.tag === 'css-rule' && b.styles && b.styles.position === 'fixed');
        }
    },
    {
        id: "css-14",
        course: "CSS",
        title: "الدرس 14: تأثير Glassmorphism",
        description: "أسلوب التصميم الأكثر شيوعاً في 2024 — زجاج شفاف بتأثير ضبابي رائع.",
        goal: "أضف تنسيق '.glass' وضع فيه: background مع rgba وbackdrop-filter: blur. اكتبه في Custom CSS.",
        validator: (blocks) => {
            const flat = (arr) => arr.flatMap(b => [b, ...(b.children ? flat(b.children) : [])]);
            const all = flat(blocks);
            return all.some(b =>
                b.tag === 'custom-css' && b.attributes.rawCode &&
                b.attributes.rawCode.includes('backdrop-filter') &&
                b.attributes.rawCode.includes('blur')
            );
        }
    },
    {
        id: "css-15",
        course: "CSS",
        title: "الدرس 15: Pseudo-elements قبل وبعد",
        description: "::before و::after يضيفان محتوى زخرفياً دون تغيير الـ HTML — سر الكثير من التصاميم الجميلة.",
        goal: "أضف في Custom CSS قاعدة تستخدم '::before' أو '::after' مع content.",
        validator: (blocks) => {
            const flat = (arr) => arr.flatMap(b => [b, ...(b.children ? flat(b.children) : [])]);
            const all = flat(blocks);
            return all.some(b =>
                b.tag === 'custom-css' && b.attributes.rawCode &&
                (b.attributes.rawCode.includes('::before') || b.attributes.rawCode.includes('::after')) &&
                b.attributes.rawCode.includes('content')
            );
        }
    },
    {
        id: "css-16",
        course: "CSS",
        title: "الدرس 16: تأثيرات الفلتر",
        description: "خاصية filter تضيف تأثيرات بصرية مذهلة مثل التعتيم، تدرج الرمادي، والإضاءة.",
        goal: "أضف تنسيق CSS لعنصر img. أضف فيه filter: grayscale(100%) أو blur() باستخدام Custom CSS.",
        validator: (blocks) => {
            const flat = (arr) => arr.flatMap(b => [b, ...(b.children ? flat(b.children) : [])]);
            const all = flat(blocks);
            return all.some(b =>
                b.tag === 'custom-css' && b.attributes.rawCode &&
                b.attributes.rawCode.includes('filter')
            );
        }
    },
    {
        id: "css-17",
        course: "CSS",
        title: "الدرس 17: Keyframes والأنيميشن",
        description: "@keyframes تُعرّف مراحل الحركة — من نقطة البداية إلى النهاية.",
        goal: "أضف في Custom CSS قاعدة @keyframes باسم اختياري، ثم طبّق animation على عنصر.",
        validator: (blocks) => {
            const flat = (arr) => arr.flatMap(b => [b, ...(b.children ? flat(b.children) : [])]);
            const all = flat(blocks);
            return all.some(b =>
                b.tag === 'custom-css' && b.attributes.rawCode &&
                b.attributes.rawCode.includes('@keyframes')
            );
        }
    },
    {
        id: "css-18",
        course: "CSS",
        title: "الدرس 18: تحسين الصور للشاشات",
        description: "object-fit تتحكم في كيفية احتواء الصورة داخل إطارها — مثل cover و contain.",
        goal: "أضف '<img>' وفي تنسيقه اجعل object-fit: cover وعيّن له ارتفاعاً ثابتاً.",
        validator: (blocks) => {
            const flat = (arr) => arr.flatMap(b => [b, ...(b.children ? flat(b.children) : [])]);
            const all = flat(blocks);
            return all.some(b =>
                b.tag === 'custom-css' && b.attributes.rawCode &&
                b.attributes.rawCode.includes('object-fit')
            ) || all.some(b =>
                b.tag === 'css-rule' && b.styles && b.styles.objectFit
            );
        }
    },
    {
        id: "css-19",
        course: "CSS",
        title: "الدرس 19: منهجية BEM",
        description: "BEM (Block__Element--Modifier) طريقة تسمية احترافية للفئات تجعل الكود منظماً وقابلاً للصيانة.",
        goal: "أضف '<div>' وعيّن له class مثل 'card__title' أو 'btn--primary' في المفتش.",
        validator: (blocks) => {
            const flat = (arr) => arr.flatMap(b => [b, ...(b.children ? flat(b.children) : [])]);
            const all = flat(blocks);
            return all.some(b => b.attributes && b.attributes.class &&
                (b.attributes.class.includes('__') || b.attributes.class.includes('--'))
            );
        }
    },
    {
        id: "css-20",
        course: "CSS",
        title: "الدرس 20: مشروع — بطاقة احترافية",
        description: "الآن طبّق كل ما تعلمته: اصنع بطاقة (card) كاملة باستخدام Flexbox، ظل، استدارة، وتأثير hover.",
        goal: "أنشئ '<div>' بفئة 'card' يحتوي على صورة وعنوان وفقرة وزر. أضف تنسيقات hover وtransition.",
        validator: (blocks) => {
            const flat = (arr) => arr.flatMap(b => [b, ...(b.children ? flat(b.children) : [])]);
            const all = flat(blocks);
            const card = all.find(b => b.tag === 'div' && b.attributes && b.attributes.class === 'card');
            if (!card || !card.children) return false;
            const hasImg = card.children.some(c => c.tag === 'img');
            const hasText = card.children.some(c => ['h1','h2','h3','p'].includes(c.tag));
            const hasBtn = card.children.some(c => c.tag === 'button' || c.tag === 'a');
            return hasImg && hasText && hasBtn;
        }
    },

    // ==========================================
    // مسار JS المتقدم - دروس 11-15
    // ==========================================
    {
        id: "js-11",
        course: "JS",
        title: "الدرس 11: المصفوفات (Arrays)",
        description: "المصفوفة قائمة مرتبة من العناصر — مثل قائمة أسماء الطلاب أو نقاط اللعبة.",
        goal: "أضف بلوك 'Array' من JS Logic. سمّه 'students' وأضف 3 عناصر على الأقل.",
        validator: (blocks) => {
            const flat = (arr) => arr.flatMap(b => [b, ...(b.children ? flat(b.children) : [])]);
            const all = flat(blocks);
            return all.some(b => b.tag === 'array-declare' && b.attributes.varName === 'students');
        }
    },
    {
        id: "js-12",
        course: "JS",
        title: "الدرس 12: الكائنات (Objects)",
        description: "الكائن مجموعة من خصائص ذات أسماء وقيم — مثل بيانات مستخدم: الاسم والعمر.",
        goal: "أضف بلوك 'Object' وسمّه 'user'. أضف فيه على الأقل خاصيتين مثل: name وage.",
        validator: (blocks) => {
            const flat = (arr) => arr.flatMap(b => [b, ...(b.children ? flat(b.children) : [])]);
            const all = flat(blocks);
            return all.some(b =>
                b.tag === 'object-declare' &&
                b.attributes.varName === 'user' &&
                b.attributes.keys && b.attributes.keys.includes(':')
            );
        }
    },
    {
        id: "js-13",
        course: "JS",
        title: "الدرس 13: الدوال (Functions)",
        description: "الدوال كتلة كود قابلة لإعادة الاستخدام — اكتبها مرة واستدعها متى شئت.",
        goal: "أضف بلوك 'Function' وسمّه 'greet'. ضع بداخله بلوك Alert.",
        validator: (blocks) => {
            const flat = (arr) => arr.flatMap(b => [b, ...(b.children ? flat(b.children) : [])]);
            const all = flat(blocks);
            const fn = all.find(b => b.tag === 'func-declare' && b.attributes.funcName === 'greet');
            return fn && fn.children && fn.children.some(c => c.tag === 'alert' || c.tag === 'console-log');
        }
    },
    {
        id: "js-14",
        course: "JS",
        title: "الدرس 14: التكرار على المصفوفات (forEach)",
        description: "forEach تمر على كل عنصر في المصفوفة وتنفّذ عليه كوداً — بديل أنيق عن حلقة for.",
        goal: "أضف بلوك 'forEach'. استهدف مصفوفة موجودة وضع بداخله Console Log.",
        validator: (blocks) => {
            const flat = (arr) => arr.flatMap(b => [b, ...(b.children ? flat(b.children) : [])]);
            const all = flat(blocks);
            const fe = all.find(b => b.tag === 'loop-foreach');
            return fe && fe.children && fe.children.length > 0;
        }
    },
    {
        id: "js-15",
        course: "JS",
        title: "الدرس 15: معالجة الأخطاء (Try/Catch)",
        description: "الكود الاحترافي يتوقع الأخطاء ويتعامل معها بدلاً من تعطّل التطبيق.",
        goal: "أضف بلوك 'Try/Catch'. ضع بداخله أي كود وتأكد أن الـ catch موجود.",
        validator: (blocks) => {
            const flat = (arr) => arr.flatMap(b => [b, ...(b.children ? flat(b.children) : [])]);
            const all = flat(blocks);
            return all.some(b => b.tag === 'try-catch');
        }
    }
];

const LessonsManager = {
    lessons: LessonsData,
    currentLessonId: null,

    async loadLessons() {
        this.lessons = LessonsData.map(l => ({...l, xpReward: 50}));
    },

    getLessonById(id) {
        return this.lessons.find(l => l.id === id) || null;
    },

    startLesson(id) {
        this.currentLessonId = id;
        const lesson = this.lessons.find(l => l.id === id);
        if (!lesson) return;

        this.startTime = Date.now();
        this.currentHintIndex = 0;
        this.usedHints = 0;
        AppState.clearWorkspace();

        // رقم الدرس الكلي
        const lessonIndex = this.lessons.findIndex(l => l.id === id);
        const totalLessons = this.lessons.length;
        const isCompleted  = StorageManager.isLessonCompleted(id);

        const panel = document.getElementById('lesson-instructions');
        if (panel) {
            const trackColors = { HTML: '#f97316', CSS: '#3b82f6', JS: '#eab308' };
            const trackColor  = trackColors[lesson.course] || '#6366f1';
            panel.innerHTML = `
                <div class="lesson-header" style="display:flex;align-items:center;gap:1rem;flex-wrap:wrap;">
                    <span class="badge" style="background:${trackColor};color:${lesson.course==='JS'?'#1e293b':'#fff'}">
                        ${lesson.course}
                    </span>
                    <h3 style="margin:0;flex:1;">${lesson.title}</h3>
                    <span style="font-size:0.8rem;color:var(--text-muted)">
                        ${lessonIndex + 1} / ${totalLessons}
                        ${isCompleted ? ' ✅' : ''}
                    </span>
                </div>
                <div class="lesson-content" style="margin-top:0.8rem;">
                    <p style="font-size:0.9rem;color:var(--text-muted);margin-bottom:0.8rem;">${lesson.description}</p>
                    <div class="lesson-goal">
                        <strong><i class="fa-solid fa-bullseye"></i> المهمة:</strong><br>
                        <span style="font-size:0.9rem;">${lesson.goal}</span>
                    </div>
                    <div style="margin-top: 15px;">
                        <button class="btn btn-info btn-sm" onclick="LessonsManager.showNextHint()">
                            <i class="fa-solid fa-lightbulb"></i> احصل على تلميح
                        </button>
                        <div id="hint-container" style="margin-top: 10px; font-size: 0.85rem; color: var(--warning); display:none; padding: 10px; background: rgba(245, 158, 11, 0.1); border-radius: 8px; border: 1px solid var(--warning);"></div>
                    </div>
                </div>
            `;
        }
    },

    getHints(lesson) {
        if (lesson.hints && lesson.hints.length > 0) return lesson.hints;
        return [
            "ابحث عن البلوك المناسب من القائمة الجانبية (Blocks).",
            "قم بإضافة البلوك وتحديده لتظهر لك خصائصه في الـ Inspector المفتش الجانبي.",
            "تأكد من تعيين القيم في المفتش تماماً كما هو مطلوب في المهمة."
        ];
    },

    showNextHint() {
        const lesson = this.lessons.find(l => l.id === this.currentLessonId);
        if (!lesson) return;
        
        const hints = this.getHints(lesson);
        const container = document.getElementById('hint-container');
        
        if (this.currentHintIndex < hints.length) {
            container.style.display = 'block';
            container.innerHTML += `<div style="margin-bottom:5px;"><strong>💡 تلميح ${this.currentHintIndex + 1}:</strong> ${hints[this.currentHintIndex]}</div>`;
            this.currentHintIndex++;
            this.usedHints++;
        } else {
            if(window.showToast) showToast('لا توجد تلميحات إضافية لهذا الدرس.', 'info');
        }
    },

    checkSolution(blocks) {
        const lesson = this.lessons.find(l => l.id === this.currentLessonId);
        if (!lesson) return;

        const isCorrect = lesson.validator(blocks);

        if (isCorrect) {
            const alreadyDone = StorageManager.isLessonCompleted(lesson.id);
            const timeSpent = this.startTime ? Math.floor((Date.now() - this.startTime) / 1000) : 0;

            // إضافة XP وتسجيل الإكمال
            if (!alreadyDone) {
                let xpReward = lesson.xpReward || 10;
                if (timeSpent < 120) {
                    if(window.showToast) showToast('⚡ سريع جداً! مكافأة سرعة!', 'info');
                    xpReward += 5;
                }
                
                // تقليل الـ XP إذا استخدم تلميحات
                if (this.usedHints > 0) {
                    const penalty = this.usedHints * 2;
                    xpReward = Math.max(2, xpReward - penalty);
                    if(window.showToast) showToast(`تم خصم ${penalty} XP لاستخدام التلميحات`, 'warning');
                }
                
                StorageManager.addXP(xpReward);
                StorageManager.markLessonCompleted(lesson.id, timeSpent);
                updateXPDisplay();
                // التحقق من الشارات الجديدة
                AchievementsManager.checkAll();
            }

            // تحديث زر التحقق
            const checkBtn = document.getElementById('btn-check-lesson');
            const originalHTML = checkBtn ? checkBtn.innerHTML : '';
            if (checkBtn) {
                checkBtn.innerHTML = '<i class="fa-solid fa-star"></i> ' + (alreadyDone ? 'محلول بالفعل! 🎉' : 'أحسنت! عمل رائع');
                checkBtn.className = 'btn btn-warning';
            }

            // احتفال مرئي
            this._showCelebration();

            setTimeout(() => {
                if (checkBtn) {
                    checkBtn.innerHTML = originalHTML;
                    checkBtn.className = 'btn btn-success';
                }
                const currentIndex = this.lessons.findIndex(l => l.id === this.currentLessonId);
                
                const nextAction = () => {
                    if (currentIndex < this.lessons.length - 1) {
                        window.location.hash = `#/lesson/${this.lessons[currentIndex + 1].id}`;
                    } else {
                        showToast('🏆 تهانينا! أنهيت جميع الدروس!', 'success');
                        window.location.hash = '#/progress';
                    }
                };

                if (window.QuizManager) {
                    QuizManager.startQuiz(currentIndex + 1, nextAction);
                } else {
                    nextAction();
                }
            }, 2500);

        } else {
            showToast('❌ حاول مرة أخرى! البلوكات لا تحقق المطلوب.', 'error');
            const checkBtn = document.getElementById('btn-check-lesson');
            if (checkBtn) {
                checkBtn.classList.add('shake');
                setTimeout(() => checkBtn.classList.remove('shake'), 600);
            }
        }
    },

    _showCelebration() {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position:fixed;top:0;left:0;width:100vw;height:100vh;
            pointer-events:none;z-index:9999;
            display:flex;align-items:center;justify-content:center;
            background:rgba(0,0,0,0.1);
        `;
        overlay.innerHTML = `
            <div style="text-align:center;animation:bounceIn 0.5s ease;">
                <div style="font-size:5rem;">🎉</div>
                <h1 style="color:#fff;font-family:Outfit,sans-serif;font-size:2.5rem;text-shadow:0 4px 20px rgba(0,0,0,0.5);">عمل مذهل!</h1>
                <p style="color:rgba(255,255,255,0.9);font-family:Outfit,sans-serif;font-size:1.2rem;">+50 XP</p>
            </div>
        `;
        document.body.appendChild(overlay);
        setTimeout(() => {
            overlay.style.transition = 'opacity 0.5s';
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 500);
        }, 2000);
    }
};

window.LessonsData    = LessonsData;
window.LessonsManager = LessonsManager;
