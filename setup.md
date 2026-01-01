
# UNICOU Platform Setup & Operation Guide

This document provides essential instructions for managing the UNICOU Global Academic Mobility platform.

## 1. Website Overview
UNICOU is a high-performance ecosystem for Study Abroad, Voucher Sales, and LMS Preparation.

## 2. Enabling Real Emails (Gmail)
By default, the app uses **Simulated Mode**. To receive real emails in your Gmail, provide the following details from your EmailJS dashboard:

### Required Information
- **SERVICE_ID**: Found in "Email Services" tab (e.g., `service_abc123`)
- **TEMPLATE_ID**: Found in "Email Templates" tab (e.g., `template_xyz456`)
- **PUBLIC_KEY**: Found in "Account" -> "API Keys" tab.

### Email Template Configuration
In EmailJS, your template must use these exact variable names in the "Content" area:
- `{{to_name}}`: The user's name.
- `{{to_email}}`: The user's Gmail address.
- `{{verification_link}}`: The unique link the user clicks to verify.

### How it works
When a student signs up, they get an email. Clicking the link takes them back to the site where the app automatically authorizes their account, allowing them to buy vouchers.

## 3. Payment Configuration
### Bank Transfer (Primary)
Update `BANK_DETAILS` in `services/apiService.ts`. Admin must manually verify references in the **Admin Terminal** to trigger voucher dispatch.

## 4. Admin Access
- **Admin**: admin@unicou.uk
- **Finance**: finance@unicou.uk
- **Trainer**: trainer@unicou.uk

## 5. Fulfillment & Security
All raw voucher codes are encrypted in the **Voucher Vault**. Staff roles (Finance/Teller) cannot see raw codes; only the Admin and the purchasing Student have access to the decrypted assets.
