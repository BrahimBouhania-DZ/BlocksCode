// BlocksCode — Monaco Code Editor Module
const CodeEditorManager = {
    editors: {},
    currentTab: 'html',
    isActive: false,
    updateTimer: null,

    init() {
        if (!window.require) { console.warn('Monaco loader not ready.'); return; }
        require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' } });
        require(['vs/editor/editor.main'], () => {
            this._defineTheme();
            this._createEditors();
        });
    },

    _defineTheme() {
        monaco.editor.defineTheme('blockscodeDark', {
            base: 'vs-dark', inherit: true,
            rules: [
                { token: 'comment',         foreground: '64748B', fontStyle: 'italic' },
                { token: 'keyword',         foreground: 'A78BFA' },
                { token: 'string',          foreground: '34D399' },
                { token: 'number',          foreground: 'F59E0B' },
                { token: 'tag',             foreground: 'F87171' },
                { token: 'attribute.name',  foreground: 'A78BFA' },
                { token: 'attribute.value', foreground: '34D399' },
            ],
            colors: {
                'editor.background':               '#0D1B2A',
                'editor.foreground':               '#E2E8F0',
                'editorLineNumber.foreground':     '#374151',
                'editorLineNumber.activeForeground':'#6366F1',
                'editor.lineHighlightBackground':  '#1E2D4A40',
                'editor.selectionBackground':      '#6366F130',
                'editorCursor.foreground':         '#6366F1',
                'editorBracketMatch.border':       '#6366F1',
            }
        });
    },

    _createEditors() {
        const opts = {
            theme: 'blockscodeDark',
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
            fontLigatures: true,
            lineNumbers: 'on',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            renderLineHighlight: 'line',
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            padding: { top: 16, bottom: 16 },
            bracketPairColorization: { enabled: true },
            quickSuggestions: { other: true, comments: false, strings: true },
            formatOnPaste: true,
        };

        const langs = [
            { key: 'html', lang: 'html',       value: this._defaultHTML() },
            { key: 'css',  lang: 'css',         value: this._defaultCSS()  },
            { key: 'js',   lang: 'javascript',  value: this._defaultJS()   },
        ];
        langs.forEach(({ key, lang, value }) => {
            const el = document.getElementById(`monaco-${key}`);
            if (!el) return;
            const ed = monaco.editor.create(el, { ...opts, language: lang, value });
            this.editors[key] = ed;
            ed.onDidChangeModelContent(() => {
                clearTimeout(this.updateTimer);
                this.updateTimer = setTimeout(() => this._updatePreview(), 600);
            });
        });

        this.switchTab('html');
        this._updatePreview();
    },

    _defaultHTML() {
        return `<!-- أضف HTML هنا -->
<h1>مرحباً بالعالم! 👋</h1>
<p>ابدأ الكتابة وشاهد النتيجة مباشرةً</p>
<button id="myBtn">اضغطني</button>`;
    },

    _defaultCSS() {
        return `body {
    font-family: 'Segoe UI', sans-serif;
    padding: 30px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #fff;
}

h1 { font-size: 2rem; margin-bottom: 1rem; }

button {
    background: white;
    color: #6366f1;
    border: none;
    padding: 12px 28px;
    border-radius: 50px;
    font-size: 1rem;
    cursor: pointer;
    font-weight: 600;
    transition: transform 0.2s, box-shadow 0.2s;
}

button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.2);
}`;
    },

    _defaultJS() {
        return `// أضف JavaScript هنا
const btn = document.getElementById('myBtn');
btn.addEventListener('click', () => {
    btn.textContent = '🎉 ممتاز!';
    btn.style.background = '#34d399';
    btn.style.color = '#fff';
});`;
    },

    _updatePreview() {
        const iframe = document.getElementById('preview-iframe');
        if (!iframe) return;
        const html = this.editors.html?.getValue() || '';
        const css  = this.editors.css?.getValue()  || '';
        const js   = this.editors.js?.getValue()   || '';

        const fullHTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>*, *::before, *::after { box-sizing: border-box; }
${css}</style>
</head>
<body>
${html}
<script>
try { ${js} } catch(e) { 
    document.body.innerHTML += '<div style="background:#fee2e2;color:#b91c1c;padding:12px;margin-top:16px;border-radius:8px;font-family:monospace">❌ ' + e.message + '</div>';
}
</script>
</body>
</html>`;

        iframe.srcdoc = fullHTML;

        const codeView = document.getElementById('live-code-view');
        if (codeView) {
            codeView.textContent = fullHTML;
            if (window.hljs) hljs.highlightElement(codeView);
        }
    },

    switchTab(tab) {
        this.currentTab = tab;
        ['html', 'css', 'js'].forEach(t => {
            const el  = document.getElementById(`monaco-${t}`);
            const btn = document.getElementById(`code-tab-${t}`);
            if (el)  el.style.display  = t === tab ? 'block' : 'none';
            if (btn) btn.classList.toggle('active', t === tab);
        });
        const ed = this.editors[tab];
        if (ed) setTimeout(() => { ed.layout(); ed.focus(); }, 50);
    },

    activate() {
        this.isActive = true;
        const panel     = document.getElementById('code-editor-panel');
        const workspace = document.getElementById('workspace-container-panel');
        const toolbox   = document.getElementById('toolbox');
        const resizerT  = document.getElementById('resizer-toolbox');

        if (panel)     panel.style.display     = 'flex';
        if (workspace) workspace.style.display = 'none';
        if (toolbox)   toolbox.style.display   = 'none';
        if (resizerT)  resizerT.style.display  = 'none';

        // Sync current blocks → code
        if (window.AppState && AppState.workspaceBlocks.length > 0) {
            try {
                const gen = generateCode(AppState.workspaceBlocks);
                if (this.editors.html && gen.html) this.editors.html.setValue(gen.html.trim());
                if (this.editors.css  && gen.css)  this.editors.css.setValue(gen.css.trim());
                if (this.editors.js   && gen.js)   this.editors.js.setValue(gen.js.trim());
            } catch(e) {}
        }

        setTimeout(() => {
            Object.values(this.editors).forEach(e => e?.layout());
            this._updatePreview();
        }, 150);

        this._updateToggleBtn(true);
        if (window.showToast) showToast('وضع الكود النصي — Monaco Editor ⚡', 'info');
    },

    deactivate() {
        this.isActive = false;
        const panel     = document.getElementById('code-editor-panel');
        const workspace = document.getElementById('workspace-container-panel');
        const toolbox   = document.getElementById('toolbox');
        const resizerT  = document.getElementById('resizer-toolbox');

        if (panel)     panel.style.display     = 'none';
        if (workspace) workspace.style.display = 'flex';
        if (toolbox)   toolbox.style.display   = 'flex';
        if (resizerT)  resizerT.style.display  = 'flex';

        this._updateToggleBtn(false);
        if (window.showToast) showToast('وضع البلوكات المرئية 🧩', 'info');
    },

    toggle() {
        if (this.isActive) { this.deactivate(); } else { this.activate(); }
    },

    formatCode() {
        const ed = this.editors[this.currentTab];
        if (ed) ed.getAction('editor.action.formatDocument')?.run();
    },

    _updateToggleBtn(active) {
        const btn = document.getElementById('btn-code-mode');
        if (!btn) return;
        btn.classList.toggle('active', active);
        btn.innerHTML = active
            ? '<i class="fa-solid fa-cubes"></i><span class="btn-text">Blocks</span>'
            : '<i class="fa-solid fa-code"></i><span class="btn-text">Code</span>';
        btn.title = active ? 'Switch to Blocks mode' : 'Switch to Code mode (Monaco Editor)';
    }
};

window.CodeEditorManager = CodeEditorManager;
