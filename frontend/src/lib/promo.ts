export interface PromoDefinition {
  label: string;
  percentage: number;
  minSubtotal?: number;
}

export interface PromoResult {
  success: boolean;
  message: string;
  discountAmount: number;
  code?: string;
}

export const PROMO_CODES: Record<string, PromoDefinition> = {
  SWEET10: { label: "Giảm 10%", percentage: 10 },
  BOULANGERIE15: { label: "Giảm 15%", percentage: 15, minSubtotal: 500000 },
};

export function validatePromoCode(rawCode: string, subtotal: number): PromoResult {
  const normalizedCode = rawCode.trim().toUpperCase();
  if (!normalizedCode) {
    return { success: false, message: "Vui lòng nhập mã giảm giá.", discountAmount: 0 };
  }

  const promo = PROMO_CODES[normalizedCode];
  if (!promo) {
    return {
      success: false,
      message: "Mã giảm giá không hợp lệ hoặc đã hết hạn.",
      discountAmount: 0,
    };
  }

  if (promo.minSubtotal && subtotal < promo.minSubtotal) {
    return {
      success: false,
      message: `Đơn hàng tối thiểu ${promo.minSubtotal.toLocaleString("vi-VN")}₫ để dùng mã này.`,
      discountAmount: 0,
    };
  }

  return {
    success: true,
    code: normalizedCode,
    message: `Đã áp dụng ${promo.label}.`,
    discountAmount: Math.round((subtotal * promo.percentage) / 100),
  };
}
