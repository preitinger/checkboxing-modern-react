import { render, screen, within } from '@testing-library/react';
// import {act, Simulate} from 'react-dom/test-utils'; // ES6
// import ReactTestUtils from 'react-dom/test-utils'; // ES6
import userEvent from '@testing-library/user-event'
import App from './App';

function firstInRow(row) {
  return row * (row + 1) / 2;
}

function enterSettings() {
  userEvent.click(screen.getByText(/Einstellungen/));
}


describe("App", () => {
  it("lets users set number of rows", () => {
    render(<App/>);
    enterSettings();

    expect(screen.getByLabelText(/Zeilen/)).toBeInTheDocument();
    userEvent.type(screen.getByLabelText(/Zeilen/), "{backspace}7");
    expect(screen.getByLabelText(/Zeilen/)).toHaveValue(7)
  });

  it("lets users set if player 1 is a bot", () => {
    render(<App/>);
    enterSettings();
    expect(screen.getByLabelText(/Computer.*1/)).not.toBeChecked();
    userEvent.click(screen.getByLabelText(/Computer.*1/));
    expect(screen.getByLabelText(/Computer.*1/)).toBeChecked();
  })

  it("lets users set if player 2 is a bot", () => {
    render(<App/>);
    enterSettings();
    expect(screen.getByLabelText(/Computer.*2/)).toBeChecked();
    userEvent.click(screen.getByLabelText(/Computer.*2/));
    expect(screen.getByLabelText(/Computer.*2/)).not.toBeChecked();
  });

  it("lets users start a new game with previously selected settings", () => {
    render(<App/>);
    enterSettings();
    userEvent.type(screen.getByLabelText(/Zeilen/), "{backspace}6");
    expect(screen.getByLabelText(/Zeilen/)).toHaveValue(6);
    userEvent.click(screen.getByText(/start/i));
    throw Error("nyi");
  });



});
