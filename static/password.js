document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const passwordToggle = document.getElementById("passwordToggle");
    const loginBtn = document.querySelector(".login-btn");

    // Setup utilities
    FormUtils.addSharedAnimations();
    FormUtils.setupFloatingLabels(form);
    FormUtils.setupPasswordToggle(passwordInput, passwordToggle);
    FormUtils.addEntranceAnimation(document.querySelector(".login-card"));

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        let valid = true;

        FormUtils.clearError("email");
        FormUtils.clearError("password");

        if (!passwordInput.value) {
            FormUtils.showError("password", "Password is required");
            valid = false;
        }

        if (!valid) return;

        loginBtn.classList.add("loading");

        try {
            loginBtn.blur();
            const response = await fetch("/login", {
                method: "POST",
                body: new FormData(form)
            });
            const data = await response.json();
            FormUtils.showNotification(data.message, data.status, form);
            if (data.status === "success") {
                form.reset();
                window.location.href = "/"
            }
        } catch (err) {
            FormUtils.showNotification(
                "Server error. Try again.",
                "error",
                form
            );
        }

        loginBtn.classList.remove("loading");

    });

});