document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registerForm");

    const nameInput = document.getElementById("name");
    const userInput = document.getElementById("user");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");

    const passwordToggle = document.getElementById("passwordToggle");
    const confirmPasswordToggle = document.getElementById("confirmPasswordToggle");
    const submitBtn = form.querySelector(".login-btn");

    // Setup utilities
    FormUtils.setupPasswordToggle(passwordInput, passwordToggle);
    FormUtils.setupPasswordToggle(confirmPasswordInput, confirmPasswordToggle);
    FormUtils.addSharedAnimations();
    FormUtils.setupFloatingLabels(form);
    FormUtils.addEntranceAnimation(document.querySelector(".login-card"));

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        let valid = true;
        FormUtils.clearError("name");
        FormUtils.clearError("user");
        FormUtils.clearError("email");
        FormUtils.clearError("password");
        FormUtils.clearError("confirmPassword");

        if (!nameInput.value.trim()) {
            FormUtils.showError("name", "Name is required");
            valid = false;
        }
        if (!userInput.value.trim()) {
            FormUtils.showError("user", "Username is required");
            valid = false;
        }
        const emailValidation = FormUtils.validateEmail(emailInput.value);
        if (!emailValidation.isValid) {
            FormUtils.showError("email", emailValidation.message);
            valid = false;
        }
        const passwordValidation = FormUtils.validatePassword(passwordInput.value);
        if (!passwordValidation.isValid) {
            FormUtils.showError("password", passwordValidation.message);
            valid = false;
        }
        if (passwordInput.value !== confirmPasswordInput.value) {
            FormUtils.showError("confirmPassword", "Passwords do not match");
            valid = false;
        }

        if (!valid) return;

        submitBtn.classList.add("loading");
        submitBtn.disabled = true;

        try {
            const response = await fetch("/register", {
                method: "POST",
                body: new FormData(form)
            });

            const data = await response.json();
            FormUtils.showNotification(data.message, data.status, form);

            if (data.status === "success") {
                form.reset();
            }

        } catch (err) {
            FormUtils.showNotification("Server error. Try again.", "error", form);
        }

        submitBtn.classList.remove("loading");
        submitBtn.disabled = false;
    });
});

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("registerForm");

    // Force compact layout
    form.style.display = "flex";
    form.style.flexDirection = "column";
    form.style.gap = "6px";   // VERY close inputs

    // Remove extra spacing from elements
    document.querySelectorAll(".form-group").forEach(el => {
        el.style.marginBottom = "0px";
    });

    document.querySelectorAll(".error-message").forEach(el => {
        el.style.marginTop = "1px";
    });

});