import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@/tests";
import type { DropdownOption } from "./dropdown";
import { Dropdown } from "./dropdown";

const mockOptions: DropdownOption[] = [
  { value: "", label: "All status" },
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
  { value: "hiatus", label: "Hiatus" },
];

describe("Dropdown", () => {
  it("renders correctly with placeholder", () => {
    render(
      <Dropdown
        options={mockOptions}
        value=""
        onChange={() => {}}
        placeholder="Select status"
      />,
    );

    const trigger = screen.getByRole("button");
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveTextContent("All status");
  });

  it("opens dropdown menu when clicked", async () => {
    render(
      <Dropdown
        options={mockOptions}
        value=""
        onChange={() => {}}
        placeholder="Select status"
      />,
    );

    const trigger = screen.getByRole("button");
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });

    expect(screen.getAllByRole("option")).toHaveLength(mockOptions.length);
  });

  it("calls onChange when option is selected", async () => {
    const handleChange = vi.fn();
    render(
      <Dropdown
        options={mockOptions}
        value=""
        onChange={handleChange}
        placeholder="Select status"
      />,
    );

    const trigger = screen.getByRole("button");
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });

    const option = screen.getByRole("option", { name: "Ongoing" });
    fireEvent.click(option);

    expect(handleChange).toHaveBeenCalledWith("ongoing");
  });

  it("closes dropdown after selection", async () => {
    const handleChange = vi.fn();
    render(
      <Dropdown
        options={mockOptions}
        value=""
        onChange={handleChange}
        placeholder="Select status"
      />,
    );

    const trigger = screen.getByRole("button");
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });

    const option = screen.getByRole("option", { name: "Completed" });
    fireEvent.click(option);

    await waitFor(() => {
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
  });

  it("displays selected value", () => {
    render(
      <Dropdown
        options={mockOptions}
        value="completed"
        onChange={() => {}}
        placeholder="Select status"
      />,
    );

    const trigger = screen.getByRole("button");
    expect(trigger).toHaveTextContent("Completed");
  });

  it("shows checkmark on selected option", async () => {
    render(
      <Dropdown
        options={mockOptions}
        value="completed"
        onChange={() => {}}
        placeholder="Select status"
      />,
    );

    const trigger = screen.getByRole("button");
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });

    const selectedOption = screen.getByRole("option", { selected: true });
    expect(selectedOption).toHaveTextContent("Completed");
  });

  it("respects disabled state", () => {
    render(
      <Dropdown
        options={mockOptions}
        value=""
        onChange={() => {}}
        disabled
        placeholder="Select status"
      />,
    );

    const trigger = screen.getByRole("button");
    expect(trigger).toBeDisabled();
  });

  it("handles keyboard navigation - ArrowDown opens dropdown", async () => {
    render(
      <Dropdown
        options={mockOptions}
        value=""
        onChange={() => {}}
        placeholder="Select status"
      />,
    );

    const trigger = screen.getByRole("button");
    trigger.focus();

    fireEvent.keyDown(trigger, { key: "ArrowDown" });

    await waitFor(() => {
      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });
  });

  it("handles keyboard navigation - Escape closes dropdown", async () => {
    render(
      <Dropdown
        options={mockOptions}
        value=""
        onChange={() => {}}
        placeholder="Select status"
      />,
    );

    const trigger = screen.getByRole("button");
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });

    fireEvent.keyDown(trigger, { key: "Escape" });

    await waitFor(() => {
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
  });

  it("handles keyboard navigation - Enter selects highlighted option", async () => {
    const handleChange = vi.fn();
    render(
      <Dropdown
        options={mockOptions}
        value=""
        onChange={handleChange}
        placeholder="Select status"
      />,
    );

    const trigger = screen.getByRole("button");
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });

    // Navigate down once to highlight first option (index 0), then again to "Ongoing" (index 1)
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    fireEvent.keyDown(trigger, { key: "Enter" });

    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith("ongoing");
    });
  });

  it("closes dropdown when clicking outside", async () => {
    render(
      <div>
        <Dropdown
          options={mockOptions}
          value=""
          onChange={() => {}}
          placeholder="Select status"
        />
        <button type="button">Outside button</button>
      </div>,
    );

    const trigger = screen.getByRole("button");
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });

    fireEvent.mouseDown(screen.getByText("Outside button"));

    await waitFor(() => {
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
  });

  it("accepts custom className", () => {
    render(
      <Dropdown
        options={mockOptions}
        value=""
        onChange={() => {}}
        className="custom-class"
      />,
    );

    const container = screen.getByRole("button").parentElement;
    expect(container).toHaveClass("custom-class");
  });

  it("supports aria-label", () => {
    render(
      <Dropdown
        options={mockOptions}
        value=""
        onChange={() => {}}
        aria-label="Status filter"
      />,
    );

    const trigger = screen.getByRole("combobox", { name: "Status filter" });
    expect(trigger).toBeInTheDocument();
  });

  it("has proper aria-expanded attribute", async () => {
    render(
      <Dropdown
        options={mockOptions}
        value=""
        onChange={() => {}}
        placeholder="Select status"
      />,
    );

    const trigger = screen.getByRole("button");
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(trigger);

    await waitFor(() => {
      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });
  });
});
