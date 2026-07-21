# Bakery Fullstack - Project TODO

## Database & Backend
- [x] Thiết lập schema database (products, orders, order_items, favorites, users)
- [x] Tạo migration SQL và apply vào database
- [x] Viết query helpers trong server/db.ts
- [x] Tạo tRPC routers cho products (list, get, create, update, delete)
- [x] Tạo tRPC routers cho orders (create, list, update status)
- [x] Tạo tRPC routers cho favorites (add, remove, list)
- [ ] Viết unit tests cho backend APIs

## Frontend - Layout & Navigation
- [x] Cập nhật global styles (Bodoni Moda font, color palette từ thiết kế)
- [x] Tạo Header component với logo, search, cart icon, user menu
- [x] Tạo Footer component
- [x] Cấu hình routing trong App.tsx

## Frontend - Product Catalog
- [x] Tạo Home page với banner hero
- [x] Tạo category filter (Entremet, Tart, Macaron, Theo Mùa)
- [x] Tạo search functionality
- [x] Tạo ProductCard component (image, name, price, rating, tags, add to cart, like button)
- [x] Tạo product grid layout
- [x] Tích hợp API products.list vào product grid

## Frontend - Product Detail & Cart
- [x] Tạo ProductDetailModal component (image, description, size selector, quantity, add to cart)
- [x] Tạo CartDrawer component (slide from right, item list, quantity controls, remove button)
- [x] Tạo free shipping progress bar
- [ ] Tích hợp cart state management (useState + tRPC mutations)
- [x] Tạo cart total calculation

## Frontend - Checkout Flow
- [x] Tạo CheckoutPage với form (name, phone, address, notes)
- [x] Tạo order confirmation page
- [x] Tạo order status display
- [x] Tích hợp orders.create API
- [ ] Tích hợp orders.list API cho order history

## Frontend - User Account
- [ ] Tạo UserAccount page (order history, favorites)
- [ ] Tạo Favorites page
- [ ] Tích hợp favorites.list, favorites.add, favorites.remove APIs
- [ ] Tích hợp auth.me API để lấy user info

## Frontend - Admin Panel
- [x] Tạo AdminPanel page
- [x] Tạo ProductManagement table (add/edit/delete)
- [x] Tạo OrderManagement table (status update)
- [x] Tạo role-based access control (check user.role === 'admin')
- [ ] Tích hợp products CRUD APIs
- [ ] Tích hợp orders update status API

## Authentication & User Features
- [ ] Tích hợp Manus OAuth login
- [ ] Tạo login button và logout button
- [ ] Lưu user info từ OAuth vào database
- [ ] Tạo useAuth hook để quản lý auth state
- [ ] Bảo vệ protected routes (checkout, account, admin)

## Styling & Responsive Design
- [x] Cập nhật Tailwind config với color palette
- [x] Tạo responsive breakpoints (mobile, tablet, desktop)
- [x] Tạo animations cho drawer, modal, transitions
- [ ] Kiểm tra responsive trên mobile (375px), tablet (768px), desktop (1280px)

## Testing & Deployment
- [ ] Test toàn bộ luồng mua sắm (browse → detail → cart → checkout → confirm)
- [ ] Test admin panel (add/edit/delete products, update order status)
- [ ] Test authentication (login, logout, protected routes)
- [ ] Test responsive design trên các devices
- [ ] Tạo checkpoint cuối cùng
- [ ] Publish project
