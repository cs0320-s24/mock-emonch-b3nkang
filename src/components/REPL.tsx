import { useState } from "react";
import "../styles/main.css";
import { REPLHistory } from "./REPLHistory";
import REPLInput from "./REPLInput";

/**
 * The component forming the REPL of the mock, including the input and the history
 *
 * @returns the REPL component
 */
export default function REPL() {
  const [history, setHistory] = useState<(string | JSX.Element)[]>([]);
  const [mode, setMode] = useState("brief");
  const [currentDataset, setCurrentDataset] = useState<string[][]>([]);

  return (
    <div className="repl">
      <REPLHistory history={history} />
      <hr></hr>
      <REPLInput
        history={history}
        setHistory={setHistory}
        mode={mode}
        setMode={setMode}
        setCurrentDataset={setCurrentDataset}
        currentDataset={currentDataset}
      />
    </div>
  );
}
