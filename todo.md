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
- [x] Lưu checkpoint cho bản thiết kế nâng cấp (version 7bd009d4)

## Dedicated Product Catalogue
- [x] Phân tích cấu trúc catalogue sản phẩm từ website tham chiếu và xác định nguyên tắc áp dụng
- [x] Tạo route và Trang Sản Phẩm độc lập với hero catalogue, bộ lọc, tìm kiếm và product grid
- [x] Kết nối category, tìm kiếm, quick view, giỏ hàng và yêu thích trên Trang Sản Phẩm
- [x] Điều chỉnh Trang chủ thành landing page thương hiệu, không lặp lại catalogue đầy đủ
- [x] Cập nhật điều hướng và CTA tới Trang Sản Phẩm mới
- [x] Kiểm tra responsive, TypeScript, unit tests và production build (desktop 1280px, mobile 375px; 6 tests pass)
- [x] Lưu checkpoint cho trải nghiệm catalogue mới (version 885cb4c7)

## Catalogue Filters, Verified Reviews & Reusable Skill
- [x] Rà soát và hoàn thiện mini-cart drawer trượt từ cạnh phải
- [x] Thêm lọc theo khoảng giá trên Trang Sản Phẩm
- [x] Thêm sắp xếp theo giá tăng, giá giảm và bán chạy nhất
- [x] Tạo schema và tRPC API cho đánh giá khách hàng xác thực, không seed dữ liệu giả
- [x] Tạo carousel đánh giá trên Trang chủ với fallback khi chưa có đánh giá được xác minh
- [x] Bổ sung trạng thái lỗi an toàn cho truy vấn carousel đánh giá
- [x] Đóng gói quy trình nâng cấp storefront thành kỹ năng tái sử dụng
- [x] Kiểm tra responsive, TypeScript, unit tests và production build
- [x] Lưu checkpoint cho các tính năng mới (version 809c2f57)

## Personal Profile, Catalogue Motion & Cart Recommendations
- [x] Xây dựng trang hồ sơ khách hàng hiển thị thông tin tài khoản, lịch sử đơn hàng và đánh giá đã gửi
- [x] Bổ sung API tRPC chỉ dành cho chủ tài khoản để liệt kê đánh giá đã gửi và trạng thái duyệt
- [x] Thêm chuyển tiếp mượt, tôn trọng reduced-motion, cho kết quả lọc và sắp xếp catalogue
- [x] Xây dựng gợi ý sản phẩm theo danh mục hàng trong giỏ, loại trừ các sản phẩm đã có
- [x] Thêm unit tests và kiểm thử responsive cho các tính năng hồ sơ, chuyển tiếp và gợi ý
- [x] Lưu checkpoint bàn giao các tính năng cá nhân hoá mới (version 280f2941)
- [x] Rà soát mã hồ sơ và API đánh giá theo chủ tài khoản, gồm quyền truy cập và mọi trạng thái dữ liệu
- [x] Rà soát reduced-motion cho chuyển tiếp catalogue và các trường hợp biên của thuật toán gợi ý
- [x] Bổ sung kiểm thử đơn vị cụ thể cho phạm vi hồ sơ và hành vi chuyển tiếp catalogue
- [x] Bổ sung trạng thái lỗi rõ ràng cho dữ liệu đơn hàng, đánh giá và yêu thích trong hồ sơ

## GitHub Export
- [x] Kiểm tra quyền truy cập và cấu hình GitHub cho dự án
- [x] Xuất mã nguồn mới nhất, bao gồm checkpoint 280f2941, lên kho GitHub của người dùng
- [x] Xác minh remote, nhánh đích và liên kết kho mã sau khi đẩy
- [x] Kết nối kho đích https://github.com/nhh95621/bakery-full-stack và đẩy nhánh main
- [x] Đẩy lại nhánh main sau khi quyền ghi GitHub được cập nhật
- [x] Thử xác minh quyền ghi GitHub sau khi người dùng làm mới token
- [x] Xác minh commit GitHub chứa checkpoint 280f2941 và đồng bộ trạng thái cây làm việc cuối

## Source Structure Refactor
- [x] Lập bản đồ import và cấu hình hiện tại trước khi tách frontend và backend
- [x] Di chuyển ứng dụng giao diện sang thư mục frontend và cập nhật Vite, TypeScript
- [x] Di chuyển ứng dụng máy chủ sang thư mục backend và cập nhật entrypoint, imports
- [x] Khởi động lại development server và xác nhận không còn lỗi Vite/runtime theo đường dẫn client cũ
- [x] Xác minh backend entrypoint mới khởi động và phục vụ frontend sau tái cấu trúc
- [x] Phân loại kiểm thử vào tests/frontend và tests/backend, giữ Vitest hoạt động
- [x] Bổ sung docs, scripts, README, LICENSE và GitHub Actions CI theo cấu trúc mới
- [x] Xác minh development server, TypeScript, unit tests và production build sau tái cấu trúc
- [x] Lưu checkpoint tái cấu trúc mới (version facc6190) và đồng bộ cấu trúc lên GitHub
- [x] Commit thay đổi tái cấu trúc frontend-backend sau checkpoint facc6190 và đẩy lên GitHub
- [x] Xác minh remote GitHub chứa commit tái cấu trúc mới nhất trên nhánh main
- [x] Kiểm tra log development server chỉ sau lần restart cuối để xác nhận không còn lỗi `/src/main.tsx` hoặc tham chiếu `client/` cũ
- [x] Mở lại `/` và `/products` sau restart rồi xác minh log mới nhất không phát sinh lỗi Vite/pre-transform

## API Feedback, Profile & Catalogue UX
- [x] Rà soát các truy vấn và mutation tRPC hiện có để xác định trạng thái tải, lỗi và thử lại còn thiếu
- [x] Bổ sung loading, error state và retry rõ ràng cho các luồng API storefront chính
- [x] Hoàn thiện trang hồ sơ với lịch sử đơn hàng của chính tài khoản đăng nhập
- [x] Hoàn thiện lọc catalogue theo danh mục và khoảng giá, cùng sắp xếp theo giá/phổ biến
- [x] Bổ sung hoặc cập nhật unit tests cho trạng thái API và logic catalogue
- [x] Xác minh TypeScript, unit tests, production build và responsive rồi lưu checkpoint
- [x] Khôi phục entry HTML frontend và xóa lỗi Vite runtime phát sinh sau tái cấu trúc
- [x] Xác minh và khắc phục nếu trang hồ sơ duy trì trạng thái tải sau khi truy vấn API hoàn tất
- [x] Chỉ gọi lịch sử đơn hàng, yêu thích và đánh giá sau khi hồ sơ xác thực đã sẵn sàng
- [x] Thêm kiểm thử cho trạng thái loading, error và retry của phản hồi API, cùng điều kiện chặn truy vấn hồ sơ
- [x] Lưu bằng chứng log runtime sạch sau restart không còn lỗi `/src/main.tsx` hoặc `frontend/index.html`
- [x] Thêm kiểm thử tương tác cho loading, error và callback retry của component phản hồi API
- [x] Lưu checkpoint riêng cho cải tiến API, hồ sơ và catalogue UX

## Order Tracking, Catalogue Pagination & Shopify Checkout
- [x] Rà soát mô hình đơn hàng, catalogue và checkout hiện có trước khi mở rộng
- [x] Cấu hình storefront Shopify và rà soát hợp đồng tRPC commerce được cung cấp
- [x] Hoàn tất đồng bộ toàn catalogue/variant hiện có với Shopify để mọi sản phẩm đều có thể checkout
- [x] Giữ catalogue và giỏ hàng storefront hiện có, đồng thời map toàn bộ sản phẩm sang Shopify để checkout không giới hạn ở sản phẩm preview
- [x] Bổ sung kiểm thử và xác minh runtime cho redirect checkout Shopify, mixed cart và lỗi người dùng
- [x] Xây dựng trang chi tiết đơn hàng có timeline giao nhận trực quan, bảo vệ theo chủ tài khoản
- [x] Liên kết lịch sử đơn hàng đến trang chi tiết và xử lý loading, lỗi, trạng thái trống
- [x] Bổ sung phân trang và nút Tải thêm cho catalogue, giữ tương thích với lọc/sắp xếp/tìm kiếm
- [x] Bổ sung kiểm thử owner-only trực tiếp cho truy vấn chi tiết đơn hàng, rồi hoàn tất bộ kiểm thử các luồng mới
- [x] Xác minh TypeScript, tests, build, runtime và responsive; lưu checkpoint rồi đồng bộ GitHub

## Frontend / Backend Structure Cleanup
- [x] Kiểm kê tệp mã nguồn còn nằm ngoài `frontend/` và `backend/`
- [x] Di chuyển hoặc loại bỏ scaffold cũ, đồng thời cập nhật mọi import, script và cấu hình liên quan
- [x] Xác minh build, tests, runtime và tài liệu phản ánh cấu trúc hai khối chuẩn
- [ ] Lưu checkpoint và đồng bộ cấu trúc mới lên GitHub
- [ ] Lưu checkpoint riêng cho đợt frontend/backend structure cleanup sau khi xoá `client/` và cập nhật tài liệu
- [ ] Chạy `git status`, commit các thay đổi cleanup cấu trúc rồi push lên GitHub để đồng bộ trạng thái mới
