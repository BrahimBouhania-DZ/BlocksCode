// المعاينة الحية ومحاكي وحدة التحكم - نسخة محسّنة

let previewTimeout;

function initPreview() {
    AppState.subscribe(() => {
        clearTimeout(previewTimeout);
        previewTimeout = setTimeout(() => {
            updatePreview(AppState);
        }, 500);
    });
    
    const out = document.getElementById('console-output');
    if (out) out.innerHTML = '';
}

function updatePreview(state) {
    const frame = document.getElementById('preview-iframe');
    const codeView = document.getElementById('live-code-view');
    
    if (frame) {
        const generated = generateCode(state.workspaceBlocks);
        
        // اعتراض أوامر console داخل iframe
        const interceptorScript = `
            const _origLog  = console.log;
            const _origErr  = console.error;
            const _origWarn = console.warn;
            const _origInfo = console.info;
            const _send = (method, args) => window.parent.postMessage({ type: 'blocks_console', method, data: args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ') }, '*');
            console.log   = (...args) => { _send('log',   args); _origLog.apply(console, args); };
            console.error = (...args) => { _send('error', args); _origErr.apply(console, args); };
            console.warn  = (...args) => { _send('warn',  args); _origWarn.apply(console, args); };
            console.info  = (...args) => { _send('info',  args); _origInfo.apply(console, args); };
            window.onerror = function(msg, src, line, col) {
                window.parent.postMessage({ type: 'blocks_console', method: 'error', data: '⛔ ' + msg + ' (السطر ' + line + ')' }, '*');
                return false;
            };
            window.addEventListener('unhandledrejection', function(e) {
                window.parent.postMessage({ type: 'blocks_console', method: 'error', data: '⛔ Promise Error: ' + e.reason }, '*');
            });
        `;

        const docContent = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script>${interceptorScript}<\/script>
    <style>
        ${generated.css}
    </style>
</head>
<body>
    ${generated.html}
    <script>
        ${generated.js}
    <\/script>
</body>
</html>`;

        const blob = new Blob([docContent], {type: 'text/html'});
        frame.src = URL.createObjectURL(blob);
        
        // تحديث عرض الكود مع Syntax Highlighting
        if (codeView) {
            codeView.textContent = docContent;
            if (window.hljs) {
                delete codeView.dataset.highlighted;
                hljs.highlightElement(codeView);
            }
        }
        
        // حفظ الكود لزر النسخ
        window._lastGeneratedCode = docContent;
    }
}

// الاستماع لرسائل الـ iframe
window.addEventListener('message', (e) => {
    if (e.data && e.data.type === 'blocks_console') {
        const out = document.getElementById('console-output');
        const consoleTab = document.querySelectorAll('.tab-btn')[2];
        
        if (out) {
            const div = document.createElement('div');
            div.className = 'console-line';
            
            const colors = { log: '#0f0', error: '#ff5555', warn: '#f59e0b', info: '#3b82f6' };
            const icons  = { log: '›', error: '✕', warn: '⚠', info: 'ℹ' };
            
            div.style.cssText = `
                margin-bottom: 6px;
                padding: 5px 8px;
                border-left: 3px solid ${colors[e.data.method] || '#0f0'};
                color: ${colors[e.data.method] || '#0f0'};
                font-size: 0.88rem;
                word-break: break-all;
                white-space: pre-wrap;
            `;
            div.innerText = `${icons[e.data.method] || '›'} ${e.data.data}`;
            out.appendChild(div);
            out.parentElement.scrollTop = out.parentElement.scrollHeight;
            
            // وميض تبويب الكونسول عند وجود رسالة خطأ
            if (consoleTab && !consoleTab.classList.contains('active') && e.data.method === 'error') {
                consoleTab.style.color = '#ff5555';
                consoleTab.style.animation = 'pulse 1s infinite';
                setTimeout(() => {
                    consoleTab.style.color = 'var(--text-muted)';
                    consoleTab.style.animation = '';
                }, 3000);
            }
        }
    }
});

// أزرار التحكم في حجم المعاينة
window.setPreviewMode = function(mode) {
    const wrapper = document.querySelector('.iframe-wrapper');
    const btns = document.querySelectorAll('.responsive-controls .btn-icon');
    if (!wrapper) return;
    
    btns.forEach(b => b.classList.remove('active-mode'));
    
    if (mode === 'mobile') {
        wrapper.style.width = '375px';
        btns[0]?.classList.add('active-mode');
    } else if (mode === 'tablet') {
        wrapper.style.width = '768px';
        btns[1]?.classList.add('active-mode');
    } else {
        wrapper.style.width = '100%';
        btns[2]?.classList.add('active-mode');
    }
};

// التبديل بين تبويبات المعاينة
window.switchPreviewTab = function(tabName) {
    const panes = {
        visual:  document.getElementById('visual-preview'),
        code:    document.getElementById('code-preview'),
        console: document.getElementById('console-preview'),
    };
    const tabs = document.querySelectorAll('.tab-btn');

    // إخفاء كل الـ panes
    Object.values(panes).forEach(p => {
        if (p) { p.style.display = 'none'; p.classList.remove('active'); }
    });

    // إعادة تعيين تبويبات
    tabs.forEach(t => {
        t.classList.remove('active');
        t.style.borderBottomColor = 'transparent';
        t.style.color = 'var(--text-muted)';
    });

    // إظهار التبويب المطلوب
    const target = panes[tabName];
    if (target) {
        target.style.display = 'flex';
        target.classList.add('active');
    }

    // تفعيل زر التبويب الصحيح
    const tabIndex = { visual: 0, code: 1, console: 2 }[tabName] ?? 0;
    const activeTab = tabs[tabIndex];
    if (activeTab) {
        activeTab.classList.add('active');
        activeTab.style.borderBottomColor = 'var(--primary)';
        activeTab.style.color = 'var(--text-color)';
        activeTab.style.removeProperty?.('color');
    }

    // Syntax highlight عند فتح كود
    if (tabName === 'code') {
        const codeView = document.getElementById('live-code-view');
        if (codeView && window.hljs && !codeView.dataset.highlighted) {
            hljs.highlightElement(codeView);
        }
    }
    // إزالة وميض الأخطاء
    if (tabName === 'console' && tabs[2]) {
        tabs[2].style.color = '';
        tabs[2].style.animation = '';
    }
};

// نسخ الكود
window.copyCode = function() {
    const code = window._lastGeneratedCode || '';
    if (!code) return;
    navigator.clipboard.writeText(code).then(() => {
        const btn = document.getElementById('btn-copy-code');
        if (btn) {
            const orig = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-check"></i> تم النسخ!';
            btn.style.background = 'var(--success)';
            setTimeout(() => {
                btn.innerHTML = orig;
                btn.style.background = '';
            }, 2000);
        }
    }).catch(() => {
        alert('تعذّر النسخ، الرجاء استخدام Ctrl+C يدوياً.');
    });
};

// تصدير المشروع
window.exportProject = function() {
    if (AppState.workspaceBlocks.length === 0) {
        alert('مساحة العمل فارغة! قم بإضافة بلوكات أولاً.');
        return;
    }
    const generated = generateCode(AppState.workspaceBlocks);
    const docContent = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BlocksCode Project</title>
    <style>\n${generated.css}\n    </style>
</head>
<body>\n${generated.html}
    <script>\n${generated.js}\n    <\/script>
</body>
</html>`;
    
    const blob = new Blob([docContent], {type: 'text/html'});
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `BlocksCode_${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

// مشاركة المشروع
window.shareProject = function() {
    if (AppState.workspaceBlocks.length === 0) {
        alert('أضف بلوكات أولاً لتتمكن من المشاركة!');
        return;
    }
    const url = StorageManager.encodeProjectToURL(AppState.workspaceBlocks);
    if (url) {
        navigator.clipboard.writeText(url).then(() => {
            showToast('✅ تم نسخ رابط المشاركة! شارك الرابط مع أصدقائك.', 'success');
        }).catch(() => {
            prompt('انسخ هذا الرابط:', url);
        });
    } else {
        alert('فشل إنشاء رابط المشاركة. المشروع كبير جداً.');
    }
};

// إظهار رسالة Toast
window.showToast = function(message, type = 'info') {
    const existing = document.getElementById('toast-msg');
    if (existing) existing.remove();
    
    const colors = { success: '#10b981', error: '#ef4444', info: '#6366f1', warning: '#f59e0b' };
    const toast = document.createElement('div');
    toast.id = 'toast-msg';
    toast.style.cssText = `
        position: fixed;
        top: 1.5rem;
        left: 50%;
        transform: translateX(-50%) translateY(-80px);
        background: ${colors[type] || colors.info};
        color: white;
        padding: 0.8rem 1.5rem;
        border-radius: 2rem;
        font-family: 'Outfit', sans-serif;
        font-weight: 600;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 99999;
        transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
        white-space: nowrap;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            toast.style.transform = 'translateX(-50%) translateY(0)';
        });
    });
    
    setTimeout(() => {
        toast.style.transform = 'translateX(-50%) translateY(-80px)';
        setTimeout(() => toast.remove(), 400);
    }, 3000);
};
