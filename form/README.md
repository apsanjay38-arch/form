# EX.NO: 02 — Client-Side Form Validation

**Date:** 30.07.2026

## Aim

Develop a website that lets users enter account details and validates the input in the browser before accepting the form.

## Features

- Login and sign-up forms with accessible tabs.
- Required-field checks and email, phone, and six-digit PIN validation.
- Password visibility toggle, strength meter, and confirmation matching.
- Terms acceptance check and combined inline error messages.
- Responsive layout with success and failure banners.

## Files

- `index.html` — page structure and form fields.
- `style.css` — layout, styling, and responsive behavior.
- `script.js` — tab behavior, password controls, and client-side validation.

## Run the website

No installation or build step is required. Open `index.html` in a web browser, or open this folder in VS Code and use **Open with Live Server** if that extension is installed.

## Test cases

1. Submit either form empty and confirm required-field errors appear.
2. Try an invalid email, a short phone number, or a PIN that is not six digits.
3. On sign-up, try a weak password, mismatched confirmation, and unchecked terms.
4. Enter valid details, accept the terms, and confirm the success message appears.

> This is a front-end exercise. The forms validate locally and do not save data or connect to an authentication service.
