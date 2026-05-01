// Projects Manager - لإدارة المشاريع المتعددة
const PROJECTS_KEY = 'blockscode_projects';
const CURRENT_PROJECT_ID_KEY = 'blockscode_current_project_id';

const ProjectsManager = {
    // جلب كل المشاريع
    getProjects() {
        const stored = localStorage.getItem(PROJECTS_KEY);
        return stored ? JSON.parse(stored) : [];
    },

    // حفظ كل المشاريع
    saveProjects(projects) {
        localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
    },

    // إنشاء مشروع جديد
    createNewProject(name) {
        const newProject = {
            id: 'proj_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            name: name || 'مشروع جديد',
            blocks: [],
            updatedAt: new Date().toISOString()
        };
        
        const projects = this.getProjects();
        projects.push(newProject);
        this.saveProjects(projects);
        
        return newProject;
    },

    // حفظ المشروع الحالي
    saveCurrentProject(blocks) {
        let currentId = localStorage.getItem(CURRENT_PROJECT_ID_KEY);
        let projects = this.getProjects();
        
        if (!currentId || !projects.find(p => p.id === currentId)) {
            // إذا لم يكن هناك مشروع محدد، ننشئ واحداً
            const proj = this.createNewProject('مشروعي ' + (projects.length + 1));
            currentId = proj.id;
            localStorage.setItem(CURRENT_PROJECT_ID_KEY, currentId);
            projects = this.getProjects(); // تحديث القائمة بعد الإنشاء
        }

        const projIndex = projects.findIndex(p => p.id === currentId);
        if (projIndex > -1) {
            projects[projIndex].blocks = blocks;
            projects[projIndex].updatedAt = new Date().toISOString();
            this.saveProjects(projects);
            if (window.showToast) showToast('تم حفظ المشروع السحابي (محلياً) بنجاح!', 'success');
        }
    },

    // تحميل مشروع
    loadProject(id) {
        const projects = this.getProjects();
        const proj = projects.find(p => p.id === id);
        if (proj) {
            localStorage.setItem(CURRENT_PROJECT_ID_KEY, proj.id);
            AppState.workspaceBlocks = proj.blocks || [];
            AppState.notify();
            if (window.showToast) showToast(`تم تحميل "${proj.name}" بنجاح!`, 'success');
            document.getElementById('projects-modal')?.classList.remove('active');
        }
    },

    // حذف مشروع
    deleteProject(id) {
        let projects = this.getProjects();
        projects = projects.filter(p => p.id !== id);
        this.saveProjects(projects);
        
        if (localStorage.getItem(CURRENT_PROJECT_ID_KEY) === id) {
            localStorage.removeItem(CURRENT_PROJECT_ID_KEY);
        }
        
        this.renderProjectsModal();
    },

    // إعادة تسمية مشروع
    renameProject(id, newName) {
        if (!newName || newName.trim() === '') return;
        let projects = this.getProjects();
        const proj = projects.find(p => p.id === id);
        if (proj) {
            proj.name = newName.trim();
            proj.updatedAt = new Date().toISOString();
            this.saveProjects(projects);
            this.renderProjectsModal();
        }
    },

    // إنشاء مشروع جديد وتفريغ الساحة
    startNewProject() {
        const name = prompt('أدخل اسم المشروع الجديد:', 'مشروع جديد');
        if (name) {
            const proj = this.createNewProject(name);
            localStorage.setItem(CURRENT_PROJECT_ID_KEY, proj.id);
            AppState.clearWorkspace();
            document.getElementById('projects-modal')?.classList.remove('active');
            if (window.showToast) showToast(`تم إنشاء "${name}" بنجاح!`, 'success');
        }
    },

    // عرض القائمة في الـ Modal
    renderProjectsModal() {
        const grid = document.getElementById('projects-grid');
        if (!grid) return;
        
        const projects = this.getProjects();
        const currentId = localStorage.getItem(CURRENT_PROJECT_ID_KEY);
        
        if (projects.length === 0) {
            grid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 3rem; color: var(--text-muted);">
                <i class="fa-solid fa-folder-open" style="font-size:3rem; margin-bottom:1rem; opacity:0.5;"></i>
                <p>لا يوجد مشاريع محفوظة بعد.</p>
            </div>`;
            return;
        }

        // ترتيب حسب الأحدث
        projects.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

        grid.innerHTML = projects.map(p => {
            const isActive = p.id === currentId;
            const date = new Date(p.updatedAt).toLocaleDateString('ar-SA');
            const time = new Date(p.updatedAt).toLocaleTimeString('ar-SA', {hour: '2-digit', minute:'2-digit'});
            
            return `
            <div class="template-card" style="border-color: ${isActive ? 'var(--primary)' : 'var(--border-color)'};">
                <div class="template-icon" style="color: ${isActive ? 'var(--primary)' : 'var(--text-muted)'};">
                    <i class="fa-solid ${isActive ? 'fa-folder-open' : 'fa-folder'}"></i>
                </div>
                <div class="template-info" style="width: 100%;">
                    <h4 style="display:flex; justify-content:center; align-items:center; gap:5px;">
                        ${p.name}
                        <button class="btn-icon" style="font-size:0.8rem; padding:2px;" onclick="const n = prompt('تغيير الاسم:', '${p.name}'); if(n) ProjectsManager.renameProject('${p.id}', n); event.stopPropagation();" title="إعادة تسمية">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                    </h4>
                    <p style="font-size:0.75rem; direction:ltr; color: var(--text-muted);">${date} ${time}</p>
                    <p style="font-size:0.8rem; margin-top:5px; color:var(--text-color);">${p.blocks.length} بلوكات</p>
                </div>
                <div style="display:flex; gap:5px; width:100%; margin-top:15px;">
                    <button class="btn btn-primary btn-sm" style="flex:1; justify-content:center;" onclick="ProjectsManager.loadProject('${p.id}')">
                        ${isActive ? 'محدد' : 'فتح'}
                    </button>
                    <button class="btn btn-danger btn-sm" style="justify-content:center;" onclick="if(confirm('هل أنت متأكد من حذف هذا المشروع؟')) ProjectsManager.deleteProject('${p.id}'); event.stopPropagation();" title="حذف">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
            `;
        }).join('');
    }
};

window.ProjectsManager = ProjectsManager;
