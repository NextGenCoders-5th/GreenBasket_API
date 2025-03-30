```ts

Project nestjs_ecommerce_api {
  database_type: 'PostgreSQL'
  Note: 'Nest.js e-commerce api'
}

enum user_roles {
  admin [note: "Have full control, manage users, vendors, and orders."]
  customer [note: "Can browse products, add to cart, place orders, and leave reviews."]
  vendor [note: "Can manage products, view orders, track payouts."]
}

enum user_status {
  active
  inactive
  banned
  deleted
}

Table user {
  id uuid [pk, not null]
  first_name varchar [not null, note: "first name of the user"]
  last_name varchar [not null, note: 'last name of the user']
  email varchar [null, note: "email of ther user"]
  phone_number varchar [unique, not null]
  password  varchar [not null]
  profile_picture varchar [null, default: "default user avatar"]
  role user_roles [not null, note: "user role"]
  status user_status [not null, note: "Account status."]

  vendor uuid [null, note: "Every vendor is a user, but not every user is a vendor."]
  addresses uuid [not null]
  orders uuid [null, note: " A user can place multiple orders."]

  createDate timestamp
  updateDate timestamp
}

enum vendor_status {
  // User signs up as a vendor (linked to users table).
  pending [note: "Admin reviews application (status = 'pending')."]
  approved [note: "Approval"]
  suspended [note: "Rejection"]
}

Ref user_vendors: user.vendor - vendors.user
Table vendors {
  id uuid [pk, not null]
  business_name varchar [not null, note: "Vendor's store name."]
  business_email varchar [unique, not null, note: "Contact email for the business."]
  phone_number varchar [not null, unique, note: "Business phone number."]
// address Vendor’s physical address.
  logo_url varchar [null, default: "default logo url", note: "Vendor’s store logo (image link)."]
  status vendor_status [not null, note: "Vendor’s approval status."]

  user uuid [not null]
  addresses uuid [not null]
  products uuid [null]
  orders uuid [null, note: 'Vendors fulfill multiple orders.']

  createDate timestamp
  updateDate timestamp
}

enum address_type {
  business [note: "Business Address → Vendor’s store or warehouse location."]
  shipping [note: "Shipping Address → Customer’s delivery address.."]
}

Ref: user.addresses < addresses.user
Ref: vendors.addresses < addresses.vendor
Table addresses {
  id uuid [pk, not null]
  street varchar [not null, note: "street address"]
  city varchar [not null, note: 'city name']
  zip_code varchar [null, note: 'postal code']
  country varchar [not null, note: 'country name']
  latitude float [null, note:   "geolocation - latitude"]
  longitude float [null, note:   "geolocation - longitude"]
  is_default bool [default: false]
  type address_type [not null]

  user uuid [null, note: "Links the address to a user."]
  vendor uuid [null, note: "Links to a vendor if it's a business address"]

  createDate timestamp
  updateDate timestamp
}

enum category_status {
  active
  inactive
}
Table categories {
  id uuid [pk, not null]
  name varchar [not null, note: "Category name (e.g., Fruits, Vegetables, Organic)."]
  slug varchar [unique, not null, note: "URL-friendly version of the name (e.g., fruits, organic-vegetables)."]
  image_url varchar [null, note: "Optional category image."]
  status category_status [not null, default: "active", note: "Determines if the category is available."]

  parent_id uuid [null, note: "For subcategories (e.g., \"Citrus\" under \"Fruits\")."]
  products uuid [null, note: "referece to an array product ids."]

  createDate timestamp
  updateDate timestamp
  deleteDate timestamp [note: "their wil be soft delete"]
}

enum product_status {
  active
  inactive
  out_of_stock
}

Ref vendor_products: vendors.products < products.vendor
Ref category_products: categories.products <> products.category
Table products {
  id uuid [pk, not null]
  name varchar [not null, note: "Product name (e.g., \"Fresh Mangoes\")."]
  description varchar [not null, note: "Detailed product description."]
  price float [not null, note: "Price per unit (e.g., per kg, per piece)."]
  discount_price float [not null, note: "Optional discount price."]
  unit varchar [not null, note: "Measurement unit (e.g., kg, lb, bunch)."]
  stock integer [not null, default: 0, note: "Available quantity in stock."]
  image_url varchar [not null, note: 'product image']
  status product_status [not null, note: "Product availability."]

  vendor uuid [not null, note: "The vendor selling this product."]
  category uuid [not null, note: "Category the product belongs to."]
  order_itmes uuid [null, note: 'Each order contains multiple products.']

  createDate timestamp
  updateDate timestamp
}

export enum OrderStatus {
  PENDING = 'pending',          // Order has been placed but not yet processed
  CONFIRMED = 'confirmed',      // Order has been confirmed by the vendor
  SHIPPED = 'shipped',          // Order has been shipped to the customer
  DELIVERED = 'delivered',      // Order has been successfully delivered
  CANCELLED = 'cancelled',      // Order was canceled before fulfillment
  RETURNED = 'returned',        // Customer returned the order
  REFUNDED = 'refunded',        // Payment has been refunded
}
Ref: user.orders < orders.user
Ref: vendors.orders < orders.vendor
Ref: orders.address - addresses.id
Table orders {
// The orders table will store customer purchases, tracking their status from placement to delivery.
  id uuid [pk, not null]
  user uuid [not null, note: "Customer who placed the order."]
  vendor uuid [not null, note: "The vendor fulfilling the order."]
  address uuid [not null, note: "Shipping/delivery address."]
  order_items uuid [not null, note: "An order contains multiple items."]

  total_price float [not null, note: "Final amount (including discounts & delivery fees)."]
  status varchar

  createDate timestamp
  updateDate timestamp
}

Ref: orders.order_items < order_items.order
Ref: order_items.product - products.id
Table order_items {
  id uuid [pk, not null]

  order uuid [not null, note: "Reference to the order."]
  product uuid [not null, note: 'The purchased product.']

  price float [not null, note: "Price per unit at purchase time."]
  quantity integer [not null, note: "Number of units ordered."]
  sub_total float [not null, note: "price * quantity."]

  createDate timestamp
  updateDate timestamp
}

enum payment_status {
  pending
  paid
}
Ref: payments.order - orders.id // One-to-One (orders → payments) → Each order has one payment record.
Ref: payments.user > user.id // One-to-Many (users → payments) → A user can have multiple payments.
Ref: payments.vendor > vendors.id // One-to-Many (vendors → payments) → Vendors receive multiple payments.
Table payments {
  id uuid [pk, not null]
  order uuid [not null, note: "The order linked to this payment"]
  user uuid [not null, note: "The customer making the payment."]
  vendor uuid [not null, note: "The vendor receiving the payment."]

  amount float [not null, note: "Total amount paid."]
  payment_status payment_status [not null, note: "Status of the payment."]
  transaction_id varchar [not null, note: 'External payment gateway transaction ID.']

  createDate timestamp
  updateDate timestamp
}

// Table shipping_addresses {
//   id uuid [pk, not null]
// }

/*
1. Main Categories & Subcategories
🍎 Fruits

    Citrus Fruits → Oranges, Lemons, Limes, Grapefruits
    Berries → Strawberries, Blueberries, Raspberries, Blackberries
    Tropical Fruits → Mangoes, Pineapples, Bananas, Papayas
    Stone Fruits → Peaches, Cherries, Plums, Apricots
    Melons → Watermelon, Cantaloupe, Honeydew

🥕 Vegetables

    Leafy Greens → Spinach, Kale, Lettuce, Cabbage
    Root Vegetables → Carrots, Potatoes, Beets, Radishes
    Cruciferous Vegetables → Broccoli, Cauliflower, Brussels Sprouts
    Gourds & Squashes → Pumpkin, Zucchini, Butternut Squash
    Alliums → Onions, Garlic, Leeks, Shallots

🥛 Dairy & Eggs

    Milk & Alternatives → Cow’s Milk, Almond Milk, Soy Milk
    Cheese → Cheddar, Mozzarella, Feta, Parmesan
    Eggs → Chicken Eggs, Duck Eggs, Quail Eggs
    Yogurt & Butter → Greek Yogurt, Plain Yogurt, Butter

🥩 Meat & Seafood (If applicable)

    Fresh Meat → Beef, Chicken, Lamb, Pork
    Seafood → Fish, Shrimp, Crab, Lobster

🍞 Grains & Staples

    Flour & Rice → White Rice, Brown Rice, Wheat Flour, Corn Flour
    Pasta & Noodles → Spaghetti, Macaroni, Ramen
    Bread & Bakery → Baguettes, Sandwich Bread, Whole Wheat

🛒 Organic & Specialty Foods

    Organic Fruits & Vegetables → Certified organic produce
    Gluten-Free Products → Gluten-free bread, pasta, flour
    Vegan & Plant-Based → Plant-based meat alternatives, Tofu
*/

```
