import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import React from "react";
import { Route } from "@/routes/index";

describe("Full Page Render", () => {
  it("renders without throwing an error", () => {
    // Set unlocked in sessionStorage
    sessionStorage.setItem("unlocked", "true");
    const IndexComponent = Route.options.component;
    if (!IndexComponent) throw new Error("Index component not found");
    const { container } = render(React.createElement(IndexComponent));
    expect(container).toBeDefined();
  });
});
