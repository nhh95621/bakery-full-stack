import { ChefHat, Heart, Leaf } from "lucide-react";

export const ABOUT_VALUES = [
  {
    icon: Leaf,
    title: "Nguyên liệu có chủ đích",
    description: "Chúng tôi ưu tiên hương vị nguyên bản, kết cấu cân bằng và những nguyên liệu được chọn lọc theo mùa.",
  },
  {
    icon: ChefHat,
    title: "Thủ công trong từng lớp bánh",
    description: "Mỗi công đoạn được chăm chút để vị ngọt, độ giòn và sự mềm mượt chạm đến đúng khoảnh khắc cần có.",
  },
  {
    icon: Heart,
    title: "Dành cho những dịp đáng nhớ",
    description: "Từ chiếc tart của buổi chiều bình dị đến entremet cho một bữa tiệc, chúng tôi làm bánh để lưu giữ cảm xúc.",
  },
] as const;

export const ABOUT_CTA_PATH = "/#products";
