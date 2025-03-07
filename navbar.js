lucide.createIcons();

function navigateTo(path) {
    window.location.href = path;
}

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.style.backgroundColor = window.scrollY > 0 ? 'rgba(26, 31, 44, 0.95)' : 'rgba(26, 31, 44, 0.8)';
    }
});

document.querySelectorAll('button').forEach(button => {
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-2px)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
    });
});

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('../navbar/navbar.html');
        const html = await response.text();
        document.getElementById('navbar-placeholder').innerHTML = html;
        initializeNavbar();
        

        const signupForm = document.getElementById('signup-form');
        if (signupForm) {
            signupForm.addEventListener('submit', handleSignup);
        }
    } catch (error) {
        console.error('Error loading navbar:', error);
    }

    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && sidebar && sidebarToggle) {
            if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        }
    });

    async function handleSignup(event) {
      event.preventDefault();
  
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
  
      try {
          const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
          const user = userCredential.user;
  
          console.log("User created successfully:", user);
  
        
          await firebase.auth().currentUser.reload();
  
   
          window.location.href = "../home-page/index.html";
      } catch (error) {
          if (error.code === "auth/email-already-in-use") {
              alert("This email is already registered. Please sign in instead.");
          } else if (error.code === "auth/network-request-failed") {
              alert("Network error occurred. Please check your connection and try again.");
          } else {
              console.error("Error during signup:", error);
              alert(error.message);
          }
      }
  }
  
    
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            const subject = item.textContent.trim();
            loadContent(subject);
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
            }
        });
    });
});

function initializeNavbar() {
    const profileIcon = document.getElementById('profileIcon');
    const dropdown = document.getElementById('profileDropdown');

    if (!profileIcon || !dropdown) {
        console.error('Navbar elements not found');
        return;
    }

    window.toggleDropdown = function () {
        dropdown.classList.toggle('show');
    };

    profileIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown();
    });

    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target) && e.target !== profileIcon) {
            dropdown.classList.remove('show');
        }
    });
}

function updateProfile() {
    const dropdownContent = document.querySelector('.dropdown-content');
    if (!dropdownContent) return;

    const user = firebase.auth().currentUser;
    dropdownContent.innerHTML = user ? `
        <div class="user-info">
            <div class="user-name">${user.displayName || 'User'}</div>
            <div class="user-email">${user.email}</div>
        </div>
        <div class="dropdown-divider"></div>
        <a href="#" class="dropdown-item logout-btn" onclick="handleLogout(event)">Logout</a>
    ` : `
        <div class="auth-options">
            <div class="auth-title">Welcome!</div>
            <div class="auth-subtitle">Sign in to IB League</div>
        </div>
        <div class="dropdown-divider"></div>
        <a href="../authentication/authentication.html" class="dropdown-item">Sign Up</a>
        <a href="../authentication/authentication.html" class="dropdown-item">Sign In</a>
    `;
}

firebase.auth().onAuthStateChanged(updateProfile);

window.handleLogout = async (event) => {
    event.preventDefault();
    try {
        await firebase.auth().signOut();
        window.location.href = '../home-page/index.html';
    } catch (error) {
        console.error('Error signing out:', error);
    }
};


async function loadNavbar() {
    try {
    
        const currentPath = window.location.pathname;
        const depth = currentPath.split('/').length - 2;
        const prefix = depth > 1 ? '../'.repeat(depth - 1) : '';
        
        const response = await fetch(prefix + 'navbar/navbar.html');
        const html = await response.text();
        
        const navbarPlaceholder = document.getElementById('navbar-placeholder');
        if (!navbarPlaceholder) {
            console.error('Navbar placeholder not found!');
            return;
        }
        
        navbarPlaceholder.innerHTML = html;
        

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        

        await waitForFirebase();
        initializeAuth();
        
        console.log('Navbar loaded successfully');
    } catch (error) {
        console.error('Error loading navbar:', error);
    }
}
