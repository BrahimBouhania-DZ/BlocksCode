// إدارة حالة التطبيق مع دعم التراجع والإعادة (Undo/Redo & History)
const AppState = {
    workspaceBlocks: [], 
    selectedBlockId: null,
    theme: localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'),
    subscribers: [],
    isPlayground: false,
    
    history: [],
    historyIndex: -1,
    isUndoing: false,

    subscribe(fn) { this.subscribers.push(fn); },

    notify() {
        this.subscribers.forEach(fn => fn(this));
        if (this.isPlayground && !this.isUndoing) {
            StorageManager.savePlayground(this.workspaceBlocks);
        }
    },

    saveHistory() {
        if (this.isUndoing) return;
        if (this.historyIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.historyIndex + 1);
        }
        this.history.push(JSON.stringify(this.workspaceBlocks));
        if (this.history.length > 30) {
            this.history.shift(); // Keep last 30 actions
        }
        this.historyIndex = this.history.length - 1;
    },

    undo() {
        if (this.historyIndex > 0) {
            this.isUndoing = true;
            this.historyIndex--;
            this.workspaceBlocks = JSON.parse(this.history[this.historyIndex]);
            this.selectedBlockId = null;
            this.notify();
            this.isUndoing = false;
        }
    },

    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.isUndoing = true;
            this.historyIndex++;
            this.workspaceBlocks = JSON.parse(this.history[this.historyIndex]);
            this.selectedBlockId = null;
            this.notify();
            this.isUndoing = false;
        }
    },

    addBlock(block, parentId = null, insertBeforeId = null) {
        this.saveHistory();
        let targetArray = this.workspaceBlocks;
        if (parentId) {
            const parent = this.findBlock(parentId, this.workspaceBlocks);
            if (parent) {
                if (!parent.children) parent.children = [];
                targetArray = parent.children;
            } else return;
        }
        if (insertBeforeId) {
            const idx = targetArray.findIndex(b => b.id === insertBeforeId);
            if (idx !== -1) {
                targetArray.splice(idx, 0, block);
                this.notify();
                return;
            }
        }
        targetArray.push(block);
        this.notify();
    },

    moveBlock(blockId, newParentId = null, insertBeforeId = null) {
        this.saveHistory();
        const block = this.findBlock(blockId, this.workspaceBlocks);
        if (!block) return;
        if (this.isDescendant(block, newParentId)) {
            if (window.showToast) showToast('❌ لا يمكنك وضع حاوية بداخل نفسها أو بداخل أحد أبنائها!', 'error');
            else alert('❌ لا يمكنك وضع حاوية بداخل نفسها أو بداخل أحد أبنائها!');
            return;
        }
        const blockClone = JSON.parse(JSON.stringify(block));
        this.removeBlockWithoutNotify(blockId);
        let targetArray = this.workspaceBlocks;
        if (newParentId) {
            const parent = this.findBlock(newParentId, this.workspaceBlocks);
            if (parent) {
                if (!parent.children) parent.children = [];
                targetArray = parent.children;
            } else return;
        }
        if (insertBeforeId) {
            const idx = targetArray.findIndex(b => b.id === insertBeforeId);
            if (idx !== -1) {
                targetArray.splice(idx, 0, blockClone);
                this.notify();
                return;
            }
        }
        targetArray.push(blockClone);
        this.notify();
    },

    duplicateBlock(id) {
        this.saveHistory();
        const block = this.findBlock(id, this.workspaceBlocks);
        if (!block) return;
        
        const deepCloneAndRenewIds = (b) => {
            const clone = JSON.parse(JSON.stringify(b));
            clone.id = "block_" + Math.random().toString(36).substr(2, 9);
            if (clone.children) {
                clone.children = clone.children.map(child => deepCloneAndRenewIds(child));
            }
            return clone;
        };
        
        const clonedBlock = deepCloneAndRenewIds(block);
        
        const findParentArray = (blocks, targetId) => {
            for (let i=0; i<blocks.length; i++) {
                if (blocks[i].id === targetId) return blocks;
                if (blocks[i].children) {
                    const res = findParentArray(blocks[i].children, targetId);
                    if (res) return res;
                }
            }
            return null;
        };
        
        const targetArray = findParentArray(this.workspaceBlocks, id);
        if (targetArray) {
            const idx = targetArray.findIndex(b => b.id === id);
            targetArray.splice(idx + 1, 0, clonedBlock);
            this.notify();
        }
    },

    removeBlockWithoutNotify(id) {
        const removeRecursive = (blocks) => {
            for (let i = 0; i < blocks.length; i++) {
                if (blocks[i].id === id) {
                    blocks.splice(i, 1);
                    return true;
                }
                if (blocks[i].children && blocks[i].children.length > 0) {
                    if (removeRecursive(blocks[i].children)) return true;
                }
            }
            return false;
        };
        removeRecursive(this.workspaceBlocks);
    },

    isDescendant(parentBlock, targetId) {
        if (!targetId) return false;
        if (parentBlock.id === targetId) return true;
        if (parentBlock.children) {
            for (let child of parentBlock.children) {
                if (this.isDescendant(child, targetId)) return true;
            }
        }
        return false;
    },

    findBlock(id, blocks) {
        for (let block of blocks) {
            if (block.id === id) return block;
            if (block.children && block.children.length > 0) {
                const found = this.findBlock(id, block.children);
                if (found) return found;
            }
        }
        return null;
    },

    clearWorkspace() {
        this.saveHistory();
        this.workspaceBlocks = [];
        this.selectedBlockId = null;
        this.notify();
    },

    selectBlock(id) {
        this.selectedBlockId = id;
        this.notify();
    },

    updateBlockProperty(id, propertyType, key, value) {
        this.saveHistory();
        const block = this.findBlock(id, this.workspaceBlocks);
        if (block) {
            if (propertyType === 'direct') {
                block[key] = value;
            } else if (propertyType === 'styles') {
                if(!block.styles) block.styles = {};
                block.styles[key] = value;
            } else if (propertyType === 'attributes') {
                if(!block.attributes) block.attributes = {};
                block.attributes[key] = value;
            }
            this.notify();
        }
    },
    
    deleteBlock(id) {
        this.saveHistory();
        this.removeBlockWithoutNotify(id);
        if (this.selectedBlockId === id) this.selectedBlockId = null;
        this.notify();
    },

    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', this.theme);
        document.body.setAttribute('data-theme', this.theme);
        const icon = document.querySelector('#theme-toggle i');
        if(icon) icon.className = this.theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    }
};

document.body.setAttribute('data-theme', AppState.theme);

if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            AppState.theme = e.matches ? 'dark' : 'light';
            document.body.setAttribute('data-theme', AppState.theme);
            const icon = document.querySelector('#theme-toggle i');
            if(icon) icon.className = AppState.theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
        }
    });
}
