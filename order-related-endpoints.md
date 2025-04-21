---

# 🧾 Orders API – Endpoint Reference

This document outlines the essential and recommended API endpoints for managing orders in a multi-vendor eCommerce system.

---

## ✅ Essential Order Endpoints

### 1. **Get All Orders for a User (List Orders)**

`GET /orders`

- **Description**: Fetch all orders made by the authenticated user.
- **Query params**: Optional filters (`status`, `date range`, etc.)
- **Auth**: User

---

### 2. **Get Single Order (Order Details)**

`GET /orders/:id`

- **Description**: Retrieve details of a specific order including order items and shipping address.
- **Auth**: User (must own the order)

---

## 🔐 Admin/Vendor Related Endpoints

### 3. **Get All Orders (Admin/Vendor Panel)**

`GET /admin/orders`

- **Description**: Fetch all orders placed in the system.
- **Query params**:
  - `vendorId`
  - `status`
  - `date range`
  - `userId`
- **Auth**: Admin or Vendor

---

### 4. **Update Order Status**

`PATCH /orders/:id/status`

- **Description**: Update the order status to next stage in the lifecycle.
- **Status flow**:
  - `PENDING` → `CONFIRMED`
  - `CONFIRMED` → `SHIPPED`
  - `SHIPPED` → `DELIVERED`
  - `DELIVERED` → `COMPLETED`
- **Auth**: Admin or Vendor

---

## 🛑 Optional but Useful

### 5. **Cancel Order**

`PATCH /orders/:id/cancel`

- **Description**: Cancel an order before it is shipped.
- **Side Effects**:
  - Revert stock
  - Update order status to `CANCELLED`
- **Auth**: User (if order not shipped), Admin

---

### 6. **Track Order**

`GET /orders/:id/track`

- **Description**: View order tracking information (status history, estimated delivery).
- **Auth**: User (must own the order)

---

## 💳 Payment Related Endpoints

### 7. **Mark Order as Paid**

`POST /orders/:id/pay`

- **Description**: Mark an order as paid after successful payment.
- **Used by**:
  - Payment gateway callback/webhook
  - Client-side confirmation
- **Updates**:
  - `status: PAID`
  - Save `payment_reference`
  - Set `paidAt` timestamp
- **Auth**: System or Client (with verification)

---

## 🚦 Suggested Flow (Before Payment Integration)

1. ✅ **Checkout** – creates vendor-split orders from cart.
2. 🕒 **Orders are created with `PENDING` status**.
3. 💰 **Payment is processed externally**.
4. ✅ **After payment**, use `/orders/:id/pay` to confirm.

---
