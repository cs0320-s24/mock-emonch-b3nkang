import { Dispatch, SetStateAction, useState } from "react";
import "../styles/main.css";
import { ControlledInput } from "./ControlledInput";

interface REPLInputProps {
  history: (string | JSX.Element)[];
  setHistory: Dispatch<SetStateAction<(string | JSX.Element)[]>>;
  mode: string;
  switchMode: () => void;
  setCurrentDataset: Dispatch<SetStateAction<string[][]>>;
  currentDataset: string[][];
}

// Mocked datasets 
const mockedDatasets = {
  "/path/to/dataset1.csv": [
    ["Column1", "Column2", "Column3"],
    ["Row1Cell1", "Row1Cell2", "Row1Cell3"],
    ["Row2Cell1", "Row2Cell2", "Row2Cell3"],
  ],
  "/path/to/dataset2.csv": [
    ["Header1", "Header2", "Header3"],
    ["Data1", "Data2", "Data3"],
    ["Data4", "Data5", "Data6"],
    ["Data4", "Data7", "Data6"],
  ],
};

// Function to render an HTML table from the dataset
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

export function REPLInput({ history, setHistory, mode, switchMode, setCurrentDataset, currentDataset }: REPLInputProps) {
  const [commandString, setCommandString] = useState<string>("");
  const [count, setCount] = useState<number>(0);

  // Function to search dataset based on column and value
  function searchDataset(column, value) {
    const columnIndex = isNaN(column)
      ? currentDataset[0].map(colName => colName.toLowerCase()).indexOf(column.toLowerCase())
      : parseInt(column);

    if (columnIndex === -1 || columnIndex >= currentDataset[0].length) {
      setHistory([...history, `Error: Column "${column}" not found`]);
      return;
    }

    const filteredRows = currentDataset.filter((row, index) => {
      return index !== 0 && row[columnIndex].toString().toLowerCase().includes(value.toLowerCase());
    });

    if (filteredRows.length === 0) {
      setHistory([...history, `No results found for "${value}" in column "${column}"`]);
    } else {
      // Render the matching rows without the header
      setHistory([...history, ...filteredRows.map((row) => row.join(' '))]);
    }
  }

  
  function handleSubmit(commandString: string) {
    const trimmedCommand = commandString.trim().toLowerCase();
    setCount(count + 1);

    const args = trimmedCommand.split(" ");
    if (args[0] === "load_file") {
      const filePath = args[1]; // Extract file path from the command
      if (mockedDatasets[filePath]) {
        setCurrentDataset(mockedDatasets[filePath]); // Set the current dataset based on the file path
        const loadFileMessage = `Loaded dataset from ${filePath}`;
        setHistory([...history, loadFileMessage]);
      } else {
        setHistory([...history, `Error: File not found at ${filePath}`]);
      }
    } else if (trimmedCommand === "mode") {
      switchMode();
      const modeSwitchMessage = `Switched to ${mode === 'brief' ? 'verbose' : 'brief'} mode`;
      setHistory([...history, modeSwitchMessage]);
    } else if (trimmedCommand === "view") {
      const tableJSX = renderTable(currentDataset);
      setHistory([...history, tableJSX]);
    } else if (args[0] === "search" && args.length >= 3) {
      const column = args[1];
      const value = args.slice(2).join(" "); // Support values with spaces
      searchDataset(column, value);
    } else {
      const output = mode === 'verbose'
            ? `Command: ${trimmedCommand}\nOutput: ${trimmedCommand}`
            : trimmedCommand;
      setHistory([...history, output]);
    }
    setCommandString(""); // Clear the input field after submission
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
      <div>
        Commands submitted: {count}
      </div>
    </div>
  );
}

