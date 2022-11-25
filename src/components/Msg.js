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
  mightWin: (player:number): string =>
    `Computer ${player + 1}: Könnte gut sein, dass ich diese Runde gewinne... ;-)`,

}

export default Msg;
