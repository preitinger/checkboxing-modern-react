import { queryAllByRole, render, screen, within, act, fireEvent } from '@testing-library/react';
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
  return userEvent.click(screen.getByText(Msg.sideButtonLabel(Msg.settings(), true)));
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function actSleep(ms) {
  await act(() => {
    return sleep(ms);
  })

}


describe("App", () => {
  beforeEach(() => {
    console.log("App.beforeEach");
    // Funktioniert leider nicht richtig im Zusammenhang mit asynchronen Testfunktionen:
    // jest.useFakeTimers()
    return render(<App/>);

  })
  describe("when editing settings", () => {
    beforeEach(() => {
      console.log("when editing settings - beforeEach");
      enterSettings();
    })
    it("lets users set number of rows", () => {
      // enterSettings();
      expect(screen.queryByText(Msg.sideButtonLabel(Msg.settings(), false))).toBeInTheDocument(); // ansonsten sind Einstellungen hidden; das ist ja leider bei vererbung nicht mit toBeVisible() testbar! - entweder bug oder feature ;-)
      const zeilenElem = screen.getByLabelText(Msg.numRows());
      expect(screen.getByLabelText(Msg.numRows())).toBeVisible();
      expect(screen.getByLabelText(Msg.numRows())).toBeInTheDocument();
      userEvent.type(screen.getByLabelText(Msg.numRows()), "{backspace}7");
      expect(screen.getByLabelText(Msg.numRows())).toHaveValue(7)
    });

    it("lets users set if player 1 is a bot", () => {
      // screen.debug();
      expect(screen.queryByText(Msg.sideButtonLabel(Msg.settings(), false)))
      .toBeInTheDocument(); // ansonsten sind Einstellungen hidden; das ist ja leider bei vererbung nicht mit toBeVisible() testbar! - entweder bug oder feature ;-)
      expect(screen.getByLabelText(Msg.botPlaying(0)))
      .not.toBeChecked();
      userEvent.click(screen.getByLabelText(Msg.botPlaying(0)));
      expect(screen.getByLabelText(Msg.botPlaying(0))).toBeChecked();
    })

    it("lets users set if player 2 is a bot", () => {
      expect(screen.getByLabelText(Msg.botPlaying(1))).toBeChecked();
      userEvent.click(screen.getByLabelText(Msg.botPlaying(1)));
      expect(screen.getByLabelText(Msg.botPlaying(1))).not.toBeChecked();
    });

  })

  it(
    "wenn gerade kein Spiel laeuft und in den Einstellungen 6 als Anzahl der " +
    "Zeilen eingegeben wird ist bei beliebigen anderen Einstellungen eine " +
    "Sekunde spaeter die Anzahl der Checkboxen im Brett (6 * 7 / 2 = 21)", async () => {

    expect(screen.queryByText(Msg.sideButtonLabel(Msg.settings(), true))).toBeInTheDocument();
    enterSettings();
    expect(screen.queryByText(Msg.sideButtonLabel(Msg.settings(), false))).toBeInTheDocument(); // ansonsten sind Einstellungen hidden; das ist ja leider bei vererbung nicht mit toBeVisible() testbar! - entweder bug oder feature ;-)
    await act(() => {
      userEvent.type(screen.getByLabelText(Msg.numRows()), "{backspace}6");
    });
    expect(screen.getByLabelText(Msg.numRows())).toHaveValue(6);
    await actSleep(1000);
    const board = screen.getByTestId("board");
    const allCheckboxes = queryAllByRole(board, "checkbox");
    expect(allCheckboxes).toHaveLength(6 * 7 / 2);
  })

  it("lets users start a new game with previously selected settings",
  async () => {
    userEvent.click(screen.getByText(Msg.startGame()));
    const board = screen.getByTestId("board");
    {
      const allCheckboxes = queryAllByRole(board, "checkbox");
      expect(allCheckboxes).toHaveLength(5 * 6 / 2);

    }

    expect(screen.queryByText(Msg.sideButtonLabel(Msg.settings(), true))).toBeInTheDocument();
    await enterSettings();

    userEvent.type(screen.getByLabelText(Msg.numRows()), "{backspace}6");
    await actSleep(1000);
    expect(screen.getByLabelText(Msg.numRows())).toHaveValue(6);
    userEvent.click(screen.getByLabelText(Msg.botPlaying(0))) // toggle from bot off to bot on
    userEvent.click(screen.getByLabelText(Msg.botPlaying(1))) // toggle from bot on to bot off

    userEvent.click(screen.getByText(Msg.startGame()));
    expect(await screen.findByText(Msg.botsTurn())).toBeInTheDocument();
    {
      const allCheckboxes = queryAllByRole(board, "checkbox");
      expect(allCheckboxes).toHaveLength(6 * 7 / 2);
    }

    userEvent.type(screen.getByLabelText(Msg.numRows()), "{backspace}7");
    expect(screen.getByLabelText(Msg.numRows())).toHaveValue(7);
    userEvent.click(screen.getByLabelText(Msg.botPlaying(0))) // toggle from bot on to bot off

    userEvent.click(screen.getByText(/start/i));
    expect(await screen.findByText(Msg.humanNrsTurn(0))).toBeInTheDocument();
    {
      const allCheckboxes = queryAllByRole(board, "checkbox");
      expect(allCheckboxes).toHaveLength(7 * 8 / 2);
      userEvent.click(allCheckboxes[0]); // Anfang des Bereichs (Zug des Spielers 1 (bzw. intern 0) beginnt)
      userEvent.click(allCheckboxes[0]); // Ende des Bereichs, damit Zug des ersten Spielers zuende
      expect(await screen.findByText(Msg.humanNrsTurn(1))).toBeInTheDocument();
    }

    userEvent.click(screen.getByLabelText(Msg.botPlaying(0))); // Bot[0] aktiv
    userEvent.click(screen.getByLabelText(Msg.botPlaying(1))); // Bot[1] aktiv

    userEvent.click(screen.getByText(/start/i));
    expect(await screen.findByText(Msg.botNrsTurn(0))).toBeInTheDocument();

    // throw Error("nyi");
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

  it.only ("provides splitter between side panel and board", async () => {
    // console.log("provides splitter starting...");
    await act(async () => {
      const splitter = screen.getByTestId("sidePanelSplitter");
      const left = screen.getByTestId("left");
      console.log("before: left.style.width=", left.style.width);
      fireEvent.mouseDown(splitter);
      await sleep(1000);
      fireEvent.mouseMove(splitter, { clientX: 100, clientY: 100 });
      await sleep(1000);
      fireEvent.mouseUp(splitter);
      // user.mouseMove
    })
  })


});
