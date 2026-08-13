// @vitest-environment jsdom
import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError, ApiLoading } from "../../../frontend/src/components/ApiFeedback";

afterEach(cleanup);

describe("ApiFeedback components", () => {
  it("renders the accessible loading state with the supplied context", () => {
    render(<ApiLoading label="Đang tải lịch sử đơn hàng" />);

    expect(screen.getByRole("status").textContent).toContain("Đang tải lịch sử đơn hàng");
  });

  it("renders error copy and calls onRetry when the customer retries", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    render(<ApiError title="Không thể tải đơn hàng" description="Hãy thử lại sau ít phút." onRetry={onRetry} />);

    expect(screen.getByRole("alert").textContent).toContain("Không thể tải đơn hàng");
    expect(screen.getByText("Hãy thử lại sau ít phút.")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "Thử lại" }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
