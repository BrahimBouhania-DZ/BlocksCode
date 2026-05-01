// إدارة التخزين المحلي (Local Storage) - نسخة محسّنة ومكتملة

const STORAGE_KEY = 'blockscode_progress';
const PLAYGROUND_KEY = 'blockscode_playground';
const AUTO_SAVE_KEY = 'blockscode_autosave';

// جدول المستويات
const LEVEL_TABLE = [
    { level: 1, title: 'مبتدئ',    minXP: 0,   maxXP: 100,  icon: '🌱' },
    { level: 2, title: 'متعلم',    minXP: 100, maxXP: 250,  icon: '📖' },
    { level: 3, title: 'مطوّر',    minXP: 250, maxXP: 500,  icon: '💻' },
    { level: 4, title: 'محترف',    minXP: 500, maxXP: 800,  icon: '🚀' },
    { level: 5, title: 'خبير',     minXP: 800, maxXP: 1200, icon: '⭐' },
    { level: 6, title: 'معلم',     minXP: 1200,maxXP: 9999, icon: '🏆' },
];

const StorageManager = {

    // ==========================================
    // حفظ وجلب التقدم
    // ==========================================
    getProgress() {
        const stored = localStorage.getItem(STORAGE_KEY);
        const defaults = { completedLessons: [], xp: 0, level: 1, badges: [] };
        if (!stored) return defaults;
        try {
            return { ...defaults, ...JSON.parse(stored) };
        } catch {
            return defaults;
        }
    },

    saveProgress(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    },

    // ==========================================
    // نقاط XP والمستويات
    // ==========================================
    addXP(amount) {
        const progress = this.getProgress();
        progress.xp = (progress.xp || 0) + amount;
        progress.level = this.calculateLevel(progress.xp).level;
        this.saveProgress(progress);
        return progress;
    },

    calculateLevel(xp) {
        for (let i = LEVEL_TABLE.length - 1; i >= 0; i--) {
            if (xp >= LEVEL_TABLE[i].minXP) return LEVEL_TABLE[i];
        }
        return LEVEL_TABLE[0];
    },

    getLevelInfo(xp) {
        const current = this.calculateLevel(xp);
        const next = LEVEL_TABLE.find(l => l.level === current.level + 1);
        const progressInLevel = xp - current.minXP;
        const levelRange = (next ? next.minXP : current.maxXP) - current.minXP;
        const pct = Math.min(100, Math.round((progressInLevel / levelRange) * 100));
        return { current, next, pct };
    },

    // ==========================================
    // سلسلة الأيام (Streak)
    // ==========================================
    checkAndUpdateStreak() {
        const progress = this.getProgress();
        const today = new Date().toISOString().split('T')[0];
        
        if (!progress.streak) {
            progress.streak = { current: 1, max: 1, lastVisit: today };
        } else if (progress.streak.lastVisit !== today) {
            const lastDate = new Date(progress.streak.lastVisit);
            const currentDate = new Date(today);
            const diffTime = Math.abs(currentDate - lastDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            
            if (diffDays === 1) {
                progress.streak.current += 1;
                if (progress.streak.current > progress.streak.max) {
                    progress.streak.max = progress.streak.current;
                }
            } else if (diffDays > 1) {
                progress.streak.current = 1;
            }
            progress.streak.lastVisit = today;
        }
        this.saveProgress(progress);
        return progress.streak;
    },

    // ==========================================
    // الدروس المكتملة
    // ==========================================
    markLessonCompleted(lessonId, timeSpent = 0) {
        const progress = this.getProgress();
        if (!progress.completedLessons.includes(lessonId)) {
            progress.completedLessons.push(lessonId);
            if (!progress.lessonStats) progress.lessonStats = {};
            progress.lessonStats[lessonId] = { timeSpent: timeSpent, completedAt: Date.now() };
            this.saveProgress(progress);
        }
    },

    isLessonCompleted(lessonId) {
        return this.getProgress().completedLessons.includes(lessonId);
    },

    // ==========================================
    // الشارات
    // ==========================================
    awardBadge(badgeId) {
        const progress = this.getProgress();
        if (!progress.badges) progress.badges = [];
        if (!progress.badges.includes(badgeId)) {
            progress.badges.push(badgeId);
            this.saveProgress(progress);
            return true; // شارة جديدة
        }
        return false; // مكتسبة مسبقاً
    },

    hasBadge(badgeId) {
        return this.getProgress().badges?.includes(badgeId) || false;
    },

    // ==========================================
    // الملعب الحر
    // ==========================================
    savePlayground(blocks) {
        localStorage.setItem(PLAYGROUND_KEY, JSON.stringify(blocks));
    },

    loadPlayground() {
        const stored = localStorage.getItem(PLAYGROUND_KEY);
        return stored ? JSON.parse(stored) : [];
    },

    // الحفظ التلقائي (كل 30 ثانية)
    startAutoSave() {
        if (this._autoSaveTimer) clearInterval(this._autoSaveTimer);
        this._autoSaveTimer = setInterval(() => {
            if (AppState.isPlayground && AppState.workspaceBlocks.length > 0) {
                this.savePlayground(AppState.workspaceBlocks);
                this._showAutoSaveIndicator();
            }
        }, 30000);
    },

    _showAutoSaveIndicator() {
        const indicator = document.getElementById('autosave-indicator');
        if (indicator) {
            indicator.style.opacity = '1';
            setTimeout(() => { indicator.style.opacity = '0'; }, 2000);
        }
    },

    stopAutoSave() {
        if (this._autoSaveTimer) {
            clearInterval(this._autoSaveTimer);
            this._autoSaveTimer = null;
        }
    },

    // ==========================================
    // مشاركة المشروع عبر URL
    // ==========================================
    encodeProjectToURL(blocks) {
        try {
            const json = JSON.stringify(blocks);
            const utf8Bytes = new TextEncoder().encode(json);
            const binaryStr = Array.from(utf8Bytes, byte => String.fromCodePoint(byte)).join('');
            const encoded = btoa(binaryStr);
            return `${window.location.origin}${window.location.pathname}#/playground?project=${encoded}`;
        } catch {
            return null;
        }
    },

    decodeProjectFromURL() {
        const hash = window.location.hash;
        const match = hash.match(/[?&]project=([^&]+)/);
        if (!match) return null;
        try {
            const binaryStr = atob(match[1]);
            const utf8Bytes = new Uint8Array(binaryStr.length);
            for (let i = 0; i < binaryStr.length; i++) {
                utf8Bytes[i] = binaryStr.charCodeAt(i);
            }
            const json = new TextDecoder().decode(utf8Bytes);
            return JSON.parse(json);
        } catch {
            return null;
        }
    },

    // ==========================================
    // إعادة تعيين (للاختبار)
    // ==========================================
    resetAll() {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(PLAYGROUND_KEY);
    }
};

window.StorageManager = StorageManager;
window.LEVEL_TABLE = LEVEL_TABLE;
