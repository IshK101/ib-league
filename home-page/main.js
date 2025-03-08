lucide.createIcons();



document.addEventListener('DOMContentLoaded', async () => {

    try {
        const response = await fetch('../navbar/navbar.html');
        const html = await response.text();
        document.getElementById('navbar-placeholder').innerHTML = html;
        initializeNavbar();
    } catch (error) {
        console.error('Error loading navbar:', error);
    }
});

function initializeNavbar() {
    const profileIcon = document.getElementById('profileIcon');
    const dropdownContent = document.querySelector('.dropdown-content');

    if (!profileIcon || !dropdownContent) return;


    profileIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementById('profileDropdown')?.classList.toggle('show');
    });

    
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#profileDropdown') && e.target.id !== 'profileIcon') {
            document.getElementById('profileDropdown')?.classList.remove('show');
        }
    });


    firebase.auth().onAuthStateChanged(user => {
        dropdownContent.innerHTML = user 
            ? `
                <div class="user-info">
                    <div class="user-name">${user.displayName || 'User'}</div>
                    <div class="user-email">${user.email}</div>
                </div>
                <div class="dropdown-divider"></div>
                <a href="#" class="dropdown-item logout-btn" onclick="handleLogout(event)">Logout</a>
            `
            : `
                <div class="auth-options">
                    <div class="auth-title">Welcome!</div>
                    <div class="auth-subtitle">Sign in.</div>
                </div>
                <div class="dropdown-divider"></div>
                <a href="../auth-page/authentication.html" class="dropdown-item">Sign Up</a>
                <a href="../auth-page/authentication.html" class="dropdown-item">Sign In</a>
            `;
    });
}

window.handleLogout = async (event) => {
    event.preventDefault();
    try {
        await firebase.auth().signOut();
        window.location.href = '../home-page/index.html';
    } catch (error) {
        console.error('Error signing out:', error);
    }
};
