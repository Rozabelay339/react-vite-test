import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Counter from "../components/Counter"; 

describe("Counter-komponenten", () => {
  test("visar från 0 när den börjar", () => {
    render(<Counter />);
    const value = screen.getByTestId("counter-value");
    expect(value).toHaveTextContent("Värde: 0");
  });

  test("ökar värdet med 1 efter ett klick", () => {
    render(<Counter />);
    const button = screen.getByText("Öka");
    fireEvent.click(button);
    const value = screen.getByTestId("counter-value");
    expect(value).toHaveTextContent("Värde: 1");
  });
});
