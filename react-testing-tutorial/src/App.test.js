import { render, fireEvent, screen } from "@testing-library/react";
import Counter from "./App.js";

//test block
test("increments counter", () => {
  // render the component on virtual dom
  render(<Counter />);
  //select the elements you want to interact with
  const counter = screen.getByTestId("counter");
  const incrementBtn = screen.getByTestId("increment");
  //interact with those elements
  fireEvent.click(incrementBtn);
  //assert the expected result
  expect(counter).toHaveTextContent("1");
});

test("decrements counter", () => {
  // render this component again just to be sure test is launched from the default state
  render(<Counter />);
  //now we select decrement button
  const counter = screen.getByTestId("counter");
  const decrementBtn = screen.getByTestId("decrement");
  fireEvent.click(decrementBtn);
  //assert the expected result
  expect(counter).toHaveTextContent("0");
});