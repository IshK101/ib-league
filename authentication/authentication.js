// Add this import at the top of your file
import { updateProfile } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Wait for DOM and Firebase to be ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');

    // Debug: Log all form elements
    console.log('Looking for form elements...');
    console.log('Form:', document.getElementById('signupForm'));
    console.log('Google button:', document.getElementById('googleSignIn'));
    console.log('Name input:', document.getElementById('name'));
    console.log('Email input:', document.getElementById('email'));
    console.log('Password input:', document.getElementById('password'));

    // Verify Firebase initialization
    console.log('Checking Firebase initialization...');
    console.log('Auth object:', window.auth);
    console.log('Google Provider:', window.googleProvider);
    console.log('SignInWithPopup:', window.signInWithPopup);


    setTimeout(() => {
        const signupForm = document.getElementById('signupForm');
        const googleBtn = document.getElementById('googleSignIn');
        
        if (!signupForm || !googleBtn) {
            console.error('Required elements not found');
            return;
        }


        googleBtn.addEventListener('click', async () => {
            try {
                console.log('Google sign-in clicked');
                const result = await signInWithPopup(auth, googleProvider);
                const user = result.user;
                console.log('Google sign in successful:', user);
                window.location.replace('../home-page/index.html');
            } catch (error) {
                console.error('Error during Google sign in:', error);
                alert('Error signing in with Google. Please try again.');
            }
        });

        
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            try {
                const nameInput = document.getElementById('name');
                const emailInput = document.getElementById('email');
                const passwordInput = document.getElementById('password');

                const name = nameInput.value;
                const email = emailInput.value;
                const password = passwordInput.value;
                
      
                const userCredential = await createUser(auth, email, password);
                const user = userCredential.user;
                
          
                await new Promise(resolve => setTimeout(resolve, 1000));

                try {

                    await updateProfile(user, {
                        displayName: name
                    });
                    console.log('Profile updated successfully');
                    window.location.replace('../home-page/index.html');
                } catch (profileError) {
                    console.error('Error updating profile:', profileError);
                    
                    window.location.replace('../home-page/index.html');
                }
            } catch (error) {
                console.error('Error during signup:', error);
                let errorMessage = 'An error occurred during sign up.';
                
                switch (error.code) {
                    case 'auth/network-request-failed':
                        errorMessage = 'Network error. Please check your internet connection and try again.';
                        break;
                    case 'auth/email-already-in-use':
                        errorMessage = 'This email is already registered.';
                        break;
                    case 'auth/invalid-email':
                        errorMessage = 'Invalid email address.';
                        break;
                    case 'auth/operation-not-allowed':
                        errorMessage = 'Email/password accounts are not enabled. Please contact support.';
                        break;
                    case 'auth/weak-password':
                        errorMessage = 'Please choose a stronger password.';
                        break;
                    default:
                        errorMessage = error.message;
                }
                
                alert(errorMessage);
            }
        });
        if (auth) {
            auth.onAuthStateChanged((user) => {
                console.log('Auth state changed:', user);
                if (user) {
                    window.location.replace('../home-page/index.html');
                }
            });
        } else {
            console.error('Auth not initialized');
        }

        console.log('All event listeners attached successfully');
    }, 100);
});

window.addEventListener('load', () => {
    console.log('Current localStorage state:', {
        userName: localStorage.getItem('userName'),
        userEmail: localStorage.getItem('userEmail'),
        isLoggedIn: localStorage.getItem('isLoggedIn')
    });
});
