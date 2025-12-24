# UNICOU Platform Setup & Operation Guide

This document provides essential instructions for managing the UNICOU Global Academic Mobility platform.

## 1. Website Overview
UNICOU is a high-performance ecosystem for:
- **Voucher Store**: Selling Pearson PTE, IELTS, and TOEFL vouchers.
- **Academy**: LMS for exam preparation with automated and manual grading.
- **Study Abroad**: Global institution directory and lead generation.
- **Identity Registry**: Role-based access for Admins, Finance, Trainers, Agents, and Students.

## 2. Payment Configuration (Real Payments)

### Primary: Bank Transfer (Direct Settlement)
Bank transfers are the primary source for receiving funds. This is a manual verification process.
1. **Configure Bank Details**:
   - Open `services/apiService.ts`.
   - Locate the `BANK_DETAILS` constant.
   - Update `accountNumber`, `sortCode`, `iban`, and `swift` with your real business account info.
2. **Verification Workflow**:
   - When a customer selects "Bank Transfer", they see your details and enter a reference number.
   - The order status is set to `Pending`.
   - Log in to the **Admin Terminal** (`admin@nexus.ai`).
   - Go to **Teller Desk**.
   - Review the reference number against your bank statement.
   - Click **"Approve & Release"**. This triggers the instant email dispatch of vouchers.

### Secondary: Razorpay (Credit/Debit Cards)
Automated card payments can be enabled for instant fulfillment.
1. **Live Key Configuration**:
   - Open `services/apiService.ts`.
   - Update `RAZORPAY_KEY_ID` with your **Live Key ID** from the Razorpay Dashboard.
2. **Note on Currency**: The current logic converts USD amounts to INR for Razorpay processing. Adjust the currency logic in `createGatewayOrder` if using a different gateway region.

## 3. Administrative Access
Use the following credentials to access management nodes:
- **Super Admin**: `admin@nexus.ai` (Full access to inventory, logs, users).
- **Finance/Teller**: `finance@nexus.ai` (Verify payments, view reports).
- **Lead Trainer**: `trainer@nexus.ai` (Grade Writing/Speaking submissions).

## 4. Fulfillment & Security
- **Voucher Vault**: Vouchers are stored in `services/db.ts` or imported via the Admin Terminal.
- **Masking**: Staff roles (Finance/Trainer) see masked voucher codes (`****-****-****`) to prevent theft. Only the Admin or the verified Customer sees raw codes.
- **Instant Delivery**: Vouchers are released to the customer's email node immediately upon "Verified" status.

## 5. Contact & Support
For deep infrastructure support, contact the core team at **connect@unicou.uk**.