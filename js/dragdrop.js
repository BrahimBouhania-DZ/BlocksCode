// محرك السحب والإفلات مع بحث البلوكات والتحسينات

function initDragDrop() {
    renderToolbox();

    const workspace = document.getElementById('workspace');
    if (workspace) {
        workspace.addEventListener('dragover',  handleDragOver);
        workspace.addEventListener('dragleave', handleDragLeave);
        workspace.addEventListener('drop',      handleDrop);
    }
    
    // بحث البلوكات
    const searchInput = document.getElementById('toolbox-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterBlocks(e.target.value.trim().toLowerCase());
        });
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                searchInput.value = '';
                filterBlocks('');
            }
        });
    }
}

function renderToolbox() {
    const container = document.getElementById('toolbox-categories');
    if (!container) return;
    
    container.innerHTML = '';
    
    const categories = [...new Set(BlockDefinitions.map(b => b.category))];
    
    categories.forEach(category => {
        const catDiv  = document.createElement('div');
        catDiv.className = 'toolbox-category-group';
        catDiv.setAttribute('data-category', category);
        
        const title = document.createElement('div');
        title.className = 'category-title';
        title.innerHTML = `<i class="fa-solid fa-chevron-down" style="font-size:0.7rem;"></i> ${category}`;
        
        // طي/فتح التصنيف بالضغط
        title.style.cursor = 'pointer';
        title.addEventListener('click', () => {
            const blocksInCat = catDiv.querySelector('.category-blocks');
            if (blocksInCat) {
                blocksInCat.style.display = blocksInCat.style.display === 'none' ? '' : 'none';
                title.querySelector('i').style.transform = blocksInCat.style.display === 'none' ? 'rotate(-90deg)' : '';
            }
        });
        
        catDiv.appendChild(title);
        
        const blocksWrapper = document.createElement('div');
        blocksWrapper.className = 'category-blocks';
        
        const blocks = BlockDefinitions.filter(b => b.category === category);
        blocks.forEach((def) => {
            const blockEl = document.createElement('div');
            blockEl.className = 'block';
            blockEl.setAttribute('draggable', 'true');
            blockEl.setAttribute('data-category', category);
            blockEl.setAttribute('data-label', def.label.toLowerCase());

            // تقسيم الاسم عن الأمر: "Button  <button>" → ["Button", "<button>"]
            const parts     = def.label.split(/\s{2,}/);
            const blockName = parts[0] || def.label;
            const codeSnip  = parts[1] || '';

            blockEl.innerHTML = `
                <i class="fa-solid ${def.icon}" style="flex-shrink:0;"></i>
                <span class="block-content">
                    <span class="block-name">${blockName}</span>
                    ${codeSnip ? `<code class="block-code">${codeSnip.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</code>` : ''}
                </span>`;
            
            blockEl.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('source', 'toolbox');
                e.dataTransfer.setData('defIndex', BlockDefinitions.indexOf(def));
                e.stopPropagation();
            });
            
            // نقر مزدوج لإضافة البلوك مباشرة
            blockEl.addEventListener('dblclick', () => {
                const newBlock = createBlockInstance(def);
                AppState.addBlock(newBlock);
                showToast(`✅ Added "${blockName}"`, 'success');
            });
            
            blocksWrapper.appendChild(blockEl);
        });
        
        catDiv.appendChild(blocksWrapper);
        container.appendChild(catDiv);
    });
}

// فلترة البلوكات حسب البحث
function filterBlocks(query) {
    const groups = document.querySelectorAll('.toolbox-category-group');
    
    groups.forEach(group => {
        const blocks = group.querySelectorAll('.block');
        let visibleCount = 0;
        
        blocks.forEach(block => {
            const label = block.getAttribute('data-label') || '';
            const cat   = block.getAttribute('data-category')?.toLowerCase() || '';
            const match = !query || label.includes(query) || cat.includes(query);
            block.style.display = match ? '' : 'none';
            if (match) visibleCount++;
        });
        
        // إخفاء التصنيف الفارغ كلياً
        group.style.display = visibleCount === 0 ? 'none' : '';
        // فتح التصنيف إذا كان هناك بحث
        if (query) {
            const blocksWrapper = group.querySelector('.category-blocks');
            if (blocksWrapper) blocksWrapper.style.display = '';
        }
    });
    
    // رسالة "لا نتائج"
    let noResult = document.getElementById('no-blocks-result');
    const container = document.getElementById('toolbox-categories');
    const allHidden = [...groups].every(g => g.style.display === 'none');
    
    if (allHidden && query) {
        if (!noResult) {
            noResult = document.createElement('div');
            noResult.id = 'no-blocks-result';
            noResult.style.cssText = 'text-align:center;padding:2rem;color:var(--text-muted);font-size:0.9rem;';
            noResult.innerHTML = '<i class="fa-solid fa-search" style="font-size:2rem;display:block;margin-bottom:0.5rem;"></i>لا توجد بلوكات مطابقة';
        }
        container?.appendChild(noResult);
    } else if (noResult) {
        noResult.remove();
    }
}

function getDragAfterElement(container, y) {
    const draggableElements = Array.from(container.children).filter(
        c => c.classList.contains('block') && !c.classList.contains('dragging')
    );
    return draggableElements.reduce((closest, child) => {
        const box    = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset, element: child };
        }
        return closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    const target = e.target.closest('.block-children') || document.getElementById('workspace');
    if (target) target.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    const target = e.target.closest('.block-children') || e.target;
    if (target) target.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    
    // إزالة كل علامات drag-over
    document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
    
    const target   = e.target.closest('.block-children') || document.getElementById('workspace');
    let   parentId = null;
    if (target && target.classList.contains('block-children')) {
        parentId = target.getAttribute('data-parent-id');
    }
    
    const afterElement  = getDragAfterElement(target, e.clientY);
    const insertBeforeId = afterElement ? afterElement.id : null;
    const source         = e.dataTransfer.getData('source');
    
    if (source === 'toolbox') {
        const defIndex  = e.dataTransfer.getData('defIndex');
        const definition = BlockDefinitions[defIndex];
        if (definition) {
            const newBlock = createBlockInstance(definition);
            AppState.addBlock(newBlock, parentId, insertBeforeId);
        }
    } else if (source === 'workspace') {
        const blockId = e.dataTransfer.getData('blockId');
        if (blockId && blockId !== parentId) {
            AppState.moveBlock(blockId, parentId, insertBeforeId);
        }
    }
}
