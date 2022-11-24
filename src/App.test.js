import { queryAllByRole, render, screen, within } from '@testing-library/react';
// import {act, Simulate} from 'react-dom/test-utils'; // ES6
// import ReactTestUtils from 'react-dom/test-utils'; // ES6
import userEvent from '@testing-library/user-event'
import {isInaccessable, logRoles} from '@testing-library/dom'
import App from './App';
import Msg from './components/Msg'

function firstInRow(row) {
  return row * (row + 1) / 2;
}

function enterSettings() {
  return userEvent.click(screen.getByText(/Einstellungen/));
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


describe("App", () => {
  beforeEach(() => {
    console.log("App.beforeEach");
    return render(<App/>);

  })
  describe("when editing settings", () => {
    beforeEach(() => {
      console.log("when editing settings - beforeEach");
      enterSettings();
    })
    it("lets users set number of rows", () => {
      // enterSettings();
      console.log(Msg.settings() + " ...", screen.queryByText(Msg.settings() + " ..."));
      expect(screen.queryByText(Msg.settings())).toBeInTheDocument(); // ansonsten sind Einstellungen hidden; das ist ja leider bei vererbung nicht mit toBeVisible() testbar! - entweder bug oder feature ;-)
      const zeilenElem = screen.getByLabelText(Msg.numRows());
      expect(screen.getByLabelText(Msg.numRows())).toBeVisible();
      expect(screen.getByLabelText(Msg.numRows())).toBeInTheDocument();
      userEvent.type(screen.getByLabelText(Msg.numRows()), "{backspace}7");
      expect(screen.getByLabelText(Msg.numRows())).toHaveValue(7)
    });

    it("lets users set if player 1 is a bot", () => {
      expect(screen.queryByText(Msg.settings())).toBeInTheDocument(); // ansonsten sind Einstellungen hidden; das ist ja leider bei vererbung nicht mit toBeVisible() testbar! - entweder bug oder feature ;-)
      expect(screen.getByLabelText(Msg.botPlaying(0))).not.toBeChecked();
      userEvent.click(screen.getByLabelText(Msg.botPlaying(0)));
      expect(screen.getByLabelText(Msg.botPlaying(0))).toBeChecked();
    })

    it("lets users set if player 2 is a bot", () => {
      expect(screen.getByLabelText(Msg.botPlaying(1))).toBeChecked();
      userEvent.click(screen.getByLabelText(Msg.botPlaying(1)));
      expect(screen.getByLabelText(Msg.botPlaying(1))).not.toBeChecked();
    });

  })

  it.only(
    "wenn gerade kein Spiel laeuft und in den Einstellungen 6 als Anzahl der " +
    "Zeilen eingegeben wird ist bei beliebigen anderen Einstellungen eine " +
    "Sekunde spaeter die Anzahl der Checkboxen im Brett (6 * 7 / 2 = 21)", async () => {

    expect(screen.queryByText("Einstellungen ...")).toBeInTheDocument();
    enterSettings();
    expect(screen.queryByText("Einstellungen")).toBeInTheDocument(); // ansonsten sind Einstellungen hidden; das ist ja leider bei vererbung nicht mit toBeVisible() testbar! - entweder bug oder feature ;-)
    userEvent.type(screen.getByLabelText(/Zeilen/), "{backspace}6");
    expect(screen.getByLabelText(/Zeilen/)).toHaveValue(6);
    await sleep(1000);
    const board = screen.getByTestId("board");
    const allCheckboxes = queryAllByRole(board, "checkbox");
    expect(allCheckboxes).toHaveLength(6 * 7 / 2);
  })

  it("lets users start a new game with previously selected settings", () => {
    enterSettings();
    userEvent.type(screen.getByLabelText(/Zeilen/), "{backspace}6");
    expect(screen.getByLabelText(/Zeilen/)).toHaveValue(6);
    userEvent.click(screen.getByText(/start/i));
    throw Error("nyi");
  });

  it("shows the not-allowed cursor on checked segments", () => {
    throw Error("nyi");
  });

  describe("when it's a human player's turn", () => {

    beforeEach(() => {
      console.log("when it's a human player's turn - beforeEach");

    })

    it(
      "shows the pointer cursor on unchecked segments until a " +
      "box in an unchecked segment is clicked and selected as start of the range to be checked", () => {
      throw Error("nyi");
    });

    it ("highlights the segment containing the start checkbox", () => {
      throw Error("nyi")
    })

  })


  it ("highlights the changed segment during a bot move", () => {
    throw Error("nyi");
  })




});
