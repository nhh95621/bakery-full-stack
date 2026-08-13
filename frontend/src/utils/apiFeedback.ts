export type ApiFeedbackTone = "light" | "dark";

export const API_RETRY_LABEL = "Thử lại";

export function getLoadingLabel(label?: string) {
  return label || "Đang tải dữ liệu";
}

export function getFeedbackToneClasses(tone: ApiFeedbackTone) {
  return tone === "dark"
    ? { icon: "text-gold", panel: "border-primary-foreground/20 bg-primary-foreground/5 text-primary-foreground" }
    : { icon: "text-terracotta", panel: "border-terracotta/25 bg-terracotta/5 text-foreground" };
}
