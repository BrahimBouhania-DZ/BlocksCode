// Quiz Manager
const QuizData = [
    {
        afterLesson: 5,
        questions: [
            { q: "أي وسم يستخدم لإنشاء عنوان رئيسي كبير؟", options: ["<h1>", "<p>", "<div>", "<span>"], answer: 0 },
            { q: "كيف نغير لون النص باستخدام CSS؟", options: ["background-color", "color", "text-color", "font-color"], answer: 1 },
            { q: "ما هي الوحدة التي تستخدم عادة لحجم الخط؟", options: ["px", "kg", "cm", "ml"], answer: 0 }
        ]
    },
    {
        afterLesson: 10,
        questions: [
            { q: "كيف نضيف مسافة داخلية للعنصر؟", options: ["margin", "padding", "border", "spacing"], answer: 1 },
            { q: "لجعل العناصر بجانب بعضها نستخدم؟", options: ["display: flex", "display: none", "display: block", "position: absolute"], answer: 0 },
            { q: "أي فئة تعبر عن تحديد بواسطة الـ id؟", options: [".name", "#name", "*name", "@name"], answer: 1 }
        ]
    },
    {
        afterLesson: 15,
        questions: [
            { q: "أي لغة تستخدم لإضافة التفاعلية للموقع؟", options: ["HTML", "CSS", "JavaScript", "Python"], answer: 2 },
            { q: "ماذا تفعل الدالة alert()؟", options: ["إخفاء عنصر", "إظهار رسالة منبثقة", "تغيير اللون", "حذف الكود"], answer: 1 },
            { q: "كيف نكتب تعليقاً في JavaScript؟", options: ["<!-- تعليق -->", "/* تعليق */", "// تعليق", "** تعليق"], answer: 2 }
        ]
    }
];

const QuizManager = {
    currentQuiz: null,
    currentQuestionIndex: 0,
    score: 0,
    onComplete: null,

    startQuiz(lessonNumber, callback) {
        this.currentQuiz = QuizData.find(q => q.afterLesson === lessonNumber);
        this.onComplete = callback;

        if (!this.currentQuiz) {
            if (this.onComplete) this.onComplete();
            return;
        }

        this.currentQuestionIndex = 0;
        this.score = 0;
        this.renderModal();
    },

    renderModal() {
        let modal = document.getElementById('quiz-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'quiz-modal';
            modal.className = 'modal-overlay';
            modal.innerHTML = `
                <div class="modal-content" style="max-width: 500px; text-align: center;">
                    <div class="modal-header">
                        <h2><i class="fa-solid fa-graduation-cap" style="color:var(--primary)"></i> اختبار سريع</h2>
                    </div>
                    <div class="modal-body" id="quiz-body" style="padding: 2rem;">
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }
        
        modal.classList.add('active');
        this.showQuestion();
    },

    showQuestion() {
        const body = document.getElementById('quiz-body');
        if (this.currentQuestionIndex >= this.currentQuiz.questions.length) {
            this.finishQuiz();
            return;
        }

        const q = this.currentQuiz.questions[this.currentQuestionIndex];
        
        let html = `
            <div style="font-size:0.9rem; color:var(--text-muted); margin-bottom:15px;">السؤال ${this.currentQuestionIndex + 1} من ${this.currentQuiz.questions.length}</div>
            <h3 style="margin-bottom: 25px; color: var(--text-color); font-size:1.2rem;">${q.q}</h3>
            <div style="display:flex; flex-direction:column; gap: 12px;" id="quiz-options">
        `;

        q.options.forEach((opt, idx) => {
            html += `<button class="btn btn-outline" style="width: 100%; text-align: right; justify-content: flex-start; padding: 12px 15px; font-size:1rem;" onclick="QuizManager.answerQuestion(this, ${idx})">${opt.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</button>`;
        });

        html += `</div>`;
        body.innerHTML = html;
    },

    answerQuestion(btn, idx) {
        const opts = document.getElementById('quiz-options').querySelectorAll('button');
        opts.forEach(b => b.disabled = true);

        const q = this.currentQuiz.questions[this.currentQuestionIndex];
        if (idx === q.answer) {
            this.score++;
            btn.style.background = 'var(--success)';
            btn.style.color = '#fff';
            btn.style.borderColor = 'var(--success)';
        } else {
            btn.style.background = 'var(--danger)';
            btn.style.color = '#fff';
            btn.style.borderColor = 'var(--danger)';
            opts[q.answer].style.background = 'var(--success)';
            opts[q.answer].style.color = '#fff';
        }

        this.currentQuestionIndex++;
        setTimeout(() => this.showQuestion(), 1200);
    },

    finishQuiz() {
        const modal = document.getElementById('quiz-modal');
        modal.classList.remove('active');
        
        const total = this.currentQuiz.questions.length;
        if (this.score >= Math.ceil(total / 2)) {
            const xpReward = this.score * 20;
            StorageManager.addXP(xpReward);
            if(window.updateXPDisplay) updateXPDisplay();
            if(window.showToast) showToast(`نجحت في الاختبار! +${xpReward} XP 🎉`, 'success');
        } else {
            if(window.showToast) showToast('لم تجتز الاختبار، واصل التعلم المحاولة مرة أخرى لاحقاً!', 'warning');
        }
        
        setTimeout(() => {
            if (this.onComplete) this.onComplete();
        }, 1000);
    }
};

window.QuizManager = QuizManager;
