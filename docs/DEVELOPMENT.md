# Hướng dẫn phát triển

## Yêu cầu

Dùng Node.js 22 và pnpm 10. Cấu hình runtime được Manus cung cấp qua environment variables; không tạo hoặc commit tệp `.env`.

## Lệnh thường dùng

| Lệnh | Mục đích |
|---|---|
| `pnpm dev` | Chạy Express và Vite ở môi trường phát triển. |
| `pnpm check` | Kiểm tra TypeScript không phát sinh file build. |
| `pnpm test` | Chạy Vitest trong `tests/frontend` và `tests/backend`. |
| `pnpm build` | Tạo bundle Vite và bundle backend cho production. |
| `pnpm verify` | Chạy tuần tự type check, unit tests và production build. |
| `pnpm db:push` | Tạo migration Drizzle và áp dụng migration. |

## Quy trình thay đổi dữ liệu

Khi thay đổi schema, cập nhật `backend/db/schema.ts`, tạo migration bằng Drizzle và rà soát SQL trước khi áp dụng. Tiếp theo, thêm helper trong `backend/db.ts`, procedure trong `backend/routers.ts`, và cuối cùng sử dụng tRPC client từ frontend.

## Kiểm thử

Đặt kiểm thử UI và logic trình duyệt trong `tests/frontend/`; đặt kiểm thử procedure, auth và hành vi máy chủ trong `tests/backend/`. Mỗi thay đổi nghiệp vụ mới cần có ít nhất một kiểm thử phù hợp hoặc cập nhật kiểm thử hiện hữu.
