// Templates Library for BlocksCode
const TemplatesLibrary = [
    {
        id: "card",
        name: "Profile Card",
        description: "A simple user profile card with an image and text.",
        icon: "fa-address-card",
        blocks: [
            {
                type: "element", tag: "div", category: "Structure", 
                styles: { display: "flex", flexDirection: "column", alignItems: "center", padding: "20px", border: "1px solid #ccc", borderRadius: "10px", width: "250px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", backgroundColor: "#fff", margin: "20px" },
                children: [
                    { type: "element", tag: "img", category: "Media", attributes: { src: "https://via.placeholder.com/100", width: "100" }, styles: { borderRadius: "50%", marginBottom: "15px" } },
                    { type: "element", tag: "h3", category: "Text", innerText: "John Doe", styles: { margin: "0 0 5px 0", color: "#333", fontFamily: "sans-serif" } },
                    { type: "element", tag: "p", category: "Text", innerText: "Web Developer", styles: { margin: "0", color: "#777", fontSize: "14px", fontFamily: "sans-serif" } },
                    { type: "element", tag: "button", category: "Forms", innerText: "Follow", styles: { marginTop: "15px", padding: "8px 20px", backgroundColor: "#3b82f6", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" } }
                ]
            }
        ]
    },
    {
        id: "navbar",
        name: "Navigation Bar",
        description: "A responsive top navigation bar.",
        icon: "fa-bars",
        blocks: [
            {
                type: "element", tag: "nav", category: "Structure",
                styles: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 30px", backgroundColor: "#1f2937", color: "white", fontFamily: "sans-serif", width: "100%", boxSizing: "border-box" },
                children: [
                    { type: "element", tag: "h3", category: "Text", innerText: "BrandLogo", styles: { margin: "0" } },
                    { type: "element", tag: "div", category: "Structure", styles: { display: "flex", gap: "20px" },
                        children: [
                            { type: "element", tag: "a", category: "Media", innerText: "Home", attributes: { href: "#" }, styles: { color: "white", textDecoration: "none" } },
                            { type: "element", tag: "a", category: "Media", innerText: "About", attributes: { href: "#" }, styles: { color: "white", textDecoration: "none" } },
                            { type: "element", tag: "a", category: "Media", innerText: "Contact", attributes: { href: "#" }, styles: { color: "white", textDecoration: "none" } }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: "login",
        name: "Login Form",
        description: "A standard login form with email and password.",
        icon: "fa-right-to-bracket",
        blocks: [
            {
                type: "element", tag: "form", category: "Forms",
                styles: { display: "flex", flexDirection: "column", gap: "15px", padding: "30px", border: "1px solid #ddd", borderRadius: "8px", width: "300px", backgroundColor: "#fff", margin: "50px auto", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", fontFamily: "sans-serif" },
                children: [
                    { type: "element", tag: "h3", category: "Text", innerText: "Welcome Back", styles: { margin: "0 0 10px 0", textAlign: "center", color: "#333" } },
                    { type: "element", tag: "input", category: "Forms", attributes: { type: "email", placeholder: "Email address" }, styles: { padding: "10px", border: "1px solid #ccc", borderRadius: "4px" } },
                    { type: "element", tag: "input", category: "Forms", attributes: { type: "password", placeholder: "Password" }, styles: { padding: "10px", border: "1px solid #ccc", borderRadius: "4px" } },
                    { type: "element", tag: "button", category: "Forms", innerText: "Sign In", styles: { padding: "10px", backgroundColor: "#10b981", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" } }
                ]
            }
        ]
    },
    {
        id: "hero",
        name: "Hero Section",
        description: "A large landing page hero section.",
        icon: "fa-bolt",
        blocks: [
            {
                type: "element", tag: "section", category: "Structure",
                styles: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "100px 20px", backgroundColor: "#f3f4f6", textAlign: "center", width: "100%", boxSizing: "border-box" },
                children: [
                    { type: "element", tag: "h1", category: "Text", innerText: "Welcome to Our Platform", styles: { margin: "0 0 20px 0", color: "#111827", fontSize: "3rem", fontFamily: "sans-serif" } },
                    { type: "element", tag: "p", category: "Text", innerText: "Build faster, better, and more efficiently with our modern tools.", styles: { margin: "0 0 30px 0", color: "#4b5563", fontSize: "1.2rem", maxWidth: "600px", fontFamily: "sans-serif" } },
                    { type: "element", tag: "div", category: "Structure", styles: { display: "flex", gap: "15px" },
                        children: [
                            { type: "element", tag: "button", category: "Forms", innerText: "Get Started", styles: { padding: "12px 25px", backgroundColor: "#4f46e5", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "1rem", fontWeight: "bold" } },
                            { type: "element", tag: "button", category: "Forms", innerText: "Learn More", styles: { padding: "12px 25px", backgroundColor: "transparent", color: "#4f46e5", border: "2px solid #4f46e5", borderRadius: "8px", cursor: "pointer", fontSize: "1rem", fontWeight: "bold" } }
                        ]
                    }
                ]
            }
        ]
    }
];

window.TemplatesLibrary = TemplatesLibrary;

window.insertTemplate = function(templateId) {
    const template = TemplatesLibrary.find(t => t.id === templateId);
    if (!template) return;
    
    function generateId() {
        return 'block_' + Math.random().toString(36).substr(2, 9);
    }
    
    function processBlock(tb) {
        const block = {
            id: generateId(),
            type: tb.type || "element",
            tag: tb.tag,
            category: tb.category,
            label: tb.tag,
            attributes: tb.attributes ? JSON.parse(JSON.stringify(tb.attributes)) : {},
            styles: tb.styles ? JSON.parse(JSON.stringify(tb.styles)) : {},
            innerText: tb.innerText !== undefined ? tb.innerText : undefined,
            children: tb.children ? [] : null
        };
        
        if (tb.children) {
            tb.children.forEach(c => {
                block.children.push(processBlock(c));
            });
        }
        return block;
    }
    
    const newBlocks = template.blocks.map(b => processBlock(b));
    AppState.workspaceBlocks.push(...newBlocks);
    AppState.notify();
    
    if (window.showToast) {
        showToast('✅ تم إدراج القالب بنجاح!', 'success');
    }
    
    document.getElementById('templates-modal')?.classList.remove('active');
};

window.renderTemplatesModal = function() {
    const grid = document.getElementById('templates-grid');
    if (!grid) return;
    
    grid.innerHTML = TemplatesLibrary.map(t => `
        <div class="template-card" onclick="insertTemplate('${t.id}')">
            <div class="template-icon"><i class="fa-solid ${t.icon}"></i></div>
            <div class="template-info">
                <h4>${t.name}</h4>
                <p>${t.description}</p>
            </div>
            <button class="btn btn-primary btn-sm" style="width:100%; margin-top:15px; justify-content:center;">إدراج القالب</button>
        </div>
    `).join('');
};
