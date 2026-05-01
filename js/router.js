// توجيه مبسط للتطبيق SPA - نسخة محسّنة مع صفحات جديدة

const routes = {
    '/':         'home-template',
    '/courses':  'courses-template',
    '/playground': 'editor-template',
    '/lesson':   'editor-template',
    '/progress': 'progress-template'
};

async function router() {
    const app = document.getElementById('app');
    if (!app) return;

    let path     = window.location.hash.slice(1) || '/';
    let pathBase = path.split('/')[1] ? `/${path.split('/')[1]}` : '/';
    let params   = path.split('/')[2];
    
    // تحديث روابط التنقل النشطة
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active-nav');
        if (link.getAttribute('href') === `#${pathBase}` || 
            (pathBase === '/' && link.getAttribute('href') === '#/')) {
            link.classList.add('active-nav');
        }
    });
    
    const templateId = routes[pathBase] || routes['/'];
    const template   = document.getElementById(templateId);
    
    if (!template) return;
    
    // تأثير انتقال سلس
    app.style.opacity = '0';
    app.style.transform = 'translateY(8px)';
    
    await new Promise(r => setTimeout(r, 150));
    
    app.innerHTML = '';
    app.appendChild(template.content.cloneNode(true));
    
    requestAnimationFrame(() => {
        app.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        app.style.opacity    = '1';
        app.style.transform  = 'translateY(0)';
    });
    
    // إيقاف الحفظ التلقائي عند الخروج من الملعب
    StorageManager.stopAutoSave();
    
    if (templateId === 'editor-template') {
        initEditor();
        
        if (pathBase === '/lesson' && params) {
            AppState.isPlayground = false;
            
            const instructionPanel = document.getElementById('lesson-panel-wrapper');
            if (instructionPanel) instructionPanel.style.display = 'block';
            
            await LessonsManager.loadLessons();
            LessonsManager.startLesson(params);
            
            const checkBtn = document.getElementById('btn-check-lesson');
            if (checkBtn) {
                checkBtn.style.display = 'inline-flex';
                checkBtn.onclick = () => LessonsManager.checkSolution(AppState.workspaceBlocks);
            }
            
        } else if (pathBase === '/playground') {
            AppState.isPlayground = true;
            
            const instructionPanel = document.getElementById('lesson-panel-wrapper');
            if (instructionPanel) instructionPanel.style.display = 'none';
            
            const checkBtn = document.getElementById('btn-check-lesson');
            if (checkBtn) checkBtn.style.display = 'none';
            
            // محاولة تحميل مشروع مشارك من URL
            const sharedProject = StorageManager.decodeProjectFromURL();
            if (sharedProject && Array.isArray(sharedProject)) {
                AppState.workspaceBlocks = sharedProject;
                AppState.notify();
                showToast('📂 تم تحميل المشروع المشارك!', 'success');
            } else {
                // تحميل بيانات الملعب المحفوظة
                const savedBlocks = StorageManager.loadPlayground();
                if (savedBlocks && savedBlocks.length > 0) {
                    AppState.workspaceBlocks = savedBlocks;
                    AppState.notify();
                } else {
                    AppState.clearWorkspace();
                }
            }
            
            // بدء الحفظ التلقائي
            StorageManager.startAutoSave();
        }
        
    } else if (templateId === 'courses-template') {
        await LessonsManager.loadLessons();
        renderCourses();
        
    } else if (templateId === 'progress-template') {
        const progressContainer = document.getElementById('progress-container');
        if (progressContainer) {
            AchievementsManager.renderProgressPage(progressContainer);
        }
    } else if (templateId === 'home-template') {
        renderHomeStats();
    }
}

// عرض إحصائيات سريعة في الصفحة الرئيسية
function renderHomeStats() {
    const progress  = StorageManager.getProgress();
    const levelInfo = StorageManager.getLevelInfo(progress.xp);
    
    const statsEl = document.getElementById('home-stats');
    if (statsEl) {
        statsEl.innerHTML = `
            <div class="home-stat">
                <span class="home-stat-icon">${levelInfo.current.icon}</span>
                <span class="home-stat-val">${levelInfo.current.title}</span>
                <span class="home-stat-label">مستواك</span>
            </div>
            <div class="home-stat">
                <span class="home-stat-icon">⭐</span>
                <span class="home-stat-val">${progress.xp}</span>
                <span class="home-stat-label">نقطة XP</span>
            </div>
            <div class="home-stat">
                <span class="home-stat-icon">📚</span>
                <span class="home-stat-val">${progress.completedLessons.length}/30</span>
                <span class="home-stat-label">درس مكتمل</span>
            </div>
            <div class="home-stat">
                <span class="home-stat-icon">🏅</span>
                <span class="home-stat-val">${progress.badges?.length || 0}</span>
                <span class="home-stat-label">شارة</span>
            </div>
        `;
    }
}

function renderCourses() {
    const list = document.getElementById('courses-list');
    if (!list) return;
    
    list.innerHTML = '';
    const progress = StorageManager.getProgress();
    
    // تجميع الدروس في مسارات
    const tracks = {
        'HTML': { color: '#f97316', grad: 'linear-gradient(135deg,#f97316,#ea580c)', icon: '🏗️', label: 'HTML — هيكل الويب' },
        'CSS':  { color: '#3b82f6', grad: 'linear-gradient(135deg,#3b82f6,#2563eb)', icon: '🎨', label: 'CSS — التصميم والجماليات' },
        'JS':   { color: '#eab308', grad: 'linear-gradient(135deg,#eab308,#ca8a04)', icon: '⚡', label: 'JavaScript — التفاعل والمنطق' },
    };
    
    // عرض بطاقة لكل مسار ثم الدروس
    Object.entries(tracks).forEach(([trackKey, trackInfo]) => {
        const trackLessons = LessonsManager.lessons.filter(l => l.course === trackKey);
        const trackCompleted = trackLessons.filter(l => progress.completedLessons.includes(l.id)).length;
        const trackPct = Math.round((trackCompleted / trackLessons.length) * 100);
        
        // ترويسة المسار
        const trackHeader = document.createElement('div');
        trackHeader.className = 'track-header';
        trackHeader.style.gridColumn = '1 / -1';
        trackHeader.innerHTML = `
            <div class="track-header-content">
                <div class="track-header-left">
                    <span class="track-icon" style="background:${trackInfo.grad}">${trackInfo.icon}</span>
                    <div>
                        <h3>${trackInfo.label}</h3>
                        <span style="color:var(--text-muted);font-size:0.9rem;">${trackCompleted}/${trackLessons.length} درس مكتمل</span>
                    </div>
                </div>
                <div class="track-progress-bar">
                    <div class="track-progress-fill" style="width:${trackPct}%;background:${trackInfo.grad}"></div>
                </div>
                <span class="track-pct" style="color:${trackInfo.color}">${trackPct}%</span>
            </div>
        `;
        list.appendChild(trackHeader);
        
        // بطاقات الدروس
        trackLessons.forEach((lesson, idx) => {
            const isCompleted = progress.completedLessons.includes(lesson.id);
            const isLocked    = idx > 0 && !progress.completedLessons.includes(trackLessons[idx - 1].id);
            
            const card = document.createElement('div');
            card.className = `course-card ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked-card' : ''}`;
            
            card.innerHTML = `
                <div class="card-track-badge" style="background:${trackInfo.grad}">${trackInfo.icon} ${lesson.course}</div>
                <h3>${lesson.title}</h3>
                <p>${lesson.description}</p>
                <div class="course-meta">
                    <span class="badge" style="background:rgba(99,102,241,0.2)">
                        <i class="fa-solid fa-star" style="color:#f59e0b"></i> ${lesson.xpReward} XP
                    </span>
                    ${isCompleted ? '<span class="badge success"><i class="fa-solid fa-check"></i> مكتمل</span>' : ''}
                    ${isLocked ? '<span class="badge" style="opacity:0.6">🔒 مقفول</span>' : ''}
                </div>
                ${!isLocked ? `
                <a href="#/lesson/${lesson.id}" class="btn ${isCompleted ? 'btn-success' : 'btn-primary'} mt-2" style="width:100%;justify-content:center;">
                    ${isCompleted ? '<i class="fa-solid fa-rotate-right"></i> إعادة' : '<i class="fa-solid fa-play"></i> ابدأ الدرس'}
                </a>` : `
                <button class="btn btn-primary mt-2" style="width:100%;justify-content:center;opacity:0.5" disabled>
                    🔒 أكمل الدرس السابق أولاً
                </button>`}
            `;
            list.appendChild(card);
        });
    });
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);
