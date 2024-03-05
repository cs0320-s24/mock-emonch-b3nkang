import { Dispatch, SetStateAction, useState } from "react";
import "../styles/main.css";
import { ControlledInput } from "./ControlledInput";
import { commandHandlers } from "./CommandHandlers";

/**
 * an interface of all the props necessary to run REPLInput and their typings
 */
interface REPLInputProps {
  history: (string | JSX.Element)[];
  setHistory: Dispatch<SetStateAction<(string | JSX.Element)[]>>;
  mode: string;
  setMode: Dispatch<SetStateAction<string>>;
  setCurrentDataset: Dispatch<SetStateAction<string[][]>>;
  currentDataset: string[][];
}

// Mocked datasets
const mockedDatasets = {
  path1: [
    ["Column1", "Column2", "Column3"],
    ["Row1Cell1", "Row1Cell2", "Row1Cell3"],
    ["Row2Cell1", "Row2Cell2", "Row2Cell3"],
  ],
  path2: [
    ["Header1", "Header2", "Header3"],
    ["Data1", "Data2", "Data3"],
    ["Data4", "Data5", "Data6"],
    ["Data4", "Data7", "Data6"],
  ],
};

// // Function to render an HTML table from the dataset
// function renderTable(dataset: string[][]) {
//   return (
//     <table>
//       <tbody>
//         {dataset.map((row, rowIndex) => (
//           <tr key={rowIndex}>
//             {row.map((cell, cellIndex) => (
//               <td key={cellIndex}>{cell}</td>
//             ))}
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// } // i moved this to CommandHandlers

/**
 * the REPLInput component
 *
 * @param param0 the set of props taken in by REPLInput
 * @returns the component itself
 */
export default function REPLInput({
  history,
  setHistory,
  mode,
  setMode,
  setCurrentDataset,
  currentDataset,
}: REPLInputProps) {
  const [commandString, setCommandString] = useState("");

  const context = {
    setHistory,
    setCurrentDataset,
    setMode,
    currentMode: mode,
    mockedDatasets,
    currentDataset,
  };

  /**
   * A function to handle what happens after the submit button is pressed
   *
   * @param commandString the raw string input from the input form
   */
  function handleSubmit(commandString: string) {
    const trimmedCommand = commandString.trim().toLowerCase();
    const [command, ...args] = trimmedCommand.split(" ");

    if (Object.hasOwnProperty.call(commandHandlers, command)) {
      const handler = commandHandlers[command as keyof typeof commandHandlers];
      const result = handler(args, context);

      if (Array.isArray(result)) {
        setHistory((prevHistory) => [...prevHistory, ...result.flat()]);
      } else {
        setHistory((prevHistory) => [...prevHistory, result]);
      }
    } else {
      const isVerbose = mode === "verbose";
      setHistory((prevHistory) => [
        ...prevHistory,
        isVerbose
          ? `Command: ${command}\nOutput: Unknown command`
          : `Unknown command: ${command}`,
      ]);
    }

    setCommandString("");
  }

  return (
    <div className="repl-input">
      <fieldset>
        <legend>Enter a command:</legend>
        <ControlledInput
          value={commandString}
          setValue={setCommandString}
          ariaLabel={"Command input"}
        />
      </fieldset>
      <button onClick={() => handleSubmit(commandString)}>
        Submit Command
      </button>
      {/* <div>Commands submitted: {count}</div> */}
    </div>
  );
}

// // pre-user story 6 implementation
// export function REPLInput({
//   history,
//   setHistory,
//   mode,
//   switchMode,
//   setCurrentDataset,
//   currentDataset,
// }: REPLInputProps) {
//   const [commandString, setCommandString] = useState<string>("");
//   const [count, setCount] = useState<number>(0);

// // Function to search dataset based on column and value
// function searchDataset(column, value, isVerbose = false) {
//   const columnIndex = isNaN(column)
//     ? currentDataset[0]
//         .map((colName) => colName.toLowerCase())
//         .indexOf(column.toLowerCase())
//     : parseInt(column);

//   if (columnIndex === -1 || columnIndex >= currentDataset[0].length) {
//     const errorMessage = isVerbose
//       ? `Command: search ${column} ${value}\nOutput: Error: Column "${column}" not found`
//       : `Error: Column "${column}" not found`;
//     setHistory([...history, errorMessage]);
//     return;
//   }

//   const filteredRows = currentDataset.filter((row, index) => {
//     return (
//       index !== 0 &&
//       row[columnIndex].toString().toLowerCase().includes(value.toLowerCase())
//     );
//   });

//   if (filteredRows.length === 0) {
//     const noResultsMessage = isVerbose
//       ? `Command: search ${column} ${value}\nOutput: No results found for "${value}" in column "${column}"`
//       : `No results found for "${value}" in column "${column}"`;
//     setHistory([...history, noResultsMessage]);
//   } else {
//     if (isVerbose) {
//       const searchResultsMessage = `Command: search ${column} ${value}\nOutput:`;
//       setHistory([
//         ...history,
//         searchResultsMessage,
//         ...filteredRows.map((row) => row.join(" ")),
//       ]);
//     } else {
//       setHistory([...history, ...filteredRows.map((row) => row.join(" "))]);
//     }
//   }
// }

//   function handleSubmit(commandString: string) {
//     const trimmedCommand = commandString.trim().toLowerCase();
//     setCount(count + 1);

//     const args = trimmedCommand.split(" ");
//     const command = args[0];
// const isVerbose = mode === "verbose";

// if (command === "load_file") {
//   const filePath = args[1];
//   if (mockedDatasets[filePath]) {
//     setCurrentDataset(mockedDatasets[filePath]);
//     const loadFileMessage = isVerbose
//       ? `Command: load_file ${filePath}\nOutput: Loaded dataset from ${filePath}`
//       : `Loaded dataset from ${filePath}`;
//     setHistory([...history, loadFileMessage]);
//   } else {
//     const errorMessage = isVerbose
//       ? `Command: load_file ${filePath}\nOutput: Error - File not found at ${filePath}.`
//       : `Error: File not found at ${filePath}`;
//     setHistory([...history, errorMessage]);
//   }
// } else if (command === "mode") {
//   switchMode();
//   const modeSwitchMessage = `Switched to ${
//     mode === "brief" ? "verbose" : "brief"
//   } mode`;
//   setHistory([...history, modeSwitchMessage]);
// } else if (command === "view") {
//       const tableJSX = renderTable(currentDataset);
//       if (isVerbose) {
//         setHistory([
//           ...history,
//           <>
//             Command: view
//             <br />
//             Output: {tableJSX}
//           </>,
//         ]);
//       } else {
//         setHistory([...history, tableJSX]);
//       }
//     } else if (command === "search" && args.length >= 3) {
//       const column = args[1];
//       const value = args.slice(2).join(" ");
//       if (isVerbose) {
//         searchDataset(column, value, true);
//       } else {
//         searchDataset(column, value);
//       }
//     } else {
//       const output = trimmedCommand;
//       setHistory([...history, output]);
//     }
//     setCommandString(""); // Clear the input field after submission
//   }

//   return (
//     <div className="repl-input">
//       <fieldset>
//         <legend>Enter a command:</legend>
//         <ControlledInput
//           value={commandString}
//           setValue={setCommandString}
//           ariaLabel={"Command input"}
//         />
//       </fieldset>
//       <button onClick={() => handleSubmit(commandString)}>
//         Submit Command
//       </button>
//       <div>Commands submitted: {count}</div>
//     </div>
//   );
// }
