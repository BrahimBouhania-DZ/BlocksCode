// نقطة التشغيل الرئيسية والتفاعل (Main Application)

document.addEventListener('DOMContentLoaded', () => {
    updateXPDisplay();
    
    // زر تبديل المظهر
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => AppState.toggleTheme());
        const icon = themeToggle.querySelector('i');
        if(icon) icon.className = AppState.theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    }
    
    // النقر على XP Badge للذهاب لصفحة التقدم
    const xpBadge = document.getElementById('user-xp');
    if (xpBadge) {
        xpBadge.style.cursor = 'pointer';
        xpBadge.addEventListener('click', () => { window.location.hash = '#/progress'; });
    }
    
    // اختصارات لوحة المفاتيح
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
            e.preventDefault();
            AppState.undo?.();
        }
        if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
            e.preventDefault();
            AppState.redo?.();
        }
    });
});

// فتح/إغلاق الـ Toolbox على الجوال
document.addEventListener('click', (e) => {
    const openBtn  = e.target.closest('#mobile-toolbox-open');
    const closeBtn = e.target.closest('#mobile-toolbox-close');
    const backdrop = e.target.closest('.toolbox-backdrop');
    
    if (openBtn) {
        const toolbox = document.getElementById('toolbox');
        if (!toolbox) return;
        toolbox.classList.add('mobile-open');
        let bd = document.querySelector('.toolbox-backdrop');
        if (!bd) {
            bd = document.createElement('div');
            bd.className = 'toolbox-backdrop';
            document.body.appendChild(bd);
        }
        bd.classList.add('visible');
    }
    
    if (closeBtn || backdrop) {
        const toolbox = document.getElementById('toolbox');
        if (toolbox) toolbox.classList.remove('mobile-open');
        document.querySelector('.toolbox-backdrop')?.classList.remove('visible');
    }
});



function updateXPDisplay() {
    const xpBadge = document.getElementById('user-xp');
    if (xpBadge) {
        const progress  = StorageManager.getProgress();
        const levelInfo = StorageManager.getLevelInfo(progress.xp);
        xpBadge.innerHTML = `${levelInfo.current.icon} <strong>${levelInfo.current.title}</strong> &nbsp;|&nbsp; ⭐ ${progress.xp} XP`;
        xpBadge.title = `المستوى ${levelInfo.current.level} — ${levelInfo.pct}% للمستوى التالي`;
    }
    
    // تحديث Streak
    const streakBadge = document.getElementById('user-streak');
    if (streakBadge) {
        const streak = StorageManager.checkAndUpdateStreak();
        if (streak.current > 0) {
            streakBadge.style.display = 'inline-block';
            document.getElementById('streak-count').innerText = streak.current;
        } else {
            streakBadge.style.display = 'none';
        }
    }
}

function initEditor() {
    initDragDrop();
    initPreview();
    
    const btnClear = document.getElementById('btn-clear');
    if (btnClear) {
        btnClear.addEventListener('click', () => {
            if(confirm('هل أنت متأكد من مسح جميع البلوكات؟')) {
                AppState.clearWorkspace();
                const out = document.getElementById('console-output');
                if(out) out.innerHTML = '';
            }
        });
    }

    // تصدير HTML
    const btnExport = document.getElementById('btn-export');
    if (btnExport) btnExport.addEventListener('click', window.exportProject);

    // مشاركة المشروع
    const btnShare = document.getElementById('btn-share');
    if (btnShare) btnShare.addEventListener('click', window.shareProject);

    // نسخ الكود
    const btnCopy = document.getElementById('btn-copy-code');
    if (btnCopy) btnCopy.addEventListener('click', window.copyCode);

    // حفظ JSON
    const btnSaveJson = document.getElementById('btn-save-json');
    if (btnSaveJson) {
        btnSaveJson.addEventListener('click', () => {
            if (AppState.blocks.length === 0 && AppState.workspaceBlocks.length === 0) {
                showToast('مساحة العمل فارغة! أضف بعض البلوكات قبل الحفظ.', 'error');
                return;
            }
            const projectData = JSON.stringify(AppState.workspaceBlocks, null, 2);
            const blob = new Blob([projectData], { type: 'application/json' });
            const url  = URL.createObjectURL(blob);
            const a    = document.createElement('a');
            a.href     = url;
            a.download = `BlocksCode_${Date.now()}.json`;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 0);
            showToast('✅ تم حفظ المشروع بنجاح!', 'success');
        });
    }

    // تحميل JSON
    const btnLoadJson = document.getElementById('btn-load-json');
    if (btnLoadJson) {
        btnLoadJson.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const parsedBlocks = JSON.parse(e.target.result);
                    if (Array.isArray(parsedBlocks)) {
                        AppState.workspaceBlocks = parsedBlocks;
                        AppState.history = [JSON.stringify(AppState.workspaceBlocks)];
                        AppState.historyIndex = 0;
                        AppState.notify();
                        showToast('📂 تم استرجاع المشروع بنجاح! 🚀', 'success');
                    } else {
                        showToast('❌ ملف غير صالح. تأكد أنه من منصة BlocksCode.', 'error');
                    }
                } catch (error) {
                    console.error(error);
                    showToast('❌ خطأ في قراءة الملف. قد يكون تالفاً.', 'error');
                }
            };
            reader.readAsText(file);
            event.target.value = '';
        });
    }

    // إغلاق المفتش
    const closeInspectorBtn = document.getElementById('close-inspector');
    if (closeInspectorBtn) closeInspectorBtn.addEventListener('click', () => AppState.selectBlock(null));
    
    // حذف البلوك
    const btnDeleteBlock = document.getElementById('btn-delete-block');
    if (btnDeleteBlock) {
        btnDeleteBlock.addEventListener('click', () => {
            if (AppState.selectedBlockId) AppState.deleteBlock(AppState.selectedBlockId);
        });
    }
    
    // استنساخ البلوك
    const btnDuplicateBlock = document.getElementById('btn-duplicate-block');
    if (btnDuplicateBlock) {
        btnDuplicateBlock.addEventListener('click', () => {
            if (AppState.selectedBlockId) AppState.duplicateBlock(AppState.selectedBlockId);
        });
    }
    
    currentInspectorBlockId = null;
    
    AppState.subscribe(renderWorkspace);
    AppState.subscribe(renderInspector);
    
    AppState.saveHistory();
    renderWorkspace(AppState);
    renderInspector(AppState);

    // تهيئة نظام الألواح
    setTimeout(() => PanelManager.init(), 50);
}

function renderWorkspace(state) {
    const workspace = document.getElementById('workspace');
    if (!workspace) return;
    
    workspace.innerHTML = '';
    if (state.workspaceBlocks.length === 0) {
    workspace.innerHTML = '<div class="workspace-placeholder">Drag blocks from the panel — or double-click them to add here...</div>';
        return;
    }
    state.workspaceBlocks.forEach(block => {
        workspace.appendChild(createBlockUI(block, state));
    });
}

function createBlockUI(block, state) {
    const blockEl = document.createElement('div');
    blockEl.className = 'block in-workspace';
    blockEl.id = block.id;
    blockEl.setAttribute('data-category', block.category);
    // Color-code by category
    const catColors = {
        'Structure':   'linear-gradient(135deg,#6366f1,#4f46e5)',
        'Lists':       'linear-gradient(135deg,#8b5cf6,#7c3aed)',
        'Tables':      'linear-gradient(135deg,#06b6d4,#0891b2)',
        'Text':        'linear-gradient(135deg,#10b981,#059669)',
        'Media':       'linear-gradient(135deg,#f59e0b,#d97706)',
        'Forms':       'linear-gradient(135deg,#f97316,#ea580c)',
        'Custom Code': 'linear-gradient(135deg,#64748b,#475569)',
        'CSS Styles':  'linear-gradient(135deg,#3b82f6,#2563eb)',
        'JS Events':   'linear-gradient(135deg,#eab308,#ca8a04)',
        'JS Logic':    'linear-gradient(135deg,#ef4444,#dc2626)',
    };
    if (catColors[block.category]) {
        blockEl.style.background = catColors[block.category];
        if (block.category === 'JS Events' || block.category === 'JS Logic') {
            blockEl.style.color = '#1e293b';
        }
    }
    
    blockEl.setAttribute('draggable', 'true');
    blockEl.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('source', 'workspace');
        e.dataTransfer.setData('blockId', block.id);
        e.stopPropagation();
        setTimeout(() => blockEl.classList.add('dragging'), 0);
    });
    blockEl.addEventListener('dragend', (e) => {
        blockEl.classList.remove('dragging');
        e.stopPropagation();
    });
    
    if (block.id === state.selectedBlockId) {
        blockEl.classList.add('selected-block');
    }
    
    const blockHeader = document.createElement('div');
    blockHeader.style.cursor = 'pointer';
    blockHeader.innerHTML = `<i class="fa-solid fa-grip-vertical" style="opacity:0.5; margin-left:5px;"></i> ${block.label}`;
    
    blockHeader.addEventListener('click', (e) => {
        e.stopPropagation();
        AppState.selectBlock(block.id);
    });
    
    blockEl.appendChild(blockHeader);
    
    if (block.children !== null) {
        const childrenContainer = document.createElement('div');
        childrenContainer.className = 'block-children';
        childrenContainer.setAttribute('data-parent-id', block.id);
        
        if (block.children.length > 0) {
            block.children.forEach(child => {
                childrenContainer.appendChild(createBlockUI(child, state));
            });
        }
        blockEl.appendChild(childrenContainer);
    }
    return blockEl;
}

let currentInspectorBlockId = null;

function renderInspector(state) {
    const panel = document.getElementById('inspector-panel');
    const body = document.getElementById('inspector-body');
    if (!panel || !body) return;

    if (!state.selectedBlockId) {
        panel.classList.remove('open');
        currentInspectorBlockId = null;
        return;
    }

    const block = AppState.findBlock(state.selectedBlockId, state.workspaceBlocks);
    if (!block) {
        panel.classList.remove('open');
        currentInspectorBlockId = null;
        return;
    }

    panel.classList.add('open');

    if (currentInspectorBlockId === block.id) return;
    currentInspectorBlockId = block.id;

    body.innerHTML = '';

    const createInput = (label, value, onChange, type="text", options=null) => {
        const div = document.createElement('div');
        div.className = 'form-group';
        div.innerHTML = `<label>${label}</label>`;
        
        if (type === 'select' && options) {
            const sel = document.createElement('select');
            sel.className = 'form-control';
            options.forEach(opt => {
                const o = document.createElement('option');
                o.value = opt.value;
                o.innerText = opt.label;
                if (value === opt.value) o.selected = true;
                sel.appendChild(o);
            });
            sel.addEventListener('change', (e) => onChange(e.target.value));
            div.appendChild(sel);
        } else {
            const inp = document.createElement('input');
            inp.type = type;
            inp.className = 'form-control';
            if(type==='color') { inp.style.height = '40px'; inp.style.padding = '2px'; }
            inp.value = value || '';
            inp.addEventListener('change', (e) => onChange(e.target.value));
            div.appendChild(inp);
        }
        body.appendChild(div);
    };

    const createTextArea = (label, value, onChange) => {
        const div = document.createElement('div');
        div.className = 'form-group';
        div.innerHTML = `<label>${label}</label>`;
        const txt = document.createElement('textarea');
        txt.className = 'form-control';
        txt.style.height = '150px';
        txt.style.direction = 'ltr';
        txt.style.fontFamily = 'monospace';
        txt.style.resize = 'vertical';
        txt.value = value || '';
        txt.addEventListener('change', (e) => onChange(e.target.value));
        div.appendChild(txt);
        body.appendChild(div);
    };

    const createRange = (label, value, min, max, step, unit, onChange) => {
        const div = document.createElement('div');
        div.className = 'form-group';
        let currentValNum = parseFloat(value) || 0;
        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;">
                <label style="margin:0;">${label}</label>
                <span class="range-val" style="font-size:0.8rem; color:var(--primary); font-weight:bold;">${value || (currentValNum + unit)}</span>
            </div>
            <div style="display:flex; align-items:center; gap:10px;">
                <input type="range" min="${min}" max="${max}" step="${step}" value="${currentValNum}" style="flex:1; cursor:pointer;">
            </div>
        `;
        const slider = div.querySelector('input[type="range"]');
        const valDisplay = div.querySelector('.range-val');
        slider.addEventListener('input', (e) => {
            const finalVal = e.target.value + unit;
            valDisplay.innerText = finalVal;
            onChange(finalVal);
        });
        body.appendChild(div);
    };

    const createIconGroup = (label, value, options, onChange) => {
        const div = document.createElement('div');
        div.className = 'form-group';
        div.innerHTML = `<label>${label}</label><div class="icon-group" style="display:flex; gap:5px; background:var(--bg-color); padding:5px; border-radius:8px; border:1px solid var(--border-color);"></div>`;
        const group = div.querySelector('.icon-group');
        
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'btn-icon';
            btn.innerHTML = `<i class="fa-solid ${opt.icon}" title="${opt.label}"></i>`;
            btn.style.flex = "1";
            btn.style.borderRadius = "4px";
            if(value === opt.value) {
                btn.style.background = "var(--primary-light)";
                btn.style.color = "var(--primary)";
            }
            btn.onclick = () => {
                group.querySelectorAll('.btn-icon').forEach(b => {
                    b.style.background = ""; b.style.color = "";
                });
                btn.style.background = "var(--primary-light)";
                btn.style.color = "var(--primary)";
                onChange(opt.value);
            };
            group.appendChild(btn);
        });
        body.appendChild(div);
    };

    if (block.tag === 'custom-html' || block.tag === 'custom-css' || block.tag === 'custom-js') {
        createTextArea('Custom Code Here:', block.attributes.rawCode || '', (val) => AppState.updateBlockProperty(block.id, 'attributes', 'rawCode', val));
        return; // لا نعرض باقي الحقول
    }

    if (block.innerText !== undefined && block.category !== "CSS Styles") {
        createInput('Text Content', block.innerText, (val) => AppState.updateBlockProperty(block.id, 'direct', 'innerText', val));
    }

    if (!block.attributes) block.attributes = {};
    if (!block.styles) block.styles = {};
    
    // Detect block type by English category
    const isJS  = block.category === "JS Events" || block.category === "JS Logic";
    const isCSS = block.category === "CSS Styles";
    const isUI  = !isJS && !isCSS && block.category !== "Custom Code";
    
    if (isCSS) {
        createInput('Selector (e.g. .card / button)', block.attributes.selector || '', (val) => AppState.updateBlockProperty(block.id, 'attributes', 'selector', val));
    }
    
    if (isUI) {
        createInput('Class', block.attributes.class || '', (val) => AppState.updateBlockProperty(block.id, 'attributes', 'class', val));
        createInput('ID', block.attributes.id || '', (val) => AppState.updateBlockProperty(block.id, 'attributes', 'id', val));
        
        if (block.tag === 'img') {
            createInput('Image Source (src)', block.attributes.src || '', (val) => AppState.updateBlockProperty(block.id, 'attributes', 'src', val));
            createInput('Width', block.attributes.width || '', (val) => AppState.updateBlockProperty(block.id, 'attributes', 'width', val));
        }
        if (block.tag === 'video') {
            createInput('Source URL (src)', block.attributes.src || '', (val) => AppState.updateBlockProperty(block.id, 'attributes', 'src', val));
            createInput('Width', block.attributes.width || '', (val) => AppState.updateBlockProperty(block.id, 'attributes', 'width', val));
            createInput('Controls', block.attributes.controls || 'true', (val) => AppState.updateBlockProperty(block.id, 'attributes', 'controls', val), 'select', [{value: 'true', label: 'Yes'}, {value: 'false', label: 'No'}]);
        }
        if (block.tag === 'audio') {
            createInput('Source URL (src)', block.attributes.src || '', (val) => AppState.updateBlockProperty(block.id, 'attributes', 'src', val));
            createInput('Controls', block.attributes.controls || 'true', (val) => AppState.updateBlockProperty(block.id, 'attributes', 'controls', val), 'select', [{value: 'true', label: 'Yes'}, {value: 'false', label: 'No'}]);
        }
        if (block.tag === 'a') {
            createInput('Link URL (href)', block.attributes.href || '', (val) => AppState.updateBlockProperty(block.id, 'attributes', 'href', val));
        }
        if (block.tag === 'iframe') {
            createInput('Source URL (src)', block.attributes.src || '', (val) => AppState.updateBlockProperty(block.id, 'attributes', 'src', val));
            createInput('Width', block.attributes.width || '', (val) => AppState.updateBlockProperty(block.id, 'attributes', 'width', val));
            createInput('Height', block.attributes.height || '', (val) => AppState.updateBlockProperty(block.id, 'attributes', 'height', val));
        }
        if (block.tag === 'input') {
            createInput('Input Type', block.attributes.type || 'text', (val) => AppState.updateBlockProperty(block.id, 'attributes', 'type', val), 'select', [
                {value: 'text', label: 'Text'}, {value: 'password', label: 'Password'}, {value: 'email', label: 'Email'}, {value: 'color', label: 'Color'}, {value: 'number', label: 'Number'}, {value: 'checkbox', label: 'Checkbox'}
            ]);
            createInput('Placeholder', block.attributes.placeholder || '', (val) => AppState.updateBlockProperty(block.id, 'attributes', 'placeholder', val));
        }
        if (block.tag === 'textarea') {
            createInput('Placeholder', block.attributes.placeholder || '', (val) => AppState.updateBlockProperty(block.id, 'attributes', 'placeholder', val));
        }
        if (block.tag === 'option') {
            createInput('Value', block.attributes.value || '', (val) => AppState.updateBlockProperty(block.id, 'attributes', 'value', val));
        }
    }
    
    if (isUI || isCSS) {
        // Advanced Styling (Dropdowns)
        createInput('Display', block.styles.display || '', (val) => AppState.updateBlockProperty(block.id, 'styles', 'display', val), 'select', [
            {value: '', label: 'Default'}, {value: 'block', label: 'Block'}, {value: 'inline-block', label: 'Inline-Block'}, {value: 'flex', label: 'Flex'}, {value: 'grid', label: 'Grid'}
        ]);
        
        if (block.styles.display === 'flex') {
            createIconGroup('Horizontal Align (Justify)', block.styles.justifyContent || '', [
                {value: '', label: 'Default', icon: 'fa-align-justify'}, 
                {value: 'flex-start', label: 'Start', icon: 'fa-align-left'}, 
                {value: 'center', label: 'Center', icon: 'fa-align-center'}, 
                {value: 'flex-end', label: 'End', icon: 'fa-align-right'},
                {value: 'space-between', label: 'Space Between', icon: 'fa-arrows-left-right'}
            ], (val) => AppState.updateBlockProperty(block.id, 'styles', 'justifyContent', val));

            createIconGroup('Vertical Align (Align)', block.styles.alignItems || '', [
                {value: '', label: 'Default', icon: 'fa-align-justify'}, 
                {value: 'flex-start', label: 'Start', icon: 'fa-arrow-up'}, 
                {value: 'center', label: 'Center', icon: 'fa-compress'}, 
                {value: 'flex-end', label: 'End', icon: 'fa-arrow-down'}
            ], (val) => AppState.updateBlockProperty(block.id, 'styles', 'alignItems', val));

            createRange('Gap', block.styles.gap || '0px', 0, 100, 1, 'px', (val) => AppState.updateBlockProperty(block.id, 'styles', 'gap', val));
        }

        createIconGroup('Text Align', block.styles.textAlign || '', [
            {value: '', label: 'Default', icon: 'fa-align-justify'}, 
            {value: 'left', label: 'Left', icon: 'fa-align-left'}, 
            {value: 'center', label: 'Center', icon: 'fa-align-center'}, 
            {value: 'right', label: 'Right', icon: 'fa-align-right'}
        ], (val) => AppState.updateBlockProperty(block.id, 'styles', 'textAlign', val));
        
        createInput('Text Color', block.styles.color || '#000000', (val) => AppState.updateBlockProperty(block.id, 'styles', 'color', val), 'color');
        createInput('Background Color', block.styles.backgroundColor || '#ffffff', (val) => AppState.updateBlockProperty(block.id, 'styles', 'backgroundColor', val), 'color');
        createRange('Font Size', block.styles.fontSize || '16px', 8, 72, 1, 'px', (val) => AppState.updateBlockProperty(block.id, 'styles', 'fontSize', val));
        createRange('Padding (Inner Spacing)', block.styles.padding || '0px', 0, 100, 1, 'px', (val) => AppState.updateBlockProperty(block.id, 'styles', 'padding', val));
        createRange('Margin (Outer Spacing)', block.styles.margin || '0px', 0, 100, 1, 'px', (val) => AppState.updateBlockProperty(block.id, 'styles', 'margin', val));
        createRange('Border Radius', block.styles.borderRadius || '0px', 0, 100, 1, 'px', (val) => AppState.updateBlockProperty(block.id, 'styles', 'borderRadius', val));
        
        createInput('Border (e.g. 1px solid #000)', block.styles.border || '', (val) => AppState.updateBlockProperty(block.id, 'styles', 'border', val));
        createInput('Box Shadow (e.g. 0 4px 8px #000)', block.styles.boxShadow || '', (val) => AppState.updateBlockProperty(block.id, 'styles', 'boxShadow', val));
        createRange('Opacity (0 to 1)', block.styles.opacity !== undefined ? block.styles.opacity : 1, 0, 1, 0.1, '', (val) => AppState.updateBlockProperty(block.id, 'styles', 'opacity', val));
        createInput('Transition (e.g. 0.3s ease)', block.styles.transition || '', (val) => AppState.updateBlockProperty(block.id, 'styles', 'transition', val));
        
        createInput('Cursor', block.styles.cursor || '', (val) => AppState.updateBlockProperty(block.id, 'styles', 'cursor', val), 'select', [
            {value: '', label: 'Default'}, {value: 'pointer', label: 'Pointer'}, {value: 'not-allowed', label: 'Not Allowed'}, {value: 'text', label: 'Text'}
        ]);
        
        createInput('Position', block.styles.position || '', (val) => AppState.updateBlockProperty(block.id, 'styles', 'position', val), 'select', [
            {value: '', label: 'Static'}, {value: 'relative', label: 'Relative'}, {value: 'absolute', label: 'Absolute'}, {value: 'fixed', label: 'Fixed'}
        ]);
        if (block.styles.position === 'absolute' || block.styles.position === 'fixed') {
            createInput('Top', block.styles.top || '', (val) => AppState.updateBlockProperty(block.id, 'styles', 'top', val));
            createInput('Bottom', block.styles.bottom || '', (val) => AppState.updateBlockProperty(block.id, 'styles', 'bottom', val));
            createInput('Left', block.styles.left || '', (val) => AppState.updateBlockProperty(block.id, 'styles', 'left', val));
            createInput('Right', block.styles.right || '', (val) => AppState.updateBlockProperty(block.id, 'styles', 'right', val));
            createInput('Z-Index', block.styles.zIndex || '', (val) => AppState.updateBlockProperty(block.id, 'styles', 'zIndex', val));
        }
    } 
    else if (isJS) {
        // Logic Blocks Inputs
        if (block.tag === 'alert') {
            createInput('رسالة التنبيه', block.attributes.message || '', (val) => AppState.updateBlockProperty(block.id, 'attributes', 'message', val));
        }
        if (block.tag === 'console-log') {
            createInput('رسالة للكونسول', block.attributes.message || '', (val) => AppState.updateBlockProperty(block.id, 'attributes', 'message', val));
        }
        if (block.tag === 'change-text') {
            createInput('مُحدد العنصر (مثال: h1)', block.attributes.targetSelector || '', (val) => AppState.updateBlockProperty(block.id, 'attributes', 'targetSelector', val));
            createInput('النص الجديد', block.attributes.newText || '', (val) => AppState.updateBlockProperty(block.id, 'attributes', 'newText', val));
        }
        if (block.tag === 'js-toggle-class') {
            createInput('مُحدد العنصر المستهدف', block.attributes.targetSelector || '', (val) => AppState.updateBlockProperty(block.id, 'attributes', 'targetSelector', val));
            createInput('اسم الفئة (Class) مثال: active', block.attributes.className || '', (val) => AppState.updateBlockProperty(block.id, 'attributes', 'className', val));
        }
        if (block.tag === 'js-change-style') {
            createInput('مُحدد العنصر المستهدف', block.attributes.targetSelector || '', (val) => AppState.updateBlockProperty(block.id, 'attributes', 'targetSelector', val));
            createInput('اسم الخاصية برمجياً (مثال: backgroundColor)', block.attributes.cssProperty || '', (val) => AppState.updateBlockProperty(block.id, 'attributes', 'cssProperty', val));
            createInput('القيمة الجديدة', block.attributes.cssValue || '', (val) => AppState.updateBlockProperty(block.id, 'attributes', 'cssValue', val));
        }
        if (block.tag === 'var-from-input') {
            createInput('اسم المتغير', block.attributes.varName || '', (val) => AppState.updateBlockProperty(block.id, 'attributes', 'varName', val));
            createInput('مُحدد الحقل (مثال: #myInput)', block.attributes.inputId || '', (val) => AppState.updateBlockProperty(block.id, 'attributes', 'inputId', val));
        }
        if (block.tag === 'event-click') {
            createInput('مُحدد الزر (مثال: button)', block.attributes.targetSelector || '', (val) => AppState.updateBlockProperty(block.id, 'attributes', 'targetSelector', val));
        }
        if (block.tag === 'event-mouseenter') {
            createInput('مُحدد العنصر (مثال: .card)', block.attributes.targetSelector || '', (val) => AppState.updateBlockProperty(block.id, 'attributes', 'targetSelector', val));
        }
        if (block.tag === 'event-change') {
            createInput('مُحدد الحقل المستهدف (مثال: select)', block.attributes.targetSelector || '', (val) => AppState.updateBlockProperty(block.id, 'attributes', 'targetSelector', val));
        }
        if (block.tag === 'var-declare') {
            createInput('اسم المتغير', block.attributes.varName || '', (val) => AppState.updateBlockProperty(block.id, 'attributes', 'varName', val));
            createInput('القيمة الأولية', block.attributes.varValue || '', (val) => AppState.updateBlockProperty(block.id, 'attributes', 'varValue', val));
        }
        if (block.tag === 'var-increment') {
            createInput('اسم المتغير', block.attributes.varName || '', (val) => AppState.updateBlockProperty(block.id, 'attributes', 'varName', val));
            createInput('مقدار الزيادة', block.attributes.amount || '', (val) => AppState.updateBlockProperty(block.id, 'attributes', 'amount', val));
        }
        if (block.tag === 'js-fetch') {
            createInput('الرابط (URL API)', block.attributes.url || '', (val) => AppState.updateBlockProperty(block.id, 'attributes', 'url', val));
            createInput('اسم المتغير لحفظ النتيجة', block.attributes.varName || '', (val) => AppState.updateBlockProperty(block.id, 'attributes', 'varName', val));
        }
        if (block.tag === 'if-condition') {
            createInput('الشرط (مثال: score > 5)', block.attributes.condition || '', (val) => AppState.updateBlockProperty(block.id, 'attributes', 'condition', val));
        }
        if (block.tag === 'loop-for') {
            createInput('عدد مرات التكرار', block.attributes.times || '', (val) => AppState.updateBlockProperty(block.id, 'attributes', 'times', val));
        }
        if (block.tag === 'timer-timeout') {
            createInput('التأخير بالميلي ثانية (1000 = 1 ثانية)', block.attributes.delayMs || '', (val) => AppState.updateBlockProperty(block.id, 'attributes', 'delayMs', val));
        }
    }
}
