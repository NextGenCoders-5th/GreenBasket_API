# Checkout Flow in E-Commerce API

## 1. Validate Stock Availability

### Why?

Before proceeding with the order, the system needs to check if the products in the cart are still available in stock.

### How?

- The backend fetches all cart items:  
  **SQL Query:**

  ```sql
  SELECT product_id, quantity FROM cart_items WHERE cart_id = 'cart-456';
  ```

- It then verifies each product’s stock in the `products` table:  
  **SQL Query:**

  ```sql
  SELECT id, stock FROM products WHERE id IN ('prod-123', 'prod-456');
  ```

- If any product has insufficient stock:

  - The checkout process stops.
  - The system returns an **error message**:

    ```json
    {
      "error": "Product 'Product Name' is out of stock."
    }
    ```

- If stock is available:

  - The system **reserves the stock** by reducing the quantity temporarily.
  - **Stock update query**:

    ```sql
    UPDATE products
    SET stock = stock - 2
    WHERE id = 'prod-123';
    ```

---

## 2. Create an Order in `orders` Table

### Why?

Once stock is validated, the system needs to create a record for this purchase.

### How?

- The backend inserts a new record in the `orders` table:

  ```sql
  INSERT INTO orders (id, user, vendor, address, total_price, status, createDate)
  VALUES ('order-001', 'user-789', 'vendor-321', 'addr-456', 50.0, 'pending', NOW());
  ```

- The order starts in the **`pending`** status.

---

## 3. Move Items from `cart_items` to `order_items`

### Why?

Now that an order is created, we need to **associate** the cart items with the order and move them to the `order_items` table.

### How?

- The backend **copies** items from `cart_items` to `order_items`:

  ```sql
  INSERT INTO order_items (id, order, product, price, quantity, sub_total, createDate)
  SELECT uuid_generate_v4(), 'order-001', product, price, quantity, (price * quantity), NOW()
  FROM cart_items
  WHERE cart_id = 'cart-456';
  ```

- After copying, the **cart no longer needs these items**, so they are deleted:

  ```sql
  DELETE FROM cart_items WHERE cart_id = 'cart-456';
  ```

---

## 4. Update Cart Status to `checked_out`

### Why?

Now that the cart items have been **moved to an order**, the cart should no longer be active.

### How?

- The backend updates the cart’s status:

  ```sql
  UPDATE carts
  SET status = 'checked_out'
  WHERE id = 'cart-456';
  ```

---

## 5. Return Order Details to Frontend

### Why?

Now that the order is created, the frontend needs to **display the order confirmation**.

### How?

- The backend sends back order details:

  ```json
  {
    "orderId": "order-001",
    "status": "pending",
    "total_price": 50.0
  }
  ```

- The frontend **redirects the user** to the order confirmation page:
  - Shows `Order #001`
  - Displays the total price
  - Provides a "Proceed to Payment" button

---

## 6. Payment Process and Order Fulfillment

### Why?

After checkout, the user needs to pay for the order, and the system must process the fulfillment steps.

### How?

1. **User selects a payment method and initiates payment.**

   - The system creates a record in the `payments` table:

     ```sql
     INSERT INTO payments (id, amount, status, orderId, createdAt)
     VALUES ('payment-001', 50.0, 'pending', 'order-001', NOW());
     ```

   - The frontend redirects the user to the payment gateway.

2. **Payment is processed.**

   - If payment **succeeds**, update the payment status:

     ```sql
     UPDATE payments SET status = 'completed', updatedAt = NOW() WHERE id = 'payment-001';
     ```

   - Also update the order status:

     ```sql
     UPDATE orders SET status = 'confirmed' WHERE id = 'order-001';
     ```

   - The user receives a confirmation message.
   - If payment **fails**, update the payment status:

     ```sql
     UPDATE payments SET status = 'failed', updatedAt = NOW() WHERE id = 'payment-001';
     ```

   - The order remains in `pending`, prompting the user to retry.

3. **Vendor receives order confirmation.**

   - The system notifies the vendor to prepare for shipping.
   - Vendor updates the order status when ready for shipment:

     ```sql
     UPDATE orders SET status = 'shipped' WHERE id = 'order-001';
     ```

4. **Order is delivered to the customer.**

   - The delivery service updates tracking.
   - Once delivered, the status updates:

     ```sql
     UPDATE orders SET status = 'delivered' WHERE id = 'order-001';
     ```

   - The user is notified of successful delivery.

5. **User can request returns or refunds.**

   - If eligible, the user initiates a return request.
   - Admin/vendor processes the return:

     ```sql
     UPDATE orders SET status = 'returned' WHERE id = 'order-001';
     ```

   - If refunded, the payment is reversed, and status updates:

     ```sql
     UPDATE orders SET status = 'refunded' WHERE id = 'order-001';
     UPDATE payments SET status = 'refunded', updatedAt = NOW() WHERE orderId = 'order-001';
     ```

---

## Alternative Flows

- **User Cancels Order**: `PATCH /orders/:id → { "status": "cancelled" }`
- **User Requests a Return**: `PATCH /orders/:id → { "status": "returned" }`
- **Refund is Processed** if return is approved.
- **User retries failed payment**: `PATCH /payments/:id → { "status": "pending" }`

This ensures a smooth checkout experience while maintaining data integrity and stock consistency.
