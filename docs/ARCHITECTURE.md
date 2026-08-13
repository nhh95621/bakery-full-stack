# Kiến trúc hệ thống

## Tổng quan

Boulangerie là storefront thương mại điện tử xây dựng với **React**, **Express**, **tRPC**, **Drizzle ORM** và MySQL/TiDB. Cấu trúc tách riêng giao diện và máy chủ để giới hạn ranh giới trách nhiệm, đồng thời giữ các kiểu dùng chung trong `shared/`.

| Miền | Trách nhiệm | Điểm vào chính |
|---|---|---|
| `frontend/` | UI React, trạng thái giỏ hàng, tRPC client, thiết kế responsive | `frontend/src/main.tsx` |
| `backend/` | Express, tRPC router, OAuth, truy cập dữ liệu và storage | `backend/_core/index.ts` |
| `backend/db/` | Schema Drizzle và migration cơ sở dữ liệu | `backend/db/schema.ts` |
| `shared/` | Kiểu, hằng số và lỗi dùng cho cả hai miền | `shared/types.ts` |
| `tests/` | Kiểm thử độc lập theo ranh giới frontend/backend | `tests/**/*.test.ts` |

## Luồng dữ liệu

Giao diện gọi API bằng client tRPC trong `frontend/src/services/trpc.ts`. Các procedure trên `backend/routers.ts` kiểm tra phiên OAuth, điều phối các helper trong `backend/db.ts` rồi trả về kiểu dữ liệu đã được suy luận xuyên suốt. Schema và migrations được đặt trong `backend/db/` để mọi thay đổi dữ liệu nằm cùng miền backend.

## Quy ước thư mục

`frontend/src/components/` chỉ chứa thành phần giao diện tái sử dụng. `frontend/src/pages/` chứa các route. `frontend/src/lib/` chứa logic theo miền nghiệp vụ, trong khi `frontend/src/utils/` là điểm vào cho tiện ích tổng quát. `frontend/src/config/` và `frontend/src/services/` tách cấu hình trình duyệt khỏi kết nối dịch vụ.

Trong backend, `backend/_core/` chứa nền tảng runtime, xác thực và tích hợp hạ tầng; `backend/config/` là biên công khai cho cấu hình ứng dụng; `backend/db.ts` và `backend/routers.ts` chứa logic nghiệp vụ có thể thay đổi theo sản phẩm.

`frontend/` và `backend/` là **hai khối mã ứng dụng duy nhất**. Các thư mục gốc `docs/`, `tests/`, `scripts/` và `.github/` chỉ phục vụ tài liệu, kiểm thử, tự động hoá và cộng tác. `shared/` là lớp hợp đồng nhỏ cho kiểu, hằng số và lỗi được cả hai khối import; đây không phải một ứng dụng thứ ba. Không duy trì các thư mục mã nguồn cũ như `client/` hoặc `server/`.
