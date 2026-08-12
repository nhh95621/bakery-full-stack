# Bakery Fullstack - Project TODO

## Database & Backend
- [x] Thiết lập schema database (products, orders, order_items, favorites, users)
- [x] Tạo migration SQL và apply vào database
- [x] Viết query helpers trong server/db.ts
- [x] Tạo tRPC routers cho products (list, get, create, update, delete)
- [x] Tạo tRPC routers cho orders (create, list, update status)
- [x] Tạo tRPC routers cho favorites (add, remove, list)
- [x] Wire CRUD APIs vào frontend (admin panel, home page)

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
- [x] Tích hợp cart state management (useState + tRPC mutations)
- [x] Tạo cart total calculation

## Frontend - Checkout Flow
- [x] Tạo CheckoutPage với form (name, phone, address, notes)
- [x] Tạo order confirmation page
- [x] Tạo order status display
- [x] Tích hợp orders.create API
- [x] Tích hợp orders.list API cho order history
- [x] Protect checkout route (require authentication)

## Frontend - User Account
- [x] Tạo Account page (order history, favorites)
- [x] Hiển thị lịch sử đơn hàng
- [x] Hiển thị danh sách yêu thích
- [x] Tích hợp favorites.list, favorites.add, favorites.remove APIs
- [x] Tích hợp auth.me API để lấy user info

## Frontend - Admin Panel
- [x] Tạo AdminPanel page
- [x] Tạo ProductManagement table (add/edit/delete)
- [x] Tạo OrderManagement table (status update)
- [x] Tạo role-based access control (check user.role === 'admin')
- [x] Tích hợp products CRUD APIs (create, update, delete)
- [x] Tích hợp orders update status API

## Authentication & User Features
- [x] Tích hợp Manus OAuth login (useAuth hook sẵn có)
- [x] Tạo login button và logout button (Header component)
- [x] Lưu user info từ OAuth vào database (backend sẵn có)
- [x] Tạo useAuth hook để quản lý auth state (sẵn có)
- [x] Bảo vệ protected routes (checkout, account, admin)

## Styling & Responsive Design
- [x] Cập nhật Tailwind config với color palette
- [x] Tạo responsive breakpoints (mobile, tablet, desktop)
- [x] Tạo animations cho drawer, modal, transitions
- [x] Kiểm tra responsive trên mobile (375px), tablet (768px), desktop (1280px)

## Testing & Deployment
- [x] Seed sample data (8 sản phẩm)
- [x] Test responsive design trên mobile (375px), tablet (768px), desktop (1280px)
- [x] Full page screenshot - trang chủ hiển thị đầy đủ 8 sản phẩm
- [x] Admin panel hiển thị đầy đủ products table
- [x] Account page với order history và favorites
- [x] Wire favorites.add/remove với loading state
- [x] Protect checkout route (require authentication)
- [x] Test toàn bộ luồng mua sắm (browse → detail → cart → checkout → confirm)
- [x] Test admin panel CRUD operations
- [x] Test authentication (login, logout, protected routes)
- [x] Tạo checkpoint cuối cùng
- [x] Chuẩn bị dự án sẵn sàng để publish trong Management UI (người dùng cần nhấp Publish)

## Enhancements - Toast, Promo Code & Auto-suggest
- [x] Thêm toast notification đẹp mắt khi thêm sản phẩm vào giỏ hàng
- [x] Thêm toast notification khi đánh dấu hoặc bỏ đánh dấu yêu thích
- [x] Thêm nhập và áp dụng promo code trong CartDrawer
- [x] Tính lại giảm giá, phí vận chuyển và tổng thanh toán sau khi áp dụng promo code
- [x] Thêm tìm kiếm auto-suggest trên Header dựa trên sản phẩm hiện có
- [x] Điều hướng từ gợi ý tìm kiếm đến đúng sản phẩm hoặc lọc danh sách
- [x] Kiểm thử responsive và kiểm tra TypeScript/build cho các tính năng mới (pnpm check, pnpm test, pnpm build; mobile, tablet, desktop)
- [x] Lưu checkpoint sau khi hoàn tất enhancements (version 37cab9c4)

## Header Layout Refinement
- [x] Đưa logo Boulangerie lên hàng riêng phía trên điều hướng và các thao tác Header
- [x] Kiểm tra responsive desktop, tablet và mobile sau khi chỉnh bố cục (1280px, 768px, 375px)
- [x] Lưu checkpoint cho thay đổi Header (version 9ab4639b)

## About Page
- [x] Xây dựng trang Về Chúng Tôi với câu chuyện thương hiệu và giá trị cốt lõi
- [x] Thêm các khối nội dung về nguyên liệu, quy trình thủ công và lời mời trải nghiệm
- [x] Kết nối điều hướng Header đến route Về Chúng Tôi
- [x] Kiểm tra responsive và TypeScript cho trang mới (desktop 1280px, mobile 375px; pnpm check và pnpm test gồm 6 tests)
- [x] Lưu checkpoint cho trang Về Chúng Tôi (version 025889c2)

## Visual Redesign - Artemis-inspired Direction
- [x] Phân tích ngôn ngữ thị giác của Artemis Pastry và xác định nguyên tắc có thể áp dụng hợp pháp
- [x] Thiết lập bảng màu và lớp nền giàu chiều sâu cho Boulangerie
- [x] Nâng cấp hero, danh mục, product card, Header và các CTA theo thiết kế mới
- [x] Đồng bộ lại trang Về Chúng Tôi, giỏ hàng và các bề mặt thương hiệu chính
- [x] Kiểm tra responsive, TypeScript, unit tests và production build (mobile 375px, desktop 1280px; 6 tests pass)
- [ ] Lưu checkpoint cho bản thiết kế nâng cấp
