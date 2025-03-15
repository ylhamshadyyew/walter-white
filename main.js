// Initialize comments from localStorage
let comments = JSON.parse(localStorage.getItem('comments')) || [];

// Initialize users array from localStorage
let users = JSON.parse(localStorage.getItem('users')) || [];

// Get modal elements
const modal = document.getElementById('authModal');
const authButton = document.getElementById('authButton');
const closeBtn = document.getElementsByClassName('close')[0];
const userInfo = document.getElementById('userInfo');
const usernameSpan = document.getElementById('username');
const commentForm = document.querySelector('.comment-form');

// Show modal
authButton.onclick = function() {
    modal.style.display = 'block';
}

// Close modal
closeBtn.onclick = function() {
    modal.style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Switch between login and register forms
function showTab(tabName) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const tabs = document.getElementsByClassName('auth-tab');

    if (tabName === 'login') {
        loginForm.style.display = 'flex';
        registerForm.style.display = 'none';
        tabs[0].classList.add('active');
        tabs[1].classList.remove('active');
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'flex';
        tabs[0].classList.remove('active');
        tabs[1].classList.add('active');
    }
}

// Register function
function register() {
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!username || !password) {
        alert('Пожалуйста, заполните все поля');
        return;
    }

    if (password !== confirmPassword) {
        alert('Пароли не совпадают');
        return;
    }

    if (users.some(user => user.username === username)) {
        alert('Пользователь с таким именем уже существует');
        return;
    }

    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Регистрация успешна! Теперь вы можете войти.');
    showTab('login');
}

// Login function
function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        localStorage.setItem('currentUser', username);
        updateAuthUI(username);
        modal.style.display = 'none';
        alert('Добро пожаловать, ' + username + '!');
    } else {
        alert('Неверное имя пользователя или пароль');
    }
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    updateAuthUI();
}

// Update UI based on auth state
function updateAuthUI(username = null) {
    const commentForm = document.querySelector('.comment-form');
    
    if (username) {
        authButton.style.display = 'none';
        userInfo.style.display = 'flex';
        usernameSpan.textContent = username;
        commentForm.style.display = 'flex'; // Show comment form for logged in users
    } else {
        authButton.style.display = 'block';
        userInfo.style.display = 'none';
        usernameSpan.textContent = '';
        commentForm.style.display = 'none'; // Hide comment form for logged out users
    }
}

// Check if user is logged in on page load
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        updateAuthUI(currentUser);
    } else {
        // Hide comment form if user is not logged in
        const commentForm = document.querySelector('.comment-form');
        commentForm.style.display = 'none';
    }
    displayComments();
});

// Function to add a new comment
function addComment() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        alert('Пожалуйста, войдите в систему, чтобы оставить комментарий');
        modal.style.display = 'block';
        return;
    }

    const textInput = document.getElementById('commentText');
    const text = textInput.value.trim();
    
    if (!text) {
        alert('Пожалуйста, введите текст комментария');
        return;
    }
    
    // Check for verified users
    const isVerified = currentUser.toLowerCase() === 'snike' || currentUser.toLowerCase() === 'rakanoot';
    const isGoldVerified = currentUser.toLowerCase() === 'mak_sim';
    
    const comment = {
        name: currentUser,
        text: text,
        verified: isVerified,
        goldVerified: isGoldVerified,
        date: new Date().toLocaleString()
    };
    
    comments.push(comment);
    localStorage.setItem('comments', JSON.stringify(comments));
    displayComments();
    
    // Clear input
    textInput.value = '';
}

// Function to display comments
function displayComments() {
    const commentsContainer = document.getElementById('commentsList');
    commentsContainer.innerHTML = '';
    
    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        
        let verifiedBadge = '';
        if (comment.goldVerified) {
            verifiedBadge = '<span class="verified-badge gold"><i class="fas fa-check-circle"></i></span>';
        } else if (comment.verified) {
            verifiedBadge = '<span class="verified-badge"><i class="fas fa-check-circle"></i></span>';
        }
        
        commentElement.innerHTML = `
            <div class="comment-header">
                <span class="comment-name">${comment.name}</span>
                ${verifiedBadge}
                <span class="comment-date">${comment.date}</span>
            </div>
            <div class="comment-text">${comment.text}</div>
        `;
        
        commentsContainer.appendChild(commentElement);
    });
}

// Add smooth scrolling for navigation links
document.querySelectorAll('nav a').forEach(anchor => {
    if (anchor.getAttribute('href')?.startsWith('#')) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    }
});

// Add animation on scroll for sections
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(section);
});