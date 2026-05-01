// ═══════════════════════════════════════════════════
// نظام إدارة الألواح — Resizable & Collapsible Panels
// ═══════════════════════════════════════════════════

const PanelManager = {

    // الحالة المحفوظة
    _storageKey: 'blockscode_layout',

    defaults: {
        toolboxWidth:  280,
        previewWidth:  420,
        toolboxOpen:   true,
        previewOpen:   true,
        workspaceOpen: true,
    },

    state: {},

    init() {
        this.state = this._load();
        this._apply();
        this._bindResizers();
        this._bindCollapseButtons();
        this._bindKeyboardShortcuts();
    },

    // ─── حفظ وتحميل ───────────────────────────────
    _save() {
        localStorage.setItem(this._storageKey, JSON.stringify(this.state));
    },

    _load() {
        try {
            const stored = localStorage.getItem(this._storageKey);
            return stored ? { ...this.defaults, ...JSON.parse(stored) } : { ...this.defaults };
        } catch { return { ...this.defaults }; }
    },

    // ─── تطبيق الحالة على DOM ──────────────────────
    _apply() {
        const toolbox   = document.getElementById('toolbox');
        const workspace = document.querySelector('.workspace-container');
        const preview   = document.querySelector('.preview-container');
        const layout    = document.querySelector('.editor-layout');

        if (!toolbox || !workspace || !preview || !layout) return;

        // الـ Toolbox
        if (this.state.toolboxOpen) {
            toolbox.classList.remove('panel-collapsed');
            toolbox.style.width = this.state.toolboxWidth + 'px';
            toolbox.style.minWidth = '200px';
        } else {
            toolbox.classList.add('panel-collapsed');
        }

        // المعاينة
        if (this.state.previewOpen) {
            preview.classList.remove('panel-collapsed');
            preview.style.width = this.state.previewWidth + 'px';
            preview.style.minWidth = '300px';
        } else {
            preview.classList.add('panel-collapsed');
        }

        // تحديث أزرار الطي
        this._updateCollapseBtn('panel-toggle-toolbox',   this.state.toolboxOpen,   'fa-cubes',      'Blocks');
        this._updateCollapseBtn('panel-toggle-preview',   this.state.previewOpen,   'fa-eye',        'Preview');
        this._updateCollapseBtn('panel-toggle-workspace', this.state.workspaceOpen, 'fa-vector-square', 'Workspace');
    },

    _updateCollapseBtn(btnId, isOpen, icon, label) {
        const btn = document.getElementById(btnId);
        if (!btn) return;
        btn.title = isOpen ? `إخفاء ${label}` : `إظهار ${label}`;
        btn.querySelector('i').className = `fa-solid ${isOpen ? 'fa-chevron-right' : 'fa-chevron-left'}`;
        btn.classList.toggle('panel-btn-collapsed', !isOpen);
    },

    // ─── أزرار الطي ────────────────────────────────
    _bindCollapseButtons() {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-panel-toggle]');
            if (!btn) return;
            const panel = btn.dataset.panelToggle;
            this.togglePanel(panel);
        });
    },

    togglePanel(name) {
        const key = name + 'Open';
        this.state[key] = !this.state[key];
        this._apply();
        this._save();

        // أنيميشن ناعم
        const panelEl = name === 'toolbox'   ? document.getElementById('toolbox') :
                        name === 'preview'   ? document.querySelector('.preview-container') :
                                               document.querySelector('.workspace-container');
        if (panelEl) {
            panelEl.style.transition = 'width 0.3s cubic-bezier(0.4,0,0.2,1), min-width 0.3s ease, opacity 0.3s ease';
            setTimeout(() => { panelEl.style.transition = ''; }, 400);
        }
    },

    // ─── مقابض السحب (Resizers) ────────────────────
    _bindResizers() {
        // مقبض Toolbox
        const resizerLeft = document.getElementById('resizer-toolbox');
        if (resizerLeft) {
            this._makeResizable(resizerLeft, 'toolbox', 'toolboxWidth', 160, 500, 'horizontal');
        }

        // مقبض Preview
        const resizerRight = document.getElementById('resizer-preview');
        if (resizerRight) {
            this._makeResizable(resizerRight, 'preview', 'previewWidth', 250, 800, 'horizontal-reverse');
        }
    },

    _makeResizable(handle, panelName, stateKey, min, max, direction) {
        let startX, startWidth, panelEl;
        let animFrame;

        const onMouseMove = (e) => {
            cancelAnimationFrame(animFrame);
            animFrame = requestAnimationFrame(() => {
                if (!panelEl) return;
                let delta = e.clientX - startX;
                if (direction === 'horizontal-reverse') delta = -delta;

                let newWidth = Math.max(min, Math.min(max, startWidth + delta));
                panelEl.style.width = newWidth + 'px';
                this.state[stateKey] = newWidth;
            });
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            document.body.classList.remove('is-resizing');
            this._save();
        };

        handle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            startX = e.clientX;

            panelEl = panelName === 'toolbox'
                ? document.getElementById('toolbox')
                : document.querySelector('.preview-container');

            if (!panelEl) return;
            startWidth = panelEl.offsetWidth;

            document.body.classList.add('is-resizing');
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        // Touch support
        handle.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            startX = touch.clientX;
            panelEl = panelName === 'toolbox'
                ? document.getElementById('toolbox')
                : document.querySelector('.preview-container');
            if (!panelEl) return;
            startWidth = panelEl.offsetWidth;
        }, { passive: true });

        handle.addEventListener('touchmove', (e) => {
            if (!panelEl) return;
            const touch = e.touches[0];
            let delta = touch.clientX - startX;
            if (direction === 'horizontal-reverse') delta = -delta;
            const newWidth = Math.max(min, Math.min(max, startWidth + delta));
            panelEl.style.width = newWidth + 'px';
            this.state[stateKey] = newWidth;
        }, { passive: true });

        handle.addEventListener('touchend', () => this._save());
    },

    // ─── اختصارات لوحة المفاتيح ────────────────────
    _bindKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (!e.altKey) return;
            if (e.key === 'b' || e.key === 'B') { e.preventDefault(); this.togglePanel('toolbox'); }
            if (e.key === 'p' || e.key === 'P') { e.preventDefault(); this.togglePanel('preview'); }
        });
    },

    // ─── إعادة تعيين التخطيط ───────────────────────
    reset() {
        this.state = { ...this.defaults };
        this._apply();
        this._save();
        if (window.showToast) showToast('↩️ تم إعادة تعيين التخطيط', 'info');
    }
};

window.PanelManager = PanelManager;
