document.querySelectorAll('.mobile-menu-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelector('.nav-links').classList.toggle('active');
    });
});

const passwordInput = document.querySelector('.register-card input[type="password"]');
if (passwordInput && passwordInput.id === 'regPassword') {
    const strengthFill = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');
    
    passwordInput.addEventListener('input', function() {
        const pwd = this.value;
        let width = 0, text = '', color = '';
        
        if (pwd.length === 0) {
            width = 0; text = '';
        } else if (pwd.length < 6) {
            width = 25; text = 'Weak password'; color = '#ef4444';
        } else if (pwd.length < 10) {
            width = 60; text = 'Medium password'; color = '#f59e0b';
        } else {
            width = 100; text = 'Strong password'; color = '#10b981';
        }
        
        if (strengthFill) {
            strengthFill.style.width = width + '%';
            strengthFill.style.background = color;
        }
        if (strengthText) {
            strengthText.textContent = text;
            strengthText.style.color = color;
        }
    });
}

const titleInput = document.getElementById('title');
const titleCounter = document.getElementById('titleCounter');
const contentInput = document.getElementById('content');
const contentCounter = document.getElementById('contentCounter');
const tagsInput = document.getElementById('tags');
const tagPreview = document.getElementById('tagPreview');

if (titleInput && titleCounter) {
    titleInput.addEventListener('input', function() {
        titleCounter.textContent = this.value.length + ' / 200 characters';
        const titleGroup = document.getElementById('titleGroup');
        const titleError = document.getElementById('titleError');
        if (this.value.length < 10 && this.value.length > 0) {
            titleGroup.classList.add('has-error');
            titleError.textContent = 'Title must be at least 10 characters';
            titleError.style.display = 'block';
        } else {
            titleGroup.classList.remove('has-error');
            titleError.style.display = 'none';
        }
    });
}

if (contentInput && contentCounter) {
    contentInput.addEventListener('input', function() {
        contentCounter.textContent = this.value.length + ' / 5000 characters';
        const contentGroup = document.getElementById('contentGroup');
        const contentError = document.getElementById('contentError');
        if (this.value.length < 20 && this.value.length > 0) {
            contentGroup.classList.add('has-error');
            contentError.textContent = 'Content must be at least 20 characters';
            contentError.style.display = 'block';
        } else {
            contentGroup.classList.remove('has-error');
            contentError.style.display = 'none';
        }
    });
}

if (tagsInput && tagPreview) {
    tagsInput.addEventListener('input', function() {
        const tags = this.value.split(',').map(t => t.trim().toLowerCase()).filter(t => t);
        tagPreview.innerHTML = tags.slice(0, 5).map(tag => `<span class="preview-tag">#${tag}</span>`).join('');
        
        const tagsGroup = document.getElementById('tagsGroup');
        const tagsError = document.getElementById('tagsError');
        if (tags.length > 5) {
            tagsGroup.classList.add('has-error');
            tagsError.textContent = 'Maximum 5 tags allowed';
            tagsError.style.display = 'block';
        } else {
            tagsGroup.classList.remove('has-error');
            tagsError.style.display = 'none';
        }
    });
}

const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('keyup', function() {
        const term = this.value.toLowerCase();
        const cards = document.querySelectorAll('.question-card');
        cards.forEach(card => {
            const title = card.querySelector('h3 a')?.textContent.toLowerCase() || '';
            if (title.includes(term)) {
                card.closest('.col-12')?.classList.remove('d-none');
            } else {
                card.closest('.col-12')?.classList.add('d-none');
            }
        });
    });
}

const adminSearch = document.getElementById('adminSearch');
if (adminSearch) {
    adminSearch.addEventListener('keyup', function() {
        const term = this.value.toLowerCase();
        const rows = document.querySelectorAll('#adminTableBody tr');
        rows.forEach(row => {
            const title = row.querySelector('td:first-child')?.textContent.toLowerCase() || '';
            row.style.display = title.includes(term) ? '' : 'none';
        });
    });
}

const tags = document.querySelectorAll('.tag-list .tag');
const clearTag = document.querySelector('.clear-tag');
if (tags.length) {
    tags.forEach(tag => {
        tag.addEventListener('click', function() {
            const selectedTag = this.getAttribute('data-tag') || this.textContent.replace('#', '').split(' ')[0];
            tags.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            if (clearTag) clearTag.style.display = 'inline-flex';
            
            const cards = document.querySelectorAll('.question-card');
            cards.forEach(card => {
                const cardTags = card.getAttribute('data-tags') || '';
                if (cardTags.includes(selectedTag)) {
                    card.closest('.col-12')?.classList.remove('d-none');
                } else {
                    card.closest('.col-12')?.classList.add('d-none');
                }
            });
        });
    });
}

if (clearTag) {
    clearTag.addEventListener('click', function() {
        tags.forEach(t => t.classList.remove('active'));
        this.style.display = 'none';
        document.querySelectorAll('.question-card').forEach(card => {
            card.closest('.col-12')?.classList.remove('d-none');
        });
    });
}

const askForm = document.getElementById('askForm');
if (askForm) {
    askForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const title = document.getElementById('title')?.value;
        const content = document.getElementById('content')?.value;
        const tags = document.getElementById('tags')?.value;
        
        if (!title || title.length < 10) {
            alert('Please fix the errors above before posting');
            return;
        }
        if (!content || content.length < 20) {
            alert('Please fix the errors above before posting');
            return;
        }
        
        alert('Question posted successfully!');
        window.location.href = 'questions.html';
    });
}