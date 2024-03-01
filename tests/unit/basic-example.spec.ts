/*
  Demo: test ordinary Java/TypeScript
*/

/* NOTE: USE npm run test:unit */

import { expect, test } from "vitest";
import { commandHandlers } from "../../src/components/CommandHandlers";
import {} from "../../src/components/CommandHandlers";

// all exports from main will now be available as main.X
// import * as main from '../mock/src/main';
import * as main from "../../src/main";

test("is 1 + 1 = 2?", () => {
  expect(1 + 1).toBe(2);
});

// Notice how you can test vanilla TS functions using Playwright as well!
test("main.zero() should return 0", () => {
  expect(main.zero()).toBe(0);
});

/**
 * basic test for mode
 */
test("mode command", async ({}) => {
  const context = {
    setHistory: () => {},
    setMode: (newMode) => (context.currentMode = newMode),
    currentMode: "brief",
  };

  const verboseResult = commandHandlers.mode([], context);
  expect(context.currentMode).toBe("verbose");
  const briefResult = commandHandlers.mode([], context);
  expect(context.currentMode).toBe("brief");
});

/**
 * test load with valid filepath
 */
test("load command with valid filepath", async ({}) => {
  const args = ["path1"];
  const context = {
    mockedDatasets: { path1: [["bye"], ["byebye"]] },
    setCurrentDataset: () => {},
    setHistory: () => {},
    currentMode: "brief",
  };

  const result = commandHandlers.load_file(args, context);
  expect(result).toContain("Loaded dataset from path1");
});

/**
 * test load with invalid filepath
 */
test("load command with invalid file path", async ({}) => {
  const args = ["hi"];
  const context = {
    mockedDatasets: { path1: [["bye"], ["byebye"]] },
    setCurrentDataset: () => {},
    setHistory: () => {},
    currentMode: "brief",
  };

  const result = commandHandlers.load_file(args, context);
  expect(result).toContain("Error: File not found at hi");
});

/**
 * test view with load already called
 */
test("view command with loading data", async ({}) => {
  const context = {
    mockedDatasets: { path1: [["viewbye"], ["viewbyeviewbye"]] },
    setCurrentDataset: (dataset) => (context.currentDataset = dataset),
    setHistory: () => {},
    currentMode: "brief",
    currentDataset: [],
  };

  commandHandlers.load_file(["path1"], context);
  const viewResult = commandHandlers.view([], context);
  console.log(viewResult);
  // expect(viewResult).toContain("Header1");
  // expect(viewResult).toContain("Data1");
  expect(JSON.stringify(viewResult)).toContain("viewbye");
  expect(JSON.stringify(viewResult)).toContain("viewbyeviewbye");
});

/**
 * test view with load not called
 */
test("view command without loading data", async ({}) => {
  const context = {
    mockedDatasets: { path1: [["viewbye"], ["viewbyeviewbye"]] },
    setCurrentDataset: (dataset) => (context.currentDataset = dataset),
    setHistory: () => {},
    currentMode: "brief",
    currentDataset: [],
  };

  // commandHandlers.load_file(["path1"], context);
  const viewResult = commandHandlers.view([], context);
  console.log(viewResult);
  expect(JSON.stringify(viewResult)).toContain("Error: dataset not loaded");
  expect(JSON.stringify(viewResult)).not.toContain("viewbyeviewbye");
});

/**
 * test search with load already called
 */
test("search command with loading data", async ({}) => {
  const context = {
    mockedDatasets: {
      path1: [
        ["Fee", "Fi"],
        ["Fo", "Fum"],
        ["Ho", "Hum"],
      ],
    },
    setCurrentDataset: (dataset) => (context.currentDataset = dataset),
    setHistory: () => {},
    currentMode: "brief",
    currentDataset: [],
  };

  commandHandlers.load_file(["path1"], context);
  const searchArgs = ["Fee", "Ho"];
  const searchResult = commandHandlers.search(searchArgs, context);
  const resultString = JSON.stringify(searchResult);

  expect(resultString).toContain("Ho");
  expect(resultString).toContain("Hum");

  const negativeSearchArgs = ["Fee", "NonExistentData"];
  const negativeSearchResult = commandHandlers.search(
    negativeSearchArgs,
    context
  );
  const negativeResultString = JSON.stringify(negativeSearchResult);

  expect(negativeResultString).not.toContain("Ho");
  expect(negativeResultString).not.toContain("Fo");
  expect(negativeResultString).toContain("No results found for");
});

/**
 * test search with load not called
 */
test("search command without loading data", async ({}) => {
  const context = {
    mockedDatasets: {
      path1: [
        ["Fee", "Fi"],
        ["Fo", "Fum"],
        ["Ho", "Hum"],
      ],
    },
    setCurrentDataset: (dataset) => (context.currentDataset = dataset),
    setHistory: () => {},
    currentMode: "brief",
    currentDataset: [],
  };

  // commandHandlers.load_file(["path1"], context);
  const searchArgs = ["Fee", "Ho"];
  const searchResult = commandHandlers.search(searchArgs, context);
  const resultString = JSON.stringify(searchResult);

  expect(resultString).not.toContain("Ho");
  expect(resultString).not.toContain("Hum");
  expect(resultString).toContain("Error: dataset not loaded for search");

  const negativeSearchArgs = ["Fee", "NonExistentData"];
  const negativeSearchResult = commandHandlers.search(
    negativeSearchArgs,
    context
  );
  const negativeResultString = JSON.stringify(negativeSearchResult);

  expect(negativeResultString).not.toContain("Ho");
  expect(negativeResultString).not.toContain("Fo");
  expect(negativeResultString).toContain(
    "Error: dataset not loaded for search"
  );
});
