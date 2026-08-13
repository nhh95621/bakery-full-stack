# Boulangerie

Storefront thương mại điện tử cho tiệm bánh cao cấp, sử dụng React 19, Express 4, tRPC 11, Drizzle ORM và MySQL/TiDB. Dự án hỗ trợ catalogue có lọc/sắp xếp mượt, giỏ hàng và mã khuyến mãi, đơn hàng, yêu thích, đánh giá mua hàng xác thực, khu vực hồ sơ khách hàng và quản trị sản phẩm.

## Cấu trúc mã nguồn

```text
bakery-fullstack/
├── .github/                 # GitHub Actions và cấu hình cộng tác
├── backend/                 # Express, tRPC, OAuth, database và storage
│   ├── _core/               # Runtime và tích hợp hạ tầng
│   ├── config/              # Biên cấu hình backend
│   └── db/                  # Schema và migrations Drizzle
├── docs/                    # Kiến trúc và hướng dẫn phát triển
├── frontend/                # Ứng dụng React/Vite
│   ├── public/              # Tài nguyên cấu hình nhỏ
│   └── src/
│       ├── components/      # Thành phần tái sử dụng
│       ├── config/          # Cấu hình frontend
│       ├── pages/           # Route và màn hình
│       ├── services/        # tRPC và service client
│       ├── utils/           # Tiện ích tổng quát
│       └── main.tsx         # Entry point React
├── scripts/                 # Tự động hóa kiểm tra chất lượng
├── shared/                  # Kiểu và hằng số dùng chung
├── tests/                   # Unit tests frontend và backend
├── .gitignore               # Tệp không đưa vào Git
├── LICENSE                  # Giấy phép MIT
├── package.json             # Quản lý dependencies và scripts
└── README.md                # Tài liệu khởi đầu
```

## Khởi động nhanh

```bash
pnpm install
pnpm dev
```

Ứng dụng phát triển chạy qua entrypoint `backend/_core/index.ts`; Vite phục vụ giao diện từ `frontend/`.

## Kiểm tra chất lượng

```bash
pnpm check
pnpm test
pnpm build
# Hoặc chạy tất cả:
pnpm verify
```

Xem thêm [kiến trúc](docs/ARCHITECTURE.md) và [hướng dẫn phát triển](docs/DEVELOPMENT.md).
