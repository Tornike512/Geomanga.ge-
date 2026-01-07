import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Avatar } from "./avatar";

describe("Avatar", () => {
  it("renders with default size", () => {
    render(<Avatar src="/test-avatar.png" alt="Test User" />);
    const avatar = screen.getByAltText("Test User");
    expect(avatar).toBeInTheDocument();
  });

  it("renders with custom size", () => {
    render(<Avatar src="/test-avatar.png" alt="Test User" size="lg" />);
    const avatar = screen.getByAltText("Test User");
    expect(avatar).toBeInTheDocument();
  });

  it("renders fallback when no src provided", () => {
    render(<Avatar alt="Test User" />);
    const avatar = screen.getByAltText("Test User");
    expect(avatar).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <Avatar
        src="/test-avatar.png"
        alt="Test User"
        className="custom-class"
      />,
    );
    const avatarContainer = container.querySelector(".custom-class");
    expect(avatarContainer).toBeInTheDocument();
  });
});
