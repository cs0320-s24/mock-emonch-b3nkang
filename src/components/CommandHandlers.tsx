import { Dispatch, SetStateAction } from "react";
import { REPLFunction } from "./REPLFunction";

/**
 * A method that renders an HTML table, given a parsed sheet
 *
 * @param dataset the parsed sheet
 * @returns the HTML table
 */
function renderTable(dataset: string[][]) {
  return (
    <table>
      <tbody>
        {dataset.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/**
 * a handler for the 'load' command
 *
 * @param args the parameter provided alongside 'load_file' command in the REPL
 * @param param1 a set of all the params we want to extract from the `context` interface to use
 * @returns a message to be added into history
 */
const load: REPLFunction = (
  args,
  { mockedDatasets, setCurrentDataset, setHistory, currentMode }
) => {
  const [filePath] = args;
  const dataset = mockedDatasets[filePath];
  const isVerbose = currentMode === "verbose";

  if (dataset) {
    setCurrentDataset(dataset);
    return isVerbose
      ? `Command: load_file ${filePath}\nOutput: Loaded dataset from ${filePath}`
      : `Loaded dataset from ${filePath}`;
  } else {
    return isVerbose
      ? `Command: load_file ${filePath}\nOutput: Error - File not found at ${filePath}.`
      : `Error: File not found at ${filePath}`;
  }
};

/**
 * a handler for the 'mode' command
 *
 * @param args the parameter provided alongside 'mode' command in the REPL (none here, hence why arg not used)
 * @param param1 a set of all the params we want to extract from the `context` interface to use
 * @returns a message to be added into history
 */
const mode: REPLFunction = (args, { currentMode, setMode }) => {
  const newMode = currentMode === "brief" ? "verbose" : "brief";
  setMode(newMode);
  return `Command: mode\nOutput: Switched to ${newMode} mode`;
};

/**
 * a handler for the 'view' command
 *
 * @param args the parameter provided alongside 'view' command in the REPL (none here, hence why arg not used)
 * @param param1 a set of all the params we want to extract from the `context` interface to use
 * @returns a message to be added into history
 */
const view: REPLFunction = (args, { currentDataset, currentMode }) => {
  console.log("View command executed", { currentDataset, currentMode });
  const tableJSX = renderTable(currentDataset);
  const isVerbose = currentMode === "verbose";

  if (isVerbose) {
    return (
      <>
        <div>Command: view</div>
        <div>Output: {tableJSX}</div>
      </>
    );
  } else {
    return tableJSX;
  }
};

/**
 * a handler for the 'search' command
 *
 * @param args the parameters provided alongside 'search' command in the REPL (i.e. column and search value here)
 * @param param1 a set of all the params we want to extract from the `context` interface to use (with explicit typing to satisfy typescript here)
 * @returns a message to be added into history
 */
const search: REPLFunction = (
  args,
  {
    currentDataset,
    setHistory,
    currentMode,
  }: {
    currentDataset: string[][];
    setHistory: Dispatch<SetStateAction<(string | JSX.Element)[]>>;
    currentMode: string;
  }
) => {
  const [column, ...valueParts] = args;
  const value = valueParts.join(" ");
  const isVerbose = currentMode === "verbose";

  const columnIndex = isNaN(Number(column))
    ? currentDataset[0]
        .map((colName) => colName.toLowerCase())
        .indexOf(column.toLowerCase())
    : parseInt(column);
  if (columnIndex === -1 || columnIndex >= currentDataset[0].length) {
    return isVerbose
      ? `Command: search ${column} ${value}\nOutput: Error: Column "${column}" not found`
      : `Error: Column "${column}" not found`;
  }
  const filteredRows = currentDataset.filter(
    (row, index) =>
      index !== 0 &&
      row[columnIndex].toString().toLowerCase().includes(value.toLowerCase())
  );
  if (filteredRows.length === 0) {
    return isVerbose
      ? `Command: search ${column} ${value}\nOutput: No results found for "${value}" in column "${column}"`
      : `No results found for "${value}" in column "${column}"`;
  } else {
    const formattedResults = filteredRows.map((row) => row.join(" "));
    return isVerbose
      ? [`Command: search ${column} ${value}\nOutput:`, ...formattedResults]
      : formattedResults;
  }
};

export const commandHandlers = {
  load_file: load,
  mode: mode,
  view: view,
  search: search,
};
