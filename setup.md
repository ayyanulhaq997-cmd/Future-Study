# UNICOU Platform Setup & Operation Guide

This document provides essential instructions for managing the UNICOU Global Academic Mobility platform.

## 1. Website Overview
UNICOU is a high-performance ecosystem for:
- **Voucher Store**: Selling Pearson PTE, IELTS, and TOEFL vouchers.
- **Academy**: LMS for exam preparation with automated and manual grading.
- **Study Abroad**: Global institution directory and lead generation.
- **Identity Registry**: Role-based access for Admins, Finance, Trainers, Agents, and Students.

## 2. Payment Configuration (Real Payments)

### PRIMARY: Bank Transfer (Direct Settlement)
Bank transfers are the **official production standard** for UNICOU Ltd. This ensures 0% gateway leakage and total control over settlement verification.
1. **Configure Bank Details**:
   - Open `services/apiService.ts`.
   - Locate the `BANK_DETAILS` constant.
   - Update `accountNumber`, `sortCode`, `iban`, and `swift` with your real UniCou Ltd business account info.
2. **Verification Workflow**:
   - Customers see bank details during checkout and are prompted to upload a receipt/provide a reference.
   - Order status is locked to `Pending`.
   - Log in to the **Admin Terminal** (`admin@unicou.uk`).
   - Go to **Teller Desk**.
   - Cross-reference the uploaded receipt/reference against your real-time bank ledger.
   - Click **"Approve & Release"**. This triggers the instant SMTP dispatch of vouchers to the student.

### SECONDARY: Razorpay (Credit/Debit Cards)
Optional automated card payments.
1. **Live Key Configuration**:
   - Open `services/apiService.ts`.
   - Update `RAZORPAY_KEY_ID` with your **Live Key ID** from the Razorpay Dashboard.
2. **Note on Currency**: The current logic converts USD amounts to local currency nodes for gateway processing.

## 3. Administrative Access
Use the following credentials to access management nodes:
- **Super Admin**: `admin@unicou.uk` (Full access to inventory, logs, users).
- **Finance/Teller**: `finance@unicou.uk` (Verify payments, view reports).
- **Lead Trainer**: `trainer@unicou.uk` (Grade Writing/Speaking submissions).

## 4. Fulfillment & Security
- **Voucher Vault**: Vouchers are stored in `services/db.ts` or imported via the Admin Terminal.
- **Masking**: Staff roles (Finance/Teller) see masked voucher codes (`****-****-****`) to prevent theft. Only the Admin or the verified Customer sees raw codes.
- **Instant Delivery**: Vouchers are released to the customer's email node immediately upon "Verified" status.

## 5. Contact & Support
For deep infrastructure support, contact the core team at **connect@unicou.uk**.
