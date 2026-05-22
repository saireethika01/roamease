// Toggle password visibility
function togglePasswordVisibility(inputId, button) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    if (input.type === "password") {
        input.type = "text";
        button.innerHTML = `<svg class="eye-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;
    } else {
        input.type = "password";
        button.innerHTML = `<svg class="eye-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
    }
}

// Display general alert banner with custom warning SVGs
function showAlert(message, type = "error") {
    const banner = document.getElementById("authAlert");
    if (!banner) return;
    
    let iconSvg = "";
    if (type === "success") {
        iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else {
        iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
    }
    
    banner.innerHTML = `${iconSvg} <span>${message}</span>`;
    banner.className = `auth-alert ${type}`;
}

function hideAlert() {
    const banner = document.getElementById("authAlert");
    if (banner) {
        banner.className = "auth-alert hide";
    }
}

// Show field validation error & highlight the form group boundary
function showFieldError(fieldId, errorMsg) {
    const errorSpan = document.getElementById(fieldId + "Error");
    const input = document.getElementById(fieldId);
    if (!input) return;
    
    const formGroup = input.closest(".form-group");
    
    if (errorSpan) {
        errorSpan.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg> ${errorMsg}`;
        errorSpan.classList.add("show");
    }
    if (formGroup) {
        formGroup.classList.add("invalid");
    }
}

// Clear field validation error
function clearFieldError(fieldId) {
    const errorSpan = document.getElementById(fieldId + "Error");
    const input = document.getElementById(fieldId);
    if (!input) return;
    
    const formGroup = input.closest(".form-group");
    
    if (errorSpan) {
        errorSpan.textContent = "";
        errorSpan.classList.remove("show");
    }
    if (formGroup) {
        formGroup.classList.remove("invalid");
    }
}

// Email syntax checks
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Add real-time change validation listeners on forms
document.addEventListener("DOMContentLoaded", () => {
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email") || document.getElementById("loginEmail");
    const passwordInput = document.getElementById("password") || document.getElementById("loginPassword");
    
    if (nameInput) {
        nameInput.addEventListener("input", () => {
            if (nameInput.value.trim().length >= 2) {
                clearFieldError("name");
            }
        });
        nameInput.addEventListener("blur", () => {
            const val = nameInput.value.trim();
            if (val.length === 0) {
                showFieldError("name", "Full name is required");
            } else if (val.length < 2) {
                showFieldError("name", "Name must be at least 2 characters");
            }
        });
    }
    
    if (emailInput) {
        emailInput.addEventListener("input", () => {
            if (isValidEmail(emailInput.value.trim())) {
                clearFieldError(emailInput.id);
            }
        });
        emailInput.addEventListener("blur", () => {
            const val = emailInput.value.trim();
            if (val.length === 0) {
                showFieldError(emailInput.id, "Email address is required");
            } else if (!isValidEmail(val)) {
                showFieldError(emailInput.id, "Please enter a valid email address");
            }
        });
    }
    
    if (passwordInput) {
        passwordInput.addEventListener("input", () => {
            if (passwordInput.id === "password") {
                // For signup, validate requirements in real-time
                updatePasswordStrength(passwordInput.value);
            } else {
                // For login, simple clear error if text exists
                if (passwordInput.value.length > 0) {
                    clearFieldError("loginPassword");
                }
            }
        });
        passwordInput.addEventListener("blur", () => {
            const val = passwordInput.value;
            if (val.length === 0) {
                showFieldError(passwordInput.id, "Password is required");
            } else if (passwordInput.id === "password" && val.length < 6) {
                showFieldError("password", "Password must be at least 6 characters");
            }
        });
    }
});

// Dynamic password strength bar & criteria checkboxes checklist
function updatePasswordStrength(val) {
    const wrapper = document.querySelector(".password-strength-bar-wrapper");
    const bar = document.getElementById("strengthIndicator");
    const text = document.getElementById("strengthText");
    const checklist = document.getElementById("strengthChecklist");
    
    const chkLength = document.getElementById("chkLength");
    const chkNumber = document.getElementById("chkNumber");
    const chkUpper = document.getElementById("chkUpper");
    
    if (!val || val.length === 0) {
        if (wrapper) wrapper.classList.remove("show");
        if (text) text.classList.remove("show");
        if (checklist) checklist.classList.remove("show");
        return;
    }
    
    if (wrapper) wrapper.classList.add("show");
    if (text) text.classList.add("show");
    if (checklist) checklist.classList.add("show");
    
    // Evaluate criteria
    const condLength = val.length >= 6;
    const condNumber = /[0-9]/.test(val);
    const condUpper = /[A-Z]/.test(val);
    
    // Update Length Checkpoint
    if (chkLength) {
        if (condLength) {
            chkLength.classList.add("valid");
            chkLength.querySelector(".chk-icon").innerHTML = "✓";
        } else {
            chkLength.classList.remove("valid");
            chkLength.querySelector(".chk-icon").innerHTML = "○";
        }
    }
    
    // Update Number Checkpoint
    if (chkNumber) {
        if (condNumber) {
            chkNumber.classList.add("valid");
            chkNumber.querySelector(".chk-icon").innerHTML = "✓";
        } else {
            chkNumber.classList.remove("valid");
            chkNumber.querySelector(".chk-icon").innerHTML = "○";
        }
    }
    
    // Update Uppercase Checkpoint
    if (chkUpper) {
        if (condUpper) {
            chkUpper.classList.add("valid");
            chkUpper.querySelector(".chk-icon").innerHTML = "✓";
        } else {
            chkUpper.classList.remove("valid");
            chkUpper.querySelector(".chk-icon").innerHTML = "○";
        }
    }
    
    // Calculate total score based on the criteria met
    let strengthScore = 0;
    if (condLength) strengthScore += 33.3;
    if (condNumber) strengthScore += 33.3;
    if (condUpper) strengthScore += 33.4;
    
    if (bar) {
        bar.style.width = strengthScore + "%";
        
        // Color mapping
        if (strengthScore <= 34) {
            bar.style.backgroundColor = "#f43f5e"; // Rose Red (Weak)
            if (text) {
                text.textContent = "Weak password";
                text.style.color = "#f43f5e";
            }
        } else if (strengthScore <= 68) {
            bar.style.backgroundColor = "#f97316"; // Orange (Medium)
            if (text) {
                text.textContent = "Medium strength";
                text.style.color = "#f97316";
            }
        } else {
            bar.style.backgroundColor = "#16a34a"; // Green (Strong)
            if (text) {
                text.textContent = "Strong password";
                text.style.color = "#16a34a";
            }
        }
    }
    
    // Clear field validation error if criteria are met
    if (condLength) {
        clearFieldError("password");
    }
}

// Toggle loading state on submit buttons
function setButtonLoading(formId, isLoading, defaultText = "Submit") {
    const form = document.getElementById(formId);
    if (!form) return;
    
    const btn = form.querySelector(".auth-submit-btn");
    if (!btn) return;
    
    if (isLoading) {
        btn.classList.add("loading");
        btn.disabled = true;
        btn.querySelector(".spinner").style.display = "inline-block";
        
        // Set context loading texts on the text span (excluding the spinner)
        const textSpan = btn.querySelector("span:not(.spinner)");
        if (textSpan) {
            if (formId === "loginForm") {
                textSpan.textContent = "Signing In...";
            } else {
                textSpan.textContent = "Creating Account...";
            }
        }
    } else {
        btn.classList.remove("loading");
        btn.disabled = false;
        const spinner = btn.querySelector(".spinner");
        if (spinner) spinner.style.display = "none";
        
        const textSpan = btn.querySelector("span:not(.spinner)");
        if (textSpan) {
            textSpan.textContent = defaultText;
        } else {
            btn.textContent = defaultText;
        }
    }
}

// SIGNUP SUBMISSION
function handleSignup(event) {
    event.preventDefault();
    hideAlert();
    
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    
    let hasError = false;
    let firstErrorField = null;
    
    // Validate Name
    if (name.length < 2) {
        showFieldError("name", name.length === 0 ? "Full name is required" : "Name must be at least 2 characters");
        hasError = true;
        firstErrorField = "name";
    } else {
        clearFieldError("name");
    }
    
    // Validate Email
    if (!isValidEmail(email)) {
        showFieldError("email", email.length === 0 ? "Email address is required" : "Please enter a valid email address");
        hasError = true;
        if (!firstErrorField) firstErrorField = "email";
    } else {
        clearFieldError("email");
    }
    
    // Validate Password
    if (password.length < 6) {
        showFieldError("password", password.length === 0 ? "Password is required" : "Password must be at least 6 characters");
        hasError = true;
        if (!firstErrorField) firstErrorField = "password";
    } else {
        clearFieldError("password");
    }
    
    if (hasError) {
        if (firstErrorField) {
            document.getElementById(firstErrorField).focus();
        }
        return;
    }
    
    // Trigger loading spinner for simulated security check
    setButtonLoading("signupForm", true, "Sign Up");
    
    setTimeout(() => {
        // Check account collision
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser && storedUser.email === email) {
            setButtonLoading("signupForm", false, "Sign Up");
            showAlert("This email is already registered. Please sign in.", "error");
            document.getElementById("email").focus();
            return;
        }
        
        const user = {
            name: name,
            email: email,
            password: password
        };
        
        localStorage.setItem("user", JSON.stringify(user));
        setButtonLoading("signupForm", false, "Sign Up");
        showAlert("Account created successfully! Redirecting to login...", "success");
        
        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);
    }, 850);
}

// LOGIN SUBMISSION
function handleLogin(event) {
    event.preventDefault();
    hideAlert();
    
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    
    let hasError = false;
    let firstErrorField = null;
    
    // Validate Email
    if (!isValidEmail(email)) {
        showFieldError("loginEmail", email.length === 0 ? "Email address is required" : "Please enter a valid email address");
        hasError = true;
        firstErrorField = "loginEmail";
    } else {
        clearFieldError("loginEmail");
    }
    
    // Validate Password
    if (password.length === 0) {
        showFieldError("loginPassword", "Password is required");
        hasError = true;
        if (!firstErrorField) firstErrorField = "loginPassword";
    } else {
        clearFieldError("loginPassword");
    }
    
    if (hasError) {
        if (firstErrorField) {
            document.getElementById(firstErrorField).focus();
        }
        return;
    }
    
    // Trigger loading spinner
    setButtonLoading("loginForm", true, "Sign In");
    
    setTimeout(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        
        if (!storedUser) {
            setButtonLoading("loginForm", false, "Sign In");
            showAlert("No registered account found on this device. Please sign up first.", "error");
            return;
        }
        
        if (email === storedUser.email && password === storedUser.password) {
            showAlert("Welcome back! Redirecting to home...", "success");
            localStorage.setItem("isLoggedIn", "true");
            
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1000);
        } else {
            setButtonLoading("loginForm", false, "Sign In");
            showAlert("Incorrect email address or password. Please try again.", "error");
            document.getElementById("loginPassword").value = "";
            document.getElementById("loginPassword").focus();
        }
    }, 850);
}

// CHECK LOGIN STATUS ON PAGE LOAD (Silent redirect, no ugly alert dialogs)
function checkLogin() {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
        window.location.href = "login.html";
    }
}

// LOGOUT FUNCTION
function logout() {
    localStorage.removeItem("isLoggedIn");
    window.location.href = "login.html";
}