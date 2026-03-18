// Basic Login Form Script
class BasicLoginForm {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.passwordToggle = document.getElementById('passwordToggle');
        this.successMessage = document.getElementById('successMessage');
        
        this.init();
    }
    
    init() {
        // Initialize shared utilities
        FormUtils.addSharedAnimations();
        FormUtils.setupFloatingLabels(this.form);
        FormUtils.setupPasswordToggle(this.passwordInput, this.passwordToggle);
        
        // Add event listeners
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.emailInput.addEventListener('input', () => this.validateField('email'));
        this.passwordInput.addEventListener('input', () => this.validateField('password'));
        
        // Add entrance animation
        FormUtils.addEntranceAnimation(this.form.closest('.login-card'), 100);
    }
    
    validateField(fieldName) {
        const input = document.getElementById(fieldName);
        const value = input.value.trim();
        let validation;
        
        // Clear previous errors
        FormUtils.clearError(fieldName);
        
        // Validate based on field type
        if (fieldName === 'email') {
            validation = FormUtils.validateEmail(value);
        } else if (fieldName === 'password') {
            validation = FormUtils.validatePassword(value);
        }
        
        if (!validation.isValid && value !== '') {
            FormUtils.showError(fieldName, validation.message);
            return false;
        } else if (validation.isValid) {
            FormUtils.showSuccess(fieldName);
            return true;
        }
        
        return true;
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        

        
        // Show loading state
        const submitBtn = this.form.querySelector('.login-btn');
        submitBtn.classList.add('loading');
        
        try {
            // Simulate login process
            const response = await fetch("/login", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    code: document.getElementById("password").value,
                })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed');
            }
            // Show success state
            this.showSuccess();
            setTimeout(() => {
                window.location.href = '/';
            }, 2000);
        } catch (error) {
            // Show error notification
            FormUtils.showNotification(error.message, 'error', this.form);
        } finally {
            // Remove loading state
            submitBtn.classList.remove('loading');
        }
    }
    
    showSuccess() {
        // Hide the form
        this.form.style.display = 'none';
        
        // Show success message
        this.successMessage.classList.add('show');
        
        // Simulate redirect after 2 seconds
        setTimeout(() => {
            FormUtils.showNotification('Redirecting to dashboard...', 'success', this.successMessage);
        }, 2000);
    }
}

// Initialize the form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BasicLoginForm();
});