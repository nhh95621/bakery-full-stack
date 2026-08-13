export type OrderTimelineState = "complete" | "current" | "upcoming" | "cancelled";

export type OrderTimelineStep = {
  id: string;
  label: string;
  description: string;
  state: OrderTimelineState;
};

const standardSteps = [
  { id: "pending", label: "Đơn hàng đã được ghi nhận", description: "Boulangerie đã nhận yêu cầu của bạn." },
  { id: "confirmed", label: "Đơn hàng đã được xác nhận", description: "Thông tin giao nhận đang được kiểm tra." },
  { id: "processing", label: "Đang hoàn thiện", description: "Các lớp vị đang được chuẩn bị cẩn thận." },
  { id: "shipped", label: "Đang trên đường giao đến bạn", description: "Đơn hàng đã rời khỏi maison." },
  { id: "delivered", label: "Đã giao thành công", description: "Hy vọng bạn có một trải nghiệm thật ngọt ngào." },
] as const;

const stepIndex: Record<string, number> = Object.fromEntries(standardSteps.map((step, index) => [step.id, index]));

export function getOrderTimeline(status: string): OrderTimelineStep[] {
  if (status === "cancelled") {
    return standardSteps.map((step, index) => ({
      ...step,
      state: index === 0 ? "complete" : "cancelled",
    }));
  }

  const currentIndex = stepIndex[status] ?? 0;
  return standardSteps.map((step, index) => ({
    ...step,
    state: index < currentIndex ? "complete" : index === currentIndex ? "current" : "upcoming",
  }));
}

export const ORDER_STATUS_COPY: Record<string, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  processing: "Đang hoàn thiện",
  shipped: "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã huỷ",
};
