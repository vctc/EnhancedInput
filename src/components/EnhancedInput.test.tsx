import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
// import "@testing-library/jest-dom/extend-expect";
import EnhancedInput from "./EnhancedInput";

describe("EnhancedInput", () => {
  it("renders without crashing", () => {
    render(<EnhancedInput />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("updates text when typing", () => {
    render(<EnhancedInput />);
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "Hello, world!" } });
    expect(textarea).toHaveValue("Hello, world!");
  });

  it("shows character count", () => {
    render(<EnhancedInput maxLength={50} />);
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "Hello, world!" } });
    expect(screen.getByText("13/50")).toBeInTheDocument();
  });

  it("shows mention suggestions", async () => {
    render(<EnhancedInput />);
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "@f" } });
    await waitFor(() => {
      expect(screen.getByText("@french")).toBeInTheDocument();
    });
  });

  it("inserts mention when selected", async () => {
    render(<EnhancedInput />);
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "@f" } });
    await waitFor(() => {
      const suggestion = screen.getByText("@french");
      fireEvent.click(suggestion);
    });
    expect(textarea).toHaveValue("@french ");
  });

  it("handles multiple mentions", async () => {
    render(<EnhancedInput />);
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "@french Hello @s" } });
    await waitFor(() => {
      expect(screen.getByText("@sarah")).toBeInTheDocument();
    });
  });

  it("closes suggestion box on Escape key", async () => {
    render(<EnhancedInput />);
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "@f" } });
    await waitFor(() => {
      expect(screen.getByText("@french")).toBeInTheDocument();
    });
    fireEvent.keyDown(textarea, { key: "Escape" });
    await waitFor(() => {
      expect(screen.queryByText("@french")).not.toBeInTheDocument();
    });
  });

  it("navigates suggestions with arrow keys", async () => {
    render(<EnhancedInput />);
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "@f" } });
    await waitFor(() => {
      expect(screen.getByText("@french")).toBeInTheDocument();
    });
    fireEvent.keyDown(textarea, { key: "ArrowDown" });
    fireEvent.keyDown(textarea, { key: "Enter" });
    expect(textarea).toHaveValue("@french ");
  });
});
