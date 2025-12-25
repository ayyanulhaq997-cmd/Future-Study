# UNICOU Platform Setup & Operation Guide

This document provides essential instructions for managing the UNICOU Global Academic Mobility platform.

## 1. Website Overview
UNICOU is a high-performance ecosystem for Study Abroad, Voucher Sales, and LMS Preparation.

## 2. Enabling Physical Emails (Production)
By default, the platform runs in **Simulated Mail Mode** (logs to browser console). To send real emails to customers:

### Option A: EmailJS (Recommended for Frontend only)
1. Sign up at [emailjs.com](https://www.emailjs.com/).
2. In `services/apiService.ts`, update `dispatchMail` to use the `emailjs-com` library.
3. Replace the `EMAIL_API_ENDPOINT` logic with `emailjs.send(...)`.

### Option B: Backend SMTP (Professional Standard)
1. Set `EMAIL_MODE = 'production'` in `services/apiService.ts`.
2. Provide a valid `EMAIL_API_ENDPOINT` pointing to your Node.js or Python backend.
3. Ensure your backend is configured with **SendGrid** or **Amazon SES**.

## 3. Payment Configuration
### Bank Transfer (Primary)
Update `BANK_DETAILS` in `services/apiService.ts`. Admin must manually verify references in the **Admin Terminal** to trigger voucher dispatch.

### Razorpay (Secondary)
Update `RAZORPAY_KEY_ID` in `services/apiService.ts` with your Live Key from the Razorpay dashboard.

## 4. Admin Access
- **Admin**: admin@unicou.uk
- **Finance**: finance@unicou.uk
- **Trainer**: trainer@unicou.uk

## 5. Fulfillment & Security
All raw voucher codes are encrypted in the **Voucher Vault**. Staff roles (Finance/Teller) cannot see raw codes; only the Admin and the purchasing Student have access to the decrypted assets.