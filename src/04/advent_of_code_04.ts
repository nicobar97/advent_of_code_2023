import { readFile } from "../utils/utils";

type Game = {
  cards: Card[];
  cardsAmount: CardsAmount;
};

type Card = {
  id: number;
  winningNumbers: number[];
  numbers: number[];
};

type CardsAmount = {
  [cardId: number]: number;
};

export const adventOfCode04Part1 = async () => {
  const inputData = await readFile("./src/04/data/input");

  const cards: Card[] = parseData(inputData);

  const cardsTotalScore = cards
    .map((card) => getCardScore(card))
    .reduce((a, b) => a + b, 0);

  console.log(`TOTAL CARDS SCORE: ${cardsTotalScore}`);
};

export const adventOfCode04Part2 = async () => {
  const inputData = await readFile("./src/04/data/input_sample");

  const cards: Card[] = parseData(inputData);

  const game: Game = cards.reduce(
    (game, card) => ({
      cards: game.cards,
      cardsAmount: increaseAmountOfCards(
        game.cardsAmount,
        card.id,
        getMatchingNumbers(card)
      ),
    }),
    {
      cards,
      cardsAmount: initCardsAmount(cards),
    }
  );

  const totalCards = getGameCardsTotal(game);

  console.log(`TOTAL CARDS AFTER DRAFT: ${totalCards}`);
};

const parseData = (raw: string): Card[] =>
  raw.split("\n").map((line) => parseCardRow(line));

const parseCardRow = (rowLine: string): Card => ({
  id: Number(rowLine.split(":")[0].replace("Card", "").trim()),
  winningNumbers: rowLine
    .split(":")[1]
    .split("|")[0]
    .split(" ")
    .map((rawNumber) => parseInt(rawNumber))
    .filter((it) => !isNaN(it)),
  numbers: rowLine
    .split(":")[1]
    .split("|")[1]
    .split(" ")
    .map((rawNumber) => parseInt(rawNumber))
    .filter((it) => !isNaN(it)),
});

const initCardsAmount = (cards: Card[]): CardsAmount =>
  cards.reduce((cardsAmount, card) => ({ ...cardsAmount, [card.id]: 1 }), {});

const increaseAmountOfCards = (
  cardsAmount: CardsAmount,
  winningCardId: number,
  winningOccurrences: number
): CardsAmount => {
  const updatedCardsAmount = { ...cardsAmount };
  const winningCardAmount = updatedCardsAmount[winningCardId];

  console.log(
    `Card ${winningCardId} has ${winningOccurrences} winning numbers and in quantity ${cardsAmount[winningCardId]}:`
  );

  [...Array(winningOccurrences)].forEach((_, i) => {
    const cardId = winningCardId + i + 1;
    updatedCardsAmount[cardId] = winningCardAmount + 1 * cardsAmount[cardId];
    console.log(
      `Updating Card ${cardId} from ${winningCardAmount} to ${updatedCardsAmount[cardId]} quantity`
    );
  });

  return updatedCardsAmount;
};

const getMatchingNumbers = (card: Card): number =>
  card.winningNumbers.filter((winningNumber) =>
    card.numbers.includes(winningNumber)
  ).length;

const getCardScore = (card: Card): number =>
  card.numbers.filter((number) => card.winningNumbers.includes(number)).length;

const getGameCardsTotal = (game: Game): number =>
  Object.values(game.cardsAmount).reduce(
    (totalCards, cardAmount) => totalCards + cardAmount,
    0
  );
