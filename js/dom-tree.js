// DOM Tree Manager
const DOMTreeManager = {
    renderTree(blocks, container, depth = 0) {
        if(depth === 0) container.innerHTML = '';
        
        if (!blocks || blocks.length === 0) {
            if(depth === 0) container.innerHTML = '<div style="padding:20px; text-align:center; color:var(--text-muted); font-size:0.9rem;">الرجاء سحب البلوكات لمساحة العمل</div>';
            return;
        }

        blocks.forEach(block => {
            const item = document.createElement('div');
            item.className = 'dom-tree-item';

            const indent = depth * 15;
            const isCollapsible = block.children && block.children.length > 0;
            const caret = isCollapsible ? `<i class="fa-solid fa-caret-down tree-caret" onclick="event.stopPropagation(); this.parentElement.nextElementSibling.classList.toggle('hidden'); this.classList.toggle('fa-caret-right');"></i>` : `<span style="width:16px; display:inline-block;"></span>`;

            const isActive = AppState.selectedBlockId === block.id ? 'active-tree-node' : '';

            let tagDisplay = block.tag;
            if (block.tag === 'custom-html' || block.tag === 'custom-css') tagDisplay = block.label.split(' ')[0];

            item.innerHTML = `
                <div class="dom-tree-row ${isActive}" style="padding-left: ${indent + 10}px;" onclick="AppState.selectBlock('${block.id}')">
                    ${caret}
                    <span class="dom-tree-tag" style="color:var(--primary); font-weight:bold; font-size:0.85rem;">&lt;${tagDisplay}&gt;</span>
                    ${block.attributes?.id ? `<span class="dom-tree-id" style="color:var(--warning); font-size:0.8rem; margin-left:5px;">#${block.attributes.id}</span>` : ''}
                    ${block.attributes?.class ? `<span class="dom-tree-class" style="color:var(--info); font-size:0.8rem; margin-left:5px;">.${block.attributes.class.split(' ')[0]}</span>` : ''}
                    ${block.innerText ? `<span style="color:var(--text-muted); font-size:0.8rem; margin-left:5px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:80px; display:inline-block; vertical-align:bottom;">${block.innerText}</span>` : ''}
                </div>
            `;

            container.appendChild(item);

            if (block.children) {
                const childContainer = document.createElement('div');
                childContainer.className = 'dom-tree-children';
                this.renderTree(block.children, childContainer, depth + 1);
                container.appendChild(childContainer);
            }
        });
    },

    update() {
        const domTreeContainer = document.getElementById('dom-tree-view');
        if (domTreeContainer && domTreeContainer.style.display !== 'none') {
            this.renderTree(AppState.workspaceBlocks, domTreeContainer);
        }
    }
};

window.switchToolboxTab = function(tab) {
    const blocksView = document.getElementById('toolbox-blocks-view');
    const domView = document.getElementById('dom-tree-view');
    const searchWrapper = document.querySelector('.toolbox-search-wrapper');
    const btns = document.querySelectorAll('.toolbox-tabs .tab-btn');

    btns.forEach(b => b.classList.remove('active'));

    if (tab === 'blocks') {
        blocksView.style.display = 'block';
        searchWrapper.style.display = 'flex';
        domView.style.display = 'none';
        btns[0].classList.add('active');
    } else {
        blocksView.style.display = 'none';
        searchWrapper.style.display = 'none';
        domView.style.display = 'block';
        btns[1].classList.add('active');
        DOMTreeManager.update();
    }
};

window.DOMTreeManager = DOMTreeManager;

document.addEventListener('DOMContentLoaded', () => {
    AppState.subscribe(() => {
        DOMTreeManager.update();
    });
});
