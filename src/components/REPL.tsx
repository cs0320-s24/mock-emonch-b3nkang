import { useState } from "react";
import "../styles/main.css";
import { REPLHistory } from "./REPLHistory";
import { REPLInput } from "./REPLInput";

export default function REPL() {
  const [history, setHistory] = useState<string[]>([]);
  const [mode, setMode] = useState('brief'); // Added mode state

  // Function to toggle between 'brief' and 'verbose' modes
  const switchMode = () => {
    setMode(mode === 'brief' ? 'verbose' : 'brief');
  };

  return (
    <div className="repl">
      <REPLHistory history={history} />
      <hr></hr>
      <REPLInput history={history} setHistory={setHistory} mode={mode} switchMode={switchMode} />
    </div>
  );
}
