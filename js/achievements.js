// نظام الشارات والإنجازات لمنصة BlocksCode

const BadgesDefinitions = [
    // شارات مسارات التعلم
    {
        id: 'html-master',
        name: 'مهندس HTML',
        description: 'أكملت جميع دروس HTML العشرة',
        icon: '🏗️',
        color: '#f97316',
        gradient: 'linear-gradient(135deg, #f97316, #ea580c)',
        condition: (progress) => {
            const htmlLessons = ['html-1','html-2','html-3','html-4','html-5','html-6','html-7','html-8','html-9','html-10'];
            return htmlLessons.every(id => progress.completedLessons.includes(id));
        }
    },
    {
        id: 'css-master',
        name: 'مصمم CSS',
        description: 'أكملت جميع دروس CSS العشرة',
        icon: '🎨',
        color: '#3b82f6',
        gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)',
        condition: (progress) => {
            const cssLessons = ['css-1','css-2','css-3','css-4','css-5','css-6','css-7','css-8','css-9','css-10'];
            return cssLessons.every(id => progress.completedLessons.includes(id));
        }
    },
    {
        id: 'js-master',
        name: 'مطوّر JavaScript',
        description: 'أكملت جميع دروس JavaScript العشرة',
        icon: '⚡',
        color: '#eab308',
        gradient: 'linear-gradient(135deg, #eab308, #ca8a04)',
        condition: (progress) => {
            const jsLessons = ['js-1','js-2','js-3','js-4','js-5','js-6','js-7','js-8','js-9','js-10'];
            return jsLessons.every(id => progress.completedLessons.includes(id));
        }
    },
    {
        id: 'full-stack',
        name: 'مطوّر متكامل',
        description: 'أكملت جميع الدروس الثلاثين!',
        icon: '🏆',
        color: '#a855f7',
        gradient: 'linear-gradient(135deg, #a855f7, #7c3aed)',
        condition: (progress) => progress.completedLessons.length >= 30
    },
    {
        id: 'first-step',
        name: 'الخطوة الأولى',
        description: 'أكملت درسك الأول',
        icon: '🌱',
        color: '#10b981',
        gradient: 'linear-gradient(135deg, #10b981, #059669)',
        condition: (progress) => progress.completedLessons.length >= 1
    },
    {
        id: 'halfway',
        name: 'في المنتصف',
        description: 'أكملت 15 درساً',
        icon: '🚀',
        color: '#6366f1',
        gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)',
        condition: (progress) => progress.completedLessons.length >= 15
    },
    {
        id: 'xp-500',
        name: 'جامع الخبرات',
        description: 'حصلت على 500 نقطة XP',
        icon: '⭐',
        color: '#f59e0b',
        gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
        condition: (progress) => progress.xp >= 500
    }
];

const AchievementsManager = {
    definitions: BadgesDefinitions,

    // التحقق من الشارات بعد كل إنجاز
    checkAll() {
        const progress = StorageManager.getProgress();
        const newBadges = [];

        this.definitions.forEach(badge => {
            if (!StorageManager.hasBadge(badge.id) && badge.condition(progress)) {
                const awarded = StorageManager.awardBadge(badge.id);
                if (awarded) newBadges.push(badge);
            }
        });

        // عرض إشعارات للشارات الجديدة
        if (newBadges.length > 0) {
            newBadges.forEach((badge, i) => {
                setTimeout(() => this.showBadgeNotification(badge), i * 1500);
            });
        }

        return newBadges;
    },

    // إشعار منبثق للشارة الجديدة
    showBadgeNotification(badge) {
        const existing = document.getElementById('badge-notification');
        if (existing) existing.remove();

        const notif = document.createElement('div');
        notif.id = 'badge-notification';
        notif.style.cssText = `
            position: fixed;
            bottom: 2rem;
            left: 2rem;
            background: ${badge.gradient};
            color: white;
            padding: 1.2rem 1.8rem;
            border-radius: 1rem;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            z-index: 99999;
            display: flex;
            align-items: center;
            gap: 1rem;
            font-family: 'Outfit', sans-serif;
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
            max-width: 350px;
            border: 1px solid rgba(255,255,255,0.2);
        `;
        notif.innerHTML = `
            <div style="font-size: 2.5rem;">${badge.icon}</div>
            <div>
                <div style="font-size:0.8rem; opacity:0.8; margin-bottom:2px;">🎉 شارة جديدة مكتسبة!</div>
                <div style="font-weight:700; font-size:1.1rem;">${badge.name}</div>
                <div style="font-size:0.85rem; opacity:0.9;">${badge.description}</div>
            </div>
        `;
        document.body.appendChild(notif);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                notif.style.transform = 'translateY(0)';
                notif.style.opacity = '1';
            });
        });

        setTimeout(() => {
            notif.style.transform = 'translateY(100px)';
            notif.style.opacity = '0';
            setTimeout(() => notif.remove(), 500);
        }, 4000);
    },

    // رسم شاشة التقدم الكاملة
    renderProgressPage(container) {
        const progress = StorageManager.getProgress();
        const levelInfo = StorageManager.getLevelInfo(progress.xp);
        const totalLessons = 30;
        const completedCount = progress.completedLessons.length;
        const completionPct = Math.round((completedCount / totalLessons) * 100);

        // إحصائيات المسارات
        const htmlCompleted = progress.completedLessons.filter(id => id.startsWith('html')).length;
        const cssCompleted  = progress.completedLessons.filter(id => id.startsWith('css')).length;
        const jsCompleted   = progress.completedLessons.filter(id => id.startsWith('js')).length;

        container.innerHTML = `
        <div class="progress-page">
            <div class="progress-hero">
                <h1>لوحة تقدمك <span class="gradient-text">🚀</span></h1>
                <p>تتبّع رحلتك في تعلم تطوير الويب</p>
            </div>

            <!-- بطاقة المستوى -->
            <div class="level-card glass-panel">
                <div class="level-icon">${levelInfo.current.icon}</div>
                <div class="level-info">
                    <div class="level-title">المستوى ${levelInfo.current.level} — ${levelInfo.current.title}</div>
                    <div class="level-xp">${progress.xp} XP ${levelInfo.next ? `/ ${levelInfo.next.minXP} XP للمستوى التالي` : '(الحد الأقصى!)'}</div>
                    <div class="xp-bar-wrapper">
                        <div class="xp-bar-fill" style="width: ${levelInfo.pct}%"></div>
                    </div>
                    <div class="xp-pct">${levelInfo.pct}%</div>
                </div>
                <div class="total-xp-badge">${progress.xp} <small>XP</small></div>
            </div>

            <!-- إحصائيات سريعة -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon" style="background:linear-gradient(135deg,#f97316,#ea580c)">🏗️</div>
                    <div class="stat-val">${htmlCompleted}/10</div>
                    <div class="stat-label">دروس HTML</div>
                    <div class="stat-bar"><div class="stat-bar-fill" style="width:${htmlCompleted*10}%;background:linear-gradient(90deg,#f97316,#ea580c)"></div></div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon" style="background:linear-gradient(135deg,#3b82f6,#2563eb)">🎨</div>
                    <div class="stat-val">${cssCompleted}/10</div>
                    <div class="stat-label">دروس CSS</div>
                    <div class="stat-bar"><div class="stat-bar-fill" style="width:${cssCompleted*10}%;background:linear-gradient(90deg,#3b82f6,#2563eb)"></div></div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon" style="background:linear-gradient(135deg,#eab308,#ca8a04)">⚡</div>
                    <div class="stat-val">${jsCompleted}/10</div>
                    <div class="stat-label">دروس JS</div>
                    <div class="stat-bar"><div class="stat-bar-fill" style="width:${jsCompleted*10}%;background:linear-gradient(90deg,#eab308,#ca8a04)"></div></div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon" style="background:linear-gradient(135deg,#6366f1,#4f46e5)">📊</div>
                    <div class="stat-val">${completedCount}/30</div>
                    <div class="stat-label">إجمالي الدروس</div>
                    <div class="stat-bar"><div class="stat-bar-fill" style="width:${completionPct}%;background:linear-gradient(90deg,#6366f1,#a855f7)"></div></div>
                </div>
            </div>

            <!-- شارات الإنجازات -->
            <div class="badges-section">
                <h2 class="section-title"><i class="fa-solid fa-trophy"></i> شارات الإنجازات</h2>
                <div class="badges-grid">
                    ${this.definitions.map(badge => {
                        const owned = progress.badges?.includes(badge.id);
                        return `
                        <div class="badge-card ${owned ? 'owned' : 'locked'}" title="${badge.description}">
                            <div class="badge-icon-big" style="${owned ? `background:${badge.gradient}` : ''}">
                                ${owned ? badge.icon : '🔒'}
                            </div>
                            <div class="badge-name">${badge.name}</div>
                            <div class="badge-desc">${badge.description}</div>
                            ${owned ? '<div class="badge-owned-tag">✅ مكتسبة</div>' : ''}
                        </div>`;
                    }).join('')}
                </div>
            </div>

            <!-- جدول المستويات -->
            <div class="levels-section">
                <h2 class="section-title"><i class="fa-solid fa-layer-group"></i> مسار المستويات</h2>
                <div class="levels-list">
                    ${LEVEL_TABLE.map(lvl => {
                        const active = lvl.level === levelInfo.current.level;
                        const done   = progress.xp >= lvl.minXP;
                        return `
                        <div class="level-row ${active ? 'active' : ''} ${done && !active ? 'done' : ''}">
                            <div class="level-row-icon">${lvl.icon}</div>
                            <div class="level-row-info">
                                <strong>المستوى ${lvl.level}: ${lvl.title}</strong>
                                <span>${lvl.minXP} — ${lvl.maxXP === 9999 ? '∞' : lvl.maxXP} XP</span>
                            </div>
                            <div class="level-row-status">${done ? (active ? '← أنت هنا' : '✅') : '🔒'}</div>
                        </div>`;
                    }).join('')}
                </div>
            </div>

            <div style="text-align:center; margin-top:3rem;">
                <a href="#/courses" class="btn btn-primary" style="font-size:1.1rem; padding:1rem 2rem;">
                    <i class="fa-solid fa-graduation-cap"></i> تابع التعلم
                </a>
            </div>
        </div>`;
    }
};

window.AchievementsManager = AchievementsManager;
window.BadgesDefinitions    = BadgesDefinitions;
