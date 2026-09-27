# Corporate Travel Management System - Business Process

## 1. Executive Summary
This document outlines the business process for the Thinqloud Corporate Travel Management System. The goal is to provide a comprehensive, end-to-end workflow for managing employee travel requests, manager approvals, bookings, expense submissions, and financial reimbursements.

## 2. Actors & Roles
| Role | Responsibilities |
|---|---|
| **Employee** | Submits travel requests, views bookings, submits actual expenses, and tracks reimbursement status. |
| **Manager** | Reviews, approves, or rejects travel requests and verifies submitted expenses against company policies. |
| **Finance/Admin** | Records booking details (flights/hotels), manages reimbursements, and maintains financial reports. |

## 3. The Complete Business Workflow
The lifecycle of a single travel event follows these distinct phases:

1. **Initiation**: Employee creates a *Travel Request* detailing destination, dates, purpose, and estimated costs (Travel, Hotel, Food, Other).
2. **Approval (Level 1)**: Manager reviews the request. If rejected, the workflow ends (with a reason). If approved, it moves to booking.
3. **Fulfillment**: Finance/Admin creates a *Booking* record (e.g., flight PNR, hotel confirmation) linked to the approved request.
4. **Execution**: The employee completes the actual business trip.
5. **Expense Claim**: Upon return, the employee submits an *Expense Claim* with actual costs and receipt evidence.
6. **Verification**: Manager verifies the expense claim against the original estimates and receipts.
7. **Reimbursement**: Finance reviews the verified claim, marks it as "Paid", and the system records the transaction.
8. **Closure**: The trip and associated claims are marked as "Completed".

## 4. Business Rules & Edge Cases
To ensure data integrity and compliance, the following rules are enforced:
- **BR-1 Date Integrity**: Start Date must be equal to or greater than today, and End Date must be >= Start Date.
- **BR-2 Immutability**: Employees cannot modify a Travel Request once it is submitted (unless reverted to Draft) or after it is Approved.
- **BR-3 Authorization Pipeline**: Only a direct Manager can approve/reject a Travel Request.
- **BR-4 Dependency**: Expenses can only be submitted for a trip that is in `Approved` or `Completed` status.
- **BR-5 Financial Thresholds**: If actual expenses exceed estimated expenses by >10%, additional justification or secondary approval is required.
- **BR-6 Mandatory Justification**: A rejection by a Manager must include a `rejectionReason`.
- **BR-7 Segregation of Duties**: Only users with the Finance role can mark an Expense Claim as `Paid`.

## 5. ER Model (MongoDB Collections)
The system requires the following normalized document structure:

*   **User**: `_id`, `name`, `email`, `role`, `department`, `managerId`
*   **TravelRequest**: `_id`, `employeeId` (Ref: User), `destination`, `purpose`, `startDate`, `endDate`, `estimatedCosts` (Object), `status`, `managerComment`
*   **Booking**: `_id`, `requestId` (Ref: TravelRequest), `type` (Flight/Hotel/Train), `provider`, `bookingReference`, `cost`, `details`
*   **ExpenseClaim**: `_id`, `requestId` (Ref: TravelRequest), `employeeId` (Ref: User), `totalAmount`, `status`, `financeComment`
*   **ExpenseItem**: `_id`, `claimId` (Ref: ExpenseClaim), `category`, `amount`, `date`, `receiptUrl`
