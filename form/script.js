const tabs = Array.from(document.querySelectorAll("[role='tab']"));
const panels = {
  login: document.getElementById("login-panel"),
  signup: document.getElementById("signup-panel"),
};
const tabBar = document.querySelector(".tab-bar");
const alertBox = document.getElementById("form-alert");

function activateTab(name, options = {}) {
  const selectedTab = tabs.find((tab) => tab.dataset.tab === name);
  if (!selectedTab) return;

  tabs.forEach((tab) => {
    const active = tab === selectedTab;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
  });

  Object.entries(panels).forEach(([panelName, panel]) => {
    panel.hidden = panelName !== name;
  });
  tabBar.dataset.active = name;
  hideAlert();
  if (options.focus) selectedTab.focus();
}

function showAlert(message, type = "failure") {
  alertBox.textContent = message;
  alertBox.className = `form-alert ${type}`;
  alertBox.hidden = false;
}

function hideAlert() {
  alertBox.textContent = "";
  alertBox.className = "form-alert";
  alertBox.hidden = true;
}

function setError(input, message) {
  const error = document.getElementById(`${input.id}-error`);
  if (error) error.textContent = message;
  input.classList.toggle("invalid", Boolean(message));
  if (message) input.setAttribute("aria-invalid", "true");
  else input.removeAttribute("aria-invalid");
  return !message;
}

function clearFormErrors(form) {
  form.querySelectorAll(".error").forEach((error) => { error.textContent = ""; });
  form.querySelectorAll(".invalid").forEach((input) => {
    input.classList.remove("invalid");
    input.removeAttribute("aria-invalid");
  });
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

function passwordStrength(value) {
  let score = 0;
  if (value.length >= 8) score += 1;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score += 1;
  if (/\d/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value)) score += 1;
  return score;
}

function updateStrength() {
  const password = document.getElementById("signup-password").value;
  const meter = document.querySelector(".strength-meter");
  const bars = document.querySelector(".strength-bars");
  const caption = document.getElementById("strength-caption");
  const score = password ? passwordStrength(password) : 0;
  const messages = [
    "Use 8+ characters with a number or symbol",
    "Too short — use at least 8 characters",
    "Add upper and lowercase letters",
    "Add a number for a stronger password",
    "Strong password",
  ];

  bars.dataset.strength = String(score);
  meter.dataset.strength = String(score);
  caption.textContent = password ? messages[score] : messages[0];
  meter.setAttribute("aria-label", password ? `Password strength: ${score} of 4` : "Password strength");
}

function validateLogin() {
  const email = document.getElementById("login-email");
  const password = document.getElementById("login-password");
  const validEmail = isValidEmail(email.value)
    ? setError(email, "")
    : setError(email, email.value.trim() ? "Enter a valid email address." : "Email address is required.");
  const validPassword = password.value.trim()
    ? setError(password, "")
    : setError(password, "Password is required.");
  return validEmail && validPassword;
}

function validateSignup() {
  const name = document.getElementById("full-name");
  const email = document.getElementById("signup-email");
  const phone = document.getElementById("phone");
  const pin = document.getElementById("pin-code");
  const password = document.getElementById("signup-password");
  const confirmPassword = document.getElementById("confirm-password");
  const terms = document.getElementById("terms");
  const phoneDigits = phone.value.replace(/\D/g, "");
  let valid = true;

  valid = setError(name, name.value.trim().length >= 2 ? "" : "Please enter your full name.") && valid;
  valid = setError(email, isValidEmail(email.value) ? "" : email.value.trim() ? "Enter a valid email address." : "Email address is required.") && valid;
  valid = setError(phone, /^\+?[\d\s().-]+$/.test(phone.value.trim()) && phoneDigits.length >= 7 && phoneDigits.length <= 15
    ? ""
    : phone.value.trim() ? "Enter a valid phone number (7–15 digits)." : "Phone number is required.") && valid;
  valid = setError(pin, /^\d{6}$/.test(pin.value.trim())
    ? ""
    : pin.value.trim() ? "Enter a valid 6-digit PIN code." : "PIN code is required.") && valid;

  const strength = passwordStrength(password.value);
  valid = setError(password, password.value.length >= 8 && (/[\d\W]/.test(password.value))
    ? ""
    : password.value ? "Use at least 8 characters and include a number or symbol." : "Password is required.") && valid;
  valid = setError(confirmPassword, confirmPassword.value && confirmPassword.value === password.value
    ? ""
    : confirmPassword.value ? "Passwords do not match." : "Please confirm your password.") && valid;
  valid = setError(terms, terms.checked ? "" : "Please accept the terms to continue.") && valid;

  // Avoid accepting a password that only just meets length when strength feedback indicates it needs work.
  if (password.value && password.value.length >= 8 && strength < 2) {
    setError(password, "Add a number or symbol to make your password stronger.");
    valid = false;
  }
  return valid;
}

for (const tab of tabs) {
  tab.addEventListener("click", () => activateTab(tab.dataset.tab));
  tab.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const nextIndex = (tabs.indexOf(tab) + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    activateTab(tabs[nextIndex].dataset.tab, { focus: true });
  });
}

document.querySelectorAll("[data-switch]").forEach((button) => {
  button.addEventListener("click", () => activateTab(button.dataset.switch));
});

document.querySelectorAll("[data-toggle]").forEach((button) => {
  button.addEventListener("click", () => {
    const input = document.getElementById(button.dataset.toggle);
    const showPassword = input.type === "password";
    input.type = showPassword ? "text" : "password";
    button.textContent = showPassword ? "Hide" : "Show";
    button.setAttribute("aria-label", `${showPassword ? "Hide" : "Show"} password`);
  });
});

document.getElementById("signup-password").addEventListener("input", () => {
  updateStrength();
  const confirmPassword = document.getElementById("confirm-password");
  if (confirmPassword.value) {
    setError(confirmPassword, confirmPassword.value === document.getElementById("signup-password").value ? "" : "Passwords do not match.");
  }
});

document.querySelectorAll("input").forEach((input) => {
  input.addEventListener("input", () => {
    if (input.classList.contains("invalid") && input.type !== "checkbox") setError(input, "");
    if (!alertBox.hidden) hideAlert();
  });
  input.addEventListener("change", () => {
    if (input.type === "checkbox" && input.classList.contains("invalid") && input.checked) setError(input, "");
    if (!alertBox.hidden) hideAlert();
  });
});

document.getElementById("login-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  clearFormErrors(form);
  if (!validateLogin()) {
    showAlert("Please review the highlighted fields and try again.");
    form.querySelector(".invalid")?.focus();
    return;
  }
  form.reset();
  showAlert("You’re all set — this demo login was validated successfully.", "success");
});

document.getElementById("signup-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  clearFormErrors(form);
  if (!validateSignup()) {
    showAlert("A few details need your attention. Check the messages below.");
    form.querySelector(".invalid")?.focus();
    return;
  }
  form.reset();
  updateStrength();
  showAlert("Account details look great — your registration was successful.", "success");
});

document.getElementById("forgot-link").addEventListener("click", (event) => {
  event.preventDefault();
  showAlert("Password recovery is not connected in this client-side demo. Please contact support for help.", "failure");
});

activateTab("login");
