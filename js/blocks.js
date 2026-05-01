// Block Definitions & Code Generator — BlocksCode Platform

const BlockDefinitions = [
    // ─── Structure ─────────────────────────────
    { type: "element", category: "Structure", label: "Div  <div>", tag: "div", icon: "fa-box", hasChildren: true },
    { type: "element", category: "Structure", label: "Flex  <div style='display:flex'>", tag: "div", icon: "fa-arrows-left-right", hasChildren: true, styles: { display: "flex", gap: "10px", alignItems: "center" } },
    { type: "element", category: "Structure", label: "Span  <span>", tag: "span", icon: "fa-font", hasChildren: true },
    { type: "element", category: "Structure", label: "Section  <section>", tag: "section", icon: "fa-puzzle-piece", hasChildren: true, styles: { padding: "20px", marginBottom: "10px" } },
    { type: "element", category: "Structure", label: "Header  <header>", tag: "header", icon: "fa-heading", hasChildren: true },
    { type: "element", category: "Structure", label: "Footer  <footer>", tag: "footer", icon: "fa-shoe-prints", hasChildren: true },
    { type: "element", category: "Structure", label: "Nav  <nav>", tag: "nav", icon: "fa-compass", hasChildren: true },

    // ─── Lists ─────────────────────────────────
    { type: "element", category: "Lists", label: "Unordered List  <ul>", tag: "ul", icon: "fa-list-ul", hasChildren: true },
    { type: "element", category: "Lists", label: "Ordered List  <ol>", tag: "ol", icon: "fa-list-ol", hasChildren: true },
    { type: "element", category: "Lists", label: "List Item  <li>", tag: "li", icon: "fa-minus", hasChildren: true, innerText: "Item" },

    // ─── Tables ────────────────────────────────
    { type: "element", category: "Tables", label: "Table  <table>", tag: "table", icon: "fa-table", hasChildren: true, styles: { width: "100%", borderCollapse: "collapse" } },
    { type: "element", category: "Tables", label: "Row  <tr>", tag: "tr", icon: "fa-grip-lines", hasChildren: true },
    { type: "element", category: "Tables", label: "Head Cell  <th>", tag: "th", icon: "fa-heading", hasChildren: true, styles: { border: "1px solid #ccc", padding: "8px", backgroundColor: "#f4f4f4" }, innerText: "Header" },
    { type: "element", category: "Tables", label: "Data Cell  <td>", tag: "td", icon: "fa-border-all", hasChildren: true, styles: { border: "1px solid #ccc", padding: "8px" }, innerText: "Data" },

    // ─── Text ──────────────────────────────────
    { type: "element", category: "Text", label: "Heading 1  <h1>", tag: "h1", icon: "fa-heading", hasChildren: false, innerText: "Main Title" },
    { type: "element", category: "Text", label: "Heading 3  <h3>", tag: "h3", icon: "fa-h3", hasChildren: false, innerText: "Sub Title" },
    { type: "element", category: "Text", label: "Paragraph  <p>", tag: "p", icon: "fa-paragraph", hasChildren: false, innerText: "Your paragraph text here." },
    { type: "element", category: "Text", label: "Bold  <b>", tag: "b", icon: "fa-bold", hasChildren: false, innerText: "Bold Text" },
    { type: "element", category: "Text", label: "Line Break  <br>", tag: "br", icon: "fa-arrow-turn-down", hasChildren: false },
    { type: "element", category: "Text", label: "Divider  <hr>", tag: "hr", icon: "fa-minus", hasChildren: false },

    // ─── Media ─────────────────────────────────
    { type: "element", category: "Media", label: "Image  <img src=''>", tag: "img", icon: "fa-image", hasChildren: false, attributes: { src: "https://via.placeholder.com/150", alt: "image", width: "150" } },
    { type: "element", category: "Media", label: "Link  <a href=''>", tag: "a", icon: "fa-link", hasChildren: false, attributes: { href: "#" }, innerText: "Click Here" },
    { type: "element", category: "Media", label: "Iframe  <iframe src=''>", tag: "iframe", icon: "fa-youtube", hasChildren: false, attributes: { src: "https://www.youtube.com/embed/dQw4w9WgXcQ", width: "560", height: "315", frameborder: "0" } },
    { type: "element", category: "Media", label: "Video  <video src=''>", tag: "video", icon: "fa-video", hasChildren: false, attributes: { src: "", width: "300", controls: "true" } },
    { type: "element", category: "Media", label: "Audio  <audio src=''>", tag: "audio", icon: "fa-music", hasChildren: false, attributes: { src: "", controls: "true" } },

    // ─── Forms ─────────────────────────────────
    { type: "element", category: "Forms", label: "Form  <form>", tag: "form", icon: "fa-wpforms", hasChildren: true },
    { type: "element", category: "Forms", label: "Label  <label>", tag: "label", icon: "fa-tag", hasChildren: false, innerText: "Name:" },
    { type: "element", category: "Forms", label: "Input  <input type='text'>", tag: "input", icon: "fa-keyboard", hasChildren: false, attributes: { type: "text", placeholder: "Enter text...", id: "myInput" } },
    { type: "element", category: "Forms", label: "Textarea  <textarea>", tag: "textarea", icon: "fa-align-justify", hasChildren: false, attributes: { placeholder: "Write your message..." }, innerText: "" },
    { type: "element", category: "Forms", label: "Select  <select>", tag: "select", icon: "fa-caret-down", hasChildren: true },
    { type: "element", category: "Forms", label: "Option  <option value=''>", tag: "option", icon: "fa-check", hasChildren: false, attributes: { value: "1" }, innerText: "Option 1" },
    { type: "element", category: "Forms", label: "Button  <button>", tag: "button", icon: "fa-hand-pointer", hasChildren: false, innerText: "Click Me" },

    // ─── Custom Code ───────────────────────────
    { type: "element", category: "Custom Code", label: "HTML  <!-- raw html -->", tag: "custom-html", icon: "fa-code", hasChildren: false, attributes: { rawCode: "<!-- Write HTML here -->" } },
    { type: "css",     category: "Custom Code", label: "CSS  /* raw css */", tag: "custom-css", icon: "fa-hashtag", hasChildren: false, attributes: { rawCode: "/* Write CSS here */" } },
    { type: "logic",   category: "Custom Code", label: "JS  // raw js", tag: "custom-js", icon: "fa-bolt", hasChildren: false, attributes: { rawCode: "// Write JavaScript here" } },

    // ─── CSS Styles ────────────────────────────
    { type: "css", category: "CSS Styles", label: "Class Rule  .name { }", tag: "css-rule", icon: "fa-palette", hasChildren: false, attributes: { selector: ".my-card" }, styles: {} },
    { type: "css", category: "CSS Styles", label: "Tag Rule  tag { }", tag: "css-rule", icon: "fa-brush", hasChildren: false, attributes: { selector: "button" }, styles: {} },
    { type: "css", category: "CSS Styles", label: "Hover  .el:hover { }", tag: "css-rule", icon: "fa-hand-pointer", hasChildren: false, attributes: { selector: ".btn:hover" }, styles: {} },
    { type: "css", category: "CSS Styles", label: "Mobile  @media (max-width:768px)", tag: "css-media-mobile", icon: "fa-mobile-screen", hasChildren: false, attributes: { selector: ".my-card" }, styles: {} },

    // ─── JS Events ─────────────────────────────
    { type: "event", category: "JS Events", label: "Click  addEventListener('click')", tag: "event-click", icon: "fa-mouse", hasChildren: true, attributes: { targetSelector: "button" } },
    { type: "event", category: "JS Events", label: "Hover  addEventListener('mouseenter')", tag: "event-mouseenter", icon: "fa-hand-pointer", hasChildren: true, attributes: { targetSelector: ".card" } },
    { type: "event", category: "JS Events", label: "Change  addEventListener('change')", tag: "event-change", icon: "fa-keyboard", hasChildren: true, attributes: { targetSelector: "input" } },

    // ─── JS Logic ──────────────────────────────
    { type: "logic", category: "JS Logic", label: "Log  console.log('')", tag: "console-log", icon: "fa-terminal", hasChildren: false, attributes: { message: "Hello Console!" } },
    { type: "logic", category: "JS Logic", label: "Alert  alert('')", tag: "alert", icon: "fa-bell", hasChildren: false, attributes: { message: "Hello!" } },
    { type: "logic", category: "JS Logic", label: "Set Text  el.innerText = ''", tag: "change-text", icon: "fa-pen", hasChildren: false, attributes: { targetSelector: "h1", newText: "New Text!" } },
    { type: "logic", category: "JS Logic", label: "Toggle Class  classList.toggle()", tag: "js-toggle-class", icon: "fa-wand-magic-sparkles", hasChildren: false, attributes: { targetSelector: "#menu", className: "active" } },
    { type: "logic", category: "JS Logic", label: "Set Style  el.style.prop = ''", tag: "js-change-style", icon: "fa-fill-drip", hasChildren: false, attributes: { targetSelector: "body", cssProperty: "backgroundColor", cssValue: "red" } },
    { type: "logic", category: "JS Logic", label: "Read Input  el.value", tag: "var-from-input", icon: "fa-keyboard", hasChildren: false, attributes: { varName: "inputValue", inputId: "#myInput" } },
    { type: "logic", category: "JS Logic", label: "Variable  let name = val", tag: "var-declare", icon: "fa-cube", hasChildren: false, attributes: { varName: "score", varValue: "0" } },
    { type: "logic", category: "JS Logic", label: "Increment  name += amount", tag: "var-increment", icon: "fa-plus", hasChildren: false, attributes: { varName: "score", amount: "1" } },
    { type: "event", category: "JS Logic", label: "If  if (condition) { }", tag: "if-condition", icon: "fa-code-branch", hasChildren: true, attributes: { condition: "score > 5" } },
    { type: "event", category: "JS Logic", label: "For Loop  for(i=0; i<n; i++)", tag: "loop-for", icon: "fa-rotate-right", hasChildren: true, attributes: { times: "5" } },
    { type: "event", category: "JS Logic", label: "Timeout  setTimeout(fn, ms)", tag: "timer-timeout", icon: "fa-clock", hasChildren: true, attributes: { delayMs: "1000" } },
    { type: "event", category: "JS Logic", label: "Fetch  fetch(url).then()", tag: "js-fetch", icon: "fa-cloud-arrow-down", hasChildren: true, attributes: { url: "https://jsonplaceholder.typicode.com/todos/1", varName: "apiData" } },

    // ─── Semantic HTML (new) ─────────────────────────────────────
    { type: "element", category: "Semantic", label: "Article  <article>",  tag: "article", icon: "fa-newspaper",    hasChildren: true },
    { type: "element", category: "Semantic", label: "Aside    <aside>",    tag: "aside",   icon: "fa-sidebar",     hasChildren: true },
    { type: "element", category: "Semantic", label: "Main     <main>",     tag: "main",    icon: "fa-house",       hasChildren: true },
    { type: "element", category: "Semantic", label: "Figure   <figure>",   tag: "figure",  icon: "fa-image",       hasChildren: true },
    { type: "element", category: "Semantic", label: "Figcaption <figcaption>", tag: "figcaption", icon: "fa-align-left", hasChildren: false, innerText: "Caption" },

    // ─── CSS Grid (new) ─────────────────────────────────────────
    { type: "element", category: "Structure", label: "Grid  <div style='display:grid'>", tag: "div", icon: "fa-th", hasChildren: true, styles: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" } },

    // ─── JS Advanced Blocks (new) ────────────────────────────────
    { type: "logic", category: "JS Logic", label: "Array  let arr = []",      tag: "array-declare",  icon: "fa-list",           hasChildren: false, attributes: { varName: "myArray",  items: "'item1', 'item2', 'item3'" } },
    { type: "logic", category: "JS Logic", label: "Object  let obj = {}",     tag: "object-declare", icon: "fa-cube",           hasChildren: false, attributes: { varName: "myObject", keys: "name: 'Ali', age: 25" } },
    { type: "event", category: "JS Logic", label: "Function  function() {}", tag: "func-declare",   icon: "fa-f",             hasChildren: true,  attributes: { funcName: "myFunction" } },
    { type: "event", category: "JS Logic", label: "forEach  arr.forEach()",  tag: "loop-foreach",  icon: "fa-arrows-rotate", hasChildren: true,  attributes: { arrayName: "myArray", itemName: "item" } },
    { type: "event", category: "JS Logic", label: "Try/Catch  try {} catch{}",tag: "try-catch",     icon: "fa-shield-halved", hasChildren: true,  attributes: { errorVar: "error" } },
    { type: "logic", category: "JS Logic", label: "String Method  str.method()", tag: "string-method", icon: "fa-text-slash", hasChildren: false, attributes: { varName: "result", sourceVar: "myStr", method: "toUpperCase" } }
];

// ─────────────────────────────────────────────
// Helper: check if a block category is CSS
function isCSSCategory(cat) {
    return cat === "CSS Styles" || cat === "Custom Code";
}
// check if JS
function isJSCategory(cat) {
    return cat === "JS Events" || cat === "JS Logic" || cat === "Custom Code";
}

function generateId() { return Math.random().toString(36).substr(2, 9); }

function createBlockInstance(definition) {
    return {
        id: "block_" + generateId(),
        type: definition.type,
        category: definition.category,
        label: definition.label,
        tag: definition.tag,
        innerText: definition.innerText,
        attributes: definition.attributes ? JSON.parse(JSON.stringify(definition.attributes)) : {},
        styles: definition.styles ? JSON.parse(JSON.stringify(definition.styles)) : {},
        children: definition.hasChildren ? [] : null
    };
}

function generateCode(blocks) {
    let htmlContent = "";
    let jsContent   = "";
    let cssContent  = "";

    const processBlock = (block) => {
        const cat = block.category || "";

        // ── CSS Blocks ──
        if (cat === "CSS Styles" || block.tag === "custom-css") {
            if (block.tag === "custom-css") {
                cssContent += `${block.attributes.rawCode}\n`;
            }
            if (block.tag === "css-rule" || block.tag === "css-media-mobile") {
                let ruleStr = `${block.attributes.selector} {\n`;
                if (block.styles) {
                    for (let key in block.styles) {
                        if (block.styles[key]) {
                            const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
                            ruleStr += `    ${cssKey}: ${block.styles[key]};\n`;
                        }
                    }
                }
                ruleStr += `}\n`;
                if (block.tag === "css-media-mobile") {
                    cssContent += `@media (max-width: 768px) {\n  ${ruleStr.split('\n').join('\n  ')}}\n`;
                } else {
                    cssContent += ruleStr;
                }
            }
        }
        // ── JS Blocks ──
        else if (cat === "JS Events" || cat === "JS Logic" || block.tag === "custom-js") {
            const processJSBlock = (b, indent = "  ") => {
                let js = "";
                if (b.tag === "custom-js")        js += `${indent}${b.attributes.rawCode}\n`;
                if (b.tag === "alert")             js += `${indent}alert('${b.attributes.message}');\n`;
                if (b.tag === "console-log")       js += `${indent}console.log('${b.attributes.message}');\n`;
                if (b.tag === "var-declare")       js += `${indent}let ${b.attributes.varName} = ${b.attributes.varValue};\n`;
                if (b.tag === "var-from-input")    js += `${indent}let ${b.attributes.varName} = document.querySelector('${b.attributes.inputId}')?.value || '';\n`;
                if (b.tag === "var-increment")     js += `${indent}${b.attributes.varName} += parseInt(${b.attributes.amount});\n`;
                if (b.tag === "js-toggle-class")   js += `${indent}document.querySelector('${b.attributes.targetSelector}')?.classList.toggle('${b.attributes.className}');\n`;
                if (b.tag === "js-change-style")   js += `${indent}document.querySelector('${b.attributes.targetSelector}').style.${b.attributes.cssProperty} = '${b.attributes.cssValue}';\n`;
                if (b.tag === "change-text") {
                    const sel = b.attributes.targetSelector || 'h1';
                    js += `${indent}const el_${b.id} = document.querySelector('${sel}');\n`;
                    js += `${indent}if(el_${b.id}) el_${b.id}.innerText = '${b.attributes.newText}';\n`;
                }
                if (b.tag === "event-click") {
                    js += `${indent}document.querySelector('${b.attributes.targetSelector || "button"}')?.addEventListener('click', function(event) {\n`;
                    if (b.children) b.children.forEach(c => js += processJSBlock(c, indent + "  "));
                    js += `${indent}}); // click\n`;
                }
                if (b.tag === "event-mouseenter") {
                    js += `${indent}document.querySelector('${b.attributes.targetSelector || "button"}')?.addEventListener('mouseenter', function(event) {\n`;
                    if (b.children) b.children.forEach(c => js += processJSBlock(c, indent + "  "));
                    js += `${indent}}); // mouseenter\n`;
                }
                if (b.tag === "event-change") {
                    js += `${indent}document.querySelector('${b.attributes.targetSelector || "input"}')?.addEventListener('change', function(event) {\n`;
                    if (b.children) b.children.forEach(c => js += processJSBlock(c, indent + "  "));
                    js += `${indent}}); // change\n`;
                }
                if (b.tag === "if-condition") {
                    js += `${indent}if (${b.attributes.condition}) {\n`;
                    if (b.children) b.children.forEach(c => js += processJSBlock(c, indent + "  "));
                    js += `${indent}}\n`;
                }
                if (b.tag === "loop-for") {
                    js += `${indent}for(let i=0; i<${b.attributes.times}; i++) {\n`;
                    if (b.children) b.children.forEach(c => js += processJSBlock(c, indent + "  "));
                    js += `${indent}}\n`;
                }
                if (b.tag === "timer-timeout") {
                    js += `${indent}setTimeout(function() {\n`;
                    if (b.children) b.children.forEach(c => js += processJSBlock(c, indent + "  "));
                    js += `${indent}}, ${b.attributes.delayMs});\n`;
                }
                if (b.tag === "js-fetch") {
                    js += `${indent}fetch('${b.attributes.url}').then(res => res.json()).then(data => {\n`;
                    js += `${indent}  let ${b.attributes.varName} = typeof data === 'object' ? JSON.stringify(data) : data;\n`;
                    if (b.children) b.children.forEach(c => js += processJSBlock(c, indent + "  "));
                    js += `${indent}}).catch(err => console.error(err));\n`;
                }
                // ── New Advanced Blocks ──
                if (b.tag === "array-declare") {
                    js += `${indent}let ${b.attributes.varName} = [${b.attributes.items}];\n`;
                }
                if (b.tag === "object-declare") {
                    js += `${indent}let ${b.attributes.varName} = { ${b.attributes.keys} };\n`;
                }
                if (b.tag === "func-declare") {
                    js += `${indent}function ${b.attributes.funcName}() {\n`;
                    if (b.children) b.children.forEach(c => js += processJSBlock(c, indent + "  "));
                    js += `${indent}}\n`;
                    js += `${indent}${b.attributes.funcName}();\n`;
                }
                if (b.tag === "loop-foreach") {
                    js += `${indent}${b.attributes.arrayName}.forEach(function(${b.attributes.itemName}) {\n`;
                    if (b.children) b.children.forEach(c => js += processJSBlock(c, indent + "  "));
                    js += `${indent}});\n`;
                }
                if (b.tag === "try-catch") {
                    js += `${indent}try {\n`;
                    if (b.children) b.children.forEach(c => js += processJSBlock(c, indent + "  "));
                    js += `${indent}} catch(${b.attributes.errorVar}) {\n`;
                    js += `${indent}  console.error('Error:', ${b.attributes.errorVar}.message);\n`;
                    js += `${indent}}\n`;
                }
                if (b.tag === "string-method") {
                    js += `${indent}let ${b.attributes.varName} = ${b.attributes.sourceVar}.${b.attributes.method}();\n`;
                    js += `${indent}console.log(${b.attributes.varName});\n`;
                }
                return js;
            };
            jsContent += processJSBlock(block, "");
        }
        // ── HTML Blocks ──
        else {
            htmlContent += generateHTML(block);
        }
    };

    blocks.forEach(processBlock);

    return {
        html: htmlContent,
        css:  "body { font-family: 'Segoe UI', Tahoma, sans-serif; padding: 20px; box-sizing: border-box; } *{box-sizing: border-box;}\n" + cssContent,
        js:   jsContent
    };
}

function generateHTML(block) {
    if (!block) return "";
    const cat = block.category || "";
    // تجاهل بلوكات CSS و JS والكود المخصص لـ CSS/JS
    if (
        cat === "CSS Styles" || cat === "JS Events" || cat === "JS Logic" ||
        block.tag === "custom-css" || block.tag === "custom-js"
    ) return "";

    if (block.tag === "custom-html") {
        return `${block.attributes.rawCode}\n`;
    }

    let attrs = "";
    if (block.attributes) {
        for (let key in block.attributes) {
            if (block.attributes[key]) {
                attrs += ` ${key}="${block.attributes[key]}"`;
            }
        }
    }

    if (block.styles) {
        let styleStr = "";
        for (let key in block.styles) {
            if (block.styles[key]) {
                const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
                styleStr += `${cssKey}: ${block.styles[key]}; `;
            }
        }
        if (styleStr.trim() !== "") attrs += ` style="${styleStr.trim()}"`;
    }

    const voidElements = ['img', 'input', 'br', 'hr'];
    if (voidElements.includes(block.tag)) {
        return `<${block.tag}${attrs}>\n`;
    }

    let innerHTML = block.innerText || "";
    if (block.children && block.children.length > 0) {
        for (let child of block.children) {
            innerHTML += generateHTML(child);
        }
    }

    return `<${block.tag}${attrs}>${innerHTML}</${block.tag}>\n`;
}
