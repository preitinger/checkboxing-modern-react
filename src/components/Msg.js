// @flow
const Msg = {
  settings: (): string => "Einstellungen",
  forNextGame: (): string => "Für das nächste Spiel",
  numRows: (): string => "Anzahl Zeilen",
  botPlaying: (player:number): string =>
  `Computer spielt für Spieler ${player + 1}`,
  lastWins: () => "Mit letztem Zug gewinnen",
  lastLooses: () => "Mit letztem Zug verlieren",
  forAtOnce: (player:number): string => `Ab sofort für Computer ${player + 1}`,
  priority: () => `Auswahl bei mehreren gleich guten Zügen`,
  animationMs: () => `Dauer der Zuganimation in ms`,
  random: () => "Zufällig",
  short: () => "Möglichst wenig streichen",
  long: () => "Möglichst viel streichen",

  rules: (): string => "Spielregeln",
  rulesContent: () => `
  2 Spieler checken abwechselnd zusammenhängende Abschnitte von Checkboxen
        in einer Zeile. In Zeile 1 befindet sich nur eine Checkbox, in der nächsten eine mehr usw.
        Ein gecheckter Abschnitt darf aus beliebig vielen bisher ungecheckten Checkboxen nebeneinander bestehen.
        Das Spiel endet, wenn alle Checkboxen gecheckt sind.
        Je nach eingestellter Variante verliert oder gewinnt derjenige Spieler,
        der die letzte Checkbox gecheckt hat.`,
  currentVariant: () => "Aktuell gültige Variante: ",
  lastWinsVariant: (lastWins) => (lastWins ? "Letzter Zug gewinnt." : "Letzter Zug verliert."),
  requestStart: () => "Bitte das Spiel mit dem Button Starten.",
  requestMove: () => `Bitte einen Zug machen mit 2 Klicks erst auf den Anfang, dann
                das Ende des zu streichenden Segments. - Und ja, es ist egal ob
                der Anfang links oder rechts ist. ;-)`,

  humansTurn: () => "Du bist dran.",
  humanNrsTurn: (player) => `Spieler ${player + 1} ist dran.`,
  botsTurn: () => "Der Computer ist dran.",
  botNrsTurn: (player) => `Computer ${player + 1} ist dran.`,
  mightWin: (player:number): string =>
    `Computer ${player + 1}: Könnte gut sein, dass ich diese Runde gewinne... ;-)`,
  congratsPlayer: (player: number): string =>
    `Herzlichen Glückwunsch, Spieler ${player + 1}!`,
  humanHasWon: (player:number): string =>
    `Spieler ${player + 1} hat gewonnen.`,
  youHaveWon: (): string => "",
  startGame: () => "Spiel starten",
  sideButtonLabel: (text, isMinified) => (isMinified ? `${text} ...` : text)
}

export default Msg;
