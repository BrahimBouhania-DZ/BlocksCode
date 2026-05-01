// تصدير المشروع إلى ملف مضغوط (ZIP)
window.exportProjectToZip = function() {
    if (typeof JSZip === 'undefined') {
        if(window.showToast) showToast('جاري تحميل مكتبة ZIP، يرجى الانتظار...', 'info');
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
        script.onload = () => createZip();
        document.head.appendChild(script);
    } else {
        createZip();
    }
};

function createZip() {
    if (!window.generateCode || !AppState || !AppState.workspaceBlocks) {
        if(window.showToast) showToast('خطأ في تحميل المشروع!', 'error');
        return;
    }

    const generated = generateCode(AppState.workspaceBlocks);
    
    const htmlContent = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>موقعي - تم إنشاؤه بواسطة BlocksCode</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
${generated.html}
    
    <script src="script.js"><\/script>
</body>
</html>`;

    const cssContent = generated.css;
    const jsContent = generated.js;

    const zip = new JSZip();
    zip.file("index.html", htmlContent);
    zip.file("style.css", cssContent);
    zip.file("script.js", jsContent);

    zip.generateAsync({type:"blob"}).then(function(content) {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(content);
        a.download = "BlocksCode-Project.zip";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        if(window.showToast) showToast('تم تصدير المشروع بنجاح بصيغة ZIP!', 'success');
    }).catch(err => {
        console.error("ZIP Error:", err);
        if(window.showToast) showToast('حدث خطأ أثناء تصدير الملف!', 'error');
    });
}
