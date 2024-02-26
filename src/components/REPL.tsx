import { useState } from "react";
import "../styles/main.css";
import { REPLHistory } from "./REPLHistory";
import { REPLInput } from "./REPLInput";

export default function REPL() {
  const [history, setHistory] = useState<(string | JSX.Element)[]>([]);
  const [mode, setMode] = useState('brief');
  const [currentDataset, setCurrentDataset] = useState<string[][]>([]);

  const switchMode = () => {
    setMode(mode === 'brief' ? 'verbose' : 'brief');
  };

  return (
    <div className="repl">
      <REPLHistory history={history} />
      <hr></hr>
      <REPLInput 
        history={history} 
        setHistory={setHistory} 
        mode={mode} 
        switchMode={switchMode} 
        setCurrentDataset={setCurrentDataset} 
        currentDataset={currentDataset} />
    </div>
  );
}
