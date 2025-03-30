### 1. User Adds a Product to the Cart

- Action: User clicks "Add to Cart" on a product.

- API Call: `POST`: `/cart/items`

- Payload:

  ```json
  {
    "productId": "123",
    "quantity": 2
  }
  ```

- Backend:

  - Checks if the user already has an active cart.
  - If not, creates a new cart for the user.
  - Adds the product to cart_items.
  - Updates the cart’s total_price.

- Response:
  
  - Updated cart details including total price and items.

- Frontend Updates:
  - Cart icon updates to show the number of items.
  - User can view the cart.

### 2. User Views the Cart

  * Action: User navigates to the "Cart" page.
  * API Call: `GET`: `/cart`
  * Response:
    ```json
        {
          "id": "cart-456",
          "total_price": 50.0,
          "items": [
            {
              "productId": "123",
              "name": "Product Name",
              "price": 25.0,
              "quantity": 2,
              "sub_total": 50.0
            }
          ]
        }
    ```
* Frontend Updates:
  * Displays cart items with options to:
    * Increase/Decrease quantity (PATCH /cart/items/:id).
    * Remove items (DELETE /cart/items/:id).

### 3. User Proceeds to Checkout
  * Action: Clicks "Checkout" button.
  * API Call: `POST` `/orders`
  * Payload:
    ```json
      {
        "cartId": "cart-456",
        "addressId": "addr-789",
        "paymentMethod": "credit_card"
      }
    ```
* Backend:
  * Validates stock availability.
  * Creates an order (orders table).
  * Moves items from cart_items to order_items.
  * Updates cart status to checked_out.
  * Returns order details.
* Response:
    ```jsn
        {
          "orderId": "order-001",
          "status": "pending",
          "total_price": 50.0
        }
    ```
* Frontend Updates:
  * Redirects to Order Confirmation page.

### 4.  User Makes Payment
  * Action: User selects a payment method and pays.
  * API Call: `POST` `/payments`
  * Payload:
    ```json
      {
        "orderId": "order-001",
        "paymentMethod": "credit_card"
      }
    ```
  * Backend:
    * Processes payment.
    * Updates order.status to "confirmed" if successful.
      
  *  Response:
    ```json
      {
        "orderId": "order-001",
        "status": "confirmed"
      }
     ```

  * Frontend Updates:
    * Shows Order Confirmation page.
    * Updates order status to Confirmed.

## 5.  Vendor Ships the Order
  * Backend Process:
    * Vendor sees the confirmed order (GET /vendor/orders).
    * Ships it and updates order.status = "shipped".
  * Frontend Updates:
    * User can track order status (`GET`: `/orders/:id`).
    * Shows `"Shipped"` status.

## 6.  Order is Delivered
  * Vendor updates order to delivered.
  * User gets a notification.
  * User can:
    * Mark it as received.
    * Leave a review.
