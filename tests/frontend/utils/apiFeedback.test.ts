import { describe, expect, it } from "vitest";
import { API_RETRY_LABEL, getFeedbackToneClasses, getLoadingLabel } from "../../../frontend/src/utils/apiFeedback";

describe("API feedback helpers", () => {
  it("uses a helpful default loading label while allowing feature-specific labels", () => {
    expect(getLoadingLabel()).toBe("Đang tải dữ liệu");
    expect(getLoadingLabel("Đang tải lịch sử đơn hàng")).toBe("Đang tải lịch sử đơn hàng");
  });

  it("provides the retry label and distinct visual tones for light and dark surfaces", () => {
    expect(API_RETRY_LABEL).toBe("Thử lại");
    expect(getFeedbackToneClasses("light").panel).toContain("border-terracotta");
    expect(getFeedbackToneClasses("dark").panel).toContain("border-primary-foreground");
  });
});
